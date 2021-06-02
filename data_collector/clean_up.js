//This files reads through the student details and sorts it up the required
const LineReaderSync = require("line-reader-sync");
const fs = require("fs");

function clean_it(course_section) {
  var final_list = [];
  var list_line_by_line = [];

  var list_to_be_returned = [];

  var lrs = new LineReaderSync(
    `../data_files/student_activity_details.txt`
  );
  while (true) {
    var line = lrs.readline();
    if (line === null) {
      break;
    } else {
      var list = line.split("**");
      if (
        list[0] != "102641484502798472042" &&
        list[0] != "111808588770635156861" &&
        list[2] != "undefined"
      ) { 
        final_list.push(list);
      }
    }
  }

  final_list.sort(function (a, b) {
    return a[0].localeCompare(b[0]);
  });

  //console.log(final_list);

  var lrs2 = new LineReaderSync(
    `../data_files/student_email_name_id.txt`
  );
  while (true) {
    var line2 = lrs2.readline();
    if (line2 === null) {
      break;
    } else {
      var std_det = line2.split("**"); 
      var student_id = std_det[0];
      var name = std_det[2];
      var email = std_det[1];
      //console.log(student_id);
      var time_stamps = [];
      var non_unique_dates = [];
      var dates = [];
      var final_count = [];
      var total_days = 0;
      for (var i = 0; i < final_list.length; i++) {  
        if(student_id == final_list[i][0]){      
        var just_date = final_list[i][1].split("T")[0];
        non_unique_dates.push(just_date);
        time_stamps.push(final_list[i][1]);
        dates = Array.from(new Set(non_unique_dates));
        total_days = dates.length;
        }
      }
    }
      list_line_by_line.push([course_section, student_id, name.trim(), email.trim(), dates.join(",")].join("*"));
      list_to_be_returned.push([course_section, student_id, name.trim(), email.trim(), dates.length]);
  }
      list_line_by_line = list_line_by_line.join('\n');
      //list_line_by_line.forEach((v)=> {
        //fs.writeFileSync(`../data_files/final_student_data.csv`, v +"\n",{encoding:'utf8',flag:'w'});
        //})
      fs.writeFileSync(`../data_files/final_student_data.csv`, list_line_by_line, {encoding:'utf8',flag:'w'});
      
      return list_to_be_returned;
}
    
 // `../data_files/section_${course_section}/final_student_activities.txt`

module.exports = function(course_id) {
  // return Promise.resolve("Cleaning Successful!")

  //fs.unlink("../data_files/final_student_data.csv", (err1) => { if (err1) console.log(err1); });

  return new Promise((resolve, reject) => {
    var list = clean_it(course_id);
    console.log("cleaning done");
    resolve(list);
  })
}
