import React, { useEffect } from "react";
import "../Components/categorias.css";
import { useState } from "react";

export const TodasLasCategorias = () => {
    const [categorias, setCategorias] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
   

    const fetchCategorias = async () => {
        try {
            const response = await fetch('http://localhost:3001/categoria', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            });

            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            

            const data = await response.json();
            setCategorias(data);
            setLoading(false);
        } catch (error) {
            console.error("Error detallado:", error);
            setError(`No se pudo conectar con el servidor. Verifica que el servidor esté corriendo en el puerto 3001: ${error.message}`);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategorias();
    }, []);

    // Función para reintentar la conexión
    const handleRetry = () => {
        setLoading(true);
        setError(null);
        fetchCategorias();
    };

    if (loading) {
        return (
            <div className="loading-container">
                <p>Cargando categorías...</p>
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
        <div className="categorias-container">
            <div className="categorias-lista">
                {categorias.map((categoria) => (
                    <div key={categoria.id} className="categorias-item">
                    <h3>{categoria.nombre}</h3>
                    <p>{categoria.descripcion}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
