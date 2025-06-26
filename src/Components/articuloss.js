import React from "react";
import { useState, useEffect } from "react";

export const Articuloss = () => {

    const [articulos, setArticulos] = useState();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchArticulos = async () => {
        try {
            const response = await fetch("http://localhost:3001/articulos" );
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status}`);
            }
            const data = await response.json();
            setArticulos(data);
            setLoading(false);
        } catch (error) {
            console.error("Error detallado:", error);
            setError(`No se pudo conectar con el servidor. Verifica que el servidor esté corriendo en el puerto 3001: ${error.message}`);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchArticulos();
    }
    , []);
    // Función para reintentar la conexión
    const handleRetry = () => {
        setLoading(true);
        setError(null);
        fetchArticulos();
    }
    if (loading) {
        return (
            <div className="loading-container">
                <p>Cargando articulos...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div className="error-container">
                <h3>Error de conexión</h3>
                <p>{error}</p>
                <button onClick={handleRetry}>Reintentar</button>
            </div>
        );
    }
    if (!articulos) {
        return (
            <div>
                <h3>No hay articulos disponibles</h3>
            </div>
        );
    }
    

    return (
        <div>
        <p>articulos de Ferreteria</p>
        <table className="table table-striped table-valign-middle table-bordered">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Descripcion</th>
                    <th>Activo</th>
                </tr>
            </thead>
            {articulos.map((articulo) => (
                <tr key={articulo.id}>
                    <td>{articulo.nombre}</td>
                    <td>{articulo.descripcion}</td>
                    <td>{articulo.activo ? "Si" : "No"}</td>
                </tr>
            ))}
            <tfoot>
                <tr>
                    <td colSpan="3">Total articulos: {articulos.length}</td>
                </tr>
            </tfoot>
        </table>
        </div>
    )
}