import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  ShoppingCart,
  Calendar,
  Plus,
  Trash2,
  Save,
  Info,
  Loader2,
  AlertCircle,
  User,
  CreditCard,
  Banknote,
} from "lucide-react";
import API from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import { toast } from "react-hot-toast";

const SaleModal = ({ isOpen, onClose, refreshData, salePointId }) => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [observation, setObservation] = useState("");
  const [items, setItems] = useState([{ productId: "", cartonsSold: 1 }]);
  const [isCredit, setIsCredit] = useState(false);
  const [clientId, setClientId] = useState("");
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [store, setStore] = useState(null);
  const [fetchingData, setFetchingData] = useState(false);

  // Charger le stock et la liste des clients
  useEffect(() => {
    if (isOpen && salePointId) {
      (async () => {
        setFetchingData(true);
        try {
          const storeUrl = API_PATHS.STORES.GET_BY_SALEPOINT.replace(
            ":salePointId",
            salePointId,
          );

          // Récupération simultanée du stock et des clients via API_PATHS
          const [storeRes, clientsRes] = await Promise.all([
            API.get(storeUrl),
            API.get(API_PATHS.CLIENTS.GET_ALL),
          ]);

          setStore(storeRes.data.data);
          // On s'assure de récupérer le tableau de clients selon la structure de ton responseHandler
          setClients(clientsRes.data.data || []);
        } catch (err) {
          console.error(err);
          toast.error("Erreur de chargement des données (Stock/Clients)");
        } finally {
          setFetchingData(false);
        }
      })();
    }
  }, [isOpen, salePointId]);

  const stockItems = useMemo(() => store?.items || [], [store]);

  const getAvailableStock = (pId) => {
    const sItem = stockItems.find(
      (si) => (si.product?._id || si.product) === pId,
    );
    return sItem ? sItem.quantityCartons : 0;
  };

  const hasStockError = useMemo(() => {
    return items.some(
      (item) =>
        item.productId &&
        Number(item.cartonsSold) > getAvailableStock(item.productId),
    );
  }, [items, stockItems]);

  const totalAmount = useMemo(() => {
    return items.reduce((sum, item) => {
      const sItem = stockItems.find(
        (si) => (si.product?._id || si.product) === item.productId,
      );
      return (
        sum +
        (sItem?.product?.sellingPrice || 0) * (Number(item.cartonsSold) || 0)
      );
    }, 0);
  }, [items, stockItems]);

  const updateItem = (idx, field, val) => {
    const newItems = [...items];
    newItems[idx][field] = val;
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (hasStockError) return toast.error("Stock insuffisant !");
    if (isCredit && !clientId)
      return toast.error("Veuillez sélectionner un client pour le crédit.");

    setLoading(true);
    const tid = toast.loading("Enregistrement de la vente...");
    try {
      await API.post(API_PATHS.VENTE_JOUR.ADD, {
        items: items.map((i) => ({
          productId: i.productId,
          cartonsSold: Number(i.cartonsSold),
        })),
        storeId: store._id,
        salePointId,
        date,
        observation,
        isCredit,
        clientId: isCredit ? clientId : null,
      });
      toast.success("Vente enregistrée avec succès", { id: tid });
      refreshData();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur serveur", { id: tid });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#202042]/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-[40px] p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-white/20">
        <button
          onClick={onClose}
          className="absolute right-8 top-8 text-slate-300 hover:text-rose-500 transition-colors"
        >
          <X size={28} />
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shadow-inner">
            <ShoppingCart size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#202042]">
              Nouvelle Vente
            </h2>
            <p className="text-slate-400 text-sm">
              Source :{" "}
              <span className="text-blue-500 font-bold">
                {store?.name || "..."}
              </span>
            </p>
          </div>
        </div>

        {fetchingData ? (
          <div className="py-20 flex flex-col items-center">
            <Loader2 className="animate-spin text-blue-500" size={40} />
            <p className="mt-4 text-slate-400 font-bold">
              Chargement des données...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                  Date
                </label>
                <div className="relative">
                  <Calendar
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-[22px] font-bold outline-none border-2 border-transparent focus:border-blue-100 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Toggle Mode de Paiement */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                  Mode de Paiement
                </label>
                <div className="flex bg-slate-50 p-1.5 rounded-[22px] gap-1">
                  <button
                    type="button"
                    onClick={() => setIsCredit(false)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[18px] font-bold text-sm transition-all ${
                      !isCredit
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-400"
                    }`}
                  >
                    <Banknote size={18} /> Cash
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCredit(true)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[18px] font-bold text-sm transition-all ${
                      isCredit
                        ? "bg-white text-amber-600 shadow-sm"
                        : "text-slate-400"
                    }`}
                  >
                    <CreditCard size={18} /> Crédit
                  </button>
                </div>
              </div>
            </div>

            {/* Sélection du Client (Uniquement si Crédit) */}
            {isCredit && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-4">
                  Client Débiteur
                </label>
                <div className="relative">
                  <User
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-300"
                    size={18}
                  />
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full pl-14 pr-10 py-4 bg-amber-50/50 rounded-[22px] font-bold outline-none border-2 border-amber-100 text-amber-900 appearance-none focus:bg-amber-50 transition-colors"
                    required={isCredit}
                  >
                    <option value="">
                      Sélectionner un client dans la liste...
                    </option>
                    {clients.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name} — (Dette actuelle:{" "}
                        {c.currentDebt?.toLocaleString()} FCFA)
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Plus size={16} className="text-amber-400" />
                  </div>
                </div>
              </div>
            )}

            {/* Liste des Produits */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                Articles à vendre
              </label>
              {items.map((item, idx) => {
                const stock = getAvailableStock(item.productId);
                const isError =
                  item.productId && Number(item.cartonsSold) > stock;
                return (
                  <div key={idx} className="space-y-2">
                    <div
                      className={`flex gap-3 items-center p-4 rounded-[25px] transition-all ${isError ? "bg-rose-50 border border-rose-200" : "bg-slate-50 border border-transparent"}`}
                    >
                      <select
                        value={item.productId}
                        onChange={(e) =>
                          updateItem(idx, "productId", e.target.value)
                        }
                        className="flex-1 bg-white rounded-xl p-3 font-bold text-sm outline-none shadow-sm"
                        required
                      >
                        <option value="">Choisir un produit...</option>
                        {stockItems.map((si) => (
                          <option key={si.product?._id} value={si.product?._id}>
                            {si.product?.name} —{" "}
                            {si.product?.sellingPrice?.toLocaleString()} FCFA
                            (Stock: {si.quantityCartons})
                          </option>
                        ))}
                      </select>
                      <div className="flex items-center bg-white rounded-xl px-2 shadow-sm">
                        <input
                          type="number"
                          value={item.cartonsSold}
                          onChange={(e) =>
                            updateItem(idx, "cartonsSold", e.target.value)
                          }
                          className="w-16 p-3 font-black text-center outline-none bg-transparent"
                          min="1"
                          required
                        />
                        <span className="text-[10px] font-bold text-slate-300 pr-2 uppercase">
                          Ctn
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          items.length > 1 &&
                          setItems(items.filter((_, i) => i !== idx))
                        }
                        className="p-2 text-rose-300 hover:text-rose-500 hover:bg-rose-100 rounded-full transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    {isError && (
                      <p className="text-[10px] text-rose-500 font-bold ml-4 flex items-center gap-1 animate-pulse">
                        <AlertCircle size={12} /> Stock insuffisant ! Max :{" "}
                        {stock} CTN
                      </p>
                    )}
                  </div>
                );
              })}

              <button
                type="button"
                onClick={() =>
                  setItems([...items, { productId: "", cartonsSold: 1 }])
                }
                className="flex items-center gap-2 text-blue-500 font-bold text-xs ml-4 hover:translate-x-1 transition-transform"
              >
                <div className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Plus size={14} />
                </div>
                Ajouter une ligne
              </button>
            </div>

            {/* Observation */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                Note libre
              </label>
              <div className="relative">
                <Info
                  className="absolute left-5 top-5 text-slate-300"
                  size={18}
                />
                <textarea
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                  placeholder="Détails, conditions particulières..."
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-[22px] font-bold outline-none min-h-[80px] border-2 border-transparent focus:border-blue-100 transition-all"
                />
              </div>
            </div>

            {/* Total et Validation */}
            <div className="pt-6 border-t border-slate-100 flex justify-between items-center bg-white sticky bottom-0">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Montant Total
                </span>
                <span className="text-3xl font-black text-[#202042]">
                  {totalAmount.toLocaleString()}{" "}
                  <small className="text-blue-500 text-xs tracking-normal font-bold">
                    FCFA
                  </small>
                </span>
              </div>

              <button
                disabled={loading || hasStockError || (isCredit && !clientId)}
                type="submit"
                className={`px-10 py-4 rounded-[22px] font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95 ${
                  isCredit
                    ? "bg-amber-500 hover:bg-amber-600 shadow-amber-200"
                    : "bg-[#3498DB] hover:bg-blue-600 shadow-blue-200"
                } text-white disabled:opacity-50 disabled:shadow-none`}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Save size={20} />
                )}
                {isCredit ? "Valider le Crédit" : "Valider la Vente"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default SaleModal;
