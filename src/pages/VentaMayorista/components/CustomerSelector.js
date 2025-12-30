import React, { useState, useEffect } from 'react';
import { getWholesaleCustomers } from '../../../service/clientesService';

/**
 * Component for selecting wholesale customers
 * @param {Object} props
 * @param {Function} props.onSelectCustomer - Callback when customer is selected
 * @param {number} props.selectedCustomerId - Currently selected customer ID
 */
export default function CustomerSelector({ onSelectCustomer, selectedCustomerId }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const vendedorId = localStorage.getItem('user_id');
      const data = await getWholesaleCustomers(vendedorId);
      setCustomers(data);
    } catch (error) {
      console.error('Error cargando clientes:', error);
      setError('Error al cargar clientes. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const customerId = e.target.value ? parseInt(e.target.value) : null;
    const customer = customers.find(c => c.id === customerId);
    onSelectCustomer(customer);
  };

  return (
    <div className="form-group">
      <label htmlFor="customer-select">
        <i className="fas fa-user mr-2"></i>
        Cliente Mayorista *
      </label>

      {loading ? (
        <div className="text-muted">
          <i className="fas fa-spinner fa-spin mr-2"></i>
          Cargando clientes...
        </div>
      ) : error ? (
        <div>
          <div className="alert alert-danger mb-2">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            {error}
          </div>
          <button className="btn btn-sm btn-outline-danger" onClick={fetchCustomers}>
            <i className="fas fa-sync mr-1"></i>
            Reintentar
          </button>
        </div>
      ) : customers.length === 0 ? (
        <div className="alert alert-warning">
          <i className="fas fa-info-circle mr-2"></i>
          No tiene clientes mayoristas registrados. Debe crear un cliente antes de realizar una venta.
          <br />
          <small>Diríjase al menú "CLIENTES" para agregar un nuevo cliente mayorista.</small>
        </div>
      ) : (
        <select
          id="customer-select"
          className="form-control"
          value={selectedCustomerId || ''}
          onChange={handleChange}
          required
        >
          <option value="">-- Seleccione un cliente --</option>
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>
              {customer.nombre}
              {customer.dni_cuit && ` - ${customer.dni_cuit}`}
            </option>
          ))}
        </select>
      )}

      {!loading && !error && customers.length > 0 && (
        <small className="form-text text-muted">
          Total de clientes: {customers.length}
        </small>
      )}
    </div>
  );
}
