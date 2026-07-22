const express = require("express");
const router = express.Router();

const upload = require("../middlewares/uploadResume");
const { analyzeResume } = require("../controllers/resumeController");

router.post("/resumeAnalysis", (req, res, next) => {
    upload.single("resume")(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message || "File upload failed.",
            });
        }
        next();
    });
}, analyzeResume);

module.exports = router;
