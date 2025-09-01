import React, { useState, useEffect } from "react";
import { apiRest } from "../../service/apiRest";

export function EditaProductoModal({
  producto,
  onClose,
  onProductosActualizado,
}) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    precio_mayorista: 0,
    stock: 0,
    idCategoria: "",
    activo: true,
  });
  const [error, setError] = useState(null);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre || "",
        descripcion: producto.descripcion || "",
        precio: Number(producto.precio) || 0,
        precio_mayorista: Number(producto.precio_mayorista) || 0,
        stock: Number(producto.stock) || 0,
        idCategoria: producto.categoria ? Number(producto.categoria.id) : 0,
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
        // Show active categories AND the product's current category, even if inactive
        const filteredData = data.filter(
          (cat) =>
            cat.activo ||
            (producto && producto.categoria && cat.id === producto.categoria.id)
        );
        setCategorias(filteredData);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchCategorias();
  }, [producto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: name === "idCategoria" ? Number(value) : value,
    }));
  };

  const handleChangeNumber = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: Number(value),
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
        throw new Error(
          `Error al actualizar el producto: ${response.status} - ${errorText}`
        );
      }

      const productoActualizado = await response.json();
      const categoriaSeleccionada = categorias.find(
        (cat) => cat.id === formData.idCategoria
      );
      const productoConCategoriaCompleta = {
        ...productoActualizado,
        categoria: categoriaSeleccionada || null,
      };

      console.log(
        "Producto actualizado exitosamente:",
        productoConCategoriaCompleta
      );
      onProductosActualizado(productoConCategoriaCompleta);
      onClose();
    } catch (error) {
      setError(error.message);
    }
  };

  if (!producto) return null;

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
                <label>Descripción</label>
                <input
                  type="text"
                  className="form-control"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Categoría</label>
                <select
                  className="form-control"
                  name="idCategoria"
                  value={formData.idCategoria}
                  onChange={handleChangeNumber}
                >
                  <option value={0}>Seleccione una Categoria</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Precio minorista</label>
                <input
                  type="number"
                  className="form-control"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChangeNumber}
                />
              </div>
              <div className="form-group">
                <label>Precio mayorista</label>
                <input
                  type="number"
                  className="form-control"
                  name="precio_mayorista"
                  value={formData.precio_mayorista}
                  onChange={handleChangeNumber}
                />
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input
                  type="number"
                  className="form-control"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChangeNumber}
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
