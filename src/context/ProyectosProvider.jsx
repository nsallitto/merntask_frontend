import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../config/clienteAxios";
import { io } from "socket.io-client";
let socket;
import useAuth from "../hooks/useAuth"

const ProyectoContext = createContext();

const ProyectoProvider = ({ children }) => {

    const [proyectos, setProyectos] = useState([]);
    const [proyecto, setProyecto] = useState({});
    const [alerta, setAlerta] = useState({});
    const [cargando, setCargando] = useState(false);
    const [modalFormularioTarea, setModalFormularioTarea] = useState(false);
    const [modalEliminarTarea, setModalEliminarTarea] = useState(false);
    const [tarea, setTarea] = useState({});
    const [colaborador, setColaborador] = useState({});
    const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false);
    const [modalBuscador, setModalBuscador] = useState(false);

    const { auth } = useAuth();

    useEffect(() => {
        const obtenerProyectos = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    return
                }
                const config = {
                    headers: {
                        "Content-Type": "Application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
                const { data } = await clienteAxios.get("/proyectos", config)
                setProyectos(data);
            } catch (error) {
                console.log(error);
            }
        }
        obtenerProyectos()
    }, [auth])
    // //!----- ESTE USEEFFECT SOLO GENERA LA CONEXION CON SOCKET.IO ------
    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL)
    }, [])

    const navigate = useNavigate();

    const mostrarAlerta = (alerta) => {
        setAlerta(alerta)

        setTimeout(() => {
            setAlerta({})
        }, 3000)
    }

    const submitProyecto = async (proyecto) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return;
            }
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post('/proyectos', proyecto, config) //1: url 2:datos a enviar 3:autorizacion
            setProyectos([...proyectos, data])
            setAlerta({
                msg: "Proyecto creado correctamente",
                error: false
            })
            setTimeout(() => {
                setAlerta({});
                navigate("/proyectos")
            }, 2500)

        } catch (error) {
            console.log(error);
        }
    }
    const actualizarProyecto = async (proyecto) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return;
            }
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config)
            //ACTUALIZAMOS EL STATE PROYECTOS
            const proyectosActualizados = proyectos.map(proyectoState => proyectoState._id === data._id ? data : proyectoState)
            setProyectos(proyectosActualizados);
            setAlerta({
                msg: "El Proyecto fue Actualizado con Exito"
            })
            setTimeout(() => {
                setAlerta({});
                navigate('/proyectos')
            }, 2000)

        } catch (error) {
            console.log(error);
        }
    }
    const obtenerProyecto = async (id) => {
        setCargando(true)
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return
            }
            const config = {
                headers: {
                    "Content-Type": "Application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.get(`/proyectos/${id}`, config)
            setProyecto(data)
            setAlerta({})
        } catch (error) {
            navigate('/proyectos')
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 3000)
        }
        setCargando(false)
    }
    const eliminarProyecto = async (id) => {
        const token = localStorage.getItem("token");
        if (!token) {
            return
        }
        const config = {
            headers: {
                "Type-Content": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
        const { data } = await clienteAxios.delete(`/proyectos/${id}`, config)
        const proyectosActualizados = proyectos.filter(proyectoStates => proyectoStates._id !== id)
        mostrarAlerta({
            msg: data.msg
        })
        setProyectos(proyectosActualizados);
        setTimeout(() => {
            setAlerta({});
            navigate('/proyectos')
        }, 2000)
    }
    const handleModalTarea = () => {
        setModalFormularioTarea(!modalFormularioTarea);
        setTarea({})
    }
    const submitTarea = async (tarea) => {
        if (tarea?.id) {
            await editarTarea(tarea)
        } else {
            await crearTarea(tarea)
        }
    }
    const crearTarea = async (tarea) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return
            }
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post('/tareas', tarea, config);
            setAlerta({})
            setModalFormularioTarea(false)
            //TODO: -------------------- SOCKET IO ------------------------------//
            socket.emit("nueva tarea", data);

        } catch (error) {
            console.log(error);
        }
    }
    const editarTarea = async (tarea) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return
            }
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config)

            //TODO: -------------------- SOCKET IO ------------------------------//
            socket.emit("editar tarea", data)
            setAlerta({});
            setModalFormularioTarea(false);
        } catch (error) {
            console.log(error);
        }
    }
    const handleModalEditarTarea = (tarea) => {
        setTarea(tarea);
        setModalFormularioTarea(true);
    }
    const handleModalEliminarTarea = (tarea) => {
        setTarea(tarea)
        setModalEliminarTarea(!modalEliminarTarea);
    }
    const eliminarTarea = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return console.log("no funciona");
            }
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.delete(`/tareas/${tarea._id}`, config)
            setAlerta({
                msg: data.msg,
                error: false
            })

            setModalEliminarTarea(!modalEliminarTarea)
            //TODO: -------------------- SOCKET IO ------------------------------//
            socket.emit("eliminar tarea", tarea)
            setTarea({})
            setTimeout(() => {
                setAlerta({})
            }, 2000)
        } catch (error) {
            console.log(error);
        }

    }
    const submitColaborador = async (email) => {
        setCargando(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return
            }
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post("/proyectos/colaboradores", { email }, config)
            setColaborador(data);
            setAlerta({});

        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
        setCargando(false);
    }
    const agregarColaborador = async (email) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return
            }
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config)
            setAlerta({
                msg: data.msg,
                error: false
            })
            setColaborador({})
            setTimeout(() => {
                setAlerta({})
                navigate(`/proyectos/${proyecto._id}`)
            }, 2500);

        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const handleModalEliminarColaborador = (colaborador) => {
        setModalEliminarColaborador(!modalEliminarColaborador);
        setColaborador(colaborador);
    }
    const eliminarColaborador = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return
            }
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, { id: colaborador._id }, config);

            const proyectoActualizado = { ...proyecto };
            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(colaboradorState =>
                colaboradorState._id !== colaborador._id
            )
            setProyecto(proyectoActualizado)
            setAlerta({
                msg: data.msg,
                error: false
            })
            setColaborador({});
            setModalEliminarColaborador(false);
            setTimeout(() => {
                setAlerta({})
            }, 2500);
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }
    const cambiarEstado = async (id) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return
            }
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post(`/tareas/estado/${id}`, {}, config)
            setTarea({})
            setAlerta({})

            //TODO: -------------------- SOCKET IO ------------------------------//
            socket.emit("cambiar estado", data)

        } catch (error) {
            console.log(error.response);
        }
    }

    const handleModalBuscador = () => {
        setModalBuscador(!modalBuscador);
    }
    const cerrarSesion = () => {
        setProyectos([]);
        setProyecto({});
        setAlerta({});
    }

    //!--------------------socket io-------------------------//

    const submitTareasProyecto = (tarea) => {
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea]

        setProyecto(proyectoActualizado)
    }
    const eliminarTareaProyecto = (tareaEliminada) => {
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter((tareaState) => tareaState._id !== tareaEliminada._id)

        setProyecto(proyectoActualizado)
    }
    const editarTareaProyecto = (tareaEditada) => {
        const proyectoActualizado = { ...proyecto };
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tareaEditada._id ? tareaEditada : tareaState)
        setProyecto(proyectoActualizado)
    }
    const cambiarEstadoTarea = (tarea) => {
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState)
        setProyecto(proyectoActualizado)
    }

    return (
        <ProyectoContext.Provider
            value={{
                proyectos,
                mostrarAlerta,
                alerta,
                submitProyecto,
                actualizarProyecto,
                obtenerProyecto,
                proyecto,
                cargando,
                eliminarProyecto,
                modalFormularioTarea,
                handleModalTarea,
                submitTarea,
                handleModalEditarTarea,
                tarea,
                modalEliminarTarea,
                handleModalEliminarTarea,
                eliminarTarea,
                submitColaborador,
                colaborador,
                agregarColaborador,
                handleModalEliminarColaborador,
                modalEliminarColaborador,
                eliminarColaborador,
                cambiarEstado,
                handleModalBuscador,
                modalBuscador,
                submitTareasProyecto,
                eliminarTareaProyecto,
                editarTareaProyecto,
                cambiarEstadoTarea,
                cerrarSesion
            }}
        >
            {children}
        </ProyectoContext.Provider>
    )
}

export { ProyectoProvider }

export default ProyectoContext