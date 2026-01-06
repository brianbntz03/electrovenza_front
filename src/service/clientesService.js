import { apiRest } from './apiRest';

/**
 * Service for customer management operations
 */

/**
 * Get wholesale customers for current seller
 * @param {number} vendedorId - Seller ID
 * @returns {Promise} API response with customer list
 */
export const getWholesaleCustomers = async (vendedorId) => {
  try {
    const apiUrl = `${apiRest}/cliente`;
    
          const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            },
          });

    if (!response.ok) {
      throw new Error('Error al obtener clientes mayoristas');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getWholesaleCustomers:', error);
    throw error;
  }
};

/**
 * Create a new wholesale customer
 * @param {Object} customerData - Customer data
 * @param {string} customerData.nombre - Customer name (required)
 * @param {string} customerData.dni_cuit - Tax ID
 * @param {string} customerData.telefono - Phone number
 * @param {string} customerData.direccion - Address
 * @param {string} customerData.email - Email
 * @param {string} customerData.notas - Notes
 * @returns {Promise} API response with created customer
 */
export const createWholesaleCustomer = async (customerData) => {
  try {
    const token = localStorage.getItem('auth_token');
    const vendedor_id = localStorage.getItem('user_id');

    const response = await fetch(`${apiRest}/cliente`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ...customerData,
        tipo_cliente: 'mayorista',
        vendedor_asignado_id: parseInt(vendedor_id)
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear cliente');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en createWholesaleCustomer:', error);
    throw error;
  }
};

/**
 * Update an existing customer
 * @param {number} customerId - Customer ID
 * @param {Object} customerData - Updated customer data
 * @returns {Promise} API response with updated customer
 */
export const updateCustomer = async (customerId, customerData) => {
  try {
    const token = localStorage.getItem('auth_token');

    const response = await fetch(`${apiRest}/cliente/${customerId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(customerData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar cliente');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en updateCustomer:', error);
    throw error;
  }
};

/**
 * Get all customers (for admin)
 * @returns {Promise} API response with all customers
 */
export const getAllCustomers = async () => {
  try {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${apiRest}/cliente`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener clientes');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getAllCustomers:', error);
    throw error;
  }
};
