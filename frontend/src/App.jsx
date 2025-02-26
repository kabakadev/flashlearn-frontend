import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "./components/UserContext"; // ✅ Wrap the app with UserProvider
import Login from "./components/Login";
import Register from "./components/Register";
import Homepage from "./components/Homepage";
import Dashboard from "./components/Dashboard"; // ✅ Import Dashboard

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} /> {/* ✅ Add Dashboard route */}
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
