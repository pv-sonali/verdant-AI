import React, { useState } from 'react';
import {
  Leaf,
  FlaskConical,
  Scissors,
  ShieldCheck,
  AlertOctagon,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Droplets,
  ShieldAlert,
  Info
} from 'lucide-react';
import { Recommendations, SupportedLanguage } from '../types/index.ts';
import { getTranslation } from '../utils/i18n.ts';
import { getDetailedSolutionGuide } from '../utils/solutionDetails.ts';

interface TreatmentRecommendationsProps {
  recommendations: Recommendations;
  cropName: string;
  diseaseName: string;
  isHealthy: boolean;
  language: SupportedLanguage;
  onAskAgronomist: (query: string) => void;
}

export const TreatmentRecommendations: React.FC<TreatmentRecommendationsProps> = ({
  recommendations,
  cropName,
  diseaseName,
  isHealthy,
  language,
  onAskAgronomist,
}) => {
  const t = (k: string) => getTranslation(language, k);

  const [activeTab, setActiveTab] = useState<'organic' | 'cultural' | 'chemical' | 'prevention'>('organic');
  // First solution expanded by default so user immediately sees complete solution in place
  const [expandedSolutionId, setExpandedSolutionId] = useState<string | null>('organic-0');

  const toggleSolution = (key: string) => {
    setExpandedSolutionId(prev => (prev === key ? null : key));
  };

  if (isHealthy) {
    return (
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700">
            <Leaf className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-stone-900 font-['Plus_Jakarta_Sans']">
              Maintenance Plan for Healthy {cropName}
            </h3>
            <p className="text-xs text-stone-500">
              No chemical pesticide application is needed. Follow preventative agronomy.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-2">
              Soil & Nutrient Management
            </h4>
            <ul className="text-xs sm:text-sm text-stone-700 space-y-2">
              <li>&bull; Apply balanced N-P-K fertilizer according to soil test report.</li>
              <li>&bull; Incorporate well-decomposed farmyard manure or vermicompost to foster beneficial rhizosphere bacteria.</li>
              <li>&bull; Mulch root zones with organic straw to retain moisture and prevent weed competition.</li>
            </ul>
          </div>

          <div className="bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-2">
              Proactive Scouting Schedule
            </h4>
            <ul className="text-xs sm:text-sm text-stone-700 space-y-2">
              <li>&bull; Scout lower leaves twice weekly, especially after morning dew or heavy rain.</li>
              <li>&bull; Maintain drip irrigation to keep upper canopy dry and discourage fungal spore colonization.</li>
              <li>&bull; Monitor with yellow and blue sticky traps for early detection of insect vectors.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
      
      {/* Header */}
      <div className="p-6 sm:p-8 border-b border-stone-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Integrated Pest Management (IPM) Advisory
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 font-['Plus_Jakarta_Sans'] mt-2">
              Targeted Management Plan for {diseaseName} in {cropName}
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Prioritize organic biological remedies and cultural hygiene before applying chemical controls.
            </p>
          </div>

          {recommendations.urgent_action_required && (
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-800 px-3 py-1.5 rounded-xl text-xs font-bold">
              <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{t('urgentAction')}</span>
            </div>
          )}
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 mt-6 pt-2">
          <button
            onClick={() => setActiveTab('organic')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'organic'
                ? 'bg-emerald-800 text-white shadow'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            <Leaf className="w-4 h-4" />
            <span>{t('organicTitle')}</span>
          </button>

          <button
            onClick={() => setActiveTab('cultural')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'cultural'
                ? 'bg-emerald-800 text-white shadow'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            <Scissors className="w-4 h-4" />
            <span>{t('culturalTitle')}</span>
          </button>

          <button
            onClick={() => setActiveTab('chemical')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'chemical'
                ? 'bg-emerald-800 text-white shadow'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>{t('chemicalTitle')}</span>
          </button>

          <button
            onClick={() => setActiveTab('prevention')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'prevention'
                ? 'bg-emerald-800 text-white shadow'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{t('preventionTitle')}</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 sm:p-8">

        {/* Tab 1: Organic & Biological */}
        {activeTab === 'organic' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <h4 className="font-bold text-sm sm:text-base text-emerald-950">
                  Biological & Organic Remedies
                </h4>
              </div>
              <p className="text-emerald-800/90 text-xs mt-1">
                Biological antagonists, botanical extracts, and natural bio-fungicides to suppress disease while safeguarding soil biology and pollinators. Click any solution to view full step-by-step preparation and dosage details right here.
              </p>
            </div>

            <div className="space-y-3">
              {recommendations.organic_biological_treatments.map((treatment, idx) => {
                const key = `organic-${idx}`;
                const isExpanded = expandedSolutionId === key;
                const details = getDetailedSolutionGuide(treatment, cropName);

                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border transition overflow-hidden ${
                      isExpanded
                        ? 'border-emerald-600 bg-white shadow-md ring-1 ring-emerald-500/30'
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100/80 hover:border-emerald-400'
                    }`}
                  >
                    {/* Header Row (Clickable) */}
                    <div
                      onClick={() => toggleSolution(key)}
                      className="p-4 flex items-start gap-3.5 cursor-pointer select-none"
                    >
                      <div className="w-7 h-7 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-2xs">
                        {idx + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm text-stone-900 leading-relaxed font-semibold">
                          {treatment}
                        </p>

                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1">
                            {isExpanded ? (
                              <>
                                <ChevronUp className="w-3.5 h-3.5" />
                                <span>Hide preparation & dosage details</span>
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-3.5 h-3.5" />
                                <span>View detailed preparation & application steps</span>
                              </>
                            )}
                          </span>

                          <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
                            {isExpanded ? 'Details Open' : 'Click to View'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* In-Line Expanded Detailed Solution */}
                    {isExpanded && (
                      <div className="px-4 pb-5 pt-1 border-t border-emerald-100 bg-emerald-50/20 space-y-4">
                        
                        {/* 1. Dosage & Mixing Ratio */}
                        <div className="p-3.5 rounded-xl bg-emerald-100/80 border border-emerald-200 text-emerald-950">
                          <div className="flex items-center gap-1.5 mb-1 text-xs font-bold uppercase tracking-wider text-emerald-900">
                            <Droplets className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Recommended Dosage & Mixing Ratio</span>
                          </div>
                          <p className="text-xs sm:text-sm font-medium text-emerald-950">
                            {details.dosage}
                          </p>
                        </div>

                        {/* 2. Step-by-Step Preparation */}
                        <div>
                          <h5 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-2">
                            Step-by-Step Preparation & Spraying Protocol
                          </h5>
                          <div className="space-y-1.5 pl-1">
                            {details.preparationSteps.map((step, sIdx) => (
                              <div key={sIdx} className="flex items-start gap-2 text-xs sm:text-sm text-stone-700">
                                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                                  {sIdx + 1}
                                </span>
                                <span className="leading-relaxed">{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 3. Optimal Timing & Frequency */}
                        <div className="p-3 rounded-xl bg-white border border-stone-200 text-xs text-stone-700">
                          <div className="flex items-center gap-1.5 font-bold text-stone-900 mb-1">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>Optimal Application Timing & Spray Interval</span>
                          </div>
                          <p className="text-stone-600 leading-relaxed">
                            {details.optimalTiming}
                          </p>
                        </div>

                        {/* 4. Safety & Precautions */}
                        <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900">
                          <div className="flex items-center gap-1.5 font-bold text-amber-950 mb-1">
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                            <span>Safety & Phytotoxicity Precaution</span>
                          </div>
                          <p className="text-amber-800 leading-relaxed">
                            {details.safetyPrecautions}
                          </p>
                        </div>

                        {/* 5. Prompt to Consult Agronomist for further doubts */}
                        <div className="pt-2 border-t border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="text-[11px] text-stone-500 italic">
                            Need specific advice for your soil type or mixed tanks?
                          </span>
                          <button
                            type="button"
                            onClick={() => onAskAgronomist(`I have further doubts regarding "${treatment}" on my ${cropName} crop. Can you provide personalized advice on tank compatibility and regional dosage?`)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Have further doubts? Ask Kisan Sahayak</span>
                          </button>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Cultural Practices */}
        {activeTab === 'cultural' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-stone-800 text-xs sm:text-sm">
              <h4 className="font-bold text-sm sm:text-base text-stone-900">
                Cultural & Sanitation Practices
              </h4>
              <p className="text-xs text-stone-500 mt-1">
                Physical sanitation, canopy manipulation, and irrigation management to eliminate pathogen inoculums and alter moisture microclimates. Click to view detailed execution steps right here.
              </p>
            </div>

            <div className="space-y-3">
              {recommendations.cultural_management.map((cult, idx) => {
                const key = `cultural-${idx}`;
                const isExpanded = expandedSolutionId === key;
                const details = getDetailedSolutionGuide(cult, cropName);

                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border transition overflow-hidden ${
                      isExpanded
                        ? 'border-stone-400 bg-white shadow-md ring-1 ring-stone-300'
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100/80 hover:border-stone-300'
                    }`}
                  >
                    <div
                      onClick={() => toggleSolution(key)}
                      className="p-4 flex items-start gap-3.5 cursor-pointer select-none"
                    >
                      <div className="w-7 h-7 rounded-xl bg-stone-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-2xs">
                        {idx + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm text-stone-900 leading-relaxed font-semibold">
                          {cult}
                        </p>

                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[11px] font-bold text-stone-700 hover:text-stone-900 inline-flex items-center gap-1">
                            {isExpanded ? (
                              <>
                                <ChevronUp className="w-3.5 h-3.5" />
                                <span>Hide execution protocol</span>
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-3.5 h-3.5" />
                                <span>View detailed execution & sanitation steps</span>
                              </>
                            )}
                          </span>

                          <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
                            {isExpanded ? 'Details Open' : 'Click to View'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* In-Line Expanded Cultural Steps */}
                    {isExpanded && (
                      <div className="px-4 pb-5 pt-1 border-t border-stone-200 bg-stone-50/60 space-y-4">
                        
                        <div className="p-3 rounded-xl bg-white border border-stone-200 text-xs sm:text-sm">
                          <strong className="block text-stone-900 font-bold mb-1">
                            Specific Field Implementation Recommendation:
                          </strong>
                          <p className="text-stone-600 leading-relaxed">
                            {details.dosage}
                          </p>
                        </div>

                        <div>
                          <h5 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-2">
                            Field Execution Guidelines
                          </h5>
                          <div className="space-y-1.5 pl-1">
                            {details.preparationSteps.map((step, sIdx) => (
                              <div key={sIdx} className="flex items-start gap-2 text-xs sm:text-sm text-stone-700">
                                <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                                  {sIdx + 1}
                                </span>
                                <span className="leading-relaxed">{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-white border border-stone-200 text-xs text-stone-700">
                          <strong className="block text-stone-900 font-bold mb-0.5">
                            Optimal Weather Window:
                          </strong>
                          <p className="text-stone-600">{details.optimalTiming}</p>
                        </div>

                        <div className="pt-2 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="text-[11px] text-stone-500 italic">
                            Have questions on pruning techniques or drip scheduling?
                          </span>
                          <button
                            type="button"
                            onClick={() => onAskAgronomist(`I have further doubts regarding this cultural practice: "${cult}" for ${cropName}. Can you give me specific instructions?`)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Ask Kisan Sahayak for further doubts</span>
                          </button>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Chemical Treatments */}
        {activeTab === 'chemical' && (
          <div className="space-y-6">
            
            {/* Regulatory Caution Notice */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs">
              <div className="flex items-center gap-2 mb-1.5">
                <AlertOctagon className="w-4 h-4 text-amber-700 shrink-0" />
                <h4 className="font-bold text-sm text-amber-950 uppercase tracking-wide">
                  Verified Chemical Treatments (Strict Label Use)
                </h4>
              </div>
              <p className="text-amber-800 leading-relaxed">
                Always inspect product container labels for approved regional registrations, active ingredient percentages, and exact target crop tolerances. Wear complete Personal Protective Equipment (gloves, eye protection, respirator) and observe the mandatory Pre-Harvest Interval (PHI) before marketing or consuming produce.
              </p>
            </div>

            {recommendations.chemical_treatments.length === 0 ? (
              <div className="text-center py-8 text-stone-500 text-xs">
                No chemical fungicide required for this diagnosis. Cultural and biological controls are sufficient.
              </div>
            ) : (
              <div className="space-y-3">
                {recommendations.chemical_treatments.map((chem, idx) => {
                  const key = `chem-${idx}`;
                  const isExpanded = expandedSolutionId === key;

                  return (
                    <div
                      key={idx}
                      className={`rounded-2xl border transition overflow-hidden ${
                        isExpanded
                          ? 'border-emerald-600 bg-white shadow-md ring-1 ring-emerald-500/30'
                          : 'border-stone-200 bg-white hover:border-emerald-400'
                      }`}
                    >
                      {/* Clickable Header */}
                      <div
                        onClick={() => toggleSolution(key)}
                        className="p-4 sm:p-5 flex items-start gap-3.5 cursor-pointer select-none"
                      >
                        <div className="w-7 h-7 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-2xs">
                          {idx + 1}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-stone-100 gap-2">
                            <div>
                              <h4 className="text-sm sm:text-base font-bold text-stone-900">
                                {chem.name}
                              </h4>
                              <span className="text-xs text-stone-500">
                                Active Ingredient: <strong className="text-stone-700">{chem.active_ingredient}</strong>
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 text-xs font-semibold">
                                <Clock className="w-3.5 h-3.5 text-stone-500" />
                                <span>PHI: {chem.safety_period_days} Days</span>
                              </span>
                              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                                Dosage: {chem.dosage}
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                            {chem.instructions}
                          </p>

                          <div className="mt-2 pt-1 flex items-center justify-between">
                            <span className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1">
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="w-3.5 h-3.5" />
                                  <span>Hide mixing & PPE safety steps</span>
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-3.5 h-3.5" />
                                  <span>View detailed mixing, water calibration & spray safety</span>
                                </>
                              )}
                            </span>

                            <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
                              {isExpanded ? 'Details Open' : 'Click to View'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* In-Line Expanded Chemical Details */}
                      {isExpanded && (
                        <div className="px-5 pb-5 pt-1 border-t border-emerald-100 bg-emerald-50/20 space-y-4">
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="p-3 bg-white rounded-xl border border-stone-200">
                              <span className="block font-bold text-stone-900 mb-1">
                                Tank Calibration & Water Volume:
                              </span>
                              <p className="text-stone-600">
                                Calibrate for approx. 150–200 liters of water per acre (400–500 L/ha) for high-volume foliar sprayers.
                              </p>
                            </div>

                            <div className="p-3 bg-white rounded-xl border border-stone-200">
                              <span className="block font-bold text-stone-900 mb-1">
                                Resistance Management (FRAC):
                              </span>
                              <p className="text-stone-600">
                                Rotate this active ingredient with a different chemical group after 1 or 2 sprays to prevent fungal immunity.
                              </p>
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                            <span className="block font-bold uppercase tracking-wider text-amber-950 mb-1">
                              Mandatory PPE & Re-Entry Period:
                            </span>
                            <p className="text-amber-800 leading-relaxed">
                              Wear chemical goggles, chemical-resistant gloves, and an approved respirator mask. Do not re-enter the treated field for at least 12–24 hours until sprays dry completely.
                            </p>
                          </div>

                          <div className="pt-2 border-t border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <span className="text-[11px] text-stone-500 italic">
                              Have doubts about tank mixing with insecticides or fertilizers?
                            </span>
                            <button
                              type="button"
                              onClick={() => onAskAgronomist(`Can you give me detailed application instructions, tank mix compatibility, and spray interval for ${chem.name} on ${cropName}?`)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Have further doubts? Ask Kisan Sahayak</span>
                            </button>
                          </div>

                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* Tab 4: Prevention */}
        {activeTab === 'prevention' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-stone-800 text-xs sm:text-sm">
              <h4 className="font-bold text-sm sm:text-base text-stone-900">
                Long-Term Preventive Measures
              </h4>
              <p className="text-xs text-stone-500 mt-1">
                Proactive protocols to prevent disease recurrence in future seasons through seed genetics, crop rotation, and field hygiene. Click to view full planning details right here.
              </p>
            </div>

            <div className="space-y-3">
              {recommendations.prevention.map((prev, idx) => {
                const key = `prevention-${idx}`;
                const isExpanded = expandedSolutionId === key;
                const details = getDetailedSolutionGuide(prev, cropName);

                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border transition overflow-hidden ${
                      isExpanded
                        ? 'border-emerald-600 bg-white shadow-md ring-1 ring-emerald-500/30'
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100/80 hover:border-emerald-400'
                    }`}
                  >
                    <div
                      onClick={() => toggleSolution(key)}
                      className="p-4 flex items-start gap-3.5 cursor-pointer select-none"
                    >
                      <div className="w-7 h-7 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-2xs">
                        {idx + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-semibold">
                          {prev}
                        </p>

                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1">
                            {isExpanded ? (
                              <>
                                <ChevronUp className="w-3.5 h-3.5" />
                                <span>Hide preventive protocol details</span>
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-3.5 h-3.5" />
                                <span>View detailed crop rotation & hygiene protocol</span>
                              </>
                            )}
                          </span>

                          <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
                            {isExpanded ? 'Details Open' : 'Click to View'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* In-Line Expanded Prevention Steps */}
                    {isExpanded && (
                      <div className="px-4 pb-5 pt-1 border-t border-emerald-100 bg-emerald-50/20 space-y-4">
                        
                        <div className="p-3 rounded-xl bg-white border border-stone-200 text-xs sm:text-sm">
                          <strong className="block text-stone-900 font-bold mb-1">
                            Recommended Seasonal Protocol:
                          </strong>
                          <p className="text-stone-600 leading-relaxed">
                            {details.dosage}
                          </p>
                        </div>

                        <div>
                          <h5 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-2">
                            Step-by-Step Prevention Protocol
                          </h5>
                          <div className="space-y-1.5 pl-1">
                            {details.preparationSteps.map((step, sIdx) => (
                              <div key={sIdx} className="flex items-start gap-2 text-xs sm:text-sm text-stone-700">
                                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                                  {sIdx + 1}
                                </span>
                                <span className="leading-relaxed">{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900">
                          <strong className="block text-amber-950 font-bold mb-0.5">
                            Agronomic Caution:
                          </strong>
                          <p className="text-amber-800">{details.safetyPrecautions}</p>
                        </div>

                        <div className="pt-2 border-t border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="text-[11px] text-stone-500 italic">
                            Want recommendations on resistant hybrid cultivars for your region?
                          </span>
                          <button
                            type="button"
                            onClick={() => onAskAgronomist(`I have further doubts regarding this prevention measure: "${prev}" for ${cropName}. What resistant varieties or rotation schedules do you recommend?`)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Ask Kisan Sahayak for further doubts</span>
                          </button>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
