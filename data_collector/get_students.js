const fs = require("fs");
const { google } = require("googleapis");
const lineReaderSync = require("line-reader-sync");


function getAllData(classroom, course_id) {
  console.log("Me too!");
  var allFiles = [];
  var page_Token = "";
  return new Promise(async (resolve, reject) => {
    console.log("Me 3");

    do{
      var getAPagePromise = new Promise((resolve2, reject2) => {

        classroom.courses.students.list(
          { courseId: course_id, pageSize: 1000, pageToken: page_Token },
          (err, res) => {
            if (err) return console.error("The API returned an error: " + err);
            const students = res.data.students;
            if (students) {
              // console.log("Recent activity:");
              students.forEach((student) => {
                //console.log(student.userId, student.profile.emailAddress, student.profile.name.fullName);
                allFiles.push(`${student.userId}**${student.profile.emailAddress}**${student.profile.name.fullName}`);
                fs.appendFileSync(
                  `../data_files/student_email_name_id.txt`,
                  `${student.userId}**${student.profile.emailAddress}**${student.profile.name.fullName}\n`,
                  (err1) => {
                    if (err1) console.log(err1);
                  }
                );
              });
            }
            resolve2(res.data.nextPageToken);
          });

      });

      page_Token = await getAPagePromise;
    
    }while(page_Token);
    
    resolve(allFiles);
  });
}

module.exports = function(auth, course_id) {
  // return Promise.resolve("Get Students Successful!")

  fs.unlink("../data_files/student_email_name_id.txt", (err1) => { if (err1) throw err; });

  return new Promise(async (resolve, reject) => {
    // console.log("Sup");
    const classroom = google.classroom({ version: "v1", auth });
    var data = await getAllData(classroom, course_id);
    resolve(data);
  })
}