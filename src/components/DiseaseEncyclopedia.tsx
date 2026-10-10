import React, { useState } from 'react';
import {
  Search,
  Filter,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Thermometer,
  Droplets,
  ExternalLink,
  X
} from 'lucide-react';
import { DiseaseRecord, SupportedLanguage } from '../types/index.ts';
import { AGRICULTURAL_KNOWLEDGE_BASE } from '../server/knowledgeBase.ts';
import { getTranslation } from '../utils/i18n.ts';

interface DiseaseEncyclopediaProps {
  language: SupportedLanguage;
  onAskAgronomist: (query: string) => void;
}

const CROPS = [
  'All Crops',
  'Tomato',
  'Potato',
  'Corn (Maize)',
  'Rice',
  'Apple',
  'Grape',
  'Pepper (Capsicum)',
  'Citrus',
  'Cotton'
];

export const DiseaseEncyclopedia: React.FC<DiseaseEncyclopediaProps> = ({
  language,
  onAskAgronomist
}) => {
  const t = (k: string) => getTranslation(language, k);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCrop, setSelectedCrop] = useState<string>('All Crops');
  const [activeModalDisease, setActiveModalDisease] = useState<DiseaseRecord | null>(null);

  const filtered = AGRICULTURAL_KNOWLEDGE_BASE.filter((item) => {
    const matchesCrop = selectedCrop === 'All Crops' || item.crop.toLowerCase().includes(selectedCrop.toLowerCase().split(' ')[0]);
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.disease_name.toLowerCase().includes(q) ||
      item.crop.toLowerCase().includes(q) ||
      item.scientific_name.toLowerCase().includes(q) ||
      item.symptoms.some((s) => s.toLowerCase().includes(q)) ||
      item.pathogen_type.toLowerCase().includes(q);
    return matchesCrop && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Search */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8">
        <div className="max-w-2xl">
          <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            Curated Knowledge Base
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-['Plus_Jakarta_Sans'] mt-2">
            Agricultural Crop Pathology Encyclopedia
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Browse verified pathogen profiles, visual symptom checklists, and integrated management protocols derived from FAO, USDA, and ICAR research.
          </p>
        </div>

        {/* Search Bar & Filter */}
        <div className="mt-6 flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchDisease')}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          {/* Quick Crop Selector */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="text-xs font-semibold text-stone-800 border border-stone-300 rounded-xl px-3 py-2.5 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {CROPS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 flex-wrap mt-4">
          {CROPS.slice(0, 7).map((crop) => (
            <button
              key={crop}
              onClick={() => setSelectedCrop(crop)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                selectedCrop === crop
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {crop}
            </button>
          ))}
        </div>
      </div>

      {/* Disease Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((disease) => (
          <div
            key={disease.id}
            className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 hover:border-emerald-500 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 uppercase tracking-wide">
                  {disease.crop}
                </span>
                <span className="text-[11px] font-semibold text-stone-500">
                  {disease.pathogen_type}
                </span>
              </div>

              <h3 className="text-lg font-bold text-stone-900 font-['Plus_Jakarta_Sans']">
                {disease.disease_name}
              </h3>
              <p className="text-xs text-stone-400 italic font-serif mt-0.5">
                {disease.scientific_name}
              </p>

              <div className="mt-4 pt-3 border-t border-stone-100">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                  Diagnostic Symptoms:
                </span>
                <ul className="text-xs text-stone-600 space-y-1">
                  {disease.symptoms.slice(0, 2).map((sym, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 line-clamp-2">
                      <span className="w-1 h-1 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                      <span>{sym}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveModalDisease(disease)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Read Full Advisory Profile</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center text-stone-500 text-sm">
          No crop diseases match your current search criteria. Try clearing filters or searching for terms like "blight", "rust", or "tomato".
        </div>
      )}

      {/* Disease Detail Modal */}
      {activeModalDisease && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto border border-stone-200">
            
            <button
              onClick={() => setActiveModalDisease(null)}
              className="absolute top-6 right-6 p-1 rounded-lg text-stone-400 hover:text-stone-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                {activeModalDisease.crop}
              </span>
              <span className="text-xs uppercase font-semibold text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-md">
                {activeModalDisease.pathogen_type}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-stone-900 font-['Plus_Jakarta_Sans']">
              {activeModalDisease.disease_name}
            </h2>
            <p className="text-xs text-stone-500 italic font-serif">
              Causal Agent: {activeModalDisease.scientific_name}
            </p>

            <div className="mt-6 space-y-6 text-xs sm:text-sm text-stone-700">
              
              {/* Symptoms */}
              <div>
                <h4 className="font-bold text-stone-900 uppercase text-xs tracking-wider mb-2">
                  Hallmark Symptoms
                </h4>
                <ul className="space-y-1.5 pl-4 list-disc text-stone-600">
                  {activeModalDisease.symptoms.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              {/* Favorable Conditions */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                <h4 className="font-bold text-amber-950 uppercase text-xs tracking-wider mb-2">
                  Microclimate Infection Drivers
                </h4>
                <div className="space-y-1 text-xs text-amber-900">
                  <p><strong>Temperature:</strong> {activeModalDisease.favorable_conditions.temp_range}</p>
                  <p><strong>Humidity:</strong> {activeModalDisease.favorable_conditions.humidity_threshold}</p>
                  <p><strong>Moisture:</strong> {activeModalDisease.favorable_conditions.rain_dependency}</p>
                </div>
              </div>

              {/* Biological Controls */}
              <div>
                <h4 className="font-bold text-stone-900 uppercase text-xs tracking-wider mb-2">
                  Organic & Biological Management
                </h4>
                <ul className="space-y-1.5 pl-4 list-disc text-stone-600">
                  {activeModalDisease.organic_biological_treatments.map((o, i) => (
                    <li key={i}>{o}</li>
                  ))}
                </ul>
              </div>

              {/* Chemical Treatments */}
              {activeModalDisease.chemical_treatments.length > 0 && (
                <div>
                  <h4 className="font-bold text-stone-900 uppercase text-xs tracking-wider mb-2">
                    Chemical Fungicides / Bactericides (Label Use)
                  </h4>
                  <div className="space-y-2">
                    {activeModalDisease.chemical_treatments.map((c, i) => (
                      <div key={i} className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                        <strong className="text-stone-900">{c.name}</strong> ({c.active_ingredient}) &middot; <span className="text-emerald-700 font-semibold">{c.dosage}</span> &middot; PHI: {c.safety_period_days} days
                        <p className="text-stone-500 mt-1">{c.instructions}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Expert Guidance */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
                <strong className="block font-bold mb-1">Pathologist Advisory:</strong>
                {activeModalDisease.expert_guidance}
              </div>

              {/* References */}
              <div className="text-[11px] text-stone-400 pt-3 border-t border-stone-100">
                References: {activeModalDisease.references.join(', ')}
              </div>

            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 flex justify-end gap-2">
              <button
                onClick={() => {
                  setActiveModalDisease(null);
                  onAskAgronomist(`Tell me more about managing ${activeModalDisease.disease_name} on ${activeModalDisease.crop}.`);
                }}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow cursor-pointer"
              >
                Ask Agronomist AI About This Disease
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
