import React from "react";
import { Wallet, TrendingUp, ArrowDownRight, Package } from "lucide-react";

const StatsCards = ({ data }) => {
  const cards = [
    {
      label: "Solde Caisse",
      val: `${data?.soldeCaisse?.toLocaleString()} F`,
      icon: Wallet,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Ventes du mois",
      val: `${data?.ventesMois?.toLocaleString()} F`,
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      label: "Dépenses Mois",
      val: `${data?.depensesMois?.toLocaleString()} F`,
      icon: ArrowDownRight,
      color: "text-rose-500",
      bg: "bg-rose-50",
    },
    {
      label: "Bénéfice Net",
      val: `${data?.beneficeNet?.toLocaleString()} F`,
      icon: Package,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((stat, i) => (
        <div
          key={i}
          className="bg-white p-6 rounded-[35px] shadow-sm border border-slate-50"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
              <stat.icon size={22} />
            </div>
            <span className="text-[10px] font-black text-slate-300 uppercase">
              Temps Réel
            </span>
          </div>
          <p className="text-slate-400 text-xs font-bold uppercase mb-1">
            {stat.label}
          </p>
          <h3 className="text-xl font-black text-[#202042]">{stat.val}</h3>
        </div>
      ))}
    </div>
  );
};
export default StatsCards;
