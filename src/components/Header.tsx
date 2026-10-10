import React from 'react';
import { Sprout, ShieldAlert, CloudSun, Database, Globe } from 'lucide-react';
import { SupportedLanguage } from '../types/index.ts';
import { getTranslation } from '../utils/i18n.ts';

interface HeaderProps {
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onOpenDisclaimer: () => void;
  scanCount: number;
  currentTemp?: number;
  weatherCondition?: string;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  onOpenDisclaimer,
  scanCount,
  currentTemp,
  weatherCondition
}) => {
  const t = (k: string) => getTranslation(language, k);

  return (
    <header className="bg-emerald-900 border-b border-emerald-800 text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-950/40 border border-emerald-300/30">
              <Sprout className="w-7 h-7 text-emerald-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black tracking-tight text-white font-['Plus_Jakarta_Sans']">
                  Verdant <span className="text-emerald-400">AI</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-800/80 text-emerald-300 border border-emerald-700/60">
                  AgriShield v2.5
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 font-medium hidden md:block">
                {t('tagline')}
              </p>
            </div>
          </div>

          {/* Right Controls: Weather status, DB Scans, Language, Disclaimer */}
          <div className="flex items-center space-x-2.5 sm:space-x-4">
            
            {/* Quick Weather Status Pill */}
            {currentTemp !== undefined && (
              <div className="hidden lg:flex items-center space-x-2 bg-emerald-950/60 border border-emerald-800/80 px-3 py-1.5 rounded-xl text-xs text-emerald-100">
                <CloudSun className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>
                  <strong className="text-white font-semibold">{currentTemp}°C</strong> &middot; {weatherCondition || 'Field Weather'}
                </span>
              </div>
            )}

            {/* MongoDB Scan Counter */}
            <div className="hidden sm:flex items-center space-x-1.5 bg-emerald-950/50 border border-emerald-800/60 px-2.5 py-1.5 rounded-xl text-xs text-emerald-200" title="Scans persisted in MongoDB collection">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>{scanCount} Scans</span>
            </div>

            {/* Language Selector */}
            <div className="relative flex items-center bg-emerald-950/70 border border-emerald-700/70 rounded-xl px-2 py-1">
              <Globe className="w-3.5 h-3.5 text-emerald-400 mr-1.5 shrink-0" />
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
                className="bg-transparent text-xs font-semibold text-emerald-100 focus:outline-none cursor-pointer pr-1"
                aria-label="Select Language"
              >
                <option value="en" className="bg-emerald-900 text-white">English (EN)</option>
                <option value="te" className="bg-emerald-900 text-white">తెలుగు (Telugu)</option>
                <option value="hi" className="bg-emerald-900 text-white">हिन्दी (Hindi)</option>
                <option value="es" className="bg-emerald-900 text-white">Español (ES)</option>
              </select>
            </div>

            {/* Disclaimer Button */}
            <button
              onClick={onOpenDisclaimer}
              className="flex items-center space-x-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-2.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer"
              title="Responsible AI and Agricultural Safety Advisory"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Safety Notice</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
