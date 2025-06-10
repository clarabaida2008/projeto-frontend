import { useState } from "react"
interface ContainerProps{
  nome:string
}
function Container(props:ContainerProps){
  function trataInput(event:React.ChangeEvent<HTMLInputElement>){
    console.log(event.currentTarget.value)
  }
  return(
    <>
      <h1>{props.nome}</h1>
      Texto:{texto}
      <input type="text" 
              placeholder="Mostrar Texto" 
              onChange={trataInput}/>
    </>
  )
}
export default Container