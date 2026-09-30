/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Zap,
  Droplets,
  Bus,
  Activity,
  SlidersHorizontal,
  Utensils,
  Trash2,
  GraduationCap,
  AlertCircle,
  HelpCircle,
  Mic,
  Square,
  Upload,
  FileText,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Sparkles,
  Lock,
} from 'lucide-react';
import { IssueCategory } from '../types';

export const ReportIssueModal: React.FC = () => {
  const {
    isReportModalOpen,
    setIsReportModalOpen,
    addCitizenReport,
    setSelectedIssueId,
    setActiveView,
    issues,
  } = useApp();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form state
  const [category, setCategory] = useState<IssueCategory>('energy');
  const [evidenceTab, setEvidenceTab] = useState<'text' | 'voice' | 'image' | 'document'>('image');
  const [reportTitle, setReportTitle] = useState('Power outage and delayed gas cylinder delivery');
  const [reportText, setReportText] = useState(
    'Neighborhood feeder tripped around 06:15 IST. Local distributor is also citing delivery truck backlogs exceeding 8 days.'
  );

  // Voice recording simulation
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // Location state
  const [selectedLocation, setSelectedLocation] = useState('Anna Nagar West, Chennai');
  const [isFuzzed, setIsFuzzed] = useState(true);

  // Privacy step state
  const [isScanning, setIsScanning] = useState(true);
  const [scanProgress, setScanProgress] = useState(15);
  const [splitSlider, setSplitSlider] = useState(50); // 0 to 100%

  // Submission pipeline state
  const [submitStepIndex, setSubmitStepIndex] = useState(0);
  const [isSubmittedComplete, setIsSubmittedComplete] = useState(false);
  const [groupedCount, setGroupedCount] = useState(183);

  const categories = [
    { id: 'energy' as IssueCategory, label: 'Energy', icon: Zap, desc: 'Grid outages, transformer faults, fuel supply' },
    { id: 'water' as IssueCategory, label: 'Water', icon: Droplets, desc: 'Pipeline leaks, pressure drops, contamination' },
    { id: 'transport' as IssueCategory, label: 'Transport', icon: Bus, desc: 'Bus route delays, fleet missing, transit congestion' },
    { id: 'healthcare' as IssueCategory, label: 'Healthcare', icon: Activity, desc: 'Clinic supplies, essential vaccine stock, emergency care' },
    { id: 'infrastructure' as IssueCategory, label: 'Infrastructure', icon: SlidersHorizontal, desc: 'Road hazards, drainage trenches, bridge safety' },
    { id: 'food' as IssueCategory, label: 'Food & PDS', icon: Utensils, desc: 'Ration supply variance, grain distribution' },
    { id: 'sanitation' as IssueCategory, label: 'Sanitation', icon: Trash2, desc: 'Waste accumulation, sewer line blockage' },
    { id: 'education' as IssueCategory, label: 'Education', icon: GraduationCap, desc: 'Civic school repairs, classroom amenities' },
    { id: 'emergency' as IssueCategory, label: 'Emergency', icon: AlertCircle, desc: 'Urgent municipal hazard, electrical danger' },
    { id: 'other' as IssueCategory, label: 'Other', icon: HelpCircle, desc: 'General civic public interest concern' },
  ];

  // Voice timer simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  // Privacy scanning simulation when step 4 is reached
  useEffect(() => {
    if (currentStep === 4) {
      setIsScanning(true);
      setScanProgress(15);
      const interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsScanning(false);
            return 100;
          }
          return prev + 25;
        });
      }, 400);
      return () => clearInterval(interval);
    }
  }, [currentStep]);

  // Step 5 pipeline simulation
  useEffect(() => {
    if (currentStep === 5) {
      setSubmitStepIndex(0);
      setIsSubmittedComplete(false);

      const t1 = setTimeout(() => setSubmitStepIndex(1), 700);
      const t2 = setTimeout(() => setSubmitStepIndex(2), 1400);
      const t3 = setTimeout(() => setSubmitStepIndex(3), 2100);
      const t4 = setTimeout(() => setSubmitStepIndex(4), 2800);
      const t5 = setTimeout(() => {
        setSubmitStepIndex(5);
        setIsSubmittedComplete(true);
        // Persist report into global context state
        addCitizenReport({
          category,
          title: reportTitle,
          evidenceType: evidenceTab,
          evidenceContent: reportText,
          location: selectedLocation,
          status: 'Under Review',
          groupedWithCount: 183,
          privacyProtected: true,
        });
      }, 3500);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
        clearTimeout(t5);
      };
    }
  }, [currentStep]);

  if (!isReportModalOpen) return null;

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => (prev + 1) as any);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as any);
    }
  };

  const handleFinishAndTrack = () => {
    setIsReportModalOpen(false);
    // Find matching issue or energy issue to show detail
    const matched = issues.find((i) => i.category === category) || issues[0];
    setSelectedIssueId(matched.id);
    setActiveView('home');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="themed-card rounded-2xl max-w-3xl w-full border b-skin shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header & Stepper */}
        <div className="px-6 py-4 border-b b-skin flex items-center justify-between themed-muted">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#6D4AFF] uppercase tracking-wider">
                Citizen Signal Ingest
              </span>
              <span className="t-faint">·</span>
              <span className="text-xs t-muted font-medium">Step 0{currentStep} of 05</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all ${
                    s === currentStep
                      ? 'w-8 bg-[#6D4AFF]'
                      : s < currentStep
                      ? 'w-5 bg-emerald-500'
                      : 'w-4 bg-neutral-200'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => setIsReportModalOpen(false)}
            className="p-2 t-faint hover:t-ink-2 rounded-lg hover:themed-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Animated Step Views */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {/* STEP 1: ISSUE SELECTION */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-200">
              <div>
                <h3 className="text-2xl font-bold t-ink">What’s the problem?</h3>
                <p className="text-sm t-muted mt-1">
                  Select the public service category that most accurately describes the signal.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`text-left p-4 rounded-xl border transition-all relative group ${
                        isSelected
                          ? 'border-[#6D4AFF] bg-[#6D4AFF]/5 ring-2 ring-[#6D4AFF]/20 shadow-xs'
                          : 'b-skin themed-card hover:b-skin-strong hover:-translate-y-0.5'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`p-2 rounded-lg ${
                            isSelected ? 'bg-[#6D4AFF] text-white' : 'themed-muted t-ink-2'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-[#6D4AFF] animate-in zoom-in-50" />
                        )}
                      </div>
                      <div className="font-semibold text-sm t-ink">{cat.label}</div>
                      <div className="text-[11px] t-muted mt-1 line-clamp-2 leading-tight">
                        {cat.desc}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold t-ink-2 mb-1.5">
                  Brief Issue Title
                </label>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="e.g. Feeder tripping and delayed cylinder refill"
                  className="w-full px-3.5 py-2.5 themed-muted border b-skin rounded-lg text-sm t-ink focus:outline-none focus:ring-2 focus:ring-[#6D4AFF]/20 focus:border-[#6D4AFF]"
                />
              </div>
            </div>
          )}

          {/* STEP 2: EVIDENCE UPLOAD */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-200">
              <div>
                <h3 className="text-2xl font-bold t-ink">Provide Evidence</h3>
                <p className="text-sm t-muted mt-1">
                  Upload photos, voice notes, or text details. All identifiable personal metadata will be sanitized in the next step.
                </p>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1 p-1 themed-muted rounded-lg max-w-md">
                {(['image', 'voice', 'text', 'document'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setEvidenceTab(tab)}
                    className={`flex-1 py-1.5 text-xs font-semibold capitalize rounded-md transition-all ${
                      evidenceTab === tab
                        ? 'themed-card t-ink shadow-xs'
                        : 't-muted hover:t-ink-2'
                    }`}
                  >
                    {tab === 'image' ? 'Image / Photo' : tab}
                  </button>
                ))}
              </div>

              {/* Tab 1: Image / Photo Area */}
              {evidenceTab === 'image' && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed b-skin hover:border-[#6D4AFF]/60 rounded-xl p-6 text-center themed-muted transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto t-faint mb-2" />
                    <p className="text-sm font-semibold t-ink-2">
                      Drop evidence photo or click to browse
                    </p>
                    <p className="text-xs t-faint mt-1">
                      JPG, PNG, WebP up to 25MB. Automated face & plate anonymization will apply.
                    </p>
                  </div>

                  {/* Attached evidence preview */}
                  <div className="p-3 themed-muted rounded-xl border b-skin flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-neutral-200 flex items-center justify-center font-mono text-[10px] t-ink-2 font-bold border b-skin-strong">
                        RAW_IMG
                      </div>
                      <div>
                        <div className="text-xs font-semibold t-ink-2">
                          feeder_box_annagar_west.jpg
                        </div>
                        <div className="text-[11px] t-faint">
                          3.4 MB · Captured 08:30 IST · Geotag stripped
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Attached
                    </span>
                  </div>
                </div>
              )}

              {/* Tab 2: Voice Audio Note */}
              {evidenceTab === 'voice' && (
                <div className="text-center py-6 px-4 themed-muted rounded-xl border b-skin space-y-4">
                  <div className="relative inline-block">
                    <button
                      onClick={() => setIsRecording(!isRecording)}
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-white transition-all shadow-md ${
                        isRecording
                          ? 'bg-rose-600 ring-4 ring-rose-200 animate-pulse'
                          : 'bg-[#6D4AFF] hover:bg-[#5e38f5]'
                      }`}
                    >
                      {isRecording ? <Square className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                    </button>
                  </div>

                  <div>
                    <div className="text-sm font-semibold t-ink-2">
                      {isRecording ? 'Recording citizen statement...' : 'Click microphone to record voice signal'}
                    </div>
                    <div className="font-mono text-xs t-muted mt-1">
                      00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
                    </div>
                  </div>

                  {/* Simulated Waveform animation */}
                  {isRecording && (
                    <div className="flex items-center justify-center gap-1 h-8">
                      {[40, 70, 90, 45, 80, 100, 60, 85, 30, 95, 50, 75].map((h, i) => (
                        <span
                          key={i}
                          className="w-1 bg-[#6D4AFF] rounded-full animate-bounce"
                          style={{
                            height: `${h}%`,
                            animationDelay: `${i * 70}ms`,
                            animationDuration: '600ms',
                          }}
                        />
                      ))}
                    </div>
                  )}

                  <p className="text-xs t-faint max-w-sm mx-auto">
                    Voice will undergo automated pitch-shifting and named entity removal before public aggregation.
                  </p>
                </div>
              )}

              {/* Tab 3: Detailed Text */}
              {evidenceTab === 'text' && (
                <div>
                  <label className="block text-xs font-semibold t-ink-2 mb-1">
                    Describe Observations
                  </label>
                  <textarea
                    rows={4}
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    placeholder="Provide specific notes on what is observed (timings, affected streets, severity)..."
                    className="w-full px-3.5 py-2.5 themed-muted border b-skin rounded-lg text-sm t-ink focus:outline-none focus:ring-2 focus:ring-[#6D4AFF]/20 focus:border-[#6D4AFF]"
                  />
                </div>
              )}

              {/* Tab 4: Document */}
              {evidenceTab === 'document' && (
                <div className="border b-skin rounded-xl p-5 themed-muted text-center space-y-2">
                  <FileText className="w-8 h-8 t-faint mx-auto" />
                  <div className="text-sm font-semibold t-ink-2">Upload official bill or ticket</div>
                  <p className="text-xs t-faint">
                    PDF / Scan of previous grievance acknowledgment. Personal account numbers are redacted automatically.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: LOCATION PRIVACY & REGION */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-200">
              <div>
                <h3 className="text-2xl font-bold t-ink">Select Issue Location</h3>
                <p className="text-sm t-muted mt-1">
                  Pin the affected neighborhood. Your exact domestic coordinates are protected by 500m spatial fuzzing.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold t-ink-2 mb-1.5">
                  Neighborhood or Ward
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-3 t-faint" />
                  <input
                    type="text"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 themed-muted border b-skin rounded-lg text-sm t-ink focus:outline-none focus:ring-2 focus:ring-[#6D4AFF]/20 focus:border-[#6D4AFF]"
                  />
                </div>
              </div>

              {/* Interactive Vector Ward Mini-Map */}
              <div className="border b-skin rounded-xl overflow-hidden bg-slate-50 relative">
                <div className="p-3 themed-card border-b b-skin flex items-center justify-between text-xs">
                  <span className="font-semibold t-ink-2">Chennai Metropolitan Area</span>
                  <span className="text-[11px] text-emerald-700 font-medium">500m Fuzzing Mask Active</span>
                </div>

                <div className="h-48 relative flex items-center justify-center p-4">
                  {/* Subtle vector grid */}
                  <svg className="w-full h-full opacity-40" viewBox="0 0 400 200">
                    <line x1="0" y1="50" x2="400" y2="50" stroke="#cbd5e1" strokeDasharray="3 3" />
                    <line x1="0" y1="100" x2="400" y2="100" stroke="#cbd5e1" strokeDasharray="3 3" />
                    <line x1="0" y1="150" x2="400" y2="150" stroke="#cbd5e1" strokeDasharray="3 3" />
                    <line x1="100" y1="0" x2="100" y2="200" stroke="#cbd5e1" strokeDasharray="3 3" />
                    <line x1="200" y1="0" x2="200" y2="200" stroke="#cbd5e1" strokeDasharray="3 3" />
                    <line x1="300" y1="0" x2="300" y2="200" stroke="#cbd5e1" strokeDasharray="3 3" />
                    {/* Ward contours */}
                    <path
                      d="M 60,40 Q 140,20 220,60 T 360,110 L 330,170 Q 200,190 90,140 Z"
                      fill="#6D4AFF"
                      fillOpacity="0.08"
                      stroke="#6D4AFF"
                      strokeWidth="1.5"
                    />
                  </svg>

                  {/* Pin with privacy blur ring */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                    <div className="w-20 h-20 rounded-full border border-[#6D4AFF]/40 bg-[#6D4AFF]/10 flex items-center justify-center animate-ping opacity-30" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="w-8 h-8 rounded-full bg-[#6D4AFF] text-white flex items-center justify-center shadow-lg">
                        <MapPin className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Privacy disclaimer banner */}
                <div className="p-3 bg-amber-50/80 border-t border-amber-200/60 flex items-start gap-2 text-xs text-amber-900">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>Spatial Privacy Guarantee:</strong> Your exact GPS point is never displayed or stored in public records. The signal is grouped into the wider ward cluster to protect citizen identity.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PRIVACY ENGINE (Evidence Without Exposure) */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold t-ink">Your evidence is being protected</h3>
                  <p className="text-sm t-muted mt-1">
                    Automated sanitization pipeline prepares a public-safe version.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-[#6D4AFF] font-bold block">
                    # Evidence without exposure.
                  </span>
                </div>
              </div>

              {/* Scanning status indicator */}
              <div className="p-4 rounded-xl bg-neutral-900 text-white space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#8B5CF6] animate-spin" />
                    <span className="font-semibold">
                      {isScanning ? 'Sanitizing Evidence Package...' : 'All Identity Vectors Neutralized'}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] t-faint">
                    {scanProgress}% COMPLETE
                  </span>
                </div>

                <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#6D4AFF] to-emerald-400 h-1.5 transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Faces protected</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Plates masked</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>EXIF stripped</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Public-safe build</span>
                  </div>
                </div>
              </div>

              {/* BEFORE / AFTER SPLIT COMPARISON SLIDER */}
              <div>
                <div className="flex items-center justify-between text-xs t-ink-2 mb-2 font-medium">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-rose-500" />
                    Original Raw Evidence
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-[#6D4AFF]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Protected Public Preview ({splitSlider}% split)
                  </span>
                </div>

                <div className="relative h-56 rounded-xl overflow-hidden border b-skin-strong select-none themed-muted">
                  {/* Base Layer: Protected Sanitized View */}
                  <div className="absolute inset-0 bg-slate-100 flex items-center justify-center p-4">
                    <div className="w-full h-full bg-slate-200/70 rounded-lg p-4 flex flex-col justify-between border border-slate-300 relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          ✓ SANITIZED PUBLIC VIEW
                        </span>
                        <span className="text-[10px] t-muted font-mono">HASH: 9e8a..12</span>
                      </div>

                      {/* Visual representation of blurred areas */}
                      <div className="grid grid-cols-3 gap-3 my-auto">
                        <div className="h-16 bg-neutral-300/80 backdrop-blur-md rounded-md border border-neutral-400/40 flex items-center justify-center text-[10px] t-ink-2 font-mono">
                          [FACE_BLUR]
                        </div>
                        <div className="h-16 bg-neutral-300/80 backdrop-blur-md rounded-md border border-neutral-400/40 flex items-center justify-center text-[10px] t-ink-2 font-mono">
                          [PLATE_MASK]
                        </div>
                        <div className="h-16 bg-neutral-300/80 backdrop-blur-md rounded-md border border-neutral-400/40 flex items-center justify-center text-[10px] t-ink-2 font-mono">
                          [AUDIO_SHIFT]
                        </div>
                      </div>

                      <div className="text-[11px] t-ink-2 flex items-center justify-between">
                        <span>Safe for public municipal feed</span>
                        <span className="font-semibold text-emerald-700">Zero Identity Leaks</span>
                      </div>
                    </div>
                  </div>

                  {/* Top Layer: Raw Unsanitized View (Clipped by split slider) */}
                  <div
                    className="absolute inset-0 bg-neutral-800 text-white p-4 overflow-hidden border-r-2 border-white shadow-xl"
                    style={{ width: `${splitSlider}%` }}
                  >
                    <div className="w-[500px] h-full flex flex-col justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
                          RAW CITIZEN DATA
                        </span>
                        <span className="text-[10px] text-rose-200">Private Only</span>
                      </div>

                      <div className="grid grid-cols-3 gap-3 my-auto opacity-70">
                        <div className="h-16 bg-rose-900/40 rounded-md border border-rose-500/40 flex items-center justify-center text-[10px] text-rose-200">
                          Raw Pedestrian Face
                        </div>
                        <div className="h-16 bg-rose-900/40 rounded-md border border-rose-500/40 flex items-center justify-center text-[10px] text-rose-200">
                          Plate TN-02-X-4910
                        </div>
                        <div className="h-16 bg-rose-900/40 rounded-md border border-rose-500/40 flex items-center justify-center text-[10px] text-rose-200">
                          Personal GPS Coords
                        </div>
                      </div>

                      <div className="text-[11px] text-rose-300">
                        Never published or shared with third parties
                      </div>
                    </div>
                  </div>

                  {/* Interactive Split Slider Handle */}
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={splitSlider}
                    onChange={(e) => setSplitSlider(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                  />
                  <div
                    className="absolute top-0 bottom-0 pointer-events-none z-10 flex items-center -ml-3"
                    style={{ left: `${splitSlider}%` }}
                  >
                    <div className="w-6 h-6 rounded-full themed-card shadow-md border b-skin-strong flex items-center justify-center t-ink-2 text-[10px] font-bold">
                      ↔
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: SUBMIT & AI GROUPING PIPELINE */}
          {currentStep === 5 && (
            <div className="space-y-6 text-center py-4 animate-in fade-in duration-300">
              <div className="max-w-md mx-auto space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#6D4AFF]/10 text-[#6D4AFF] mx-auto flex items-center justify-center mb-3">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-extrabold t-ink">
                  {isSubmittedComplete ? 'Signal Published & Grouped' : 'Processing Signal Ingestion'}
                </h3>
                <p className="text-xs sm:text-sm t-muted">
                  {isSubmittedComplete
                    ? `Your report was successfully grouped into the live civic dossier.`
                    : 'Running cryptographic privacy verification and spatial grouping.'}
                </p>
              </div>

              {/* Progress Milestones */}
              <div className="max-w-sm mx-auto themed-muted rounded-xl p-4 border b-skin text-left space-y-2.5 text-xs">
                {[
                  { title: 'Report Received', done: submitStepIndex >= 1 },
                  { title: 'Privacy Protected (Metadata Scrubbed)', done: submitStepIndex >= 2 },
                  { title: 'AI Processing & Deduplication', done: submitStepIndex >= 3 },
                  { title: 'Finding Similar Issues (183 matches)', done: submitStepIndex >= 4 },
                  { title: 'Updating Ward Issue Map & Authority Brief', done: submitStepIndex >= 5 },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    {item.done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 b-skin-strong shrink-0 animate-spin border-t-transparent" />
                    )}
                    <span className={item.done ? 't-ink-2 font-semibold' : 't-faint'}>
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>

              {/* Submission Completed Card */}
              {isSubmittedComplete && (
                <div className="max-w-md mx-auto p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-sm animate-in zoom-in-95">
                  <div className="font-bold text-base mb-1">
                    Your report was grouped with {groupedCount} similar reports
                  </div>
                  <p className="text-xs text-emerald-700">
                    Assigned authority will receive an aggregated brief without exposing your name or location.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t b-skin flex items-center justify-between themed-muted">
          {currentStep > 1 && currentStep < 5 ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold t-ink-2 hover:t-ink themed-card border b-skin rounded-lg hover:themed-muted transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#6D4AFF] hover:bg-[#5e38f5] rounded-lg shadow-sm transition-all"
            >
              <span>{currentStep === 4 ? 'Confirm & Submit Signal' : 'Next Step'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinishAndTrack}
              disabled={!isSubmittedComplete}
              className={`w-full py-2.5 text-xs sm:text-sm font-semibold text-white rounded-lg transition-all ${
                isSubmittedComplete
                  ? 'bg-neutral-900 hover:bg-neutral-800 shadow-sm'
                  : 'bg-neutral-300 cursor-not-allowed'
              }`}
            >
              {isSubmittedComplete ? 'Track Issue & View Dossier →' : 'Finalizing Grouping...'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
