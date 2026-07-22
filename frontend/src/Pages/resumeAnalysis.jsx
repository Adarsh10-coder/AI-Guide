import { useState, useRef } from "react";
import { Info, FileText, X, UploadCloud, Sparkles } from "lucide-react";

/* ----------------------------------------------------------------
   Same design tokens as the AI Guide homepage
   bg #0D0D0F · plum #311432 · purple #8A2BE2 · lavender #B47EF0
   paper #F3F0F7 · display: Space Grotesk · body: Inter
------------------------------------------------------------------ */

export default function ResumeAnalyzeForm() {
	const [company, setCompany] = useState("");
	const [jobTitle, setJobTitle] = useState("");
	const [jobDescription, setJobDescription] = useState("");
	const [file, setFile] = useState(null);
	const [dragOver, setDragOver] = useState(false);
	const [errors, setErrors] = useState({
		company: "",
		jobTitle: "",
		jobDescription: "",
		file: "",
	});
	const inputRef = useRef(null);

	const handleFileChange = (e) => {
		const f = e.target.files?.[0];
		if (f) {
			setFile(f);   // Store the actual File object
			setErrors((prev) => ({
				...prev,
				file: "",
			}));
		}
	};

	const handleDrop = (e) => {
		e.preventDefault();
		setDragOver(false);
		const f = e.dataTransfer.files?.[0];
		if (f) {
			setFile(f);
			setErrors((prev) => ({
				...prev,
				file: "",
			}));
		}
	};

	const handleAnalyze = async () => {
		const nextErrors = {
			company: company.trim() ? "" : "Company name is required",
			jobTitle: jobTitle.trim() ? "" : "Job title is required",
			jobDescription: jobDescription.trim() ? "" : "Job description is required",
			file: file ? "" : "Please upload your resume",
		};
		setErrors(nextErrors);
		const hasError = Object.values(nextErrors).some(Boolean);
		if (hasError) return;
		const formData = new FormData();
		formData.append("resume", file);
		formData.append("company", company);
		formData.append("jobTitle", jobTitle);
		formData.append("jobDescription", jobDescription);
		try {
			const res = await fetch("http://localhost:5000/resumeAnalysis", {
				method: "POST",
				body: formData,
			});
			const data = await res.json();
			console.log(data);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className="min-h-screen w-full bg-[#0D0D0F] text-[#F3F0F7] relative overflow-hidden">
			<style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        @keyframes drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -20px); }
        }
        .drift-slow { animation: drift 14s ease-in-out infinite; }
        .drift-slower { animation: drift 20s ease-in-out infinite reverse; }
      `}</style>

			{/* Ambient background */}
			<div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full bg-[#8A2BE2]/10 blur-[170px] drift-slow" />
			<div className="pointer-events-none absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-[#B47EF0]/10 blur-[150px] drift-slower" />
			<div
				className="pointer-events-none absolute inset-0 opacity-[0.03]"
				style={{
					backgroundImage:
						"linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
					backgroundSize: "48px 48px",
				}}
			/>

			<main className="relative font-body">
				<div className="max-w-2xl mx-auto px-5 py-16">
					{/* Centered heading */}
					<div className="flex flex-col items-center text-center mb-10">
						<span className="inline-flex items-center gap-1.5 text-xs tracking-[0.2em] uppercase text-[#B47EF0]/90 border border-[#8A2BE2]/30 rounded-full px-3 py-1 bg-[#8A2BE2]/10">
							<Sparkles size={12} />
							AI Guide · Resume Analyzer
						</span>

						<h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mt-5 bg-gradient-to-br from-white via-[#E7D9FA] to-[#B47EF0] bg-clip-text text-transparent">
							Analyze your resume
						</h1>
					</div>

					{/* Transparent form card */}
					<div className="rounded-3xl p-[1px] bg-gradient-to-br from-[#8A2BE2]/40 via-white/10 to-[#B47EF0]/30">
						<div className="rounded-3xl bg-[#050506]/85 border border-white/10 p-7 sm:p-9 space-y-7 shadow-[0_0_35px_rgba(0,0,0,0.32)] backdrop-blur-sm">
							{/* Company Name */}
							<div>
								<label className="text-sm font-medium text-white/80">Company Name</label>
								<input
									value={company}
									required
									onChange={(e) => {
										setCompany(e.target.value);
										if (errors.company) setErrors((prev) => ({ ...prev, company: "" }));
									}}
									className={`mt-2 w-full rounded-xl bg-transparent border px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-all ${errors.company
											? "border-rose-400/70 focus:border-rose-400/70 focus:shadow-[0_0_0_3px_rgba(248,113,113,0.15)]"
											: "border-white/15 focus:border-[#8A2BE2]/70 focus:shadow-[0_0_0_3px_rgba(138,43,226,0.15)]"
										}`}
									placeholder="e.g. PixelForge Studio"
								/>
								{errors.company ? <p className="mt-1 text-xs text-rose-400">{errors.company}</p> : null}
							</div>

							{/* Job Title */}
							<div>
								<label className="text-sm font-medium text-white/80">Job Title</label>
								<input
									value={jobTitle}
									required
									onChange={(e) => {
										setJobTitle(e.target.value);
										if (errors.jobTitle) setErrors((prev) => ({ ...prev, jobTitle: "" }));
									}}
									className={`mt-2 w-full rounded-xl bg-transparent border px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-all ${errors.jobTitle
											? "border-rose-400/70 focus:border-rose-400/70 focus:shadow-[0_0_0_3px_rgba(248,113,113,0.15)]"
											: "border-white/15 focus:border-[#8A2BE2]/70 focus:shadow-[0_0_0_3px_rgba(138,43,226,0.15)]"
										}`}
									placeholder="e.g. Full Stack Developer"
								/>
								{errors.jobTitle ? <p className="mt-1 text-xs text-rose-400">{errors.jobTitle}</p> : null}
							</div>

							{/* Job Description */}
							<div>
								<label className="text-sm font-medium text-white/80">Job Description</label>
								<textarea
									value={jobDescription}
									required
									onChange={(e) => {
										setJobDescription(e.target.value);
										if (errors.jobDescription) setErrors((prev) => ({ ...prev, jobDescription: "" }));
									}}
									rows={5}
									className={`mt-2 w-full rounded-xl bg-transparent border px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-all resize-none leading-relaxed ${errors.jobDescription
											? "border-rose-400/70 focus:border-rose-400/70 focus:shadow-[0_0_0_3px_rgba(248,113,113,0.15)]"
											: "border-white/15 focus:border-[#8A2BE2]/70 focus:shadow-[0_0_0_3px_rgba(138,43,226,0.15)]"
										}`}
									placeholder="Paste the job description here..."
								/>
								{errors.jobDescription ? <p className="mt-1 text-xs text-rose-400">{errors.jobDescription}</p> : null}
							</div>

							{/* Upload Resume */}
							<div>
								<div className="flex items-center gap-1.5">
									<label className="text-sm font-medium text-white/80">Upload Resume</label>
									<Info size={12} className="text-white/30" />
								</div>

								<div
									onDragOver={(e) => {
										e.preventDefault();
										setDragOver(true);
									}}
									onDragLeave={() => setDragOver(false)}
									onDrop={handleDrop}
									className={`mt-2 rounded-xl border ${dragOver
											? "border-[#8A2BE2]/70 bg-[#8A2BE2]/[0.06]"
											: errors.file
												? "border-rose-400/70 bg-rose-500/10"
												: "border-white/15 bg-transparent"
										} px-5 py-8 transition-colors`}
								>
									{!file ? (
										<button
											onClick={() => inputRef.current?.click()}
											className="w-full flex flex-col items-center justify-center gap-2.5 text-white/50 hover:text-[#B47EF0] transition-colors"
										>
											<span className="flex items-center justify-center w-11 h-11 rounded-full bg-[#8A2BE2]/15 text-[#B47EF0]">
												<UploadCloud size={19} />
											</span>
											<span className="text-sm">Click or drop your PDF here</span>
											<span className="text-[11px] text-white/30">PDF up to 10MB</span>
										</button>
									) : (
										<div className="flex items-center justify-between rounded-lg border border-white/15 px-4 py-3">
											<div className="flex items-center gap-3">
												<span className="flex items-center justify-center w-8 h-8 rounded-md bg-rose-500/15 text-rose-400">
													<FileText size={16} />
												</span>
												<div>
													<p className="text-sm text-white">{file.name}</p>
													<p className="text-[11px] text-white/40">{(file.size / 1024).toFixed(2)} KB</p>
												</div>
											</div>
											<button
												onClick={() => setFile(null)}
												className="text-white/40 hover:text-rose-400 transition-colors"
												aria-label="Remove file"
											>
												<X size={16} />
											</button>
										</div>
									)}
									<input
										ref={inputRef}
										type="file"
										accept="application/pdf"
										onChange={handleFileChange}
										className="hidden"
									/>
								</div>
								{errors.file ? <p className="mt-2 text-xs text-rose-400">{errors.file}</p> : null}
							</div>

							{/* Submit */}
							<button
								type="button"
								onClick={handleAnalyze}
								className="w-full rounded-xl bg-gradient-to-br from-[#8A2BE2] to-[#B47EF0] text-white text-sm font-medium py-3.5 shadow-md shadow-[#8A2BE2]/20 hover:shadow-[#8A2BE2]/35 hover:-translate-y-0.5 transition-all"
							>
								Analyze Resume
							</button>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}