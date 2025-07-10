import './Venda.css';
import { useEffect, useState } from "react"

interface FuncionarioState {
    idfuncionario: number,
    nomefuncionario: string
}
interface ProdutoState {
    idproduto: number,
    nomeproduto: string
}
interface VendaState {
    idvenda: number,
    datavenda: string,
    valorvenda: number,
    formapagamentovenda: string,
    funcionario_idfuncionario: number,
    produto_idproduto: number
}

function Venda() {
    const [idvenda, setIdVenda] = useState("")
    const [datavenda, setDataVenda] = useState("")
    const [valorvenda, setValorVenda] = useState("")
    const [formapagamentovenda, setFormaPagamentoVenda] = useState("")
    const [funcionarioNome, setFuncionarioNome] = useState("")
    const [produtoNome, setProdutoNome] = useState("")
    const [funcionario_idfuncionario, setFuncionarioIdFuncionario]= useState("")
    const [produto_idproduto, setProdutoIdProduto]= useState("")
    const [venda, setVenda] = useState<VendaState[]>([])
    const [funcionarios, setFuncionarios] = useState<FuncionarioState[]>([])
    const [produtos, setProdutos] = useState<ProdutoState[]>([])
    const [mensagem, setMensagem] = useState("");
    useEffect(() => {
        const buscaDados = async () => {
            try {
                const resultado = await fetch("http://localhost:8000/venda")
                if (resultado.status === 200) {
                    const dados = await resultado.json()
                    setVenda(dados)
                }
                if (resultado.status === 400) {
                    const erro = await resultado.json()
                    setMensagem(erro.mensagem)
                }
            } catch (erro) {
                setMensagem("Fetch não functiona")
            }
        }
        const buscaFuncionarios = async () => {
            try {
                const resultado = await fetch("http://localhost:8000/funcionario")
                if (resultado.status === 200) {
                    const dados = await resultado.json()
                    setFuncionarios(dados)
                }
            } catch (erro) {}
        }
        const buscaProdutos = async () => {
            try {
                const resultado = await fetch("http://localhost:8000/produto")
                if (resultado.status === 200) {
                    const dados = await resultado.json()
                    setProdutos(dados)
                }
            } catch (erro) {}
        }
        buscaDados()
        buscaFuncionarios()
        buscaProdutos()
    }, [])
    async function TrataCadastro(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        // Buscar funcionário e produto pelos nomes
        const funcionarioEncontrado = funcionarios.find(f => f.nomefuncionario.toLowerCase() === funcionarioNome.toLowerCase())
        if (!funcionarioEncontrado) {
            setMensagem("Funcionário não encontrado!")
            return
        }
        setFuncionarioIdFuncionario(funcionarioEncontrado.idfuncionario.toString())
        const produtoEncontrado = produtos.find(p => p.nomeproduto.toLowerCase() === produtoNome.toLowerCase())
        if (!produtoEncontrado) {
            setMensagem("Produto não encontrado!")
            return
        }
        setProdutoIdProduto(produtoEncontrado.idproduto.toString())
        //Criar uma nova venda
        const novaVenda: VendaState = {
            idvenda: parseInt(idvenda),
            datavenda: datavenda,
            valorvenda: parseFloat(valorvenda),
            formapagamentovenda: formapagamentovenda,
            funcionario_idfuncionario: funcionarioEncontrado.idfuncionario,
            produto_idproduto: produtoEncontrado.idproduto
        }
        try {
            const resposta = await fetch("http://localhost:8000/venda", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(novaVenda)
            })
            if (resposta.status === 200) {
                const dados = await resposta.json()
                setVenda([...venda, dados])
                setMensagem("")
            }
            if (resposta.status === 400) {
                const erro = await resposta.json()
                setMensagem(erro.mensagem)
            }
        } catch (erro) {
            setMensagem("Fetch não functiona")
        }
    }
    async function excluirVenda(id: number) {
        try {
            const resposta = await fetch(`http://localhost:8000/venda/${id}`, {
                method: "DELETE"
            })
            const dados = await resposta.json()
            if (resposta.status === 200) {
                setVenda(venda.filter(v => v.idvenda !== id))
                setMensagem(dados.mensagem)
            } else {
                setMensagem(dados.mensagem)
            }
        } catch (erro) {
            setMensagem("Erro ao tentar excluir a venda.")
        }
    }

    // Estado para edição
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [editId, setEditId] = useState("");
    const [editData, setEditData] = useState("");
    const [editValor, setEditValor] = useState("");
    const [editPagamento, setEditPagamento] = useState("");
    const [editFuncionarioNome, setEditFuncionarioNome] = useState("");
    const [editProdutoNome, setEditProdutoNome] = useState("");

    function iniciarEdicao(v: VendaState) {
        setEditandoId(v.idvenda);
        setEditId(v.idvenda.toString());
        setEditData(v.datavenda);
        setEditValor(v.valorvenda.toString());
        setEditPagamento(v.formapagamentovenda);
        const funcionario = funcionarios.find(f => f.idfuncionario === v.funcionario_idfuncionario);
        setEditFuncionarioNome(funcionario ? funcionario.nomefuncionario : "");
        const produto = produtos.find(p => p.idproduto === v.produto_idproduto);
        setEditProdutoNome(produto ? produto.nomeproduto : "");
        setMensagem("");
    }

    function cancelarEdicao() {
        setEditandoId(null);
        setEditId("");
        setEditData("");
        setEditValor("");
        setEditPagamento("");
        setEditFuncionarioNome("");
        setEditProdutoNome("");
        setMensagem("");
    }

    async function salvarEdicao(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!editId || !editData || !editValor || !editPagamento || !editFuncionarioNome || !editProdutoNome) {
            setMensagem('Todos os campos devem ser preenchidos para atualizar.');
            return;
        }
        const funcionarioEncontrado = funcionarios.find(f => f.nomefuncionario.toLowerCase() === editFuncionarioNome.toLowerCase());
        if (!funcionarioEncontrado) {
            setMensagem("Funcionário não encontrado!");
            return;
        }
        const produtoEncontrado = produtos.find(p => p.nomeproduto.toLowerCase() === editProdutoNome.toLowerCase());
        if (!produtoEncontrado) {
            setMensagem("Produto não encontrado!");
            return;
        }
        const vendaAtualizada: VendaState = {
            idvenda: parseInt(editId),
            datavenda: editData,
            valorvenda: parseFloat(editValor),
            formapagamentovenda: editPagamento,
            funcionario_idfuncionario: funcionarioEncontrado.idfuncionario,
            produto_idproduto: produtoEncontrado.idproduto
        };
        try {
            const resposta = await fetch(`http://localhost:8000/venda/${editandoId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(vendaAtualizada)
            });
            const dados = await resposta.json();
            if (resposta.status === 200) {
                setVenda(venda.map(v => v.idvenda === editandoId ? vendaAtualizada : v));
                setMensagem(dados.mensagem || 'Venda atualizada com sucesso!');
                cancelarEdicao();
            } else {
                setMensagem(dados.mensagem || 'Erro ao atualizar venda.');
            }
        } catch (erro) {
            setMensagem('Erro ao tentar atualizar a venda.');
        }
    }
    function trataIdVenda(event: React.ChangeEvent<HTMLInputElement>) {
        setIdVenda(event.target.value)
    }
    function trataDataVenda(event: React.ChangeEvent<HTMLInputElement>) {
        setDataVenda(event.target.value)
    }
    function trataValorVenda(event: React.ChangeEvent<HTMLInputElement>) {
        setValorVenda(event.target.value)
    }
    function trataFormaPagamentoVenda(event: React.ChangeEvent<HTMLInputElement>) {
        setFormaPagamentoVenda(event.target.value)
    }
    function trataFuncionarioNome(event: React.ChangeEvent<HTMLSelectElement>) {
        setFuncionarioNome(event.target.value)
    }
    function trataProdutoNome(event: React.ChangeEvent<HTMLSelectElement>) {
        setProdutoNome(event.target.value)
    }
    return (
        <>
            <main>
                {mensagem &&
                    <div className="mensagem">
                        <p>{mensagem}</p>
                    </div>
                }
                <div className="container-listagem">
                    {venda.map(venda => (
                        <div className="venda-container" key={venda.idvenda}>
                            {editandoId === venda.idvenda ? (
                                <form className="form-edicao" onSubmit={salvarEdicao} style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                                    <input type="number" value={editId} onChange={e => setEditId(e.target.value)} placeholder="Id" style={{width: '60px'}} />
                                    <input type="number" value={editData} onChange={e => setEditData(e.target.value)} placeholder="Data" />
                                    <input type="number" value={editValor} onChange={e => setEditValor(e.target.value)} placeholder="Valor" />
                                    <input type="text" value={editPagamento} onChange={e => setEditPagamento(e.target.value)} placeholder="Pagamento" />
                                    <select value={editFuncionarioNome} onChange={e => setEditFuncionarioNome(e.target.value)} required>
                                        <option value="">Selecione o Funcionário</option>
                                        {funcionarios.map(f => (
                                            <option key={f.idfuncionario} value={f.nomefuncionario}>{f.nomefuncionario}</option>
                                        ))}
                                    </select>
                                    <select value={editProdutoNome} onChange={e => setEditProdutoNome(e.target.value)} required>
                                        <option value="">Selecione o Produto</option>
                                        {produtos.map(p => (
                                            <option key={p.idproduto} value={p.nomeproduto}>{p.nomeproduto}</option>
                                        ))}
                                    </select>
                                    <button type="submit">Salvar</button>
                                    <button type="button" onClick={cancelarEdicao}>Cancelar</button>
                                </form>
                            ) : (
                                <>
                                    <div className="venda-id">{venda.idvenda}</div>
                                    <div className="venda-data">{venda.datavenda}</div>
                                    <div className="venda-valor">{venda.valorvenda}</div>
                                    <div className="venda-pagamento">{venda.formapagamentovenda}</div>
                                    <div className="venda-funcionario">{venda.funcionario_idfuncionario}</div>
                                    <div className="venda-produto">{venda.produto_idproduto}</div>
                                    <button onClick={() => iniciarEdicao(venda)}>Editar</button>
                                    <button onClick={() => excluirVenda(venda.idvenda)}>Excluir</button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
                <div className="container-cadastro">
                    <form onSubmit={TrataCadastro}>
                        <input type="number" name="id" id="id" onChange={trataIdVenda} placeholder="Id" />
                        <input type="number" name="data" id="data" onChange={trataDataVenda} placeholder="Data" />
                        <input type="number" name="valor" id="valor" onChange={trataValorVenda} placeholder="Valor" />
                        <input type="text" name="pagamento" id="pagamento" onChange={trataFormaPagamentoVenda} placeholder="Pagamento" />
                        <select name="funcionarioNome" id="funcionarioNome" onChange={trataFuncionarioNome} value={funcionarioNome} required>
                            <option value="">Selecione o Funcionário</option>
                            {funcionarios.map(f => (
                                <option key={f.idfuncionario} value={f.nomefuncionario}>{f.nomefuncionario}</option>
                            ))}
                        </select>
                        <select name="produtoNome" id="produtoNome" onChange={trataProdutoNome} value={produtoNome} required>
                            <option value="">Selecione o Produto</option>
                            {produtos.map(p => (
                                <option key={p.idproduto} value={p.nomeproduto}>{p.nomeproduto}</option>
                            ))}
                        </select>
                        <input type="submit" value="Cadastrar" />
                    </form>
                </div>
            </main>
            <footer></footer>
        </>
    )
}

export default Venda