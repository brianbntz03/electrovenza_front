import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { apiRest, publicUrl } from "../../service/apiRest";
import { CUOTA_TYPE_NAMES } from "../../constants/cuotaTypes";

export const CrearCuotaCredito = () => {
  const [numero, setNumero] = useState(0);
  const [descripcion, setDescripcion] = useState("");
  const [interes, setInteres] = useState(0);
  const [tipoCuota, setTipoCuota] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [comisionVendedor, setComisionVendedor] = useState(0);

  const handleRetry = () => {
    setLoading(false);
    setError(null);
  };
  useEffect(() => {
    //MostrarAlerta();
  }, []);

  const MostrarAlerta = () => {
    Swal.fire({
      title: "Crear Cuota",
      text: "la cuota fue creada",
      icon: "success",
      draggable: true,
      timer: 1000,
    }).then(() => {
      window.location.href = `${publicUrl}/SettingCuotasCreditoListado`;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${apiRest}/settings/cuotas_credito`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
        body: JSON.stringify({
          numero: Number(numero),
          descripcion,
          interes: Number(interes),
          tipo_cuota: Number(tipoCuota),
          comision_vendedor: Number(comisionVendedor),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Cuota creada:", data);
      MostrarAlerta();
      setLoading(false);
    } catch (error) {
      console.error("Error detallado:", error);
      setError(
        `No se pudo conectar con el servidor. Verifica que el servidor esté corriendo en el puerto 3001: ${error.message}`
      );
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando cuotas...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="error-container">
        <h3>Error de conexión</h3>
        <p>{error}</p>
        <button onClick={handleRetry} className="retry-button">
          Intentar nuevamente
        </button>
      </div>
    );
  }

  return (
    <>
      <div class="card card-primary">
        <div class="card-header">
          <h3 class="card-title">Crear cuota credito</h3>
        </div>
        <form onSubmit={handleSubmit} style={{ marginBottom: "100px" }}>
          <div class="card-body">
            <div className="form-group">
              <label for="descripcion">Descripcion :</label>
              <input
                class="form-control"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                type="text"
                name="descripcion"
                required
              />
            </div>
            <div className="form-group">
              <label for="numero">Numero de cuotas:</label>
              <input
                class="form-control"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                type="text"
                name="numero"
                required
              />
            </div>
            <div className="form-group">
              <label for="interes">% de Interes :</label>
              <input
                class="form-control"
                value={interes}
                onChange={(e) => setInteres(e.target.value)}
                type="text"
                name="interes"
                required
              />
            </div>

            <div class="form-group">
              <label for="tipo">Tipo :</label>

              <select
                className="form-control"
                value={tipoCuota}
                name="tipoCuota"
                onChange={(e) => setTipoCuota(e.target.value)}
                required
                >
                  <option value="">Seleccione una... </option>
                  { Object.entries(CUOTA_TYPE_NAMES).map(([key, value]) => (
                    <option value={key}>{value}</option>
                  ))}
                </select>
            </div>

            <div className="form-group">
              <label for="interes">% Comision Vendedor:</label>
              <input
                class="form-control"
                value={comisionVendedor}
                onChange={(e) => setComisionVendedor(e.target.value)}
                type="text"
                name="porcentajeVendedor"
                required
              />
            </div>

            <div class="card-footer">
              <button type="submit" class="btn btn-primary" disabled={loading}>
                {loading ? "Creando..." : "Crear cuota"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
