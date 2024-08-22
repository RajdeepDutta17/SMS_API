const express = require("express");
const {
  createStudent,
  getStudent,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require("../controllers/student");

const router = express.Router();

router.route("/").post(createStudent).get(getStudent);
router
  .route("/:id")
  .get(getStudentById)
  .patch(updateStudent)
  .delete(deleteStudent);

module.exports = router;
