const fs = require("fs");
const { google } = require("googleapis");
const lineReaderSync = require("line-reader-sync");



function getAllData(auth, allFiles, course_id, page_Token) {
  console.log("Me too!");
  return new Promise((resolve, reject) => {
    console.log("Me 3");
    const classes = google.classroom({ version: "v1", auth });
    classes.courses.students.list(
      { courseId: course_id, pageSize: 1000, pageToken: page_Token },
      (err, res) => {
        if (err) return console.error("The API returned an error: " + err);
        const students = res.data.students;
        if (students) {
          console.log("Recent activity:");
          students.forEach((student) => {
            console.log(
              student.userId,
              student.profile.emailAddress,
              student.profile.name.fullName
            );
            fs.appendFileSync(
              `../data_files/student_email_name_id.txt`,
              `${student.userId}**${student.profile.emailAddress}**${student.profile.name.fullName}\n`,
              (err1) => {
                if (err1) console.log(err1);
              }
            );
          });
        }
        if (res.data.nextPageToken) {
          getAllData(
            auth,
            allFiles,
            course_id,
            res.data.nextPageToken
          ).then((resAllFiles) => {
            resolve(resAllFiles);
          });
        } else {
          resolve(allFiles);
        }
      }
    );
  });
}

module.exports = function(auth, /*values*/) {
 return new Promise((resolve, reject) => {
    console.log("Sup");
    const classroom = google.classroom({ version: "v1", auth });
   var lrs = new lineReaderSync("../data_files/classroom_details.txt");
    console.log("Sup2");
   while (true) {
      console.log("Sup3");
//     var data = values
      var data = [];
     var line = lrs.readline();
     console.log(line);
     if (line == null) {console.log("This is breaking cuz file is still empty");break;}
      console.log("Sup4");
      var vals = line.split(", ");
      var d = getAllData(auth, data, vals[1], "");
      d.then(function () {
       resolve("Crazy happy!")
        console.log("Happy! : )");
      });
    }
 })
}