import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import clienteAxios from "../config/clienteAxios"
import Alerta from "../components/Alerta"

const NuevoPassword = () => {

    const params = useParams();
    const { token } = params;

    const [alerta, setAlerta] = useState({});
    const [tokenValido, setTokenValido] = useState(false);
    const [nuevoPassword, setNuevoPassword] = useState("")
    const [nuevoPasswordRepeat, setNuevoPasswordRepeat] = useState("")
    const [passwordModificado, setPasswordModificado] = useState(false)

    useEffect(() => {
        const comprobarToken = async () => {
            try {
                const url = `/usuarios/olvide-password/${token}`
                await clienteAxios.get(url)

                setTokenValido(true);
            } catch (error) {
                setAlerta({
                    msg: error.response.data.msg,
                    error: true
                })
            }
        }
        comprobarToken()
    }, [])

    const { msg } = alerta;

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (nuevoPassword !== nuevoPasswordRepeat) {
            setAlerta({
                msg: "Las contraseñas deben coincidir",
                error: true
            })
            return
        }
        if (nuevoPassword.length < 6) {
            setAlerta({
                msg: "La contraseña debe tener min 6 caracteres",
                error: true
            })
            return
        }
        try {
            const url = `/usuarios/olvide-password/${token}`
            const {data} = await clienteAxios.post(url, {password: nuevoPassword})
            setAlerta({
                msg: data.msg,
                error: false
            })
            setPasswordModificado(true)
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    return (
        <>
            <h1 className="text-sky-600 font-black text-6xl capitalize">
                reestablece tu password y no pierdas acceso a tus <span className="text-slate-700">Proyectos</span>
            </h1>
            {msg && <Alerta alerta={alerta}/>}
            {tokenValido && (

                <form 
                    onSubmit={handleSubmit}
                    className="my-10 bg-white shadow rounded-lg px-10 p-10">

                    <div className="my-5">
                        <label
                            className="uppercase text-gray-600 block text-xl font-bold"
                            htmlFor="password">
                            nuevo password
                        </label>
                        <input
                            className="w-full mt-3 p-3 bg-gray-50 rounded-xl border"
                            id="password"
                            type="password"
                            placeholder="Ingresa una Contraseña"
                            value={nuevoPassword}
                            onChange={(e) => {setNuevoPassword(e.target.value)}}
                        />
                    </div>

                    <div className="my-5">
                        <label
                            className="uppercase text-gray-600 block text-xl font-bold"
                            htmlFor="passwordrep">
                            Repite nuevo Password
                        </label>
                        <input
                            className="w-full mt-3 p-3 bg-gray-50 rounded-xl border"
                            id="passwordrep"
                            type="password"
                            placeholder="Ingresa de nuevo tu Contraseña"
                            value={nuevoPasswordRepeat}
                            onChange={(e) => {setNuevoPasswordRepeat(e.target.value)}}
                        />
                    </div>

                    <input
                        className="bg-sky-600 w-full rounded py-3 mt-3 text-white uppercase font-bold 
                                hover:cursor-pointer hover:bg-sky-800 transition-colors mb-3"
                        type="submit"
                        value="Confirmar Nueva Contraseña"
                    />

                </form>
            )}
            {passwordModificado && (
                <Link
                className="block text-center my-5 text-slate-500 uppercase text-sm"
                to="/"
            >
                Inicia Sesion
            </Link>
            )}
        </>
    )
}

export default NuevoPassword