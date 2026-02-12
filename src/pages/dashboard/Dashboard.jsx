import React from "react";
import {
  TrendingUp,
  AlertCircle,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  BarChart3,
  History,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Données fictives pour le graphique
const data = [
  { name: "Jan", ventes: 4000, depenses: 2400 },
  { name: "Mar", ventes: 3000, depenses: 1398 },
  { name: "Mai", ventes: 2000, depenses: 9800 },
  { name: "Juil", ventes: 2780, depenses: 3908 },
  { name: "Sep", ventes: 1890, depenses: 4800 },
  { name: "Nov", ventes: 3490, depenses: 4300 },
];

const Dashboard = () => {
  return (
    <div className="space-y-8 pb-10">
      {/* SECTION 1: STATS RAPIDES (Kpis) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Solde Caisse",
            val: "4.250.000 FCFA",
            icon: Wallet,
            color: "text-blue-500",
            bg: "bg-blue-50",
          },
          {
            label: "Bénéfice Net",
            val: "+850.000 FCFA",
            icon: TrendingUp,
            color: "text-emerald-500",
            bg: "bg-emerald-50",
          },
          {
            label: "Dépenses Mois",
            val: "120.000 FCFA",
            icon: ArrowDownRight,
            color: "text-rose-500",
            bg: "bg-rose-50",
          },
          {
            label: "Stock Total",
            val: "1.240 Kg",
            icon: Package,
            color: "text-amber-500",
            bg: "bg-amber-50",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-[35px] border border-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
                <stat.icon size={22} />
              </div>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                Temps réel
              </span>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wide mb-1">
              {stat.label}
            </p>
            <h3 className="text-xl font-black text-[#202042]">{stat.val}</h3>
          </div>
        ))}
      </div>

      {/* SECTION 2: GRAPHIQUE ET RUPTURE DE STOCK */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* GRAPHIQUE ÉVOLUTION */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[45px] border border-white shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-[#202042]">
                Évolution Financière
              </h3>
              <p className="text-sm text-slate-400 font-medium">
                Ventes vs Dépenses annuelle
              </p>
            </div>
            <BarChart3 className="text-slate-200" size={30} />
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorVentes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3498DB" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3498DB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#F1F5F9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "20px",
                    border: "none",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="ventes"
                  stroke="#3498DB"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorVentes)"
                />
                <Area
                  type="monotone"
                  dataKey="depenses"
                  stroke="#E2E8F0"
                  strokeWidth={2}
                  fill="transparent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ALERTES STOCK INSUFFISANT */}
        <div className="bg-white p-8 rounded-[45px] border border-white shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-amber-50 text-amber-500 p-2 rounded-xl">
              <AlertCircle size={20} />
            </div>
            <h3 className="text-lg font-black text-[#202042]">Alertes Stock</h3>
          </div>

          <div className="space-y-4 flex-1">
            {[
              { name: "Capitaine Frais", qte: "12kg", min: "50kg" },
              { name: "Crevettes Tigrées", qte: "5kg", min: "20kg" },
              { name: "Sole Noire", qte: "8kg", min: "30kg" },
            ].map((prod, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-[22px] border border-slate-100"
              >
                <div>
                  <p className="font-black text-sm text-[#202042]">
                    {prod.name}
                  </p>
                  <p className="text-[10px] text-rose-500 font-bold uppercase tracking-tighter">
                    Seuil: {prod.min}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
                    {prod.qte}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 py-4 bg-[#F8FAFC] hover:bg-[#3498DB] hover:text-white text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all">
            Gérer les stocks
          </button>
        </div>
      </div>

      {/* SECTION 3: DERNIERS MOUVEMENTS */}
      <div className="bg-white rounded-[45px] border border-white shadow-sm overflow-hidden">
        <div className="p-8 flex items-center justify-between border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 text-[#3498DB] p-2 rounded-xl">
              <History size={20} />
            </div>
            <h3 className="text-lg font-black text-[#202042]">
              Mouvements Récents
            </h3>
          </div>
          <button className="text-[11px] font-black text-[#3498DB] uppercase tracking-widest hover:underline">
            Voir tout l'historique
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Produit
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Action
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Quantité
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Date
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                {
                  name: "Thon Rouge",
                  type: "Vente",
                  qte: "-45 Kg",
                  date: "Aujourd'hui, 14:20",
                  status: "Terminé",
                  color: "text-rose-500",
                },
                {
                  name: "Daurade Royale",
                  type: "Arrivage",
                  qte: "+120 Kg",
                  date: "Hier, 09:15",
                  status: "En cours",
                  color: "text-emerald-500",
                },
                {
                  name: "Langoustines",
                  type: "Vente",
                  qte: "-12 Kg",
                  date: "Hier, 16:45",
                  status: "Terminé",
                  color: "text-rose-500",
                },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-8 py-5 font-bold text-[#202042]">
                    {row.name}
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                      {row.type}
                    </span>
                  </td>
                  <td className={`px-8 py-5 font-black ${row.color}`}>
                    {row.qte}
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-400 font-medium">
                    {row.date}
                  </td>
                  <td className="px-8 py-5">
                    <span className="bg-blue-50 text-[#3498DB] text-[10px] font-black px-3 py-1 rounded-full uppercase">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
