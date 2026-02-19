import React, { useState, useEffect } from "react";
import {
  X,
  ArrowRightLeft,
  Package,
  Send,
  AlertCircle,
  RefreshCcw,
  Plus,
  Trash2,
} from "lucide-react";
import API from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import { toast } from "react-hot-toast";

const TransferModal = ({ sourceStore, onClose, refreshData }) => {
  const [destStores, setDestStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [destinationStoreId, setDestinationStoreId] = useState("");

  // État pour gérer plusieurs produits
  const [selectedProducts, setSelectedProducts] = useState([
    { productId: "", qty: 1 },
  ]);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await API.get(API_PATHS.STORES.GET_ALL);
        if (res.data.success) {
          const filtered = res.data.data.filter(
            (s) => s._id !== sourceStore?._id,
          );
          setDestStores(filtered);
        }
      } catch (err) {
        toast.error("Impossible de charger les destinations");
      }
    };
    fetchDestinations();
  }, [sourceStore]);

  const addProductRow = () => {
    setSelectedProducts([...selectedProducts, { productId: "", qty: 1 }]);
  };

  const removeProductRow = (index) => {
    const newList = selectedProducts.filter((_, i) => i !== index);
    setSelectedProducts(newList.length ? newList : [{ productId: "", qty: 1 }]);
  };

  const updateProductRow = (index, field, value) => {
    const newList = [...selectedProducts];
    newList[index][field] = value;
    setSelectedProducts(newList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    for (const item of selectedProducts) {
      if (!item.productId) return toast.error("Sélectionnez tous les produits");
      const stock = sourceStore.items.find(
        (i) => i.product._id === item.productId,
      );
      if (item.qty > stock.quantityCartons) {
        return toast.error(`Stock insuffisant pour ${stock.product.name}`);
      }
    }

    setLoading(true);
    try {
      await API.post(API_PATHS.STORES.TRANSFER, {
        fromStoreId: sourceStore._id,
        toStoreId: destinationStoreId,
        products: selectedProducts,
      });

      toast.success("Transfert groupé réussi !");
      refreshData();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur de transfert");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[40px] relative shadow-2xl border border-slate-100 w-full max-w-2xl max-h-[85vh] overflow-y-auto">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-slate-300 hover:text-rose-500 transition-colors"
      >
        <X />
      </button>

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <ArrowRightLeft size={32} />
        </div>
        <h2 className="text-2xl font-black text-[#202042]">
          Transfert Multi-Produits
        </h2>
        <p className="text-slate-400 text-sm italic">
          Source :{" "}
          <span className="text-indigo-500 font-bold">{sourceStore?.name}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
            Dépôt de destination
          </label>
          <select
            required
            className="w-full px-6 py-4 bg-slate-50 rounded-[22px] outline-none border-2 border-transparent focus:border-indigo-100 font-bold text-[#202042]"
            value={destinationStoreId}
            onChange={(e) => setDestinationStoreId(e.target.value)}
          >
            <option value="">Sélectionner la destination...</option>
            {destStores.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} ({s.salePoint?.name || "Stock Central"})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center ml-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Liste des produits
            </label>
            <button
              type="button"
              onClick={addProductRow}
              className="text-indigo-500 hover:bg-indigo-50 px-3 py-1 rounded-lg flex items-center gap-1 text-[10px] font-bold uppercase transition-all"
            >
              <Plus size={14} /> Ajouter
            </button>
          </div>

          {selectedProducts.map((row, index) => {
            const currentStock = sourceStore?.items?.find(
              (i) => i.product._id === row.productId,
            );
            return (
              <div
                key={index}
                className="flex gap-3 items-end bg-slate-50/50 p-4 rounded-[22px] border border-slate-100"
              >
                <div className="flex-1 space-y-1">
                  <select
                    className="w-full bg-white px-4 py-3 rounded-xl border-none outline-none text-sm font-bold text-[#202042]"
                    value={row.productId}
                    onChange={(e) =>
                      updateProductRow(index, "productId", e.target.value)
                    }
                  >
                    <option value="">Choisir...</option>
                    {sourceStore?.items?.map((item) => (
                      <option
                        key={item.product._id}
                        value={item.product._id}
                        disabled={selectedProducts.some(
                          (p, i) =>
                            p.productId === item.product._id && i !== index,
                        )}
                      >
                        {item.product.name} ({item.quantityCartons} ctn)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-24 space-y-1">
                  <input
                    type="number"
                    min="1"
                    max={currentStock?.quantityCartons || 999}
                    className="w-full bg-white px-4 py-3 rounded-xl border-none outline-none text-sm font-bold text-[#202042]"
                    value={row.qty}
                    onChange={(e) =>
                      updateProductRow(index, "qty", parseInt(e.target.value))
                    }
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeProductRow(index)}
                  className="p-3 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-amber-50 rounded-2xl flex items-start gap-3 text-amber-600 border border-amber-100 text-[9px] font-black uppercase tracking-wider">
          <AlertCircle size={20} className="shrink-0" />
          Note : Les transferts vers boutiques impactent la dette automatique.
        </div>

        <button
          disabled={
            loading ||
            !destinationStoreId ||
            selectedProducts.some((p) => !p.productId)
          }
          className="w-full py-4 bg-[#202042] text-white rounded-[22px] font-black uppercase text-[10px] tracking-[0.2em] shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50 hover:bg-indigo-600"
        >
          {loading ? (
            <RefreshCcw className="animate-spin" size={18} />
          ) : (
            <>
              <Send size={18} /> Confirmer le transfert
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default TransferModal;
