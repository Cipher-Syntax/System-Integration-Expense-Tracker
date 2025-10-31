import React from "react";
import { Download } from "lucide-react";

const ExportButton = ({ topExpenses }) => {
    const handleExport = () => {
        const csvData = [
            ["Date", "Category", "Description", "Amount"],
            ...topExpenses.map((e) => [e.date, e.category, e.name, e.amount]),
        ];
        const blob = new Blob([csvData.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `expense_report_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
    };

    return (
        <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-5 py-2 rounded-lg hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 font-semibold text-sm w-full sm:w-auto"
        >
            <Download className="w-4 h-4" />
            Export CSV
        </button>
    );
};

export default ExportButton;
