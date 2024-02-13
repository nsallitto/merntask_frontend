import { useState } from 'react'
import { useParams } from 'react-router-dom';
import useProyectos from '../hooks/useProyectos';
import Alerta from './Alerta';

const FormularioProyecto = () => {

    const params = useParams();
    const { id } = params;
    const { mostrarAlerta, alerta, submitProyecto, actualizarProyecto, proyecto } = useProyectos();

    const [nombre, setNombre] = useState(id ? proyecto.nombre : "");
    const [descripcion, setDescripcion] = useState(id ? proyecto.descripcion : "");
    const [fechaEntrega, setFechaEntrega] = useState(id ? proyecto.fechaEntrega?.split("T")[0] : "");
    const [cliente, setCliente] = useState(id ? proyecto.cliente : "");
    //----------------------------------------------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();

        if ([nombre, descripcion, fechaEntrega, cliente].includes("")) {
            mostrarAlerta({
                msg: "Todos los campos son obligatorios",
                error: true
            })
            return
        }
        if (id) {
            await actualizarProyecto({ nombre, descripcion, fechaEntrega, cliente, id })

        } else {
            await submitProyecto({ nombre, descripcion, fechaEntrega, cliente })
            setNombre("");
            setDescripcion("");
            setFechaEntrega("");
            setCliente("");
        }   
    }
    
    const { msg } = alerta;

    return (
        <form
            onSubmit={handleSubmit}
            className='bg-white py-10 px-5 md:w-1/2 rounded-lg shadow'
        >
            {msg && <Alerta alerta={alerta} />}
            <div className='mb-5'>
                <label
                    className='text-gray-700 uppercase font-bold text-sm'
                    htmlFor="nombre"
                >
                    Nombre Proyecto
                </label>
                <input
                    className='border w-full p-2 mt-2 placeholder-gray-400'
                    id='nombre'
                    type="text"
                    placeholder='Nombre del Proyecto'
                    value={nombre}
                    onChange={(e) => { setNombre(e.target.value) }}
                />
            </div>

            <div className='mb-5'>
                <label
                    className='text-gray-700 uppercase font-bold text-sm'
                    htmlFor="descripcion"
                >
                    Descripcion
                </label>
                <textarea
                    className='border w-full p-2 mt-2 placeholder-gray-400'
                    id='descripcion'
                    placeholder='Descripcion del Proyecto'
                    value={descripcion}
                    onChange={(e) => { setDescripcion(e.target.value) }}
                />
            </div>

            <div className='mb-5'>
                <label
                    className='text-gray-700 uppercase font-bold text-sm'
                    htmlFor="fecha"
                >
                    Fecha de Entrega
                </label>
                <input
                    className='border w-full p-2 mt-2 placeholder-gray-400'
                    id='fecha'
                    type="date"
                    value={fechaEntrega}
                    onChange={(e) => { setFechaEntrega(e.target.value) }}
                />
            </div>

            <div className='mb-5'>
                <label
                    className='text-gray-700 uppercase font-bold text-sm'
                    htmlFor="cliente"
                >
                    Nombre CLiente
                </label>
                <input
                    className='border w-full p-2 mt-2 placeholder-gray-400'
                    id='cliente'
                    type="text"
                    placeholder='Nombre del Cliente'
                    value={cliente}
                    onChange={(e) => { setCliente(e.target.value) }}
                />
            </div>
            <input
                className='bg-sky-600 w-full p-2 rounded mt-5 text-white font-bold uppercase hover:bg-sky-800 cursor-pointer transition-colors'
                type="submit"
                value={params.id ? "Editar Proyecto" : "Crear Proyecto"}
            />
        </form>
    )
}

export default FormularioProyecto