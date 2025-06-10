import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import { auth, db } from '../../firebaseConfig'; 
import { onAuthStateChanged, updatePassword, updateEmail } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const Conta = () => {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cep: '',
    logradouro: '',
    cidade: '',
    estado: '',
    bairro: '',
    complemento: '',
    newPassword: '',
  });
  const [errorMsg, setErrorMsg] = useState('');

  // Busca dados do usuário no Firestore quando o usuário autentica
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Busca dados adicionais no Firestore
        const userDocRef = doc(db, "usuarios", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setFormData({
            ...userDoc.data(),
            email: currentUser.email, // sempre pegar email do Auth
            newPassword: '',
          });
        } else {
          // Se não tiver dados, inicializa com email
          setFormData({
            nome: '',
            email: currentUser.email,
            cep: '',
            logradouro: '',
            cidade: '',
            estado: '',
            bairro: '',
            complemento: '',
            newPassword: '',
          });
        }
      } else {
        setUser(null);
        setFormData({
          nome: '',
          email: '',
          cep: '',
          logradouro: '',
          cidade: '',
          estado: '',
          bairro: '',
          complemento: '',
          newPassword: '',
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.newPassword && formData.newPassword.length < 6) {
      setErrorMsg("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    try {
      // Atualizar email no Firebase Auth (se mudou)
      if (user.email !== formData.email) {
        await updateEmail(user, formData.email);
      }

      // Atualizar senha no Firebase Auth (se nova senha foi preenchida)
      if (formData.newPassword) {
        await updatePassword(user, formData.newPassword);
      }

      // Atualizar dados adicionais no Firestore
      const userDocRef = doc(db, "usuarios", user.uid);

      const userDataToSave = {
        nome: formData.nome,
        cep: formData.cep,
        logradouro: formData.logradouro,
        cidade: formData.cidade,
        estado: formData.estado,
        bairro: formData.bairro,
        complemento: formData.complemento,
        // Não salvamos senha aqui por segurança
      };

      await setDoc(userDocRef, userDataToSave, { merge: true });

      setShowModal(false);
      alert("Dados atualizados com sucesso!");

      // Atualiza o estado user (opcional, só para refletir mudanças imediatas)
      setUser({
        ...user,
        email: formData.email,
        nome: formData.nome,
      });

    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      setErrorMsg(error.message || "Erro ao atualizar dados.");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!user) {
    return <div>Carregando...</div>;
  }

  return (
    <div style={{ backgroundColor: '#fff4f9', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav className="navbar navbar-expand-lg navbar-light" style={{ background: 'linear-gradient(90deg, #e70a3a8f 20%, rgba(255,255,255,0) 78%, rgba(209, 11, 54, 0.564) 100%)' }}>
        <div className="container">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><a className="nav-link" href="/">Produtos</a></li>
            <li className="nav-item"><a className="nav-link" href="/historicoCompras">Histórico</a></li>
            <li className="nav-item"><a className="nav-link" href="/carrinho">Carrinho</a></li>
            <li className="nav-item"><a className="nav-link" href="/logout">Sair</a></li>
          </ul>
        </div>
      </nav>

      <header className="text-center mt-4">
        <h1>Minha Conta</h1>
        <p className="lead">Gerencie seus dados e preferências</p>
      </header>

      {errorMsg && <div className="alert alert-danger text-center">{errorMsg}</div>}

      <main className="container my-4">
        <div className="text-center p-4" style={{ backgroundColor: '#f0dadf8f', borderRadius: 15 }}>
          <i className="fas fa-user-circle" style={{ fontSize: '3rem', color: '#d6336c' }}></i><br />
          <h4>Dados Pessoais</h4>
          <p>Nome: {formData.nome}</p>
          <p>Email: {formData.email}</p>
          <Button style={{ backgroundColor: '#d6336c' }} onClick={() => setShowModal(true)}>
            Editar Dados
          </Button>
        </div>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Dados Pessoais</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSaveChanges}>
              <Form.Group className="mb-3">
                <Form.Label>Nome:</Form.Label>
                <Form.Control type="text" name="nome" value={formData.nome} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email:</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>CEP:</Form.Label>
                <Form.Control type="text" name="cep" value={formData.cep} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Logradouro:</Form.Label>
                <Form.Control type="text" name="logradouro" value={formData.logradouro} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Cidade:</Form.Label>
                <Form.Control type="text" name="cidade" value={formData.cidade} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Estado:</Form.Label>
                <Form.Control type="text" name="estado" value={formData.estado} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Bairro:</Form.Label>
                <Form.Control type="text" name="bairro" value={formData.bairro} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Complemento:</Form.Label>
                <Form.Control type="text" name="complemento" value={formData.complemento} onChange={handleChange} />
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
              <Button type="submit" style={{ backgroundColor: '#d6336c' }}>
                Salvar Alterações
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </main>

      <footer className="bg-light-pink py-4">
        <div className="container text-center">
          <p className="text-dark-pink mb-0">&copy; 2025 Viva Colors. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Conta;