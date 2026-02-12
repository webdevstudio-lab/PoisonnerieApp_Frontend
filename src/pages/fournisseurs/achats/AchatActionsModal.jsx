import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Trash2, Hash, Store, AlignLeft, Save } from "lucide-react";
import API from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import { toast } from "react-hot-toast";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const AchatActionsModal = ({ achat, onClose, onRefresh }) => {
  // États de chargement
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // États des données (initialisés avec les valeurs actuelles de l'achat)
  const [items, setItems] = useState(achat.items || []);
  const [description, setDescription] = useState(achat.description || "");
  const [destinedStore, setDestinedStore] = useState(
    achat.destinedStore?._id || achat.destinedStore || "",
  );
  const [stores, setStores] = useState([]);

  // Récupération des boutiques pour le sélecteur
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await API.get(API_PATHS.STORES.GET_ALL);
        // Sécurité : On vérifie si les données sont dans res.data ou res.data.data
        const rawData = res.data?.data || res.data || [];
        setStores(Array.isArray(rawData) ? rawData : []);
      } catch (err) {
        console.error("Erreur chargement boutiques:", err);
        toast.error("Impossible de charger la liste des boutiques");
        setStores([]);
      }
    };
    fetchStores();
  }, []);

  // Gestion de la modification des produits (Quantité / Prix)
  const handleUpdateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: Number(value) };
    setItems(newItems);
  };

  // Calcul dynamique du nouveau total
  const newTotal = items.reduce(
    (sum, item) => sum + (item.unitPurchasePrice || 0) * (item.quantity || 0),
    0,
  );

  // Sauvegarde des modifications
  const saveChanges = async () => {
    try {
      setIsUpdating(true);
      await API.put(API_PATHS.ACHATS.UPDATE.replace(":id", achat._id), {
        items,
        description,
        destinedStore, // ID de la boutique sélectionnée
      });

      toast.success("Achat mis à jour avec succès");
      if (onRefresh) onRefresh();
      onClose();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Erreur de mise à jour";
      toast.error(errorMsg);
    } finally {
      setIsUpdating(false);
    }
  };

  // Suppression de l'achat
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await API.delete(API_PATHS.ACHATS.DELETE.replace(":id", achat._id));
      toast.success("Achat supprimé");
      if (onRefresh) onRefresh();
      onClose();
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return createPortal(
    <>
      <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-[#202042]/40 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Content */}
        <div className="relative bg-white w-full max-w-2xl rounded-[35px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="px-8 py-5 border-b border-slate-50 flex justify-between items-center bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center">
                <Hash size={18} />
              </div>
              <h2 className="font-black text-[#202042] text-sm uppercase tracking-tight">
                Modifier Achat #{achat._id.slice(-6).toUpperCase()}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 max-h-[65vh] overflow-y-auto bg-slate-50/30 space-y-6">
            {/* Formulaire Boutique & Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase mb-2">
                  <Store size={12} className="text-indigo-500" /> Boutique
                  Destination
                </label>
                <select
                  value={destinedStore}
                  onChange={(e) => setDestinedStore(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-xl py-2 px-3 text-xs font-bold text-[#202042] focus:ring-2 focus:ring-indigo-500/20"
                >
                  {stores.length > 0 ? (
                    stores.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))
                  ) : (
                    <option value="">Chargement des boutiques...</option>
                  )}
                </select>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase mb-2">
                  <AlignLeft size={12} className="text-indigo-500" /> Note /
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Note facultative..."
                  className="w-full bg-slate-50 border-none rounded-xl py-2 px-3 text-xs font-bold text-[#202042] focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Liste des Produits */}
            <div className="space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase px-2 tracking-widest">
                Détails des articles
              </p>
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-slate-300 uppercase mb-0.5">
                      Produit
                    </p>
                    <p className="text-xs font-black text-[#202042] truncate uppercase">
                      {item.productName ||
                        item.product?.name ||
                        "Article sans nom"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-20">
                      <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1 text-center">
                        Qté
                      </label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleUpdateItem(idx, "quantity", e.target.value)
                        }
                        className="w-full bg-slate-50 border-none rounded-lg py-1.5 px-2 text-xs font-black text-indigo-600 text-center"
                      />
                    </div>
                    <div className="w-28">
                      <label className="text-[9px] font-bold text-emerald-600 uppercase block mb-1 text-center">
                        Prix Unit.
                      </label>
                      <input
                        type="number"
                        value={item.unitPurchasePrice}
                        onChange={(e) =>
                          handleUpdateItem(
                            idx,
                            "unitPurchasePrice",
                            e.target.value,
                          )
                        }
                        className="w-full bg-emerald-50/30 border-none rounded-lg py-1.5 px-2 text-xs font-black text-emerald-600 text-center"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-50 flex items-center justify-between gap-4 bg-white">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-3 text-rose-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
              title="Supprimer l'achat"
            >
              <Trash2 size={20} />
            </button>

            <div className="flex items-center gap-5">
              <div className="text-right">
                <p className="text-[9px] font-black text-slate-300 uppercase">
                  Total calculé
                </p>
                <p className="text-xl font-black text-[#202042]">
                  {newTotal.toLocaleString()}{" "}
                  <span className="text-xs">FCFA</span>
                </p>
              </div>
              <button
                onClick={saveChanges}
                disabled={isUpdating}
                className="flex items-center gap-2 bg-[#202042] text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? (
                  "En cours..."
                ) : (
                  <>
                    <Save size={14} /> Enregistrer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation de suppression */}
      <ConfirmDeleteModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Annuler cet achat ?"
        message="Attention : Les stocks seront retirés de la boutique et le solde fournisseur sera mis à jour."
      />
    </>,
    document.body,
  );
};

export default AchatActionsModal;
