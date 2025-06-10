import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const auth = getAuth();

    try {
      // Tenta logar com email e senha pelo Firebase
      await signInWithEmailAndPassword(auth, formData.email, formData.senha);
      console.log("Login bem-sucedido!");
      navigate("/conta"); // Redireciona para a página da conta após login
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setErrorMsg("Email ou senha inválidos.");
    }
  };

  return (
    <div className="container my-5">
      <div className="form-container">
        <h1 className="text-center">Login</h1>

        {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              placeholder="Digite seu email"
              required
              onChange={handleChange}
              value={formData.email}
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              className="form-control"
              id="senha"
              name="senha"
              placeholder="Digite sua senha"
              required
              onChange={handleChange}
              value={formData.senha}
            />
          </div>

          <button type="submit" className="btn btn-main btn-block">
            Entrar
          </button>

          <p className="text-center mt-3">
            Não tem uma conta? <Link to="/cadastro">Cadastre-se.</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;