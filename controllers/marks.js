const marksModel = require("../models/marks");
const student = require("../models/student");
const teacher = require("../models/teacher");
const { response } = require("../utils/response");
const mongoose = require("mongoose");

// Create

const createMarks = async (req, res) => {
  try {
    const { studentId, teacherId, subject, marks } = req.body;
    if (!studentId || !teacherId || !subject || !marks) {
      return response(res, 200, 0, "Fields cannot be empty!!", null);
    }
    let saveData;
    let createData = {
      studentId,
      teacherId,
      subject,
      marks,
    };
    let studentData;
    try {
      studentData = await student.findOne({ studentId });
      if (!studentData) {
        return response(res, 200, 0, "Student does not exist!!", null);
      }
    } catch (err) {
      console.log(err);
      return response(res, 200, 0, "Database Error!!!", null);
    }
    let teacherData;
    try {
      teacherData = await teacher.findOne({ teacherId });
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
        $and: [{ studentId }, { subject }],
      });
      if (data) {
        return response(
          res,
          200,
          0,
          `${data.subject} marks already present for ${studentData.name}!!!`,
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
      data = await marksModel.aggregate([
        {
          $lookup: {
            from: "students",
            localField: "studentId",
            foreignField: "studentId",
            as: "studentInfo",
          },
        },
        {
          $unwind: "$studentInfo",
        },
        {
          $lookup: {
            from: "teachers",
            localField: "teacherId",
            foreignField: "teacherId",
            as: "teacherInfo",
          },
        },
        {
          $unwind: "$teacherInfo",
        },
      ]);
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

const getMarksById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response(res, 200, 0, "Please provide a valid id!!!", null);
    }
    let data;
    try {
      data = await marksModel.findOne({ _id: id });
    } catch (err) {
      console.log(err);
      return response(res, 200, 0, "DataBase Error!!!", null);
    }
    if (!data) {
      return response(res, 200, 0, "No data found!!!", data);
    }

    const result = {
      subject: data.subject,
      marks: data.marks,
      _id: data._id,
    };

    try {
      let studentData = await student.findOne({ studentId: data.studentId });
      result.studentName = studentData.name;
    } catch (err) {
      console.log(err);
      return response(res, 200, 0, "DataBase Error!!!", null);
    }
    try {
      let teacherData = await teacher.findOne({ teacherId: data.teacherId });
      result.teacherName = teacherData.name;
    } catch (err) {
      console.log(err);
      return response(res, 200, 0, "DataBase Error!!!", null);
    }
    return response(res, 200, 1, "Data fetched Successfully!!", result);
  } catch (err) {
    console.log(err);
    response(res, 500, 0, "Server Error!!!", null);
  }
};

// Update

const updateMarks = async (req, res) => {
  try {
    const { id } = req.params;
    const { marks } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response(res, 200, 0, "Please provide a valid id!!!", null);
    }

    if (!marks) {
      return response(res, 200, 0, "Input field is empty!!!", null);
    }

    let resp;
    try {
      resp = await marksModel.updateOne({ _id: id }, { $set: { marks } });
    } catch (err) {
      console.log(err);
      return response(res, 200, 0, "DataBase Error!!!", null);
    }
    if (resp.modifiedCount > 0) {
      return response(res, 201, 1, "Data updated successfully!!", resp, null);
    } else if (!resp.modifiedCount) {
      return response(
        res,
        200,
        0,
        "Make some changes in order to update!!",
        resp,
        null
      );
    }
  } catch (err) {
    console.log(err);
    return response(res, 500, 0, "Server Error!!!", null);
  }
};

// Delete

const deleteMarks = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response(res, 200, 0, "Please provide a valid id!!!", null);
    }
    try {
      await marksModel.deleteOne({ _id: id });
    } catch (err) {
      console.log(err);
      return response(res, 200, 0, "Database Error!!!", null, null);
    }
    return response(res, 200, 1, "Data Deleted successfully!!!", null, null);
  } catch (err) {
    console.log(err);
    return response(res, 500, 0, "Server Error!!!", null, null);
  }
};

module.exports = {
  createMarks,
  getMarks,
  updateMarks,
  deleteMarks,
  getMarksById,
};
