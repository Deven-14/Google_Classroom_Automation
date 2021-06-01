const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const LineReaderSync = require("line-reader-sync")
function Purging(auth, courseId, studentId){
  // const classroom = google.classroom({ version: "v1", auth });
  // classroom.courses.students.delete(
  //   {
  //       courseId: courseId,
  //       userId: studentId,
  //   },
  //   (err, res) => {
  //     if (err){ reject(); console.log("The API returned an error: " + err);}
  //     else {
  //       console.log(`Student ${studentId} deleted!`);
  //       resolve()
  //     }
  //   }
  // );
    console.log(`Student ${studentId} deleted!`)
    return 1
}



module.exports = function run(auth) {
  var count = 0
  return new Promise((resolve, reject)=> {
    // console.log("************************working in purge *******************************")
    var lrs_main = new LineReaderSync("../data_files/Kick_list.csv");
    while (true) {
      var line = lrs_main.readline();
      if (line == null) break;
    // console.log("************************working in purge *******************************")
      var values = line.split(",");
      count += Purging(auth, values[0], values[1])
    }if (count > 0) resolve("students deleted")
  })
}
// console.log(run())