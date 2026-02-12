import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  TrendingUp,
  BarChart3,
  Warehouse,
  AlertCircle,
  RefreshCcw,
  ArrowUpRight,
} from "lucide-react";
import API from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await API.get(API_PATHS.PRODUCTS.GET_ONE.replace(":id", id));
      if (res.data.success) setProduct(res.data.data);
    } catch (err) {
      console.error("Erreur détails produit:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <RefreshCcw className="animate-spin text-emerald-500" size={40} />
        <p className="font-black text-xs uppercase tracking-widest text-slate-400">
          Analyse de la référence...
        </p>
      </div>
    );

  return (
    <div className="space-y-8 animate-fadeIn pb-10">
      {/* HEADER AVEC FIL D'ARIANE */}
      <div className="flex items-center gap-5 bg-white p-6 rounded-[35px] shadow-sm border border-slate-50">
        <button
          onClick={() => navigate(-1)}
          className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-all"
        >
          <ArrowLeft size={20} className="text-[#202042]" />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-[#202042] uppercase tracking-tight">
              {product?.name}
            </h1>
            <span
              className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg ${
                product?.category === "poisson"
                  ? "bg-blue-50 text-blue-500"
                  : "bg-rose-50 text-rose-500"
              }`}
            >
              {product?.category}
            </span>
          </div>
          <p className="text-slate-400 font-bold text-xs mt-1 italic">
            Référence unique : {product?._id.slice(-6).toUpperCase()}
          </p>
        </div>
      </div>

      {/* GRILLE DE KPI FINANCIERS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-white flex items-center gap-6">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-3xl flex items-center justify-center shadow-inner">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
              Prix Achat
            </p>
            <p className="text-2xl font-black text-[#202042]">
              {product?.pricePurchase?.toLocaleString()}{" "}
              <span className="text-[10px]">FCFA</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-white flex items-center gap-6">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center shadow-inner">
            <ArrowUpRight size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-1">
              Prix Vente (Crt)
            </p>
            <p className="text-2xl font-black text-emerald-600">
              {product?.priceSaleCarton?.toLocaleString()}{" "}
              <span className="text-[10px]">FCFA</span>
            </p>
          </div>
        </div>

        <div className="bg-[#202042] p-8 rounded-[40px] shadow-xl shadow-emerald-100/20 flex items-center gap-6 text-white">
          <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-md">
            <BarChart3 size={28} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">
              Prix au Kilo
            </p>
            <p className="text-2xl font-black">
              {product?.pricePerKg?.toLocaleString()}{" "}
              <span className="text-emerald-400 text-[10px]">FCFA / KG</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* DISPONIBILITÉ PAR DÉPÔT */}
        <div className="bg-white rounded-[40px] p-8 shadow-sm border border-white">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-[#202042] uppercase flex items-center gap-3">
              <Warehouse size={20} className="text-emerald-500" /> Stocks par
              Dépôt
            </h3>
          </div>

          <div className="space-y-4">
            {/* Note : Ici on ferait normalement un appel API séparé pour filtrer les stocks contenant cet ID produit */}
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-100 rounded-[35px] text-slate-300">
              <Package size={40} className="mb-2 opacity-20" />
              <p className="text-[10px] font-black uppercase tracking-widest">
                Calcul des stocks en cours...
              </p>
            </div>
          </div>
        </div>

        {/* ALERTES ET CONFIGURATION */}
        <div className="bg-amber-50 rounded-[40px] p-8 border border-amber-100 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6 text-amber-600">
              <AlertCircle size={24} />
              <h3 className="text-lg font-black uppercase">
                Paramètres d'Alerte
              </h3>
            </div>

            <div className="bg-white p-6 rounded-[30px] shadow-sm mb-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Seuil critique actuel
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-amber-600">
                  {product?.lowStockThreshold}
                </span>
                <span className="text-sm font-bold text-slate-500 uppercase">
                  Cartons
                </span>
              </div>
            </div>

            <p className="text-xs text-amber-700 font-medium leading-relaxed italic">
              "Le système vous notifiera automatiquement dès que la quantité
              cumulée de ce produit dans tous vos dépôts descendra en dessous de
              ce seuil."
            </p>
          </div>

          {/* Décoration de fond */}
          <AlertCircle className="absolute -bottom-10 -right-10 text-amber-200/30 w-40 h-40" />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
