import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import clienteAxios from "../config/clienteAxios";
import useAuth from "../hooks/useAuth";
import Alerta from "../components/Alerta";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [alerta, setAlerta] = useState({});

    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault()

        if ([email, password].includes("")) {
            setAlerta({
                msg: "Todos los campos son obligatorios",
                error: true
            })
            return
        }
        try {
            const { data } = await clienteAxios.post('/usuarios/login', {email, password})
            setAlerta({})
            localStorage.setItem("token", data.token) //Guardamos token en ls
            setAuth(data)
            navigate('/proyectos')
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const { msg } = alerta;

    return (
        <>
            <h1 className="text-sky-600 font-black text-6xl capitalize">
                Inicia Sesion y Administra tus <span className="text-slate-700">Proyectos</span>
            </h1>

            { msg && <Alerta alerta={alerta}/>}

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
                        placeholder="Email de Registro"
                        value={email}
                        onChange={(e) => {setEmail(e.target.value)}}
                    />
                </div>

                <div className="my-5">
                    <label 
                        className="uppercase text-gray-600 block text-xl font-bold"
                        htmlFor="email">
                            password
                    </label>
                    <input
                        className="w-full mt-3 p-3 bg-gray-50 rounded-xl border"
                        id="email"
                        type="password" 
                        placeholder="Password de registro"
                        value={password}
                        onChange={(e) => {setPassword(e.target.value)}}
                    />
                </div>
                
                <input 
                    className="bg-sky-600 w-full rounded py-3 mt-3 text-white uppercase font-bold 
                                hover:cursor-pointer hover:bg-sky-800 transition-colors mb-3"
                    type="submit" 
                    value="Iniciar Sesion"
                />
            </form>
            <nav className="lg:flex lg:justify-between">
                <Link
                    className="block text-center my-5 text-slate-500 uppercase text-sm"
                    to="/registrar"
                >
                    ¿No tienes una cuenta? Registrate
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

export default Login