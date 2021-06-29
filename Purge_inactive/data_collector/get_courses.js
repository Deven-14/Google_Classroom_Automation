const {google} = require("googleapis")
const fs = require("fs");

module.exports = function (auth) {
  // return Promise.resolve("Get Courses Successful!")

  //fs.unlink("../data_files/classroom_details.txt", (err1) => { if (err1) throw err; });

  return new Promise((resolve, reject) => {
  const classroom = google.classroom({ version: "v1", auth });
  var data = [];
  var allFiles = [];

  classroom.courses.list(
    {
      pageSize: 1000,
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
          //if (course.name == "FastTrackFop2021"){}
            data.push({ name : course.name,  id : course.id, teacherId : course.teacherFolder.id });
            allFiles.push([course.name, course.id, course.teacherFolder.id].join(','));
            
          
          // console.log(`${course.name} ${course.section} (${course.id})`);
        });
       // callback(auth);
      // console.log("123")
       //resolve(data);
       allFiles = allFiles.join('\n');
       fs.writeFileSync(
        "../data_files/classroom_details.txt",
        allFiles,
        {encoding:'utf8',flag:'w'},
        (err1) => {
          if (err1) throw err;
        }
      );

       resolve(data);
      } else {
       reject("No Course Found")
        // console.log("No courses found.");
      }
    }
  );
  })
}

