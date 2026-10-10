import { DiseaseRecord } from '../types/index.ts';

export const AGRICULTURAL_KNOWLEDGE_BASE: DiseaseRecord[] = [
  {
    id: 'tomato_early_blight',
    crop: 'Tomato',
    disease_name: 'Early Blight',
    scientific_name: 'Alternaria solani',
    pathogen_type: 'Fungus',
    severity_profile: 'Moderate',
    symptoms: [
      'Concentric ring "target-board" brown to black spots on older leaves',
      'Yellow chlorotic halos around necrotic lesions',
      'Premature defoliation starting from the lower canopy upwards',
      'Dark sunken leathery cankers on stems and fruit calyx'
    ],
    favorable_conditions: {
      temp_range: '24°C - 29°C (75°F - 84°F)',
      humidity_threshold: '> 80% relative humidity with alternating wet and dry periods',
      rain_dependency: 'High; fungal conidia disperse readily via rain splash and wind'
    },
    prevention: [
      'Practice 3-year crop rotation with non-solanaceous crops (avoid peppers, eggplants, potatoes)',
      'Use certified pathogen-free seeds and disease-resistant hybrid cultivars (e.g., Mountain Supreme, Defiant PhR)',
      'Mulch heavily around tomato base to prevent soil-to-leaf rain splashback',
      'Provide drip irrigation rather than overhead sprinklers to keep leaf surfaces dry'
    ],
    cultural_practices: [
      'Prune lower leaves up to 30 cm from ground level to improve airflow',
      'Immediately stake and trellis plants to prevent contact with damp soil',
      'Promptly destroy and burn or bag infected leaf litter at the first sign of concentric lesions',
      'Disinfect pruning shears with 70% isopropyl alcohol between plants'
    ],
    organic_biological_treatments: [
      'Apply Bacillus subtilis (e.g., Serenade ASO) as a preventative foliar spray every 7 days',
      'Copper octanoate (liquid copper soap) or Bordeaux mixture applied at early symptom onset',
      'Cold-pressed Neem seed oil (0.5% concentration) to inhibit fungal mycelial germination',
      'Potassium bicarbonate sprays (3g/L with surfactant) to neutralize leaf surface acidity'
    ],
    chemical_treatments: [
      {
        name: 'Mancozeb 75% WP',
        active_ingredient: 'Mancozeb',
        dosage: '2.0 - 2.5 g per liter of water',
        safety_period_days: 7,
        instructions: 'Apply thoroughly as a protective foliar cover spray upon early detection; repeat at 10-14 day intervals.'
      },
      {
        name: 'Azoxystrobin 23% SC',
        active_ingredient: 'Azoxystrobin',
        dosage: '1.0 ml per liter of water',
        safety_period_days: 3,
        instructions: 'Systemic strobilurin fungicide. Rotate with different FRAC groups to prevent resistance.'
      },
      {
        name: 'Chlorothalonil 75% WP',
        active_ingredient: 'Chlorothalonil',
        dosage: '2.0 g per liter of water',
        safety_period_days: 7,
        instructions: 'Broad-spectrum contact protectant. Do not apply during extreme midday heat.'
      }
    ],
    expert_guidance: 'Early Blight is manageable if caught on the lowest foliage. If lesions spread past the mid-canopy or reach green fruit stems, apply systemic fungicide immediately and avoid working in wet fields to prevent spore tracking.',
    references: ['USDA Agricultural Research Service', 'ICAR Indian Agricultural Research Institute Bulletin', 'University of Florida Extension IFAS PP-21']
  },
  {
    id: 'tomato_late_blight',
    crop: 'Tomato',
    disease_name: 'Late Blight',
    scientific_name: 'Phytophthora infestans',
    pathogen_type: 'Oomycete',
    severity_profile: 'Critical',
    symptoms: [
      'Water-soaked pale to dark green irregularly shaped lesions on leaves and petioles',
      'White fungal-like cottony sporulation visible on leaf undersides in humid mornings',
      'Rapid blackened wilting of foliage appearing almost frost-damaged or scorched',
      'Firm, greasy, olive-brown rotten patches on tomato fruits'
    ],
    favorable_conditions: {
      temp_range: '15°C - 22°C (cool, overcast days)',
      humidity_threshold: '> 90% relative humidity, prolonged free moisture on foliage',
      rain_dependency: 'Extreme; can destroy an entire field within 7 to 10 days in wet weather'
    },
    prevention: [
      'Destroy any volunteer tomato and potato cull piles within 500 meters',
      'Select resistant cultivars such as Mountain Magic, Plum Regal, or Iron Lady',
      'Avoid planting downwind from potato fields known to harbor late blight',
      'Ensure wide plant spacing (at least 60 cm) for rapid morning foliage drying'
    ],
    cultural_practices: [
      'Irrigate exclusively via drip lines at ground level early in the morning',
      'Rogue and seal severely infected plants in plastic bags; never compost late blight residue',
      'Harvest uninfected fruits immediately if an epidemic outbreak is forecast in your district'
    ],
    organic_biological_treatments: [
      'Copper hydroxide or Fixed Copper applied strictly as a preventative before rain events',
      'Hydrogen peroxide / Peracetic acid sanitizing sprays for contact knockdown on surfaces'
    ],
    chemical_treatments: [
      {
        name: 'Metalaxyl-M + Mancozeb (Ridomil Gold 68 WG)',
        active_ingredient: 'Metalaxyl-M (4%) + Mancozeb (64%)',
        dosage: '2.5 g per liter of water',
        safety_period_days: 7,
        instructions: 'Systemic and curative. Apply immediately upon detection; maximum 2 applications per season.'
      },
      {
        name: 'Cymoxanil 8% + Mancozeb 64% WP (Curzate)',
        active_ingredient: 'Cymoxanil + Mancozeb',
        dosage: '2.0 g per liter of water',
        safety_period_days: 7,
        instructions: 'Penetrant fungicide with translaminar activity; stops sporulation inside leaf tissues.'
      },
      {
        name: 'Dimethomorph 50% WP',
        active_ingredient: 'Dimethomorph',
        dosage: '1.0 g per liter of water',
        safety_period_days: 5,
        instructions: 'Oomycete-specific inhibitor of cell wall synthesis; alternate with multisite protectants.'
      }
    ],
    expert_guidance: 'EMERGENCY ADVISORY: Late Blight is an aggressive community threat capable of complete field collapse. Report outbreaks to local extension officers and spray preventive fungicides across adjacent uninfected plots immediately.',
    references: ['Cornell University Late Blight Decision Support System', 'FAO Plant Production and Protection Series']
  },
  {
    id: 'tomato_bacterial_spot',
    crop: 'Tomato',
    disease_name: 'Bacterial Spot',
    scientific_name: 'Xanthomonas perforans / euvesicatoria',
    pathogen_type: 'Bacteria',
    severity_profile: 'High',
    symptoms: [
      'Small (1-3mm), dark brown, water-soaked circular to angular leaf spots',
      'Lesions frequently surrounded by a noticeable yellow rim',
      'Severe shot-hole effect where centers of spots dry out and drop out',
      'Raised, scabby, rough dark blemishes with white halos on green fruit'
    ],
    favorable_conditions: {
      temp_range: '24°C - 30°C (75°F - 86°F)',
      humidity_threshold: '> 85% RH with blowing rain or storm splash',
      rain_dependency: 'Very high; bacteria enter through stomata and microscopic leaf wounds'
    },
    prevention: [
      'Use hot-water treated or certified seed tested free of Xanthomonas',
      'Avoid overhead sprinkler irrigation or field activity when foliage is wet',
      'Apply windbreaks to minimize mechanical wind abrasion and sandblasting injuries'
    ],
    cultural_practices: [
      'Rotate out of Solanaceae crops for a minimum of 2 complete seasons',
      'Sterilize seed trays and nursery benches with 10% sodium hypochlorite solution',
      'Promptly eliminate nightshade and solanaceous weeds around field borders'
    ],
    organic_biological_treatments: [
      'Bacteriophage biopesticides (e.g., AgriPhage) targeting Xanthomonas strains',
      'Copper octanoate mixed with Bacillus amyloliquefaciens',
      'Plant defense elicitors (e.g., Acibenzolar-S-methyl / Actigard) prior to disease pressure'
    ],
    chemical_treatments: [
      {
        name: 'Copper Hydroxide + Mancozeb tank mix',
        active_ingredient: 'Copper Hydroxide (2g/L) + Mancozeb (2g/L)',
        dosage: '2.0 g Copper + 2.0 g Mancozeb per liter',
        safety_period_days: 7,
        instructions: 'Synergistic combination: Mancozeb liberates free copper ions, overcoming copper-resistant bacterial strains.'
      },
      {
        name: 'Streptomycin Sulphate + Tetracycline (Plantomycin)',
        active_ingredient: 'Streptomycin (9%) + Tetracycline (1%)',
        dosage: '0.5 - 1.0 g per 10 liters of water',
        safety_period_days: 15,
        instructions: 'Use only where legally registered for agricultural bacteriosis. Do not overuse.'
      }
    ],
    expert_guidance: 'Bacterial spot cannot be cured once lesions saturate leaves. Focus on protecting new foliage with copper-mancozeb tank mixes and strictly halt all pruning while plants are damp.',
    references: ['University of California IPM Guidelines: Tomato Bacterial Spot', 'ICAR Plant Pathology Handbook']
  },
  {
    id: 'tomato_yellow_leaf_curl',
    crop: 'Tomato',
    disease_name: 'Yellow Leaf Curl Virus (TYLCV)',
    scientific_name: 'Tomato yellow leaf curl begomovirus',
    pathogen_type: 'Virus',
    severity_profile: 'High',
    symptoms: [
      'Pronounced upward curling and cupping of leaflet margins',
      'Interveinal chlorosis causing distinct pale yellowing of young leaves',
      'Severe stunting and bushy upright growth habit with shortened internodes',
      'Heavy flower abortion; plants fail to set fruit or yield tiny distorted tomatoes'
    ],
    favorable_conditions: {
      temp_range: '27°C - 35°C (warm tropical and semi-arid conditions)',
      humidity_threshold: 'Moderate to low; vector activity surges in dry, warm spells',
      rain_dependency: 'Low; transmitted by Silverleaf Whitefly (Bemisia tabaci)'
    },
    prevention: [
      'Plant TYLCV-resistant hybrids carrying the Ty-1, Ty-2, or Ty-3 genes (e.g., Saaho, US-440, Tycoon)',
      'Install 50-mesh insect-proof netting in seedling nursery tunnels',
      'Deploy yellow sticky cards (15-20 traps/acre) to monitor whitefly vector populations'
    ],
    cultural_practices: [
      'Eradicate infected plants immediately upon early leaf-curling symptoms to stop viral reservoir',
      'Maintain a 2-month host-free fallow period or weed barrier around tomato plots',
      'Apply silver reflective plastic mulches to disorient incoming flying whiteflies'
    ],
    organic_biological_treatments: [
      'Beauveria bassiana or Verticillium lecanii entomopathogenic fungi to parasitize whitefly nymphs',
      'Neem oil (Azadirachtin 10,000 ppm at 2ml/L) as an anti-feedant and repellent against whiteflies',
      'Release predatory bugs (Orius spp.) or parasitic wasps (Encarsia formosa)'
    ],
    chemical_treatments: [
      {
        name: 'Imidacloprid 17.8% SL',
        active_ingredient: 'Imidacloprid',
        dosage: '0.5 ml per liter of water',
        safety_period_days: 7,
        instructions: 'Systemic neonicotinoid targeting sap-sucking whitefly vectors. Drench seedling roots or foliar spray.'
      },
      {
        name: 'Diafenthiuron 50% WP',
        active_ingredient: 'Diafenthiuron',
        dosage: '1.2 g per liter of water',
        safety_period_days: 10,
        instructions: 'Effective mite and whitefly translaminar insecticide. Apply late evening.'
      }
    ],
    expert_guidance: 'Viruses cannot be cured with chemical sprays once inside plant cells. Management relies 100% on vector (whitefly) control and planting resistant varieties. Pull out infected seedlings immediately.',
    references: ['AVRDC World Vegetable Center Technical Bulletin', 'CABI Invasive Species Compendium']
  },
  {
    id: 'potato_early_blight',
    crop: 'Potato',
    disease_name: 'Early Blight',
    scientific_name: 'Alternaria solani',
    pathogen_type: 'Fungus',
    severity_profile: 'Moderate',
    symptoms: [
      'Dark brown to black target-like spots with concentric rings on lower potato leaves',
      'Leaves become leathery, chlorotic, and wither prematurely',
      'Tuber surface develops dark, sunken circular lesions with raised purple margins',
      'Subsurface tuber flesh turns brown, dry, and corky'
    ],
    favorable_conditions: {
      temp_range: '24°C - 30°C',
      humidity_threshold: 'Alternating wet nights (dew) and warm dry sunny days',
      rain_dependency: 'Moderate'
    },
    prevention: [
      'Plant certified seed tubers free of Alternaria',
      'Maintain balanced nitrogen fertilization (nutrient-stressed plants succumb faster)',
      'Hill tubers well to prevent spores washing down to contact developing potatoes'
    ],
    cultural_practices: [
      'Ensure proper 3-4 year rotation with cereals, maize, or legumes',
      'Avoid mechanical damage during harvest to prevent tuber rot during storage'
    ],
    organic_biological_treatments: [
      'Trichoderma viride or Trichoderma harzianum soil and foliar application',
      'Copper oxychloride 50 WP as a protectant spray',
      'Compost tea sprays rich in beneficial aerobic microbes'
    ],
    chemical_treatments: [
      {
        name: 'Chlorothalonil 75% WP',
        active_ingredient: 'Chlorothalonil',
        dosage: '2.0 g per liter of water',
        safety_period_days: 7,
        instructions: 'Broad spectrum protectant. Apply before canopy closure when lower leaves remain damp.'
      },
      {
        name: 'Propineb 70% WP',
        active_ingredient: 'Propineb (Zinc-based)',
        dosage: '2.5 g per liter of water',
        safety_period_days: 7,
        instructions: 'Excellent contact fungicide providing supplementary zinc nutrition to potato plants.'
      }
    ],
    expert_guidance: 'Maintain optimal nitrogen levels. Senescing or nutrient-depleted potato foliage is up to 5x more susceptible to Alternaria.',
    references: ['CIP International Potato Center', 'Central Potato Research Institute (CPRI) Shimla']
  },
  {
    id: 'potato_late_blight',
    crop: 'Potato',
    disease_name: 'Late Blight',
    scientific_name: 'Phytophthora infestans',
    pathogen_type: 'Oomycete',
    severity_profile: 'Critical',
    symptoms: [
      'Water-soaked greenish-black lesions expanding rapidly across foliage and stems',
      'White mildewy sporulation on the underside of diseased leaves during humid mornings',
      'Characteristic foul rotting odor across affected potato fields',
      'Tubers exhibit reddish-brown granular dry rot penetrating deep into the flesh'
    ],
    favorable_conditions: {
      temp_range: '12°C - 20°C with fog, mist, or continuous drizzle',
      humidity_threshold: '> 90% RH for at least 10 consecutive hours',
      rain_dependency: 'Critical; capable of causing 100% crop loss in under 2 weeks'
    },
    prevention: [
      'Plant certified blight-free seed tubers with high resistance (e.g., Kufri Girdhari, Defender)',
      'Destroy all potato cull piles and volunteer sprouts before planting season',
      'Hill soil deeply to shield tuber bed from downward zoospore wash'
    ],
    cultural_practices: [
      'Kill potato vines (haulm cutting/desiccation) 10-14 days before harvest to harden skins and prevent tuber infection during digging',
      'Store harvested tubers in clean, well-ventilated dry cold storage'
    ],
    organic_biological_treatments: [
      'Bordeaux mixture (1%) preventive spray before onset of winter rains/fogs',
      'Liquid Copper Soap at first warning from local agro-meteorological forecasting stations'
    ],
    chemical_treatments: [
      {
        name: 'Cymoxanil 8% + Mancozeb 64% (Curzate)',
        active_ingredient: 'Cymoxanil + Mancozeb',
        dosage: '2.5 g per liter of water',
        safety_period_days: 7,
        instructions: 'Curative spray within 48 hours of infection; combines contact and penetrant modes of action.'
      },
      {
        name: 'Mandipropamid 23.4% SC (Revus)',
        active_ingredient: 'Mandipropamid',
        dosage: '0.8 ml per liter of water',
        safety_period_days: 3,
        instructions: 'Locks onto waxy leaf cuticles, offering exceptional rainfast protection.'
      }
    ],
    expert_guidance: 'Late blight is historically catastrophic. Monitor regional blight alerts and spray before heavy rainfall, not after symptoms blanket the plot.',
    references: ['CPRI Central Potato Research Institute', 'EuroBlight Network Advisory']
  },
  {
    id: 'corn_common_rust',
    crop: 'Corn (Maize)',
    disease_name: 'Common Rust',
    scientific_name: 'Puccinia sorghi',
    pathogen_type: 'Fungus',
    severity_profile: 'Moderate',
    symptoms: [
      'Small, circular to elongated cinnamon-brown pustules scattered on both leaf surfaces',
      'Pustules rupture the epidermis, releasing powdery rusty reddish-brown spores',
      'Pustules turn dark brownish-black late in the season (teliospores)',
      'Extensive pustule coverage leads to leaf chlorosis, necrosis, and reduced ear fill'
    ],
    favorable_conditions: {
      temp_range: '16°C - 25°C (moderate temperatures)',
      humidity_threshold: '> 95% RH with 6 hours of continuous dew or moisture',
      rain_dependency: 'High humidity dependent; wind-blown spores spread across hundreds of kilometers'
    },
    prevention: [
      'Plant resistant corn hybrids containing the Rp1-D resistance gene',
      'Plant early in the season to evade peak late-summer spore flights',
      'Avoid high plant densities that limit sunlight penetration in the canopy'
    ],
    cultural_practices: [
      'Ensure balanced soil potassium levels (helps corn cell walls resist fungal penetration)',
      'Plow down maize stubble to speed biological decomposition of residues'
    ],
    organic_biological_treatments: [
      'Foliar spray with Bacillus amyloliquefaciens strain D747',
      'Sulfur 80% WDG at 3g/L for natural fungal spore suppression (avoid if temperature exceeds 32°C)'
    ],
    chemical_treatments: [
      {
        name: 'Azoxystrobin + Difenoconazole (Amistar Top)',
        active_ingredient: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC',
        dosage: '1.0 ml per liter of water',
        safety_period_days: 14,
        instructions: 'Apply at tasseling (VT) stage if rust pustules are visible on leaves below the ear leaf.'
      },
      {
        name: 'Pyraclostrobin 20% WG',
        active_ingredient: 'Pyraclostrobin',
        dosage: '1.0 g per liter of water',
        safety_period_days: 14,
        instructions: 'Premium strobilurin providing greening effect and extended disease suppression.'
      }
    ],
    expert_guidance: 'Fungicide applications are most cost-effective if applied between V8 and VT (tasseling) stage if rust covers more than 5% of leaf area on hybrid varieties.',
    references: ['CIMMYT International Maize and Wheat Improvement Center', 'Purdue Extension Maize Rust Field Guide']
  },
  {
    id: 'rice_blast',
    crop: 'Rice',
    disease_name: 'Rice Blast',
    scientific_name: 'Magnaporthe oryzae (Pyricularia oryzae)',
    pathogen_type: 'Fungus',
    severity_profile: 'Critical',
    symptoms: [
      'Spindle-shaped or diamond-like lesions with gray/whitish centers and reddish-brown borders',
      'Lesions coalesce rapidly, causing complete leaf desiccation and "blast" scorched look',
      'Neck rot: Blackish lesions at the panicle node causing rotting and sterile white panicles',
      'Node blast: Blackened, easily breakable lower stem nodes'
    ],
    favorable_conditions: {
      temp_range: '20°C - 26°C with cool nights',
      humidity_threshold: '> 90% RH with prolonged dew (over 10 hours)',
      rain_dependency: 'Aggravated by cloudy drizzle and excessive nitrogen fertilizer application'
    },
    prevention: [
      'Use blast-resistant varieties suited to local ecology (e.g., IR64, Swarna Sub1, MTU 1010)',
      'Split nitrogen fertilizer into 3 or 4 doses; never apply excessive basal nitrogen',
      'Seed treatment with Carbendazim (2g/kg seed) or Pseudomonas fluorescens (10g/kg)'
    ],
    cultural_practices: [
      'Maintain continuous shallow standing water in paddy fields (drought stress triggers blast)',
      'Burn or compost stubble after harvest to eliminate overwintering mycelium',
      'Space hills properly (20 x 15 cm) to optimize aeration'
    ],
    organic_biological_treatments: [
      'Pseudomonas fluorescens foliar spray (2.5 kg/ha) at panicle emergence',
      'Silicon fertilizer amendment (calcium silicate) to strengthen silicified epidermal cell walls',
      'Neem oil or cow urine fermented extract as traditional repellent and antifungal'
    ],
    chemical_treatments: [
      {
        name: 'Tricyclazole 75% WP (Beam)',
        active_ingredient: 'Tricyclazole',
        dosage: '0.6 g per liter of water',
        safety_period_days: 14,
        instructions: 'Gold standard systemic blast fungicide. Melanin biosynthesis inhibitor. Spray at tillering and boot leaf stage.'
      },
      {
        name: 'Isoprothiolane 40% EC (Fuji-One)',
        active_ingredient: 'Isoprothiolane',
        dosage: '1.5 ml per liter of water',
        safety_period_days: 14,
        instructions: 'Effective against both leaf blast and neck rot. Absorbed swiftly by leaf sheaths.'
      },
      {
        name: 'Kasugamycin 3% SL',
        active_ingredient: 'Kasugamycin',
        dosage: '2.0 ml per liter of water',
        safety_period_days: 10,
        instructions: 'Aminoglycoside antibiotic-fungicide with preventative and curative activity.'
      }
    ],
    expert_guidance: 'Neck blast at heading stage can destroy 70% of harvest overnight. Apply prophylactic Tricyclazole spray at 5% panicle emergence in cool, foggy weather.',
    references: ['IRRI International Rice Research Institute Rice Knowledge Bank', 'ICAR-National Rice Research Institute Cuttack']
  },
  {
    id: 'apple_scab',
    crop: 'Apple',
    disease_name: 'Apple Scab',
    scientific_name: 'Venturia inaequalis',
    pathogen_type: 'Fungus',
    severity_profile: 'High',
    symptoms: [
      'Velvety, olive-green to dark brown circular spots on leaf upper surface',
      'Leaves become curled, distorted, puckered, and drop prematurely in mid-summer',
      'Fruit lesions develop into rough, scabby, corky dark patches',
      'Infected fruit cracks, deforms, and remains unmarketable'
    ],
    favorable_conditions: {
      temp_range: '13°C - 24°C',
      humidity_threshold: 'Requires consecutive hours of continuous leaf wetness (Mills Period)',
      rain_dependency: 'Primary ascospores discharge during spring rains from overwintered leaves'
    },
    prevention: [
      'Plant scab-resistant cultivars such as Liberty, Prima, Enterprise, or GoldRush',
      'Rake and shred fallen apple leaves or spray orchard floor with 5% urea in late autumn to speed leaf rot',
      'Prune apple trees annually to open the canopy for rapid sunlight penetration and wind drying'
    ],
    cultural_practices: [
      'Ensure proper drainage in orchard rows',
      'Flail mow orchard floor in early spring to disturb overwintering perithecia'
    ],
    organic_biological_treatments: [
      'Liquid lime sulfur sprays during dormant to tight cluster buds',
      'Micronized sulfur 80% WDG applied before forecasted spring rain events',
      'Baking soda (potassium bicarbonate) combined with horticultural oil'
    ],
    chemical_treatments: [
      {
        name: 'Difenoconazole 25% EC (Score)',
        active_ingredient: 'Difenoconazole',
        dosage: '0.3 ml per liter of water',
        safety_period_days: 14,
        instructions: 'Triazole with strong post-infection kickback activity (up to 72 hours after infection period).'
      },
      {
        name: 'Captan 50% WP',
        active_ingredient: 'Captan',
        dosage: '2.0 g per liter of water',
        safety_period_days: 7,
        instructions: 'Multisite protectant. No risk of resistance development. Excellent for tank mixtures.'
      },
      {
        name: 'Kresoxim-methyl 44.3% SC',
        active_ingredient: 'Kresoxim-methyl',
        dosage: '0.5 ml per liter of water',
        safety_period_days: 14,
        instructions: 'Strobilurin with translaminar vapor action on apple leaves and young fruitlets.'
      }
    ],
    expert_guidance: 'Calculate the Mills Period: 18°C requires only 9 hours of wet foliage for scab infection. Protect foliage before green tip and petal fall stages.',
    references: ['Cornell Fruit Extension Scab Guidelines', 'Washington State University Tree Fruit Research']
  },
  {
    id: 'grape_black_rot',
    crop: 'Grape',
    disease_name: 'Black Rot',
    scientific_name: 'Guignardia bidwellii',
    pathogen_type: 'Fungus',
    severity_profile: 'High',
    symptoms: [
      'Reddish-brown circular spots with dark margins and tiny black pepper-like pycnidia on leaves',
      'Infected berries turn pale, soften, then shrivel into hard, black, wrinkled "mummies"',
      'Black sunken elongated lesions on shoots and tendrils',
      'Mummies remain tenaciously attached to the grape cluster'
    ],
    favorable_conditions: {
      temp_range: '21°C - 32°C (warm and humid)',
      humidity_threshold: 'Requires 6 to 24 hours of leaf wetness depending on temperature',
      rain_dependency: 'High; ascospores shoot into air currents during rain events'
    },
    prevention: [
      'Prune and destroy all mummified grape clusters and diseased canes during dormant season',
      'Trellis vines to ensure open canopies with good airflow',
      'Keep grass and weeds mowed short beneath grape trellises'
    ],
    cultural_practices: [
      'Shoot thinning and selective leaf removal around grape clusters at veraison'
    ],
    organic_biological_treatments: [
      'Copper Hydroxide sprays from bud break through veraison',
      'Sulfur dust or wettable sulfur applied regularly in dry periods'
    ],
    chemical_treatments: [
      {
        name: 'Myclobutanil 10% WP (Rally)',
        active_ingredient: 'Myclobutanil',
        dosage: '1.0 g per liter of water',
        safety_period_days: 14,
        instructions: 'Systemic DMI fungicide. Provides 72 to 96 hours of reach-back curative activity.'
      },
      {
        name: 'Mancozeb 75% WP',
        active_ingredient: 'Mancozeb',
        dosage: '2.5 g per liter of water',
        safety_period_days: 28,
        instructions: 'Apply from 2-inch shoot growth until bloom. Observe pre-harvest interval.'
      }
    ],
    expert_guidance: 'Grapes are most susceptible from early bloom until 4-5 weeks after bloom. Fungicide protection during this window is non-negotiable.',
    references: ['UC Davis Viticulture Extension', 'Penn State Wine Grape Pathology']
  },
  {
    id: 'citrus_canker',
    crop: 'Citrus',
    disease_name: 'Citrus Canker',
    scientific_name: 'Xanthomonas citri subsp. citri',
    pathogen_type: 'Bacteria',
    severity_profile: 'High',
    symptoms: [
      'Raised, corky, blister-like lesions on both sides of citrus leaves',
      'Characteristic oily or water-soaked margin surrounded by a prominent bright yellow chlorotic halo',
      'Crater-like, spongy brown pustules on citrus rinds without damaging pulp',
      'Premature fruit drop and dieback of young twigs'
    ],
    favorable_conditions: {
      temp_range: '20°C - 30°C',
      humidity_threshold: 'High relative humidity combined with wind speeds exceeding 8 m/s',
      rain_dependency: 'Critical; wind-driven rain forces bacteria through leaf stomata and wounds'
    },
    prevention: [
      'Establish vegetative windbreaks (e.g., Casuarina, Bamboo) around citrus orchards',
      'Use certified pathogen-free budwood from certified nurseries',
      'Control Asian Citrus Leafminer (Phyllocnistis citrella) whose feeding galleries create entry wounds for bacteria'
    ],
    cultural_practices: [
      'Prune out diseased branches during dry dormant season and burn trimmings',
      'Disinfect pruning saws and harvest clippers with quaternary ammonium or 10% bleach'
    ],
    organic_biological_treatments: [
      'Copper Oxychloride or Tribasic Copper Sulfate at flush emergence',
      'Neem oil formulations to suppress leafminer larvae'
    ],
    chemical_treatments: [
      {
        name: 'Copper Oxychloride 50% WP + Streptocycline',
        active_ingredient: 'Copper Oxychloride (3g/L) + Streptocycline (0.1g/L)',
        dosage: '3.0 g COC + 100 mg Streptocycline per liter',
        safety_period_days: 7,
        instructions: 'Spray when new flush leaves are half to two-thirds expanded, and again 14-21 days later.'
      }
    ],
    expert_guidance: 'Windbreaks reduce wind velocity below the 18 mph threshold needed for bacterial penetration into stomata, reducing canker incidence by up to 70%.',
    references: ['University of Florida Citrus Extension Factsheet', 'FAO Citrus Health Management']
  },
  {
    id: 'pepper_bacterial_spot',
    crop: 'Pepper (Capsicum)',
    disease_name: 'Bacterial Spot',
    scientific_name: 'Xanthomonas campestris pv. vesicatoria',
    pathogen_type: 'Bacteria',
    severity_profile: 'High',
    symptoms: [
      'Water-soaked, circular to irregular brown spots (1-3mm) on pepper leaves',
      'Leaf lesions turn yellowish-brown with sunken darker centers and may look ragged',
      'Severe defoliation leaving exposed fruit prone to sunscald',
      'Rough, wart-like brown scabs on bell peppers and hot chiles'
    ],
    favorable_conditions: {
      temp_range: '24°C - 32°C',
      humidity_threshold: '> 85% RH with stormy weather or overhead sprinkler irrigation',
      rain_dependency: 'High'
    },
    prevention: [
      'Plant commercial hybrid peppers possessing Bs1, Bs2, Bs3, or Bs4 resistance genes',
      'Hot water seed soak at 50°C (122°F) for 25 minutes prior to sowing',
      'Never irrigate peppers overhead in late afternoon'
    ],
    cultural_practices: [
      'Sanitize stakes and nursery crates with disinfectant between seasons',
      'Do not cultivate or harvest peppers while leaves are damp with morning dew'
    ],
    organic_biological_treatments: [
      'Liquid Copper Hydroxide combined with Bacillus subtilis',
      'Neem seed kernel extract (NSKE 5%) spray'
    ],
    chemical_treatments: [
      {
        name: 'Copper Hydroxide + Mancozeb',
        active_ingredient: 'Copper Hydroxide 53.8% + Mancozeb 75%',
        dosage: '2.0 g + 2.0 g per liter of water',
        safety_period_days: 7,
        instructions: 'Protects foliage from bacterial entry. Apply at 7-day intervals during wet periods.'
      }
    ],
    expert_guidance: 'Pepper defoliation from bacterial spot exposes remaining fruit to intense sunscald. Keep lower canopy ventilated and use drip irrigation.',
    references: ['NC State Extension Pepper Disease Guide', 'World Vegetable Center (AVRDC)']
  },
  {
    id: 'cotton_bacterial_blight',
    crop: 'Cotton',
    disease_name: 'Bacterial Blight (Angular Leaf Spot / Blackarm)',
    scientific_name: 'Xanthomonas citri pv. malvacearum',
    pathogen_type: 'Bacteria',
    severity_profile: 'High',
    symptoms: [
      'Water-soaked angular leaf spots bounded by small leaf veins',
      'Lesions darken to deep brown or black, surrounded by bright halos',
      'Blackarm phase: Elongated black cankers on petioles and main stems causing snapping',
      'Boll rot: Dark oily circular lesions on cotton bolls resulting in stained, discolored lint'
    ],
    favorable_conditions: {
      temp_range: '28°C - 35°C',
      humidity_threshold: '> 80% RH following monsoon showers or overhead irrigation',
      rain_dependency: 'Very high'
    },
    prevention: [
      'Acid delinting of cotton seed with commercial sulfuric acid to destroy seed-borne bacteria',
      'Use resistant Bt and non-Bt cultivars',
      'Treat seed with Carboxin + Thiram (3g/kg) and Streptocycline (1g/kg)'
    ],
    cultural_practices: [
      'Deep plowing after harvest to bury infected cotton residue at least 15 cm deep',
      'Destroy weed hosts such as wild Abutilon and volunteer cotton'
    ],
    organic_biological_treatments: [
      'Pseudomonas fluorescens (10g/kg seed drench and 2g/L foliar spray)',
      'Copper oxychloride at 2.5 g/L'
    ],
    chemical_treatments: [
      {
        name: 'Copper Oxychloride 50 WP + Streptocycline',
        active_ingredient: 'Copper Oxychloride (2.5 g/L) + Streptocycline (100 mg/L)',
        dosage: '2.5 g COC + 0.1 g Streptocycline per liter',
        safety_period_days: 14,
        instructions: 'Spray upon noticing initial angular leaf spots; repeat after 12-15 days if rainfall continues.'
      }
    ],
    expert_guidance: 'Acid delinting is the most economical and effective preventive control for cotton bacterial blight worldwide.',
    references: ['Central Institute for Cotton Research (CICR) Nagpur', 'Texas A&M AgriLife Cotton Disease Guide']
  },
  {
    id: 'healthy_plant',
    crop: 'General',
    disease_name: 'Healthy Crop Foliage',
    scientific_name: 'Plantae (Normal Vigorous Tissue)',
    pathogen_type: 'Healthy',
    severity_profile: 'Low',
    symptoms: [
      'Vibrant uniform green coloration across lamina and veins',
      'Turgid, uncurled leaf margins without necrotic spots or chlorotic halos',
      'Normal cuticle sheen and intact stomatal architecture',
      'Absence of fungal sporulation, bacterial water-soaking, or insect damage'
    ],
    favorable_conditions: {
      temp_range: 'Optimal vegetative range for the respective crop',
      humidity_threshold: '40% - 70% balanced relative humidity',
      rain_dependency: 'Adequate soil moisture without waterlogging or prolonged stagnant leaf wetness'
    },
    prevention: [
      'Maintain balanced N-P-K and secondary micronutrient (Zinc, Boron, Calcium) soil fertilization',
      'Implement preventive bio-priming with Trichoderma and mycorrhiza in the root rhizosphere',
      'Ensure routine scouting twice weekly during rapid growth stages'
    ],
    cultural_practices: [
      'Optimize spacing for sunlight interception and canopy ventilation',
      'Schedule irrigation according to soil tensiometer readings rather than fixed calendar days',
      'Mulch to conserve soil moisture, regulate soil temperature, and prevent weed competition'
    ],
    organic_biological_treatments: [
      'Apply Seaweed extract or humic acid foliar spray (2ml/L) to strengthen plant cell vigor and stress tolerance',
      'Neem cake soil amendment to enrich soil microbiome and suppress root-knot nematodes'
    ],
    chemical_treatments: [],
    expert_guidance: 'Foliage appears vigorous and healthy. No chemical intervention is required. Continue routine scouting and preventive agronomic hygiene.',
    references: ['FAO Integrated Pest Management Guidelines', 'Global Plant Clinic Field Handbook']
  }
];

export function getDiseaseById(id: string): DiseaseRecord | undefined {
  return AGRICULTURAL_KNOWLEDGE_BASE.find(d => d.id === id);
}

export function searchDiseases(query: string, cropFilter?: string): DiseaseRecord[] {
  const q = query.toLowerCase().trim();
  return AGRICULTURAL_KNOWLEDGE_BASE.filter(d => {
    const matchesCrop = cropFilter ? d.crop.toLowerCase().includes(cropFilter.toLowerCase()) : true;
    const matchesQuery = !q ||
      d.disease_name.toLowerCase().includes(q) ||
      d.crop.toLowerCase().includes(q) ||
      d.symptoms.some(s => s.toLowerCase().includes(q)) ||
      d.pathogen_type.toLowerCase().includes(q);
    return matchesCrop && matchesQuery;
  });
}
