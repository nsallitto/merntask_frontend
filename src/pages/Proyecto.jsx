import { useEffect } from "react";
import { Link, useParams } from "react-router-dom"
import useProyectos from "../hooks/useProyectos";
import useAdmin from "../hooks/useAdmin";
import ModalFormularioTarea from "../components/ModalFormularioTarea";
import ModalEliminarTarea from "../components/ModalEliminarTarea";
import ModalEliminarColaborador from "../components/ModalEliminarColaborador";
import Tarea from "../components/Tarea";
import Colaborador from "../components/Colaborador";
import { io } from "socket.io-client";
let socket;

const Proyecto = () => {

    const params = useParams();
    const { obtenerProyecto, proyecto, cargando, eliminarProyecto, alerta, handleModalTarea, submitTareasProyecto, eliminarTareaProyecto, editarTareaProyecto, cambiarEstadoTarea} = useProyectos();
    const admin = useAdmin();

    useEffect(() => {
        obtenerProyecto(params.id);
    }, [])

    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL)
        socket.emit("abrir proyecto", params.id)
    }, [])

    useEffect(() => {
        socket.on("tarea agregada", (tareaNueva) => {
            if (tareaNueva.proyecto === proyecto._id) {
                submitTareasProyecto(tareaNueva)
            }
        })
        socket.on("tarea eliminada", (tareaEliminada) => {
            if (tareaEliminada.proyecto === proyecto._id) {
                eliminarTareaProyecto(tareaEliminada)
            }
        })
        socket.on("tarea editada", (tareaEditada) => {
            if (tareaEditada.proyecto._id === proyecto._id) {
                editarTareaProyecto(tareaEditada)
            }
        })
        socket.on("nuevo estado", (nuevoEstadoTarea) => {
            if (nuevoEstadoTarea.proyecto._id === proyecto._id) {
                cambiarEstadoTarea(nuevoEstadoTarea)
            }
        })
    })

    const handleClick = () => {
        if (confirm("¿Deseas Eliminar este Proyecto?")) {
            eliminarProyecto(params.id)
        }
    }
    const { nombre } = proyecto;

    if (cargando) return ''

    const { msg } = alerta;

    return (
        <>
            <div className="flex justify-between">
                <h1 className="font-black text-4xl">{nombre}</h1>
                <div className="flex gap-2">

                    {admin && (
                        <Link
                            className="uppercase font-bold text-sm flex items-center gap-1 m-2 text-gray-400 hover:text-black"
                            to={`/proyectos/editar/${params.id}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                            </svg>
                            editar
                        </Link>
                    )}

                    {admin && (
                        <button
                            onClick={handleClick}
                            className="uppercase font-bold text-sm flex items-center gap-1 m-2 text-gray-400 hover:text-red-500">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                            </svg>
                            eliminar
                        </button>
                    )}
                </div>
            </div>

            {admin && (
                <button
                    onClick={handleModalTarea}
                    className="bg-sky-300 text-white text-sm uppercase font-semibold px-5 py-3 rounded-lg w-full md:w-auto text-center flex gap-2 items-center justify-center mt-4 hover:bg-sky-700 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>

                    Nueva Tarea
                </button>
            )}

            <p className="font-bold text-xl mt-10">Tareas del Proyecto</p>
            <div className="bg-white mt-10 shadow rounded-lg">
                {proyecto.tareas?.length ?
                    (proyecto.tareas?.map(tarea => (
                        <Tarea
                            key={tarea._id}
                            tarea={tarea}
                        />
                    ))) :
                    (<p className="my-5 text-center p-10 font-semibold">No hay Tareas aun</p>)
                }
            </div>
            <div className="flex justify-between items-center mt-10">
                <p className="font-bold text-xl">Colaboradores del Proyecto</p>
                {admin && (
                    <Link
                        className="uppercase font-bold text-sm flex items-center gap-1 m-2 text-gray-400 hover:text-black"
                        to={`/proyectos/nuevo-colaborador/${proyecto._id}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        Agregar
                    </Link>
                )}
            </div>

            <div className="bg-white mt-10 shadow rounded-lg">
                {proyecto.colaboradores?.length ?
                    (proyecto.colaboradores?.map(colaborador => (
                        <Colaborador
                            key={colaborador._id}
                            colaborador={colaborador}
                        />
                    ))) :
                    (<p className="my-5 text-center p-10 font-semibold">No hay Colaboradores aun</p>)
                }
            </div>

            <ModalFormularioTarea />
            <ModalEliminarTarea />
            <ModalEliminarColaborador />
        </>
    )
}

export default Proyecto