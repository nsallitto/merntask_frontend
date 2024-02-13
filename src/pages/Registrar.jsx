import { useState } from "react"
import { Link } from "react-router-dom"
import Alerta from "../components/Alerta";
import clienteAxios from "../config/clienteAxios";

const Registrar = () => {

const [nombre, setNombre] = useState("");
const [email, setEmail] = useState("")
const [password, setPassword] = useState("")
const [repetirPassword, setRepetirPassword] = useState("")
const [alerta, setAlerta] = useState({})

const handleSubmit = async(e) => { 
    e.preventDefault();
//-------------------------VALIDAMOS LOS CAMPOS---------------------------------//
    if ([nombre, email, password, repetirPassword].includes("")) {
        setAlerta({
            msg: "todos los campos son obligatorios",
            error: true
        })
        return;
    }
    if (password.length < 6) {
        setAlerta({
            msg: "el password debe incluir min 8 caracteres",
            error: true
            
        })
    }
    if (password !== repetirPassword) {
        setAlerta({
            msg: "los password deben ser iguales",
            error: true
        })
    }
    setAlerta({})
//-------------------------CREAMOS USUARIO EN LA API----------------------------//
    try {
        const { data } = await clienteAxios.post(`/usuarios`, {nombre, email, password}) //enviamos la info 
        setAlerta({
            msg: data.msg,
            error: false
        })
        setNombre("")
        setEmail("")
        setPassword("")
        setRepetirPassword("")
    } catch (error) {
        setAlerta({
            msg: error.response.data.msg,
            error: true
        });
    }
}
const {msg} = alerta;


    return (
        <>
            <h1 className="text-sky-600 font-black text-6xl capitalize">
                Crea tu cuenta y administra tus <span className="text-slate-700">Proyectos</span>
            </h1>
            { msg && <Alerta alerta={alerta} />}
            <form className="my-10 bg-white shadow rounded-lg px-10 p-10" onSubmit={handleSubmit}>

                <div className="my-5">
                    <label
                        className="uppercase text-gray-600 block text-xl font-bold"
                        htmlFor="nombre">
                        Nombre
                    </label>
                    <input
                        className="w-full mt-3 p-3 bg-gray-50 rounded-xl border"
                        id="nombre"
                        type="text"
                        placeholder="Ingresa tu Nombre"
                        value={nombre}
                        onChange={(e) => {setNombre(e.target.value)}}
                    />
                </div>

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

                <div className="my-5">
                    <label
                        className="uppercase text-gray-600 block text-xl font-bold"
                        htmlFor="password">
                        password
                    </label>
                    <input
                        className="w-full mt-3 p-3 bg-gray-50 rounded-xl border"
                        id="password"
                        type="password"
                        placeholder="Ingresa una Contraseña"
                        value={password}
                        onChange={(e) => {setPassword(e.target.value)}}
                    />
                </div>

                <div className="my-5">
                    <label
                        className="uppercase text-gray-600 block text-xl font-bold"
                        htmlFor="passwordrep">
                        Repite el Password
                    </label>
                    <input
                        className="w-full mt-3 p-3 bg-gray-50 rounded-xl border"
                        id="passwordrep"
                        type="password"
                        placeholder="Ingresa de nuevo tu Contraseña"
                        value={repetirPassword}
                        onChange={(e) => {setRepetirPassword(e.target.value)}}
                    />
                </div>

                <input
                    className="bg-sky-600 w-full rounded py-3 mt-3 text-white uppercase font-bold 
                                hover:cursor-pointer hover:bg-sky-800 transition-colors mb-3"
                    type="submit"
                    value="Crear cuenta"
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
                    to="/olvide-password"
                >
                    Olvide Mi Password
                </Link>
            </nav>
        </>
    )
}

export default Registrar