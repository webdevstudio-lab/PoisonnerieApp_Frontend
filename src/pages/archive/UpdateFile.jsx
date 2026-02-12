import React, { useState } from "react";
import { X, Edit3, Save, FolderOpen, FileText } from "lucide-react";

const UpdateFile = ({ file, onClose }) => {
  const [formData, setFormData] = useState({
    name: file?.name || "",
    category: file?.type || "invoice",
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    // Logique de mise à jour API ici
    console.log("Mise à jour :", formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-[#202042]/60 backdrop-blur-md animate-in fade-in"
        onClick={onClose}
      />

      <div className="relative bg-white w-[500px] rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-white">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
              <Edit3 size={24} />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#202042] uppercase tracking-tight">
                Détails du fichier
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                {file?.size}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full text-slate-300 hover:text-rose-500 transition-all border border-transparent hover:border-slate-200"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleUpdate} className="p-8 space-y-6">
          {/* NOM DU FICHIER */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest flex items-center gap-2">
              <FileText size={12} /> Nom de l'archive
            </label>
            <input
              type="text"
              required
              className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-[#202042] outline-none border-2 border-transparent focus:border-amber-100 transition-all"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          {/* CATÉGORIE / DOSSIER */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest flex items-center gap-2">
              <FolderOpen size={12} /> Rangement / Catégorie
            </label>
            <select
              className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-[#202042] outline-none border-2 border-transparent focus:border-amber-100 transition-all appearance-none"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="invoice">Factures Fournisseurs</option>
              <option value="report">Rapports d'activité</option>
              <option value="image">Photos & Captures</option>
              <option value="other">Autres documents</option>
            </select>
          </div>

          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 text-xs font-black uppercase text-slate-400 tracking-widest"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-[2] bg-[#202042] hover:bg-[#2d2d5a] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-blue-900/10 transition-all flex items-center justify-center gap-3"
            >
              <Save size={18} /> Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateFile;
