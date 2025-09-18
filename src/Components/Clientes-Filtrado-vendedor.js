import { NavLink } from "react-router-dom";
import { ListadoClientesFiltradoVendedor } from "./listadoClienteFiltradoVendedor";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const Clientes_filtrado_vendedor = () => {
  const [vendedorId, setVendedorId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setVendedorId(decodedToken.id);
      } catch (error) {
        console.error("Error decodificando el token:", error);
      }
    }
  }, []); 
  
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Clientes</h3>
        <div className="card-tools">
          
          <NavLink to="/crearclienteFiltrado" className="btn btn-sm btn-info float-right">Crear Cliente Filtrado</NavLink>
        </div>
      </div>
      <div className="card-body table-responsive p-0">
        <ListadoClientesFiltradoVendedor vendedorId={vendedorId} />
      </div>
    </div>
  );
};

export default Clientes_filtrado_vendedor;