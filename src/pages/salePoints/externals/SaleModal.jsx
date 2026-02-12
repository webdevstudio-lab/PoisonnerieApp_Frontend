import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X, ShoppingCart } from "lucide-react";

const SaleModal = ({ isOpen, onClose, products, onConfirm }) => {
  const [form, setForm] = useState({ productId: "", qty: 1 });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const item = products.find((p) => p.product._id === form.productId);
    onConfirm({
      productId: form.productId,
      quantityCartons: parseInt(form.qty),
      totalAmount: (item?.product?.sellingPrice || 0) * form.qty,
    });
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#202042]/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[35px] p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-slate-300 hover:text-slate-600"
        >
          <X size={24} />
        </button>
        <h2 className="text-xl font-black text-[#202042] mb-6 uppercase flex items-center gap-2">
          <ShoppingCart className="text-blue-500" /> Enregistrer Vente
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold"
            onChange={(e) => setForm({ ...form, productId: e.target.value })}
            required
          >
            <option value="">Sélectionner le produit</option>
            {products.map((item) => (
              <option key={item.product._id} value={item.product._id}>
                {item.product.name} ({item.quantityCartons} en stock)
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Quantité de cartons"
            className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold"
            onChange={(e) =>
              setForm({ ...form, qty: parseInt(e.target.value) })
            }
            min="1"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#3498DB] text-white py-4 rounded-2xl font-black uppercase shadow-lg shadow-blue-100"
          >
            Confirmer l'encaissement
          </button>
        </form>
      </div>
    </div>,
    document.body,
  );
};
export default SaleModal;
