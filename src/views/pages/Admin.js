import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, } from "firebase/auth";
import { collection, getDocs, doc, deleteDoc, updateDoc,} from "firebase/firestore";
import { auth, db } from "../../firebaseConfig"; 
import "../css/admin.css";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    numeroTelefone: "",
    cep: "",
    logradouro: "",
    cidade: "",
    estado: "",
    bairro: "",
    complemento: "",
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "usuarios");
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList);
      } catch (error) {
        console.error("Erro ao buscar usuários do Firestore:", error);
      }
    };

    fetchUsers();
  }, []);

  // Remove usuário do Firestore e da lista local
  const removerUsuario = async (id) => {
    if (window.confirm("Tem certeza que deseja remover este usuário?")) {
      try {
        await deleteDoc(doc(db, "usuarios", id));
        setUsers(users.filter((user) => user.id !== id));
        alert("Usuário removido com sucesso.");
      } catch (error) {
        console.error("Erro ao remover usuário:", error);
        alert("Erro ao remover usuário.");
      }
    }
  };

  const handleEditUser = (user) => {
    setSelectedUserId(user.id);
    setFormData({
      nome: user.nome || "",
      email: user.email || "",
      numeroTelefone: user.numeroTelefone || "",
      cep: user.cep || "",
      logradouro: user.logradouro || "",
      cidade: user.cidade || "",
      estado: user.estado || "",
      bairro: user.bairro || "",
      complemento: user.complemento || "",
      currentPassword: "",
      newPassword: "",
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const reauthenticate = async (currentPassword) => {
    if (!auth.currentUser) throw new Error("Usuário não autenticado.");
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      currentPassword
    );
    await reauthenticateWithCredential(auth.currentUser, credential);
  };

  const updateUserPassword = async (newPassword) => {
    if (!auth.currentUser) throw new Error("Usuário não autenticado.");
    await updatePassword(auth.currentUser, newPassword);
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    const dadosAtualizados = {
      nome: formData.nome,
      email: formData.email,
      numeroTelefone: formData.numeroTelefone,
      cep: formData.cep,
      logradouro: formData.logradouro,
      cidade: formData.cidade,
      estado: formData.estado,
      bairro: formData.bairro,
      complemento: formData.complemento,
    };

    try {
      if (formData.newPassword) {
        await reauthenticate(formData.currentPassword);
        await updateUserPassword(formData.newPassword);
        alert("Senha atualizada com sucesso!");
      }

      // Atualiza dados no Firestore
      await updateDoc(doc(db, "users", selectedUserId), dadosAtualizados);

      // Atualiza localmente para re-renderizar a lista
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === selectedUserId ? { ...u, ...dadosAtualizados } : u
        )
      );

      setShowModal(false);
    } catch (error) {
      alert("Erro: " + error.message);
    }
  };

  return (
    <div>
      <nav
        className="navbar navbar-expand-lg navbar-light"
        style={{ background: "#d42249" }}
      >
        <div className="container">
          <div className="navbar-brand fw-bold text-dark-pink">
            <img
              src="papelaria.jpg"
              alt="Logo Viva Colors"
              style={{ height: "50px" }}
            />
            Viva Colors
          </div>
        </div>
      </nav>

      <header className="text-center">
        <div className="container">
          <br />
          <h1 className="admin-header-title">Admin - Gerenciar Usuários</h1>
          <p className="admin-header-description">
            Aqui você pode atualizar ou remover usuários
          </p>
        </div>
      </header>

      <main className="container my-5">
        <div className="user-info-panel">
          <h4>Administração de Conta</h4>
          <p>Gerencie os dados dos usuários de forma eficiente.</p>
        </div>

        <div className="user-list-panel">
          <h4>Usuários Registrados</h4>
          {users.length === 0 && <p>Nenhum usuário encontrado.</p>}
          {users.map((user) => (
            <div
              key={user.id}
              className="user-card d-flex justify-content-between align-items-center"
            >
              <div>
                <p>
                  <strong>{user.nome}</strong>
                  <br />
                  {user.email}
                </p>
              </div>
              <div>
                <button
                  className="btn btn-warning me-2"
                  onClick={() => handleEditUser(user)}
                >
                  Atualizar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => removerUsuario(user.id)}
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Dados Pessoais</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveChanges}>
            <Form.Group className="mb-3">
              <Form.Label>Nome:</Form.Label>
              <Form.Control
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Número de telefone:</Form.Label>
              <Form.Control
                type="text"
                name="numeroTelefone"
                value={formData.numeroTelefone}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>CEP:</Form.Label>
              <Form.Control
                type="text"
                name="cep"
                value={formData.cep}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Logradouro:</Form.Label>
              <Form.Control
                type="text"
                name="logradouro"
                value={formData.logradouro}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cidade:</Form.Label>
              <Form.Control
                type="text"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Estado:</Form.Label>
              <Form.Control
                type="text"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Bairro:</Form.Label>
              <Form.Control
                type="text"
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Complemento:</Form.Label>
              <Form.Control
                type="text"
                name="complemento"
                value={formData.complemento}
                onChange={handleChange}
              />
            </Form.Group>

            <hr />
            <h5>Alterar senha</h5>

            <Form.Group className="mb-3">
              <Form.Label>Senha Atual:</Form.Label>
              <Form.Control
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Informe a senha atual"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nova Senha:</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Nova senha"
              />
            </Form.Group>

            <Button type="submit" style={{ backgroundColor: "#d6336c" }}>
              Salvar alterações
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <footer className="bg-light-pink py-4">
        <div className="container text-center">
          <p className="text-dark-pink mb-0">
            &copy; 2025 Viva Colors. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Admin;