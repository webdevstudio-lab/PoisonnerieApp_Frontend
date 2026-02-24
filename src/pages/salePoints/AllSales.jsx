import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Store,
  Plus,
  Search,
  MapPin,
  Trash2,
  Edit3,
  RefreshCcw,
  Wallet,
  TrendingUp,
  Package,
} from "lucide-react";
import API from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Imports des composants de modaux
import AddSale from "./AddSale";
import UpdateSale from "./UpdateSale";
import DeleteSalePoint from "./DeleteSale";

const AllSales = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const isAdmin = user?.user?.role === "admin";

  const [modal, setModal] = useState({
    isOpen: false,
    type: null,
    data: null,
  });

  const fetchSales = async () => {
    try {
      setIsLoading(true);
      const res = await API.get(API_PATHS.SALES.GET_ALL);
      if (res.data.success) {
        setSales(res.data.data);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des points de vente:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const filteredSales = sales.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.location?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const openModal = (type, data = null) =>
    setModal({ isOpen: true, type, data });

  const closeModal = () => setModal({ isOpen: false, type: null, data: null });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#202042] tracking-tight">
            Points de Vente
          </h1>
          <p className="text-slate-400 text-sm font-medium italic">
            Géneral : {sales.length} boutique(s) active(s)
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => openModal("add")}
            className="bg-[#3498DB] hover:bg-[#202042] text-white px-6 py-4 rounded-[22px] font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all shadow-lg active:scale-95"
          >
            <Plus size={18} /> Nouveau Point de Vente
          </button>
        )}
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white/60 backdrop-blur-sm p-3 rounded-[30px] border border-white flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
            size={18}
          />
          <input
            type="text"
            placeholder="Rechercher une boutique..."
            className="w-full pl-14 pr-6 py-4 bg-white border-none rounded-[22px] text-sm font-bold outline-none focus:ring-4 focus:ring-blue-50/50 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={fetchSales}
          className="p-4 bg-white text-slate-400 rounded-[20px] hover:text-[#3498DB] transition-all"
        >
          <RefreshCcw size={20} className={isLoading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* GRID DES POINTS DE VENTE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4 text-slate-300">
            <div className="w-12 h-12 border-4 border-slate-100 border-t-[#3498DB] rounded-full animate-spin" />
            <p className="text-xs font-black uppercase tracking-widest">
              Chargement...
            </p>
          </div>
        ) : filteredSales.length > 0 ? (
          filteredSales.map((sale) => (
            <div
              key={sale._id}
              onClick={() => navigate(`/salesPoints/${sale._id}`)}
              className="bg-white rounded-[40px] border border-white p-7 shadow-sm hover:shadow-xl transition-all group relative cursor-pointer active:scale-[0.98]"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-blue-50 text-[#3498DB] rounded-2xl flex items-center justify-center group-hover:bg-[#3498DB] group-hover:text-white transition-colors">
                  <Store size={28} />
                </div>

                {isAdmin && (
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal("edit", sale);
                      }}
                      className="p-3 text-slate-300 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-all"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal("delete", sale);
                      }}
                      className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>

              <h3 className="text-xl font-black text-[#202042] mb-1 capitalize">
                {sale.name}
              </h3>

              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-6">
                <MapPin size={14} className="text-[#3498DB]" />
                {sale.location}
              </div>

              {/* STATS SECTION - AJUSTÉE POUR AFFICHER LES IMPAYÉS */}
              <div className="grid grid-cols-3 gap-2 p-4 bg-slate-50/80 rounded-[25px]">
                <div className="flex flex-col justify-center">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    En Caisse
                  </p>
                  <div className="flex items-center gap-1 text-[#2ECC71] font-black">
                    <TrendingUp size={10} />
                    <span className="text-[11px]">
                      {(sale.solde || 0).toLocaleString()} F
                    </span>
                  </div>
                </div>

                <div className="flex flex-col justify-center border-x border-slate-200 px-2">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Impayés
                  </p>
                  <div className="flex items-center gap-1 text-rose-500 font-black">
                    <Wallet size={10} />
                    <span className="text-[11px]">
                      {(sale.impayer || 0).toLocaleString()} F
                    </span>
                  </div>
                </div>

                <div className="flex flex-col justify-center pl-2">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Articles
                  </p>
                  <div className="flex items-center gap-1 text-[#202042] font-black">
                    <Package size={10} className="text-blue-400" />
                    <span className="text-[11px]">
                      {sale.displayStock?.length || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
            <p className="text-slate-400 font-bold">Aucune boutique trouvée.</p>
          </div>
        )}
      </div>

      {/* MODAL SYSTEM - UTILISATION DE REACT PORTAL */}
      {modal.isOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[#202042]/60 backdrop-blur-sm">
            <div className="absolute inset-0" onClick={closeModal} />
            <div className="relative w-full max-w-xl animate-in zoom-in duration-200">
              {modal.type === "add" && isAdmin && (
                <AddSale onClose={closeModal} refreshData={fetchSales} />
              )}

              {modal.type === "edit" && isAdmin && (
                <UpdateSale
                  sale={modal.data}
                  onClose={closeModal}
                  refreshData={fetchSales}
                />
              )}

              {modal.type === "delete" && isAdmin && (
                <DeleteSalePoint
                  sale={modal.data}
                  onClose={closeModal}
                  refreshData={fetchSales}
                />
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default AllSales;
