import React, { useState } from 'react';
import {
  Clock,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Calendar,
  CloudSun,
  Printer
} from 'lucide-react';
import { ScanRecord, SupportedLanguage } from '../types/index.ts';
import { getTranslation } from '../utils/i18n.ts';

interface ScanHistoryProps {
  scans: ScanRecord[];
  language: SupportedLanguage;
  onSelectScan: (scan: ScanRecord) => void;
  onDeleteScan: (id: string) => Promise<void>;
  isLoading: boolean;
}

export const ScanHistory: React.FC<ScanHistoryProps> = ({
  scans,
  language,
  onSelectScan,
  onDeleteScan,
  isLoading
}) => {
  const t = (k: string) => getTranslation(language, k);

  const [search, setSearch] = useState<string>('');
  const [filterCrop, setFilterCrop] = useState<string>('All');
  const [selectedScanDetail, setSelectedScanDetail] = useState<ScanRecord | null>(null);

  const crops = ['All', ...Array.from(new Set(scans.map((s) => s.crop)))];

  const filtered = scans.filter((s) => {
    const matchesCrop = filterCrop === 'All' || s.crop === filterCrop;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      s.crop.toLowerCase().includes(q) ||
      s.disease_name.toLowerCase().includes(q) ||
      s.predicted_class.toLowerCase().includes(q) ||
      (s.notes && s.notes.toLowerCase().includes(q));
    return matchesCrop && matchesSearch;
  });

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return iso;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Filter */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                MongoDB Persistence
              </span>
              <span className="text-xs font-semibold text-stone-500">
                {scans.length} total records
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-['Plus_Jakarta_Sans'] mt-2">
              Field Scan History & Diagnostic Log
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              All leaf scans are persisted with timestamp, confidence scores, and weather microclimate context.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl border border-stone-300 transition cursor-pointer"
              title="Print log sheet"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Field Log</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by crop, disease name, or notes..."
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-stone-500" />
            <select
              value={filterCrop}
              onChange={(e) => setFilterCrop(e.target.value)}
              className="text-xs font-semibold text-stone-800 border border-stone-300 rounded-xl px-3 py-2 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {crops.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Scans Table / Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center text-stone-500 text-sm">
          {t('noScans')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((scan) => (
            <div
              key={scan._id}
              className="bg-white rounded-3xl border border-stone-200 shadow-sm p-5 hover:border-emerald-500 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {scan.crop}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-stone-400 font-medium">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(scan.created_at)}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-stone-900 font-['Plus_Jakarta_Sans']">
                      {scan.disease_name}
                    </h3>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {Math.round(scan.confidence * 100)}%
                    </span>
                  </div>

                  <p className="text-[11px] font-mono text-stone-400 mt-1 truncate">
                    {scan.predicted_class}
                  </p>

                  {/* Weather snapshot if available */}
                  {scan.weather_context && (
                    <div className="mt-3 p-2.5 bg-stone-50 rounded-xl border border-stone-100 flex items-center gap-2 text-[11px] text-stone-600">
                      <CloudSun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{scan.weather_context.temperature}°C &middot; {scan.weather_context.humidity}% RH &middot; {scan.weather_context.condition}</span>
                    </div>
                  )}

                  {/* Notes */}
                  {scan.notes && (
                    <p className="text-xs text-stone-600 italic mt-2 bg-stone-50/50 p-2 rounded-lg border border-stone-100">
                      "{scan.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onSelectScan(scan)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Inspect Diagnosis</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Delete scan record for ${scan.crop} - ${scan.disease_name}?`)) {
                      onDeleteScan(scan._id);
                    }
                  }}
                  className="p-1.5 text-stone-400 hover:text-rose-600 transition rounded-lg hover:bg-rose-50 cursor-pointer"
                  title={t('deleteScan')}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
