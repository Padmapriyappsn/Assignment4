const fs = require('fs');

class Data {
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}

var dataCollection = null;

function initialize() {
    return new Promise((resolve, reject) => {
        // Read students.json
        fs.readFile('./data/students.json', 'utf8', (err, studentDataFromFile) => {
            if (err) {
                reject("Unable to read students.json");
                return;
            }

            // Read courses.json only after students.json is successfully read
            fs.readFile('./data/courses.json', 'utf8', (err, courseDataFromFile) => {
                if (err) {
                    reject("Unable to read courses.json");
                    return;
                }

                try {
                    const students = JSON.parse(studentDataFromFile);
                    const courses = JSON.parse(courseDataFromFile);

                    // Create a new instance of the Data class
                    dataCollection = new Data(students, courses);

                    resolve();
                } catch (error) {
                    reject("Error parsing JSON data");
                }
            });
        });
    });
}

function getAllStudents() {
    return new Promise((resolve, reject) => {
        if (dataCollection && dataCollection.students.length > 0) {
            resolve(dataCollection.students);
        } else {
            reject("No students data available");
        }
    });
}

function getTAs() {
    return new Promise((resolve, reject) => {
        if (dataCollection && dataCollection.students.length > 0) {
            const tas = dataCollection.students.filter(student => student.TA === true);
            if (tas.length > 0) {
                resolve(tas);
            } else {
                reject("No TAs found");
            }
        } else {
            reject("No students data available");
        }
    });
}

function getCourses() {
    return new Promise((resolve, reject) => {
        if (dataCollection && dataCollection.courses.length > 0) {
            resolve(dataCollection.courses);
        } else {
            reject("No courses data available");
        }
    });
}

function getStudentsByCourse(course) {
    return new Promise((resolve, reject) => {
        if (dataCollection && dataCollection.students.length > 0) {
            const result = dataCollection.students.filter(student => student.course === course);
            if (result.length > 0) {
                resolve(result);
            } else {
                reject("No results returned");
            }
        } else {
            reject("No students data available");
        }
    });
}

function getStudentByNum(num) {
    return new Promise((resolve, reject) => {
        if (dataCollection && dataCollection.students.length > 0) {
            const student = dataCollection.students.find(student => student.studentNum === num);
            if (student) {
                resolve(student);
            } else {
                reject("No results returned");
            }
        } else {
            reject("No students data available");
        }
    });
}

// Function to add a new student
function addStudent(studentData) {
    return new Promise((resolve, reject) => {
        // Ensure TA property is set to false if undefined
        if (studentData.TA === undefined) {
            studentData.TA = false;
        } else {
            studentData.TA = true;
        }

        // Set studentNum property based on current array length + 1
        studentData.studentNum = dataCollection.students.length + 1;

        // Push new studentData to the students array
        dataCollection.students.push(studentData);

        // Resolve the promise to indicate success
        resolve(studentData); // Resolve with the added student data
    });
}

module.exports = { initialize, getAllStudents, getTAs, getCourses, getStudentsByCourse, getStudentByNum, addStudent};