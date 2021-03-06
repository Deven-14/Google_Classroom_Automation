  
//This file gets the course names, sections, course ids, classroom drive ids of the required courses

const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const getCourses = require("./get_courses")
const getStudents = require("./get_students")
const listDriveActivity = require("./get_student_activites")
const cleanUp = require("./clean_up")
const makeKickList = require("./make_kick_list");
const purge = require("../Purge/purge_it.js")
// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/drive.activity.readonly https://www.googleapis.com/auth/classroom.profile.emails https://www.googleapis.com/auth/classroom.profile.photos https://www.googleapis.com/auth/classroom.rosters https://www.googleapis.com/auth/classroom.rosters.readonly https://www.googleapis.com/auth/classroom.courses.readonly",]
// const SCOPES = [ "https://www.googleapis.com/auth/classroom.profile.emails https://www.googleapis.com/auth/classroom.profile.photos https://www.googleapis.com/auth/classroom.rosters https://www.googleapis.com/auth/classroom.rosters.readonly https://www.googleapis.com/auth/classroom.courses.readonly",];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";

// Load client secrets from a local file.
fs.readFile("credentials.json", (err, content) => {
  if (err) return console.log("Error loading client secret file:", err);
  // Authorize a client with credentials, then call the Google Classroom API.
  authorize(JSON.parse(content), getWorkDone);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving access token", err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err2) => {
        if (err2) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}


function getWorkDone(auth) {

  getCourses(auth)
  .then((msg) => {console.log(msg); return getStudents(auth)},(msg) => console.log(msg))
  .then((msg)=>{ console.log(msg); return listDriveActivity(auth)},(msg)=> console.log(msg))
  .then((msg)=>{ console.log(msg); return cleanUp()},(msg)=> console.log(msg))
  .then((msg)=>{ console.log(msg); return makeKickList(3)},(msg)=> console.log(msg))
  .then((msg)=>{ console.log(msg); return purge()},(msg)=> console.log(msg))
  .then((msg)=>console.log(msg), (msg)=>console.log(msg))

  // getCourses(auth)
  // .then(purge().then((msg)=> console.log(msg)))


  //   const classroom = google.classroom({ version: "v1", auth });
//   classroom.courses.list(
//     {
//       pageSize: 10,
//     },
//     (err, res) => {
//       if (err) return console.error("The API returned an error: " + err);
//       const courses = res.data.courses;
//       if (courses && courses.length) {
//         console.log("Courses:");
//         courses.forEach((course) => {
//           if (course.name == "FastTrackFop2021"){
//             fs.appendFile(
//               "../data_files/classroom_details.txt",
//               `${course.name}, ${course.id}, ${course.teacherFolder.id}\n`,
//               (err1) => {
//                 if (err1) throw err;
//               }
//             );
//           }
//           console.log(`${course.name} ${course.section} (${course.id})`);
//         });
//       } else {
//         console.log("No courses found.");
//       }
//     }
//   );
}