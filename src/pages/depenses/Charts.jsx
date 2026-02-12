import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Charts = ({ data, period }) => {
  // 1. Sécurité : On s'assure que data est toujours un tableau
  const safeData = Array.isArray(data) ? data : [];

  const chartData = useMemo(() => {
    if (safeData.length === 0) return [];

    // 2. Grouper les montants par date
    const groups = safeData.reduce((acc, curr) => {
      const dateObj = new Date(curr.date);
      let label;

      if (period === "Année") {
        // Format: JANV, FÉVR...
        label = dateObj
          .toLocaleDateString("fr-FR", { month: "short" })
          .toUpperCase();
      } else if (period === "Jour") {
        // Format: 14:30
        label = `${dateObj.getHours()}H${dateObj.getMinutes().toString().padStart(2, "0")}`;
      } else {
        // Format: 12 OCT.
        label = dateObj
          .toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })
          .toUpperCase();
      }

      acc[label] = (acc[label] || 0) + curr.amount;
      return acc;
    }, {});

    // 3. Transformer l'objet en tableau pour Recharts
    // Puisque safeData est déjà trié par le backend, Object.keys conservera l'ordre d'insertion
    return Object.keys(groups).map((key) => ({
      name: key,
      montant: groups[key],
    }));
  }, [safeData, period]);

  // Si aucune donnée, on affiche un état vide propre
  if (chartData.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-50/50 rounded-[35px] border-2 border-dashed border-slate-100">
        <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">
          En attente de données...
        </p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100%", minHeight: "300px" }}>
      <ResponsiveContainer width="99%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#61b4f7" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#61b4f7" stopOpacity={0} />
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
            tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 800 }}
            dy={10}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 800 }}
            tickFormatter={(val) => val.toLocaleString()}
          />

          <Tooltip
            contentStyle={{
              borderRadius: "20px",
              border: "none",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
              fontSize: "10px",
              fontWeight: "900",
              textTransform: "uppercase",
            }}
            cursor={{
              stroke: "#61b4f7",
              strokeWidth: 2,
              strokeDasharray: "5 5",
            }}
          />

          <Area
            type="monotone"
            dataKey="montant"
            stroke="#61b4f7"
            strokeWidth={4}
            fillOpacity={1}
            fill="url(#colorAmt)"
            animationBegin={200}
            animationDuration={1200}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Charts;
