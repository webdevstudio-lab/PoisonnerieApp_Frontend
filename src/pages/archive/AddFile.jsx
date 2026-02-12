import React, { useState } from "react";
import { X, Upload, FileText, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import API from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const AddFile = ({ onClose, onSuccess, parentId }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (selectedFiles.length === 0)
      return toast.error("Sélectionnez au moins un fichier");

    setUploading(true);
    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file));
    formData.append("parentId", parentId || "null");

    try {
      await API.post(API_PATHS.ARCHIVES.UPLOAD, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Fichiers importés !");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur d'importation");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-[#202042]/60 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative bg-white w-[600px] rounded-[40px] shadow-2xl border border-white">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <h2 className="text-xl font-black text-[#202042] uppercase">
            Ajouter des documents
          </h2>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-rose-500"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8">
          <div className="relative border-4 border-dashed rounded-[35px] border-slate-100 hover:border-blue-200 py-16 text-center">
            <Upload size={32} className="mx-auto mb-4 text-blue-500" />
            <p className="text-sm font-black text-[#202042] uppercase mb-2">
              Cliquez pour parcourir
            </p>
            <input
              type="file"
              multiple
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
            />
          </div>

          {selectedFiles.length > 0 && (
            <div className="mt-8 max-h-40 overflow-y-auto space-y-2">
              {selectedFiles.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-slate-50 p-3 rounded-xl text-[11px] font-bold"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText size={14} /> {file.name}
                  </div>
                  <CheckCircle className="text-emerald-500" size={14} />
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex gap-4">
            <button
              disabled={uploading}
              onClick={onClose}
              className="flex-1 py-4 text-xs font-black uppercase text-slate-400"
            >
              Annuler
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="flex-[2] bg-blue-500 text-white py-4 rounded-2xl font-black text-xs uppercase shadow-lg disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : (
                "Démarrer l'upload"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFile;
