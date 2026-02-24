import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  RefreshCcw,
  ChevronRight,
  Tag,
  Phone,
  Wallet,
} from "lucide-react";
import API from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useNavigate } from "react-router-dom";
import AddSupplier from "./AddSupplier";
import UpdateSupplier from "./UpdateSupplier";
import DeleteSupplier from "./DeleteSupplier";

const AllSuppliers = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modal, setModal] = useState({ isOpen: false, type: null, data: null });

  const fetchSuppliers = async () => {
    try {
      setIsLoading(true);
      const res = await API.get(API_PATHS.SUPPLIER.GET_ALL);
      if (res.data.success) setSuppliers(res.data.data);
    } catch (err) {
      console.error("Erreur fournisseurs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const filtered = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.contact && s.contact.includes(searchTerm)),
  );

  const openModal = (type, data = null) =>
    setModal({ isOpen: true, type, data });
  const closeModal = () => setModal({ isOpen: false, type: null, data: null });

  return (
    <div className="space-y-6 animate-fadeIn p-2 sm:p-4 pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#202042] tracking-tight">
            Annuaire Fournisseurs
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm font-medium italic">
            Gestion des partenaires et catalogues de prix d'achat
          </p>
        </div>
        <button
          onClick={() => openModal("add")}
          className="bg-indigo-600 hover:bg-[#202042] text-white px-6 py-4 rounded-[22px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95 w-full md:w-auto"
        >
          <Plus size={18} /> Nouveau Fournisseur
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="relative">
        <Search
          className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
          size={18}
        />
        <input
          type="text"
          placeholder="Rechercher par nom ou téléphone..."
          className="w-full pl-14 pr-6 py-4 bg-white rounded-[22px] text-sm font-bold outline-none shadow-sm focus:ring-4 focus:ring-indigo-50 transition-all border border-transparent focus:border-indigo-100"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ZONE DE CONTENU (Tableau Desktop / Cards Mobile) */}
      {isLoading ? (
        <div className="py-20 text-center">
          <RefreshCcw
            className="animate-spin mx-auto text-indigo-500"
            size={32}
          />
          <p className="mt-4 text-slate-400 font-bold text-xs uppercase">
            Chargement...
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-100">
          <p className="text-slate-400 font-bold">Aucun fournisseur trouvé</p>
        </div>
      ) : (
        <>
          {/* --- VUE DESKTOP (Tableau) --- */}
          <div className="hidden lg:block bg-white rounded-[40px] shadow-sm border border-white overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Identité Partenaire
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                    Type / Catalogue
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                    Balance (Dû)
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((s) => (
                  <tr
                    key={s._id}
                    className="group hover:bg-indigo-50/30 transition-all cursor-pointer"
                    onClick={() => navigate(`/suppliers/${s._id}`)}
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 text-[#202042] rounded-2xl flex items-center justify-center font-black text-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          {s.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-[#202042] uppercase text-sm flex items-center gap-2">
                            {s.name}
                            <ChevronRight
                              size={14}
                              className="opacity-0 group-hover:opacity-100 text-indigo-400 transition-all"
                            />
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold">
                            {s.contact || "Aucun contact"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span
                          className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border ${s.category === "grossiste" ? "bg-purple-50 text-purple-600 border-purple-100" : "bg-blue-50 text-blue-600 border-blue-100"}`}
                        >
                          {s.category}
                        </span>
                        <span className="text-[9px] font-bold text-slate-300 flex items-center gap-1">
                          <Tag size={10} /> {s.productCatalog?.length || 0}{" "}
                          références
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p
                        className={`font-black text-sm ${s.balance > 0 ? "text-rose-500" : "text-emerald-500"}`}
                      >
                        {s.balance?.toLocaleString()}{" "}
                        <span className="text-[10px] ml-1">F</span>
                      </p>
                    </td>
                    <td
                      className="px-8 py-6"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openModal("edit", s)}
                          className="p-2.5 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-all"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => openModal("delete", s)}
                          className="p-2.5 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* --- VUE MOBILE (Cards) --- */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((s) => (
              <div
                key={s._id}
                onClick={() => navigate(`/suppliers/${s._id}`)}
                className="bg-white p-5 rounded-[30px] shadow-sm border border-white active:scale-[0.98] transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black">
                      {s.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-black text-[#202042] text-sm uppercase leading-tight">
                        {s.name}
                      </h3>
                      <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                        {s.category}
                      </span>
                    </div>
                  </div>
                  <div
                    className="flex gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => openModal("edit", s)}
                      className="p-2 bg-slate-50 text-slate-400 rounded-lg"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => openModal("delete", s)}
                      className="p-2 bg-slate-50 text-slate-400 rounded-lg"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-slate-50/50 p-3 rounded-2xl">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Phone size={14} />
                      <span className="text-[11px] font-bold">
                        {s.contact || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Tag size={14} />
                      <span className="text-[11px] font-bold">
                        {s.productCatalog?.length || 0} réf.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase">
                      Dette actuelle
                    </span>
                    <span
                      className={`font-black text-sm ${s.balance > 0 ? "text-rose-500" : "text-emerald-500"}`}
                    >
                      {s.balance?.toLocaleString()} F
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* MODAL SYSTEM */}
      {modal.isOpen && modal.type === "add" && (
        <AddSupplier onClose={closeModal} refreshData={fetchSuppliers} />
      )}
      {modal.isOpen && modal.type === "edit" && (
        <UpdateSupplier
          supplier={modal.data}
          onClose={closeModal}
          refreshData={fetchSuppliers}
        />
      )}
      {modal.isOpen && modal.type === "delete" && (
        <DeleteSupplier
          supplier={modal.data}
          onClose={closeModal}
          refreshData={fetchSuppliers}
        />
      )}
    </div>
  );
};

export default AllSuppliers;
