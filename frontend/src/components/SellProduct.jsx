import { useState } from "react";
import axios from "axios";

const SellProduct = () => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");

  const handleSell = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/inventory/sell", {
        name,
        quantity: parseInt(quantity),
      });

      const { product, alert } = res.data;

      setMessage(
        alert
          ? `⚠️ ALERT: ${alert}`
          : `✅ Sold ${quantity} units of "${product.name}". Remaining: ${product.quantity}`
      );

      setName("");
      setQuantity("");
    } catch (err) {
      setMessage("❌ Product not found or error occurred.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
        🛒 Sell Product
      </h2>

      {message && (
        <div className="mb-4 text-sm text-center text-red-600">{message}</div>
      )}

      <form onSubmit={handleSell} className="space-y-4">
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
          placeholder="Quantity to Sell"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md"
        />

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md"
        >
          Sell Product
        </button>
      </form>
    </div>
  );
};

export default SellProduct;
