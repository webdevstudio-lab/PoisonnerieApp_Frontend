import React, { useState, useMemo, useEffect } from "react";
import {
  FolderPlus,
  FilePlus,
  Search,
  Grid,
  List,
  Folder,
  FileText,
  ChevronRight,
  HardDrive,
  Loader2,
  Edit3,
  Trash2,
  Download,
  MoreVertical,
  Calendar,
  HardDriveDownload,
} from "lucide-react";
import { toast } from "react-hot-toast";
import API from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

import AddFile from "./AddFile";
import DeleteFile from "./DeleteFile";
import InputModal from "./InputModal";

const Archives = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' ou 'list'
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [currentPath, setCurrentPath] = useState([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({ type: null, data: null });

  const fetchItems = async (folderId = null) => {
    setLoading(true);
    try {
      const response = await API.get(API_PATHS.ARCHIVES.GET_ITEMS, {
        params: { parentId: folderId || "" },
      });
      const data = response.data.data || [];
      setItems(data);
    } catch (error) {
      toast.error("Erreur de chargement");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(currentFolderId);
  }, [currentFolderId]);

  const filteredItems = useMemo(() => {
    let result = items;
    if (filterType !== "all") {
      result = result.filter((item) => item.type === filterType);
    }
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          (item.extension && item.extension.toLowerCase().includes(query)),
      );
    }
    return result;
  }, [items, searchQuery, filterType]);

  const handleFolderClick = (folder) => {
    setCurrentPath([...currentPath, { id: folder._id, name: folder.name }]);
    setCurrentFolderId(folder._id);
  };

  const navigateToBreadcrumb = (index) => {
    if (index === -1) {
      setCurrentPath([]);
      setCurrentFolderId(null);
    } else {
      const newPath = currentPath.slice(0, index + 1);
      setCurrentPath(newPath);
      setCurrentFolderId(newPath[newPath.length - 1].id);
    }
  };

  const handleDownload = (item) => {
    const url = `${API.defaults.baseURL}${API_PATHS.ARCHIVES.DOWNLOAD.replace(":id", item._id)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-6 p-4 animate-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-white rounded-[22px] shadow-sm border border-white text-[#202042]">
            <HardDrive size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#202042] tracking-tight">
              ARCHIVES
            </h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest italic tracking-tighter">
              Explorateur sécurisé
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setModalConfig({ type: "createFolder" })}
            className="bg-white hover:bg-slate-50 text-[#202042] px-6 py-4 rounded-[22px] font-black text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all shadow-sm border border-white"
          >
            <FolderPlus size={18} /> Nouveau Dossier
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#202042] hover:bg-[#2d2d5a] text-white px-6 py-4 rounded-[22px] font-black text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all shadow-lg active:scale-95"
          >
            <FilePlus size={18} /> Importer
          </button>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="bg-white/70 backdrop-blur-md p-4 rounded-[35px] shadow-sm border border-white flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[11px] font-black text-[#202042] uppercase tracking-widest overflow-hidden">
            <span
              onClick={() => navigateToBreadcrumb(-1)}
              className="hover:text-blue-500 cursor-pointer shrink-0"
            >
              RACINE
            </span>
            {currentPath.map((p, i) => (
              <React.Fragment key={p.id}>
                <ChevronRight size={14} className="text-slate-300 shrink-0" />
                <span
                  onClick={() => navigateToBreadcrumb(i)}
                  className="hover:text-blue-500 cursor-pointer shrink-0 truncate max-w-[120px]"
                >
                  {p.name}
                </span>
              </React.Fragment>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* SÉLECTEUR DE VUE */}
            <div className="flex bg-slate-100 p-1 rounded-2xl mr-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-xl transition-all ${viewMode === "grid" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"}`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-xl transition-all ${viewMode === "list" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"}`}
              >
                <List size={18} />
              </button>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-2xl">
              {["all", "folder", "file"].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${filterType === t ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"}`}
                >
                  {t === "all"
                    ? "Tous"
                    : t === "folder"
                      ? "Dossiers"
                      : "Fichiers"}
                </button>
              ))}
            </div>

            <div className="relative flex-1 min-w-[200px]">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="RECHERCHER..."
                className="w-full pl-12 pr-4 py-3 bg-slate-100 rounded-2xl outline-none text-[10px] font-black border-2 border-transparent focus:border-blue-200 transition-all uppercase"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="bg-white rounded-[45px] shadow-sm border border-white min-h-[550px] overflow-hidden">
        {loading ? (
          <div className="h-[550px] flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-blue-500" size={40} />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="h-[550px] flex flex-col items-center justify-center text-slate-300 font-black uppercase text-[11px]">
            Dossier vide
          </div>
        ) : viewMode === "grid" ? (
          /* VUE GRILLE */
          <div className="p-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                onClick={() =>
                  item.type === "folder" && handleFolderClick(item)
                }
                className="group relative bg-slate-50/40 p-6 rounded-[40px] border-2 border-transparent hover:border-blue-100 hover:bg-white hover:shadow-2xl transition-all cursor-pointer text-center"
              >
                <div
                  className={`w-16 h-16 mx-auto rounded-[25px] flex items-center justify-center mb-3 ${item.type === "folder" ? "bg-blue-50 text-blue-500" : "bg-slate-100 text-slate-400"}`}
                >
                  {item.type === "folder" ? (
                    <Folder size={32} fill="currentColor" fillOpacity={0.2} />
                  ) : (
                    <FileText size={32} />
                  )}
                </div>
                <h4 className="font-black text-[#202042] text-[10px] uppercase truncate">
                  {item.name}
                </h4>

                <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalConfig({ type: "rename", data: item });
                    }}
                    className="p-2 bg-white rounded-lg text-amber-500 shadow-sm border border-slate-100"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalConfig({ type: "delete", data: item });
                    }}
                    className="p-2 bg-white rounded-lg text-rose-500 shadow-sm border border-slate-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* VUE LISTE (TABLEAU) */
          <div className="overflow-x-auto p-6">
            <table className="w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">
                  <th className="px-6 py-4">Nom</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Taille</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr
                    key={item._id}
                    onClick={() =>
                      item.type === "folder" && handleFolderClick(item)
                    }
                    className="group bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all cursor-pointer rounded-2xl"
                  >
                    <td className="px-6 py-4 rounded-l-[25px]">
                      <div className="flex items-center gap-4">
                        {item.type === "folder" ? (
                          <Folder size={20} className="text-blue-500" />
                        ) : (
                          <FileText size={20} className="text-slate-400" />
                        )}
                        <span className="font-black text-[#202042] text-[11px] uppercase truncate max-w-[300px]">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">
                      {item.extension || "Dossier"}
                    </td>
                    <td className="px-6 py-4 text-[10px] font-bold text-slate-400">
                      {item.size ? `${(item.size / 1024).toFixed(1)} KB` : "--"}
                    </td>
                    <td className="px-6 py-4 text-[10px] font-bold text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 rounded-r-[25px] text-right">
                      <div className="flex justify-end gap-2">
                        {item.type === "file" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(item);
                            }}
                            className="p-2 hover:bg-blue-50 rounded-lg text-blue-500 transition-colors"
                          >
                            <Download size={16} />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setModalConfig({ type: "rename", data: item });
                          }}
                          className="p-2 hover:bg-amber-50 rounded-lg text-amber-500 transition-colors"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setModalConfig({ type: "delete", data: item });
                          }}
                          className="p-2 hover:bg-rose-50 rounded-lg text-rose-500 transition-colors"
                        >
                          <Trash2 size={16} />
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

      {/* MODALES */}
      {showAddModal && (
        <AddFile
          parentId={currentFolderId}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => fetchItems(currentFolderId)}
        />
      )}
      {modalConfig.type === "delete" && (
        <DeleteFile
          file={modalConfig.data}
          onClose={() => setModalConfig({ type: null, data: null })}
          onSuccess={() => fetchItems(currentFolderId)}
        />
      )}
      {(modalConfig.type === "createFolder" ||
        modalConfig.type === "rename") && (
        <InputModal
          type={modalConfig.type}
          data={modalConfig.data}
          parentId={currentFolderId}
          onClose={() => setModalConfig({ type: null, data: null })}
          onSuccess={() => fetchItems(currentFolderId)}
        />
      )}
    </div>
  );
};

export default Archives;
