const LineReaderSync = require("line-reader-sync");
const fs = require("fs");


function comparing_dates(recent_date){
    var today_string = (new Date()).toISOString().slice(0,10);
    if(recent_date){
        var diff = Date.parse(today_string) - Date.parse(recent_date);
        return (diff/86400000);
    }
    else
        return 123;
}

function check_consistency(tolerance){
    var kick_list = []
    var lrs = new LineReaderSync(
        `../data_files/final_student_data.csv`
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
        var lapses = comparing_dates(date_strings[0]);
        if (lapses>(tolerance - 1)){
            kick_list.push([course_id, user_id, lapses].join(","))
        }

    }
    }
    console.log(kick_list);
    var file = fs.createWriteStream(`../data_files/Kick_List.csv`
          );
          file.on("error", function (err) {
            console.log(err);
          }); 
          kick_list.forEach(function (v) {
            file.write(v +"\n");
          });
          file.end();
}
check_consistency(3)