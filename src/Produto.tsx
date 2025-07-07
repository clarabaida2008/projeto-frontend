import { useEffect, useState } from "react"
import './Produto.css'
interface ProdutoState {
    idproduto: number,
    nomeproduto: string,
    precoproduto: number,
    categoriaproduto: string
}

function Produto() {
    const [idproduto, setIdProduto] = useState("")
    const [nomeproduto, setNomeProduto] = useState("")
    const [precoproduto, setPrecoProduto] = useState("")
    const [categoriaproduto, setCategoriaProduto] = useState("")
    const [mensagem, setMensagem] = useState("")
    const [produto, setProduto] = useState<ProdutoState[]>([])
    useEffect(() => {
        const buscaDados = async () => {
            try {
                const resultado = await fetch("http://localhost:8000/produtos")
                if (resultado.status === 200) {
                    const dados = await resultado.json()
                    setProduto(dados)
                }
                if (resultado.status === 400) {
                    const erro = await resultado.json()
                    setMensagem(erro.mensagem)
                    //console.log(erro.mensagem)
                }
            }
            catch (erro) {
                setMensagem("Fetch não functiona")
            }
        }
        buscaDados()
    }, [])// [] => significa as dependências do useEffects
    async function TrataCadastro(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        //Criar um novo produto
        const novoProduto: ProdutoState = {
            idproduto: parseInt(idproduto),
            nomeproduto: nomeproduto,
            precoproduto: parseFloat(precoproduto),
            categoriaproduto: categoriaproduto
        }
        try {
            const resposta = await fetch("http://localhost:8000/produtos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(novoProduto)
            })
           
            if (resposta.status === 200) {
                const dados = await resposta.json()
                setProduto([...produto, dados])
            }
            if (resposta.status === 400) {
                const erro = await resposta.json()
                setMensagem(erro.mensagem)
                //console.log(erro.mensagem)
            }
            
        }
        catch (erro) {
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
    return (
        <>
            <header>
                <div>Logo</div>
                <nav>
                    <ul>
                        <li>
                            <a href="">Home</a>
                        </li>
                        <li>
                            <a href="">Home</a>
                        </li>
                        <li>
                            <a href="">Home</a>
                        </li>
                        <li>
                            <a href="">Home</a>
                        </li>
                    </ul>
                </nav>
            </header>
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
                        <input type="submit" value="Cadastrar" />
                    </form>

                </div>
            </main>
            <footer></footer>
        </>
    )
}

export default Produto