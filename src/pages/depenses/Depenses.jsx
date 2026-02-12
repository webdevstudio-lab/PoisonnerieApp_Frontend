import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Tag,
  ChevronDown,
  ChevronUp,
  Settings2,
  Calendar,
} from "lucide-react";
import API from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

import Charts from "./Charts";
import AddDepense from "./AddDepense";
import UpdateDepense from "./UpdateDepense";
import DeleteDepense from "./DeleteDepense";
import AllCategories from "./categories/AllCategories";

const Depenses = () => {
  const [activeTab, setActiveTab] = useState("Mois");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [depenses, setDepenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showManageCat, setShowManageCat] = useState(false);
  const [modalConfig, setModalConfig] = useState({ type: null, data: null });
  const [searchQuery, setSearchQuery] = useState("");
  const [openCategory, setOpenCategory] = useState(null);

  const tabs = ["Jour", "Semaine", "Mois", "Année"];

  const fetchData = async () => {
    try {
      setLoading(true);
      const url = `${API_PATHS.DEPENSES.GET_ALL}?filter=${activeTab}&date=${selectedDate}`;
      const [depRes, catRes] = await Promise.all([
        API.get(url),
        API.get(API_PATHS.CATEGORIES_DEPENSES.GET_ALL),
      ]);
      setDepenses(depRes.data?.data || []);
      setCategories(catRes.data?.data || []);
    } catch (error) {
      console.error("Erreur API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, selectedDate]);

  // Navigation Temporelle
  const handleNavigate = (direction) => {
    const date = new Date(selectedDate);
    const step = direction === "next" ? 1 : -1;

    if (activeTab === "Jour") date.setDate(date.getDate() + step);
    if (activeTab === "Semaine") date.setDate(date.getDate() + step * 7);
    if (activeTab === "Mois") date.setMonth(date.getMonth() + step);
    if (activeTab === "Année") date.setFullYear(date.getFullYear() + step);

    setSelectedDate(date.toISOString().split("T")[0]);
  };

  const periodLabel = useMemo(() => {
    const d = new Date(selectedDate);
    if (activeTab === "Jour")
      return d.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    if (activeTab === "Mois")
      return d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
    if (activeTab === "Année") return d.getFullYear();
    if (activeTab === "Semaine") {
      const first = new Date(
        d.setDate(d.getDate() - d.getDay() + (d.getDay() === 0 ? -6 : 1)),
      );
      const last = new Date(new Date(first).setDate(first.getDate() + 6));
      return `Du ${first.getDate()} au ${last.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}`;
    }
    return "";
  }, [selectedDate, activeTab]);

  const filteredDepenses = useMemo(() => {
    return depenses.filter(
      (d) =>
        d.label?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.category?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [depenses, searchQuery]);

  const groupedDepenses = useMemo(() => {
    return filteredDepenses.reduce((acc, curr) => {
      const catName = curr.category?.name || "NON CLASSÉ";
      if (!acc[catName]) acc[catName] = { items: [], total: 0 };
      acc[catName].items.push(curr);
      acc[catName].total += curr.amount;
      return acc;
    }, {});
  }, [filteredDepenses]);

  return (
    <div className="space-y-6 p-4 bg-[#f8f9fa] min-h-screen">
      {/* 1. HEADER & DATE SELECTOR */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-white p-3 rounded-[30px] shadow-sm">
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-2xl">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all ${
                activeTab === tab
                  ? "bg-[#202042] text-white shadow-lg"
                  : "text-slate-400 hover:bg-slate-100 uppercase"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => handleNavigate("prev")}
            className="p-2 hover:bg-slate-50 rounded-full transition-colors"
          >
            <ChevronLeft size={20} className="text-slate-400" />
          </button>

          <div className="relative flex flex-col items-center min-w-[150px]">
            <span className="text-[12px] font-black text-[#202042] uppercase italic">
              {periodLabel}
            </span>
            <input
              type={activeTab === "Mois" ? "month" : "date"}
              value={
                activeTab === "Mois"
                  ? selectedDate.substring(0, 7)
                  : selectedDate
              }
              onChange={(e) =>
                setSelectedDate(
                  activeTab === "Mois"
                    ? `${e.target.value}-01`
                    : e.target.value,
                )
              }
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <span className="text-[8px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1">
              <Calendar size={10} /> changer
            </span>
          </div>

          <button
            onClick={() => handleNavigate("next")}
            className="p-2 hover:bg-slate-50 rounded-full transition-colors"
          >
            <ChevronRight size={20} className="text-slate-400" />
          </button>
        </div>
      </div>

      {/* 2. KPI CARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-7 rounded-[35px] shadow-sm flex items-center justify-between border-b-4 border-cyan-400">
          <span className="text-slate-400 font-black text-[11px] uppercase tracking-widest">
            Total {activeTab}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-[#202042]">
              {depenses.reduce((a, b) => a + b.amount, 0).toLocaleString()}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Xof
            </span>
          </div>
        </div>
      </div>

      {/* 3. CHART & ACTIONS */}
      <div className="bg-white p-8 rounded-[45px] shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#61b4f7] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase flex items-center gap-3 shadow-xl shadow-blue-100 hover:bg-[#202042] transition-all"
            >
              <Plus size={18} /> Nouvelle dépense
            </button>
            <button
              onClick={() => setShowManageCat(true)}
              className="bg-white text-slate-500 border-2 border-slate-100 px-6 py-4 rounded-2xl font-black text-[10px] uppercase flex items-center gap-3 hover:border-blue-200"
            >
              <Settings2 size={18} /> Catégories
            </button>
          </div>
        </div>

        <div className="h-[350px] w-full">
          {loading ? (
            <div className="h-full w-full animate-pulse bg-slate-50 rounded-3xl" />
          ) : (
            <Charts
              data={depenses}
              period={activeTab}
              key={`${activeTab}-${selectedDate}`}
            />
          )}
        </div>
      </div>

      {/* 4. LISTING */}
      <div className="bg-white rounded-[45px] shadow-sm overflow-hidden border border-slate-50">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <h3 className="text-[12px] font-black text-[#202042] uppercase tracking-widest">
            Opérations détaillées
          </h3>
          <div className="relative w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
              size={14}
            />
            <input
              type="text"
              placeholder="RECHERCHER..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-[10px] font-black outline-none focus:border-blue-400 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="p-6 space-y-3">
          {Object.keys(groupedDepenses).map((category) => (
            <div
              key={category}
              className="border border-slate-50 rounded-[30px] overflow-hidden bg-white shadow-sm"
            >
              <div
                onClick={() =>
                  setOpenCategory(openCategory === category ? null : category)
                }
                className={`flex items-center justify-between px-8 py-5 cursor-pointer transition-all ${openCategory === category ? "bg-[#202042] text-white" : "hover:bg-slate-50"}`}
              >
                <div className="flex items-center gap-4">
                  <Tag
                    size={18}
                    className={
                      openCategory === category
                        ? "text-cyan-400"
                        : "text-blue-500"
                    }
                  />
                  <div>
                    <span className="font-black text-[12px] uppercase">
                      {category}
                    </span>
                    <p
                      className={`text-[9px] font-bold ${openCategory === category ? "text-slate-400" : "text-slate-300"}`}
                    >
                      {groupedDepenses[category].items.length} OPÉRATIONS
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span
                    className={`text-[14px] font-black ${openCategory === category ? "text-cyan-400" : "text-rose-500"}`}
                  >
                    -{groupedDepenses[category].total.toLocaleString()} XOF
                  </span>
                  {openCategory === category ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </div>
              </div>

              {openCategory === category && (
                <div className="p-4 bg-white animate-in slide-in-from-top duration-300">
                  <table className="w-full">
                    <tbody className="divide-y divide-slate-50">
                      {groupedDepenses[category].items.map((item) => (
                        <tr key={item._id} className="hover:bg-slate-50/50">
                          <td className="py-4 px-4 font-black text-[11px] text-[#202042] uppercase">
                            {item.label}
                          </td>
                          <td className="py-4 px-4 text-center text-[10px] font-bold text-slate-400">
                            {new Date(item.date).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4 text-right font-black text-[#202042] text-[11px]">
                            {item.amount.toLocaleString()} XOF
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() =>
                                  setModalConfig({ type: "edit", data: item })
                                }
                                className="p-2 text-amber-500 hover:bg-amber-50 rounded-xl transition-all"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                onClick={() =>
                                  setModalConfig({ type: "delete", data: item })
                                }
                                className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* MODALS RENDERING */}
      {showAddModal && (
        <AddDepense
          categories={categories}
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchData}
        />
      )}
      {showManageCat && (
        <AllCategories
          onClose={() => {
            setShowManageCat(false);
            fetchData();
          }}
        />
      )}
      {modalConfig.type === "edit" && (
        <UpdateDepense
          data={modalConfig.data}
          categories={categories}
          onClose={() => setModalConfig({ type: null, data: null })}
          onSuccess={fetchData}
        />
      )}
      {modalConfig.type === "delete" && (
        <DeleteDepense
          data={modalConfig.data}
          onClose={() => setModalConfig({ type: null, data: null })}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
};

export default Depenses;
