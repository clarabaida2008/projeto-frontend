import './Funcionario.css';
import { useEffect, useState } from "react"
interface FuncionarioState {
    idfuncionario: number,
    nomefuncionario: string,
    funcaofuncionario: string,
    cpf: number
}

function Funcionario() {
    const [idfuncionario, setIdFuncionario] = useState("")
    const [nomefuncionario, setNomeFuncionario] = useState("")
    const [funcaofuncionario, setFuncaoFuncionario] = useState("")
    const [cpf, setCpf] = useState("")
    const [mensagem, setMensagem] = useState("")
    const [funcionario, setFuncionario] = useState<FuncionarioState[]>([])
    const [editId, setEditId] = useState<number | null>(null)
    const [editData, setEditData] = useState({
        idfuncionario: "",
        nomefuncionario: "",
        funcaofuncionario: "",
        cpf: ""
    })

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
                setMensagem("Fetch não funciona");
            }
        }
        buscaDados()
    }, []);
        async function TrataCadastro(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
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
            });
            if (resposta.status === 200) {
                const dados = await resposta.json()
                setFuncionario([...funcionario, dados])
                setMensagem("Funcionário cadastrado com sucesso!")
            } else if (resposta.status === 400) {
                const erro = await resposta.json()
                setMensagem(erro.mensagem)
            }
        } catch (erro) {
            setMensagem("Fetch não funciona")
        }
    }

    async function excluirFuncionario(id: number) {
        try {
            const resposta = await fetch(`http://localhost:8000/funcionario/${id}`, {
                method: "DELETE"
            });
            const dados = await resposta.json();
            if (resposta.status === 200) {
                setFuncionario(funcionario.filter(f => f.idfuncionario !== id));
                setMensagem(dados.mensagem);
            } else {
                setMensagem(dados.mensagem);
            }
        } catch (erro) {
            setMensagem("Erro ao tentar excluir o funcionário.");
        }
    }

    function handleEditClick(f: FuncionarioState) {
        setEditId(f.idfuncionario);
        setEditData({
            idfuncionario: f.idfuncionario.toString(),
            nomefuncionario: f.nomefuncionario,
            funcaofuncionario: f.funcaofuncionario,
            cpf: f.cpf.toString()
        });
    }

    function handleEditChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    }

    function handleEditCancel() {
        setEditId(null);
        setEditData({
            idfuncionario: "",
            nomefuncionario: "",
            funcaofuncionario: "",
            cpf: ""
        });
    }

    async function handleEditSave(id: number) {
        const funcionarioAtualizado: FuncionarioState = {
            idfuncionario: parseInt(editData.idfuncionario),
            nomefuncionario: editData.nomefuncionario,
            funcaofuncionario: editData.funcaofuncionario,
            cpf: parseInt(editData.cpf)
        };
        try {
            const resposta = await fetch(`http://localhost:8000/funcionario/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(funcionarioAtualizado)
            });
            const dados = await resposta.json();
            if (resposta.status === 200) {
                setFuncionario(funcionario.map(f => f.idfuncionario === id ? funcionarioAtualizado : f));
                setMensagem(dados.mensagem || "Funcionário atualizado com sucesso!");
                setEditId(null);
            } else {
                setMensagem(dados.mensagem || "Erro ao atualizar funcionário!");
            }
        } catch (erro) {
            setMensagem("Erro ao atualizar funcionário!");
        }
    }

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

    return (
        <>
            <main>
                {mensagem &&
                    <div className="mensagem">
                        <p>{mensagem}</p>
                    </div>
                }
              <div className="container-listagem">
                    {funcionario.map(f => (
                        <div className="funcionario-container" key={f.idfuncionario}>
                            {editId === f.idfuncionario ? (
                                <>
                                    <input
                                        type="number"
                                        name="idfuncionario"
                                        value={editData.idfuncionario}
                                        onChange={handleEditChange}
                                        style={{ width: 60 }}
                                    />
                                    <input
                                        type="text"
                                        name="nomefuncionario"
                                        value={editData.nomefuncionario}
                                        onChange={handleEditChange}
                                        style={{ width: 120 }}
                                    />
                                    <input
                                        type="text"
                                        name="funcaofuncionario"
                                        value={editData.funcaofuncionario}
                                        onChange={handleEditChange}
                                        style={{ width: 100 }}
                                    />
                                    <input
                                        type="number"
                                        name="cpf"
                                        value={editData.cpf}
                                        onChange={handleEditChange}
                                        style={{ width: 120 }}
                                    />
                                    <button onClick={() => handleEditSave(f.idfuncionario)} type="button">Salvar</button>
                                    <button onClick={handleEditCancel} type="button">Cancelar</button>
                                </>
                            ) : (
                                <>
                                    <div className="funcionario-id">{f.idfuncionario}</div>
                                    <div className="funcionario-nome">{f.nomefuncionario}</div>
                                    <div className="funcionario-funcao">{f.funcaofuncionario}</div>
                                    <div className="funcionario-cpf">{f.cpf}</div>
                                    <button onClick={() => handleEditClick(f)} type="button">Editar</button>
                                    <button onClick={() => excluirFuncionario(f.idfuncionario)} type="button">Excluir</button>
                                </>
                            )}
                        </div>
                    ))}
                </div>

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
    );
}

export default Funcionario
