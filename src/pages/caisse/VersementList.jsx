import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Store,
  User,
  Search,
  Pencil,
  Trash2,
  X,
  Calendar,
  Wallet,
} from "lucide-react";
import API from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

// Import des modales
import { VersementEditModal } from "./modals/VersementEditModal";
import { ConfirmDeleteModal } from "./modals/ConfirmDeleteModal";

const VersementList = () => {
  const [versements, setVersements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedVersement, setSelectedVersement] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const fetchVersements = async () => {
    try {
      setIsLoading(true);
      const res = await API.get(API_PATHS.VERSEMENTS.GET_ALL);
      if (res.data.success) {
        setVersements(Array.isArray(res.data.data) ? res.data.data : []);
      }
    } catch (err) {
      console.error("Erreur:", err);
      setVersements([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVersements();
  }, []);

  const filteredData = versements.filter(
    (v) =>
      v.salePoint?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.receiver?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.note?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSuccess = () => {
    setIsEditOpen(false);
    setIsDeleteOpen(false);
    setSelectedVersement(null);
    fetchVersements();
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* HEADER & RECHERCHE */}
      <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 text-[#3498DB] rounded-xl flex items-center justify-center">
            <Store size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black text-[#202042] uppercase tracking-wider">
              Flux des Boutiques
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
              {filteredData.length} Opérations enregistrées
            </p>
          </div>
        </div>

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
            size={16}
          />
          <input
            type="text"
            placeholder="Rechercher boutique ou réceptionnaire..."
            className="pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-xs font-bold outline-none w-80 focus:ring-2 focus:ring-blue-100 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLEAU DÉTAILLÉ */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Date & Heure
              </th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Boutique Source
              </th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Réceptionnaire
              </th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Méthode
              </th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                Montant
              </th>
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              <tr>
                <td
                  colSpan="6"
                  className="py-20 text-center animate-pulse font-black text-slate-300"
                >
                  CHARGEMENT...
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="py-20 text-center font-bold text-slate-400"
                >
                  Aucun versement trouvé
                </td>
              </tr>
            ) : (
              filteredData.map((v) => (
                <tr
                  key={v._id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  {/* DATE */}
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-slate-300" />
                      <span className="text-sm font-bold text-slate-600">
                        {new Date(v.date).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </td>

                  {/* BOUTIQUE */}
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                        <Store size={14} />
                      </div>
                      <span className="text-sm font-black text-[#202042]">
                        {v.salePoint?.name}
                      </span>
                    </div>
                  </td>

                  {/* RÉCEPTIONNAIRE */}
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
                        <User size={14} />
                      </div>
                      <span className="text-sm font-bold text-slate-600">
                        {v.receiver?.name || v.user?.name || "Admin"}
                      </span>
                    </div>
                  </td>

                  {/* MÉTHODE */}
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-full uppercase tracking-tighter">
                      {v.paymentMethod}
                    </span>
                  </td>

                  {/* MONTANT */}
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-sm font-black text-[#2ECC71]">
                        {v.amount?.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-black text-[#2ECC71]">
                        F
                      </span>
                    </div>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-8 py-5">
                    <div className="flex justify-center gap-1">
                      <button
                        onClick={() => {
                          setSelectedVersement(v);
                          setIsEditOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedVersement(v);
                          setIsDeleteOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PORTALS MODALES (React Portal) */}
      {isEditOpen &&
        selectedVersement &&
        createPortal(
          <div className="fixed inset-0 bg-[#202042]/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg p-8 relative animate-in zoom-in-95 duration-200">
              <button
                onClick={() => setIsEditOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-red-500 transition-colors"
              >
                <X size={20} />
              </button>
              <VersementEditModal
                data={selectedVersement}
                onSuccess={handleSuccess}
              />
            </div>
          </div>,
          document.body,
        )}

      {isDeleteOpen &&
        selectedVersement &&
        createPortal(
          <div className="fixed inset-0 bg-[#202042]/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-sm p-8 text-center animate-in zoom-in-95 duration-200">
              <ConfirmDeleteModal
                versement={selectedVersement}
                onClose={() => setIsDeleteOpen(false)}
                onSuccess={handleSuccess}
              />
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default VersementList;
