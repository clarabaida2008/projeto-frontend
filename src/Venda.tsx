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
    function trataFuncionarioNome(event: React.ChangeEvent<HTMLInputElement>) {
        setFuncionarioNome(event.target.value)
    }
    function trataProdutoNome(event: React.ChangeEvent<HTMLInputElement>) {
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
                                <div className="venda-produto">
                                    {venda.produto_idproduto}
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
                        <input type="text" name="funcionarioNome" id="funcionarioNome" onChange={trataFuncionarioNome} placeholder="Nome do Funcionário" value={funcionarioNome} />
                        <input type="text" name="produtoNome" id="produtoNome" onChange={trataProdutoNome} placeholder="Nome do Produto" value={produtoNome} />
                        <input type="submit" value="Cadastrar" />
                    </form>
                    {/* Sugestão de nomes de funcionários e produtos */}
                    {funcionarios.length > 0 && (
                        <div style={{ marginTop: '10px', fontSize: '0.9em' }}>
                            <strong>Funcionários cadastrados:</strong> {funcionarios.map(f => f.nomefuncionario).join(", ")}
                        </div>
                    )}
                    {produtos.length > 0 && (
                        <div style={{ marginTop: '10px', fontSize: '0.9em' }}>
                            <strong>Produtos cadastrados:</strong> {produtos.map(p => p.nomeproduto).join(", ")}
                        </div>
                    )}
                </div>
            </main>
            <footer></footer>
        </>
    )
}

export default Venda