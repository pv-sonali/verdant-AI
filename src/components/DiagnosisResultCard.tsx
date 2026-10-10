import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ThermometerSun,
  Activity,
  Droplets,
  BookOpen,
  MessageSquare,
  FileDown,
  Info
} from 'lucide-react';
import { PredictionResult, SupportedLanguage } from '../types/index.ts';
import { getTranslation } from '../utils/i18n.ts';

interface DiagnosisResultCardProps {
  prediction: PredictionResult;
  language: SupportedLanguage;
  onNavigateToAdvisory: () => void;
  onNavigateToChat: (query: string) => void;
  onExportReport: () => void;
}

export const DiagnosisResultCard: React.FC<DiagnosisResultCardProps> = ({
  prediction,
  language,
  onNavigateToAdvisory,
  onNavigateToChat,
  onExportReport,
}) => {
  const t = (k: string) => getTranslation(language, k);

  const confidencePct = Math.round(prediction.confidence * 100);

  // Confidence color
  let confColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
  let confBarColor = 'bg-emerald-500';
  if (confidencePct < 70) {
    confColor = 'text-amber-700 bg-amber-50 border-amber-200';
    confBarColor = 'bg-amber-500';
  } else if (confidencePct < 85) {
    confColor = 'text-blue-700 bg-blue-50 border-blue-200';
    confBarColor = 'bg-blue-500';
  }

  // Severity color
  const severityColors = {
    None: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    Early: 'bg-amber-100 text-amber-800 border-amber-300',
    Moderate: 'bg-orange-100 text-orange-800 border-orange-300',
    Severe: 'bg-rose-100 text-rose-800 border-rose-300',
  };

  const severityBadgeClass = severityColors[prediction.severity_stage] || severityColors.Moderate;

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
      
      {/* Header Banner */}
      <div className={`p-6 sm:p-8 border-b ${prediction.is_healthy ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white' : 'bg-gradient-to-r from-emerald-950 via-stone-900 to-stone-900 text-white'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase font-extrabold tracking-wider bg-white/20 text-white px-2.5 py-0.5 rounded-md backdrop-blur-sm">
                {prediction.crop}
              </span>
              <span className={`text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-md border ${severityBadgeClass}`}>
                {prediction.severity_stage === 'None' ? 'Healthy' : `${prediction.severity_stage} Stage`}
              </span>
              <span className="text-xs uppercase font-extrabold tracking-wider bg-emerald-800/80 text-emerald-200 px-2.5 py-0.5 rounded-md">
                {prediction.pathogen_type}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-['Plus_Jakarta_Sans'] tracking-tight">
              {prediction.disease_name}
            </h2>

            {prediction.scientific_name && (
              <p className="text-xs sm:text-sm italic text-emerald-200/90 font-serif mt-0.5">
                Causal organism: {prediction.scientific_name}
              </p>
            )}
          </div>

          {/* Calibrated Confidence Badge */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/20 flex flex-col items-center justify-center min-w-[130px]">
            <span className="text-[11px] font-semibold text-emerald-200 uppercase tracking-wider">
              {t('confidenceScore')}
            </span>
            <div className="text-3xl font-black text-white mt-0.5">
              {confidencePct}%
            </div>
            <div className="w-full bg-white/20 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full ${confBarColor}`}
                style={{ width: `${confidencePct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-6 sm:p-8 space-y-6">

        {/* Uncertainty Banner (Responsible AI) */}
        {prediction.uncertainty_warning && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Uncertainty & Diagnostic Notice
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                {prediction.uncertainty_warning}
              </p>
              <p className="text-[11px] text-amber-700/80 mt-1 italic">
                AI predictions are decision-support estimates. If symptoms are ambiguous or spreading, bring physical foliage to your regional Krishi Vigyan Kendra (KVK) or extension officer.
              </p>
            </div>
          </div>
        )}

        {/* Symptoms Observed & Anatomy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Visual Symptoms Observed */}
          <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>{t('symptomsObserved')}</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-800">
              {prediction.visual_symptoms_observed.map((sym, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span>{sym}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Affected Plant Anatomy */}
          <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-2 mb-3">
              <Droplets className="w-4 h-4 text-emerald-600" />
              <span>{t('affectedParts')}</span>
            </h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {prediction.affected_parts.map((part, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-white border border-stone-200 rounded-lg text-xs font-medium text-stone-800 shadow-2xs"
                >
                  {part}
                </span>
              ))}
            </div>

            {/* Quick status badge */}
            <div className="p-3 bg-white rounded-xl border border-stone-200 flex items-center justify-between text-xs">
              <span className="text-stone-500">Predicted Class:</span>
              <code className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {prediction.predicted_class}
              </code>
            </div>
          </div>

        </div>

        {/* Weather Synergy Indicator if available */}
        {prediction.weather_risk && (
          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-2">
                <ThermometerSun className="w-4 h-4 text-emerald-700" />
                <span>{t('weatherAlert')}</span>
              </h4>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                prediction.weather_risk.current_risk_level === 'High' || prediction.weather_risk.current_risk_level === 'Critical'
                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}>
                {prediction.weather_risk.current_risk_level} Environmental Risk
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-900 font-medium">
              {prediction.weather_risk.advisory}
            </p>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-stone-600">
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
                <Info className="w-3.5 h-3.5 text-emerald-700" />
                <span>{prediction.weather_risk.spray_recommendation}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onNavigateToAdvisory}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>View Treatment & Spray Plan</span>
            </button>

            <button
              onClick={() => onNavigateToChat(`What is the recommended treatment dosage and schedule for ${prediction.crop} with ${prediction.disease_name}?`)}
              className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs sm:text-sm rounded-xl border border-stone-300 transition flex items-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-stone-600" />
              <span>Ask Agronomist AI</span>
            </button>
          </div>

          <button
            onClick={onExportReport}
            className="px-3.5 py-2.5 bg-stone-50 hover:bg-stone-100 text-stone-700 font-medium text-xs sm:text-sm rounded-xl border border-stone-200 transition flex items-center gap-1.5 cursor-pointer"
            title="Download printable field advisory report"
          >
            <FileDown className="w-4 h-4 text-stone-500" />
            <span>Export Advisory PDF</span>
          </button>
        </div>

      </div>

    </div>
  );
};
