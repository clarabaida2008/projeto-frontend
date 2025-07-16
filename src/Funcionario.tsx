import './Funcionario.css';
import { useEffect, useState } from "react"

// Interface que define a estrutura de um funcionário
interface FuncionarioState {
    idfuncionario: number,
    nomefuncionario: string,
    funcaofuncionario: string,
    cpf: number
}

function Funcionario() {
    // Estados para os campos do formulário
    const [idfuncionario, setIdFuncionario] = useState("")
    const [nomefuncionario, setNomeFuncionario] = useState("")
    const [funcaofuncionario, setFuncaoFuncionario] = useState("")
    const [cpf, setCpf] = useState("")
    const [mensagem, setMensagem] = useState("")
    const [funcionario, setFuncionario] = useState<FuncionarioState[]>([])

    // Estados para controlar a edição
    const [editandoId, setEditandoId] = useState<number | null>(null)
    const [editId, setEditId] = useState("")
    const [editNome, setEditNome] = useState("")
    const [editFuncao, setEditFuncao] = useState("")
    const [editCpf, setEditCpf] = useState("")

    // Efeito para buscar os funcionários ao carregar o componente
    useEffect(() => {
        const buscaDados = async () => {
            try {
                const resultado = await fetch("http://localhost:8000/funcionario")
                if (resultado.status === 200) {
                    const dados = await resultado.json()
                    setFuncionario(dados)
                } else if (resultado.status === 400) {
                    const erro = await resultado.json()
                    setMensagem(erro.mensagem)
                }
            } catch (erro) {
                setMensagem("⚠️ERRO AO CONECTAR COM O SERVIDOR")
            }
        }
        buscaDados()
    }, [])

    // Função para validar os campos antes do cadastro
    function validarCampos() {
        // Verifica se todos os campos estão preenchidos
        if (!idfuncionario || !nomefuncionario || !funcaofuncionario || !cpf) {
            setMensagem("⚠️TODOS OS CAMPOS DEVEM SER PREENCHIDOS")
            return false
        }

        // Verifica se o ID é um número
        if (isNaN(Number(idfuncionario))) {
            setMensagem("⚠️O ID DEVE SER UM NÚMERO")
            return false
        }

        // Verifica se o CPF é um número
        if (isNaN(Number(cpf))) {
            setMensagem("⚠️CPF DEVE SER UM NÚMERO")
            return false
        }

        // Verifica se o nome não contém números
        const contemNumero = /[0-9]/.test(nomefuncionario)
        if (contemNumero) {
            setMensagem("⚠️NOME NÃO PODE CONTER NÚMEROS")
            return false
        }

        // Verifica se a função não contém números
        const contemNumero2 = /[0-9]/.test(funcaofuncionario)
        if (contemNumero2) {
            setMensagem("⚠️FUNÇÃO NÃO PODE CONTER NÚMEROS")
            return false
        }
        

        return true
    }

    // Função para tratar o cadastro de um novo funcionário
    async function TrataCadastro(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        // Valida os campos antes de prosseguir
        if (!validarCampos()) {
            return
        }

        const novoFuncionario: FuncionarioState = {
            idfuncionario: parseInt(idfuncionario),
            nomefuncionario: nomefuncionario,
            funcaofuncionario: funcaofuncionario,
            cpf: parseInt(cpf)
        }

        try {
            const resposta = await fetch("http://localhost:8000/funcionario", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(novoFuncionario)
            })

            if (resposta.status === 200) {
                const dados = await resposta.json()
                setFuncionario([...funcionario, dados])
                // Limpa os campos após cadastro bem-sucedido
                setIdFuncionario("")
                setNomeFuncionario("")
                setFuncaoFuncionario("")
                setCpf("")
                setMensagem("✅FUNCIONÁRIO CADASTRADO COM SUCESSO!")
            } else if (resposta.status === 400) {
                const erro = await resposta.json()
                setMensagem(erro.mensagem)
            }
        } catch (erro) {
            setMensagem("⚠️ERRO AO CONECTAR COM O SERVIDOR")
        }
    }

    // Funções para tratar mudanças nos inputs do formulário
    function trataId(event: React.ChangeEvent<HTMLInputElement>) {
        setIdFuncionario(event.target.value)
    }
    function trataNome(event: React.ChangeEvent<HTMLInputElement>) {
        setNomeFuncionario(event.target.value)
    }
    function trataFuncao(event: React.ChangeEvent<HTMLInputElement>) {
        setFuncaoFuncionario(event.target.value)
    }
    function trataCpf(event: React.ChangeEvent<HTMLInputElement>) {
        setCpf(event.target.value)
    }

    // Função para excluir um funcionário
    async function excluirFuncionario(id: number) {
        try {
            const resposta = await fetch(`http://localhost:8000/funcionario/${id}`, {
                method: "DELETE"
            })
            const dados = await resposta.json()
            if (resposta.status === 200) {
                setFuncionario(funcionario.filter(f => f.idfuncionario !== id))
                setMensagem(dados.mensagem || "✅FUNCIONÁRIO EXCLUÍDO COM SUCESSO!")
            } else {
                setMensagem(dados.mensagem || "⚠️ERRO AO EXCLUIR FUNCIONÁRIO")
            }
        } catch (erro) {
            setMensagem("⚠️ERRO AO EXCLUIR FUNCIONÁRIO")
        }
    }

    // Função para iniciar a edição de um funcionário
    function iniciarEdicao(f: FuncionarioState) {
        setEditandoId(f.idfuncionario)
        setEditId(f.idfuncionario.toString())
        setEditNome(f.nomefuncionario)
        setEditFuncao(f.funcaofuncionario)
        setEditCpf(f.cpf.toString())
        setMensagem("")
    }

    // Função para cancelar a edição
    function cancelarEdicao() {
        setEditandoId(null)
        setEditId("")
        setEditNome("")
        setEditFuncao("")
        setEditCpf("")
        setMensagem("")
    }

    // Função para validar os campos durante a edição
    function validarEdicao() {
        if (!editId || !editNome || !editFuncao || !editCpf) {
            setMensagem('⚠️TODOS OS CAMPOS DEVEM SER PREENCHIDOS PARA ATUALIZAÇÃO')
            return false
        }

        if (isNaN(Number(editId))) {
            setMensagem('⚠️ID DEVE SER UM NÚMERO')
            return false
        }

        if (isNaN(Number(editCpf))) {
            setMensagem('⚠️CPF DEVE SER UM NÚMERO')
            return false
        }

        const contemNumero = /[0-9]/.test(editNome)
        if (contemNumero) {
            setMensagem("⚠️NOME NÃO PODE CONTER NÚMEROS")
            return false
        }

        const contemNumero2 = /[0-9]/.test(editFuncao)
        if (contemNumero2) {
            setMensagem("⚠️FUNÇÃO NÃO PODE CONTER NÚMEROS")
            return false
        }

        return true
    }

    // Função para salvar as alterações de um funcionário editado
    async function salvarEdicao(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        // Valida os campos antes de prosseguir
        if (!validarEdicao()) {
            return
        }

        const funcionarioAtualizado: FuncionarioState = {
            idfuncionario: parseInt(editId),
            nomefuncionario: editNome,
            funcaofuncionario: editFuncao,
            cpf: parseInt(editCpf)
        }

        try {
            const resposta = await fetch(`http://localhost:8000/funcionario/${editandoId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(funcionarioAtualizado)
            })
            const dados = await resposta.json()
            if (resposta.status === 200) {
                setFuncionario(funcionario.map(f => f.idfuncionario === editandoId ? funcionarioAtualizado : f))
                setMensagem(dados.mensagem || '✅FUNCIONÁRIO ATUALIZADO COM SUCESSO!')
                cancelarEdicao()
            } else {
                setMensagem(dados.mensagem || '⚠️ERRO AO ATUALIZAR FUNCIONÁRIO')
            }
        } catch (erro) {
            setMensagem('⚠️ERRO AO ATUALIZAR FUNCIONÁRIO')
        }
    }

    // Renderização do componente
    return (
        <>
            <main>
                {/* Exibe mensagens de erro/sucesso */}
                {mensagem &&
                    <div className="mensagem">
                        <p>{mensagem}</p>
                    </div>
                }

                {/* Listagem de funcionários */}
                <div className="container-listagem">
                    {funcionario.map(f => (
                        <div className="funcionario-container" key={f.idfuncionario}>
                            {editandoId === f.idfuncionario ? (
                                // Formulário de edição
                                <form className="form-edicao" onSubmit={salvarEdicao} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <input type="number" value={editId} onChange={e => setEditId(e.target.value)} placeholder="Id" style={{ width: '60px' }} />
                                    <input type="text" value={editNome} onChange={e => setEditNome(e.target.value)} placeholder="Nome" />
                                    <input type="text" value={editFuncao} onChange={e => setEditFuncao(e.target.value)} placeholder="Função" />
                                    <input type="number" value={editCpf} onChange={e => setEditCpf(e.target.value)} placeholder="CPF" />
                                    <button type="submit">Salvar</button>
                                    <button type="button" onClick={cancelarEdicao}>Cancelar</button>
                                </form>
                            ) : (
                                // Exibição normal do funcionário
                                <>
                                    <div className="funcionario-id">{f.idfuncionario}</div>
                                    <div className="funcionario-nome">{f.nomefuncionario}</div>
                                    <div className="funcionario-funcao">{f.funcaofuncionario}</div>
                                    <div className="funcionario-cpf">{f.cpf}</div>
                                    <button onClick={() => iniciarEdicao(f)}>Editar</button>
                                    <button onClick={() => excluirFuncionario(f.idfuncionario)}>Excluir</button>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {/* Formulário de cadastro */}
                <div className="container-cadastro">
                    <form onSubmit={TrataCadastro}>
                        <input type="number" name="id" id="id" onChange={trataId} placeholder="Id" value={idfuncionario} />
                        <input type="text" name="nome" id="nome" onChange={trataNome} placeholder="Nome" value={nomefuncionario} />
                        <input type="text" name="funcao" id="funcao" onChange={trataFuncao} placeholder="Função" value={funcaofuncionario} />
                        <input type="number" name="cpf" id="cpf" onChange={trataCpf} placeholder="CPF" value={cpf} />
                        <input type="submit" value="Cadastrar" />
                    </form>
                </div>
            </main>
            <footer></footer>
        </>
    )
}

export default Funcionario