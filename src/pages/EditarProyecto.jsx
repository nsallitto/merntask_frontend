import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useProyectos from "../hooks/useProyectos"
import NuevoProyecto from "./NuevoProyecto";
import FormularioProyecto from "../components/FormularioProyecto";

const EditarProyecto = () => {

    const params = useParams();
    const { proyecto, obtenerProyecto, cargando } = useProyectos();

    useEffect(() => {
        obtenerProyecto(params.id)
    }, [])
    const { nombre } = proyecto;
    if (cargando) return 'Cargando...'

    return (
        <>
            <h1 className="font-black text-4xl">Editar Proyecto: {nombre}</h1>
            <div className="mt-10 flex justify-center">
                <FormularioProyecto />
            </div>
        </>
    )
}

export default EditarProyecto