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
  Calendar,
  CreditCard,
} from "lucide-react";
import API from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import { toast } from "react-hot-toast";

const UpdateVersementClient = ({ isOpen, onClose, client, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [versements, setVersements] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      toast.error("Impossible de charger l'historique");
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    if (isOpen) fetchVersements();
  }, [isOpen, fetchVersements]);

  const startEditing = (v) => {
    setEditingId(v._id);
    setEditData({
      paymentMethod: v.paymentMethod,
      paymentDate: v.paymentDate ? v.paymentDate.split("T")[0] : "",
      amount: v.amount,
      notes: v.notes || "",
    });
  };

  const handleUpdate = async (id) => {
    if (!editData.amount || editData.amount <= 0) {
      return toast.error("Le montant doit être supérieur à 0");
    }
    try {
      setIsSubmitting(true);
      const res = await API.put(
        API_PATHS.VERSEMENTS_CLIENTS.UPDATE.replace(":id", id),
        {
          ...editData,
          amount: Number(editData.amount),
        },
      );
      if (res.data.success) {
        toast.success("Mise à jour réussie");
        setEditingId(null);
        fetchVersements();
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur de mise à jour");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Annuler ce versement ?")) return;
    try {
      setIsSubmitting(true);
      const res = await API.delete(
        API_PATHS.VERSEMENTS_CLIENTS.DELETE.replace(":id", id),
      );
      if (res.data.success) {
        toast.success("Versement supprimé");
        fetchVersements();
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Erreur lors de la suppression",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintReceipt = (v) => {
    const receiptWindow = window.open("", "_blank", "width=600,height=600");
    receiptWindow.document.write(`
      <html>
        <head><title>Reçu #${v._id}</title></head>
        <body style="font-family: sans-serif; padding: 40px; line-height: 1.6;">
          <div style="border: 2px solid #EEE; padding: 20px; border-radius: 10px;">
            <h2 style="text-align: center; color: #202042;">REÇU DE PAIEMENT</h2>
            <hr/>
            <p><b>Client :</b> ${client.name}</p>
            <p><b>Date :</b> ${new Date(v.paymentDate).toLocaleDateString()}</p>
            <p><b>Mode :</b> ${v.paymentMethod}</p>
            <p style="font-size: 20px;"><b>Montant :</b> ${v.amount?.toLocaleString()} FCFA</p>
            <p><b>Note :</b> ${v.notes || "-"}</p>
          </div>
          <script>window.print(); setTimeout(() => window.close(), 500);</script>
        </body>
      </html>
    `);
    receiptWindow.document.close();
  };

  if (!isOpen || !client) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-[#202042]/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative bg-[#f8fafc] w-full max-w-5xl h-[90vh] sm:h-[85vh] rounded-t-[40px] sm:rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="bg-[#202042] p-6 sm:p-8 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <History size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black">Gestion des Versements</h2>
              <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest">
                {client.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 pb-32 sm:pb-8">
          {/* Dashboard rapide */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-emerald-50 p-5 rounded-[2rem] border border-emerald-100">
              <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">
                Total Payé
              </p>
              <p className="text-xl sm:text-2xl font-black text-emerald-700">
                {versements
                  .reduce((acc, v) => acc + v.amount, 0)
                  .toLocaleString()}{" "}
                F
              </p>
            </div>
            <div className="bg-amber-50 p-5 rounded-[2rem] border border-amber-100">
              <p className="text-[10px] font-black text-amber-600 uppercase mb-1">
                Dette Actuelle
              </p>
              <p className="text-xl sm:text-2xl font-black text-amber-700">
                {client.currentDebt?.toLocaleString()} F
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-4">
              <Loader2 className="animate-spin text-indigo-500" size={40} />
              <p className="font-bold text-sm">
                Chargement des transactions...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {versements.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200 text-slate-400 font-bold">
                  Aucun versement enregistré.
                </div>
              ) : (
                <>
                  {/* --- VUE DESKTOP (Tableau caché sur mobile) --- */}
                  <div className="hidden md:block bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50 border-b border-slate-100">
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                          <th className="p-6">Date</th>
                          <th className="p-6">Mode</th>
                          <th className="p-6">Montant</th>
                          <th className="p-6">Notes</th>
                          <th className="p-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {versements.map((v) => (
                          <tr
                            key={v._id}
                            className="hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="p-6">
                              {editingId === v._id ? (
                                <input
                                  type="date"
                                  className="bg-slate-100 p-2 rounded-lg text-xs font-bold border-indigo-200 border"
                                  value={editData.paymentDate}
                                  onChange={(e) =>
                                    setEditData({
                                      ...editData,
                                      paymentDate: e.target.value,
                                    })
                                  }
                                />
                              ) : (
                                <span className="text-sm font-bold text-slate-600">
                                  {new Date(v.paymentDate).toLocaleDateString()}
                                </span>
                              )}
                            </td>
                            <td className="p-6">
                              {editingId === v._id ? (
                                <select
                                  className="bg-slate-100 p-2 rounded-lg text-xs font-bold border-indigo-200 border outline-none"
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
                                  <option value="ORANGE MONEY">
                                    ORANGE MONEY
                                  </option>
                                  <option value="MOOV MONEY">MOOV MONEY</option>
                                </select>
                              ) : (
                                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black">
                                  {v.paymentMethod}
                                </span>
                              )}
                            </td>
                            <td className="p-6">
                              {editingId === v._id ? (
                                <input
                                  type="number"
                                  className="bg-indigo-50 p-2 rounded-lg text-xs font-black text-indigo-700 w-32 border-indigo-200 border"
                                  value={editData.amount}
                                  onChange={(e) =>
                                    setEditData({
                                      ...editData,
                                      amount: e.target.value,
                                    })
                                  }
                                />
                              ) : (
                                <span className="font-black text-emerald-600">
                                  {v.amount?.toLocaleString()} F
                                </span>
                              )}
                            </td>
                            <td className="p-6">
                              <span className="text-xs text-slate-400 italic">
                                {v.notes || "-"}
                              </span>
                            </td>
                            <td className="p-6 text-right">
                              <ActionButtons
                                v={v}
                                editingId={editingId}
                                isSubmitting={isSubmitting}
                                handleUpdate={handleUpdate}
                                setEditingId={setEditingId}
                                handlePrintReceipt={handlePrintReceipt}
                                startEditing={startEditing}
                                handleDelete={handleDelete}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* --- VUE MOBILE (Cartes visibles uniquement sur mobile) --- */}
                  <div className="md:hidden space-y-4">
                    {versements.map((v) => (
                      <div
                        key={v._id}
                        className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden"
                      >
                        {editingId === v._id ? (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="date"
                                className="bg-slate-50 p-3 rounded-xl text-xs font-bold border-indigo-100 border"
                                value={editData.paymentDate}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    paymentDate: e.target.value,
                                  })
                                }
                              />
                              <select
                                className="bg-slate-50 p-3 rounded-xl text-xs font-bold border-indigo-100 border"
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
                                <option value="ORANGE MONEY">
                                  ORANGE MONEY
                                </option>
                              </select>
                            </div>
                            <input
                              type="number"
                              className="w-full bg-indigo-50 p-3 rounded-xl text-sm font-black text-indigo-700 border-indigo-100 border"
                              value={editData.amount}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  amount: e.target.value,
                                })
                              }
                            />
                            <div className="flex gap-2 pt-2">
                              <button
                                onClick={() => handleUpdate(v._id)}
                                disabled={isSubmitting}
                                className="flex-1 bg-emerald-500 text-white p-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 uppercase"
                              >
                                {isSubmitting ? (
                                  <Loader2 className="animate-spin" size={16} />
                                ) : (
                                  <Check size={16} />
                                )}{" "}
                                Confirmer
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="bg-slate-100 text-slate-500 px-4 rounded-xl"
                              >
                                <RotateCcw size={16} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex gap-3">
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
                                  <CreditCard size={20} />
                                </div>
                                <div>
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                                    {new Date(
                                      v.paymentDate,
                                    ).toLocaleDateString()}
                                  </p>
                                  <p className="text-xs font-black text-indigo-600">
                                    {v.paymentMethod}
                                  </p>
                                </div>
                              </div>
                              <p className="text-lg font-black text-emerald-600">
                                {v.amount?.toLocaleString()} F
                              </p>
                            </div>

                            {v.notes && (
                              <p className="text-[11px] text-slate-400 italic bg-slate-50 p-2 rounded-lg mb-4">
                                "{v.notes}"
                              </p>
                            )}

                            <div className="flex justify-between items-center border-t border-slate-50 pt-4">
                              <button
                                onClick={() => handlePrintReceipt(v)}
                                className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-tighter"
                              >
                                <Printer size={16} /> Reçu
                              </button>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => startEditing(v)}
                                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                                >
                                  <Edit2 size={18} />
                                </button>
                                <button
                                  onClick={() => handleDelete(v._id)}
                                  className="p-2 text-red-400 hover:bg-red-50 rounded-lg"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer Mobile Only */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100 sm:hidden">
          <button
            onClick={onClose}
            className="w-full bg-[#202042] text-white py-4 rounded-[20px] font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-900/20"
          >
            Fermer le relevé
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

// Composant interne pour les actions Desktop
const ActionButtons = ({
  v,
  editingId,
  isSubmitting,
  handleUpdate,
  setEditingId,
  handlePrintReceipt,
  startEditing,
  handleDelete,
}) => {
  if (editingId === v._id) {
    return (
      <div className="flex justify-end gap-2">
        <button
          disabled={isSubmitting}
          onClick={() => handleUpdate(v._id)}
          className="p-2 bg-emerald-500 text-white rounded-xl"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <Check size={16} />
          )}
        </button>
        <button
          onClick={() => setEditingId(null)}
          className="p-2 bg-slate-200 text-slate-600 rounded-xl"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    );
  }
  return (
    <div className="flex justify-end gap-2">
      <button
        onClick={() => handlePrintReceipt(v)}
        className="p-2 text-slate-400 hover:text-indigo-600"
      >
        <Printer size={18} />
      </button>
      <button
        onClick={() => startEditing(v)}
        className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl"
      >
        <Edit2 size={18} />
      </button>
      <button
        onClick={() => handleDelete(v._id)}
        className="p-2 text-red-400 hover:bg-red-50 rounded-xl"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default UpdateVersementClient;
