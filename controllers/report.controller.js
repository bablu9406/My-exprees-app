const Report = require("../models/Report");


// ================= REPORT CONTENT =================
exports.reportContent = async (req, res) => {
  try {
    const { type, targetId, reason } = req.body;

    if (!type || !targetId || !reason) {
      return res.status(400).json({
        error: "type, targetId and reason are required"
      });
    }

    const report = await Report.create({
      reporter: req.user._id,
      type,        // post / comment / reel etc
      targetId,
      reason
    });

    res.status(201).json(report);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ================= GET ALL REPORTS =================
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("reporter", "username")
      .sort({ createdAt: -1 });

    res.json(reports);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ================= DELETE REPORT =================
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    await report.deleteOne();

    res.json({ message: "Report deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};