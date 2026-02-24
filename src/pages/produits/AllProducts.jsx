import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  RefreshCcw,
  AlertCircle,
  Package,
} from "lucide-react";
import API from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import AddProduct from "./AddProduct";
import UpdateProduct from "./UpdateProduct";
import DeleteProduct from "./DeleteProduct";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modal, setModal] = useState({ isOpen: false, type: null, data: null });

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await API.get(API_PATHS.PRODUCTS.GET_ALL);
      if (res.data.success) setProducts(res.data.data);
    } catch (err) {
      console.error("Erreur produits:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const openModal = (type, data = null) =>
    setModal({ isOpen: true, type, data });
  const closeModal = () => setModal({ isOpen: false, type: null, data: null });

  return (
    <div className="space-y-6 animate-fadeIn p-2 sm:p-4 pb-20">
      {/* HEADER ADAPTATIF */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#202042] tracking-tight">
            Catalogue Références
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm font-medium italic">
            Gestion des articles et tarifs
          </p>
        </div>
        <button
          onClick={() => openModal("add")}
          className="bg-[#2ECC71] hover:bg-[#202042] text-white px-6 py-4 rounded-[22px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95 w-full md:w-auto"
        >
          <Plus size={18} /> Ajouter un produit
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="relative">
        <Search
          className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
          size={18}
        />
        <input
          type="text"
          placeholder="Rechercher une référence..."
          className="w-full pl-14 pr-6 py-4 bg-white rounded-[22px] text-sm font-bold outline-none shadow-sm focus:ring-4 focus:ring-emerald-50 transition-all border border-transparent focus:border-emerald-100"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ZONE DE CONTENU */}
      {isLoading ? (
        <div className="py-20 text-center">
          <RefreshCcw
            className="animate-spin mx-auto text-emerald-500"
            size={32}
          />
          <p className="mt-4 text-slate-400 font-bold text-xs uppercase">
            Synchronisation...
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-100">
          <p className="text-slate-400 font-bold">Aucune référence trouvée</p>
        </div>
      ) : (
        <>
          {/* --- VUE DESKTOP (Tableau caché sur mobile) --- */}
          <div className="hidden lg:block bg-white rounded-[40px] shadow-sm border border-white overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Article
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                    Catégorie
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                    Prix Vente (CRT)
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                    Alerte Stock
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((p) => (
                  <tr
                    key={p._id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm transition-transform group-hover:scale-110 ${p.category === "poisson" ? "bg-blue-50" : "bg-rose-50"}`}
                        >
                          {p.category === "poisson" ? "🐟" : "🥩"}
                        </div>
                        <div>
                          <p className="font-black text-[#202042] uppercase text-sm leading-tight">
                            {p.name}
                          </p>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                            Poids: {p.weightPerCarton}kg
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span
                        className={`text-[9px] font-black uppercase px-3 py-1 rounded-lg ${p.category === "poisson" ? "bg-blue-100 text-blue-600" : "bg-rose-100 text-rose-600"}`}
                      >
                        {p.category}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center font-black text-[#202042]">
                      <span className="text-emerald-500">
                        {p.sellingPrice?.toLocaleString()}
                      </span>
                      <span className="text-[10px] ml-1 text-slate-400 font-bold">
                        FCFA
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="inline-flex items-center gap-2 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black">
                        <AlertCircle size={12} /> {p.lowStockThreshold} CRT
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openModal("edit", p)}
                          className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => openModal("delete", p)}
                          className="p-2.5 bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* --- VUE MOBILE (Cartes affichées uniquement sur mobile/tablette) --- */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((p) => (
              <div
                key={p._id}
                className="bg-white p-5 rounded-[30px] shadow-sm border border-white active:scale-[0.98] transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm ${p.category === "poisson" ? "bg-blue-50" : "bg-rose-50"}`}
                    >
                      {p.category === "poisson" ? "🐟" : "🥩"}
                    </div>
                    <div>
                      <h3 className="font-black text-[#202042] text-sm uppercase leading-tight">
                        {p.name}
                      </h3>
                      <span className="text-[10px] font-bold text-slate-400">
                        {p.weightPerCarton}kg / Carton
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openModal("edit", p)}
                      className="p-2.5 bg-slate-50 text-slate-400 rounded-xl"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => openModal("delete", p)}
                      className="p-2.5 bg-slate-50 text-slate-400 rounded-xl"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-emerald-50/50 p-3 rounded-2xl">
                    <p className="text-[9px] font-black text-emerald-600 uppercase mb-1 tracking-widest">
                      Prix Vente
                    </p>
                    <p className="font-black text-[#202042] text-sm">
                      {p.sellingPrice?.toLocaleString()}{" "}
                      <span className="text-[10px]">F</span>
                    </p>
                  </div>
                  <div className="bg-amber-50/50 p-3 rounded-2xl">
                    <p className="text-[9px] font-black text-amber-600 uppercase mb-1 tracking-widest">
                      Alerte Stock
                    </p>
                    <p className="font-black text-[#202042] text-sm flex items-center gap-1">
                      {p.lowStockThreshold}{" "}
                      <span className="text-[10px]">CRT</span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                  <span
                    className={`text-[9px] font-black uppercase px-3 py-1 rounded-lg ${p.category === "poisson" ? "bg-blue-100 text-blue-600" : "bg-rose-100 text-rose-600"}`}
                  >
                    {p.category}
                  </span>
                  <div className="flex items-center gap-1 text-slate-300">
                    <Package size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">
                      Réf: {p._id.slice(-5)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* MODALS RENDERING */}
      {modal.isOpen && modal.type === "add" && (
        <AddProduct onClose={closeModal} refreshData={fetchProducts} />
      )}
      {modal.isOpen && modal.type === "edit" && (
        <UpdateProduct
          product={modal.data}
          onClose={closeModal}
          refreshData={fetchProducts}
        />
      )}
      {modal.isOpen && modal.type === "delete" && (
        <DeleteProduct
          product={modal.data}
          onClose={closeModal}
          refreshData={fetchProducts}
        />
      )}
    </div>
  );
};

export default AllProducts;
