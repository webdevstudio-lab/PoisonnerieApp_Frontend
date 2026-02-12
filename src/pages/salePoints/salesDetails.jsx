import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import API from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

import SalesStats from "./externals/SalesStats";
import TopProducts from "./externals/TopProducts";
import StockMovement from "./externals/StockMovement";
import FinancialSummary from "./externals/FinancialSummary";
import SaleModal from "./externals/SaleModal";

const SalesDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDetails = async () => {
    try {
      const res = await API.get(API_PATHS.SALES.GET_ONE.replace(":id", id));
      if (res.data.success) setData(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleSaleConfirm = async (saleInfo) => {
    try {
      await API.post("/sales/record", { ...saleInfo, salePointId: id });
      setIsModalOpen(false);
      fetchDetails(); // Re-charge tout (le solde sera mis à jour !)
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de la vente");
    }
  };

  if (loading)
    return (
      <div className="p-20 text-center font-black animate-pulse">
        CHARGEMENT...
      </div>
    );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 font-bold hover:text-[#202042]"
        >
          <ArrowLeft size={20} /> Retour
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#3498DB] text-white px-6 py-3 rounded-2xl font-black text-xs uppercase flex items-center gap-2 shadow-lg"
        >
          <Plus size={18} /> Nouvelle Vente
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <SalesStats />
          <StockMovement movements={data?.history} />
        </div>
        <div className="space-y-8">
          <FinancialSummary
            solde={data?.solde}
            secondaryStore={data?.secondaryStore}
          />
          <TopProducts products={data?.secondaryStore?.items} />
        </div>
      </div>

      <SaleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        products={data?.secondaryStore?.items || []}
        onConfirm={handleSaleConfirm}
      />
    </div>
  );
};
export default SalesDetails;
