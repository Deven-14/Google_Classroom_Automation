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

module.exports = function (tolerance){

  //fs.unlink("../data_files/Kick_List.csv", (err1) => { if (err1) throw err; });

  // return Promise.resolve("MAking kick list successful!")
  return new Promise((resolve, reject) =>{
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
        if (lapses>(tolerance - 2)){
            kick_list.push([course_id, user_id, lapses].join(","))
        }

    }
    }
    // console.log(kick_list);
    temp = kick_list.join('\n');
    fs.writeFileSync(`../data_files/Kick_List.csv`, temp,{encoding:'utf8',flag:'w'});

    for(var i = 0; i < kick_list.length; ++i)
      kick_list[i] = kick_list[i].split(',');
    resolve(kick_list);
  })
   
}