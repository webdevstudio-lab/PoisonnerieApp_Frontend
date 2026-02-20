import React, { useState, useEffect } from "react";
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
  ArrowUpDown,
  ChevronRight,
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
  const [activeFilter, setActiveFilter] = useState("all"); // all, restricted, debt

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

  // Logique de filtrage combinée (Recherche + Filtres d'état)
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

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-[#202042] tracking-tight">
            Répertoire <span className="text-blue-500">Clients</span>
          </h1>
          <p className="text-slate-400 font-bold mt-1 uppercase text-[11px] tracking-widest">
            {filteredClients.length} clients affichés
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* BARRE DE RECHERCHE */}
          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Rechercher un nom ou mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white shadow-sm rounded-2xl w-full md:w-72 font-bold text-[#202042] outline-none border-2 border-transparent focus:border-blue-50 transition-all"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#202042] hover:bg-black text-white px-6 py-3.5 rounded-2xl font-black transition-all shadow-xl active:scale-95"
          >
            <Plus size={20} /> Nouveau Client
          </button>
        </div>
      </div>

      {/* FILTRES RAPIDES */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <Filter size={16} className="text-slate-400 mr-2" />
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
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
              activeFilter === f.id
                ? `${f.color} ring-2 ring-offset-2 ring-current`
                : "bg-white text-slate-400 hover:bg-slate-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* TABLEAU */}
      <div className="bg-white rounded-[35px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
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
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <Loader2
                      className="animate-spin text-blue-500 mx-auto mb-4"
                      size={40}
                    />
                    <span className="font-bold text-slate-400 italic">
                      Chargement des données...
                    </span>
                  </td>
                </tr>
              ) : filteredClients.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="py-20 text-center text-slate-400 font-bold"
                  >
                    Aucun client ne correspond à votre recherche.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
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
                        <div className="text-[10px] font-bold text-slate-400">
                          Plafond: {client.creditLimit.toLocaleString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {client.isRestricted ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                          <AlertCircle size={12} /> Bloqué
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                          <ShieldCheck size={12} /> Actif
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="p-2.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                          title="Modifier"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(client._id, client.currentDebt)
                          }
                          className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button className="p-2.5 text-[#202042] hover:bg-slate-100 rounded-xl transition-all">
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL D'AJOUT */}
      <AddClient
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={fetchClients}
      />
    </div>
  );
};

export default AllClient;
