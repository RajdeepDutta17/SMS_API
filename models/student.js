const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  standard: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
});

const student = mongoose.model("student", studentSchema);

module.exports = student;
