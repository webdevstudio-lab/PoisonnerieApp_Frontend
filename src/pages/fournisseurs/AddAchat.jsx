import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom"; // Pour le rendu dans le body
import { X, Plus, Trash2, FileText, RefreshCcw } from "lucide-react";
import { toast } from "react-hot-toast";
import API from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";

const AddAchat = ({ supplierId, catalog, onClose }) => {
  const { user } = useAuth();
  // Récupération de l'ID utilisateur (s'adapte à tes deux structures possibles)
  const userId = user?._id || user?.user?._id;

  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState([]);
  const [formData, setFormData] = useState({
    storeId: "",
    description: "",
  });

  const [items, setItems] = useState([
    { productId: "", quantity: "", unitPurchasePrice: "" },
  ]);

  // 1. Charger les magasins de type 'principal'
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await API.get(API_PATHS.STORES.GET_ALL);
        const principalStores = res.data.data.filter(
          (s) => s.type === "principal",
        );
        setStores(principalStores);
        if (principalStores.length > 0) {
          setFormData((prev) => ({ ...prev, storeId: principalStores[0]._id }));
        }
      } catch (err) {
        toast.error("Erreur de chargement des stocks");
      }
    };
    fetchStores();
  }, []);

  // 2. Logique de filtrage des produits (Unicité)
  // On exclut les produits déjà sélectionnés dans les autres lignes
  const getAvailableCatalog = (currentIndex) => {
    const selectedIds = items
      .map((item, idx) => (idx !== currentIndex ? item.productId : null))
      .filter((id) => id !== null && id !== "");

    return catalog.filter((c) => !selectedIds.includes(c.product._id));
  };

  const addRow = () => {
    if (items.length >= catalog.length) {
      return toast.error("Tous les produits du catalogue sont déjà ajoutés");
    }
    setItems([
      ...items,
      { productId: "", quantity: "", unitPurchasePrice: "" },
    ]);
  };

  const removeRow = (index) => {
    if (items.length > 1) setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    // Auto-remplissage du prix si le produit change
    if (field === "productId") {
      const catalogItem = catalog.find((c) => c.product._id === value);
      newItems[index].unitPurchasePrice = catalogItem
        ? catalogItem.pricePurchase
        : "";
    }
    setItems(newItems);
  };

  const calculateGrandTotal = () =>
    items.reduce(
      (acc, curr) =>
        acc + (Number(curr.quantity) * Number(curr.unitPurchasePrice) || 0),
      0,
    );

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations de sécurité
    if (!userId)
      return toast.error("Session utilisateur expirée ou introuvable");
    if (!formData.storeId) return toast.error("Veuillez choisir un magasin");

    const validItems = items.filter((i) => i.productId && i.quantity > 0);
    if (validItems.length === 0)
      return toast.error("Le panier d'achat est vide");

    try {
      setLoading(true);
      const payload = {
        supplierId,
        storeId: formData.storeId,
        buyerId: userId, // On envoie l'ID récupéré via useAuth
        description:
          formData.description ||
          `Arrivage du ${new Date().toLocaleDateString()}`,
        items: validItems.map((item) => ({
          productId: item.productId,
          quantity: Number(item.quantity),
          unitPurchasePrice: Number(item.unitPurchasePrice),
        })),
      };

      await API.post(API_PATHS.ACHATS.CREATE, payload);
      toast.success("Bon d'achat enregistré avec succès");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.errors ||
          err.response?.data?.message ||
          "Erreur lors de l'achat",
      );
    } finally {
      setLoading(false);
    }
  };

  // Rendu via Portal pour une insertion propre dans le body
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/20 backdrop-blur-[4px]">
      <div className="bg-white rounded-[35px] shadow-[0_20px_70px_-10px_rgba(0,0,0,0.25)] overflow-hidden w-[1000px] flex flex-col animate-in zoom-in duration-300 border border-slate-100">
        {/* HEADER */}
        <div className="p-8 border-b border-slate-50 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-[#202042] text-white rounded-2xl flex items-center justify-center shadow-lg">
              {loading ? (
                <RefreshCcw className="animate-spin" />
              ) : (
                <FileText size={28} />
              )}
            </div>
            <div>
              <h2 className="text-xl font-black text-[#202042] uppercase tracking-tight">
                Nouveau Bon d'Achat
              </h2>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest opacity-70">
                Fournisseur ID: {supplierId.substring(0, 8)}...
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-slate-50 rounded-full text-slate-300 hover:text-rose-500 transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* CONFIGURATION */}
          <div className="px-8 pt-6 flex gap-6">
            <div className="flex-1 space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Magasin de réception
              </label>
              <select
                required
                className="w-full p-3.5 bg-indigo-50/30 border-2 border-transparent focus:border-indigo-100 rounded-xl font-bold text-sm outline-none transition-all"
                value={formData.storeId}
                onChange={(e) =>
                  setFormData({ ...formData, storeId: e.target.value })
                }
              >
                {stores.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} (Principal)
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Note / Description
              </label>
              <input
                type="text"
                className="w-full p-3.5 bg-slate-50 border-none rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-slate-100 transition-all"
                placeholder="Ex: Arrivage camion #12..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>

          {/* TABLEAU DES PRODUITS */}
          <div className="px-8 pt-6 pb-2 overflow-y-auto h-[350px] scrollbar-thin">
            <table className="w-full border-separate border-spacing-y-2">
              <thead className="sticky top-0 bg-white z-20">
                <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="pb-4 pl-4 w-[45%]">Désignation (Catalogue)</th>
                  <th className="pb-4 text-center w-[15%]">Qté</th>
                  <th className="pb-4 text-center w-[18%]">P.U Achat</th>
                  <th className="pb-4 text-right w-[17%]">Sous-Total</th>
                  <th className="pb-4 w-[5%]"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="group transition-all">
                    <td>
                      <select
                        required
                        className="w-full p-3.5 bg-slate-50 focus:ring-2 focus:ring-indigo-500/10 rounded-xl font-bold text-sm outline-none"
                        value={item.productId}
                        onChange={(e) =>
                          handleItemChange(index, "productId", e.target.value)
                        }
                      >
                        <option value="">Choisir un article...</option>
                        {getAvailableCatalog(index).map((c) => (
                          <option key={c._id} value={c.product._id}>
                            {c.product.name.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2">
                      <input
                        type="number"
                        required
                        min="1"
                        className="w-full p-3.5 bg-slate-50 rounded-xl font-black text-center text-sm outline-none focus:bg-white transition-all"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(index, "quantity", e.target.value)
                        }
                      />
                    </td>
                    <td className="px-2">
                      <input
                        type="number"
                        required
                        className="w-full p-3.5 bg-slate-50 rounded-xl font-black text-center text-sm outline-none text-emerald-600 focus:bg-white transition-all"
                        value={item.unitPurchasePrice}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "unitPurchasePrice",
                            e.target.value,
                          )
                        }
                      />
                    </td>
                    <td className="text-right pr-4 font-black text-[#202042] text-sm italic">
                      {(
                        Number(item.quantity) *
                          Number(item.unitPurchasePrice) || 0
                      ).toLocaleString()}{" "}
                      F
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        onClick={() => removeRow(index)}
                        className="p-2 text-slate-200 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                        disabled={items.length === 1}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-8 py-4">
            <button
              type="button"
              onClick={addRow}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-50 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:bg-[#202042] hover:text-white transition-all shadow-sm"
            >
              <Plus size={16} /> Ajouter une ligne
            </button>
          </div>

          {/* FOOTER */}
          <div className="p-8 bg-[#FBFBFE] border-t border-slate-100 shrink-0">
            <div className="flex justify-between items-center">
              <div className="bg-white p-5 rounded-[25px] border border-slate-200 flex justify-between items-center px-8 shadow-sm min-w-[400px]">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Total à payer
                </span>
                <div className="text-right">
                  <span className="text-3xl font-black text-indigo-600">
                    {calculateGrandTotal().toLocaleString()}
                  </span>
                  <span className="ml-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                    FCFA
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-xs font-black uppercase text-slate-400 hover:text-rose-500 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-10 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? "Enregistrement..." : "Confirmer l'achat"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body, // Injection directe dans le body
  );
};

export default AddAchat;
