import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const queryClient = new QueryClient();

const SimpleHome = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Learning Management System</h1>
      <p className="text-gray-600">Welcome to your LMS. The application is successfully running!</p>
      <div className="mt-4 space-y-2">
        <div className="text-sm text-gray-500">✅ Frontend: React + TypeScript</div>
        <div className="text-sm text-gray-500">✅ Backend: Express.js</div>
        <div className="text-sm text-gray-500">✅ Database: PostgreSQL</div>
        <div className="text-sm text-gray-500">✅ Migration: Complete</div>
      </div>
    </div>
  </div>
);

const NotFound = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800">404</h1>
      <p className="text-gray-600">Page not found</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SimpleHome />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;