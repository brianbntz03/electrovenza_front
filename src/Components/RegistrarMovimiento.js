import { useState, useEffect } from "react";
import { apiRest } from "../service/apiRest";
import Swal from "sweetalert2";

export function RegistrarMovimieto() {
  // Estado para los datos que vienen de la API para los selects
  const [vendedores, setVendedores] = useState([]);
  const [tiposMovimiento, setTiposMovimiento] = useState([]);

  // Estado para los valores seleccionados en el formulario
  const [vendedorId, setVendedorId] = useState("");
  const [tipoMovimientoId, setTipoMovimientoId] = useState("");
  const [monto, setMonto] = useState("");

  // Estado para la interfaz de usuario (carga, errores)
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Para el envío del formulario
  const [initialLoading, setInitialLoading] = useState(true); // Para la carga inicial de datos

  // Función para cargar los datos iniciales de los selects
  const fetchInitialData = async () => {
    setInitialLoading(true);
    setError(null);
    try {
      // Hacemos las dos peticiones a la API en paralelo para más eficiencia
      const [vendedoresResponse, tiposMovimientoResponse] = await Promise.all([
        fetch(`${apiRest}/vendedor`),
        fetch(`${apiRest}/tipo-movimiento`),
      ]);

      if (!vendedoresResponse.ok || !tiposMovimientoResponse.ok) {
        throw new Error("Error al cargar los datos para el formulario.");
      }

      const { data: vendedoresData } = await vendedoresResponse.json();
      const tiposMovimientoData = await tiposMovimientoResponse.json();

      setVendedores(vendedoresData);
      setTiposMovimiento(tiposMovimientoData);
    } catch (error) {
      setError(`No se pudo cargar la información: ${error.message}`);
    } finally {
      setInitialLoading(false);
    }
  };

  // useEffect se ejecuta cuando el componente se monta para cargar los datos
  useEffect(() => {
    fetchInitialData();
  }, []); // El array vacío asegura que se ejecute solo una vez

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue
    setLoading(true);
    setError(null);

    // Validación simple para asegurar que los campos no estén vacíos
    if (!vendedorId || !tipoMovimientoId || !monto) {
      Swal.fire("Campos incompletos", "Por favor, complete todos los campos.", "warning");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiRest}/cuenta-corriente-movimiento`, { // Asumo que este es el endpoint para crear movimientos
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vendedorId: parseInt(vendedorId),
          tipoMovimientoId: parseInt(tipoMovimientoId),
          monto: parseFloat(monto),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Error desconocido del servidor." }));
        throw new Error(`Error ${response.status}: ${errorData.message}`);
      }

      await response.json();
      Swal.fire("¡Éxito!", "El movimiento ha sido registrado correctamente.", "success");
      
      // Limpiar el formulario después de un registro exitoso
      setVendedorId("");
      setTipoMovimientoId("");
      setMonto("");

    } catch (error) {
      console.error("Error detallado:", error);
      Swal.fire("Error", `No se pudo registrar el movimiento: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  // --- Renderizado del Componente ---

  // 1. Muestra un mensaje mientras se cargan los datos iniciales
  if (initialLoading) {
    return (
      <div className="loading-container text-center p-4">
        <p>Cargando datos del formulario...</p>
      </div>
    );
  }

  // 2. Muestra un error si la carga inicial de datos falló
  if (error) {
    return (
      <div className="error-container text-center p-4">
        <h3>Error de Carga</h3>
        <p>{error}</p>
        <button onClick={fetchInitialData} className="btn btn-primary">
          Intentar nuevamente
        </button>
      </div>
    );
  }

  // 3. Muestra el formulario cuando todo está listo
  return (
  <form onSubmit={handleSubmit}>
  <div className="card-body">
  <div className="row">
    <div className="col-md-4">
      <label> Vendedor : </label>
    </div>
          <div className="col-md-8"> 
            <select
              id="vendedor"
              className="form-control"
              value={vendedorId}
              onChange={(e) => setVendedorId(e.target.value)}
              required
              >
              <option value="">Seleccionar un vendedor</option>
              {vendedores.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.nombre}
                </option>
              ))}
            </select>
    </div>
  </div>

  <div className="row">
          <div className="col-md-4">
          <label> Tipo de Movimiento : </label>
          </div>
          <div className="col-md-8">
            <select
              id="tipoMovimiento"
              className="form-control"
              value={tipoMovimientoId}
              onChange={(e) => setTipoMovimientoId(e.target.value)}
              required
              >
              <option value="">Seleccionar un tipo de movimiento</option>
              {tiposMovimiento.map((tm) => (
                <option key={tm.id} value={tm.id}>
                  {tm.nombre}
                </option>
              ))}
            </select>
          </div>
    </div>

    <div className="row">
      <div className="col-md-4">
      <label>  Monto : </label>
      </div >
      <div className="col-md-8">
            <input
              id="monto"
              type="text"
              className="form-control"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="Ingrese el monto"
              required
              />
              </div>
          </div>
        </div>
        <div className="card-footer">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Guardando..." : "Guardar Movimiento"}
          </button>
        </div>
      </form>
  );
}