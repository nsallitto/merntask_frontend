import { createContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import clienteAxios from "../config/clienteAxios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [auth, setAuth] = useState({});
    const [cargando, setCargando] = useState(true);

    const location = useLocation();
    const pathname = location.pathname;
    const navigate = useNavigate();


    useEffect(() => {
        const autenticarUsuario = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setCargando(false)
                return;
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            try {
                const { data } = await clienteAxios.get('/usuarios/perfil', config)
                setAuth(data);
                const rutas = ["/", "/registrar", "/olvide-password", "/confirmar","/proyectos"];
                
                if (rutas.includes(pathname)) {
                    navigate("/proyectos")
                }
            } catch (error) {
                setAuth({});
            }
            setCargando(false);
        }
        autenticarUsuario()
    }, [])
    const cerrarSesionAuth = () => {
        setAuth({});
    }

    return (
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                cargando,
                cerrarSesionAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export { AuthProvider }

export default AuthContext
