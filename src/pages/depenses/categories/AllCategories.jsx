import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom"; // Import du Portal
import { X, Plus, Edit2, Trash2, Tag } from "lucide-react";
import toast from "react-hot-toast";

// Importation de l'instance API et des chemins
import API from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";

// Importation des sous-composants
import AddCategory from "./AddCategory";
import UpdateCategory from "./UpdateCategory";
import DeleteCategory from "./DeleteCategory";

const AllCategories = ({ onClose }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionModal, setActionModal] = useState({ type: null, data: null });

  // Fonction de récupération des données
  const fetchCats = async () => {
    try {
      setLoading(true);
      const res = await API.get(API_PATHS.CATEGORIES_DEPENSES.GET_ALL);
      setCategories(res.data?.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Erreur lors du chargement des catégories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  // Rendu via Portal pour passer au-dessus de la Sidebar
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#0f0f2d]/60 backdrop-blur-md animate-in fade-in duration-300">
      {/* Overlay pour fermer si on clique à côté de la liste */}
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="bg-white w-full max-w-2xl rounded-[45px] shadow-2xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-[#202042] uppercase italic tracking-tighter">
              Configuration
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Gestion des catégories de dépenses
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActionModal({ type: "add" })}
              className="group flex items-center gap-2 px-5 py-3 bg-[#61b4f7] text-white rounded-2xl hover:bg-[#202042] transition-all shadow-lg shadow-blue-200 active:scale-95"
            >
              <Plus size={18} strokeWidth={3} />
              <span className="text-[10px] font-black uppercase">Ajouter</span>
            </button>
            <button
              onClick={onClose}
              className="p-3 text-slate-300 hover:text-rose-500 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Liste des catégories */}
        <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block w-12 h-12 border-4 border-slate-100 border-t-[#61b4f7] rounded-full animate-spin mb-4"></div>
              <p className="font-black text-slate-200 uppercase text-sm italic tracking-widest">
                Chargement des données...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {categories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-slate-100 rounded-[35px] bg-slate-50/30">
                  <Tag size={40} className="text-slate-200 mb-4" />
                  <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest">
                    Aucune catégorie enregistrée
                  </p>
                </div>
              ) : (
                categories.map((cat) => (
                  <div
                    key={cat._id}
                    className="flex items-center justify-between p-5 bg-white rounded-[28px] border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 text-blue-500 rounded-2xl flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all shadow-inner">
                        <Tag size={20} />
                      </div>
                      <span className="font-black text-[#202042] uppercase text-[12px] tracking-tight">
                        {cat.name}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setActionModal({ type: "edit", data: cat })
                        }
                        className="p-3 text-amber-500 bg-amber-50 hover:bg-amber-500 hover:text-white rounded-xl transition-all active:scale-90"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() =>
                          setActionModal({ type: "delete", data: cat })
                        }
                        className="p-3 text-rose-500 bg-rose-50 hover:bg-rose-500 hover:text-white rounded-xl transition-all active:scale-90"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-8 py-4 bg-slate-50/50 text-center">
          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em]">
            Total: {categories.length} catégories configurées
          </p>
        </div>

        {/* Modales d'action (Portals imbriqués ou non) */}
        {actionModal.type === "add" && (
          <AddCategory
            onClose={() => setActionModal({ type: null })}
            onSuccess={fetchCats}
          />
        )}
        {actionModal.type === "edit" && (
          <UpdateCategory
            data={actionModal.data}
            onClose={() => setActionModal({ type: null })}
            onSuccess={fetchCats}
          />
        )}
        {actionModal.type === "delete" && (
          <DeleteCategory
            data={actionModal.data}
            onClose={() => setActionModal({ type: null })}
            onSuccess={fetchCats}
          />
        )}
      </div>
    </div>,
    document.body, // C'est ici que l'injection se fait
  );
};

export default AllCategories;
