import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import clienteAxios from "../config/clienteAxios";
import Alerta from "../components/Alerta";

const ConfirmarCuenta = () => {

  const [alerta, setAlerta] = useState({});
  const [cuentaConfirmada, setCuentaConfirmada] = useState(false);

  const params = useParams()
  const { id } = params;

  useEffect(() => {
    const confirmarCuenta = async () => {
      try {
        const url = `/usuarios/confirmar/${id}`
        const { data } = await clienteAxios.get(url);
        setAlerta({
          msg: data.msg,
          error: false
        });
        setCuentaConfirmada(true);

      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true
        })
      }
    }
    confirmarCuenta();
  }, [])
  const { msg } = alerta;

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
        valida tu cuenta y accede a tus <span className="text-slate-700">Proyectos</span>
      </h1>
      <div>
        {msg && <Alerta alerta={alerta} />}

        {cuentaConfirmada && (
          <Link
            className="block text-center my-5 text-slate-500 uppercase text-sm"
            to="/"
          >
            Inicia Sesion
          </Link>
        )}
      </div>

    </>
  )
}

export default ConfirmarCuenta