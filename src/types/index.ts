export type PathogenType = 'Fungus' | 'Bacteria' | 'Virus' | 'Oomycete' | 'Pest' | 'Physiological/Deficiency' | 'Healthy';

export type SeverityLevel = 'None' | 'Early' | 'Moderate' | 'Severe';

export type ScanStatus = 'prediction_available' | 'low_confidence' | 'unsupported_crop' | 'unclear_image';

export interface ChemicalTreatment {
  name: string;
  active_ingredient: string;
  dosage: string;
  safety_period_days: number;
  instructions: string;
}

export interface Recommendations {
  prevention: string[];
  cultural_management: string[];
  organic_biological_treatments: string[];
  chemical_treatments: ChemicalTreatment[];
  expert_review_recommended: boolean;
  urgent_action_required: boolean;
}

export interface WeatherRiskAssessment {
  current_risk_level: 'Low' | 'Moderate' | 'High' | 'Critical';
  risk_factors: string[];
  advisory: string;
  spray_window_safe: boolean;
  spray_recommendation: string;
}

export interface PredictionResult {
  scan_id: string;
  crop: string;
  predicted_class: string;
  disease_name: string;
  scientific_name?: string;
  is_healthy: boolean;
  confidence: number;
  severity_stage: SeverityLevel;
  affected_parts: string[];
  visual_symptoms_observed: string[];
  pathogen_type: PathogenType;
  uncertainty_warning: string | null;
  status: ScanStatus;
  recommendations: Recommendations;
  weather_risk?: WeatherRiskAssessment;
  created_at: string;
  image_url?: string;
}

export interface DiseaseRecord {
  id: string;
  crop: string;
  disease_name: string;
  scientific_name: string;
  pathogen_type: PathogenType;
  severity_profile: 'Low' | 'Moderate' | 'High' | 'Critical';
  symptoms: string[];
  favorable_conditions: {
    temp_range: string;
    humidity_threshold: string;
    rain_dependency: string;
  };
  prevention: string[];
  cultural_practices: string[];
  organic_biological_treatments: string[];
  chemical_treatments: ChemicalTreatment[];
  expert_guidance: string;
  references: string[];
}

export interface WeatherData {
  city: string;
  temperature: number;
  relative_humidity: number;
  precipitation: number;
  wind_speed: number;
  weather_code: number;
  condition_text: string;
  daily_forecast: Array<{
    date: string;
    temp_max: number;
    temp_min: number;
    precip_prob: number;
    weather_code: number;
  }>;
  disease_risk_index: {
    fungal_risk: 'Low' | 'Moderate' | 'High';
    bacterial_risk: 'Low' | 'Moderate' | 'High';
    spray_recommendation: string;
  };
}

export interface ScanRecord {
  _id: string;
  crop: string;
  predicted_class: string;
  confidence: number;
  status: ScanStatus;
  created_at: string;
  disease_name: string;
  is_healthy: boolean;
  severity_stage: SeverityLevel;
  recommendation_version?: string;
  image_url?: string;
  notes?: string;
  weather_context?: {
    temperature: number;
    humidity: number;
    condition: string;
  };
  recommendations?: Recommendations;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agronomist';
  text: string;
  timestamp: string;
}

export interface ChatThread {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  cropContext?: string;
  diseaseContext?: string;
  messages: ChatMessage[];
}

export type SupportedLanguage = 'en' | 'te' | 'hi' | 'es';
