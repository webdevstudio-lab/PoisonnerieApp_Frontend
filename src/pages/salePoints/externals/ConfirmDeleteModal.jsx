import React from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, X, Trash2, Loader2 } from "lucide-react";

const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  title,
  message,
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-[#202042]/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-md rounded-[35px] p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
        {/* Fermer */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-slate-300 hover:text-slate-500 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mb-6">
            <AlertTriangle size={32} />
          </div>

          <h3 className="text-xl font-black text-[#202042] mb-2">
            {title || "Confirmer la suppression"}
          </h3>
          <p className="text-slate-400 text-sm font-medium leading-relaxed">
            {message ||
              "Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible."}
          </p>

          <div className="grid grid-cols-2 gap-3 w-full mt-8">
            <button
              onClick={onClose}
              disabled={loading}
              className="py-4 bg-slate-50 text-slate-500 font-bold rounded-2xl hover:bg-slate-100 transition-all active:scale-95"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="py-4 bg-rose-500 text-white font-bold rounded-2xl shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Trash2 size={18} />
                  Supprimer
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ConfirmDeleteModal;
