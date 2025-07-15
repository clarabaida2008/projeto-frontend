import './Venda.css'
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
    // Estados para os campos do formulário de cadastro
    const [idvenda, setIdVenda] = useState("")
    const [datavenda, setDataVenda] = useState("")
    const [valorvenda, setValorVenda] = useState("")
    const [formapagamentovenda, setFormaPagamentoVenda] = useState("")
    const [funcionarioNome, setFuncionarioNome] = useState("")
    const [produtoNome, setProdutoNome] = useState("")
    const [funcionario_idfuncionario, setFuncionarioIdFuncionario] = useState("")
    const [produto_idproduto, setProdutoIdProduto] = useState("")
    const [mensagem, setMensagem] = useState("")

    // Estados para listagem
    const [venda, setVenda] = useState<VendaState[]>([])
    const [funcionarios, setFuncionarios] = useState<FuncionarioState[]>([])
    const [produtos, setProdutos] = useState<ProdutoState[]>([])

    // Estado para controle de edição
    const [editandoId, setEditandoId] = useState<number | null>(null)
    const [editId, setEditId] = useState("")
    const [editData, setEditData] = useState("")
    const [editValor, setEditValor] = useState("")
    const [editPagamento, setEditPagamento] = useState("")
    const [editFuncionarioNome, setEditFuncionarioNome] = useState("")
    const [editProdutoNome, setEditProdutoNome] = useState("")

    // Carregar dados do backend
    useEffect(() => {
        const buscaDados = async () => {
            try {
                const resultado = await fetch("http://localhost:8000/venda")
                if (resultado.status === 200) {
                    const dados = await resultado.json()
                    setVenda(dados)
                } else if (resultado.status === 400) {
                    const erro = await resultado.json()
                    setMensagem(erro.mensagem)
                }
            } catch (erro) {
                setMensagem("⚠️ERRO AO CONECTAR COM O SERVIDOR")
            }
        }

        const buscaFuncionarios = async () => {
            try {
                const resultado = await fetch("http://localhost:8000/funcionario")
                if (resultado.status === 200) {
                    const dados = await resultado.json()
                    setFuncionarios(dados)
                }
            } catch {}
        }

        const buscaProdutos = async () => {
            try {
                const resultado = await fetch("http://localhost:8000/produto")
                if (resultado.status === 200) {
                    const dados = await resultado.json()
                    setProdutos(dados)
                }
            } catch {}
        }

        buscaDados()
        buscaFuncionarios()
        buscaProdutos()
    }, [])

    // Validação de campos
    function validarCampos() {
        if (!idvenda || !datavenda || !valorvenda || !formapagamentovenda || !funcionarioNome || !produtoNome) {
            setMensagem("⚠️TODOS OS CAMPOS DEVEM SER PREENCHIDOS")
            return false
        }
        if (isNaN(Number(idvenda))) {
            setMensagem("⚠️ID DEVE SER UM NÚMERO")
            return false
        }
        if (isNaN(Number(valorvenda))) {
            setMensagem("⚠️VALOR DEVE SER UM NÚMERO")
            return false
        }
        return true
    }

    async function TrataCadastro(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!validarCampos()) return

        const funcionarioEncontrado = funcionarios.find(f => f.nomefuncionario.toLowerCase() === funcionarioNome.toLowerCase())
        if (!funcionarioEncontrado) {
            setMensagem("⚠️FUNCIONÁRIO NÃO ENCONTRADO")
            return
        }

        const produtoEncontrado = produtos.find(p => p.nomeproduto.toLowerCase() === produtoNome.toLowerCase())
        if (!produtoEncontrado) {
            setMensagem("⚠️PRODUTO NÃO ENCONTRADO")
            return
        }

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
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(novaVenda)
            })

            if (resposta.status === 200) {
                const dados = await resposta.json()
                setVenda([...venda, dados])
                setMensagem("✅VENDA CADASTRADA COM SUCESSO!")
                setIdVenda("")
                setDataVenda("")
                setValorVenda("")
                setFormaPagamentoVenda("")
                setFuncionarioNome("")
                setProdutoNome("")
            } else if (resposta.status === 400) {
                const erro = await resposta.json()
                setMensagem(erro.mensagem)
            }
        } catch (erro) {
            setMensagem("⚠️ERRO AO CONECTAR COM O SERVIDOR")
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
                setMensagem(dados.mensagem || "✅VENDA EXCLUÍDA COM SUCESSO!")
            } else {
                setMensagem(dados.mensagem || "⚠️ERRO AO EXCLUIR")
            }
        } catch (erro) {
            setMensagem("⚠️ERRO AO EXCLUIR")
        }
    }

    function iniciarEdicao(v: VendaState) {
        setEditandoId(v.idvenda)
        setEditId(v.idvenda.toString())
        setEditData(v.datavenda)
        setEditValor(v.valorvenda.toString())
        setEditPagamento(v.formapagamentovenda)
        const funcionario = funcionarios.find(f => f.idfuncionario === v.funcionario_idfuncionario)
        const produto = produtos.find(p => p.idproduto === v.produto_idproduto)
        setEditFuncionarioNome(funcionario ? funcionario.nomefuncionario : "")
        setEditProdutoNome(produto ? produto.nomeproduto : "")
        setMensagem("")
    }

    function cancelarEdicao() {
        setEditandoId(null)
        setEditId("")
        setEditData("")
        setEditValor("")
        setEditPagamento("")
        setEditFuncionarioNome("")
        setEditProdutoNome("")
        setMensagem("")
    }

    async function salvarEdicao(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!editId || !editData || !editValor || !editPagamento || !editFuncionarioNome || !editProdutoNome) {
            setMensagem("⚠️TODOS OS CAMPOS DEVEM SER PREENCHIDOS")
            return
        }

        const funcionario = funcionarios.find(f => f.nomefuncionario.toLowerCase() === editFuncionarioNome.toLowerCase())
        const produto = produtos.find(p => p.nomeproduto.toLowerCase() === editProdutoNome.toLowerCase())

        if (!funcionario || !produto) {
            setMensagem("⚠️FUNCIONÁRIO OU PRODUTO INVÁLIDO")
            return
        }

        const vendaAtualizada: VendaState = {
            idvenda: parseInt(editId),
            datavenda: editData,
            valorvenda: parseFloat(editValor),
            formapagamentovenda: editPagamento,
            funcionario_idfuncionario: funcionario.idfuncionario,
            produto_idproduto: produto.idproduto
        }

        try {
            const resposta = await fetch(`http://localhost:8000/venda/${editandoId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(vendaAtualizada)
            })

            const dados = await resposta.json()
            if (resposta.status === 200) {
                setVenda(venda.map(v => v.idvenda === editandoId ? vendaAtualizada : v))
                setMensagem(dados.mensagem || "✅VENDA ATUALIZADA COM SUCESSO!")
                cancelarEdicao()
            } else {
                setMensagem(dados.mensagem || "⚠️ERRO AO ATUALIZAR")
            }
        } catch (erro) {
            setMensagem("⚠️ERRO AO ATUALIZAR")
        }
    }

    return (
        <>
            <main>
                {mensagem && <div className="mensagem"><p>{mensagem}</p></div>}

                <div className="container-listagem">
                    {venda.map(v => (
                        <div className="venda-container" key={v.idvenda}>
                            {editandoId === v.idvenda ? (
                                <form className="form-edicao" onSubmit={salvarEdicao} style={{ display: 'flex', gap: '8px' }}>
                                    <input type="number" value={editId} onChange={e => setEditId(e.target.value)} placeholder="Id" style={{ width: '60px' }} />
                                    <input type="date" value={editData} onChange={e => setEditData(e.target.value)} />
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
                                    <div className="venda-id">{v.idvenda}</div>
                                    <div className="venda-data">{v.datavenda}</div>
                                    <div className="venda-valor">{v.valorvenda}</div>
                                    <div className="venda-pagamento">{v.formapagamentovenda}</div>
                                    <div className="venda-funcionario">{v.funcionario_idfuncionario}</div>
                                    <div className="venda-produto">{v.produto_idproduto}</div>
                                    <button onClick={() => iniciarEdicao(v)}>Editar</button>
                                    <button onClick={() => excluirVenda(v.idvenda)}>Excluir</button>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                <div className="container-cadastro">
                    <form onSubmit={TrataCadastro}>
                        <input type="number" onChange={e => setIdVenda(e.target.value)} placeholder="Id" value={idvenda} />
                        <input type="date" onChange={e => setDataVenda(e.target.value)} value={datavenda} />
                        <input type="number" onChange={e => setValorVenda(e.target.value)} placeholder="Valor" value={valorvenda} />
                        <input type="text" onChange={e => setFormaPagamentoVenda(e.target.value)} placeholder="Forma de Pagamento" value={formapagamentovenda} />
                        <select onChange={e => setFuncionarioNome(e.target.value)} value={funcionarioNome} required>
                            <option value="">Selecione o Funcionário</option>
                            {funcionarios.map(f => (
                                <option key={f.idfuncionario} value={f.nomefuncionario}>{f.nomefuncionario}</option>
                            ))}
                        </select>
                        <select onChange={e => setProdutoNome(e.target.value)} value={produtoNome} required>
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
