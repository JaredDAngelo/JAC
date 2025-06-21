import { useState } from "react";


function Ejemplo(){
    
    const [numero, setNumero] = useState(1)
    const click=()=>{
        setNumero(numero+1)
        console.log(numero)
    }
    return (
        <>  {/*Fragment */}

        <button onClick={click}>+1</button>
        <br/>


        <p>El valor de la variable esta en: {numero} </p>
        </>
    )
}

export default Ejemplo;