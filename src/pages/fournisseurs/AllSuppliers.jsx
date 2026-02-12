import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  RefreshCcw,
  ChevronRight,
  UserCheck,
  Tag,
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
    <div className="space-y-6 animate-fadeIn p-4">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#202042] tracking-tight">
            Annuaire Fournisseurs
          </h1>
          <p className="text-slate-400 text-sm font-medium italic">
            Gestion des partenaires et catalogues de prix d'achat
          </p>
        </div>
        <button
          onClick={() => openModal("add")}
          className="bg-indigo-600 hover:bg-[#202042] text-white px-6 py-4 rounded-[22px] font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all shadow-lg active:scale-95"
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

      {/* TABLEAU */}
      <div className="bg-white rounded-[40px] shadow-sm border border-white overflow-hidden">
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
            {isLoading ? (
              <tr>
                <td colSpan="4" className="py-20 text-center">
                  <RefreshCcw className="animate-spin mx-auto text-indigo-500" />
                </td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr
                  key={s._id}
                  className="group hover:bg-indigo-50/30 transition-all cursor-pointer"
                  onClick={() => navigate(`/suppliers/${s._id}`)}
                >
                  {/* NOM ET CONTACT */}
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 text-[#202042] rounded-2xl flex items-center justify-center font-black text-lg group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                        {s.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black text-[#202042] uppercase text-sm flex items-center gap-2">
                          {s.name}
                          <ChevronRight
                            size={14}
                            className="opacity-0 group-hover:opacity-100 text-indigo-400 transition-all translate-x-[-10px] group-hover:translate-x-0"
                          />
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold">
                          {s.contact || "Aucun contact"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* CATEGORIE ET CATALOGUE */}
                  <td className="px-8 py-6 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border ${
                          s.category === "grossiste"
                            ? "bg-purple-50 text-purple-600 border-purple-100"
                            : "bg-blue-50 text-blue-600 border-blue-100"
                        }`}
                      >
                        {s.category}
                      </span>
                      <span className="text-[9px] font-bold text-slate-300 flex items-center gap-1">
                        <Tag size={10} /> {s.productCatalog?.length || 0}{" "}
                        références
                      </span>
                    </div>
                  </td>

                  {/* BALANCE (DÛ) */}
                  <td className="px-8 py-6 text-right">
                    <p
                      className={`font-black text-sm ${s.balance > 0 ? "text-rose-500" : "text-emerald-500"}`}
                    >
                      {s.balance?.toLocaleString() || "0"}
                      <span className="text-[10px] ml-1">FCFA</span>
                    </p>
                    <p className="text-[9px] font-bold text-slate-300 uppercase italic">
                      {s.balance > 0 ? "Solde débiteur" : "À jour"}
                    </p>
                  </td>

                  {/* ACTIONS */}
                  <td
                    className="px-8 py-6"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openModal("edit", s)}
                        className="p-2.5 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all shadow-sm"
                        title="Modifier profil"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => openModal("delete", s)}
                        className="p-2.5 bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all shadow-sm"
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL SYSTEM (Portal rendered inside sub-components) */}
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
