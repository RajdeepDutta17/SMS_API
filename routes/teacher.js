const express = require("express");
const {
  createTeacher,
  getTeacher,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
} = require("../controllers/teacher");

const router = express.Router();

router.route("/").post(createTeacher).get(getTeacher);
router
  .route("/:id")
  .get(getTeacherById)
  .patch(updateTeacher)
  .delete(deleteTeacher);

module.exports = router;
