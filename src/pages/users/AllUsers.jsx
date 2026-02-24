import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  UserPlus,
  Search,
  Phone,
  Wallet,
  Trash2,
  Edit3,
  RefreshCcw,
  UserX,
  BadgeCheck,
  ShieldCheck,
} from "lucide-react";
import API from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

import AddUser from "./AddUser";
import UpdateUser from "./UpdateUser";
import DeleteUser from "./DeleteUser";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await API.get(API_PATHS.USERS.GET_ALL);
      if (res.data.success) setUsers(res.data.data);
    } catch (err) {
      console.error("Erreur utilisateurs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.usermane?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // --- COMPOSANT MODAL PORTAL ---
  const ModalPortal = () => {
    if (!isModalOpen) return null;

    return createPortal(
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-[#202042]/40 backdrop-blur-md animate-in fade-in duration-300"
          onClick={handleCloseModal}
        />
        <div
          className={`relative w-full ${
            modalType === "delete" ? "max-w-md" : "max-w-2xl"
          } bg-white rounded-[45px] shadow-2xl overflow-hidden animate-in zoom-in duration-300`}
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
      </div>,
      document.body,
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn p-2 md:p-0 pb-20">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-[#202042] tracking-tight">
            Membres d'Équipage
          </h1>
          <p className="text-slate-400 text-xs md:text-sm font-medium italic">
            Gérez les accès de votre poissonnerie
          </p>
        </div>

        <div className="flex gap-2 md:gap-3">
          <button
            onClick={fetchUsers}
            className="flex-1 md:flex-none p-4 bg-white text-slate-400 rounded-[22px] border border-white shadow-sm hover:text-[#3498DB] transition-all flex justify-center"
          >
            <RefreshCcw size={18} className={isLoading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => handleOpenModal("add")}
            className="flex-[3] md:flex-none bg-[#3498DB] hover:bg-[#202042] text-white px-5 md:px-6 py-4 rounded-[22px] font-black text-[10px] md:text-xs uppercase tracking-widest flex items-center justify-center gap-2 md:gap-3 transition-all shadow-lg active:scale-95"
          >
            <UserPlus size={18} />
            <span className="truncate">Recruter un membre</span>
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white/60 backdrop-blur-sm p-2 md:p-3 rounded-[30px] border border-white">
        <div className="relative">
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

      {/* CONTENT AREA */}
      <div className="bg-white rounded-[40px] md:rounded-[45px] border border-white shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-20 flex flex-col items-center justify-center text-slate-300 gap-4">
            <div className="w-10 h-10 border-4 border-blue-50 border-t-[#3498DB] rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">
              Immersion...
            </p>
          </div>
        ) : filteredUsers.length > 0 ? (
          <>
            {/* VUE DESKTOP : Table (Cachée sous 1024px) */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <th className="px-8 py-6">Identité</th>
                    <th className="px-8 py-6 text-center">Rôle & Badge</th>
                    <th className="px-8 py-6">Contact</th>
                    <th className="px-8 py-6">Solde Portefeuille</th>
                    <th className="px-8 py-6 text-right">Actions</th>
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
                          <div className="w-11 h-11 bg-[#202042] text-white rounded-[16px] flex items-center justify-center font-black text-xs shadow-lg shadow-blue-900/10">
                            {u.name?.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-black text-[#202042] capitalize text-sm">
                              {u.name}
                            </p>
                            <p className="text-[10px] text-[#3498DB] font-bold tracking-wider">
                              @{u.usermane}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center">
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
                      <td className="px-8 py-5 text-slate-500 font-bold text-xs uppercase">
                        <div className="flex items-center gap-2 italic">
                          {u.contact}
                        </div>
                      </td>
                      <td className="px-8 py-5 font-black text-[#202042] text-sm">
                        {u.solde?.toLocaleString()}{" "}
                        <span className="text-[10px] text-slate-400">F</span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button
                            onClick={() => handleOpenModal("edit", u)}
                            className="p-2.5 bg-slate-50 text-slate-400 hover:text-amber-500 rounded-xl transition-all"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleOpenModal("delete", u)}
                            className="p-2.5 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all"
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

            {/* VUE MOBILE/TABLETTE : Cards (Cachée au-dessus de 1024px) */}
            <div className="lg:hidden divide-y divide-slate-50">
              {filteredUsers.map((u) => (
                <div
                  key={u._id}
                  className="p-5 flex flex-col gap-4 active:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#202042] text-white rounded-xl flex items-center justify-center font-black text-[10px]">
                        {u.name?.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-black text-[#202042] text-sm capitalize leading-tight">
                          {u.name}
                        </h3>
                        <p className="text-[9px] text-[#3498DB] font-bold">
                          @{u.usermane}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                        u.role === "admin"
                          ? "bg-rose-50 text-rose-500 border border-rose-100"
                          : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      }`}
                    >
                      {u.role}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <p className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-tighter">
                        Contact
                      </p>
                      <p className="text-xs font-bold text-[#202042]">
                        {u.contact}
                      </p>
                    </div>
                    <div className="bg-blue-50/30 p-3 rounded-2xl border border-blue-50">
                      <p className="text-[8px] font-black text-blue-400 uppercase mb-1 tracking-tighter">
                        Solde
                      </p>
                      <p className="text-xs font-black text-[#202042]">
                        {u.solde?.toLocaleString()} F
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => handleOpenModal("edit", u)}
                      className="flex-1 py-3 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest"
                    >
                      <Edit3 size={14} /> Modifier
                    </button>
                    <button
                      onClick={() => handleOpenModal("delete", u)}
                      className="flex-1 py-3 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest"
                    >
                      <Trash2 size={14} /> Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="p-20 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-4">
              <UserX size={32} />
            </div>
            <h3 className="text-sm font-black text-[#202042] uppercase">
              Aucun membre
            </h3>
          </div>
        )}
      </div>

      <ModalPortal />
    </div>
  );
};

export default UsersList;
