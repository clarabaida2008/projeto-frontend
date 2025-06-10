import { useState } from "react"
interface ContainerProps{
  nome:string
}
function Container(props:ContainerProps){
  function f(){

  }
  return(
    <>
      <h1>{props.nome}</h1>
      Texto:{texto}
      <input type="text" placeholder="Mostrar Texto" onChange={f}/>
    </>
  )
}
export default Container