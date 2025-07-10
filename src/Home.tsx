import React, { useEffect, useState } from 'react';
import './Home.css';

type Relatorio = {
  id_produto: number;
  produto: string;
  valor: number;
  id_fornecedor: number;
  fornecedor: string;
  cnpj: string;
  telefone: string;
};

export default function Home() {
  const [dados, setDados] = useState<Relatorio[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/relatorio-produtos-fornecedores')
      .then(res => res.json())
      .then(setDados)
      .catch(() => setDados([]));
  }, []);

  return (
    <main style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Bem-vindo ao Mercadinho!</h1>
      <h2 style={{ marginTop: '30px' }}>Relatório de Produtos e Fornecedores</h2>
      <table style={{ margin: '30px auto', borderCollapse: 'collapse', minWidth: 700 }}>
        <thead>
          <tr>
            <th>ID Produto</th>
            <th>Produto</th>
            <th>Valor</th>
            <th>ID Fornecedor</th>
            <th>Fornecedor</th>
            <th>CNPJ</th>
            <th>Telefone</th>
          </tr>
        </thead>
        <tbody>
          {dados.map((item) => (
            <tr key={item.id_produto}>
              <td>{item.id_produto}</td>
              <td>{item.produto}</td>
              <td>R$ {Number(item.valor).toFixed(2)}</td>
              <td>{item.id_fornecedor}</td>
              <td>{item.fornecedor}</td>
              <td>{item.cnpj}</td>
              <td>{item.telefone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
