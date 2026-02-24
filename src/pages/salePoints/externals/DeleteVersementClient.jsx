import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  X,
  History,
  Edit2,
  Trash2,
  Check,
  Loader2,
  Printer,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import API from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import { toast } from "react-hot-toast";

const UpdateVersementClient = ({ isOpen, onClose, client, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [versements, setVersements] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  // État pour la mini-confirmation de suppression
  const [deletingId, setDeletingId] = useState(null);
  const [confirmName, setConfirmName] = useState("");

  const fetchVersements = useCallback(async () => {
    if (!client?._id) return;
    try {
      setLoading(true);
      const res = await API.get(
        API_PATHS.VERSEMENTS_CLIENTS.GET_STATEMENT.replace(
          ":clientId",
          client._id,
        ),
      );
      setVersements(res.data.data.payments || []);
    } catch (err) {
      toast.error("Erreur de chargement de l'historique");
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    if (isOpen) {
      fetchVersements();
      setDeletingId(null);
      setConfirmName("");
    }
  }, [isOpen, fetchVersements]);

  const startEditing = (v) => {
    setEditingId(v._id);
    setEditData({
      paymentMethod: v.paymentMethod,
      paymentDate: v.paymentDate.split("T")[0],
      notes: v.notes || "",
    });
  };

  const handleUpdate = async (id) => {
    try {
      const res = await API.put(
        API_PATHS.VERSEMENTS_CLIENTS.UPDATE.replace(":id", id),
        editData,
      );
      if (res.data.success) {
        toast.success("Versement mis à jour");
        setEditingId(null);
        fetchVersements();
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Erreur lors de la mise à jour",
      );
    }
  };

  const handleDelete = async (id) => {
    if (confirmName !== client.name) {
      return toast.error("Le nom saisi ne correspond pas.");
    }

    try {
      setLoading(true);
      const res = await API.delete(
        API_PATHS.VERSEMENTS_CLIENTS.DELETE.replace(":id", id),
      );
      if (res.data.success) {
        toast.success("Versement annulé");
        setDeletingId(null);
        setConfirmName("");
        fetchVersements();
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'annulation");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !client) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-[#202042]/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative bg-[#f8fafc] w-full max-w-6xl h-[92vh] sm:h-[85vh] rounded-t-[40px] sm:rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* HEADER */}
        <div className="bg-[#202042] p-5 sm:p-8 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
              <History size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black leading-tight">
                Historique & Modifications
              </h2>
              <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest">
                {client.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          {/* STATS RAPIDES */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-emerald-50 p-4 rounded-3xl border border-emerald-100">
              <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">
                Total Versé
              </p>
              <p className="text-lg font-black text-emerald-700">
                {versements
                  .reduce((acc, v) => acc + (v.amount || 0), 0)
                  .toLocaleString()}{" "}
                F
              </p>
            </div>
            <div className="bg-amber-50 p-4 rounded-3xl border border-amber-100">
              <p className="text-[10px] font-black text-amber-600 uppercase mb-1">
                Dette Actuelle
              </p>
              <p className="text-lg font-black text-amber-700">
                {client.currentDebt?.toLocaleString()} F
              </p>
            </div>
          </div>

          {loading && versements.length === 0 ? (
            <div className="h-40 flex items-center justify-center">
              <Loader2 className="animate-spin text-indigo-500" size={32} />
            </div>
          ) : (
            <div className="space-y-4">
              {versements.map((v) => (
                <div
                  key={v._id}
                  className="bg-white p-5 rounded-[30px] border border-slate-200 shadow-sm overflow-hidden"
                >
                  {/* ZONE SUPPRESSION (OVERLAY LOCAL) */}
                  {deletingId === v._id ? (
                    <div className="bg-rose-50 -m-5 p-5 animate-in fade-in duration-200">
                      <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="text-rose-500" size={20} />
                        <p className="text-xs font-black text-rose-600 uppercase">
                          Confirmer l'annulation de {v.amount?.toLocaleString()}{" "}
                          F ?
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="text"
                          placeholder={`Tapez "${client.name}"`}
                          className="flex-1 bg-white border-2 border-rose-100 p-3 rounded-2xl text-xs font-bold outline-none"
                          value={confirmName}
                          onChange={(e) => setConfirmName(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <button
                            disabled={confirmName !== client.name || loading}
                            onClick={() => handleDelete(v._id)}
                            className="flex-1 sm:flex-none bg-rose-500 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase disabled:opacity-50"
                          >
                            Supprimer
                          </button>
                          <button
                            onClick={() => {
                              setDeletingId(null);
                              setConfirmName("");
                            }}
                            className="bg-slate-200 text-slate-600 px-4 py-3 rounded-2xl"
                          >
                            <RotateCcw size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* ZONE AFFICHAGE / EDITION */
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 flex-1 gap-4">
                        {/* Date */}
                        <div>
                          <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">
                            Date
                          </label>
                          {editingId === v._id ? (
                            <input
                              type="date"
                              className="w-full bg-slate-100 p-2 rounded-xl text-xs font-bold"
                              value={editData.paymentDate}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  paymentDate: e.target.value,
                                })
                              }
                            />
                          ) : (
                            <span className="text-sm font-bold text-slate-700">
                              {new Date(v.paymentDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {/* Mode */}
                        <div>
                          <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">
                            Mode
                          </label>
                          {editingId === v._id ? (
                            <select
                              className="w-full bg-slate-100 p-2 rounded-xl text-xs font-bold"
                              value={editData.paymentMethod}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  paymentMethod: e.target.value,
                                })
                              }
                            >
                              <option value="ESPÈCES">ESPÈCES</option>
                              <option value="WAVE">WAVE</option>
                              <option value="ORANGE MONEY">ORANGE MONEY</option>
                              <option value="MOOV MONEY">MOOV MONEY</option>
                            </select>
                          ) : (
                            <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg text-[10px] font-black">
                              {v.paymentMethod}
                            </span>
                          )}
                        </div>
                        {/* Montant (Non éditable pour intégrité caisse) */}
                        <div>
                          <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">
                            Montant
                          </label>
                          <span className="text-sm font-black text-emerald-600">
                            {v.amount?.toLocaleString()} F
                          </span>
                        </div>
                        {/* Notes */}
                        <div>
                          <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">
                            Notes
                          </label>
                          {editingId === v._id ? (
                            <input
                              type="text"
                              className="w-full bg-slate-100 p-2 rounded-xl text-xs"
                              value={editData.notes}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  notes: e.target.value,
                                })
                              }
                            />
                          ) : (
                            <span className="text-xs text-slate-400 italic truncate block">
                              {v.notes || "-"}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex gap-2 items-center justify-end border-t md:border-t-0 pt-3 md:pt-0">
                        {editingId === v._id ? (
                          <>
                            <button
                              onClick={() => handleUpdate(v._id)}
                              className="bg-emerald-500 text-white p-3 rounded-2xl shadow-lg shadow-emerald-100"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="bg-slate-100 text-slate-500 p-3 rounded-2xl"
                            >
                              <RotateCcw size={18} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handlePrintReceipt(v)}
                              className="p-3 text-slate-400 hover:bg-slate-50 rounded-2xl transition-colors"
                            >
                              <Printer size={18} />
                            </button>
                            <button
                              onClick={() => startEditing(v)}
                              className="p-3 text-blue-500 hover:bg-blue-50 rounded-2xl transition-colors"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => {
                                setDeletingId(v._id);
                                setEditingId(null);
                              }}
                              className="p-3 text-red-400 hover:bg-red-50 rounded-2xl transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="bg-white border-t border-slate-100 p-6 shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-[#202042] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 active:scale-[0.98] transition-transform"
          >
            Fermer le relevé
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default UpdateVersementClient;
