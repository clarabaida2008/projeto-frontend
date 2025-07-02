import { useEffect, useState } from "react"
import './Funcionario.css'
interface FuncionarioState {
    idfuncionario: number,
    nomefuncionario: string,
    funcaofuncionario: string,
    cpffuncionario: number
}

function Funcionario() {
    const [idfuncionario, setIdFuncionario] = useState("")
    const [nomefuncionario, setNomeFuncionario] = useState("")
    const [funcaofuncionario, setCnpjFuncionario] = useState("")
    const [cpffuncionario, setCpfFuncionario] = useState("")
    const [mensagem, setMensagem] = useState("")
    const [Funcionario, setFuncionario] = useState<FuncionarioState[]>([])
    useEffect(() => {
        const buscaDados = async () => {
            try {
                const resultado = await fetch("http://localhost:8000/funcionario")
                if (resultado.status === 200) {
                    const dados = await resultado.json()
                    setFuncionario(dados)
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
        const novoProduto: FuncionarioState = {
            idFuncionario: parseInt(idfuncionario),
            nomeFuncionario: nomefuncionario,
           funcaofuncionario: funcaofuncionario,
           cpffuncionario: parseInt(cpffuncionario)
        }
        try {
            const resposta = await fetch("http://localhost:8000/funcionario", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(novofuncionario)
            })
           
            if (resposta.status === 200) {
                const dados = await resposta.json()
                setFuncionario([...Funcionario, dados])
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
        setId(event.target.value)
    }
    function trataNome(event: React.ChangeEvent<HTMLInputElement>) {
        setNome(event.target.value)
    }
    function trata(event: React.ChangeEvent<HTMLInputElement>) {
        setPreco(event.target.value)
    }
    function trataCategoria(event: React.ChangeEvent<HTMLInputElement>) {
        setCategoria(event.target.value)
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
                    {produtos.map(produto => {
                        return (
                            <div className="produto-container">
                                <div className="produto-nome">
                                    {produto.nome}
                                </div>
                                <div className="produto-preco">
                                    {produto.preco}
                                </div>
                                <div className="produto-categoria">
                                    {produto.categoria}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="container-cadastro">
                    <form onSubmit={TrataCadastro}>
                        <input type="text" name="id" id="id" onChange={trataId} placeholder="Id" />
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

export default Pagina