const express = require("express");
const {
  createMarks,
  getMarks,
  updateMarks,
  deleteMarks,
  getMarksById,
} = require("../controllers/marks");

const router = express.Router();

router.route("/").post(createMarks).get(getMarks);
router.route("/:id").get(getMarksById).patch(updateMarks).delete(deleteMarks);

module.exports = router;
