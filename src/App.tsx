import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Importando os componentes das páginas pelo link no projeto
import Home from './Home';
import Fornecedor from './Fornecedor';
import Funcionario from './Funcionario';
import Produto from './Produto';
import Venda from './Venda';

// Componente principal da aplicação: cabeçalho com links de navegação e rotas para as páginas
export default function App() {
  return (
    <BrowserRouter>
      <header>
        <div>Mercadinho</div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/produtos">Produtos</Link></li>
            <li><Link to="/fornecedores">Fornecedores</Link></li>
            <li><Link to="/funcionarios">Funcionários</Link></li>
            <li><Link to="/vendas">Vendas</Link></li>
          </ul>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produtos" element={<Produto />} />
          <Route path="/fornecedores" element={<Fornecedor />} />
          <Route path="/funcionarios" element={<Funcionario />} />
          <Route path="/vendas" element={<Venda />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
