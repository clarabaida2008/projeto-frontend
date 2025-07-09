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
                    {funcionario.map(funcionario => {
                        return (
                            <div className="funcionario-container">
                                <div className="funcionario-id">
                                    {funcionario.idfuncionario}
                                </div>
                                <div className="funcionario-nome">
                                    {funcionario.nomefuncionario}
                                </div>
                                <div className="funcionario-funcao">
                                    {funcionario.funcaofuncionario}
                                </div>
                                <div className="funcionario-cpf">
                                    {funcionario.cpf}
                                </div>
                            </div>
                        )
                    })}
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
