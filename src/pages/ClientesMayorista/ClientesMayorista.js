import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getWholesaleCustomers, createWholesaleCustomer, updateCustomer } from '../../service/clientesService';

/**
 * Page for managing wholesale customers
 * Allows wholesale sellers to view, create, and edit their own wholesale customers
 */
export default function ClientesMayorista() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    dni: '',
    direccion_local: '',
    direccion_casa: '',
    telefono1: '',
    telefono2: '',
    vendedor_id: '',
    rubro: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const vendedorId = localStorage.getItem('vendedor_id');
      const data = await getWholesaleCustomers(vendedorId);
      setCustomers(data);
    } catch (error) {
      console.error('Error cargando clientes:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los clientes. Por favor intente nuevamente.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      dni: '',
      direccion_local: '',
      direccion_casa: '',
      telefono1: '',
      telefono2: '',
      vendedor_id: '',
      rubro: '',
    });
    setEditingCustomer(null);
    setShowForm(false);
  };

  const handleCreateNew = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (customer) => {
    setFormData({
      nombre: customer.nombre || '',
      dni: customer.dni || '',
      direccion_local: customer.direccion_local || '',
      direccion_casa: customer.direccion_casa || '',
      telefono1: customer.telefono1 || '',
      telefono2: customer.telefono2 || '',
      vendedor_id: customer.vendedor_id || '',
      rubro: customer.rubro || ''
    });
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.nombre.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error de validación',
        text: 'El nombre del cliente es requerido'
      });
      return;
    }

    if (!formData.dni.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error de validación',
        text: 'El DNI del cliente es requerido'
      });
      return;
    }

    if (!formData.telefono1.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error de validación',
        text: 'El teléfono 1 del cliente es requerido'
      });
      return;
    }

    if (!formData.rubro.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error de validación',
        text: 'El rubro del cliente es requerido'
      });
      return;
    }


    try {
      setSubmitting(true);

      if (editingCustomer) {
        // Update existing customer
        await updateCustomer(editingCustomer.id, formData);
        Swal.fire({
          icon: 'success',
          title: '¡Cliente actualizado!',
          text: 'El cliente fue actualizado exitosamente',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        // Create new customer
        await createWholesaleCustomer(formData);
        Swal.fire({
          icon: 'success',
          title: '¡Cliente creado!',
          text: 'El cliente fue creado exitosamente',
          timer: 2000,
          showConfirmButton: false
        });
      }

      resetForm();
      fetchCustomers();
    } catch (error) {
      console.error('Error guardando cliente:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'No se pudo guardar el cliente. Por favor intente nuevamente.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>
                <i className="fas fa-users mr-2"></i>
                Clientes Mayoristas
              </h1>
            </div>
            <div className="col-sm-6 text-right">
              {!showForm && (
                <button className="btn btn-primary" onClick={handleCreateNew}>
                  <i className="fas fa-plus mr-2"></i>
                  Nuevo Cliente
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="content">
        <div className="container-fluid">
          {showForm ? (
            // Form for creating/editing customer
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  {editingCustomer ? 'Editar Cliente' : 'Nuevo Cliente Mayorista'}
                </h3>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Nombre *</label>
                        <input
                          type="text"
                          name="nombre"
                          className="form-control"
                          value={formData.nombre}
                          onChange={handleInputChange}
                          required
                          placeholder="Nombre del cliente"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>DNI / CUIT</label>
                        <input
                          type="text"
                          name="dni"
                          className="form-control"
                          value={formData.dni}
                          onChange={handleInputChange}
                          placeholder="DNI o CUIT"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Teléfono</label>
                        <input
                          type="text"
                          name="telefono"
                          className="form-control"
                          value={formData.telefono}
                          onChange={handleInputChange}
                          placeholder="Número de teléfono"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="correo@ejemplo.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Dirección</label>
                    <input
                      type="text"
                      name="direccion"
                      className="form-control"
                      value={formData.direccion}
                      onChange={handleInputChange}
                      placeholder="Dirección completa"
                    />
                  </div>

                  <div className="form-group">
                    <label>Notas</label>
                    <textarea
                      name="notas"
                      className="form-control"
                      rows="3"
                      value={formData.notas}
                      onChange={handleInputChange}
                      placeholder="Notas adicionales sobre el cliente"
                    ></textarea>
                  </div>

                  <div className="alert alert-info">
                    <i className="fas fa-info-circle mr-2"></i>
                    Este cliente será creado como cliente mayorista y asignado a su cuenta.
                  </div>
                </div>
                <div className="card-footer">
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save mr-2"></i>
                        {editingCustomer ? 'Actualizar' : 'Crear'} Cliente
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary ml-2"
                    onClick={resetForm}
                    disabled={submitting}
                  >
                    <i className="fas fa-times mr-2"></i>
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          ) : (
            // Customer list
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Mis Clientes Mayoristas</h3>
              </div>
              <div className="card-body">
                {loading ? (
                  <div className="text-center py-4">
                    <i className="fas fa-spinner fa-spin fa-2x"></i>
                    <p className="mt-2">Cargando clientes...</p>
                  </div>
                ) : customers.length === 0 ? (
                  <div className="alert alert-info">
                    <i className="fas fa-info-circle mr-2"></i>
                    No tiene clientes mayoristas registrados. Haga clic en "Nuevo Cliente" para agregar uno.
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-striped table-hover">
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th>DNI/CUIT</th>
                          <th>Teléfono</th>
                          <th>Email</th>
                          <th>Dirección</th>
                          <th className="text-center">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers.map(customer => (
                          <tr key={customer.id}>
                            <td><strong>{customer.nombre}</strong></td>
                            <td>{customer.dni || '-'}</td>
                            <td>{customer.telefono || '-'}</td>
                            <td>{customer.email || '-'}</td>
                            <td>{customer.direccion || '-'}</td>
                            <td className="text-center">
                              <button
                                className="btn btn-sm btn-info"
                                onClick={() => handleEdit(customer)}
                                title="Editar cliente"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              {customers.length > 0 && (
                <div className="card-footer">
                  <small className="text-muted">
                    Total de clientes: {customers.length}
                  </small>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
