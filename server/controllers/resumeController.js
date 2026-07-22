const fs = require("fs");
const { PDFParse } = require("pdf-parse");

const analyzeResume = async (req, res) => {
    try {
        const { company, jobTitle, jobDescription } = req.body;

        if (!company?.trim() || !jobTitle?.trim() || !jobDescription?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Company name, job title, and job description are required.",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Resume file is required.",
            });
        }

        const buffer = fs.readFileSync(req.file.path);
        const parser = new PDFParse({ data: buffer });
        const result = await parser.getText();
        const resumeText = result.text?.trim() || "";

        return res.status(200).json({
            success: true,
            message: "Resume uploaded successfully.",
            data: {
                company: company.trim(),
                jobTitle: jobTitle.trim(),
                jobDescription: jobDescription.trim(),
                fileName: req.file.originalname,
                resumeTextLength: resumeText.length,
            },
        });
    } catch (error) {
        console.error("Resume analysis error:", error);

        if (req.file?.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to process resume.",
        });
    }
};

module.exports = { analyzeResume };
