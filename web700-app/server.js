/*********************************************************************************
*  WEB700 – Assignment 4
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Padmapriya PalaniSwamiNathan Student ID: 140193237 Date: 05-JUl-2024
*
********************************************************************************/ 
const HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser"); // Import body-parser module
const collegeData = require("./modules/collegeData");

module.exports=app;

// Middleware route to serve JSON files from the "data" folder
app.use(express.static(path.join(__dirname, 'data')));

// Middleware route to serve static files from the "views" folder
app.use(express.static(path.join(__dirname, 'views')));

// Middleware route to serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Configure body-parser middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.urlencoded({ extended: true }));

// Setup routes to serve HTML files
// GET / route for Home Page
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, './views/home.html'));
});
// GET /about route for About Page
app.get('/about', function(req, res) {
    res.sendFile(path.join(__dirname, './views/about.html'));
});
// GET /htmlDemo route for Demo Page
app.get('/htmlDemo', function(req, res) {
    res.sendFile(path.join(__dirname, './views/htmlDemo.html'));
});
// GET /students/add route for Add Student Page
app.get('/students/add', function(req, res) {
    res.sendFile(path.join(__dirname, './views/addstudent.html'));
});



// Setup routes for JSON data
// GET /students route for Students
app.get('/students', (req, res) => {
    if (req.query.course) {
        collegeData.getStudentsByCourse(parseInt(req.query.course)).then((data) => {
            res.json(data);
        }).catch((err) => {
            res.json({ message: "no results for student" });
        });
    } else {
        collegeData.getAllStudents().then((data) => {
            res.json(data);
        }).catch((err) => {
            res.json({ message: "no results for students" });
        });
    }
});

// GET /tas route for Teaching Assitant
app.get('/tas', (req, res) => {
    collegeData.getTAs().then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json({ message: "no results for managers" });
    });
});
// GET /courses route for Courses
app.get('/courses', (req, res) => {
    collegeData.getCourses().then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json({ message: "no results for courses" });
    });
});
// GET /student/:num route for Student by student number
app.get('/student/:num', (req, res) => {
    collegeData.getStudentByNum(req.params.num).then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json({ message: "no results for student" });
    });
});

// Handle POST request to add a student
app.post('/students/add', (req, res) => {
    let courseId = parseInt(req.body.enrolledCourse);
    collegeData.addStudent(req.body,courseId)
        .then(() => {
            res.redirect('/students'); // Redirect to the students page after adding student
        })
        .catch(err => {
            console.error('Error adding student:', err);
            // Handle error appropriately, e.g., render an error page or redirect to an error route
            res.status(500).send('Error adding student');
        });
});        

// Handle 404 errors for non-matching routes
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});


// Initialize the data and start the server
collegeData.initialize().then(() => {
    app.listen(HTTP_PORT, () => {
        console.log("Server listening on port: " + HTTP_PORT);
    });
}).catch((err) => {
    console.log("Failed to initialize data: " + err);
});
