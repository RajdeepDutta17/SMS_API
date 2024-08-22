const express = require("express");
const { createMarks, getMarks } = require("../controllers/marks");

const router = express.Router();

router.route("/").post(createMarks).get(getMarks);

module.exports = router;
