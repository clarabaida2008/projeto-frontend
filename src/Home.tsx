import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main style={{padding:'40px', textAlign:'center'}}>
      <h1>Bem-vindo ao Mercadinho!</h1>
      <nav style={{marginTop:'30px'}}>
        <ul style={{listStyle:'none', padding:0, display:'flex', flexDirection:'column', gap:'20px', alignItems:'center'}}>
          <li><Link to="/produtos">Produtos</Link></li>
          <li><Link to="/fornecedores">Fornecedores</Link></li>
          <li><Link to="/funcionarios">Funcionários</Link></li>
          <li><Link to="/vendas">Vendas</Link></li>
        </ul>
      </nav>
    </main>
  );
}
