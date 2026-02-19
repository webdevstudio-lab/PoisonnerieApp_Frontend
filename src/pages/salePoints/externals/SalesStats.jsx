import React, { useState, useEffect, useCallback } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import API from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import { RefreshCcw, TrendingUp } from "lucide-react";

const SalesStats = ({ salePointId }) => {
  const [filter, setFilter] = useState("week");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchStats = useCallback(async () => {
    // Si pas d'ID, on ne reste pas en chargement, on arrête juste.
    if (!salePointId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(false);

      const path = API_PATHS.VENTE_JOUR.STATS_VENTE.replace(
        ":salePointId",
        salePointId,
      );

      const res = await API.get(`${path}?filter=${filter}`);

      // On vérifie la présence de données même si success n'est pas explicite
      if (res.data && (res.data.success || res.data)) {
        const statsData = res.data.data || res.data;
        setData(Array.isArray(statsData) ? statsData : []);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des stats:", err);
      setError(true);
    } finally {
      // Indispensable pour arrêter l'animation de chargement
      setLoading(false);
    }
  }, [salePointId, filter]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // État vide si aucune donnée après le chargement
  const isEmpty = !loading && data.length === 0;

  const filters = [
    { id: "week", label: "Semaine" },
    { id: "month", label: "Mois" },
    { id: "year", label: "Année" },
  ];

  return (
    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-50 relative min-h-[400px]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h3 className="text-lg font-black text-[#202042]">
            Performance Ventes
          </h3>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
            Analyse du chiffre d'affaires
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-2xl">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                filter === f.id
                  ? "bg-white text-[#3498DB] shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[250px] w-full flex items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <RefreshCcw className="animate-spin text-[#3498DB]" size={30} />
            <span className="text-xs font-bold text-slate-400 uppercase animate-pulse">
              Chargement des data...
            </span>
          </div>
        ) : error ? (
          <div className="text-center">
            <p className="text-red-400 text-xs font-bold">
              Erreur de connexion
            </p>
            <button
              onClick={fetchStats}
              className="text-[#3498DB] text-[10px] underline font-black"
            >
              RÉESSAYER
            </button>
          </div>
        ) : isEmpty ? (
          <div className="text-center space-y-2">
            <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
              <TrendingUp className="text-slate-300" size={20} />
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase">
              Aucune vente enregistrée sur cette période
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
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
              <YAxis
                tick={{ fontSize: 10, fontWeight: 800, fill: "#cbd5e1" }}
                tickFormatter={(value) =>
                  value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value
                }
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "20px",
                  border: "none",
                  padding: "15px",
                  boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                }}
                formatter={(value) => [
                  new Intl.NumberFormat("fr-FR").format(value) + " FCFA",
                  "Ventes",
                ]}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#3498DB"
                strokeWidth={4}
                fill="url(#colorTotal)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default SalesStats;
