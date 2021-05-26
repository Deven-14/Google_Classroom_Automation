const LineReaderSync = require("line-reader-sync");
const fs = require("fs");


function comparing_dates(date_strings){
    var today_ts = new Date();
    var today_string = today_ts.toISOString().slice(0,10);
    if(date_strings.length == 0){
        return 123;
    }
    else if(date_strings.length == 1){
        var c = 0
        console.log("Today: ",today_string);
        c = Date.parse(today_string) - Date.parse(date_strings[0]);
        return (c/86400000);
    }
    else if(date_strings.length == 2){
        var c = 0
        c = c + Date.parse(date_strings[0]) - Date.parse(date_strings[1]);
        return (c/86400000);
    }
    else{
        var c = 0
        for(var i =0; i<2; i++){
            diff = Date.parse(date_strings[i]) - Date.parse(date_strings[i+1]);
            c = c + diff  
        }
        c = c + Date.parse(today_string) - Date.parse(date_strings[0]);
        return (c/86400000);
    }
}

function check_consistency(){
    var kick_list = []
    var lrs = new LineReaderSync(
        `final_student_data.csv`
      );
    while (true) {
    var line = lrs.readline();
    if (line === null) {
        break;
    } 
    else {
        var list = line.split("*");
        var course_id = list[0];
        var user_id = list[1]
        var date_strings = list[4].split(",");
        var lapses = comparing_dates(date_strings);
        if (lapses>2){
            kick_list.push([course_id, user_id, lapses].join(","))
        }

    }
    }
    //console.log(kick_list);
    var file = fs.createWriteStream(`Kick_List.csv`
          );
          file.on("error", function (err) {
            console.log(err);
          });
          kick_list.forEach(function (v) {
            file.write(v +"\n");
          });
          file.end();
}
check_consistency()