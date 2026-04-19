const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");

const {
  reportContent,
  getReports,
  deleteReport
} = require("../controllers/report.controller");


// CREATE REPORT
router.post("/", auth, reportContent);

// GET ALL REPORTS
router.get("/", auth, getReports);

// DELETE REPORT
router.delete("/:id", auth, deleteReport);

module.exports = router;