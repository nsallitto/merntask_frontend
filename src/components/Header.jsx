import React from 'react'
import { Link } from 'react-router-dom'
import useProyectos from '../hooks/useProyectos';
import useAuth from '../hooks/useAuth';
import ModalBuscador from './ModalBuscador';


const Header = () => {

    const { handleModalBuscador, cerrarSesion } = useProyectos();
    const { cerrarSesionAuth } = useAuth();

    const handleCerrarSesion = () => {
        if (confirm("Estas seguro que deseas cerrar sesion?")) {
            cerrarSesion();
            cerrarSesionAuth();
            localStorage.removeItem("token");
        }
        
    }
    return (
        <header className='px-4 py-5 bg-white border-b'>
            <div className='md:flex md:justify-between '>
                <h2 className='text-4xl text-sky-600 font-black text-center mb-5 md:mb-0'>
                    UpTask
                </h2>
                <div className='flex flex-col items-center gap-4 md:flex-row'>
                    <button
                        type='button'
                        onClick={handleModalBuscador}
                        className='uppercase font-bold'>
                        Buscar Proyecto
                    </button>
                    <Link
                        to="/proyectos"
                        className='uppercase font-bold'
                    >Proyectos</Link>
                    <button
                        className='font-bold uppercase bg-sky-600 text-white text-sm p-2 rounded-md'
                        onClick={handleCerrarSesion}
                    >Cerrar Sesion</button>

                    <ModalBuscador />
                </div>
            </div>
        </header>
    )
}

export default Header