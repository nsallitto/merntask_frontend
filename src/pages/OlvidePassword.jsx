import { useState } from "react"
import { Link } from "react-router-dom"
import clienteAxios from "../config/clienteAxios"
import Alerta from "../components/Alerta"

const OlvidePassword = () => {

    const [email, setEmail] = useState("");
    const [alerta, setAlerta] = useState({});

    const handleSubmit = async(e) => {
        e.preventDefault();

        if (email === "" || email.length < 6) {
            setAlerta({
                msg: "El Email es Obligatorio",
                error: true
            })
            return
        }
        try {
            const { data } = await clienteAxios.post(`/usuarios/olvide-password`, {email})

            setAlerta({
                msg: data.msg,
                error: false
            })
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            });
        }
    }

    const { msg } = alerta;

    return (
        <>
            <h1 className="text-sky-600 font-black text-6xl capitalize">
                Recupera tu acceso y no pierdas tus <span className="text-slate-700">Proyectos</span>
            </h1>

            { msg && <Alerta alerta={alerta} />}

            <form 
                onSubmit={handleSubmit}
                className="my-10 bg-white shadow rounded-lg px-10 p-10">

                <div className="my-5">
                    <label
                        className="uppercase text-gray-600 block text-xl font-bold"
                        htmlFor="email">
                        Email
                    </label>
                    <input
                        className="w-full mt-3 p-3 bg-gray-50 rounded-xl border"
                        id="email"
                        type="email"
                        placeholder="Ingresa tu Email"
                        value={email}
                        onChange={(e) => {setEmail(e.target.value)}}
                    />
                </div>

                <input
                    className="bg-sky-600 w-full rounded py-3 mt-3 text-white uppercase font-bold 
                                hover:cursor-pointer hover:bg-sky-800 transition-colors mb-3"
                    type="submit"
                    value="Enviar Instrucciones"
                />

            </form>
            <nav className="lg:flex lg:justify-between">
                <Link
                    className="block text-center my-5 text-slate-500 uppercase text-sm"
                    to="/"
                >
                    ¿Ya tienes una cuenta? Inicia Sesion
                </Link>
                <Link
                    className="block text-center my-5 text-slate-500 uppercase text-sm"
                    to="/registrar"
                >
                    ¿No tienes una cuenta? Registrate
                </Link>
            </nav>
        </>
    )
}

export default OlvidePassword