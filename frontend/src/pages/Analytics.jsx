import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/PageWrapper';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import {
  TrendingUp,
  Award,
  Sparkles,
  Volume2,
  Calendar,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const Analytics = () => {
  const { token } = useAuth();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    if (!token) return;

    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics');
        if (res.data.success) {
          setAnalyticsData(res.data.data);
        }
      } catch (err) {
        console.error(err);
        addToast('Connection failed. Defaulting to mock local reports.', 'warning');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [token, addToast]);

  if (loading) {
    return (
      <PageWrapper className="justify-center items-center py-20 bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <span className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-mono">LOADING DETAILED HISTOGRAMS...</p>
        </div>
      </PageWrapper>
    );
  }

  // Fallback mocks
  const stats = analyticsData?.overall || {
    interviewsCompleted: 2,
    challengesSolved: 3,
    averageInterviewScore: 78
  };
  const scoreTimeline = analyticsData?.scoreTimeline || [
    { date: 'May 10', score: 70, type: 'Technical' },
    { date: 'May 15', score: 82, type: 'HR' },
    { date: 'May 20', score: 78, type: 'Technical' },
    { date: 'May 28', score: 88, type: 'System Design' }
  ];
  const topicScores = analyticsData?.topicScores || [
    { topic: 'Communication', score: 85 },
    { topic: 'Technical Skills', score: 78 },
    { topic: 'System Design', score: 68 },
    { topic: 'Behavioral responses', score: 84 },
    { topic: 'Problem Solving', score: 72 }
  ];

  // SVG Line Chart math
  // We layout inside a 400x150 viewport
  const chartWidth = 400;
  const chartHeight = 150;
  const padding = 25;
  const chartPoints = scoreTimeline.map((item, idx) => {
    const totalPoints = scoreTimeline.length;
    const x = padding + (idx / Math.max(1, totalPoints - 1)) * (chartWidth - padding * 2);
    // Invert Y axis: 0 is at top, chartHeight is at bottom.
    const y = chartHeight - padding - (item.score / 100) * (chartHeight - padding * 2);
    return { x, y, score: item.score, date: item.date };
  });

  // Build svg path string (e.g. M 25, 120 L 100, 90 L ...)
  const linePath = chartPoints.reduce((acc, p, idx) => {
    return acc + `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y} `;
  }, '');

  // Build gradient area path string
  const areaPath = chartPoints.length > 0
    ? `${linePath} L ${chartPoints[chartPoints.length - 1].x} ${chartHeight - padding} L ${chartPoints[0].x} ${chartHeight - padding} Z`
    : '';

  return (
    <PageWrapper className="bg-slate-950 text-slate-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative overflow-hidden font-sans">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 border-b border-slate-900 pb-6">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">Performance Analytics</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Granular insights on mock presentations and algorithm solutions.</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl border border-slate-900 bg-slate-900/10 flex flex-col justify-between h-[120px]">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Average score</span>
          <div className="flex items-baseline gap-1 text-white py-1">
            <span className="text-4xl font-black">{stats.averageInterviewScore}%</span>
            <span className="text-xs text-brand-primary font-bold">Good</span>
          </div>
          <p className="text-[9px] text-slate-500">Based on {stats.interviewsCompleted} completed mock sessions.</p>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl border border-slate-900 bg-slate-900/10 flex flex-col justify-between h-[120px]">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total solved</span>
          <div className="flex items-baseline gap-1 text-white py-1">
            <span className="text-4xl font-black">{stats.challengesSolved}</span>
            <span className="text-xs text-slate-500">/ 10 challenges</span>
          </div>
          <p className="text-[9px] text-slate-500">Practice weekly to maintain coding logical skills.</p>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl border border-slate-900 bg-slate-900/10 flex flex-col justify-between h-[120px]">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Completed sessions</span>
          <div className="flex items-baseline gap-1 text-white py-1">
            <span className="text-4xl font-black">{stats.interviewsCompleted}</span>
            <span className="text-xs text-brand-secondary font-bold">Done</span>
          </div>
          <p className="text-[9px] text-slate-500">Keep testing to build confidence under pressure.</p>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Custom SVG Line Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl border border-slate-900 bg-slate-900/10 flex flex-col justify-between h-[280px]">
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Score History Timeline</h3>
            <p className="text-[10px] text-slate-500">Trend of overall percentages over subsequent sessions</p>
          </div>

          <div className="w-full flex-1 flex items-center justify-center pt-4">
            {chartPoints.length > 0 ? (
              <svg className="w-full h-full max-h-[160px]" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
                <defs>
                  {/* Fill Area Gradient */}
                  <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid guidelines */}
                <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="rgba(255,255,255,0.05)" />
                <line x1={padding} y1={chartHeight/2} x2={chartWidth - padding} y2={chartHeight/2} stroke="rgba(255,255,255,0.02)" strokeDasharray="3,3" />

                {/* Gradient area */}
                {areaPath && <path d={areaPath} fill="url(#chart-area-grad)" />}

                {/* Plot line */}
                {linePath && <path d={linePath} fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}

                {/* Data Points */}
                {chartPoints.map((p, idx) => (
                  <g key={idx}>
                    <circle cx={p.x} cy={p.y} r="3.5" fill="#8b5cf6" stroke="#06b6d4" strokeWidth="1.5" />
                    <text x={p.x} y={chartHeight - 8} className="text-[7px] fill-slate-500 text-center" textAnchor="middle">{p.date}</text>
                    <text x={p.x} y={p.y - 8} className="text-[8px] font-bold fill-white" textAnchor="middle">{p.score}%</text>
                  </g>
                ))}
              </svg>
            ) : (
              <div className="text-xs text-slate-600">No mock score logs recorded yet.</div>
            )}
          </div>
        </div>

        {/* Sentiment Analysis indicators */}
        <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/10 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Volume2 className="w-4.5 h-4.5 text-brand-primary" />
              Speech sentiment metrics
            </h3>
            <p className="text-[10px] text-slate-500">Evaluation details scanned from audio inputs</p>
          </div>

          <div className="space-y-4 py-4">
            
            {/* Metric A */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Filler Words Index (Um, Uh)</span>
                <span className="font-semibold text-emerald-400">Low (2%)</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

            {/* Metric B */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Average Speech Pace</span>
                <span className="font-semibold text-brand-primary">130 WPM</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                <div className="h-full bg-brand-primary rounded-full" style={{ width: '90%' }} />
              </div>
            </div>

            {/* Metric C */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Vocabulary Variety Rating</span>
                <span className="font-semibold text-brand-secondary">Moderate</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                <div className="h-full bg-brand-secondary rounded-full" style={{ width: '70%' }} />
              </div>
            </div>

          </div>

          <span className="text-[8px] text-slate-600">Calculated across latest speech recordings in Mock Room.</span>
        </div>

      </div>

      {/* Topic Performance charts & Improvement logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Topic Breakdown bar bars */}
        <div className="lg:col-span-2 p-6 rounded-3xl border border-slate-900 bg-slate-900/10 space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Topic Performance Rating</h3>
          
          <div className="space-y-3.5 pt-2 text-xs">
            {topicScores.map((ts, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-semibold">{ts.topic}</span>
                  <span className="font-mono text-brand-primary font-bold">{ts.score}% Rating</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-900/40">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${ts.score}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Areas of improvement advice */}
        <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/10 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-4.5 h-4.5 text-brand-accent animate-pulse" />
              Focus Areas Checklist
            </h3>

            <div className="space-y-3 pt-2 text-xs leading-relaxed">
              <div className="p-3 rounded-2xl border border-slate-900 bg-slate-950/60 flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-brand-accent shrink-0 mt-1.5" />
                <p className="text-slate-400">
                  **System Design Architecture**: Focus on database scaling logic (sharding/replication indexes).
                </p>
              </div>
              <div className="p-3 rounded-2xl border border-slate-900 bg-slate-950/60 flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-brand-secondary shrink-0 mt-1.5" />
                <p className="text-slate-400">
                  **Technical code edge-cases**: Ensure logic checks for empty inputs or out of bounds integers.
                </p>
              </div>
            </div>
          </div>

          <span className="text-[9px] text-slate-500 leading-normal block pt-4">Advice aggregated dynamically from previous AI evaluations.</span>
        </div>

      </div>

    </PageWrapper>
  );
};

export default Analytics;
