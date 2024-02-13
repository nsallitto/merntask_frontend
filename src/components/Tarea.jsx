import { formatearFecha } from "../helpers/formatearFecha"
import useAdmin from "../hooks/useAdmin";
import useProyectos from "../hooks/useProyectos";

const Tarea = ({ tarea }) => {

    const { handleModalEditarTarea, handleModalEliminarTarea, cambiarEstado } = useProyectos();
    const admin = useAdmin();

    const { descripcion, nombre, prioridad, fechaEntrega, estado, _id } = tarea;

    return (
        <div className=" border-b p-5 flex justify-between items-center">
            <div>
                <p className="mb-1 text-xl font-semibold">{nombre}</p>
                <p className="mb-1 text-sm text-gray-500 uppercase">{descripcion}</p>
                <p className="mb-1 text-sm">{formatearFecha(fechaEntrega)}</p>
                <p className="mb-1 text-gray-500">Prioridad: {prioridad}</p>
                {estado && <p className="text-xs bg-green-600 uppercase p-1 rounded-lg text-white">Tarea completada por: {tarea.completado.nombre}</p>}
            </div>
            <div className="flex gap-1 flex-col md:flex-row">
                {admin && (
                    <button
                        onClick={() => { handleModalEditarTarea(tarea) }}
                        className="text-white font-bold uppercase text-sm bg-sky-700 px-4 py-2 rounded lg"
                    >
                        Editar
                    </button>
                )}

                <button
                    onClick={() => {cambiarEstado(_id)}}
                    className={`${estado ? "bg-green-500" : "bg-gray-500"} text-white font-bold uppercase text-sm px-4 py-2 rounded lg`}
                >
                    {estado ? "Completa" : "Incompleta"}
                </button>

                {admin && (
                    <button
                        onClick={() => { handleModalEliminarTarea(tarea) }}
                        className="text-white font-bold uppercase text-sm bg-red-500 px-4 py-2 rounded lg"
                    >
                        Eliminar
                    </button>
                )}
            </div>
        </div>
    )
}

export default Tarea