import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PreviewProyecto = ({ proyecto }) => {

    const { auth } = useAuth();
    const { nombre, _id, cliente } = proyecto;

    return (
        <div className="border-b flex flex-col md:flex-row justify-between p-5">
            <div className="flex gap-2">
                <p className="flex-1">
                    {nombre}
                    <span className="text-sm text-gray-500 uppercase">{""} {cliente}</span>
                </p>

                {auth._id !== proyecto.creador && (
                    <p className="bg-green-500 p-1 text-xs text-white font-bold uppercase rounded-lg">colaborador</p>
                )}
            </div>
            <Link
                className="text-gray-600 hover:text-gray-800 uppercase text-sm font-bold"
                to={`${_id}`}
            >Ver Proyecto</Link>
        </div>
    )
}

export default PreviewProyecto