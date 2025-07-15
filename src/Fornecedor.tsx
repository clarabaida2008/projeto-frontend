import './Fornecedor.css';
import { useEffect, useState } from "react"

// Interface que define a estrutura de um fornecedor
interface FornecedorState {
    idfornecedor: number,
    nomefornecedor: string,
    cnpjfornecedor: number,
    cidadefornecedor: string
}

function Fornecedor() {
    // Estados para os campos do formulário
    const [idfornecedor, setIdFornecedor] = useState("")
    const [nomefornecedor, setNomeFornecedor] = useState("")
    const [cnpjfornecedor, setCnpjFornecedor] = useState("")
    const [cidadefornecedor, setCidadeFornecedor] = useState("")
    const [mensagem, setMensagem] = useState("")
    const [fornecedor, setFornecedor] = useState<FornecedorState[]>([])

    // Efeito para buscar os fornecedores ao carregar o componente
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
                setMensagem("⚠️ERRO AO CONECTAR COM O SERVIDOR")
            }
        }
        buscaDados()
    }, []) // [] significa que o efeito só roda uma vez, quando o componente é montado

    // Função para validar os campos antes do cadastro
    function validarCampos() {
        // Verifica se todos os campos estão preenchidos
        if (!idfornecedor || !nomefornecedor || !cnpjfornecedor || !cidadefornecedor) {
            setMensagem("⚠️TODOS OS CAMPOS DEVEM SER PREENCHIDOS")
            return false
        }

        // Verifica se o ID é um número
        if (isNaN(Number(idfornecedor))) {
            setMensagem("⚠️O ID DEVE SER UM NÚMERO")
            return false
        }

        // Verifica se o CNPJ é um número
        if (isNaN(Number(cnpjfornecedor))) {
            setMensagem("⚠️CNPJ DEVE SER UM NÚMERO")
            return false
        }

        // Verifica se o nome e cidade não contêm números
        const contemNumero = /[0-9]/.test(nomefornecedor) || /[0-9]/.test(cidadefornecedor)
        if (contemNumero) {
            setMensagem("⚠️NOME E CIDADE NÃO PODEM CONTER NÚMEROS")
            return false
        }

        return true
    }

    // Função para tratar o cadastro de um novo fornecedor
    async function TrataCadastro(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        // Valida os campos antes de prosseguir
        if (!validarCampos()) {
            return
        }

        // Cria um novo objeto fornecedor com os dados do formulário
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
                // Limpa os campos após cadastro bem-sucedido
                setIdFornecedor("")
                setNomeFornecedor("")
                setCnpjFornecedor("")
                setCidadeFornecedor("")
                setMensagem("✅FORNECEDOR CADASTRADO COM SUCESSO!")
            }
            if (resposta.status === 400) {
                const erro = await resposta.json()
                setMensagem(erro.mensagem)
            }
        }
        catch (erro) {
            setMensagem("⚠️ERRO AO CONECTAR COM O SERVIDOR")
        }
    }

    // Funções para tratar mudanças nos inputs do formulário
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

    // Função para excluir um fornecedor
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
            setMensagem("⚠️ERRO AO TENTAR EXCLUIR O FORNECEDOR")
        }
    }

    // Estados para controlar a edição de fornecedores
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [editId, setEditId] = useState("");
    const [editNome, setEditNome] = useState("");
    const [editCnpj, setEditCnpj] = useState("");
    const [editCidade, setEditCidade] = useState("");

    // Função para iniciar a edição de um fornecedor
    function iniciarEdicao(f: FornecedorState) {
        setEditandoId(f.idfornecedor);
        setEditId(f.idfornecedor.toString());
        setEditNome(f.nomefornecedor);
        setEditCnpj(f.cnpjfornecedor.toString());
        setEditCidade(f.cidadefornecedor);
        setMensagem("");
    }

    // Função para cancelar a edição
    function cancelarEdicao() {
        setEditandoId(null);
        setEditId("");
        setEditNome("");
        setEditCnpj("");
        setEditCidade("");
        setMensagem("");
    }

    // Função para validar os campos durante a edição
    function validarEdicao() {
        if (!editId || !editNome || !editCnpj || !editCidade) {
            setMensagem('⚠️TODOS OS CAMPOS DEVEM SER PREENCHIDOS PARA ATUALIZAÇÃO');
            return false;
        }

        if (isNaN(Number(editId))) {
            setMensagem('⚠️ID DEVE SER UM NÚMERO');
            return false;
        }

        if (isNaN(Number(editCnpj))) {
            setMensagem('⚠️CNPJ DEVE SER UM NÚMERO');
            return false;
        }

        const contemNumero = /[0-9]/.test(editNome) || /[0-9]/.test(editCidade)
        if (contemNumero) {
            setMensagem("⚠️NOME E CIDADE NÃO PODEM CONTER NÚMEROS");
            return false
        }

        return true;
    }

    // Função para salvar as alterações de um fornecedor editado
    async function salvarEdicao(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        // Valida os campos antes de prosseguir
        if (!validarEdicao()) {
            return
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
                setMensagem(dados.mensagem || '✅FORNECEDOR ATUALIZADO COM SUCESSO!');
                cancelarEdicao();
            } else {
                setMensagem(dados.mensagem || '⚠️ERRO AO ATUALIZAR FORNECEDOR');
            }
        } catch (erro) {
            setMensagem('⚠️ERRO AO ATUALIZAR FORNECEDOR');
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

                {/* Listagem de fornecedores */}
                <div className="container-listagem">
                    {fornecedor.map(fornecedor => (
                        <div className="fornecedor-container" key={fornecedor.idfornecedor}>
                            {editandoId === fornecedor.idfornecedor ? (
                                // Formulário de edição
                                <form className="form-edicao" onSubmit={salvarEdicao} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <input type="number" value={editId} onChange={e => setEditId(e.target.value)} placeholder="Id" style={{ width: '60px' }} />
                                    <input type="text" value={editNome} onChange={e => setEditNome(e.target.value)} placeholder="Nome" />
                                    <input type="number" value={editCnpj} onChange={e => setEditCnpj(e.target.value)} placeholder="CNPJ" />
                                    <input type="text" value={editCidade} onChange={e => setEditCidade(e.target.value)} placeholder="Cidade" />
                                    <button type="submit">Salvar</button>
                                    <button type="button" onClick={cancelarEdicao}>Cancelar</button>
                                </form>
                            ) : (
                                // Exibição normal do fornecedor
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

                {/* Formulário de cadastro */}
                <div className="container-cadastro">
                    <form onSubmit={TrataCadastro}>
                        <input type="number" name="id" id="id" value={idfornecedor} onChange={trataIdFornecedor} placeholder="Id" />
                        <input type="text" name="nome" id="nome" value={nomefornecedor} onChange={trataNomeFornecedor} placeholder="Nome" />
                        <input type="number" name="cnpj" id="cnpj" value={cnpjfornecedor} onChange={trataCnpjFornecedor} placeholder="CNPJ" />
                        <input type="text" name="cidade" id="cidade" value={cidadefornecedor} onChange={trataCidadeFornecedor} placeholder="Cidade" />
                        <input type="submit" value="Cadastrar" />
                    </form>
                </div>
            </main>
            <footer></footer>
        </>
    )
}

export default Fornecedor