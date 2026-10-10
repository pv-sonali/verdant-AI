export interface SolutionDetail {
  dosage: string;
  preparationSteps: string[];
  optimalTiming: string;
  safetyPrecautions: string;
}

export function getDetailedSolutionGuide(solutionText: string, cropName: string): SolutionDetail {
  const text = solutionText.toLowerCase();

  // Neem oil
  if (text.includes('neem')) {
    return {
      dosage: '5 ml of cold-pressed neem oil (or 2-3 ml of 10,000 ppm Azadirachtin) + 1 ml liquid soap per 1 Liter of water.',
      preparationSteps: [
        'Mix 5 ml of pure neem oil with 1 ml of mild liquid soap in a small cup until thoroughly emulsified.',
        'Add a small amount of lukewarm water and stir vigorously until the mixture turns milky white with no floating oil droplets.',
        'Pour into the sprayer tank with the required volume of water and agitate well.',
        'Spray both the upper and lower leaf surfaces until runoff.'
      ],
      optimalTiming: 'Late afternoon (after 4:30 PM) or early morning before temperatures exceed 30°C. Repeat every 7–10 days.',
      safetyPrecautions: 'Neem is bee-friendly when applied in the evening. Avoid spraying under hot direct midday sun to prevent leaf scorching (phytotoxicity).'
    };
  }

  // Bacillus subtilis or amyloliquefaciens
  if (text.includes('bacillus') || text.includes('serenade') || text.includes('bio-fungicide') || text.includes('antagonist')) {
    return {
      dosage: '2.5 to 3.0 ml (or 2.0 to 2.5 grams of wettable powder) per 1 Liter of clean chlorine-free water.',
      preparationSteps: [
        'Use clean, non-chlorinated well or rain water (chlorine kills beneficial bacteria).',
        'Pre-mix the measured bio-fungicide in a bucket with 2 liters of water for 10 minutes to activate spores.',
        'Strain through a fine mesh into the sprayer tank and fill to final calibration.',
        'Apply as a fine mist covering the entire canopy, paying special attention to new leaf shoots.'
      ],
      optimalTiming: 'Apply preventatively or at the earliest trace of disease. Repeat every 5–7 days during high disease pressure.',
      safetyPrecautions: 'Do not tank-mix with chemical bactericides or copper compounds, which destroy live beneficial bacteria.'
    };
  }

  // Trichoderma
  if (text.includes('trichoderma')) {
    return {
      dosage: 'Foliar spray: 5 g per liter of water. Soil drench: 10 g per liter or 2.5 kg mixed with 100 kg farmyard manure per acre.',
      preparationSteps: [
        'For foliar spray, dissolve 50g Trichoderma powder in 10 liters of water and add 1 teaspoon of jaggery/sugar solution to nourish mycelium.',
        'Allow mixture to stand in the shade for 15-20 minutes.',
        'Spray evenly across foliage and drench the root collar zone.',
        'Keep soil moderately moist to allow Trichoderma colonization.'
      ],
      optimalTiming: 'Early morning or cloudy overcast days. Best applied before flowering and fruit set.',
      safetyPrecautions: 'Avoid chemical fungicide applications within 5 days before or after applying Trichoderma.'
    };
  }

  // Copper soap, Bordeaux mixture, Copper hydroxide/oxychloride
  if (text.includes('copper') || text.includes('bordeaux')) {
    return {
      dosage: 'Bordeaux mixture 1% (10g copper sulfate + 10g hydrated lime per liter) or Copper Hydroxide at 2.0 g/L.',
      preparationSteps: [
        'Dissolve copper sulfate in a plastic or wooden vessel (never use metal buckets).',
        'In a separate container, slake the lime in water to form lime milk.',
        'Pour the copper solution slowly into the lime solution while stirring continuously.',
        'Test neutrality with a clean iron knife or pH strip (blue litmus should not turn red).'
      ],
      optimalTiming: 'Apply as a preventative coat before anticipated rain periods. Reapply every 10–14 days.',
      safetyPrecautions: 'Wear gloves, goggles, and a face shield. Do not spray during blooming period or high temperatures above 32°C.'
    };
  }

  // Potassium bicarbonate / Baking soda
  if (text.includes('bicarbonate') || text.includes('baking soda')) {
    return {
      dosage: '3.0 grams of potassium bicarbonate + 1 ml horticultural oil or liquid soap per 1 Liter of water.',
      preparationSteps: [
        'Dissolve 30g of potassium bicarbonate in 10 liters of lukewarm water.',
        'Add 10ml of vegetable oil or liquid soap as a sticking/wetting agent.',
        'Agitate thoroughly and spray on affected foliage until wet.'
      ],
      optimalTiming: 'Spray at the first appearance of powdery mildew or early leaf spots. Repeat every 7 days.',
      safetyPrecautions: 'Do not exceed 4g/L concentration to avoid leaf margin burning. Test on a few leaves first.'
    };
  }

  // Pruning / Trellising / Canopy sanitation
  if (text.includes('prun') || text.includes('trellis') || text.includes('stake') || text.includes('canopy')) {
    return {
      dosage: 'Prune up to 25–30 cm of lower leaves from the soil surface; trellis to maintain 45–60 cm row spacing.',
      preparationSteps: [
        'Use sharp, clean pruning shears disinfected with 70% alcohol or 10% bleach solution between plants.',
        'Cut lower suckers and touching leaves flush with the main stem without tearing the bark.',
        'Collect all trimmed foliage in a plastic bucket; never drop diseased trimmings on the soil bed.',
        'Tie main stems to sturdy stakes or trellising twine to keep fruit and leaves elevated.'
      ],
      optimalTiming: 'Perform pruning in the morning of a dry, sunny day so pruning wounds dry and callous quickly.',
      safetyPrecautions: 'Never prune while foliage is wet from morning dew or rain, as bacteria and spores easily enter fresh cuts.'
    };
  }

  // Mulching & Drip irrigation
  if (text.includes('mulch') || text.includes('drip') || text.includes('irrigat')) {
    return {
      dosage: 'Apply a 5–8 cm (2–3 inch) layer of clean organic straw, dried leaves, or reflective plastic mulch.',
      preparationSteps: [
        'Weed and hoe the crop bed thoroughly before applying mulch.',
        'Install drip irrigation tubing directly along the plant line beneath the mulch.',
        'Spread the mulch evenly, keeping a 5 cm clear gap around the plant stem collar to prevent stem rot.',
        'Schedule drip irrigation early in the morning so soil absorbs moisture before peak evaporation.'
      ],
      optimalTiming: 'Apply immediately after seedlings are established and trellised.',
      safetyPrecautions: 'Ensure mulch material is free from weed seeds and pesticide residue from previous crops.'
    };
  }

  // Crop rotation & Resistant varieties
  if (text.includes('rotat') || text.includes('resist') || text.includes('seed')) {
    return {
      dosage: 'Implement a minimum 3-year crop rotation cycle with unrelated plant families (e.g., follow Solanaceae with Legumes or Cereals).',
      preparationSteps: [
        'Map out your field into 3 or 4 rotation blocks.',
        'Follow heavy-feeding solanaceous crops (Tomato, Potato) with nitrogen-fixing legumes (Beans, Peas) or deep-rooted corn.',
        'Purchase certified pathogen-free seeds with documented disease-resistant genes.',
        'Clean tillage equipment thoroughly when moving between fields to prevent moving soil-borne inoculum.'
      ],
      optimalTiming: 'Plan during crop planning before seasonal field preparation.',
      safetyPrecautions: 'Eradicate volunteer plants and solanaceous weeds (nightshade, datura) along fence lines during fallow periods.'
    };
  }

  // General fallback for other agricultural recommendations
  return {
    dosage: `Follow standard calibrated rates for ${cropName}: 2 to 3 grams/ml per liter of water or standard field coverage.`,
    preparationSteps: [
      `Inspect the entire ${cropName} field plot to determine the extent of disease spread.`,
      'Prepare a fresh mixture using clean, pH-balanced water in a calibrated backpack sprayer.',
      'Test spray pressure on a small section to ensure uniform droplet atomization without excessive runoff.',
      'Ensure complete canopy coverage, spraying upward under leaves and downward over upper foliage.'
    ],
    optimalTiming: 'Apply during calm weather conditions early in the morning (6:30 AM – 9:00 AM) or late afternoon. Avoid high midday heat.',
    safetyPrecautions: 'Wear basic protective gear (gloves and face mask). Wash hands and face thoroughly after field application.'
  };
}
