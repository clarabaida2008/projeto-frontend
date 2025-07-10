import './Fornecedor.css';
import { useEffect, useState } from "react"
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
                    console.log(dados)
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
    async function excluirFornecedor(id: number) {
        try {
            const resposta = await fetch(`http://localhost:8000/fornecedor/${id}`, {
                method: "DELETE"
            })
            const dados = await resposta.json()
            if (resposta.status === 200) {
                setFornecedor(fornecedor.filter(f => f.idfornecedor !== id))
                setMensagem(dados.mensagem)
            } else {
                setMensagem(dados.mensagem)
            }
        } catch (erro) {
            setMensagem("Erro ao tentar excluir o fornecedor.")
        }
    }
    // Estado para controlar edição
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [editId, setEditId] = useState("");
    const [editNome, setEditNome] = useState("");
    const [editCnpj, setEditCnpj] = useState("");
    const [editCidade, setEditCidade] = useState("");

    function iniciarEdicao(f: FornecedorState) {
        setEditandoId(f.idfornecedor);
        setEditId(f.idfornecedor.toString());
        setEditNome(f.nomefornecedor);
        setEditCnpj(f.cnpjfornecedor.toString());
        setEditCidade(f.cidadefornecedor);
        setMensagem("");
    }

    function cancelarEdicao() {
        setEditandoId(null);
        setEditId("");
        setEditNome("");
        setEditCnpj("");
        setEditCidade("");
        setMensagem("");
    }

    async function salvarEdicao(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!editId || !editNome || !editCnpj || !editCidade) {
            setMensagem('Todos os campos devem ser preenchidos para atualizar.');
            return;
        }
        const fornecedorAtualizado: FornecedorState = {
            idfornecedor: parseInt(editId),
            nomefornecedor: editNome,
            cnpjfornecedor: parseInt(editCnpj),
            cidadefornecedor: editCidade
        };
        try {
            const resposta = await fetch(`http://localhost:8000/fornecedor/${editandoId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(fornecedorAtualizado)
            });
            const dados = await resposta.json();
            if (resposta.status === 200) {
                setFornecedor(fornecedor.map(f => f.idfornecedor === editandoId ? fornecedorAtualizado : f));
                setMensagem(dados.mensagem || 'Fornecedor atualizado com sucesso!');
                cancelarEdicao();
            } else {
                setMensagem(dados.mensagem || 'Erro ao atualizar fornecedor.');
            }
        } catch (erro) {
            setMensagem('Erro ao tentar atualizar o fornecedor.');
        }
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
                    {fornecedor.map(fornecedor => (
                        <div className="fornecedor-container" key={fornecedor.idfornecedor}>
                            {editandoId === fornecedor.idfornecedor ? (
                                <form className="form-edicao" onSubmit={salvarEdicao} style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                                    <input type="number" value={editId} onChange={e => setEditId(e.target.value)} placeholder="Id" style={{width: '60px'}} />
                                    <input type="text" value={editNome} onChange={e => setEditNome(e.target.value)} placeholder="Nome" />
                                    <input type="number" value={editCnpj} onChange={e => setEditCnpj(e.target.value)} placeholder="CNPJ" />
                                    <input type="text" value={editCidade} onChange={e => setEditCidade(e.target.value)} placeholder="Cidade" />
                                    <button type="submit">Salvar</button>
                                    <button type="button" onClick={cancelarEdicao}>Cancelar</button>
                                </form>
                            ) : (
                                <>
                                    <div className="fornecedor-id">{fornecedor.idfornecedor}</div>
                                    <div className="fornecedor-nome">{fornecedor.nomefornecedor}</div>
                                    <div className="fornecedor-cnpj">{fornecedor.cnpjfornecedor}</div>
                                    <div className="fornecedor-cidade">{fornecedor.cidadefornecedor}</div>
                                    <button onClick={() => iniciarEdicao(fornecedor)}>Editar</button>
                                    <button onClick={() => excluirFornecedor(fornecedor.idfornecedor)}>Excluir</button>
                                </>
                            )}
                        </div>
                    ))}
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