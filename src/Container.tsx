interface ContainerProps{
  nome:string
}
function Container(props:ContainerProps){
  let contador = 10
  function mudar(){
    contador = 20
    console.log(contador)
  }
  return(
    <>
      <h1>{props.nome}</h1>
      Valor Contador:{contador}
      <button onClick={mudar}>Mudar</button>
    </>
  )
}
export default Container