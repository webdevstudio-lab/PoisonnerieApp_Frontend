import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// --- COMPOSANTS DE CONTRÔLE D'ACCÈS ---
import ProtectedRoutes from "./components/Auth/ProtectedRoute";
import PublicRoute from "./components/Auth/PublicRoute";
import LayoutWrapper from "./layout/LayoutWrapper"; // Vérifiez que le dossier est 'Layout' et le fichier 'LayoutWrapper.jsx'
import NotFound from "./pages/spécial/NotFound";

// --- PAGES ---
// Authentification
import Login from "./pages/auth/Login";

// Dashboard & Profil
import Dashboard from "./pages/dashboard/Dashboard";

// Utilisateurs & Clients
import AllUsers from "./pages/users/AllUsers";

// Clients
import AllClient from "./pages/clients/AllClient";
import ClientDetails from "./pages/clients/ClientDetails";

// Points de vente
import AllSales from "./pages/salePoints/AllSales";
import SalesDetails from "./pages/salePoints/salesDetails";

// Storage
import AllStorage from "./pages/storages/AllStorage";
import StorageDetails from "./pages/storages/StorageDetails";

//fournisseur
import AllSuppliers from "./pages/fournisseurs/AllSuppliers";
import SupplierDetails from "./pages/fournisseurs/SupplierDetails";

// produits
import AllProducts from "./pages/produits/AllProducts";
import ProductDetails from "./pages/produits/ProductDetails";

// Archives
import Archive from "./pages/archive/Archive";

//Depenses
import Depenses from "./pages/depenses/Depenses";

//Caisse
import Caisse from "./pages/caisse/Caisse";

// Utilitaires

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ==========================================================
              1. ROUTES PUBLIQUES (Accessibles sans connexion)
              ========================================================== */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route element={<ProtectedRoutes />}>
            {/* --- WRAPPER AVEC SIDEBAR & NAVBAR --- */}
            <Route element={<LayoutWrapper />}>
              {/* Dashboard & Profil */}
              <Route path="/dashboard" element={<Dashboard />} />

              {/*Point de vente */}
              <Route path="/salesPoints" element={<AllSales />} />
              <Route path="/salesPoints/:id" element={<SalesDetails />} />

              {/* Storage */}
              <Route path="/store" element={<AllStorage />} />
              <Route path="/store/:id" element={<StorageDetails />} />

              {/* fournisseur */}
              <Route path="/suppliers" element={<AllSuppliers />} />
              <Route path="/suppliers/:id" element={<SupplierDetails />} />

              {/* produits */}
              <Route path="/products" element={<AllProducts />} />
              <Route path="/products/:id" element={<ProductDetails />} />

              {/* Depenses */}
              <Route path="/depenses" element={<Depenses />} />

              {/* Utilisateurs */}
              <Route path="/users" element={<AllUsers />} />

              {/* Clients */}
              <Route path="/clients" element={<AllClient />} />
              <Route path="/clients/:id" element={<ClientDetails />} />

              {/* Caisse */}
              <Route path="/caisse" element={<Caisse />} />

              {/* Archives */}
              <Route path="/archive" element={<Archive />} />
            </Route>{" "}
            {/* Fin LayoutWrapper */}
          </Route>{" "}
          {/* Fin ProtectedRoutes global */}
          <Route path="*" element={<NotFound />} key="not-found" />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
