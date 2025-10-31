import React from "react";
import { TrendingUp, DollarSign, Circle, BarChart3 } from "lucide-react";

const icons = {
    green: TrendingUp,
    pink: DollarSign,
    blue: Circle,
    purple: BarChart3,
};

const StatsGrid = ({ stats }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => {
            const Icon = icons[stat.color];
            return (
                <div key={i} className="bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-3">
                        <div
                            className={`p-2.5 rounded-lg ${
                                stat.color === "green"
                                    ? "bg-green-100"
                                    : stat.color === "pink"
                                    ? "bg-pink-100"
                                    : stat.color === "blue"
                                    ? "bg-blue-100"
                                    : "bg-purple-100"
                            }`}
                        >
                            <Icon
                                className={`w-5 h-5 ${
                                    stat.color === "green"
                                        ? "text-green-600"
                                        : stat.color === "pink"
                                        ? "text-pink-600"
                                        : stat.color === "blue"
                                        ? "text-blue-600"
                                        : "text-purple-600"
                                }`}
                            />
                        </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
            );
        })}
    </div>
);

export default StatsGrid;
