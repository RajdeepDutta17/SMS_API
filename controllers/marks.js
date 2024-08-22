const marksModel = require("../models/marks");
const student = require("../models/student");
const teacher = require("../models/teacher");
const { response } = require("../utils/response");

// Create

const createMarks = async (req, res) => {
  try {
    const { studentName, teacherName, subject, marks } = req.body;
    if (!studentName || !teacherName || !subject || !marks) {
      return response(res, 200, 0, "Fields cannot be empty!!", null);
    }
    let saveData;
    let createData = {
      studentName,
      teacherName,
      subject,
      marks,
    };
    try {
      const studentId = await student.findOne({ name: studentName });
      if (!studentId) {
        return response(res, 200, 0, "Student does not exist!!", null);
      }
      createData.studentId = studentId.studentId;
    } catch (err) {
      console.log(err);
      return response(res, 200, 0, "Database Error!!!", null);
    }
    let teacherData;
    try {
      teacherData = await teacher.findOne({ name: teacherName });
      if (!teacherData) {
        return response(res, 200, 0, "Teacher does not exist!!", null);
      }
    } catch (err) {
      console.log(err);
      return response(res, 200, 0, "Database Error!!!", null);
    }

    if (teacherData.subject !== subject) {
      return response(
        res,
        200,
        0,
        `${teacherData.name} doesn't teach ${subject}`,
        null
      );
    }

    try {
      const data = await marksModel.findOne({
        $and: [{ studentName }, { subject }],
      });
      if (data) {
        return response(
          res,
          200,
          0,
          `${data.subject} marks already present for ${studentName}!!!`,
          null
        );
      }
    } catch (err) {
      console.log(err);
      return response(res, 200, 0, "Database Error!!!", null);
    }
    try {
      saveData = await marksModel.create(createData);
    } catch (err) {
      console.log(err);
      return response(res, 200, 0, "Database Error!!!", null);
    }
    return response(res, 200, 1, "Data Saved Successfully!!", saveData);
  } catch (err) {
    console.log(err);
    response(res, 500, 0, "Server Error!!!", null);
  }
};

// Read

const getMarks = async (req, res) => {
  try {
    let data;
    try {
      data = await marksModel.find();
    } catch (err) {
      console.log(err);
      return response(res, 200, 0, "Database Error!!!", null);
    }
    if (!data.length) {
      return response(res, 200, 0, "No data found!!!", data);
    }
    return response(res, 200, 1, "Data fetched Successfully!!", data);
  } catch (err) {
    console.log(err);
    response(res, 500, 0, "Server Error!!!", null);
  }
};

module.exports = { createMarks, getMarks };
