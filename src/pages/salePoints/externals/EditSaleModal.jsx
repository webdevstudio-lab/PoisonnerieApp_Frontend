import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  ShoppingCart,
  Calendar,
  Plus,
  Pencil,
  Trash2,
  Save,
  Info,
  Loader2,
  AlertCircle,
} from "lucide-react";
import API from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import { toast } from "react-hot-toast";

const EditSaleModal = ({
  isOpen,
  onClose,
  refreshData,
  salePointId,
  saleData,
}) => {
  const [date, setDate] = useState("");
  const [observation, setObservation] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [store, setStore] = useState(null);

  // Initialisation des données de la vente à modifier
  useEffect(() => {
    if (saleData) {
      setDate(new Date(saleData.date).toISOString().split("T")[0]);
      setObservation(saleData.observation || "");
      setItems(
        saleData.inventorySold.map((i) => ({
          productId: i.product?._id || i.product,
          cartonsSold: i.cartonsSold,
        })),
      );
    }
  }, [saleData]);

  // Charger le stock
  useEffect(() => {
    if (isOpen && salePointId) {
      (async () => {
        try {
          const url = API_PATHS.STORES.GET_BY_SALEPOINT.replace(
            ":salePointId",
            salePointId,
          );
          const res = await API.get(url);
          setStore(res.data.data);
        } catch (err) {
          toast.error("Erreur chargement stock");
        }
      })();
    }
  }, [isOpen, salePointId]);

  const stockItems = useMemo(() => store?.items || [], [store]);

  const getAvailableStock = (pId) => {
    const sItem = stockItems.find(
      (si) => (si.product?._id || si.product) === pId,
    );
    // Important: On rajoute au stock disponible ce qui est déjà réservé par cette vente
    const alreadyInSale =
      saleData?.inventorySold?.find(
        (si) => (si.product?._id || si.product) === pId,
      )?.cartonsSold || 0;
    return sItem ? sItem.quantityCartons + alreadyInSale : alreadyInSale;
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // On utilise l'ID de la vente pour l'URL de mise à jour (PUT)
      await API.patch(`${API_PATHS.VENTE_JOUR.ADD}/${saleData._id}`, {
        items: items.map((i) => ({
          productId: i.productId,
          cartonsSold: Number(i.cartonsSold),
        })),
        date,
        observation,
      });
      toast.success("Vente mise à jour");
      refreshData();
      onClose();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Erreur lors de la mise à jour",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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
          <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
            <Pencil size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#202042]">
              Modifier la Vente
            </h2>
            <p className="text-xs text-slate-400">ID: {saleData._id}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none"
            required
          />

          <div className="space-y-4">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex gap-2 items-center bg-slate-50 p-3 rounded-2xl"
              >
                <select
                  value={item.productId}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[idx].productId = e.target.value;
                    setItems(newItems);
                  }}
                  className="flex-1 p-2 bg-white rounded-xl font-bold text-sm outline-none"
                >
                  {stockItems.map((si) => (
                    <option key={si.product?._id} value={si.product?._id}>
                      {si.product?.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={item.cartonsSold}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[idx].cartonsSold = e.target.value;
                    setItems(newItems);
                  }}
                  className="w-20 p-2 bg-white rounded-xl text-center font-bold"
                />
                <button
                  type="button"
                  onClick={() => setItems(items.filter((_, i) => i !== idx))}
                  className="text-rose-400"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setItems([...items, { productId: "", cartonsSold: 1 }])
              }
              className="text-blue-500 text-xs font-bold flex items-center gap-1"
            >
              <Plus size={14} /> Ajouter un produit
            </button>
          </div>

          <textarea
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            className="w-full p-4 bg-slate-50 rounded-2xl min-h-[100px] outline-none"
            placeholder="Observations..."
          />

          <div className="flex justify-between items-center pt-4 border-t">
            <span className="text-xl font-black">
              {totalAmount.toLocaleString()} FCFA
            </span>
            <button
              disabled={loading}
              type="submit"
              className="px-8 py-3 bg-blue-500 text-white rounded-xl font-bold flex items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Save />} Mettre
              à jour
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
};

export default EditSaleModal;
