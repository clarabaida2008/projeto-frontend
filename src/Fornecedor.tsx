import { useEffect, useState } from "react"
import './Fornecedor.css'
interface FornecedorState {
    idfornecedor: number,
    nomefornecedor: string,
    cnpjfornecedor: number,
    cidadefornecedor: string
}

function Fornecedor() {
    const [idfornecedor, setIdFornecedor] = useState("")
    const [nomefornecedor, setNomeFornecedor] = useState("")
    const [cnpjfornecedor, setCnpjFornecedor] = useState("")
    const [cidadefornecedor, setCidadeFornecedor] = useState("")
    const [mensagem, setMensagem] = useState("")
    const [fornecedor, setFornecedor] = useState<FornecedorState[]>([])
    useEffect(() => {
        const buscaDados = async () => {
            try {
                const resultado = await fetch("http://localhost:8000/fornecedor")
                if (resultado.status === 200) {
                    const dados = await resultado.json()
                    setFornecedor(dados)
                }
                if (resultado.status === 400) {
                    const erro = await resultado.json()
                    setMensagem(erro.mensagem)
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
        //Criar um novo fornecedor
        const novoFornecedor: FornecedorState = {
            idfornecedor: parseInt(idfornecedor),
            nomefornecedor: nomefornecedor,
            cnpjfornecedor: parseInt(cnpjfornecedor),
            cidadefornecedor: cidadefornecedor
        }
        try {
            const resposta = await fetch("http://localhost:8000/fornecedor", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(novoFornecedor)
            })
           
            if (resposta.status === 200) {
                const dados = await resposta.json()
                setFornecedor([...fornecedor, dados])
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
    function trataIdFornecedor(event: React.ChangeEvent<HTMLInputElement>) {
        setIdFornecedor(event.target.value)
    }
    function trataNomeFornecedor(event: React.ChangeEvent<HTMLInputElement>) {
        setNomeFornecedor(event.target.value)
    }
    function trataCnpjFornecedor(event: React.ChangeEvent<HTMLInputElement>) {
        setCnpjFornecedor(event.target.value)
    }
    function trataCidadeFornecedor(event: React.ChangeEvent<HTMLInputElement>) {
        setCidadeFornecedor(event.target.value)
    }
    return (
        <>
            <header>
                <div>Mercadinho</div>
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
                    {fornecedor.map(fornecedor => {
                        return (
                            <div className="fornecedor-container">
                                <div className="fornecedor-id">
                                    {fornecedor.idfornecedor}
                                </div>
                                <div className="fornecedor-nome">
                                    {fornecedor.nomefornecedor}
                                </div>
                                <div className="fornecedor-cnpj">
                                    {fornecedor.cnpjfornecedor}
                                </div>
                                <div className="fornecedor-cidade">
                                    {fornecedor.cidadefornecedor}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="container-cadastro">
                    <form onSubmit={TrataCadastro}>
                        <input type="number" name="id" id="id" onChange={trataIdFornecedor} placeholder="Id" />
                        <input type="text" name="nome" id="nome" onChange={trataNomeFornecedor} placeholder="Nome" />
                        <input type="number" name="cnpj" id="cnpj" onChange={trataCnpjFornecedor} placeholder="CNPJ" />
                        <input type="text" name="cidade" id="cidade" onChange={trataCidadeFornecedor} placeholder="Cidade" />
                        <input type="submit" value="Cadastrar" />
                    </form>
                </div>
            </main>
            <footer></footer>
        </>
    )
}

export default Fornecedor