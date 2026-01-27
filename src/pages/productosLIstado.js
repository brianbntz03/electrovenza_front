import { NavLink } from "react-router-dom";
import { ListadoProducto } from "../Components/tablasListado/ListadoProducto";
import { apiRest } from "../service/apiRest";
import { authenticatedFetch } from "../utils/authenticatedFetch";

const PageProductosListado = () => {
  const producto = ListadoProducto();

  const handleExport = async () => {
    try {
      const response = await authenticatedFetch(`${apiRest}/articulos/export`, {
        method: "GET",
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "productos.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al exportar:", error);
    }
  };

  return (
    <div className="card">
      <div className="card-header border-0">
        <h3 className="card-title">Productos</h3>
        <div className="card-tools">
          <button
            type="button"
            className="btn btn-sm btn-success float-right mr-2"
            onClick={handleExport}
          >
            Exportar <i className="fas fa-download" />
          </button>
          <NavLink
            to="/crearProducto"
            className="btn btn-sm btn-info float-right mr-2"
          >
            Crear{" "}
          </NavLink>
        </div>
      </div>
      <div className="card-body table-responsive p-0">{producto}</div>
    </div>
  );
};

export default PageProductosListado;
