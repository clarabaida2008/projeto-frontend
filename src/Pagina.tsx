import { useState } from "react"
interface ProdutosState {
    id:number,
    nome: string,
    preco:number,
    categoria:string
}

function Pagina(){
    const [produtos,setProdutos] = useState<ProdutosState[]>([
        {
            id:1,
            nome:"Caderno",
            preco:20,
            categoria:"Escolar"
        }
    ])
    function TrataCadastro(){}
    return(
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
                {produtos.map(produto=>{
                    return(
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
                    <input type="text" name="id" id="id" />
                    <input type="text" name="nome" id="nome" />
                    <input type="text" name="preco" id="preco"/>
                    <input type="text" name="categoria" id="categoria"/>
                    <input type="submit" value="Cadastrar" onClick={TrataCadastro}/>
                </div>
            </main>
            <footer></footer>
        </>
    )
}

export default Pagina