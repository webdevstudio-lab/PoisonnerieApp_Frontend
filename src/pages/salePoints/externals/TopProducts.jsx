import React from "react";
import { PackageSearch } from "lucide-react";

const TopProducts = ({ products = [] }) => {
  return (
    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-50">
      <div className="flex items-center gap-3 mb-6 text-[#202042]">
        <PackageSearch size={22} />
        <h3 className="font-black uppercase text-xs tracking-widest">
          État du Stock Réserve
        </h3>
      </div>

      <div className="space-y-6">
        {products.length > 0 ? (
          products.map((item, idx) => (
            <div
              key={item._id}
              className="flex items-center justify-between border-b border-slate-50 pb-4 last:border-0"
            >
              <div className="flex items-center gap-4">
                <span className="text-slate-200 font-black text-xl italic">
                  {(idx + 1).toString().padStart(2, "0")}
                </span>
                <div>
                  <p className="font-black text-[#202042] text-sm uppercase">
                    {item.product?.name}
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">
                    Cat: {item.product?.category}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`font-black text-sm ${item.quantityCartons < 5 ? "text-rose-500" : "text-[#3498DB]"}`}
                >
                  {item.quantityCartons}{" "}
                  <span className="text-[10px] opacity-50">Ctn</span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-slate-400 text-xs font-bold">
            Aucun produit en stock
          </div>
        )}
      </div>
    </div>
  );
};

export default TopProducts;
