import React, { useState, useEffect, useCallback } from "react";
import API from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import StatsCards from "./components/StatsCards";
import StockAlerts from "./components/StockAlerts";
import RecentMoves from "./components/RecentMoves";
import FinancialChart from "./components/FinancialChart";
import { Loader2, RefreshCcw } from "lucide-react";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // État pour le filtre d'année
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      // On envoie l'année en paramètre
      const res = await API.get(API_PATHS.DASHBOARD.GET_STATS, {
        params: { year: year },
      });

      if (res.data.success) {
        setData(res.data.data);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Erreur Dashboard:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [year]); // Refait l'appel si l'année change

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-[#3498DB]" size={40} />
        <p className="font-black text-slate-400 uppercase tracking-widest text-xs text-center">
          Analyse des données {year} en cours...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
        <p className="text-rose-500 font-bold">
          Impossible de charger les statistiques.
        </p>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-6 py-2 rounded-full text-sm font-bold transition-all"
        >
          <RefreshCcw size={16} /> RÉESSAYER
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10 animate-in fade-in zoom-in-95 duration-500">
      <StatsCards data={data?.kpis || {}} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* On passe l'année et la fonction pour la changer */}
          <FinancialChart
            chartData={data?.graphique || []}
            selectedYear={year}
            onYearChange={setYear}
          />
        </div>
        <StockAlerts alerts={data?.alertes || []} />
      </div>

      <RecentMoves moves={data?.mouvements || []} />
    </div>
  );
};

export default Dashboard;
