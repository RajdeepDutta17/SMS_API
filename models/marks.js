const mongoose = require("mongoose");

const marksSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
  },
  teacherId: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  marks: {
    type: Number,
    required: true,
  },
});

const marks = mongoose.model("marks", marksSchema);

module.exports = marks;
