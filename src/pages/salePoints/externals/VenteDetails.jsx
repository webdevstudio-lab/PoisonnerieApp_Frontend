import React, { useState, useEffect } from "react";
import { Eye, ChevronUp, Package, Pencil, Trash2 } from "lucide-react";
import API from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import { toast } from "react-hot-toast";
import EditSaleModal from "./EditSaleModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal"; // Import du nouveau composant

const VenteDetails = ({ salePointId }) => {
  const [ventes, setVentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);

  // États pour la modification
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  // États pour la suppression (Modal Portal)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState(null);

  const fetchVentes = async () => {
    try {
      setLoading(true);
      const res = await API.get(
        API_PATHS.VENTE_JOUR.GET_BY_POINT.replace(":salePointId", salePointId),
      );
      setVentes(res.data.data);
    } catch (err) {
      console.error("Erreur fetch ventes:", err);
      toast.error("Impossible de récupérer les ventes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (salePointId) fetchVentes();
  }, [salePointId]);

  // Déclencheur de la modal de suppression
  const openDeleteModal = (venteId) => {
    setSaleToDelete(venteId);
    setIsDeleteModalOpen(true);
  };

  // Logique de confirmation de suppression
  const handleConfirmDelete = async () => {
    if (!saleToDelete) return;

    setDeleteLoading(true);
    try {
      await API.delete(`${API_PATHS.VENTE_JOUR.ADD}/${saleToDelete}`);
      toast.success("Vente supprimée avec succès");
      setIsDeleteModalOpen(false);
      fetchVentes();
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeleteLoading(false);
      setSaleToDelete(null);
    }
  };

  const openEditModal = (vente) => {
    setSelectedSale(vente);
    setIsEditModalOpen(true);
  };

  if (loading)
    return (
      <div className="p-20 text-center animate-pulse text-slate-400 text-xs font-bold uppercase tracking-widest">
        Chargement des transactions...
      </div>
    );

  return (
    <div className="bg-white rounded-[35px] shadow-sm border border-slate-50 overflow-hidden">
      {/* Header de la table */}
      <div className="p-8 border-b border-slate-50 flex justify-between items-center">
        <h3 className="text-lg font-black text-[#202042]">
          Historique des ventes
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="p-6 text-[10px] font-black uppercase text-slate-400">
                Date/Vendeur
              </th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400">
                Articles
              </th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400">
                Total
              </th>
              <th className="p-6 text-[10px] font-black uppercase text-slate-400 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {ventes.map((v) => (
              <React.Fragment key={v._id}>
                <tr
                  className={`transition-all ${expandedRow === v._id ? "bg-blue-50/30" : "hover:bg-slate-50/50"}`}
                >
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-[#202042] text-sm">
                        {new Date(v.date).toLocaleDateString("fr-FR")}
                      </span>
                      <span className="text-[10px] text-blue-500 font-bold uppercase">
                        {v.vendeur?.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-6 font-bold text-sm text-slate-600">
                    {v.inventorySold?.reduce(
                      (acc, curr) => acc + curr.cartonsSold,
                      0,
                    )}{" "}
                    CTN
                  </td>
                  <td className="p-6">
                    <span className="px-3 py-1.5 bg-[#202042] text-white rounded-lg font-black text-xs">
                      {v.totalAmount.toLocaleString()} FCFA
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          setExpandedRow(expandedRow === v._id ? null : v._id)
                        }
                        className="p-2 bg-slate-100 text-slate-400 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
                      >
                        {expandedRow === v._id ? (
                          <ChevronUp size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                      <button
                        onClick={() => openEditModal(v)}
                        className="p-2 bg-amber-50 text-amber-500 rounded-lg hover:bg-amber-500 hover:text-white transition-colors"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(v._id)}
                        className="p-2 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedRow === v._id && (
                  <tr>
                    <td colSpan="4" className="p-4 bg-slate-50/50">
                      <div className="grid grid-cols-2 gap-2">
                        {v.inventorySold.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-100"
                          >
                            <Package size={12} className="text-blue-500" />
                            <span className="text-xs font-bold">
                              {item.product?.name}: {item.cartonsSold}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- SECTION MODALES (PORTALS) --- */}

      {/* Modal de modification */}
      {isEditModalOpen && (
        <EditSaleModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          saleData={selectedSale}
          salePointId={salePointId}
          refreshData={fetchVentes}
        />
      )}

      {/* Modal de suppression confirmée */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        title="Supprimer la vente"
        message="Êtes-vous sûr de vouloir supprimer cette vente ? Le stock du point de vente sera automatiquement réajusté."
      />
    </div>
  );
};

export default VenteDetails;
