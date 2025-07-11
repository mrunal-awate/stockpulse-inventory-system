import { useEffect, useState } from "react";
import axios from "axios";
import Papa from "papaparse";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Sun, Moon, Download, FileText } from "lucide-react";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", quantity: "", threshold: "", category: "", supplier: "" });
  const [insights, setInsights] = useState([]);

  const fetchInventory = async () => {
    const res = await axios.get("http://localhost:5000/api/inventory/all");
    setProducts(res.data);
  };

  const fetchAIInsights = async () => {
    const res = await axios.get("http://localhost:5000/api/ai/insights");
    setInsights(res.data.insights);
  };

  useEffect(() => {
    fetchInventory();
    fetchAIInsights();
    const interval = setInterval(() => {
      fetchInventory();
      fetchAIInsights();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()));

  const handleEditClick = (product) => {
    setEditingProduct(product._id);
    setEditForm({
      name: product.name,
      quantity: product.quantity,
      threshold: product.threshold,
      category: product.category || "",
      supplier: product.supplier || "",
    });
  };

  const handleEditSubmit = async () => {
    await axios.put(`http://localhost:5000/api/inventory/update/${editingProduct}`, editForm);
    setEditingProduct(null);
    fetchInventory();
    fetchAIInsights();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    await axios.delete(`http://localhost:5000/api/inventory/delete/${id}`);
    fetchInventory();
    fetchAIInsights();
  };

  const handleExportCSV = () => {
    const csvData = products.map((product) => ({
      Product: product.name,
      Quantity: product.quantity,
      Threshold: product.threshold,
      Category: product.category || "-",
      Supplier: product.supplier || "-",
      Status: product.quantity < product.threshold ? "Low Stock" : "OK",
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "stockpulse_inventory.csv");
    link.click();
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("StockPulse Inventory", 14, 15);
    const tableData = products.map((product) => [
      product.name,
      product.quantity,
      product.threshold,
      product.category || "-",
      product.supplier || "-",
      product.quantity < product.threshold ? "Low Stock" : "OK",
    ]);
    autoTable(doc, {
      startY: 20,
      head: [["Product", "Quantity", "Threshold", "Category", "Supplier", "Status"]],
      body: tableData,
    });
    doc.save("stockpulse_inventory.pdf");
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"} min-h-screen p-6 transition-all`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📦 StockPulse Dashboard</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full border hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          {darkMode ? <Sun className="text-yellow-400" /> : <Moon />}
        </button>
      </div>

      {insights.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {insights.map((insight) => (
            <div key={insight.name} className="p-4 rounded-xl shadow-md bg-blue-50 dark:bg-blue-900">
              <h4 className="font-semibold text-lg mb-1">🔍 {insight.name}</h4>
              <p className="text-sm">{insight.recommendation}</p>
              <p className="text-xs mt-1 text-gray-500">📊 Forecast (30d): {insight.forecast30Days}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
        <input
          type="text"
          placeholder="Search product..."
          className="w-full md:w-1/2 px-4 py-2 border rounded-md focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          <button onClick={handleExportCSV} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-1">
            <Download size={16} /> Export CSV
          </button>
          <button onClick={handleExportPDF} className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-1">
            <FileText size={16} /> Export PDF
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              {['Product', 'Quantity', 'Threshold', 'Category', 'Supplier', 'Status', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-2 text-left border-b">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-4">No products found.</td></tr>
            ) : (
              filteredProducts.map((product) => {
                const isLow = product.quantity < product.threshold;
                return (
                  <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    {editingProduct === product._id ? (
                      ["name", "quantity", "threshold", "category", "supplier"].map((field) => (
                        <td key={field} className="px-4 py-2 border-b">
                          <input
                            type={field === "quantity" || field === "threshold" ? "number" : "text"}
                            value={editForm[field]}
                            onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })}
                            className="w-full border px-2 py-1 rounded"
                          />
                        </td>
                      ))
                    ) : (
                      [product.name, product.quantity, product.threshold, product.category || "-", product.supplier || "-"].map((val, i) => (
                        <td key={i} className="px-4 py-2 border-b">{val}</td>
                      ))
                    )}
                    <td className={`px-4 py-2 border-b font-bold ${isLow ? "text-red-600" : "text-green-600"}`}>
                      {isLow ? "Low Stock" : "OK"}
                    </td>
                    <td className="px-4 py-2 border-b space-x-2">
                      {editingProduct === product._id ? (
                        <>
                          <button onClick={handleEditSubmit} className="bg-green-500 text-white px-2 py-1 rounded">Save</button>
                          <button onClick={() => setEditingProduct(null)} className="bg-gray-400 text-white px-2 py-1 rounded">Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEditClick(product)} className="bg-yellow-400 text-white px-2 py-1 rounded">Edit</button>
                          <button onClick={() => handleDelete(product._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
