import React, { useState, useEffect } from "react";
import { TrendingDown, Calendar } from "lucide-react";
import API from "../../utils/axiosInstance";

const RetraitList = () => {
  const [retraits, setRetraits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRetraits = async () => {
      try {
        const res = await API.get("/caisse-generale/history?type=SORTIE");
        if (res.data.success) setRetraits(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRetraits();
  }, []);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="p-8 border-b border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center">
            <TrendingDown size={20} />
          </div>
          <h3 className="text-sm font-black text-[#202042] uppercase tracking-wider">
            Retraits & Dépenses
          </h3>
        </div>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50/50">
            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Date
            </th>
            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Motif
            </th>
            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
              Montant
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {retraits.map((item, idx) => (
            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-8 py-5 text-sm font-bold text-slate-500">
                {new Date(item.dateOperation).toLocaleDateString()}
              </td>
              <td className="px-8 py-5 text-sm text-[#202042] font-medium">
                {item.description}
              </td>
              <td className="px-8 py-5 text-sm font-black text-right text-rose-500">
                -{item.montant.toLocaleString()} F
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RetraitList;
