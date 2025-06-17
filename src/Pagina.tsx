import { useState } from "react"
interface ProdutosState {
    id: number,
    nome: string,
    preco: number,
    categoria: string
}

function Pagina() {
    const [id,setId] = useState("")
    const [nome,setNome] = useState("")
    const [preco,setPreco] = useState("")
    const [categoria,setCategoria] = useState("")
    const [produtos, setProdutos] = useState<ProdutosState[]>([
        {
            id: 1,
            nome: "Caderno",
            preco: 20,
            categoria: "Escolar"
        }
    ])
    function TrataCadastro(event:React.FormEvent<HTMLFormElement>){
        event.preventDefault();
        //Criar um novo produto
        const novoProduto:ProdutosState = {
            id:parseInt(id),
            nome:nome,
            preco:parseFloat(preco),
            categoria:categoria
        }
        //Adicionar esse novo produto no vetor/Array de produtos
        setProdutos([...produtos,novoProduto])
        
    }
    function trataId(event:React.ChangeEvent<HTMLInputElement>){
        setId(event.target.value)
    }
    function trataNome(event:React.ChangeEvent<HTMLInputElement>){
        setNome(event.target.value)
    }
    function trataPreco(event:React.ChangeEvent<HTMLInputElement>){
        setPreco(event.target.value)
    }
    function trataCategoria(event:React.ChangeEvent<HTMLInputElement>){
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
                        <input type="text" name="id" id="id" onChange={trataId}/>
                        <input type="text" name="nome" id="nome" onChange={trataNome} />
                        <input type="text" name="preco" id="preco" onChange={trataPreco} />
                        <input type="text" name="categoria" id="categoria" onChange={trataCategoria} />
                        <input type="submit" value="Cadastrar"/>
                    </form>

                </div>
            </main>
            <footer></footer>
        </>
    )
}

export default Pagina