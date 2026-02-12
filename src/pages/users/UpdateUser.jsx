import React, { useState } from "react";
import {
  X,
  User,
  UserCheck,
  Phone,
  Shield,
  Lock,
  Save,
  Anchor,
} from "lucide-react";
import API from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";

const UpdateUser = ({ user, onClose, refreshData }) => {
  const [formData, setFormData] = useState({
    name: user.name || "",
    username: user.usermane || "", // On mappe usermane vers username pour le contrôleur
    contact: user.contact || "",
    role: user.role || "vendeur",
    password: "", // On laisse vide sauf si on veut changer le mot de passe
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const loadingToast = toast.loading("Mise à jour du profil...");

    try {
      const url = API_PATHS.USERS.UPDATE_ONE.replace(":id", user._id);
      const response = await API.patch(url, formData);

      if (response.data) {
        toast.success("Profil mis à jour !", { id: loadingToast });
        refreshData();
        setTimeout(onClose, 800);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur de modification", {
        id: loadingToast,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 lg:p-12 relative max-h-[90vh] overflow-y-auto rounded-3xl">
      <button
        onClick={onClose}
        className="absolute top-8 right-8 p-2 text-slate-300 hover:text-[#202042] rounded-full"
      >
        <X size={24} />
      </button>

      <div className="mb-10 text-center">
        <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-[22px] flex items-center justify-center mx-auto mb-4">
          <Anchor size={32} />
        </div>
        <h2 className="text-2xl font-black text-[#202042]">
          Modifier le Membre
        </h2>
        <p className="text-slate-400 text-sm">
          Mise à jour des informations de {user.name}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
              Nom & Prénoms
            </label>
            <div className="relative">
              <User
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
                size={18}
              />
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-14 pr-6 py-4 bg-[#F8FAFC] rounded-[22px] font-bold text-sm outline-none border-2 border-transparent focus:border-amber-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
              Identifiant
            </label>
            <div className="relative">
              <UserCheck
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
                size={18}
              />
              <input
                required
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full pl-14 pr-6 py-4 bg-[#F8FAFC] rounded-[22px] font-bold text-sm outline-none border-2 border-transparent focus:border-amber-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
              Contact
            </label>
            <div className="relative">
              <Phone
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
                size={18}
              />
              <input
                required
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className="w-full pl-14 pr-6 py-4 bg-[#F8FAFC] rounded-[22px] font-bold text-sm outline-none border-2 border-transparent focus:border-amber-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
              Rôle
            </label>
            <div className="relative">
              <Shield
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
                size={18}
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full pl-14 pr-6 py-4 bg-[#F8FAFC] rounded-[22px] font-bold text-sm outline-none appearance-none cursor-pointer"
              >
                <option value="vendeur">Vendeur</option>
                <option value="gestionnaire_stock">
                  Gestionnaire de Stock
                </option>
                <option value="admin">Administrateur</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-8 flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-4 bg-slate-100 text-slate-500 font-black text-[10px] uppercase rounded-[20px]"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-[2] py-4 bg-amber-500 text-white font-black text-[10px] uppercase rounded-[20px] shadow-lg shadow-amber-100 flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save size={18} /> Enregistrer les modifications
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateUser;
