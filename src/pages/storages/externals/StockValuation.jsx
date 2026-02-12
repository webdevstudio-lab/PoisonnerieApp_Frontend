import React from "react";
import { Wallet, Tag, TrendingUp, PieChart } from "lucide-react";

const StockValuation = ({ items }) => {
  // Calculs (Hypothèse : les prix sont dans l'objet product)
  const totalPurchase = items.reduce(
    (acc, item) =>
      acc + item.quantityCartons * (item.product?.purchasePrice || 0),
    0,
  );
  const totalValue = items.reduce(
    (acc, item) =>
      acc + item.quantityCartons * (item.product?.sellingPrice || 0),
    0,
  );
  const potentialProfit = totalValue - totalPurchase;

  const stats = [
    {
      label: "Valeur d'Achat",
      value: totalPurchase,
      icon: Wallet,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Valeur de Vente",
      value: totalValue,
      icon: Tag,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      label: "Marge Potentielle",
      value: potentialProfit,
      icon: TrendingUp,
      color: "text-indigo-500",
      bg: "bg-indigo-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((s, i) => (
        <div
          key={i}
          className="bg-white p-6 rounded-[35px] border border-white shadow-sm flex items-center gap-5"
        >
          <div
            className={`w-14 h-14 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center`}
          >
            <s.icon size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {s.label}
            </p>
            <p className="text-xl font-black text-[#202042]">
              {s.value.toLocaleString()} F
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StockValuation;
