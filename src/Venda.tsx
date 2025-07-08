import { useEffect, useState } from "react"
interface VendaState {
    idvenda: number,
    datavenda: string,
    valorvenda: number,
    formapagamentovenda: string,
    funcionario_idfuncionario: number
}

function Venda() {
    const [idvenda, setIdVenda] = useState("")
    const [datavenda, setDataVenda] = useState("")
    const [valorvenda, setValorVenda] = useState("")
    const [formapagamentovenda, setFormaPagamentoVenda] = useState("")
    const [funcionario_idfuncionario, setFuncionarioIdFuncionario]= useState("")
    const [venda, setVenda] = useState<VendaState[]>([])
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
        const novaVenda: VendaState = {
            idvenda: parseInt(idvenda),
            datavenda: datavenda,
            valorvenda: parseFloat(valorvenda),
            formapagamentovenda: formapagamentovenda,
            funcionario_idfuncionario: parseInt (funcionario_idfuncionario)
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
    function trataFuncionarioIdFuncionario(event: React.ChangeEvent<HTMLInputElement>) {
        setFuncionarioIdFuncionario(event.target.value)
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
                    {venda.map(venda => {
                        return (
                            <div className="venda-container">
                                <div className="venda-id">
                                    {venda.idvenda}
                                </div>
                                <div className="venda-data">
                                    {venda.datavenda}
                                </div>
                                <div className="venda-valor">
                                    {venda.valorvenda}
                                </div>
                                <div className="venda-pagamento">
                                    {venda.formapagamentovenda}
                                </div>
                                <div className="venda-funcionario">
                                    {venda.funcionario_idfuncionario}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="container-cadastro">
                    <form onSubmit={TrataCadastro}>
                        <input type="number" name="id" id="id" onChange={trataIdVenda} placeholder="Id" />
                        <input type="number" name="data" id="data" onChange={trataDataVenda} placeholder="Data" />
                        <input type="number" name="valor" id="valor" onChange={trataValorVenda} placeholder="Valor" />
                        <input type="text" name="pagamento" id="pagamento" onChange={trataFormaPagamentoVenda} placeholder="Pagamento" />
                        <input type="number" name="funcionario" id="funcionario" onChange={trataFuncionarioIdFuncionario} placeholder="Id Funcionário" />
                        <input type="submit" value="Cadastrar" />
                    </form>

                </div>
            </main>
            <footer></footer>
        </>
    )
}

export default Venda