//Given the classroom drive ids and classroom sections this file adds all the activites perfomed in that drive into respective folders
const fs = require("fs");
const {google} = require("googleapis")
const lineReaderSync = require("line-reader-sync");

function getAllData(drive, params) {
  console.log("Me too!");
  var allFiles = [];
  return new Promise(async (resolve, reject) => {
    // console.log("Me 3");
    
    do{

      var getAPagePromise = new Promise((resolve2, reject2) => {

        drive.activity.query({ requestBody: params }, (err, res) => {
          if (err) return console.error("The API returned an big error: " + err);
          const activities = res.data.activities;
          
          if (activities) {
            console.log("Recent activity:");
            var people_id = [];
            activities.forEach((activity) => {
              var name, title, ppl_id;
              
                if (activity.targets[0].driveItem){
                  title = activity.targets[0].driveItem["title"];
                  name = activity.targets[0].driveItem["name"];
                }

                if (activity.actors[0].user.knownUser){
                  ppl_id = activity.actors[0].user.knownUser["personName"];
                }
          
              if (ppl_id != undefined) 
                fs.appendFileSync(
                  `../data_files/student_activity_details.txt`,
                  `${ppl_id.slice(7)}**${activity.timestamp}**${name}**${title}\n`,
                  (err) => {
                    if (err) console.log(err);
                  }
                );
              //people_id.
              //console.log("after if activity");
            });
          }

          resolve2(res.data.nextPageToken);
        });

      });
      
      params.pageToken = await getAPagePromise;

    }while(params.pageToken);

    resolve();
  });
}

module.exports = function(auth, course_teacher_id) {
  // return Promise.resolve("Get Student Activities Succesful!")

  fs.unlink("../data_files/student_activity_details.txt", (err1) => { if (err1) throw err; });

  return new Promise(async (resolve, reject) => {
    var ancestor_name = course_teacher_id;
    const drive = google.driveactivity({ version: "v2", auth });
    const params = {
      pageSize: 1000,
      ancestorName: `items/${ancestor_name}`,
      pageToken: "",
    };
    var data = await getAllData(drive, params);
    resolve();
})
}

