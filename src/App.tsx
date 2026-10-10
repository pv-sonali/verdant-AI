import React, { useState, useEffect } from 'react';
import {
  Scan,
  BookOpen,
  CloudSun,
  Library,
  History,
  MessageSquare,
  Sprout,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { Header } from './components/Header.tsx';
import { ScanView } from './components/ScanView.tsx';
import { DiagnosisResultCard } from './components/DiagnosisResultCard.tsx';
import { TreatmentRecommendations } from './components/TreatmentRecommendations.tsx';
import { WeatherWidget } from './components/WeatherWidget.tsx';
import { DiseaseEncyclopedia } from './components/DiseaseEncyclopedia.tsx';
import { ScanHistory } from './components/ScanHistory.tsx';
import { AgronomistChat } from './components/AgronomistChat.tsx';
import { DisclaimerModal } from './components/DisclaimerModal.tsx';
import {
  PredictionResult,
  ScanRecord,
  WeatherData,
  SupportedLanguage
} from './types/index.ts';
import { getTranslation } from './utils/i18n.ts';

export default function App() {
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [activeTab, setActiveTab] = useState<'scan' | 'advisory' | 'weather' | 'encyclopedia' | 'history' | 'chat'>('scan');
  
  const [currentPrediction, setCurrentPrediction] = useState<PredictionResult | null>(null);
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  
  const [isDiagnosing, setIsDiagnosing] = useState<boolean>(false);
  const [isWeatherLoading, setIsWeatherLoading] = useState<boolean>(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState<boolean>(false);
  const [chatInitialQuery, setChatInitialQuery] = useState<string>('');

  const t = (k: string) => getTranslation(language, k);

  // Load initial scans & weather on mount
  useEffect(() => {
    fetchScans();
    fetchWeather(17.3850, 78.4867, 'Regional Agricultural Station');
  }, []);

  const fetchScans = async () => {
    try {
      const res = await fetch('/api/v1/scans');
      if (res.ok) {
        const data = await res.json();
        setScans(data);
      }
    } catch (err) {
      console.warn('Failed to load initial scans:', err);
    }
  };

  const fetchWeather = async (lat: number, lon: number, cityName: string) => {
    setIsWeatherLoading(true);
    try {
      const res = await fetch(`/api/v1/weather?lat=${lat}&lon=${lon}&city=${encodeURIComponent(cityName)}`);
      if (res.ok) {
        const data = await res.json();
        setWeather(data);
      }
    } catch (err) {
      console.warn('Failed to load weather:', err);
    } finally {
      setIsWeatherLoading(false);
    }
  };

  const handleDiagnose = async (
    imageBase64: string,
    mimeType: string,
    cropHint?: string,
    notes?: string
  ) => {
    setIsDiagnosing(true);
    try {
      const res = await fetch('/api/v1/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          mimeType,
          cropHint,
          notes,
          location: weather ? { lat: 17.3850, lon: 78.4867, name: weather.city } : undefined
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Server error (${res.status})`);
      }

      const result: PredictionResult = await res.json();
      setCurrentPrediction(result);
      
      // Refresh scan list
      fetchScans();

      // Scroll smoothly to diagnosis section
      window.scrollTo({ top: 380, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Diagnosis failed:', err);
      alert(`Diagnosis failed: ${err.message || 'Please check network and try again.'}`);
    } finally {
      setIsDiagnosing(false);
    }
  };

  const handleDeleteScan = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/scans/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setScans((prev) => prev.filter((s) => s._id !== id));
        if (currentPrediction?.scan_id === id) {
          setCurrentPrediction(null);
        }
      }
    } catch (err) {
      console.error('Failed to delete scan:', err);
    }
  };

  const handleSelectHistoryScan = (scan: ScanRecord) => {
    // Reconstruct PredictionResult from saved ScanRecord
    const pred: PredictionResult = {
      scan_id: scan._id,
      crop: scan.crop,
      predicted_class: scan.predicted_class,
      disease_name: scan.disease_name,
      is_healthy: scan.is_healthy,
      confidence: scan.confidence,
      severity_stage: scan.severity_stage,
      affected_parts: ['Foliage'],
      visual_symptoms_observed: ['Historic logged pathology symptom'],
      pathogen_type: scan.is_healthy ? 'Healthy' : 'Fungus',
      uncertainty_warning: null,
      status: scan.status,
      created_at: scan.created_at,
      image_url: scan.image_url,
      recommendations: scan.recommendations || {
        prevention: ['Maintain crop rotation'],
        cultural_management: ['Prune infected leaves'],
        organic_biological_treatments: ['Apply neem oil formulation'],
        chemical_treatments: [],
        expert_review_recommended: false,
        urgent_action_required: false
      }
    };
    setCurrentPrediction(pred);
    setActiveTab('scan');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleAskAgronomist = (query: string) => {
    setChatInitialQuery(query);
    setActiveTab('chat');
  };

  const handleExportReport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 font-sans selection:bg-emerald-200">
      
      {/* Top Header */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
        scanCount={scans.length}
        currentTemp={weather?.temperature}
        weatherCondition={weather?.condition_text}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Navigation Tabs Bar */}
        <div className="bg-white p-2 rounded-2xl border border-stone-200/90 shadow-2xs flex items-center gap-1.5 overflow-x-auto">
          
          <button
            onClick={() => setActiveTab('scan')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'scan'
                ? 'bg-emerald-800 text-white shadow'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <Scan className="w-4 h-4" />
            <span>{t('tabScan')}</span>
          </button>

          <button
            onClick={() => setActiveTab('advisory')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'advisory'
                ? 'bg-emerald-800 text-white shadow'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{t('tabAdvisory')}</span>
          </button>

          <button
            onClick={() => setActiveTab('weather')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'weather'
                ? 'bg-emerald-800 text-white shadow'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <CloudSun className="w-4 h-4" />
            <span>{t('tabWeather')}</span>
          </button>

          <button
            onClick={() => setActiveTab('encyclopedia')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'encyclopedia'
                ? 'bg-emerald-800 text-white shadow'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <Library className="w-4 h-4" />
            <span>{t('tabEncyclopedia')}</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'history'
                ? 'bg-emerald-800 text-white shadow'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <History className="w-4 h-4" />
            <span>{t('tabHistory')}</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-emerald-800 text-white shadow'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t('tabChat')}</span>
          </button>

        </div>

        {/* Tab 1: Scan & Diagnose */}
        {activeTab === 'scan' && (
          <div className="space-y-6">
            
            {/* Upload, Diagnosis Result (directly below image), and Samples Panel */}
            <ScanView
              language={language}
              onDiagnose={handleDiagnose}
              isLoading={isDiagnosing}
              currentPrediction={currentPrediction}
              onNavigateToAdvisory={() => setActiveTab('advisory')}
              onNavigateToChat={handleAskAgronomist}
              onExportReport={handleExportReport}
            />

          </div>
        )}

        {/* Tab 2: Field Advisory */}
        {activeTab === 'advisory' && (
          <div className="space-y-6">
            {currentPrediction ? (
              <TreatmentRecommendations
                recommendations={currentPrediction.recommendations}
                cropName={currentPrediction.crop}
                diseaseName={currentPrediction.disease_name}
                isHealthy={currentPrediction.is_healthy}
                language={language}
                onAskAgronomist={handleAskAgronomist}
              />
            ) : (
              <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 font-['Plus_Jakarta_Sans']">
                  No Active Crop Scan Selected
                </h3>
                <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
                  Scan a crop leaf or select a record from your Scan History to generate tailored chemical dosages and organic bio-management steps.
                </p>
                <button
                  onClick={() => setActiveTab('scan')}
                  className="mt-6 px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm rounded-xl shadow cursor-pointer transition inline-flex items-center gap-2"
                >
                  <span>Go to Scan & Diagnose</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Weather & Microclimate */}
        {activeTab === 'weather' && (
          <WeatherWidget
            weather={weather}
            language={language}
            onRefreshLocation={fetchWeather}
            isLoading={isWeatherLoading}
          />
        )}

        {/* Tab 4: Disease Encyclopedia */}
        {activeTab === 'encyclopedia' && (
          <DiseaseEncyclopedia
            language={language}
            onAskAgronomist={handleAskAgronomist}
          />
        )}

        {/* Tab 5: Scan History */}
        {activeTab === 'history' && (
          <ScanHistory
            scans={scans}
            language={language}
            onSelectScan={handleSelectHistoryScan}
            onDeleteScan={handleDeleteScan}
            isLoading={false}
          />
        )}

        {/* Tab 6: Agronomist Chat */}
        {activeTab === 'chat' && (
          <AgronomistChat
            language={language}
            cropContext={currentPrediction?.crop}
            diseaseContext={currentPrediction?.disease_name}
            initialQuery={chatInitialQuery}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-stone-200 bg-white py-10 text-stone-600 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Sprout className="w-5 h-5 text-emerald-700" />
            <span className="font-bold text-stone-900">Verdant AI</span>
            <span>&mdash; Smarter Farming. Healthier Crops. Greener Tomorrow.</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsDisclaimerOpen(true)}
              className="text-stone-500 hover:text-emerald-700 underline cursor-pointer"
            >
              Responsible AI & Chemical Safety
            </button>
            <span>&middot;</span>
            <span>Open-Meteo Weather API</span>
            <span>&middot;</span>
            <span>MongoDB Scan History</span>
          </div>
        </div>
      </footer>

      {/* Safety & Responsible AI Disclaimer Modal */}
      <DisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
        language={language}
      />

    </div>
  );
}
