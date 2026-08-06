import React, { useState, useMemo } from "react";
import {
	CheckCircle2,
	AlertTriangle,
	Sparkles,
	TrendingUp,
	Award,
	FileText,
	Check,
	Download,
	Layers,
	Target,
	ArrowRight,
	Plus,
	Copy,
	CheckCheck,
	RefreshCw,
	Eye,
	BarChart3,
	ShieldCheck
} from "lucide-react";

export default function ResumeAnalyzeView({ analysisData, file, onReset }) {
	const [copiedSkill, setCopiedSkill] = useState(null);

	// Fallback/Safety default values
	const data = useMemo(() => {
		if (!analysisData) return {};
		return {
			company: analysisData.company || "Target Company",
			jobTitle: analysisData.jobTitle || "Target Role",
			overallScore: analysisData.overallScore ?? 84,
			atsScore: analysisData.atsScore ?? 88,
			issuesCount: analysisData.issuesCount ?? 12,
			toneScore: analysisData.toneScore ?? 78,
			contentScore: analysisData.contentScore ?? 68,
			structureScore: analysisData.structureScore ?? 84,
			skillsScore: analysisData.skillsScore ?? 64,
			topStrengths: Array.isArray(analysisData.topStrengths) && analysisData.topStrengths.length > 0
				? analysisData.topStrengths.slice(0, 5)
				: [
					"Good technical alignment with candidate target role requirements.",
					"Clear chronological timeline and structured career history.",
					"Solid foundation in core software engineering principles.",
					"Includes essential candidate contact info and education section.",
					"Demonstrates practical hands-on capability across technical projects."
				],
			mainImprovements: Array.isArray(analysisData.mainImprovements) && analysisData.mainImprovements.length > 0
				? analysisData.mainImprovements.slice(0, 5)
				: [
					"Incorporate missing core skills requested in job description.",
					"Quantify project achievements with measurable metrics (percentages, numbers, dollars).",
					"Include a targeted professional summary tailored specifically to the company.",
					"Organize skills section into clear categories (Languages, Frameworks, Cloud, Tools).",
					"Start all work experience bullet points with strong technical action verbs."
				],
			missingSkills: Array.isArray(analysisData.missingSkills) && analysisData.missingSkills.length > 0
				? analysisData.missingSkills
				: ["Kubernetes", "AWS Cloud", "CI/CD Pipelines", "Docker"],
			matchedSkills: Array.isArray(analysisData.matchedSkills) && analysisData.matchedSkills.length > 0
				? analysisData.matchedSkills
				: ["React", "Node.js", "JavaScript", "REST APIs", "Git"],
			atsChecks: Array.isArray(analysisData.atsChecks) && analysisData.atsChecks.length > 0
				? analysisData.atsChecks
				: [
					{ text: "Clear formatting, readable by ATS scanners", status: "pass" },
					{ text: "Keywords relevant to target role", status: "pass" },
					{ text: "Missing skills section detected for target role", status: "warning" },
					{ text: "Standard contact info & section headers present", status: "pass" }
				],
			strengths: analysisData.strengths || [],
			weaknesses: analysisData.weaknesses || [],
			actionItems: analysisData.actionItems || [],
			resumeText: analysisData.resumeText || ""
		};
	}, [analysisData]);

	// PDF preview object URL
	const fileUrl = useMemo(() => {
		if (file && file instanceof File) {
			return URL.createObjectURL(file);
		}
		return null;
	}, [file]);

	// Badge status helper for category scores
	const getScoreBadge = (score) => {
		if (score >= 80) return { label: "Strong", bg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", bar: "bg-emerald-500" };
		if (score >= 60) return { label: "Good Start", bg: "bg-amber-500/15 text-amber-300 border-amber-500/30", bar: "bg-amber-400" };
		return { label: "Needs work", bg: "bg-rose-500/15 text-rose-400 border-rose-500/30", bar: "bg-rose-500" };
	};

	const toneBadge = getScoreBadge(data.toneScore);
	const contentBadge = getScoreBadge(data.contentScore);
	const structureBadge = getScoreBadge(data.structureScore);
	const skillsBadge = getScoreBadge(data.skillsScore);

	// Semi-circle gauge path calculation
	const radius = 72;
	const strokeWidth = 14;
	const circumference = Math.PI * radius; // Half circle circumference
	const scorePercent = Math.min(Math.max(data.overallScore, 0), 100);
	const strokeDashoffset = circumference - (scorePercent / 100) * circumference;

	const copySkillToClipboard = (skill) => {
		navigator.clipboard.writeText(skill);
		setCopiedSkill(skill);
		setTimeout(() => setCopiedSkill(null), 2000);
	};

	return (
		<div className="min-h-screen w-full bg-[#08080c] text-[#f4f4f5] font-sans relative overflow-x-hidden selection:bg-[#8A2BE2]/40 selection:text-white pb-16">
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700&display=swap');
				body { font-family: 'Plus Jakarta Sans', sans-serif; }
				.font-display { font-family: 'Space Grotesk', sans-serif; }
				@keyframes pulseGlow {
					0%, 100% { opacity: 0.4; transform: scale(1); }
					50% { opacity: 0.7; transform: scale(1.05); }
				}
				.pulse-glow { animation: pulseGlow 8s ease-in-out infinite; }
			`}</style>

			{/* Background Ambient Glows */}
			<div className="pointer-events-none fixed top-0 left-1/4 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[#8A2BE2]/15 blur-[170px] pulse-glow" />
			<div className="pointer-events-none fixed bottom-10 right-10 w-[600px] h-[600px] rounded-full bg-[#B47EF0]/10 blur-[160px] pulse-glow" />
			<div className="pointer-events-none fixed top-1/2 right-1/4 w-[450px] h-[450px] rounded-full bg-pink-600/10 blur-[150px] pulse-glow" />

			{/* Grid overlay */}
			<div
				className="pointer-events-none fixed inset-0 opacity-[0.02]"
				style={{
					backgroundImage:
						"linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
					backgroundSize: "40px 40px",
				}}
			/>

			{/* Main Container */}
			<main className="relative z-10 max-w-[1580px] mx-auto px-4 sm:px-8 py-8">

				{/* Top Section Header */}
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
					<div>
						<div className="flex items-center gap-2 mb-2">
							<span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-[#8A2BE2]/15 text-[#B47EF0] border border-[#8A2BE2]/30 shadow-[0_0_15px_rgba(138,43,226,0.2)]">
								<Sparkles size={12} /> {data.company}
							</span>
							<span className="text-xs text-white/40">•</span>
							<span className="text-xs text-white/60 font-medium">{data.jobTitle}</span>
						</div>
						<h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white bg-gradient-to-r from-white via-white to-purple-200 bg-clip-text text-transparent">
							Resume Review Dashboard
						</h1>
					</div>

					{onReset && (
						<button
							onClick={onReset}
							className="group inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl border border-white/15 bg-gradient-to-r from-white/10 to-white/5 text-white hover:border-[#8A2BE2]/50 hover:bg-[#8A2BE2]/20 hover:shadow-[0_0_20px_rgba(138,43,226,0.3)] transition-all cursor-pointer"
						>
							<RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500 text-[#B47EF0]" />
							Analyze Another Resume
						</button>
					)}
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

					{/* LEFT COLUMN: Resume PDF Preview / Document Viewer */}
					<div className="lg:col-span-5 xl:col-span-5 space-y-4">
						<div className="flex items-center justify-between px-1">
							<div className="flex items-center gap-2">
								<span className="p-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
									<FileText size={16} />
								</span>
								<h2 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
									Resume Document
								</h2>
							</div>

							{fileUrl && (
								<a
									href={fileUrl}
									target="_blank"
									rel="noreferrer"
									className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
								>
									<Download size={13} /> Open Original
								</a>
							)}
						</div>

						{/* Document Viewer Frame */}
						<div className="rounded-2xl border border-slate-800 bg-[#161b22] p-3 sm:p-4 shadow-sm relative overflow-hidden min-h-[720px] flex flex-col">
							{fileUrl ? (
								<div className="w-full flex-1 rounded-xl overflow-hidden bg-black/50 border border-slate-800 flex flex-col">
									<iframe
										src={fileUrl}
										title="Resume PDF"
										className="w-full h-full min-h-[670px] rounded-xl"
									/>
								</div>
							) : (
								<div className="w-full flex-1 rounded-xl bg-slate-900/60 p-8 flex flex-col items-center justify-center text-center text-slate-400 space-y-3 border border-slate-800">
									<FileText size={40} className="opacity-40 text-slate-500" />
									<div>
										<p className="text-xs font-semibold text-slate-300">Resume PDF Document</p>
										<p className="text-[11px] text-slate-500 mt-1">Uploaded document analyzed for {data.jobTitle}</p>
									</div>
								</div>
							)}
						</div>
					</div>

					{/* RIGHT COLUMN: Review Dashboard & Analytics */}
					<div className="lg:col-span-7 xl:col-span-7 space-y-6">

						{/* 1. OVERALL RESUME SCORE CARD */}
						<div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#12121a]/95 via-[#0d0d12]/95 to-[#12121a]/95 p-6 sm:p-8 shadow-[0_0_40px_rgba(138,43,226,0.12)] backdrop-blur-xl relative overflow-hidden space-y-7">

							{/* Glowing Top Accent Bar */}
							<div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-[#8A2BE2] to-[#B47EF0]" />

							{/* Arc Score Gauge Header */}
							<div className="flex flex-col sm:flex-row items-center gap-7 pb-7 border-b border-white/10">
								<div className="relative flex flex-col items-center justify-center">

									{/* SVG Arc Gauge */}
									<svg width="190" height="115" className="overflow-visible">
										<path
											d="M 20,100 A 72,72 0 0,1 170,100"
											fill="none"
											stroke="rgba(255,255,255,0.07)"
											strokeWidth={strokeWidth}
											strokeLinecap="round"
										/>
										<path
											d="M 20,100 A 72,72 0 0,1 170,100"
											fill="none"
											stroke="url(#scoreGradientGlow)"
											strokeWidth={strokeWidth}
											strokeLinecap="round"
											strokeDasharray={circumference}
											strokeDashoffset={strokeDashoffset}
											className="transition-all duration-1000 ease-out"
										/>
										<defs>
											<linearGradient id="scoreGradientGlow" x1="0%" y1="0%" x2="100%" y2="0%">
												<stop offset="0%" stopColor="#ec4899" />
												<stop offset="50%" stopColor="#8A2BE2" />
												<stop offset="100%" stopColor="#3b82f6" />
											</linearGradient>
										</defs>
									</svg>

									{/* Score text overlay */}
									<div className="absolute bottom-1 flex flex-col items-center">
										<span className="font-display text-4xl font-extrabold text-white tracking-tight">
											{data.overallScore}<span className="text-sm font-semibold text-white/40">/100</span>
										</span>
										<span className="text-[11px] font-semibold text-amber-300 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30 mt-0.5 shadow-sm">
											{data.issuesCount} issues detected
										</span>
									</div>
								</div>

								<div className="flex-1 text-center sm:text-left space-y-2">
									<div className="flex items-center justify-center sm:justify-start gap-2">
										<h3 className="text-2xl font-bold text-white tracking-tight">Your Resume Score</h3>
										<span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
											{data.overallScore >= 80 ? "Strong Match" : data.overallScore >= 60 ? "Moderate Match" : "Optimization Needed"}
										</span>
									</div>
									<p className="text-xs text-white/60 leading-relaxed">
										Calculated from ATS readability, keyword density against {data.jobTitle}, metric proof, and structure.
									</p>
								</div>
							</div>

							{/* Category Scores Sub-List with Progress Bars */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

								{/* Tone & Style */}
								<div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 space-y-2.5 hover:bg-white/[0.05] transition-all">
									<div className="flex items-center justify-between">
										<span className="text-xs font-semibold text-white/90">Tone & Style</span>
										<div className="flex items-center gap-2">
											<span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${toneBadge.bg}`}>
												{toneBadge.label}
											</span>
											<span className="text-xs font-bold text-white">{data.toneScore}/100</span>
										</div>
									</div>
									<div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
										<div className={`h-full ${toneBadge.bar} transition-all duration-700`} style={{ width: `${data.toneScore}%` }} />
									</div>
								</div>

								{/* Content */}
								<div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 space-y-2.5 hover:bg-white/[0.05] transition-all">
									<div className="flex items-center justify-between">
										<span className="text-xs font-semibold text-white/90">Content Quality</span>
										<div className="flex items-center gap-2">
											<span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${contentBadge.bg}`}>
												{contentBadge.label}
											</span>
											<span className="text-xs font-bold text-white">{data.contentScore}/100</span>
										</div>
									</div>
									<div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
										<div className={`h-full ${contentBadge.bar} transition-all duration-700`} style={{ width: `${data.contentScore}%` }} />
									</div>
								</div>

								{/* Structure */}
								<div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 space-y-2.5 hover:bg-white/[0.05] transition-all">
									<div className="flex items-center justify-between">
										<span className="text-xs font-semibold text-white/90">Structure & Layout</span>
										<div className="flex items-center gap-2">
											<span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${structureBadge.bg}`}>
												{structureBadge.label}
											</span>
											<span className="text-xs font-bold text-white">{data.structureScore}/100</span>
										</div>
									</div>
									<div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
										<div className={`h-full ${structureBadge.bar} transition-all duration-700`} style={{ width: `${data.structureScore}%` }} />
									</div>
								</div>

								{/* Skills */}
								<div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 space-y-2.5 hover:bg-white/[0.05] transition-all">
									<div className="flex items-center justify-between">
										<span className="text-xs font-semibold text-white/90">Skills Match</span>
										<div className="flex items-center gap-2">
											<span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${skillsBadge.bg}`}>
												{skillsBadge.label}
											</span>
											<span className="text-xs font-bold text-white">{data.skillsScore}/100</span>
										</div>
									</div>
									<div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
										<div className={`h-full ${skillsBadge.bar} transition-all duration-700`} style={{ width: `${data.skillsScore}%` }} />
									</div>
								</div>

							</div>
						</div>

						{/* 2. ATS SCORE CARD */}
						<div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-[#0d0d12]/95 to-[#0d0d12]/95 p-6 sm:p-7 shadow-[0_0_30px_rgba(16,185,129,0.1)] backdrop-blur-xl space-y-4 relative overflow-hidden">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-inner">
										<ShieldCheck size={22} />
									</span>
									<div>
										<h3 className="text-xl font-bold text-white">ATS Compatibility — {data.atsScore}/100</h3>
										<p className="text-xs text-white/60">Applicant Tracking System scanner performance evaluation</p>
									</div>
								</div>
							</div>

							<div className="space-y-3 pt-2">
								{data.atsChecks.map((check, idx) => (
									<div key={idx} className="flex items-start gap-3 text-xs rounded-xl bg-white/[0.02] border border-white/5 p-3 hover:bg-white/[0.04] transition-colors">
										{check.status === "pass" ? (
											<span className="text-emerald-400 mt-0.5 flex-shrink-0 bg-emerald-500/10 p-1 rounded-md border border-emerald-500/20">
												<CheckCircle2 size={15} />
											</span>
										) : (
											<span className="text-amber-400 mt-0.5 flex-shrink-0 bg-amber-500/10 p-1 rounded-md border border-amber-500/20">
												<AlertTriangle size={15} />
											</span>
										)}
										<span className={check.status === "pass" ? "text-white/90 font-medium" : "text-amber-200 font-medium"}>
											{check.text}
										</span>
									</div>
								))}
							</div>
						</div>

						{/* 3. KEY INSIGHT CARDS: TOP STRENGTHS (5 POINTS) & MAIN IMPROVEMENTS (5 POINTS) */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-5">

							{/* TOP STRENGTHS (5 Points) */}
							<div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 via-[#0d0d12]/95 to-[#0d0d12]/95 p-6 shadow-xl relative overflow-hidden space-y-4">
								<div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
									<span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
										<Award size={18} />
									</span>
									<h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
										Top Strengths (5 Points)
									</h3>
								</div>

								<ul className="space-y-3">
									{(data.topStrengths || []).slice(0, 5).map((point, idx) => (
										<li key={idx} className="flex items-start gap-2.5 text-xs text-white/90 leading-relaxed bg-emerald-500/[0.03] p-2.5 rounded-xl border border-emerald-500/10">
											<span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0 border border-emerald-500/30">
												✓
											</span>
											<span>{point}</span>
										</li>
									))}
								</ul>
							</div>

							{/* MAIN IMPROVEMENTS (5 Points) */}
							<div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-950/30 via-[#0d0d12]/95 to-[#0d0d12]/95 p-6 shadow-xl relative overflow-hidden space-y-4">
								<div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
									<span className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
										<TrendingUp size={18} />
									</span>
									<h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
										Main Improvements (5 Points)
									</h3>
								</div>

								<ul className="space-y-3">
									{(data.mainImprovements || []).slice(0, 5).map((point, idx) => (
										<li key={idx} className="flex items-start gap-2.5 text-xs text-white/90 leading-relaxed bg-amber-500/[0.03] p-2.5 rounded-xl border border-amber-500/10">
											<span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0 border border-amber-500/30">
												!
											</span>
											<span>{point}</span>
										</li>
									))}
								</ul>
							</div>

							{/* MISSING SKILLS CARD (Full Width) */}
							<div className="md:col-span-2 rounded-3xl border border-rose-500/30 bg-gradient-to-br from-rose-950/30 via-[#0d0d12]/95 to-[#0d0d12]/95 p-6 shadow-xl space-y-4">
								<div className="flex items-center justify-between pb-2 border-b border-white/10">
									<div className="flex items-center gap-2.5">
										<span className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
											<Target size={18} />
										</span>
										<div>
											<h3 className="text-xs font-bold uppercase tracking-wider text-rose-400">Missing Skills</h3>
											<p className="text-[11px] text-white/50">Required for target job description but missing from resume</p>
										</div>
									</div>
									<span className="text-xs font-semibold text-rose-300 bg-rose-500/15 px-3 py-1 rounded-full border border-rose-500/30">
										{data.missingSkills.length} Skills Missing
									</span>
								</div>

								<div className="flex flex-wrap gap-2.5 pt-1">
									{data.missingSkills.map((skill, index) => (
										<button
											key={index}
											onClick={() => copySkillToClipboard(skill)}
											className="group inline-flex items-center gap-2 text-xs px-3.5 py-2 rounded-xl bg-rose-500/15 text-rose-200 border border-rose-500/30 hover:bg-rose-500/30 hover:border-rose-400 transition-all cursor-pointer"
											title="Click to copy skill"
										>
											<span className="w-1.5 h-1.5 rounded-full bg-rose-400 group-hover:scale-125 transition-transform" />
											<span className="font-medium">{skill}</span>
											{copiedSkill === skill ? (
												<CheckCheck size={13} className="text-emerald-400 ml-1" />
											) : (
												<Copy size={12} className="text-rose-400/60 group-hover:text-rose-200 ml-1 transition-colors" />
											)}
										</button>
									))}
								</div>
							</div>

						</div>

						{/* 4. MATCHED SKILLS & ACTION RECOMMENDATIONS */}
						<div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#12121a]/95 via-[#0d0d12]/95 to-[#12121a]/95 p-6 sm:p-7 shadow-xl space-y-6">
							<div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
								<span className="p-2 rounded-xl bg-[#8A2BE2]/20 text-[#B47EF0] border border-[#8A2BE2]/30">
									<Layers size={18} />
								</span>
								<h3 className="text-base font-bold text-white">Matched Skills & Next Steps</h3>
							</div>

							{/* Matched skills tags */}
							<div className="space-y-2.5">
								<p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
									Matched Skills Found in Resume ({data.matchedSkills.length})
								</p>
								<div className="flex flex-wrap gap-2">
									{data.matchedSkills.map((skill, idx) => (
										<span
											key={idx}
											className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 font-medium"
										>
											<Check size={13} className="text-emerald-400" /> {skill}
										</span>
									))}
								</div>
							</div>

							{/* Recommended Action Checklist */}
							{data.actionItems.length > 0 && (
								<div className="pt-4 border-t border-white/10 space-y-3">
									<p className="text-xs font-semibold uppercase tracking-wider text-[#B47EF0]">
										Priority Action Plan to Score 90+
									</p>
									<div className="space-y-2.5">
										{data.actionItems.map((item, idx) => (
											<div key={idx} className="flex items-start gap-3 text-xs text-white/90 bg-white/[0.02] p-3 rounded-xl border border-white/5 hover:bg-white/[0.04] transition-colors">
												<span className="flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-br from-[#8A2BE2] to-[#B47EF0] text-white font-bold text-xs mt-0.5 flex-shrink-0 shadow-sm">
													{idx + 1}
												</span>
												<span className="leading-relaxed mt-0.5">{item}</span>
											</div>
										))}
									</div>
								</div>
							)}
						</div>

					</div>

				</div>
			</main>
		</div>
	);
}
