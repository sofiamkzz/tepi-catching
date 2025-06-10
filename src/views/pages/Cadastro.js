import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';

const Cadastro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    numeroTelefone: '',
    cep: '',
    logradouro: '',
    cidade: '',
    estado: '',
    bairro: '',
    complemento: '',
    senha: ''
  });

  const formatarCep = (cep) => {
    cep = cep.replace(/\D/g, '');
    cep = cep.substring(0, 8);
    return cep.length <= 5
      ? cep.replace(/(\d{5})(\d{0,3})/, '$1-$2')
      : cep.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const formatarTelefone = (telefone) => {
    telefone = telefone.replace(/\D/g, '');
    return telefone.length <= 10
      ? telefone.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
      : telefone.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'cep') {
      const cepFormatado = formatarCep(value);
      setFormData({ ...formData, [name]: cepFormatado });
      if (cepFormatado.length === 9) {
        buscarEnderecoPorCep(cepFormatado.replace('-', ''));
      }
    } else if (name === 'numeroTelefone') {
      const telefoneFormatado = formatarTelefone(value);
      setFormData({ ...formData, [name]: telefoneFormatado });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const buscarEnderecoPorCep = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        alert('CEP inválido!');
        return;
      }

      setFormData((prev) => ({
        ...prev,
        logradouro: data.logradouro,
        cidade: data.localidade,
        estado: data.uf,
        bairro: data.bairro,
      }));
    } catch (error) {
      console.error('Erro ao buscar o endereço:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const credenciais = await createUserWithEmailAndPassword(auth, formData.email, formData.senha);
      const usuario = credenciais.user;

      await setDoc(doc(db, 'usuarios', usuario.uid), {
        nome: formData.nome,
        email: formData.email,
        numeroTelefone: formData.numeroTelefone,
        cep: formData.cep,
        logradouro: formData.logradouro,
        cidade: formData.cidade,
        estado: formData.estado,
        bairro: formData.bairro,
        complemento: formData.complemento,
      });

      alert('Cadastro realizado com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('Erro ao cadastrar:', error.message);
      alert('Erro ao cadastrar: ' + error.message);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="container my-5">
        <div className="form-container">
          <h1>Cadastro</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="nome">Nome:</label>
              <input type="text" className="form-control" name="nome" required onChange={handleChange} value={formData.nome} />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="email">Email:</label>
              <input type="email" className="form-control" name="email" required onChange={handleChange} value={formData.email} />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="numeroTelefone">Número de telefone:</label>
              <input type="text" className="form-control" name="numeroTelefone" required onChange={handleChange} value={formData.numeroTelefone} maxLength="15" />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="cep">CEP:</label>
                <input type="text" className="form-control" name="cep" required onChange={handleChange} value={formData.cep} maxLength="9" />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="logradouro">Logradouro:</label>
                <input type="text" className="form-control" name="logradouro" required onChange={handleChange} value={formData.logradouro} />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="cidade">Cidade:</label>
                <input type="text" className="form-control" name="cidade" required onChange={handleChange} value={formData.cidade} />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="estado">Estado:</label>
                <input type="text" className="form-control" name="estado" required onChange={handleChange} value={formData.estado} />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="bairro">Bairro:</label>
                <input type="text" className="form-control" name="bairro" required onChange={handleChange} value={formData.bairro} />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="complemento">Complemento:</label>
                <input type="text" className="form-control" name="complemento" onChange={handleChange} value={formData.complemento} />
              </div>
            </div>

            <div className="form-group mb-3">
              <label htmlFor="senha">Senha:</label>
              <input type="password" className="form-control" name="senha" required onChange={handleChange} value={formData.senha} />
            </div>

            <button type="submit" className="btn btn-main w-100">Cadastrar</button>
            <p className="text-center mt-3">Já tem uma conta? <a href="/">Faça login</a>.</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;
