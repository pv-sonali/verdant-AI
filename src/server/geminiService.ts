import 'dotenv/config';
import { GoogleGenAI, Type } from '@google/genai';
import { PredictionResult, ScanStatus, SeverityLevel, PathogenType } from '../types/index.ts';

function getAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export async function analyzeCropLeafImage(
  base64Data: string,
  mimeType: string,
  cropHint?: string
): Promise<Omit<PredictionResult, 'scan_id' | 'created_at'>> {
  const modelName = 'gemini-3.8-flash';

  const systemPrompt = `You are Verdant AI's expert Senior Agricultural Plant Pathologist and Computer Vision Diagnosis Engine.
Your role is to diagnose crop leaf diseases accurately, responsibly, and actionable for farmers.

Follow these strict diagnostic protocols:
1. Examine the image carefully. Verify if it is an actual agricultural crop/plant leaf or field photo.
   - If it is NOT a plant, leaf, or agricultural crop (e.g. a person, vehicle, random room, empty background), set status to "unclear_image" or "unsupported_crop", confidence < 0.3, and specify clearly.
   - If it is an excessively blurry, out-of-focus, or underexposed photo, set status to "unclear_image".
2. Identify the Crop (e.g. Tomato, Potato, Corn/Maize, Rice, Apple, Grape, Pepper, Citrus, Cotton, Wheat, Soybean, Strawberry, etc.). Use the user's crop hint if provided and consistent with visual evidence.
3. Diagnose whether the plant is Healthy or Diseased.
4. If Healthy:
   - status: "prediction_available"
   - disease_name: "Healthy Foliage"
   - is_healthy: true
   - confidence: 0.90 to 0.99
   - severity_stage: "None"
   - pathogen_type: "Healthy"
5. If Diseased:
   - Identify the exact disease (e.g. Early Blight, Late Blight, Bacterial Spot, Common Rust, Apple Scab, Rice Blast, Black Rot, Citrus Canker, Yellow Leaf Curl).
   - Formulate predicted_class in standard PlantVillage or agronomic style (e.g. "Tomato___Early_blight").
   - Assess Pathogen Type: "Fungus", "Bacteria", "Virus", "Oomycete", "Pest", or "Physiological/Deficiency".
   - Assign calibrated Confidence score (0.0 to 1.0). If symptoms are ambiguous or mild, report 0.60 - 0.75; if hallmark signs are unambiguous (e.g. target concentric rings of Alternaria, water-soaked late blight with sporulation), report 0.85 - 0.97.
   - Gauge Severity Stage: "Early" (isolated spots), "Moderate" (spreading lesions on multiple leaflets), "Severe" (widespread blight, defoliation, necrotic collapse).
   - List distinct visual symptoms directly seen in the uploaded leaf (e.g., "Concentric brown rings with yellow halo", "Water-soaked lesions on margin", "Curling of leaf edges").
   - Provide concrete, crop-safe, and realistic agricultural recommendations:
     * Prevention (hygiene, crop rotation, resistant varieties)
     * Cultural Management (pruning, irrigation adjustments, spacing)
     * Organic & Biological Treatments (Neem oil, Bacillus subtilis, Trichoderma, Bordeaux mixture)
     * Chemical Treatments with active ingredients, dosage per liter/acre, and pre-harvest interval (PHI) in days.
     * Flag whether urgent action or professional extension officer review is recommended.
6. Responsible AI Policy:
   - Never fabricate 100% certainty.
   - If confidence is below 0.65, set status: "low_confidence" and explain why in uncertainty_warning.`;

  const prompt = `Analyze this agricultural leaf image. ${cropHint ? `Farmer indicated crop: "${cropHint}". Verify if this matches visual morphology.` : 'Identify the crop and analyze for any disease symptoms.'} Provide a complete structured diagnosis.`;

  const cleanBase64 = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');

  try {
    const response = await getAI().models.generateContent({
      model: modelName,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType || 'image/jpeg',
              data: cleanBase64,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            crop: { type: Type.STRING },
            predicted_class: { type: Type.STRING },
            disease_name: { type: Type.STRING },
            scientific_name: { type: Type.STRING },
            is_healthy: { type: Type.BOOLEAN },
            confidence: { type: Type.NUMBER },
            severity_stage: {
              type: Type.STRING,
              description: 'None, Early, Moderate, or Severe',
            },
            status: {
              type: Type.STRING,
              description: 'prediction_available, low_confidence, unsupported_crop, or unclear_image',
            },
            pathogen_type: {
              type: Type.STRING,
              description: 'Fungus, Bacteria, Virus, Oomycete, Pest, Physiological/Deficiency, or Healthy',
            },
            affected_parts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            visual_symptoms_observed: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            uncertainty_warning: { type: Type.STRING },
            recommendations: {
              type: Type.OBJECT,
              properties: {
                prevention: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                cultural_management: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                organic_biological_treatments: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                chemical_treatments: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      active_ingredient: { type: Type.STRING },
                      dosage: { type: Type.STRING },
                      safety_period_days: { type: Type.INTEGER },
                      instructions: { type: Type.STRING },
                    },
                    required: ['name', 'active_ingredient', 'dosage', 'safety_period_days', 'instructions'],
                  },
                },
                expert_review_recommended: { type: Type.BOOLEAN },
                urgent_action_required: { type: Type.BOOLEAN },
              },
              required: [
                'prevention',
                'cultural_management',
                'organic_biological_treatments',
                'chemical_treatments',
                'expert_review_recommended',
                'urgent_action_required',
              ],
            },
          },
          required: [
            'crop',
            'predicted_class',
            'disease_name',
            'is_healthy',
            'confidence',
            'severity_stage',
            'status',
            'pathogen_type',
            'affected_parts',
            'visual_symptoms_observed',
            'recommendations',
          ],
        },
      },
    });

    const text = response.text?.trim() || '{}';
    const parsed = JSON.parse(text);

    // Normalize values
    const confidence = Math.min(Math.max(parsed.confidence ?? 0.85, 0.05), 0.99);
    let status: ScanStatus = (parsed.status as ScanStatus) || 'prediction_available';
    if (confidence < 0.65 && status === 'prediction_available') {
      status = 'low_confidence';
    }

    const severityStage: SeverityLevel = ['None', 'Early', 'Moderate', 'Severe'].includes(parsed.severity_stage)
      ? (parsed.severity_stage as SeverityLevel)
      : parsed.is_healthy ? 'None' : 'Moderate';

    const pathogenType: PathogenType = [
      'Fungus',
      'Bacteria',
      'Virus',
      'Oomycete',
      'Pest',
      'Physiological/Deficiency',
      'Healthy',
    ].includes(parsed.pathogen_type)
      ? (parsed.pathogen_type as PathogenType)
      : parsed.is_healthy ? 'Healthy' : 'Fungus';

    return {
      crop: parsed.crop || 'Unknown Crop',
      predicted_class: parsed.predicted_class || `${parsed.crop || 'Crop'}___${parsed.disease_name || 'Anomaly'}`,
      disease_name: parsed.disease_name || (parsed.is_healthy ? 'Healthy Foliage' : 'Unspecified Symptom'),
      scientific_name: parsed.scientific_name || '',
      is_healthy: Boolean(parsed.is_healthy),
      confidence: Math.round(confidence * 100) / 100,
      severity_stage: severityStage,
      affected_parts: Array.isArray(parsed.affected_parts) ? parsed.affected_parts : ['Leaves'],
      visual_symptoms_observed: Array.isArray(parsed.visual_symptoms_observed) ? parsed.visual_symptoms_observed : ['Lesions on leaf surface'],
      pathogen_type: pathogenType,
      uncertainty_warning: parsed.uncertainty_warning || (confidence < 0.7 ? 'Model confidence is below 70%. Consider verifying with a localized physical leaf sample.' : null),
      status,
      recommendations: {
        prevention: parsed.recommendations?.prevention || ['Practice crop rotation', 'Use clean certified seeds'],
        cultural_management: parsed.recommendations?.cultural_management || ['Prune affected lower leaves', 'Avoid wetting leaves during irrigation'],
        organic_biological_treatments: parsed.recommendations?.organic_biological_treatments || ['Apply neem oil (0.5%)', 'Spray Trichoderma or Bacillus formulation'],
        chemical_treatments: parsed.recommendations?.chemical_treatments || [],
        expert_review_recommended: Boolean(parsed.recommendations?.expert_review_recommended),
        urgent_action_required: Boolean(parsed.recommendations?.urgent_action_required),
      },
    };
  } catch (err: any) {
    console.error('Gemini vision analysis error:', err);
    throw new Error(`Inference engine error: ${err.message || 'Failed to process leaf image'}`);
  }
}

export async function askAgronomist(
  query: string,
  context?: {
    crop?: string;
    disease?: string;
    weather?: string;
    language?: string;
  },
  history?: Array<{ role: 'user' | 'model'; text: string }>
): Promise<{ answer: string; suggestedTitle?: string }> {
  const modelName = 'gemini-3.8-flash';
  const lang = context?.language || 'en';

  const systemPrompt = `You are "Kisan Sahayak", Verdant AI's Senior Agronomist and Field Extension Specialist.
You provide clear, practical, scientifically sound agricultural guidance to farmers in a friendly, conversational manner.
- Emphasize Integrated Pest Management (IPM): Cultural and biological remedies first, followed by safe chemical recommendations with exact dosages.
- Always include safety precautions: Personal Protective Equipment (gloves, mask), pre-harvest interval (PHI), and avoiding sprays during active bee foraging hours or high winds.
- Language instruction: Respond in the language requested (${lang}). If 'te', reply in fluent Telugu (తెలుగు) with standard agricultural terminology. If 'hi', reply in clear Hindi (हिन्दी). If 'es', reply in Spanish. If 'en', reply in English.
- Format with easy-to-read bullet points, numbered steps, bold headings, and practical step-by-step instructions.`;

  const contextStr = context
    ? `\n[Context: Crop: ${context.crop || 'General'}, Active Disease: ${context.disease || 'None'}, Weather: ${context.weather || 'Unknown'}]`
    : '';

  // Prepare multi-turn contents for the conversation
  const contentsPayload: any[] = [];
  
  if (history && history.length > 0) {
    for (const h of history) {
      contentsPayload.push({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }]
      });
    }
  }

  contentsPayload.push({
    role: 'user',
    parts: [{ text: `${query}${contextStr}` }]
  });

  const response = await getAI().models.generateContent({
    model: modelName,
    contents: contentsPayload,
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.3,
    },
  });

  const answer = response.text || 'No response generated from agronomist.';

  // If this is the start of a thread, generate a concise title
  let suggestedTitle: string | undefined = undefined;
  if (!history || history.length === 0) {
    try {
      const titleRes = await getAI().models.generateContent({
        model: modelName,
        contents: `Create a brief 3 to 6 word title summarizing this farmer question: "${query}". Do not use quotes or punctuation.`,
        config: {
          temperature: 0.2,
          maxOutputTokens: 20
        }
      });
      suggestedTitle = titleRes.text?.trim().replace(/^["']|["']$/g, '');
    } catch {
      suggestedTitle = query.slice(0, 35) + '...';
    }
  }

  return { answer, suggestedTitle };
}
