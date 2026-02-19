import React, { useState, useEffect } from "react";
import { CheckCircle2, Clock, ReceiptText } from "lucide-react";
// Import API...

const VersementDetail = ({ salePointId }) => {
  const [versements, setVersements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Exemple d'appel API (à adapter selon tes routes existantes)
  useEffect(() => {
    const fetchVersements = async () => {
      setLoading(false); // Simulation pour l'instant
    };
    fetchVersements();
  }, [salePointId]);

  return (
    <div className="bg-white rounded-[35px] shadow-sm border border-slate-50 overflow-hidden">
      <div className="p-8 border-b border-slate-50 flex justify-between items-center text-rose-500">
        <h3 className="text-xl font-black text-[#202042]">
          Journal des Versements
        </h3>
        <ReceiptText size={24} className="text-slate-200" />
      </div>

      <div className="p-12 text-center">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="text-slate-300" size={32} />
        </div>
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
          Aucun versement enregistré ou module en attente
        </p>
      </div>
    </div>
  );
};

export default VersementDetail;
