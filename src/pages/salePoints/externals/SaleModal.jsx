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
} from "lucide-react";
import API from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import { toast } from "react-hot-toast";

const SaleModal = ({ isOpen, onClose, refreshData, salePointId }) => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [observation, setObservation] = useState("");
  const [items, setItems] = useState([{ productId: "", cartonsSold: 1 }]);
  const [loading, setLoading] = useState(false);
  const [store, setStore] = useState(null);
  const [fetchingStore, setFetchingStore] = useState(false);

  // Charger le stock disponible
  useEffect(() => {
    if (isOpen && salePointId) {
      (async () => {
        setFetchingStore(true);
        try {
          const url = API_PATHS.STORES.GET_BY_SALEPOINT.replace(
            ":salePointId",
            salePointId,
          );
          const res = await API.get(url);
          setStore(res.data.data);
        } catch (err) {
          toast.error("Impossible de charger le stock");
        } finally {
          setFetchingStore(false);
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

  if (!isOpen) return null;

  const updateItem = (idx, field, val) => {
    const newItems = [...items];
    newItems[idx][field] = val;
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (hasStockError) return toast.error("Stock insuffisant !");

    setLoading(true);
    const tid = toast.loading("Enregistrement...");
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
      });
      toast.success("Vente enregistrée", { id: tid });
      refreshData();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur serveur", { id: tid });
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#202042]/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-[40px] p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-8 top-8 text-slate-300 hover:text-rose-500"
        >
          <X size={28} />
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
            <ShoppingCart size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#202042]">
              Vente du Jour
            </h2>
            <p className="text-slate-400 text-sm">
              Source :{" "}
              <span className="text-blue-500 font-bold">
                {store?.name || "..."}
              </span>
            </p>
          </div>
        </div>

        {fetchingStore ? (
          <div className="py-20 flex flex-col items-center">
            <Loader2 className="animate-spin text-blue-500" size={40} />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-[22px] font-bold outline-none"
                  required
                />
              </div>
            </div>

            {/* Items */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                Produits
              </label>
              {items.map((item, idx) => {
                const stock = getAvailableStock(item.productId);
                const isError =
                  item.productId && Number(item.cartonsSold) > stock;
                return (
                  <div key={idx} className="space-y-2">
                    <div
                      className={`flex gap-3 items-center p-4 rounded-[25px] ${isError ? "bg-rose-50 border border-rose-200" : "bg-slate-50"}`}
                    >
                      <select
                        value={item.productId}
                        onChange={(e) =>
                          updateItem(idx, "productId", e.target.value)
                        }
                        className="flex-1 bg-white rounded-xl p-3 font-bold text-sm outline-none"
                        required
                      >
                        <option value="">Produit...</option>
                        {stockItems.map((si) => (
                          <option key={si.product?._id} value={si.product?._id}>
                            {si.product?.name} ({si.quantityCartons})
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={item.cartonsSold}
                        onChange={(e) =>
                          updateItem(idx, "cartonsSold", e.target.value)
                        }
                        className="w-20 bg-white rounded-xl p-3 font-bold text-center outline-none"
                        min="1"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          items.length > 1 &&
                          setItems(items.filter((_, i) => i !== idx))
                        }
                        className="text-rose-300 hover:text-rose-500"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    {isError && (
                      <p className="text-[10px] text-rose-500 font-bold ml-4 flex items-center gap-1">
                        <AlertCircle size={12} /> Max: {stock} CTN
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
                className="flex items-center gap-2 text-blue-500 font-bold text-sm ml-4"
              >
                <Plus size={18} /> Ajouter
              </button>
            </div>

            {/* Observation */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                Observation
              </label>
              <div className="relative">
                <Info
                  className="absolute left-5 top-5 text-slate-300"
                  size={18}
                />
                <textarea
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                  placeholder="Détails de la vente..."
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-[22px] font-bold outline-none min-h-[80px]"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <span className="text-2xl font-black text-[#202042]">
                {totalAmount.toLocaleString()}{" "}
                <small className="text-blue-500 text-xs">FCFA</small>
              </span>
              <button
                disabled={loading || hasStockError}
                type="submit"
                className="px-8 py-4 bg-[#3498DB] text-white rounded-[22px] font-bold flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Save size={20} />
                )}{" "}
                Valider
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
