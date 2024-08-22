const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  teacherId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
});

const teacher = mongoose.model("teacher", teacherSchema);

module.exports = teacher;
