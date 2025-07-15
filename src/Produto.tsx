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
    const [fornecedor_idfornecedor, setFornecedorIdFornecedor] = useState("")
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
                setMensagem("⚠️ERRO AO CONECTAR COM O SERVIDOR")
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
            setMensagem("⚠️ERRO AO EXCLUIR")
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

    function validarEdicao() {
        if (!editId || !editNome || !editCategoria || !editPreco || !editFornecedorNome) {
            setMensagem('⚠️TODOS OS CAMPOS DEVEM SER PREENCHIDOS PARA ATUALIZAÇÃO')
            return false
        }

        if (isNaN(Number(editId))) {
            setMensagem('⚠️ID DEVE SER UM NÚMERO')
            return false
        }

        if (isNaN(Number(editPreco))) {
            setMensagem('⚠️PREÇO DEVE SER UM NÚMERO')
            return false
        }

        const contemNumero = /[0-9]/.test(editCategoria)
        if (contemNumero) {
            setMensagem("⚠️CATEGORIA NÃO PODE CONTER NÚMEROS")
            return false
        }

        return true
    }

    async function salvarEdicao(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!validarEdicao()) {
            return
        }

        const fornecedorEncontrado = fornecedores.find(f => f.nomefornecedor.toLowerCase() === editFornecedorNome.toLowerCase())
        if (!fornecedorEncontrado) {
            setMensagem("⚠️FORNECEDOR NÃO ENCONTRADO")
            return
        }

        const produtoAtualizado: ProdutoState = {
            idproduto: parseInt(editId),
            nomeproduto: editNome,
            precoproduto: parseFloat(editPreco),
            categoriaproduto: editCategoria,
            fornecedor_idfornecedor: fornecedorEncontrado.idfornecedor
        }

        try {
            const resposta = await fetch(`http://localhost:8000/produto/${editandoId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(produtoAtualizado)
            })
            const dados = await resposta.json()
            if (resposta.status === 200) {
                setProduto(produto.map(p => p.idproduto === editandoId ? produtoAtualizado : p))
                setMensagem(dados.mensagem || '✅PRODUTO ATUALIZADO COM SUCESSO!')
                cancelarEdicao()
            } else {
                setMensagem(dados.mensagem || '⚠️ERRO AO ATUALIZAR')
            }
        } catch (erro) {
            setMensagem('⚠️ERRO AO ATUALIZAR')
        }
    }

    function validarCampos() {
        if (!idproduto || !nomeproduto || !precoproduto || !categoriaproduto || !fornecedorNome) {
            setMensagem("⚠️TODOS OS CAMPOS DEVEM SER PREENCHIDOS")
            return false
        }

        if (isNaN(Number(idproduto))) {
            setMensagem("⚠️O ID DEVE SER UM NÚMERO")
            return false
        }

        if (isNaN(Number(precoproduto))) {
            setMensagem("⚠️PREÇO DEVE SER UM NÚMERO")
            return false
        }

        const contemNumero = /[0-9]/.test(categoriaproduto)
        if (contemNumero) {
            setMensagem("⚠️CATEGORIA NÃO PODE CONTER NÚMEROS")
            return false
        }

        return true
    }

    async function TrataCadastro(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!validarCampos()) {
            return
        }

        const fornecedorEncontrado = fornecedores.find(f => f.nomefornecedor.toLowerCase() === fornecedorNome.toLowerCase())
        if (!fornecedorEncontrado) {
            setMensagem("⚠️FORNECEDOR NÃO ENCONTRADO!")
            return
        }

        setFornecedorIdFornecedor(fornecedorEncontrado.idfornecedor.toString())

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
                setIdProduto("")
                setNomeProduto("")
                setPrecoProduto("")
                setCategoriaProduto("")
                setFornecedorNome("")
                setMensagem("✅PRODUTO CADASTRADO COM SUCESSO!")
            }
            if (resposta.status === 400) {
                const erro = await resposta.json()
                setMensagem(erro.mensagem)
            }
        } catch (erro) {
            setMensagem("⚠️ERRO AO CONECTAR COM O SERVIDOR")
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
    function trataFornecedorNome(event: React.ChangeEvent<HTMLSelectElement>) {
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
                                <form className="form-edicao" onSubmit={salvarEdicao} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <input type="number" value={editId} onChange={e => setEditId(e.target.value)} placeholder="Id" style={{ width: '60px' }} />
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
                        <input type="number" name="id" id="id" onChange={trataId} placeholder="Id" value={idproduto} />
                        <input type="text" name="nome" id="nome" onChange={trataNome} placeholder="Nome" value={nomeproduto} />
                        <input type="number" name="preco" id="preco" onChange={trataPreco} placeholder="Preço" value={precoproduto} />
                        <input type="text" name="categoria" id="categoria" onChange={trataCategoria} placeholder="Categoria" value={categoriaproduto} />
                        <select
                            name="fornecedorNome"
                            id="fornecedorNome"
                            onChange={trataFornecedorNome}
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
