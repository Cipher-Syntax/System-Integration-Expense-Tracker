import React from "react";
import { Circle } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const CategoryChart = ({ data }) => (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-bold text-gray-800">Spending by Category</h3>
            <Circle className="w-5 h-5 text-pink-600" />
        </div>
        {data.length > 0 ? (
            <>
                <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                                {data.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(v) => `₱ ${v}`} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                    {data.filter((cat) => cat.value > 0).map((cat, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                            <span className="text-xs text-gray-600 truncate">{cat.name}</span>
                        </div>
                    ))}
                </div>
            </>
        ) : (
            <p className="mt-10 italic text-sm">No Charts To Show</p>
        )}
    </div>
);

export default CategoryChart;
