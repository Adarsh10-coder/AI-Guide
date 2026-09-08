const fs = require("fs");
const pdfParseModule = require("pdf-parse");

const extractPdfText = async (buffer) => {
    if (typeof pdfParseModule === "function") {
        const result = await pdfParseModule(buffer);
        return result.text?.trim() || "";
    }
    if (pdfParseModule && pdfParseModule.PDFParse) {
        const parser = new pdfParseModule.PDFParse({ data: buffer });
        const result = await parser.getText();
        return (typeof result === "string" ? result : result.text || "")?.trim() || "";
    }
    if (pdfParseModule && typeof pdfParseModule.default === "function") {
        const result = await pdfParseModule.default(buffer);
        return result.text?.trim() || "";
    }
    return "";
};

const extractJsonObject = (text) => {
    if (!text) throw new Error("Empty response from AI");
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start >= 0 && end > start) {
        return text.slice(start, end + 1);
    }
    throw new Error("Unable to extract JSON from AI response.");
};

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
        let resumeText = "";
        try {
            resumeText = await extractPdfText(buffer);
        } catch (pdfErr) {
            console.warn("PDF text parsing warning:", pdfErr);
        }

        let analysisData = {};

        // Call the Python AI microservice
        try {
            const aiServiceUrl = process.env.AI_SERVICE_URL || "http://localhost:8000";
            
            const response = await fetch(`${aiServiceUrl}/ai/analyze-resume`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    resumeText,
                    company: company.trim(),
                    jobTitle: jobTitle.trim(),
                    jobDescription: jobDescription.trim()
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const responseText = data.analysis;
                
                if (responseText) {
                    const jsonText = extractJsonObject(responseText);
                    const parsed = JSON.parse(jsonText);
                    
                    // Normalize the data based on potential differences in keys
                    const strengthsArr = Array.isArray(parsed.topStrengths) && parsed.topStrengths.length > 0
                        ? parsed.topStrengths
                        : (Array.isArray(parsed.strengths) ? parsed.strengths : []);

                    const improvementsArr = Array.isArray(parsed.mainImprovements) && parsed.mainImprovements.length > 0
                        ? parsed.mainImprovements
                        : (Array.isArray(parsed.weaknesses) ? parsed.weaknesses : []);

                    analysisData = {
                        overallScore: Number(parsed.overallScore) || 0,
                        atsScore: Number(parsed.atsScore) || 0,
                        issuesCount: Number(parsed.issuesCount) || 0,
                        toneScore: Number(parsed.toneScore) || 0,
                        contentScore: Number(parsed.contentScore) || 0,
                        structureScore: Number(parsed.structureScore) || 0,
                        skillsScore: Number(parsed.skillsScore) || 0,
                        topStrengths: strengthsArr,
                        mainImprovements: improvementsArr,
                        topStrength: strengthsArr[0] || "",
                        mainImprovement: improvementsArr[0] || "",
                        missingSkills: Array.isArray(parsed.missingSkills) ? parsed.missingSkills : [],
                        matchedSkills: Array.isArray(parsed.matchedSkills) ? parsed.matchedSkills : [],
                        atsChecks: Array.isArray(parsed.atsChecks) ? parsed.atsChecks : [],
                        strengths: strengthsArr,
                        weaknesses: improvementsArr,
                        actionItems: Array.isArray(parsed.actionItems) ? parsed.actionItems : improvementsArr.slice(0, 3),
                    };
                }
            } else {
                console.warn(`Python AI service returned status: ${response.status}`);
            }
        } catch (error) {
            console.error("AI analysis failed (Python service):", error);
        }

        return res.status(200).json({
            success: true,
            message: "Resume analyzed successfully.",
            data: {
                company: company.trim(),
                jobTitle: jobTitle.trim(),
                jobDescription: jobDescription.trim(),
                fileName: req.file.originalname,
                resumeTextLength: resumeText.length,
                resumeText: resumeText,
                ...analysisData,
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



