import React, { useState, useRef, useEffect } from 'react';
import { Upload, Camera, Image as ImageIcon, Sparkles, AlertCircle, RefreshCw, X, ChevronRight, Check } from 'lucide-react';
import { SupportedLanguage, PredictionResult } from '../types/index.ts';
import { getTranslation } from '../utils/i18n.ts';
import { SAMPLE_LEAVES, SampleLeaf } from '../constants/sampleImages.ts';
import { DiagnosisResultCard } from './DiagnosisResultCard.tsx';
import { TreatmentRecommendations } from './TreatmentRecommendations.tsx';

interface ScanViewProps {
  language: SupportedLanguage;
  onDiagnose: (imageBase64: string, mimeType: string, cropHint?: string, notes?: string) => Promise<void>;
  isLoading: boolean;
  currentPrediction?: PredictionResult | null;
  onNavigateToAdvisory?: () => void;
  onNavigateToChat?: (query: string) => void;
  onExportReport?: () => void;
}

const COMMON_CROPS = [
  'Auto-Detect Crop',
  'Tomato',
  'Potato',
  'Corn (Maize)',
  'Rice (Paddy)',
  'Apple',
  'Grape',
  'Pepper (Capsicum / Chilli)',
  'Citrus (Orange / Lemon)',
  'Cotton',
  'Wheat',
  'Soybean',
  'Strawberry'
];

export const ScanView: React.FC<ScanViewProps> = ({
  language,
  onDiagnose,
  isLoading,
  currentPrediction,
  onNavigateToAdvisory,
  onNavigateToChat,
  onExportReport
}) => {
  const t = (k: string) => getTranslation(language, k);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [cropHint, setCropHint] = useState<string>('Auto-Detect Crop');
  const [farmerNotes, setFarmerNotes] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync selectedImage if a scan from history with image_url is chosen
  useEffect(() => {
    if (currentPrediction?.image_url && !selectedImage) {
      setSelectedImage(currentPrediction.image_url);
      if (currentPrediction.crop) {
        setCropHint(currentPrediction.crop);
      }
    }
  }, [currentPrediction]);

  // Smooth scroll to diagnosis results whenever a new prediction is generated
  useEffect(() => {
    if (currentPrediction) {
      setTimeout(() => {
        const el = document.getElementById('diagnosis-results');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [currentPrediction]);

  // Camera states
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera on unmount or cancel
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported on this browser or device.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError(err.message || 'Unable to access camera. Please upload an image file instead.');
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setSelectedImage(dataUrl);
      setMimeType('image/jpeg');
      stopCamera();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setErrorMsg(null);
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid image file (JPEG, PNG, WEBP, etc.).');
      return;
    }
    // Validate size (max 15MB)
    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('Image size exceeds 15MB limit. Please choose a smaller photo.');
      return;
    }

    setMimeType(file.type);
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const selectSample = (sample: SampleLeaf) => {
    setSelectedImage(sample.svgDataUri);
    setMimeType('image/svg+xml');
    setCropHint(sample.crop);
    setFarmerNotes(`Inspecting ${sample.crop} sample leaf with visible ${sample.diseaseName} symptoms.`);
    setErrorMsg(null);
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      setErrorMsg('Please select or capture a leaf photo first.');
      return;
    }
    setErrorMsg(null);
    const finalCrop = cropHint === 'Auto-Detect Crop' ? undefined : cropHint;
    await onDiagnose(selectedImage, mimeType, finalCrop, farmerNotes);
  };

  return (
    <div className="space-y-6">
      
      {/* Upload & Capture Panel */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 lg:p-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-stone-100 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-['Plus_Jakarta_Sans'] flex items-center gap-2">
              <span>{t('uploadTitle')}</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                AI Vision
              </span>
            </h2>
            <p className="text-sm text-stone-500 mt-1">
              {t('uploadSubtitle')}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {!isCameraActive ? (
              <button
                type="button"
                onClick={startCamera}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs sm:text-sm rounded-xl border border-emerald-200 transition cursor-pointer"
              >
                <Camera className="w-4 h-4 text-emerald-700" />
                <span>{t('cameraBtn')}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopCamera}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 font-semibold text-xs sm:text-sm rounded-xl border border-rose-200 transition cursor-pointer"
              >
                <X className="w-4 h-4 text-rose-700" />
                <span>{t('closeCamera')}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs sm:text-sm rounded-xl border border-stone-300 transition cursor-pointer"
            >
              <ImageIcon className="w-4 h-4 text-stone-600" />
              <span>Browse Files</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Camera stream view if active */}
        {isCameraActive && (
          <div className="mt-6 rounded-2xl overflow-hidden bg-black relative border-2 border-emerald-500 shadow-inner">
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              className="w-full max-h-[420px] object-contain mx-auto"
            />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-4 px-4">
              <button
                type="button"
                onClick={capturePhoto}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full shadow-lg flex items-center gap-2 cursor-pointer transition transform active:scale-95"
              >
                <Camera className="w-5 h-5" />
                <span>{t('takeSnapshot')}</span>
              </button>
            </div>
          </div>
        )}

        {cameraError && (
          <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{cameraError}</span>
          </div>
        )}

        {/* Drag and Drop Box & Preview */}
        {!isCameraActive && (
          <div className="mt-6">
            {!selectedImage ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition cursor-pointer flex flex-col items-center justify-center ${
                  isDragging
                    ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]'
                    : 'border-stone-300 hover:border-emerald-500 hover:bg-stone-50/60 bg-stone-50/20'
                }`}
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 mb-4 shadow-sm">
                  <Upload className="w-8 h-8 stroke-[2]" />
                </div>
                <p className="text-base font-semibold text-stone-800">
                  {t('dropHint')}
                </p>
                <p className="text-xs text-stone-400 mt-1 max-w-sm">
                  Supports JPEG, PNG, WEBP, or SVG images up to 15MB. Best results with sharp close-ups of leaf lesions and margins.
                </p>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-900 flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/2 p-4 flex justify-center items-center bg-stone-950/70">
                  <img
                    src={selectedImage}
                    alt="Selected leaf preview"
                    className="max-h-72 w-auto object-contain rounded-xl border border-stone-800 shadow"
                  />
                </div>
                <div className="w-full md:w-1/2 p-6 bg-white flex flex-col justify-between self-stretch">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        Image Ready For Analysis
                      </span>
                      <button
                        onClick={() => setSelectedImage(null)}
                        className="text-stone-400 hover:text-stone-700 p-1 rounded-lg transition"
                        title="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Crop selector dropdown */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        {t('cropHintLabel')}
                      </label>
                      <select
                        value={cropHint}
                        onChange={(e) => setCropHint(e.target.value)}
                        className="w-full text-xs sm:text-sm font-medium border border-stone-300 rounded-xl px-3 py-2 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        {COMMON_CROPS.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-stone-400 mt-1">
                        Providing the crop type helps the model apply exact agronomic thresholds.
                      </p>
                    </div>

                    {/* Farmer Notes */}
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Field Observation / Notes (Optional)
                      </label>
                      <input
                        type="text"
                        value={farmerNotes}
                        onChange={(e) => setFarmerNotes(e.target.value)}
                        placeholder="e.g., North row plot, noticed curling after morning mist"
                        className="w-full text-xs sm:text-sm border border-stone-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Run Button */}
                  <div className="pt-4 mt-4 border-t border-stone-100">
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={handleSubmit}
                      className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Diagnosing Crop Health...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-emerald-200" />
                          <span>{t('diagnoseBtn')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Diagnosis in progress animation */}
        {isLoading && (
          <div className="mt-6 p-6 rounded-2xl bg-emerald-950 text-white border border-emerald-800 shadow-inner">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin shrink-0" />
              <div>
                <h4 className="font-bold text-sm sm:text-base text-emerald-200">
                  {t('analyzingText')}
                </h4>
                <p className="text-xs text-emerald-400/80 mt-0.5">
                  Deep morphological analysis &middot; PlantVillage & FAO benchmark &middot; Microclimate integration
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4 pt-4 border-t border-emerald-900/80 text-[11px] text-emerald-300/80">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cellular lesion pattern match</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Evaluating pathogen class</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Formulating treatment dosage</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Diagnosis Result & Treatment Plan (Positioned directly below the uploaded image) */}
      {currentPrediction && (
        <div id="diagnosis-results" className="space-y-6 pt-1">
          <div className="flex items-center gap-2 px-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-950 font-['Plus_Jakarta_Sans']">
              Diagnosis Result for Uploaded Leaf
            </h3>
          </div>

          <DiagnosisResultCard
            prediction={currentPrediction}
            language={language}
            onNavigateToAdvisory={onNavigateToAdvisory || (() => {})}
            onNavigateToChat={onNavigateToChat || (() => {})}
            onExportReport={onExportReport || (() => {})}
          />

          <TreatmentRecommendations
            recommendations={currentPrediction.recommendations}
            cropName={currentPrediction.crop}
            diseaseName={currentPrediction.disease_name}
            isHealthy={currentPrediction.is_healthy}
            language={language}
            onAskAgronomist={onNavigateToChat || (() => {})}
          />
        </div>
      )}

      {/* Preset Pathology Test Gallery */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-800 font-['Plus_Jakarta_Sans']">
              {t('sampleTitle')}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Click any leaf below to load high-fidelity pathology symptoms immediately for instant testing.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {SAMPLE_LEAVES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => selectSample(sample)}
              className="group text-left p-2.5 rounded-2xl border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/30 transition bg-stone-50/50 flex flex-col justify-between cursor-pointer"
            >
              <div className="aspect-square rounded-xl overflow-hidden bg-stone-100 mb-2 border border-stone-200 group-hover:scale-105 transition-transform duration-200 flex items-center justify-center">
                <img
                  src={sample.svgDataUri}
                  alt={sample.diseaseName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="block text-[11px] font-bold text-stone-900 truncate">
                  {sample.crop}
                </span>
                <span className="block text-[11px] font-semibold text-emerald-700 truncate">
                  {sample.diseaseName}
                </span>
              </div>
              <div className="mt-2 pt-1 border-t border-stone-200/60 flex items-center justify-between text-[10px] text-stone-400 group-hover:text-emerald-700">
                <span>Test Sample</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
