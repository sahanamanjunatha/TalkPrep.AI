import React, { useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import {
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FileUp,
  Award,
  Sparkles,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ResumeAnalyzer = () => {
  const { token } = useAuth();
  const { addToast } = useToast();

  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.pdf') || droppedFile.name.endsWith('.docx') || droppedFile.name.endsWith('.txt')) {
        setFile(droppedFile);
        addToast(`Uploaded ${droppedFile.name} successfully.`, 'success');
      } else {
        addToast('Invalid file format. Upload PDF, DOCX or TXT files only.', 'error');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      addToast(`Selected ${selectedFile.name}. Ready to analyze.`, 'success');
    }
  };

  const startAnalysis = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    addToast('Parsing document text data...', 'info');

    try {
      // Simulate file analysis payload
      const res = await api.post('/resumes/analyze', {
        fileName: file.name,
        fileSize: file.size
      });

      if (res.data.success) {
        setAnalysisResult(res.data.analysis);
        addToast('ATS Scorecard critique complete!', 'success');
      }
    } catch (err) {
      console.error(err);
      addToast('ATS parsing error occurred.', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <PageWrapper className="bg-slate-950 text-slate-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative overflow-hidden font-sans">
      
      {/* Title */}
      <div className="text-center space-y-3 mb-10">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white">AI ATS Resume Analyzer</h1>
        <p className="text-slate-400 max-w-xl mx-auto text-xs sm:text-sm">
          Critique your CV against modern ATS parsing engines. Track missing industry keywords instantly.
        </p>
      </div>

      {/* Main interface layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Upload column */}
        <div className="space-y-6">
          
          <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/10 space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider pl-1">Document Upload</h3>
            
            {/* File Drag Box */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all flex flex-col justify-center items-center h-48 cursor-pointer relative ${
                dragActive
                  ? 'border-brand-primary bg-brand-primary/5'
                  : 'border-slate-800 bg-slate-950 hover:border-slate-800'
              }`}
            >
              <input
                type="file"
                id="resume-file"
                onChange={handleFileChange}
                accept=".pdf,.docx,.txt"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-slate-500 mb-3">
                <Upload className="w-5 h-5" />
              </div>
              
              <span className="text-xs font-bold text-slate-200">Drag & Drop Resume here</span>
              <span className="text-[10px] text-slate-500 mt-1">PDF, DOCX, TXT formats accepted (max 4MB)</span>
            </div>

            {/* Selected file card */}
            {file && (
              <div className="p-3.5 rounded-2xl border border-slate-800 bg-slate-950 flex items-center gap-3">
                <FileText className="w-8 h-8 text-brand-primary shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-white truncate">{file.name}</h4>
                  <p className="text-[9px] text-slate-500 mt-0.5 font-mono">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
            )}

            {/* Analyze button */}
            <button
              onClick={startAnalysis}
              disabled={isAnalyzing || !file}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary text-xs sm:text-sm font-semibold text-white shadow-glow-cyan flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-4 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <span className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Running ATS Parser...
                </>
              ) : (
                <>
                  <FileUp className="w-4.5 h-4.5" />
                  Critique ATS Scorecard
                </>
              )}
            </button>
          </div>

          {/* ATS Guidelines info card */}
          <div className="p-5 rounded-3xl border border-slate-900 bg-slate-900/10 space-y-3">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Info className="w-4 h-4 text-brand-primary" />
              Parser Engine Rules
            </h4>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Applicant Tracking Systems (ATS) scan files from top to bottom. Avoid tables, side panels, and graphics as they cause parsing scrambles. Keep sections clear and chronological.
            </p>
          </div>

        </div>

        {/* Results columns */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            
            {/* If analyzing: circular loading skeleton */}
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-12 border border-slate-900 bg-slate-900/10 rounded-3xl text-center space-y-4"
              >
                <div className="w-12 h-12 rounded-full border-4 border-brand-primary border-t-transparent animate-spin mx-auto" />
                <h3 className="font-bold text-white text-sm">Evaluating Resume Layout...</h3>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">Evaluating content syntax, matching professional skills, and computing formatting score ticks.</p>
              </motion.div>
            )}

            {/* Analysis result output */}
            {!isAnalyzing && analysisResult && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                
                {/* Overall Score Card */}
                <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative shadow-2xl">
                  <div>
                    <span className="inline-flex px-2 py-0.5 rounded bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase tracking-wider mb-2">
                      ATS SCAN SUMMARY
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-white">Parser Scorecard</h2>
                    <p className="text-[10px] text-slate-500 mt-1">CV File: {analysisResult.fileName}</p>
                  </div>
                  
                  {/* Score gauge visual */}
                  <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-900 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">ATS Score</span>
                      <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full mt-1 inline-block uppercase">Match Good</span>
                    </div>
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-white font-extrabold text-lg shadow-glow-cyan">
                      {analysisResult.score}%
                    </div>
                  </div>
                </div>

                {/* Keywords comparison analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Matched keywords */}
                  <div className="p-5 rounded-3xl border border-slate-900 bg-slate-900/10 space-y-3">
                    <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" />
                      Matched Keywords ({analysisResult.matchedKeywords.length})
                    </h4>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {analysisResult.matchedKeywords.map((kw, idx) => (
                        <span key={idx} className="text-[9px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full uppercase">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing keywords */}
                  <div className="p-5 rounded-3xl border border-slate-900 bg-slate-900/10 space-y-3">
                    <h4 className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      Missing Keywords ({analysisResult.missingKeywords.length})
                    </h4>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {analysisResult.missingKeywords.map((kw, idx) => (
                        <span key={idx} className="text-[9px] font-semibold bg-rose-500/10 border border-rose-500/20 text-rose-400 px-2.5 py-1 rounded-full uppercase">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Suggestions and bullet critiques */}
                <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/10 grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Suggestions list */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-white uppercase tracking-wider">ATS Suggestions</h4>
                    <ul className="list-disc pl-3 text-xs text-slate-400 space-y-2 leading-relaxed">
                      {analysisResult.atsSuggestions.map((s, idx) => <li key={idx} className="font-medium">{s}</li>)}
                    </ul>
                  </div>

                  {/* Formatting review */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Layout Critique</h4>
                    <ul className="list-disc pl-3 text-xs text-slate-400 space-y-2 leading-relaxed">
                      {analysisResult.formattingFeedback.map((s, idx) => <li key={idx} className="font-medium">{s}</li>)}
                    </ul>
                  </div>

                </div>

                {/* Compatible roles charts representation */}
                <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/10 space-y-4">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-4.5 h-4.5 text-brand-primary" />
                    Role Compatibility Estimates
                  </h4>
                  
                  <div className="space-y-3.5 pt-2">
                    {analysisResult.roleCompatibility.map((rc, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-white font-semibold">{rc.role}</span>
                          <span className="font-mono text-brand-primary font-bold">{rc.compatibilityPercentage}% Match</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-900/40">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${rc.compatibilityPercentage}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}

            {/* If no file uploaded yet */}
            {!isAnalyzing && !analysisResult && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-16 border border-dashed border-slate-800 rounded-3xl text-center space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white text-sm">No analysis reports generated yet</h3>
                <p className="text-[11px] text-slate-600 max-w-xs mx-auto">Select your CV document and click analyze on the left panel to scan ATS compatibility scores.</p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

    </PageWrapper>
  );
};

export default ResumeAnalyzer;
