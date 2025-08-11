import React, { useState, useEffect } from "react";
import { apiRest } from "../../service/apiRest";

export function EditaProductoModal({ producto, onClose, onProductosActualizado }) {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    precio: "",
    idCategoria: "", // Changed from categoria_id
  });
  const [error, setError] = useState(null);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre || "",
        telefono: producto.telefono || "",
        precio: producto.precio || "",
        idCategoria: producto.categoria ? String(producto.categoria.id) : "", // Changed from categoria_id
      });
    }
  }, [producto]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(`${apiRest}/categoria`);
        if (!response.ok) {
          throw new Error("No se pudo obtener la lista de categorias");
        }
        const data = await response.json();
        setCategorias(data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchCategorias();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Enviando datos para actualizar producto:", formData);
      const response = await fetch(`${apiRest}/articulos/${producto.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al actualizar el producto: ${response.status} - ${errorText}`);
      }

      const productoActualizado = await response.json();
      const categoriaSeleccionada = categorias.find(
        (cat) => String(cat.id) === formData.idCategoria
      );
      const productoConCategoriaCompleta = {
        ...productoActualizado,
        categoria: categoriaSeleccionada || null,
      };
      
      console.log("Producto actualizado exitosamente:", productoConCategoriaCompleta);
      onProductosActualizado(productoConCategoriaCompleta);
      onClose();
    } catch (error) {
      setError(error.message);
    }
  };

  if (!producto) {
    return null;
  }

  return (
    <div
      className="modal fade show"
      style={{ display: "block" }}
      tabIndex="-1"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Producto</h5>
            <button
              type="button"
              className="close"
              onClick={onClose}
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div
            className="modal-body"
            style={{ maxHeight: "60vh", overflowY: "auto" }}
          >
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Categoria</label>
                <select
                  className="form-control"
                  name="idCategoria"
                  value={formData.idCategoria}
                  onChange={handleChange}
                >
                  <option value="">Seleccione una Categoria</option>
                  {categorias && categorias.map((categoria) => (
                    <option key={categoria.id} value={String(categoria.id)}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>precio</label>
                <input
                  type="text"
                  className="form-control"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}