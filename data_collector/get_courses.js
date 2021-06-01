const {google} = require("googleapis")
const fs = require("fs");

module.exports = function (auth) {
  // return Promise.resolve("Get Courses Successful!")

  fs.unlink("../data_files/classroom_details.txt", (err1) => { if (err1) throw err; });

  return new Promise((resolve, reject) => {
  const classroom = google.classroom({ version: "v1", auth });
  var data = [];
  classroom.courses.list(
    {
      pageSize: 10,
    },
    (err, res) => {
      if (err) {
        console.error("The API returned an error: " + err);
        reject("API error");
      }
      const courses = res.data.courses;
      if (courses && courses.length) {
        // console.log("Courses:");
        courses.forEach((course) => {
          if (course.name == "FastTrackFop2021"){
            data.push({ name : course.name,  id : course.id, teacherId : course.teacherFolder.id });
            fs.appendFileSync(
              "../data_files/classroom_details.txt",
              `${course.name}, ${course.id}, ${course.teacherFolder.id}\n`,
              (err1) => {
                if (err1) throw err;
              }
            );
          }
          // console.log(`${course.name} ${course.section} (${course.id})`);
        });
       // callback(auth);
      // console.log("123")
       //resolve(data);
       resolve(data);
      } else {
       reject("No Course Found")
        // console.log("No courses found.");
      }
    }
  );
  })
}

