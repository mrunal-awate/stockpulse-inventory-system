import { useEffect, useState } from "react";
import axios from "axios";

const History = () => {
  const [logs, setLogs] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/history");
      setLogs(res.data);
    } catch (err) {
      console.error("Error fetching history logs:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="w-full bg-white mt-10 rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
        🕘 Inventory History Logs
      </h2>

      {logs.length === 0 ? (
        <p className="text-center text-gray-500">No history logs found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-2 px-4 border-b">Time</th>
                <th className="py-2 px-4 border-b">Action</th>
                <th className="py-2 px-4 border-b">Product</th>
                <th className="py-2 px-4 border-b">Quantity</th>
                <th className="py-2 px-4 border-b">Description</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50 text-black">
                  <td className="py-2 px-4 border-b">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border-b font-semibold text-blue-600 uppercase">
                    {log.action}
                  </td>
                  <td className="py-2 px-4 border-b">{log.productName}</td>
                  <td className="py-2 px-4 border-b">{log.quantity}</td>
                  <td className="py-2 px-4 border-b">{log.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default History;
