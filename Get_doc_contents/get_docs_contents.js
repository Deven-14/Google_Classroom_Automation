
const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const { docs } = require("googleapis/build/src/apis/docs");
const { content } = require("googleapis/build/src/apis/content");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/documents.readonly https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.file"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";

// Load client secrets from a local file.
fs.readFile("credentials.json", (err, content) => {
  if (err) return console.log("Error loading client secret file:", err);
  // Authorize a client with credentials, then call the Google Classroom API.
  authorize(JSON.parse(content), get_doc_contents);
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
    redirect_uris
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
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}


function get_doc_contents(auth){
    console.log("Working!")
    const docs = google.docs({version: 'v1', auth})
    docs.documents.get({
        documentId:"1MyeQLXqRHkmdP7QQLUJiKZJnw3IDbqpqTUeqIZf6O-E"
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        console.log(`The title of the document is: ${res.data.title}`);
        total_content = ""
        c = 0
        res.data.body.content.map(line => {
            
            if(line.paragraph){
                if(line.paragraph.elements)
                    line.paragraph.elements.map((element)=>{
                        contents = element.textRun.content
                       if(contents.search("Step 2:")!=-1) c = 1
                       if(contents.search("Step 3:")!=-1) c = 0
                       if(c == 1)
                        if(contents.search("#")!= -1)
                            c = 2
                        if(c == 2)    
                        total_content += contents
                    })
            }
            total_content = total_content.replace("\“", "\"")
            total_content = total_content.replace("\”", "\"")
        })
        fs.writeFileSync("student_code.c",total_content)
      });
}