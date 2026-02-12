import React, { useState } from "react";
import { Loader2, X, FolderPlus, Edit3 } from "lucide-react";
import { toast } from "react-hot-toast";
import API from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const InputModal = ({ type, data, parentId, onClose, onSuccess }) => {
  const [val, setVal] = useState(data?.name || "");
  const [loading, setLoading] = useState(false);

  const isRename = type === "rename";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!val.trim()) return toast.error("Le nom ne peut pas être vide");

    setLoading(true);
    try {
      if (isRename) {
        // PATCH /api/archive/:id
        const url = API_PATHS.ARCHIVES.RENAME.replace(":id", data._id);
        await API.patch(url, { newName: val.trim() });
        toast.success("Élément renommé");
      } else {
        // POST /api/archive/folder
        await API.post(API_PATHS.ARCHIVES.CREATE_FOLDER, {
          name: val.trim(),
          parentId: parentId || null,
        });
        toast.success("Dossier créé");
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[#202042]/40 backdrop-blur-md animate-in fade-in">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 border border-white"
      >
        <div className="flex items-center gap-4 mb-8">
          <div
            className={`p-3 rounded-2xl ${isRename ? "bg-amber-50 text-amber-500" : "bg-blue-50 text-blue-500"}`}
          >
            {isRename ? <Edit3 size={20} /> : <FolderPlus size={20} />}
          </div>
          <h3 className="text-lg font-black text-[#202042] uppercase tracking-tight">
            {isRename ? "Renommer" : "Nouveau Dossier"}
          </h3>
        </div>

        <input
          autoFocus
          className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-100 rounded-2xl outline-none transition-all font-black text-[#202042] mb-10 uppercase text-[11px] tracking-widest"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          disabled={loading}
          placeholder="Saisir le nom..."
        />

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 py-4 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg transition-all ${
              isRename
                ? "bg-amber-500 hover:bg-amber-600"
                : "bg-[#202042] hover:bg-[#2d2d5a]"
            }`}
          >
            {loading ? (
              <Loader2 className="animate-spin mx-auto" size={18} />
            ) : (
              "Valider"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputModal;
