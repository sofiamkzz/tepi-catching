import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "./views/pages/Admin";
import Cadastro from "./views/pages/Cadastro";
import Conta from "./views/pages/Conta";
import Login from "./views/pages/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/conta" element={<Conta />} />
      </Routes>
    </Router>
  );
}

export default App;