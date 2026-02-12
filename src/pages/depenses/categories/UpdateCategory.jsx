import React, { useState } from "react";
import axios from "axios";

const UpdateCategory = ({ data, onClose, onSuccess }) => {
  const [name, setName] = useState(data.name);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Note: Pas de route PATCH spécifiée dans tes apiPaths pour catégories,
      // j'utilise le comportement standard PUT/PATCH sur l'ID si ton backend le gère.
      await axios.patch(`/api/v1/categories-depenses/${data._id}`, { name });
      onSuccess();
      onClose();
    } catch (err) {
      alert("Erreur lors de la mise à jour.");
    }
  };

  return (
    <div className="fixed inset-0 z-[400] bg-white/80 backdrop-blur-sm flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[#202042] p-8 rounded-[35px] w-full max-w-sm shadow-2xl"
      >
        <h3 className="text-white font-black uppercase text-sm mb-6 italic tracking-widest text-amber-400">
          Renommer
        </h3>
        <input
          autoFocus
          className="w-full bg-white/10 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-amber-400 mb-6 uppercase text-[11px]"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-4 text-slate-400 font-black text-[10px] uppercase"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="flex-[2] py-4 bg-amber-500 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-amber-500/20"
          >
            Sauvegarder
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCategory;
