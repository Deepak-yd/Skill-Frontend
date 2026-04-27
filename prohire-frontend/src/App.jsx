import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Professionals from "./pages/Professionals";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import MyHires from "./pages/MyHires";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPanel from "./pages/AdminPanel";
import Connections from "./pages/Connections";
import Jobs from "./pages/Jobs";
<<<<<<< HEAD
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import Messages from "./pages/Messages";
=======
>>>>>>> bad2c7d74b851a71b111b31ea48e4b957f7b22bb

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/professionals"
            element={
              <ProtectedRoute>
                <Professionals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
            }
          />
          <Route
            path="/hires"
            element={
            <ProtectedRoute>
              <MyHires />
            </ProtectedRoute>
            }
          />
          <Route
            path="/connections"
            element={
<<<<<<< HEAD
            <ProtectedRoute role={["USER", "PROFESSIONAL"]}>
=======
            <ProtectedRoute role={["user", "professional"]}>
>>>>>>> bad2c7d74b851a71b111b31ea48e4b957f7b22bb
              <Connections />
            </ProtectedRoute>
            }
          />
          <Route
            path="/jobs"
            element={
            <ProtectedRoute>
              <Jobs />
            </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin"
            element={
<<<<<<< HEAD
            <ProtectedRoute role={["ADMIN"]}>
=======
            <ProtectedRoute role={["admin"]}>
>>>>>>> bad2c7d74b851a71b111b31ea48e4b957f7b22bb
              <AdminPanel />
            </ProtectedRoute>
            }
          />
<<<<<<< HEAD
           <Route
            path="/settings"
            element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
            }
          />
           <Route
            path="/support"
            element={
            <ProtectedRoute>
              <Support />
            </ProtectedRoute>
            }
          />
           <Route
            path="/messages"
            element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
            }
          />
=======
>>>>>>> bad2c7d74b851a71b111b31ea48e4b957f7b22bb
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
