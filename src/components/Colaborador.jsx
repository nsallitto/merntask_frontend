import useAdmin from "../hooks/useAdmin";
import useProyectos from "../hooks/useProyectos";

const Colaborador = ({ colaborador }) => {

    const { nombre, email } = colaborador;
    const { handleModalEliminarColaborador } = useProyectos();
    const admin = useAdmin();

    return (
        <div className="border-b p-5 flex justify-between items-center">
            <div>
                <p className="font-semibold">{nombre}</p>
                <p className="text-sm text-gray-600">{email}</p>
            </div>
            {admin && (
                <div className="flex items-center">
                    <button
                        type="button"
                        onClick={() => { handleModalEliminarColaborador(colaborador) }}
                        className="text-white font-bold uppercase text-sm bg-red-500 px-4 py-2 rounded lg"
                    >
                        eliminar
                    </button>
                </div>
            )}
        </div>
    )
}

export default Colaborador