import React from 'react';
import { ShieldAlert, AlertTriangle, Check, X, FileText, Info } from 'lucide-react';
import { SupportedLanguage } from '../types/index.ts';

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 relative shadow-2xl border border-stone-200">
        
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1 rounded-lg text-stone-400 hover:text-stone-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
            <ShieldAlert className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-stone-900 font-['Plus_Jakarta_Sans']">
              Responsible AI & Field Advisory Disclaimer
            </h3>
            <p className="text-xs text-stone-500">
              Verdant AI Diagnostic Decision Support Framework
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed mt-4">
          
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs">
            <strong className="block font-bold mb-1">Preliminary Decision-Support Only:</strong>
            Verdant AI is designed as a preliminary digital assistant to aid early symptom detection. It does not replace certified laboratory pathology testing, microscopic spore analysis, or in-person evaluation by qualified agricultural officers.
          </div>

          <div>
            <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-1">
              1. Uncertainty & Variable Field Conditions
            </h4>
            <p className="text-stone-600">
              Visual symptoms on plant foliage can vary significantly based on soil fertility, water stress, micro-nutrient deficiencies, and mixed pathogen infections. Confidence scores represent model certainty based on training data and must not be interpreted as absolute biological proof.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-1">
              2. Chemical Pesticide Safety & Regulatory Compliance
            </h4>
            <p className="text-stone-600">
              All chemical recommendations provided in this platform are based on general agricultural compendiums. Farmers must verify that specific active ingredients and trade brands are legally approved and registered for their respective crop in their local district/country. Always strictly adhere to:
            </p>
            <ul className="list-disc pl-5 mt-1.5 space-y-1 text-stone-600 text-xs">
              <li>Product container label instructions and dilution rates.</li>
              <li>Mandatory Pre-Harvest Intervals (PHI) to prevent dangerous consumer residues.</li>
              <li>Approved Personal Protective Equipment (PPE: gloves, respirator, eye protection).</li>
              <li>Pollinator protection protocols: avoid spraying blooming crops during active bee foraging.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-1">
              3. Extension Service Consultation
            </h4>
            <p className="text-stone-600">
              In severe epidemic situations (e.g. rapid Late Blight spread, viral vector outbreaks, or sudden wilt), immediately submit physical leaf samples to your local Agricultural Extension Office, Krishi Vigyan Kendra (KVK), or university plant clinic.
            </p>
          </div>

        </div>

        <div className="mt-8 pt-4 border-t border-stone-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm rounded-xl shadow cursor-pointer transition"
          >
            I Understand & Accept
          </button>
        </div>

      </div>
    </div>
  );
};
