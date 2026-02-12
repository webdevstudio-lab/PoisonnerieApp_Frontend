import React, { useState } from "react";
import {
  X,
  User,
  UserCheck,
  Phone,
  Shield,
  Lock,
  Save,
  Wallet,
  Anchor,
} from "lucide-react";
import API from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";

const AddUsers = ({ onClose, refreshData }) => {
  const [formData, setFormData] = useState({
    name: "",
    username: "", // Changé de 'usermane' en 'username' pour correspondre au destructurage du contrôleur
    contact: "",
    password: "",
    role: "vendeur",
    // Note: Le champ 'solde' n'est pas traité par votre contrôleur actuel,
    // mais il est conservé ici si votre modèle User le gère par défaut.
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Création d'un "loading toast" qui sera mis à jour après la réponse
    const loadingToast = toast.loading("Création du membre en cours...");

    try {
      const response = await API.post(API_PATHS.USERS.ADD_ONE, formData);

      if (response.data) {
        // Succès : On met à jour le toast de chargement en toast de succès
        toast.success("Membre enregistré avec succès !", {
          id: loadingToast, // Remplace le toast de chargement
        });

        if (refreshData) refreshData();

        // On laisse un petit délai pour que l'utilisateur voie le message avant de fermer
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (err) {
      const errorMessage = err.message || "Une erreur est survenue.";

      // Erreur : On transforme le toast de chargement en toast d'erreur
      toast.error(errorMessage, {
        id: loadingToast,
      });

      setError(errorMessage);
      console.error("Erreur d'enrôlement:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 lg:p-12 relative max-h-[90vh] overflow-y-auto rounded-3xl">
      {/* Bouton Fermer */}
      <button
        onClick={onClose}
        className="absolute top-8 right-8 p-2 text-slate-300 hover:text-[#202042] hover:bg-slate-100 rounded-full transition-all"
      >
        <X size={24} />
      </button>

      {/* Header du Formulaire */}
      <div className="mb-10 text-center">
        <div className="w-16 h-16 bg-blue-50 text-[#3498DB] rounded-[22px] flex items-center justify-center mx-auto mb-4 shadow-inner">
          <Anchor size={32} />
        </div>
        <h2 className="text-2xl font-black text-[#202042] tracking-tight">
          Nouveau Membre
        </h2>
        <p className="text-slate-400 text-sm font-medium">
          Enrôlez un collaborateur dans l'équipage Océan
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nom Complet */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">
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
                placeholder="Ex: Vincent Bini"
                className="w-full pl-14 pr-6 py-4 bg-[#F8FAFC] border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-[22px] outline-none transition-all font-bold text-sm"
              />
            </div>
          </div>

          {/* Nom d'utilisateur (Identifiant) */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">
              Identifiant (Pseudo)
            </label>
            <div className="relative">
              <UserCheck
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
                size={18}
              />
              <input
                required
                name="username" // Match le destructurage du contrôleur
                value={formData.username}
                onChange={handleChange}
                placeholder="v.bini"
                className="w-full pl-14 pr-6 py-4 bg-[#F8FAFC] border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-[22px] outline-none transition-all font-bold text-sm"
              />
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">
              Contact Téléphonique
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
                placeholder="0708096655"
                className="w-full pl-14 pr-6 py-4 bg-[#F8FAFC] border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-[22px] outline-none transition-all font-bold text-sm"
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">
              Mot de passe
            </label>
            <div className="relative">
              <Lock
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
                size={18}
              />
              <input
                required
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-14 pr-6 py-4 bg-[#F8FAFC] border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-[22px] outline-none transition-all font-bold text-sm"
              />
            </div>
          </div>

          {/* Rôle */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">
              Rôle d'équipage
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
                className="w-full pl-14 pr-6 py-4 bg-[#F8FAFC] border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-[22px] outline-none transition-all font-bold text-sm appearance-none cursor-pointer"
              >
                <option value="vendeur">Vendeur</option>
                <option value="gestionnaire_stock">
                  Gestionnaire de Stock
                </option>
                <option value="admin">Administrateur</option>
              </select>
            </div>
          </div>

          {/* Solde Initial (Facultatif selon contrôleur) */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">
              Solde Initial (FCFA)
            </label>
            <div className="relative">
              <Wallet
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
                size={18}
              />
              <input
                type="number"
                name="solde"
                value={formData.solde}
                onChange={handleChange}
                className="w-full pl-14 pr-6 py-4 bg-[#F8FAFC] border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-[22px] outline-none transition-all font-bold text-sm"
              />
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="pt-8 flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-4 bg-slate-100 text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] rounded-[20px] hover:bg-slate-200 transition-all"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-[2] py-4 bg-[#3498DB] hover:bg-[#202042] text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-[20px] shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save size={18} />
                Enregistrer le membre
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUsers;
