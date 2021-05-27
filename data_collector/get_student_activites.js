//Given the classroom drive ids and classroom sections this file adds all the activites perfomed in that drive into respective folders
const fs = require("fs");
const {google} = require("googleapis")
const lineReaderSync = require("line-reader-sync");

function getAllData(auth, allFiles, ancestor_name, page_Token) {
  console.log("Me too!");
  return new Promise((resolve, reject) => {
    // console.log("Me 3");
    const drive = google.driveactivity({ version: "v2", auth });
    const params = {
      pageSize: 1000,
      ancestorName: `items/${ancestor_name}`,
      pageToken: page_Token,
    };
    drive.activity.query({ requestBody: params }, (err, res) => {
      if (err) return console.error("The API returned an big error: " + err);
      const activities = res.data.activities;
      if (activities) {
        // console.log("Recent activity:");
        var people_id = [];
        activities.forEach((activity) => {
          var name, title, ppl_id;
          for (var x in activity.targets[0].driveItem) {
            if (x == "title") title = activity.targets[0].driveItem[x];
            if (x == "name") name = activity.targets[0].driveItem[x];
            if (x == "file") break;
          }
          for (x in activity.actors[0].user.knownUser){
            if (x == "personName"){
              ppl_id = activity.actors[0].user.knownUser[x];
            }
      
          }
          // ppl_id = activity.actors[0].user.knownUser.personName
          if (ppl_id != undefined) 
            fs.appendFileSync(
              `../data_files/student_activity_details.txt`,
              `${ppl_id.slice(7)}**${activity.timestamp}**${name}**${title}\n`,
              (err) => {
                if (err) console.log(err);
              }
            );
          //people_id.
        });
      }
      if (res.data.nextPageToken) {
        getAllData(
          auth,
          allFiles,
          ancestor_name,
          res.data.nextPageToken
        ).then((resAllFiles) => {
          resolve(resAllFiles);
        });
      } else {
        resolve(allFiles);
      }
    });
  });
}

module.exports = function(auth) {
  // return Promise.resolve("Get Student Activities Succesful!")
    return new Promise((resolve, reject) => {
  // console.log("Me love mangoes");
  var lrs = new lineReaderSync("../data_files/classroom_details.txt");
  while (true) {
    var data = [];
    var line = lrs.readline();
    if (line == null) break;
    var values = line.split(", ");

    var d = getAllData(auth, data, values[2], "");
    d.then(function () {
      // console.log("Happy! : )");
      resolve("Done and Dusted!")
    });
    // reject("Reject from getStudentActivity")
  }
})
}

