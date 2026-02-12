import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const dataMock = [
  { name: "Lun", total: 4000 },
  { name: "Mar", total: 3000 },
  { name: "Mer", total: 5000 },
  { name: "Jeu", total: 2780 },
  { name: "Ven", total: 4890 },
  { name: "Sam", total: 6390 },
  { name: "Dim", total: 3490 },
];

const SalesStats = ({ saleId }) => {
  return (
    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-50">
      <div className="mb-8">
        <h3 className="text-lg font-black text-[#202042]">
          Performance Ventes
        </h3>
        <p className="text-slate-400 text-xs font-bold uppercase">
          Chiffre d'affaires hebdomadaire
        </p>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dataMock}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3498DB" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3498DB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fontWeight: 800, fill: "#cbd5e1" }}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                borderRadius: "15px",
                border: "none",
                boxShadow: "0 10px 15px rgba(0,0,0,0.05)",
              }}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#3498DB"
              strokeWidth={4}
              fill="url(#colorTotal)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesStats;
