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
            // Remove da lista
            setProduto(produto.filter(p => p.idproduto !== id))
            setMensagem(dados.mensagem)
        } else {
            setMensagem(dados.mensagem)
        }
    } catch (erro) {
        setMensagem("Erro ao tentar excluir o produto.")
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
                    {produto.map(produto => {
                        return (
                            <div className="produto-container">
                                <div className="produto-id">
                                    {produto.idproduto}
                                </div>
                                <div className="produto-nome">
                                    {produto.nomeproduto}
                                </div>
                                <div className="produto-preco">
                                    {produto.precoproduto}
                                </div>
                                <div className="produto-categoria">
                                    {produto.categoriaproduto}
                                </div>
                                <div className="produto-fornecedor">
                                    {produto.fornecedor_idfornecedor}
                                </div>
                               <button onClick={() => excluirProduto(produto.idproduto)}>Excluir</button>
                            </div>
                        )
                    })}
                </div>
                <div className="container-cadastro">
                    <form onSubmit={TrataCadastro}>
                        <input type="number" name="id" id="id" onChange={trataId} placeholder="Id" />
                        <input type="text" name="nome" id="nome" onChange={trataNome} placeholder="Nome" />
                        <input type="number" name="preco" id="preco" onChange={trataPreco} placeholder="Preço" />
                        <input type="text" name="categoria" id="categoria" onChange={trataCategoria} placeholder="Categoria" />
                        <input type="text" name="fornecedorNome" id="fornecedorNome" onChange={trataFornecedorNome} placeholder="Nome do Fornecedor" value={fornecedorNome} />
                        <input type="submit" value="Cadastrar" />
                    </form>
                    {/* Sugestão de nomes de fornecedores */}
                    {fornecedores.length > 0 && (
                        <div style={{ marginTop: '10px', fontSize: '0.9em' }}>
                            <strong>Fornecedores cadastrados:</strong> {fornecedores.map(f => f.nomefornecedor).join(", ")}
                        </div>
                    )}
                </div>
            </main>
            <footer></footer>
        </>
    )
}

export default Produto


