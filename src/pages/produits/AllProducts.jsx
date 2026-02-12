import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  RefreshCcw,
  AlertCircle,
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
    <div className="space-y-6 animate-fadeIn p-4">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#202042] tracking-tight">
            Catalogue Références
          </h1>
          <p className="text-slate-400 text-sm font-medium italic">
            Gestion des articles et tarifs
          </p>
        </div>
        <button
          onClick={() => openModal("add")}
          className="bg-[#2ECC71] hover:bg-[#202042] text-white px-6 py-4 rounded-[22px] font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all shadow-lg active:scale-95"
        >
          <Plus size={18} /> Ajouter un produit
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative">
        <Search
          className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
          size={18}
        />
        <input
          type="text"
          placeholder="Rechercher une référence..."
          className="w-full pl-14 pr-6 py-4 bg-white rounded-[22px] text-sm font-bold outline-none shadow-sm focus:ring-4 focus:ring-emerald-50 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[40px] shadow-sm border border-white overflow-hidden">
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
            {isLoading ? (
              <tr>
                <td colSpan="5" className="py-20 text-center">
                  <RefreshCcw className="animate-spin mx-auto text-emerald-500" />
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr
                  key={p._id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm ${p.category === "poisson" ? "bg-blue-50" : "bg-rose-50"}`}
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
                        className="p-2 text-slate-300 hover:text-blue-500 transition-colors"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => openModal("delete", p)}
                        className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
