export interface SampleLeaf {
  id: string;
  crop: string;
  diseaseName: string;
  expectedClass: string;
  description: string;
  svgDataUri: string;
}

// Generate realistic synthetic leaf SVG data URIs with distinct pathology hallmarks
function createSvgDataUri(svgContent: string): string {
  const encoded = encodeURIComponent(svgContent.trim());
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

export const SAMPLE_LEAVES: SampleLeaf[] = [
  {
    id: 'sample_tomato_early_blight',
    crop: 'Tomato',
    diseaseName: 'Early Blight',
    expectedClass: 'Tomato___Early_blight',
    description: 'Distinct concentric target-board brown rings with chlorotic yellow halos on lower tomato leaflet.',
    svgDataUri: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <defs>
          <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#4a7c39"/>
            <stop offset="60%" stop-color="#386429"/>
            <stop offset="100%" stop-color="#284c1c"/>
          </linearGradient>
          <radialGradient id="targetRing1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#2a180b"/>
            <stop offset="35%" stop-color="#543015"/>
            <stop offset="45%" stop-color="#2a180b"/>
            <stop offset="70%" stop-color="#6e3f1c"/>
            <stop offset="85%" stop-color="#9e7c20"/>
            <stop offset="100%" stop-color="#d4af37" stop-opacity="0.9"/>
          </radialGradient>
          <radialGradient id="targetRing2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#331c0e"/>
            <stop offset="40%" stop-color="#5a3418"/>
            <stop offset="55%" stop-color="#2b170c"/>
            <stop offset="80%" stop-color="#805b1b"/>
            <stop offset="100%" stop-color="#c9aa2a" stop-opacity="0.8"/>
          </radialGradient>
        </defs>
        <!-- Background -->
        <rect width="400" height="400" fill="#f4f7f2"/>
        
        <!-- Stem -->
        <path d="M 200,380 Q 198,280 200,160 Q 201,80 200,30" stroke="#5d8b3c" stroke-width="9" fill="none" stroke-linecap="round"/>
        
        <!-- Tomato Leaf Body -->
        <path d="M 200,40 C 230,60 290,110 310,170 C 330,230 300,290 270,320 C 240,350 215,365 200,375 C 185,365 160,350 130,320 C 100,290 70,230 90,170 C 110,110 170,60 200,40 Z" fill="url(#leafGrad)" stroke="#224216" stroke-width="3"/>
        
        <!-- Leaf Veins -->
        <path d="M 200,370 Q 200,200 200,45" stroke="#71aa48" stroke-width="5" fill="none"/>
        <path d="M 200,150 Q 240,135 285,150" stroke="#689e41" stroke-width="3" fill="none"/>
        <path d="M 200,190 Q 250,185 295,215" stroke="#689e41" stroke-width="3" fill="none"/>
        <path d="M 200,240 Q 240,245 280,280" stroke="#689e41" stroke-width="3" fill="none"/>
        <path d="M 200,150 Q 160,135 115,150" stroke="#689e41" stroke-width="3" fill="none"/>
        <path d="M 200,190 Q 150,185 105,215" stroke="#689e41" stroke-width="3" fill="none"/>
        <path d="M 200,240 Q 160,245 120,280" stroke="#689e41" stroke-width="3" fill="none"/>
        
        <!-- Early Blight Concentric Target Ring Lesion 1 -->
        <circle cx="150" cy="220" r="45" fill="url(#targetRing1)"/>
        <!-- Ring details -->
        <circle cx="150" cy="220" r="32" fill="none" stroke="#1d1007" stroke-width="2.5" stroke-dasharray="4,2"/>
        <circle cx="150" cy="220" r="20" fill="none" stroke="#251307" stroke-width="2"/>
        <circle cx="150" cy="220" r="8" fill="#150a04"/>
        
        <!-- Target Ring Lesion 2 -->
        <circle cx="245" cy="180" r="38" fill="url(#targetRing2)"/>
        <circle cx="245" cy="180" r="26" fill="none" stroke="#1d1007" stroke-width="2"/>
        <circle cx="245" cy="180" r="14" fill="none" stroke="#251307" stroke-width="2"/>
        <circle cx="245" cy="180" r="6" fill="#150a04"/>

        <!-- Smaller Lesion 3 -->
        <circle cx="210" cy="290" r="22" fill="url(#targetRing1)"/>
        <circle cx="130" cy="150" r="16" fill="url(#targetRing2)"/>
        
        <!-- Leaf border label tag -->
        <rect x="15" y="15" width="130" height="26" rx="6" fill="#1e3a1e" fill-opacity="0.85"/>
        <text x="25" y="32" fill="#78e08f" font-family="sans-serif" font-size="12" font-weight="bold">Tomato: Alternaria</text>
      </svg>
    `)
  },
  {
    id: 'sample_potato_late_blight',
    crop: 'Potato',
    diseaseName: 'Late Blight',
    expectedClass: 'Potato___Late_blight',
    description: 'Water-soaked brownish-black necrotic blotches with fungal mildew margins and rapid foliar collapse.',
    svgDataUri: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <defs>
          <linearGradient id="potGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#3d682e"/>
            <stop offset="100%" stop-color="#244519"/>
          </linearGradient>
          <radialGradient id="lateBlightRot" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stop-color="#121411"/>
            <stop offset="50%" stop-color="#28261e"/>
            <stop offset="75%" stop-color="#4a3e26"/>
            <stop offset="90%" stop-color="#8c825a"/>
            <stop offset="100%" stop-color="#e2e8d8" stop-opacity="0.9"/>
          </radialGradient>
        </defs>
        <rect width="400" height="400" fill="#f4f7f2"/>
        <!-- Stem -->
        <path d="M 200,380 C 195,290 205,150 200,30" stroke="#48682a" stroke-width="8" fill="none"/>
        <!-- Leaf -->
        <path d="M 200,45 C 240,65 315,120 320,200 C 325,280 270,340 200,375 C 130,340 75,280 80,200 C 85,120 160,65 200,45 Z" fill="url(#potGrad)" stroke="#1a3312" stroke-width="3"/>
        <!-- Veins -->
        <path d="M 200,370 L 200,50" stroke="#5a883b" stroke-width="4"/>
        <path d="M 200,160 Q 260,150 300,180" stroke="#547d37" stroke-width="2.5" fill="none"/>
        <path d="M 200,230 Q 255,235 290,270" stroke="#547d37" stroke-width="2.5" fill="none"/>
        <path d="M 200,160 Q 140,150 100,180" stroke="#547d37" stroke-width="2.5" fill="none"/>
        <path d="M 200,230 Q 145,235 110,270" stroke="#547d37" stroke-width="2.5" fill="none"/>
        
        <!-- Large irregular late blight necrotic zone -->
        <path d="M 120,130 C 180,110 240,140 250,190 C 260,240 220,280 160,280 C 100,280 90,200 120,130 Z" fill="url(#lateBlightRot)"/>
        <!-- White mycelium fringe -->
        <path d="M 115,125 C 182,105 245,135 255,190" stroke="#ffffff" stroke-width="3" stroke-dasharray="3,3" fill="none" opacity="0.85"/>
        <path d="M 255,190 C 265,245 225,285 160,285" stroke="#ffffff" stroke-width="3" stroke-dasharray="3,3" fill="none" opacity="0.85"/>
        
        <!-- Water-soaked edge lesion -->
        <path d="M 240,240 C 290,230 310,270 290,300 C 270,320 240,290 240,240 Z" fill="url(#lateBlightRot)"/>
        
        <rect x="15" y="15" width="135" height="26" rx="6" fill="#1e3a1e" fill-opacity="0.85"/>
        <text x="25" y="32" fill="#ff7675" font-family="sans-serif" font-size="12" font-weight="bold">Potato: Phytophthora</text>
      </svg>
    `)
  },
  {
    id: 'sample_corn_common_rust',
    crop: 'Corn (Maize)',
    diseaseName: 'Common Rust',
    expectedClass: 'Corn_(maize)___Common_rust_',
    description: 'Elongated golden to cinnamon-brown powdery pustules rupturing the corn leaf epidermis.',
    svgDataUri: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <defs>
          <linearGradient id="cornBlade" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#3d6c2a"/>
            <stop offset="50%" stop-color="#4d8236"/>
            <stop offset="100%" stop-color="#3d6c2a"/>
          </linearGradient>
        </defs>
        <rect width="400" height="400" fill="#f4f7f2"/>
        <!-- Corn Long Strap Leaf Blade -->
        <path d="M 200,20 C 230,80 270,200 250,380 L 150,380 C 130,200 170,80 200,20 Z" fill="url(#cornBlade)" stroke="#27481a" stroke-width="3"/>
        <!-- Midrib -->
        <line x1="200" y1="20" x2="200" y2="380" stroke="#7eb85b" stroke-width="6"/>
        <!-- Parallel leaf veins -->
        <line x1="175" y1="60" x2="165" y2="380" stroke="#437330" stroke-width="1.5"/>
        <line x1="185" y1="40" x2="180" y2="380" stroke="#437330" stroke-width="1.5"/>
        <line x1="215" y1="40" x2="220" y2="380" stroke="#437330" stroke-width="1.5"/>
        <line x1="225" y1="60" x2="235" y2="380" stroke="#437330" stroke-width="1.5"/>
        
        <!-- Rust Pustules Group (Cinnamon Brown / Brick Red) -->
        <!-- Row 1 -->
        <ellipse cx="178" cy="140" rx="4" ry="10" fill="#b3391b" stroke="#78230f" stroke-width="1"/>
        <ellipse cx="184" cy="165" rx="5" ry="12" fill="#c0392b" stroke="#6e1f0c" stroke-width="1"/>
        <ellipse cx="174" cy="190" rx="4" ry="9" fill="#b3391b" stroke="#78230f" stroke-width="1"/>
        <!-- Mid-blade cluster -->
        <ellipse cx="220" cy="130" rx="4" ry="11" fill="#c0392b" stroke="#6e1f0c" stroke-width="1"/>
        <ellipse cx="228" cy="155" rx="5" ry="14" fill="#a83216" stroke="#5c190a" stroke-width="1"/>
        <ellipse cx="218" cy="180" rx="4" ry="10" fill="#d35400" stroke="#6e1f0c" stroke-width="1"/>
        <ellipse cx="226" cy="210" rx="5" ry="12" fill="#c0392b" stroke="#6e1f0c" stroke-width="1"/>
        <!-- Lower cluster -->
        <ellipse cx="175" cy="240" rx="5" ry="13" fill="#a83216" stroke="#5c190a" stroke-width="1"/>
        <ellipse cx="186" cy="265" rx="6" ry="15" fill="#c0392b" stroke="#6e1f0c" stroke-width="1"/>
        <ellipse cx="172" cy="295" rx="4" ry="10" fill="#b3391b" stroke="#78230f" stroke-width="1"/>
        <ellipse cx="222" cy="260" rx="5" ry="12" fill="#d35400" stroke="#6e1f0c" stroke-width="1"/>
        <ellipse cx="230" cy="290" rx="5" ry="14" fill="#c0392b" stroke="#6e1f0c" stroke-width="1"/>
        
        <rect x="15" y="15" width="130" height="26" rx="6" fill="#1e3a1e" fill-opacity="0.85"/>
        <text x="25" y="32" fill="#e67e22" font-family="sans-serif" font-size="12" font-weight="bold">Maize: Puccinia</text>
      </svg>
    `)
  },
  {
    id: 'sample_rice_blast',
    crop: 'Rice',
    diseaseName: 'Rice Blast',
    expectedClass: 'Rice___Leaf_Blast',
    description: 'Characteristic diamond and spindle-shaped lesions with grayish centers and brown borders.',
    svgDataUri: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <defs>
          <linearGradient id="paddyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#46732f"/>
            <stop offset="50%" stop-color="#5a8e3d"/>
            <stop offset="100%" stop-color="#46732f"/>
          </linearGradient>
          <radialGradient id="blastSpindle" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#dfe6e9"/>
            <stop offset="35%" stop-color="#b2bec3"/>
            <stop offset="70%" stop-color="#63391d"/>
            <stop offset="100%" stop-color="#a0522d"/>
          </radialGradient>
        </defs>
        <rect width="400" height="400" fill="#f4f7f2"/>
        <!-- Slender Rice Blade -->
        <path d="M 200,20 C 220,100 240,240 230,380 L 170,380 C 160,240 180,100 200,20 Z" fill="url(#paddyGrad)" stroke="#2b471c" stroke-width="2.5"/>
        <!-- Midrib -->
        <line x1="200" y1="20" x2="200" y2="380" stroke="#7eb85b" stroke-width="3"/>
        
        <!-- Spindle Diamond Blast Lesion 1 -->
        <polygon points="200,120 216,150 200,180 184,150" fill="url(#blastSpindle)" stroke="#4a250f" stroke-width="2"/>
        
        <!-- Spindle Blast Lesion 2 -->
        <polygon points="190,210 208,245 190,280 172,245" fill="url(#blastSpindle)" stroke="#4a250f" stroke-width="2"/>

        <!-- Spindle Blast Lesion 3 -->
        <polygon points="212,280 224,305 212,330 200,305" fill="url(#blastSpindle)" stroke="#4a250f" stroke-width="1.5"/>

        <rect x="15" y="15" width="130" height="26" rx="6" fill="#1e3a1e" fill-opacity="0.85"/>
        <text x="25" y="32" fill="#fdcb6e" font-family="sans-serif" font-size="12" font-weight="bold">Rice: Pyricularia</text>
      </svg>
    `)
  },
  {
    id: 'sample_pepper_healthy',
    crop: 'Pepper (Capsicum)',
    diseaseName: 'Healthy Foliage',
    expectedClass: 'Pepper__bell___healthy',
    description: 'Vigorous bell pepper leaf with lustrous cuticle, vibrant chlorophyll, and no pathogen symptoms.',
    svgDataUri: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <defs>
          <linearGradient id="healthyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#44a034"/>
            <stop offset="50%" stop-color="#348427"/>
            <stop offset="100%" stop-color="#235c1b"/>
          </linearGradient>
        </defs>
        <rect width="400" height="400" fill="#f4f7f2"/>
        <!-- Petiole -->
        <path d="M 200,380 Q 200,310 200,240" stroke="#3b7d27" stroke-width="7" fill="none"/>
        <!-- Healthy Ovate Pepper Leaf -->
        <path d="M 200,40 C 260,70 320,150 310,230 C 300,310 240,350 200,360 C 160,350 100,310 90,230 C 80,150 140,70 200,40 Z" fill="url(#healthyGrad)" stroke="#1a4714" stroke-width="3"/>
        <!-- Crisp Healthy Veins -->
        <path d="M 200,355 L 200,45" stroke="#68bf52" stroke-width="4.5"/>
        <path d="M 200,130 Q 250,120 280,145" stroke="#5cb047" stroke-width="2.5" fill="none"/>
        <path d="M 200,190 Q 260,185 290,220" stroke="#5cb047" stroke-width="2.5" fill="none"/>
        <path d="M 200,250 Q 250,255 275,290" stroke="#5cb047" stroke-width="2.5" fill="none"/>
        <path d="M 200,130 Q 150,120 120,145" stroke="#5cb047" stroke-width="2.5" fill="none"/>
        <path d="M 200,190 Q 140,185 110,220" stroke="#5cb047" stroke-width="2.5" fill="none"/>
        <path d="M 200,250 Q 150,255 125,290" stroke="#5cb047" stroke-width="2.5" fill="none"/>
        
        <rect x="15" y="15" width="130" height="26" rx="6" fill="#1e3a1e" fill-opacity="0.85"/>
        <text x="25" y="32" fill="#55efc4" font-family="sans-serif" font-size="12" font-weight="bold">Pepper: Healthy</text>
      </svg>
    `)
  },
  {
    id: 'sample_citrus_canker',
    crop: 'Citrus',
    diseaseName: 'Citrus Canker',
    expectedClass: 'Citrus___Bacterial_canker',
    description: 'Raised spongy corky pustules surrounded by vivid oily yellow chlorotic halos on citrus leaf.',
    svgDataUri: createSvgDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <defs>
          <linearGradient id="citrusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#3d752f"/>
            <stop offset="100%" stop-color="#244d1c"/>
          </linearGradient>
          <radialGradient id="cankerSpot" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#50280f"/>
            <stop offset="40%" stop-color="#733b17"/>
            <stop offset="60%" stop-color="#995c26"/>
            <stop offset="75%" stop-color="#e1b12c"/>
            <stop offset="100%" stop-color="#f5cd79" stop-opacity="0.85"/>
          </radialGradient>
        </defs>
        <rect width="400" height="400" fill="#f4f7f2"/>
        <!-- Citrus Winged Petiole -->
        <polygon points="195,380 205,380 208,350 203,340 197,340 192,350" fill="#305923"/>
        <!-- Citrus Leaf Blade -->
        <path d="M 200,40 C 270,75 315,160 305,245 C 295,315 240,345 200,350 C 160,345 105,315 95,245 C 85,160 130,75 200,40 Z" fill="url(#citrusGrad)" stroke="#1a3d13" stroke-width="3"/>
        <path d="M 200,345 L 200,45" stroke="#5a9645" stroke-width="4"/>
        
        <!-- Canker Lesions with Yellow Halo -->
        <circle cx="150" cy="180" r="26" fill="url(#cankerSpot)"/>
        <circle cx="150" cy="180" r="14" fill="#361708" stroke="#1d0a02" stroke-width="2"/>
        
        <circle cx="235" cy="160" r="30" fill="url(#cankerSpot)"/>
        <circle cx="235" cy="160" r="17" fill="#361708" stroke="#1d0a02" stroke-width="2"/>

        <circle cx="185" cy="265" r="22" fill="url(#cankerSpot)"/>
        <circle cx="185" cy="265" r="11" fill="#361708" stroke="#1d0a02" stroke-width="1.5"/>

        <rect x="15" y="15" width="130" height="26" rx="6" fill="#1e3a1e" fill-opacity="0.85"/>
        <text x="25" y="32" fill="#ffeaa7" font-family="sans-serif" font-size="12" font-weight="bold">Citrus: Xanthomonas</text>
      </svg>
    `)
  }
];
