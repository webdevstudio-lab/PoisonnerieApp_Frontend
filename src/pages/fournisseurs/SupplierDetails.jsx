import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useParams, useNavigate } from "react-router-dom";
import {
  Plus,
  Trash2,
  Edit2,
  Package,
  ArrowLeft,
  RefreshCcw,
  Tag,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  History,
  LayoutGrid,
} from "lucide-react";
import API from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";

// Imports des composants locaux
import UpdateFournisseurProduct from "./UpdateFournisseurProduct";
import DeleteFournisseurProduct from "./DeleteFournisseurProduct";
import AddAchat from "./AddAchat";
import AllSuplierAchat from "./achats/AllSuplierAchat";

const SupplierDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // États de navigation et données
  const [activeTab, setActiveTab] = useState("catalog"); // 'catalog' ou 'history'
  const [supplier, setSupplier] = useState(null);
  const [catalog, setCatalog] = useState([]);
  const [allGlobalProducts, setAllGlobalProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // États formulaires et Modals
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    productId: "",
    pricePurchase: "",
  });
  const [editModal, setEditModal] = useState({ isOpen: false, data: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, data: null });
  const [showAchatModal, setShowAchatModal] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [sRes, cRes, pRes] = await Promise.all([
        API.get(API_PATHS.SUPPLIER.GET_ONE.replace(":id", id)),
        API.get(
          API_PATHS.SUPPLIER.CATALOG.GET_ALL_PRODUCTS.replace(
            ":supplierId",
            id,
          ),
        ),
        API.get(API_PATHS.PRODUCTS.GET_ALL),
      ]);
      setSupplier(sRes.data.data);
      setCatalog(cRes.data.data);
      setAllGlobalProducts(pRes.data.data);
    } catch (err) {
      toast.error("Erreur de chargement des données");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const url = API_PATHS.SUPPLIER.CATALOG.ADD_PRODUCT.replace(
        ":supplierId",
        id,
      );
      await API.post(url, newEntry);
      toast.success("Produit lié au catalogue");
      setShowAddForm(false);
      setNewEntry({ productId: "", pricePurchase: "" });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur de liaison");
    }
  };

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <RefreshCcw className="animate-spin text-indigo-500" size={40} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Chargement du profil partenaire...
          </p>
        </div>
      </div>
    );

  return (
    <div className="space-y-6 p-4 animate-in fade-in duration-500">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <button
            onClick={() => navigate(-1)}
            className="p-4 bg-white rounded-[22px] shadow-sm hover:shadow-md transition-all border border-slate-100 group"
          >
            <ArrowLeft
              size={20}
              className="text-slate-400 group-hover:text-indigo-500"
            />
          </button>
          <div>
            <h1 className="text-3xl font-black text-[#202042] tracking-tight flex items-center gap-3">
              {supplier?.name}
              <span className="text-[10px] bg-indigo-50 text-indigo-500 px-3 py-1 rounded-full uppercase tracking-widest font-black">
                {supplier?.category}
              </span>
            </h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
              Contact:{" "}
              <span className="text-slate-600">
                {supplier?.contact || "Non renseigné"}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-white px-8 py-4 rounded-[28px] shadow-sm border border-slate-50 flex items-center gap-4">
            <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center font-bold">
              !
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                Solde dû au partenaire
              </p>
              <p className="text-xl font-black text-rose-500">
                {supplier?.balance?.toLocaleString() || "0"}{" "}
                <span className="text-xs">FCFA</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAchatModal(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-5 rounded-[25px] font-black text-[11px] uppercase tracking-[0.15em] flex items-center gap-3 transition-all shadow-lg shadow-emerald-100 active:scale-95"
          >
            <ShoppingCart size={18} /> Nouvel Arrivage
          </button>
        </div>
      </div>

      {/* --- TABS NAVIGATION --- */}
      <div className="flex gap-2 p-1.5 bg-slate-100/50 w-fit rounded-[24px] border border-slate-200/50">
        <button
          onClick={() => setActiveTab("catalog")}
          className={`flex items-center gap-2 px-8 py-3.5 rounded-[20px] font-black text-[10px] uppercase tracking-widest transition-all ${
            activeTab === "catalog"
              ? "bg-white text-indigo-500 shadow-sm ring-1 ring-slate-200"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <LayoutGrid size={14} /> Catalogue Produits
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex items-center gap-2 px-8 py-3.5 rounded-[20px] font-black text-[10px] uppercase tracking-widest transition-all ${
            activeTab === "history"
              ? "bg-white text-indigo-500 shadow-sm ring-1 ring-slate-200"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <History size={14} /> Historique Achats
        </button>
      </div>

      {/* --- TAB CONTENT: CATALOG --- */}
      {activeTab === "catalog" && (
        <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
          <div className="flex justify-between items-center bg-[#202042] p-2 pl-6 rounded-[28px] shadow-xl">
            <div className="flex items-center gap-3">
              <Tag className="text-indigo-400" size={18} />
              <h3 className="text-xs font-black text-white uppercase tracking-widest">
                Grille tarifaire personnalisée
              </h3>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className={`${showAddForm ? "bg-rose-500" : "bg-indigo-500"} text-white px-6 py-3.5 rounded-[22px] font-black text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all`}
            >
              <Plus size={16} className={showAddForm ? "rotate-45" : ""} />
              {showAddForm ? "Annuler" : "Lier une référence"}
            </button>
          </div>

          {showAddForm && (
            <form
              onSubmit={handleAddProduct}
              className="bg-white p-8 rounded-[35px] border-2 border-indigo-50 flex flex-wrap gap-6 items-end shadow-2xl"
            >
              <div className="flex-1 min-w-[300px] space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4">
                  Produit du stock global
                </label>
                <select
                  required
                  className="w-full p-5 bg-slate-50 rounded-[22px] font-bold outline-none border-2 border-transparent focus:border-indigo-100 appearance-none text-sm"
                  value={newEntry.productId}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, productId: e.target.value })
                  }
                >
                  <option value="">— Choisir l'article —</option>
                  {allGlobalProducts.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name.toUpperCase()} ({p.category})
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-64 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4">
                  Prix d'achat unitaire
                </label>
                <input
                  type="number"
                  required
                  className="w-full p-5 bg-slate-50 rounded-[22px] font-black text-indigo-600 outline-none border-2 border-transparent focus:border-indigo-100 text-sm"
                  placeholder="Ex: 15000"
                  value={newEntry.pricePurchase}
                  onChange={(e) =>
                    setNewEntry({ ...newEntry, pricePurchase: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                className="bg-[#202042] text-white h-[60px] px-10 rounded-[22px] font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-indigo-600 transition-all active:scale-95"
              >
                Enregistrer au catalogue
              </button>
            </form>
          )}

          <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Produit
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                    Calcul /KG
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                    Prix Achat
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                    Marge Est.
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {catalog.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-24 text-center">
                      <Package size={48} className="mx-auto opacity-20 mb-2" />
                      <p className="font-black uppercase text-xs tracking-widest opacity-20">
                        Catalogue vide
                      </p>
                    </td>
                  </tr>
                ) : (
                  catalog.map((item) => {
                    const weight = item.product?.weightPerCarton || 1;
                    const pricePerKg = (item.pricePurchase / weight).toFixed(0);
                    return (
                      <tr
                        key={item._id}
                        className="hover:bg-indigo-50/20 transition-colors group"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white border border-slate-100 text-slate-400 rounded-2xl flex items-center justify-center group-hover:text-indigo-500 shadow-sm transition-all">
                              <Package size={20} />
                            </div>
                            <div>
                              <p className="font-black text-[#202042] uppercase text-sm leading-none mb-1">
                                {item.product?.name}
                              </p>
                              <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">
                                {item.product?.category}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <div className="inline-flex flex-col items-center">
                            <span className="text-xs font-black text-slate-600 italic">
                              {Number(pricePerKg).toLocaleString()}{" "}
                              <span className="text-[8px] opacity-60">
                                F/KG
                              </span>
                            </span>
                            <span className="text-[9px] text-slate-300 font-bold mt-1 uppercase">
                              Poids: {weight}kg
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right font-black text-indigo-500 text-base">
                          {item.pricePurchase?.toLocaleString()}{" "}
                          <span className="text-[10px]">F</span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex flex-col items-end">
                            <span
                              className={`text-sm font-black flex items-center gap-1 ${item.potentialMargin > 0 ? "text-emerald-500" : "text-rose-500"}`}
                            >
                              {item.potentialMargin > 0 ? (
                                <TrendingUp size={14} />
                              ) : (
                                <TrendingDown size={14} />
                              )}
                              {item.potentialMargin?.toLocaleString()} F
                            </span>
                            <span className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">
                              vs Prix Vente
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() =>
                                setEditModal({ isOpen: true, data: item })
                              }
                              className="p-3 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-all"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() =>
                                setDeleteModal({ isOpen: true, data: item })
                              }
                              className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB CONTENT: HISTORY --- */}
      {activeTab === "history" && (
        <div className="animate-in slide-in-from-right-4 duration-300">
          <AllSuplierAchat supplierId={id} />
        </div>
      )}

      {/* --- PORTALS & MODALS --- */}
      {editModal.isOpen && (
        <UpdateFournisseurProduct
          supplierId={id}
          item={editModal.data}
          onClose={() => setEditModal({ isOpen: false, data: null })}
          refreshData={fetchData}
        />
      )}

      {deleteModal.isOpen && (
        <DeleteFournisseurProduct
          supplierId={id}
          item={deleteModal.data}
          onClose={() => setDeleteModal({ isOpen: false, data: null })}
          refreshData={fetchData}
        />
      )}

      {showAchatModal && (
        <AddAchat
          supplierId={id}
          catalog={catalog}
          onClose={() => {
            setShowAchatModal(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
};

export default SupplierDetail;
