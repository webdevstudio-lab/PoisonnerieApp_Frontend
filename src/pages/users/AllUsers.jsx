import React, { useState, useEffect } from "react";
import {
  UserPlus,
  Search,
  Phone,
  Wallet,
  Trash2,
  Edit3,
  RefreshCcw,
  UserX,
} from "lucide-react";
import API from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

// Importation des composants externes
import AddUser from "./AddUser";
import UpdateUser from "./UpdateUser";
import DeleteUser from "./DeleteUser";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // États pour la gestion des modaux
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'add', 'edit', ou 'delete'
  const [selectedUser, setSelectedUser] = useState(null);

  // --- LOGIQUE DE CHARGEMENT ---
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await API.get(API_PATHS.USERS.GET_ALL);
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des utilisateurs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- GESTION DES MODAUX ---
  const handleOpenModal = (type, user = null) => {
    setModalType(type);
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setSelectedUser(null);
  };

  // --- FILTRE DE RECHERCHE ---
  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.usermane?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#202042] tracking-tight">
            Membres d'Équipage
          </h1>
          <p className="text-slate-400 text-sm font-medium italic">
            Gérez les accès de votre poissonnerie
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={fetchUsers}
            className="p-4 bg-white text-slate-400 rounded-[22px] border border-white shadow-sm hover:text-[#3498DB] transition-all"
          >
            <RefreshCcw size={18} className={isLoading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => handleOpenModal("add")}
            className="bg-[#3498DB] hover:bg-[#202042] text-white px-6 py-4 rounded-[22px] font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all shadow-lg shadow-blue-100 active:scale-95"
          >
            <UserPlus size={18} />
            Recruter un membre
          </button>
        </div>
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
            placeholder="Rechercher un nom, pseudo..."
            className="w-full pl-14 pr-6 py-4 bg-white border-none rounded-[22px] text-sm font-bold outline-none focus:ring-4 focus:ring-blue-50/50 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE/LIST CONTAINER */}
      <div className="bg-white rounded-[45px] border border-white shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden">
        {isLoading ? (
          <div className="p-20 flex flex-col items-center justify-center text-slate-300 gap-4">
            <div className="w-12 h-12 border-4 border-blue-50 border-t-[#3498DB] rounded-full animate-spin" />
            <p className="text-xs font-black uppercase tracking-widest">
              Immersion en cours...
            </p>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Identité
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Rôle & Badge
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Contact
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Solde Portefeuille
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map((u) => (
                  <tr
                    key={u._id}
                    className="hover:bg-blue-50/20 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#202042] text-white rounded-[18px] flex items-center justify-center font-black text-sm shadow-lg shadow-blue-900/10">
                          {u.name?.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-[#202042] capitalize">
                            {u.name}
                          </p>
                          <p className="text-[10px] text-[#3498DB] font-bold tracking-wider">
                            @{u.usermane}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          u.role === "admin"
                            ? "bg-rose-50 text-rose-500 border border-rose-100"
                            : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-slate-500 font-bold text-sm">
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-slate-300" />
                        {u.contact}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-xl border border-slate-100 font-black text-[#202042]">
                        <Wallet size={14} className="text-blue-400" />
                        {u.solde?.toLocaleString()}{" "}
                        <span className="text-[9px] text-slate-400 uppercase ml-1">
                          F
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenModal("edit", u)}
                          className="p-2.5 bg-white text-slate-400 hover:text-amber-500 rounded-xl shadow-sm border border-slate-100 transition-all hover:scale-110"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleOpenModal("delete", u)}
                          className="p-2.5 bg-white text-slate-400 hover:text-rose-500 rounded-xl shadow-sm border border-slate-100 transition-all hover:scale-110"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-20 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-[30px] flex items-center justify-center text-slate-200 mb-4">
              <UserX size={40} />
            </div>
            <h3 className="text-lg font-black text-[#202042]">
              Aucun membre trouvé
            </h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto">
              Votre recherche ne correspond à aucun profil.
            </p>
          </div>
        )}
      </div>

      {/* MODAL SYSTEM (CONDITIONAL RENDERING) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay avec flou */}
          <div
            className="fixed inset-0 bg-[#202042]/40 backdrop-blur-md animate-in fade-in duration-300"
            onClick={handleCloseModal}
          />

          {/* Contenu du Modal */}
          <div
            className={`relative w-full ${modalType === "delete" ? "max-w-md" : "max-w-2xl"} bg-white rounded-[45px] shadow-2xl overflow-hidden animate-in zoom-in duration-300`}
          >
            {modalType === "add" && (
              <AddUser onClose={handleCloseModal} refreshData={fetchUsers} />
            )}

            {modalType === "edit" && (
              <UpdateUser
                user={selectedUser}
                onClose={handleCloseModal}
                refreshData={fetchUsers}
              />
            )}

            {modalType === "delete" && (
              <DeleteUser
                user={selectedUser}
                onClose={handleCloseModal}
                refreshData={fetchUsers}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;
