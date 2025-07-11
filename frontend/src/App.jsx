import AddProduct from "./components/AddProduct";
import SellProduct from "./components/SellProduct";
import Dashboard from "./components/Dashboard";
import History from "./components/History";


function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md py-6 px-80 w-full">
        <h1 className="text-4xl font-bold text-blue-600">
        🛒 Walmart StockPulse Dashboard
        </h1>
      </header>

      {/* Main Content - full width */}
      <main className="flex-1 w-full px-80 py-6 space-y-8">
        <AddProduct />
        <SellProduct />
        <Dashboard />
        <History />

      </main>
    </div>
  );
}

export default App;







// import AddProduct from "./components/AddProduct";
// import SellProduct from "./components/SellProduct";
// import Dashboard from "./components/Dashboard";

// function App() {
//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Header */}
//       <header className="bg-white shadow p-6">
//         <h1 className="text-4xl font-bold text-blue-600 text-center">
//           🛒 StockPulse Dashboard
//         </h1>
//       </header>

//       {/* Main content */}
//       <main className="w-full px-4 py-8">
//         <div className="w-full max-w-screen-xl mx-auto grid grid-cols-1 gap-6">
//           <AddProduct />
//           <SellProduct />
//           <Dashboard />
//         </div>
//       </main>
//     </div>
//   );
// }

// export default App;
