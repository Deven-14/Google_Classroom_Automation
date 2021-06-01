const express = require("express");
const bodyParser = require("body-parser");
const get_courses = require("../data_collector/get_courses");
const get_student_list = require("../data_collector/get_students");
const get_student_activites = require("../data_collector/get_student_activites");
const clean_up = require("../data_collector/clean_up");
const make_kick_list = require("../data_collector/make_kick_list");
const purge = require("../Purge/purge_it.js");
const get_auth = require("../data_collector/get_auth");

//const auth = getAuth();
var auth;//can't make it const now coz value is being assigned in app.listen()

const port = 4200;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");

app.get("/", async (req, res) => {
    var courses = await get_courses(auth);
    console.log(courses);
    res.render("home.ejs", {courses : courses});
});

app.post("/student_list", async (req, res) => {
    var course = req.body.course.split("**");
    console.log(course);
    var student_list = await get_student_list(auth, course[1]);
    console.log(student_list);
    await get_student_activites(auth, course[2]);
    console.log("done with get_student_activities)");
    var final_list = await clean_up(course[1]);
    console.log(final_list);
    res.render("student_list.ejs", {student_list : final_list});
});

app.post("/purge_list", async (req, res) => {
    var tolerance = req.body.tolerance;
    var kick_list = await make_kick_list(tolerance);
    console.log(kick_list);
    res.render("purge_list.ejs", {student_list : kick_list});
});

app.post("/purge_completed", async (req, res) => {
    var result = await purge();
    res.render("purge_completed.ejs", {result : result});
});

app.listen(port, async () => {
    console.log(`this log is working on ${port}`);
    auth = await get_auth(); //will return normal value instead of Promise { value }, Promise { value } is returned from an async function, get_auth() can be a async or non async function but since it is awaiting in an async function the return type of get_here is value and not Promise { value }
});