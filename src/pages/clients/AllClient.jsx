import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Plus,
  Trash2,
  Edit,
  AlertCircle,
  Search,
  Loader2,
  Phone,
  ShieldCheck,
  Filter,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import API from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";
import AddClient from "./AddClient";

const AllClient = () => {
  const [clients, setClients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await API.get(API_PATHS.CLIENTS.GET_ALL);
      setClients(res.data.data || []);
    } catch (err) {
      toast.error("Impossible de charger les clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleDelete = async (id, debt) => {
    if (debt > 0) return toast.error("Dette active : suppression impossible.");
    if (!window.confirm("Supprimer ce client ?")) return;

    try {
      await API.delete(API_PATHS.CLIENTS.DELETE.replace(":id", id));
      toast.success("Client supprimé");
      fetchClients();
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm);

    if (activeFilter === "restricted") return matchesSearch && c.isRestricted;
    if (activeFilter === "debt") return matchesSearch && c.currentDebt > 0;
    if (activeFilter === "overlimit")
      return matchesSearch && c.currentDebt > c.creditLimit;

    return matchesSearch;
  });

  // --- COMPOSANT MODAL PORTAL ---
  const ModalPortal = () => {
    if (!isModalOpen) return null;
    return createPortal(
      <AddClient
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={fetchClients}
      />,
      document.body,
    );
  };

  return (
    <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen pb-24">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#202042] tracking-tight">
            Répertoire <span className="text-blue-500">Clients</span>
          </h1>
          <p className="text-slate-400 font-bold mt-1 uppercase text-[10px] md:text-[11px] tracking-widest">
            {filteredClients.length} clients affichés
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* BARRE DE RECHERCHE */}
          <div className="relative group flex-1 sm:flex-none">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Nom ou mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3.5 bg-white shadow-sm rounded-2xl w-full md:w-72 font-bold text-[#202042] outline-none border-2 border-transparent focus:border-blue-50 transition-all text-sm"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-[#202042] hover:bg-black text-white px-6 py-4 rounded-2xl font-black transition-all shadow-xl active:scale-95 text-sm"
          >
            <Plus size={20} /> Nouveau Client
          </button>
        </div>
      </div>

      {/* FILTRES RAPIDES */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-4 no-scrollbar">
        <div className="flex items-center justify-center min-w-[40px]">
          <Filter size={16} className="text-slate-400" />
        </div>
        {[
          { id: "all", label: "Tous", color: "bg-slate-100 text-slate-600" },
          {
            id: "debt",
            label: "Avec Dette",
            color: "bg-amber-50 text-amber-600",
          },
          {
            id: "overlimit",
            label: "Dépassement",
            color: "bg-rose-50 text-rose-600",
          },
          {
            id: "restricted",
            label: "Bloqués",
            color: "bg-red-100 text-red-600",
          },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`px-5 py-2.5 rounded-xl text-[11px] font-black transition-all whitespace-nowrap ${
              activeFilter === f.id
                ? `${f.color} ring-2 ring-offset-2 ring-current`
                : "bg-white text-slate-400 hover:bg-slate-50 border border-slate-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ZONE DE CONTENU */}
      {loading ? (
        <div className="bg-white rounded-[35px] py-20 text-center border border-slate-100">
          <Loader2
            className="animate-spin text-blue-500 mx-auto mb-4"
            size={40}
          />
          <span className="font-bold text-slate-400 italic">
            Synchronisation...
          </span>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="bg-white rounded-[35px] py-20 text-center text-slate-400 font-bold border border-slate-100">
          Aucun client trouvé.
        </div>
      ) : (
        <>
          {/* --- DESKTOP TABLE (Cachée sur mobile) --- */}
          <div className="hidden lg:block bg-white rounded-[35px] shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[2px]">
                    Client
                  </th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[2px]">
                    Contact
                  </th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[2px]">
                    Situation Financière
                  </th>
                  <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[2px]">
                    Statut
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[2px] text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredClients.map((client) => (
                  <tr
                    key={client._id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#F1F5F9] rounded-xl flex items-center justify-center font-black text-[#202042] group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                          {client.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-black text-[#202042]">
                          {client.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                        <Phone size={14} className="text-slate-300" />
                        {client.phone}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <div
                          className={`text-sm font-black ${client.currentDebt > client.creditLimit ? "text-rose-500" : "text-[#202042]"}`}
                        >
                          {client.currentDebt.toLocaleString()}{" "}
                          <small className="text-[10px]">FCFA</small>
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          Plafond: {client.creditLimit.toLocaleString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {client.isRestricted ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-[9px] font-black uppercase tracking-widest">
                          <AlertCircle size={12} /> Bloqué
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest">
                          <ShieldCheck size={12} /> Actif
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all">
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(client._id, client.currentDebt)
                          }
                          className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button className="p-2.5 text-[#202042] hover:bg-slate-100 rounded-xl transition-all">
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* --- MOBILE CARDS (Cachées sur Desktop) --- */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredClients.map((client) => (
              <div
                key={client._id}
                className="bg-white p-5 rounded-[30px] border border-slate-100 shadow-sm active:scale-[0.98] transition-transform"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-lg">
                      {client.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-black text-[#202042] text-sm uppercase">
                        {client.name}
                      </h3>
                      <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                        <Phone size={10} /> {client.phone}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(client._id, client.currentDebt)}
                    className="p-2 text-slate-300 hover:text-rose-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="bg-slate-50/50 rounded-2xl p-4 mb-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Dette Actuelle
                    </p>
                    <p
                      className={`text-sm font-black ${client.currentDebt > client.creditLimit ? "text-rose-500" : "text-[#202042]"}`}
                    >
                      {client.currentDebt.toLocaleString()}{" "}
                      <span className="text-[10px]">F</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Plafond
                    </p>
                    <p className="text-sm font-black text-slate-600">
                      {client.creditLimit.toLocaleString()}{" "}
                      <span className="text-[10px]">F</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                  {client.isRestricted ? (
                    <span className="flex items-center gap-1 text-rose-600 text-[9px] font-black uppercase tracking-widest">
                      <AlertCircle size={12} /> Bloqué
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-emerald-600 text-[9px] font-black uppercase tracking-widest">
                      <ShieldCheck size={12} /> Compte Actif
                    </span>
                  )}
                  <button className="flex items-center gap-1 bg-[#202042] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                    Détails <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <ModalPortal />
    </div>
  );
};

export default AllClient;
