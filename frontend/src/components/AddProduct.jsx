import { useState } from "react";
import axios from "axios";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [threshold, setThreshold] = useState("");
  const [category, setCategory] = useState("");
  const [supplier, setSupplier] = useState("");
  const [message, setMessage] = useState("");

  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/inventory/add", {
        name,
        quantity: parseInt(quantity),
        threshold: parseInt(threshold),
        category,
        supplier,
      });

      setMessage(`✅ Product "${res.data.product.name}" added successfully!`);
      setName("");
      setQuantity("");
      setThreshold("");
      setCategory("");
      setSupplier("");
    } catch (err) {
      setMessage("❌ Failed to add product. Check console.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
        ➕ Add New Product
      </h2>

      {message && (
        <div className="mb-4 text-sm text-center text-blue-600">{message}</div>
      )}

      <form onSubmit={handleAdd} className="space-y-4">
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md"
        />

        <input
          type="number"
          placeholder="Initial Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md"
        />

        <input
          type="number"
          placeholder="Threshold (Low stock alert)"
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md"
        />

        <input
          type="text"
          placeholder="Category (e.g., Electronics, Grocery)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        />

        <input
          type="text"
          placeholder="Supplier (e.g., Flipkart, Reliance)"
          value={supplier}
          onChange={(e) => setSupplier(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
