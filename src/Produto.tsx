import './Produto.css';
import { useEffect, useState } from "react"

interface FornecedorState {
    idfornecedor: number,
    nomefornecedor: string
}
interface ProdutoState {
    idproduto: number,
    nomeproduto: string,
    precoproduto: number,
    categoriaproduto: string,
    fornecedor_idfornecedor: number
}

function Produto() {
    const [idproduto, setIdProduto] = useState("")
    const [nomeproduto, setNomeProduto] = useState("")
    const [precoproduto, setPrecoProduto] = useState("")
    const [categoriaproduto, setCategoriaProduto] = useState("")
    const [fornecedorNome, setFornecedorNome] = useState("")
    const [fornecedor_idfornecedor, setFornecedorIdFornecedor]= useState("")
    const [produto, setProduto] = useState<ProdutoState[]>([])
    const [fornecedores, setFornecedores] = useState<FornecedorState[]>([])
    const [mensagem, setMensagem] = useState("")
    useEffect(() => {
        const buscaDados = async () => {
            try {
                const resultado = await fetch("http://localhost:8000/produto")
                if (resultado.status === 200) {
                    const dados = await resultado.json()
                    setProduto(dados)
                }
                if (resultado.status === 400) {
                    const erro = await resultado.json()
                    setMensagem(erro.mensagem)
                }
            } catch (erro) {
                setMensagem("Fetch não functiona")
            }
        }
        const buscaFornecedores = async () => {
            try {
                const resultado = await fetch("http://localhost:8000/fornecedor")
                if (resultado.status === 200) {
                    const dados = await resultado.json()
                    setFornecedores(dados)
                }
            } catch (erro) {
                // Não faz nada
            }
        }
        buscaDados()
        buscaFornecedores()
    }, [])
    
    async function excluirProduto(id: number) {
        try {
            const resposta = await fetch(`http://localhost:8000/produto/${id}`, {
                method: "DELETE"
            })
            const dados = await resposta.json()
            if (resposta.status === 200) {
                setProduto(produto.filter(p => p.idproduto !== id))
                setMensagem(dados.mensagem)
            } else {
                setMensagem(dados.mensagem)
            }
        } catch (erro) {
            setMensagem("Erro ao tentar excluir o produto.")
        }
    }

    // Estado para edição
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [editId, setEditId] = useState("");
    const [editNome, setEditNome] = useState("");
    const [editPreco, setEditPreco] = useState("");
    const [editCategoria, setEditCategoria] = useState("");
    const [editFornecedorNome, setEditFornecedorNome] = useState("");

    function iniciarEdicao(p: ProdutoState) {
        setEditandoId(p.idproduto);
        setEditId(p.idproduto.toString());
        setEditNome(p.nomeproduto);
        setEditPreco(p.precoproduto.toString());
        setEditCategoria(p.categoriaproduto);
        const fornecedor = fornecedores.find(f => f.idfornecedor === p.fornecedor_idfornecedor);
        setEditFornecedorNome(fornecedor ? fornecedor.nomefornecedor : "");
        setMensagem("");
    }

    function cancelarEdicao() {
        setEditandoId(null);
        setEditId("");
        setEditNome("");
        setEditPreco("");
        setEditCategoria("");
        setEditFornecedorNome("");
        setMensagem("");
    }

    async function salvarEdicao(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!editId || !editNome || !editPreco || !editCategoria || !editFornecedorNome) {
            setMensagem('Todos os campos devem ser preenchidos para atualizar.');
            return;
        }
        const fornecedorEncontrado = fornecedores.find(f => f.nomefornecedor.toLowerCase() === editFornecedorNome.toLowerCase());
        if (!fornecedorEncontrado) {
            setMensagem("Fornecedor não encontrado!");
            return;
        }
        const produtoAtualizado: ProdutoState = {
            idproduto: parseInt(editId),
            nomeproduto: editNome,
            precoproduto: parseFloat(editPreco),
            categoriaproduto: editCategoria,
            fornecedor_idfornecedor: fornecedorEncontrado.idfornecedor
        };
        try {
            const resposta = await fetch(`http://localhost:8000/produto/${editandoId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(produtoAtualizado)
            });
            const dados = await resposta.json();
            if (resposta.status === 200) {
                setProduto(produto.map(p => p.idproduto === editandoId ? produtoAtualizado : p));
                setMensagem(dados.mensagem || 'Produto atualizado com sucesso!');
                cancelarEdicao();
            } else {
                setMensagem(dados.mensagem || 'Erro ao atualizar produto.');
            }
        } catch (erro) {
            setMensagem('Erro ao tentar atualizar o produto.');
        }
    }

    async function TrataCadastro(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        // Buscar o fornecedor pelo nome
        const fornecedorEncontrado = fornecedores.find(f => f.nomefornecedor.toLowerCase() === fornecedorNome.toLowerCase())
        if (!fornecedorEncontrado) {
            setMensagem("Fornecedor não encontrado!")
            return
        }
        setFornecedorIdFornecedor(fornecedorEncontrado.idfornecedor.toString())
        //Criar um novo produto
        const novoProduto: ProdutoState = {
            idproduto: parseInt(idproduto),
            nomeproduto: nomeproduto,
            precoproduto: parseFloat(precoproduto),
            categoriaproduto: categoriaproduto,
            fornecedor_idfornecedor: fornecedorEncontrado.idfornecedor
        }
        try {
            const resposta = await fetch("http://localhost:8000/produto", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(novoProduto)
            })
            if (resposta.status === 200) {
                const dados = await resposta.json()
                setProduto([...produto, dados])
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
    function trataId(event: React.ChangeEvent<HTMLInputElement>) {
        setIdProduto(event.target.value)
    }
    function trataNome(event: React.ChangeEvent<HTMLInputElement>) {
        setNomeProduto(event.target.value)
    }
    function trataPreco(event: React.ChangeEvent<HTMLInputElement>) {
        setPrecoProduto(event.target.value)
    }
    function trataCategoria(event: React.ChangeEvent<HTMLInputElement>) {
        setCategoriaProduto(event.target.value)
    }
    function trataFornecedorNome(event: React.ChangeEvent<HTMLInputElement>) {
        setFornecedorNome(event.target.value)
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
                    {produto.map(produto => (
                        <div className="produto-container" key={produto.idproduto}>
                            {editandoId === produto.idproduto ? (
                                <form className="form-edicao" onSubmit={salvarEdicao} style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                                    <input type="number" value={editId} onChange={e => setEditId(e.target.value)} placeholder="Id" style={{width: '60px'}} />
                                    <input type="text" value={editNome} onChange={e => setEditNome(e.target.value)} placeholder="Nome" />
                                    <input type="number" value={editPreco} onChange={e => setEditPreco(e.target.value)} placeholder="Preço" />
                                    <input type="text" value={editCategoria} onChange={e => setEditCategoria(e.target.value)} placeholder="Categoria" />
                                    <select value={editFornecedorNome} onChange={e => setEditFornecedorNome(e.target.value)} required>
                                        <option value="">Selecione o Fornecedor</option>
                                        {fornecedores.map(f => (
                                            <option key={f.idfornecedor} value={f.nomefornecedor}>{f.nomefornecedor}</option>
                                        ))}
                                    </select>
                                    <button type="submit">Salvar</button>
                                    <button type="button" onClick={cancelarEdicao}>Cancelar</button>
                                </form>
                            ) : (
                                <>
                                    <div className="produto-id">{produto.idproduto}</div>
                                    <div className="produto-nome">{produto.nomeproduto}</div>
                                    <div className="produto-preco">{produto.precoproduto}</div>
                                    <div className="produto-categoria">{produto.categoriaproduto}</div>
                                    <div className="produto-fornecedor">{produto.fornecedor_idfornecedor}</div>
                                    <button onClick={() => iniciarEdicao(produto)}>Editar</button>
                                    <button onClick={() => excluirProduto(produto.idproduto)}>Excluir</button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
                <div className="container-cadastro">
                    <form onSubmit={TrataCadastro}>
                        <input type="number" name="id" id="id" onChange={trataId} placeholder="Id" />
                        <input type="text" name="nome" id="nome" onChange={trataNome} placeholder="Nome" />
                        <input type="number" name="preco" id="preco" onChange={trataPreco} placeholder="Preço" />
                        <input type="text" name="categoria" id="categoria" onChange={trataCategoria} placeholder="Categoria" />
                        <select
                            name="fornecedorNome"
                            id="fornecedorNome"
                            onChange={e => setFornecedorNome(e.target.value)}
                            value={fornecedorNome}
                            required
                        >
                            <option value="">Selecione o Fornecedor</option>
                            {fornecedores.map(f => (
                                <option key={f.idfornecedor} value={f.nomefornecedor}>
                                    {f.nomefornecedor}
                                </option>
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

export default Produto