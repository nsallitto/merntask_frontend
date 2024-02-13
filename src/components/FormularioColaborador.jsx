import { useState } from "react"
import useProyectos from "../hooks/useProyectos";
import Alerta from "./Alerta";

const FormularioColaborador = () => {

    const [email, setEmail] = useState("");

    const { submitColaborador, mostrarAlerta, alerta } = useProyectos();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (email === "") {
            mostrarAlerta({
                msg: "Todos los campos son Obligatorios",
                error: true
            })
        }
        submitColaborador(email)
    }

    const { msg } = alerta;
    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white py-10 px-5 w-full md:w-1/2 rounded-lg shadow"
        >
            {msg && <Alerta alerta={alerta}/>}

            <div className="mb-5">
                <label
                    className='text-gray-700 text-sm font-bold uppercase'
                    htmlFor='email'
                >Email Colaborador
                </label>
                <input
                    className='placeholder-gray-400 border-2 rounded-md p-2 w-full mt-2'
                    type='email'
                    placeholder='Email del Usuario'
                    id='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <input
                className='bg-sky-600 hover:bg-sky-700 transition-all cursor-pointer shadow-md rounded-md
                            block w-full mt-10 my-0 p-2 text-white uppercase font-bold '
                value="Buscar Colaborador"
                type="submit"
            />
        </form>
    )
}

export default FormularioColaborador