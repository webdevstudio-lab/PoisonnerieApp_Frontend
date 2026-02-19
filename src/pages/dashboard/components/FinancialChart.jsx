import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { CalendarDays } from "lucide-react";

const FinancialChart = ({ chartData, selectedYear, onYearChange }) => {
  const years = [2024, 2025, 2026];

  return (
    <div className="bg-white p-8 rounded-[45px] shadow-sm border border-white">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <div>
          <h3 className="text-lg font-black text-[#202042]">
            Évolution Financière
          </h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            Ventes vs Dépenses
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
          <CalendarDays size={16} className="text-[#3498DB]" />
          <select
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
            className="bg-transparent text-sm font-black text-[#202042] outline-none cursor-pointer"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#F1F5F9"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: "bold" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: "bold" }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "20px",
                border: "none",
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: "20px" }}
            />
            <Area
              name="Ventes"
              type="monotone"
              dataKey="ventes"
              stroke="#10B981"
              strokeWidth={4}
              fillOpacity={0.1}
              fill="#10B981"
            />
            <Area
              name="Dépenses"
              type="monotone"
              dataKey="depenses"
              stroke="#F43F5E"
              strokeWidth={3}
              fill="transparent"
              strokeDasharray="5 5"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FinancialChart;
