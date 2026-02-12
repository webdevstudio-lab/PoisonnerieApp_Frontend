import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Warehouse,
  Trash2,
  Edit3,
  RefreshCcw,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import indispensable pour la navigation
import API from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import AddStore from "./AddStore";
import UpdateStore from "./UpdateStore";
import DeleteStore from "./DeleteStore";

const AllStorage = () => {
  const navigate = useNavigate(); // Initialisation du hook de navigation
  const [stores, setStores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modal, setModal] = useState({ isOpen: false, type: null, data: null });

  const fetchStores = async () => {
    try {
      setIsLoading(true);
      const res = await API.get(API_PATHS.STORES.GET_ALL);
      if (res.data.success) setStores(res.data.data);
    } catch (err) {
      console.error("Erreur récupération stocks:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const filteredStores = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.salePoint?.name.toLowerCase().includes(searchTerm.toLowerCase()),
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
            Gestion des Dépôts
          </h1>
          <p className="text-slate-400 text-sm font-medium italic">
            Inventaire des chambres froides et stocks relais
          </p>
        </div>
        <button
          onClick={() => openModal("add")}
          className="bg-[#2ECC71] hover:bg-[#202042] text-white px-6 py-4 rounded-[22px] font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all shadow-lg shadow-emerald-100 active:scale-95"
        >
          <Plus size={18} /> Nouvel Entrepôt
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative">
        <Search
          className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
          size={18}
        />
        <input
          type="text"
          placeholder="Rechercher un dépôt ou un point de vente rattaché..."
          className="w-full pl-14 pr-6 py-4 bg-white border-none rounded-[22px] text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-50/50 transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* GRID DES STOCKS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-20 flex flex-col items-center gap-4">
            <RefreshCcw className="animate-spin text-emerald-500" size={30} />
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
              Calcul de l'inventaire...
            </p>
          </div>
        ) : (
          filteredStores.map((store) => (
            <div
              key={store._id}
              // ACTION : Redirection au clic sur la carte
              onClick={() => navigate(`/store/${store._id}`)}
              className="bg-white rounded-[40px] border border-white p-6 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden cursor-pointer active:scale-[0.98]"
            >
              {/* Badge Type */}
              <div
                className={`absolute top-0 right-10 px-4 py-1.5 rounded-b-2xl text-[9px] font-black uppercase tracking-tighter ${
                  store.type === "principal"
                    ? "bg-emerald-500 text-white"
                    : "bg-amber-400 text-white"
                }`}
              >
                {store.type}
              </div>

              <div className="flex justify-between items-start mb-4">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                    store.type === "principal"
                      ? "bg-emerald-50 text-emerald-500"
                      : "bg-amber-50 text-amber-500"
                  }`}
                >
                  <Warehouse size={28} />
                </div>
                <div className="flex gap-1 pt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // EMPÊCHE la redirection vers les détails
                      openModal("edit", store);
                    }}
                    className="p-2 text-slate-300 hover:text-blue-500 transition-colors relative z-10"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // EMPÊCHE la redirection vers les détails
                      openModal("delete", store);
                    }}
                    className="p-2 text-slate-300 hover:text-rose-500 transition-colors relative z-10"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-black text-[#202042] mb-1 capitalize">
                {store.name}
              </h3>

              <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold mb-6">
                <MapPin size={14} className="text-emerald-500" />
                Rattaché à:{" "}
                <span className="text-[#202042]">
                  {store.salePoint?.name || "Aucun"}
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-[25px] flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Articles
                  </p>
                  <p className="text-sm font-black text-[#202042]">
                    {store.items?.length || 0} références
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Total Cartons
                  </p>
                  <p className="text-sm font-black text-emerald-600">
                    {store.items?.reduce(
                      (acc, item) => acc + (item.quantityCartons || 0),
                      0,
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL SYSTEM */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#202042]/40 backdrop-blur-md animate-in fade-in duration-300"
            onClick={closeModal}
          />
          <div className="relative w-full max-w-xl animate-in zoom-in duration-300">
            {modal.type === "add" && (
              <AddStore onClose={closeModal} refreshData={fetchStores} />
            )}
            {modal.type === "edit" && (
              <UpdateStore
                store={modal.data}
                onClose={closeModal}
                refreshData={fetchStores}
              />
            )}
            {modal.type === "delete" && (
              <DeleteStore
                store={modal.data}
                onClose={closeModal}
                refreshData={fetchStores}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllStorage;
