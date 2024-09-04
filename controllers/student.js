const student = require("../models/student");
const { response } = require("../utils/response");
const mongoose = require("mongoose");

// Create

const createStudent = async (req, res) => {
  try {
    const { name, age, standard } = req.body;
    if (!name || !age || !standard) {
      return response(res, 200, 0, "Fields cannot be empty!!", null);
    }
    let saveData;
    const convAge = Number(age);
    try {
      saveData = await student.create({
        studentId: `S${new Date().getTime()}`,
        name,
        age: convAge,
        standard,
      });
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

const getStudent = async (req, res) => {
  try {
    let data;
    try {
      data = await student.find();
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

const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response(res, 200, 0, "Please provide a valid id!!!", null);
    }
    let data;
    try {
      data = await student.findOne({ _id: id });
    } catch (err) {
      console.log(err);
      return response(res, 200, 0, "Database Error!!!", null);
    }
    if (!data) {
      return response(res, 200, 0, "No data found!!!", data);
    }
    return response(res, 200, 1, "Data fetched Successfully!!", data);
  } catch (err) {
    console.log(err);
    response(res, 500, 0, "Server Error!!!", null);
  }
};

// Update

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, standard } = req.body;
    if (!name && !age && !standard) {
      return response(
        res,
        200,
        0,
        "Please fil in atleast one field in order to update!!",
        null
      );
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response(res, 200, 0, "Please provide a valid id!!!", null);
    }
    const convAge = Number(age);
    const updates = {
      name,
      age: convAge,
      standard,
    };
    let resp;
    try {
      resp = await student.updateOne({ _id: id }, { $set: updates });
    } catch (err) {
      console.log(err);
      return response(res, 200, 0, "Database Error!!!", null);
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
    response(res, 500, 0, "Server Error!!!", null);
  }
};

// Delete

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response(res, 200, 0, "Please provide a valid id!!!", null);
    }
    try {
      await student.deleteOne({ _id: id });
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
  createStudent,
  getStudent,
  getStudentById,
  updateStudent,
  deleteStudent,
};
