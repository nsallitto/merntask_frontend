import useProyectos from '../hooks/useProyectos'
import PreviewProyecto from '../components/PreviewProyecto';
import Alerta from '../components/Alerta';

const Proyectos = () => {

  const { proyectos, alerta } = useProyectos();

  // useEffect(() => {     //* usamos el hook para que cada vez que se cargue proyectos, cargue socket.io
  //   socket = io( import.meta.env.VITE_BACKEND_URL ) //* le pasamos la url con la que interactua
  //   socket.emit("prueba", proyectos) //* con emit() creamos el evento ( ej: "prueba" ) y luego pasamos los props que va a recibir ( ej: le pasamos los proyectos )
  
  //   socket.on("respuesta", (respuesta) => { //* de la misma manera que recibimos en backend, recibimos en frontend on("nombre evento emitido", props)
  //     console.log("recibimos", respuesta);
  //   })
  // }) //*le sacamos la dependencia para que se ejecute constantemente 

  const { msg } = alerta;

  return (
    <>
      <h1 className='font-black text-4xl'>Proyectos</h1>

      {msg && <Alerta alerta={alerta}/>}

      <div className='bg-white shadow mt-10 rounded-lg mr-3'>
        {proyectos.length ?
          proyectos.map(proyecto => (
            <PreviewProyecto
              key={proyecto._id}
              proyecto={proyecto}
            />
          ))
          : <p className='text-gray-600 uppercase text-center p-5 '>Aun no hay proyectos</p>}
      </div>


    </>
  )
}

export default Proyectos