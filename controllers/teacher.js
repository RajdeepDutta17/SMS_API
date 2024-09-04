const teacher = require("../models/teacher");
const { response } = require("../utils/response");
const mongoose = require("mongoose");

// Create

const createTeacher = async (req, res) => {
  try {
    const { name, subject, department } = req.body;
    if (!name || !subject || !department) {
      return response(res, 200, 0, "Fields cannot be empty!!", null);
    }
    let saveData;
    try {
      saveData = await teacher.create({
        teacherId: `T${new Date().getTime()}`,
        name,
        subject,
        department,
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

const getTeacher = async (req, res) => {
  try {
    let data;
    try {
      data = await teacher.find();
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

const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response(res, 200, 0, "Please provide a valid id!!!", null);
    }
    let data;
    try {
      data = await teacher.findOne({ _id: id });
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

const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, subject, department } = req.body;
    if (!name && !subject && !department) {
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
    const updates = {
      name,
      subject,
      department,
    };
    let resp;
    try {
      resp = await teacher.updateOne({ _id: id }, { $set: updates });
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

const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response(res, 200, 0, "Please provide a valid id!!!", null);
    }
    try {
      await teacher.deleteOne({ _id: id });
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
  createTeacher,
  getTeacher,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
};
