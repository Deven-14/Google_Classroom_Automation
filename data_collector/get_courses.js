const {google} = require("googleapis")
const fs = require("fs")

module.exports = function (auth) {
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
        reject()
      }
      const courses = res.data.courses;
      if (courses && courses.length) {
        console.log("Courses:");
        courses.forEach((course) => {
          if (course.name == "FastTrackFop2021"){
            data.push(`${course.name}, ${course.id}, ${course.teacherFolder.id}`)
            fs.appendFileSync(
              "C:/Users/vijay/Desktop/Projects/Srini_Sir/Classroom_Automation/data_files/classroom_details.txt",
              `${course.name}, ${course.id}, ${course.teacherFolder.id}\n`,
              (err1) => {
                if (err1) throw err;
              }
            );
          }
          console.log(`${course.name} ${course.section} (${course.id})`);
        });
       // callback(auth);
        resolve(data);
      } else {
      reject("Fucked")
        console.log("No courses found.");
      }
    }
  );
})
}

