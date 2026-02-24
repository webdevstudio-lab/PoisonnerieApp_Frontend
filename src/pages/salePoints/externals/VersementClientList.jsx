import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  UserCircle2,
  PencilLine,
  Filter,
  Loader2,
  ChevronRight,
  Phone,
  Wallet,
} from "lucide-react";
import API from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";

import AddVersementClient from "./AddVersementClient";
import UpdateVersementClient from "./UpdateVersementClient";

const VersementClientList = ({ salePointId }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const [modalState, setModalState] = useState({
    type: null,
    data: null,
  });

  const fetchDebtors = async () => {
    try {
      setLoading(true);
      const res = await API.get(API_PATHS.CLIENTS.GET_ALL);
      if (res.data.success) {
        const debtors = res.data.data.filter((c) => c.currentDebt > 0);
        setClients(debtors);
      }
    } catch (err) {
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebtors();
  }, [salePointId]);

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm);
    if (filter === "critical")
      return matchesSearch && client.currentDebt > 100000;
    return matchesSearch;
  });

  const closeModal = () => setModalState({ type: null, data: null });

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center p-12 lg:p-20 gap-4">
        <Loader2 className="animate-spin text-blue-500" size={32} />
        <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">
          Analyse des dettes...
        </p>
      </div>
    );

  return (
    <div className="space-y-4 lg:space-y-6 px-1 lg:px-0">
      {/* Barre d'outils mobile-friendly */}
      <div className="flex flex-col gap-4 bg-white p-4 lg:p-6 rounded-[25px] lg:rounded-[30px] shadow-sm border border-slate-100">
        <div className="relative w-full">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
            size={18}
          />
          <input
            type="text"
            placeholder="Rechercher nom ou tel..."
            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-100 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <Filter size={14} className="text-slate-400 flex-shrink-0" />
          {["all", "critical"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all ${
                filter === f
                  ? "bg-[#202042] text-white shadow-lg shadow-slate-200"
                  : "bg-slate-50 text-slate-400"
              }`}
            >
              {f === "all" ? "Tous les impayés" : "Dettes Critiques"}
            </button>
          ))}
        </div>
      </div>

      {/* Vue Mobile (Cartes) */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {filteredClients.map((client) => (
          <div
            key={client._id}
            className="bg-white rounded-[30px] border border-slate-100 shadow-sm overflow-hidden"
          >
            {/* Zone cliquable principale pour Versement */}
            <div
              onClick={() => setModalState({ type: "add", data: client })}
              className="p-5 active:bg-slate-50 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <UserCircle2 className="text-blue-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-[#202042] text-[15px]">
                      {client.name}
                    </h3>
                    <p className="flex items-center text-slate-400 text-[11px] font-bold">
                      <Phone size={10} className="mr-1" /> {client.phone}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter ${
                    client.currentDebt > 100000
                      ? "bg-rose-50 text-rose-500 border border-rose-100"
                      : "bg-amber-50 text-amber-600 border border-amber-100"
                  }`}
                >
                  {client.currentDebt > 100000 ? "Prioritaire" : "Régulier"}
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl flex justify-between items-center">
                <div>
                  <p className="text-[9px] font-black uppercase text-slate-400 mb-0.5">
                    Reste à payer
                  </p>
                  <p className="text-rose-500 font-black text-xl">
                    {client.currentDebt.toLocaleString()}{" "}
                    <span className="text-[10px]">FCFA</span>
                  </p>
                </div>
                <div className="bg-blue-600 text-white p-2.5 rounded-xl shadow-lg shadow-blue-100">
                  <Wallet size={20} />
                </div>
              </div>
            </div>

            {/* Barre d'actions Mobile (Le bouton modifier est ici) */}
            <div className="flex border-t border-slate-50">
              <button
                onClick={() => setModalState({ type: "update", data: client })}
                className="flex-1 py-3.5 flex items-center justify-center gap-2 text-[10px] font-black uppercase text-blue-500 hover:bg-blue-50 transition-colors"
              >
                <PencilLine size={14} />
                Détails Versement
              </button>
              <div className="w-[1px] bg-slate-50"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Vue Desktop (Tableau) */}
      <div className="hidden lg:block bg-white rounded-[35px] shadow-sm border border-slate-50 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
              <th className="px-8 py-5">Client</th>
              <th className="px-8 py-5">Téléphone</th>
              <th className="px-8 py-5 text-center">Statut</th>
              <th className="px-8 py-5 text-right">Montant Dû</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredClients.map((client) => (
              <tr
                key={client._id}
                onClick={() => setModalState({ type: "add", data: client })}
                className="hover:bg-blue-50/30 transition-all cursor-pointer group"
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <UserCircle2
                        className="text-slate-400 group-hover:text-blue-500"
                        size={20}
                      />
                    </div>
                    <span className="font-bold text-[#202042]">
                      {client.name}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6 text-slate-500 font-medium">
                  {client.phone}
                </td>
                <td className="px-8 py-6 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                      client.currentDebt > 100000
                        ? "bg-rose-50 text-rose-500"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {client.currentDebt > 100000 ? "Prioritaire" : "Régulier"}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <span className="text-rose-500 font-black text-lg">
                    {client.currentDebt.toLocaleString()}{" "}
                    <small className="text-[10px]">FCFA</small>
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div
                    className="flex justify-end"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() =>
                        setModalState({ type: "update", data: client })
                      }
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <PencilLine size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- RENDU DES MODALS VIA PORTAL --- */}
      {modalState.type === "add" &&
        createPortal(
          <AddVersementClient
            isOpen={true}
            onClose={closeModal}
            client={modalState.data}
            salePointId={salePointId}
            onSuccess={fetchDebtors}
          />,
          document.body,
        )}

      {modalState.type === "update" &&
        createPortal(
          <UpdateVersementClient
            isOpen={true}
            onClose={closeModal}
            client={modalState.data}
            onSuccess={fetchDebtors}
          />,
          document.body,
        )}
    </div>
  );
};

export default VersementClientList;
