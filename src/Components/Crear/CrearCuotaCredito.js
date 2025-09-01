import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { apiRest } from "../../service/apiRest";

export const CrearCuotaCredito = () => {
  const [numero, setNumero] = useState(0);
  const [descripcion, setDescripcion] = useState("");
  const [interes, setInteres] = useState(0);
  const [tipoCuota, setTipoCuota] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
      window.location.href = "/SettingCuotasCreditoListado";
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
        },
        body: JSON.stringify({
          numero: Number(numero),
          descripcion,
          interes: Number(interes),
          tipo_cuota: Number(tipoCuota),
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
              <label for="numero">Numero :</label>
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
              <input
                class="form-control"
                value={tipoCuota}
                onChange={(e) => setTipoCuota(e.target.value)}
                type="text"
                name="tipoCuota"
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
