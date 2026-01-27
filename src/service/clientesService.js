import { apiRest } from './apiRest';
import { authenticatedFetch } from '../utils/authenticatedFetch';

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

    const response = await authenticatedFetch(apiUrl);

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
    const vendedor_id = localStorage.getItem('user_id');

    const response = await authenticatedFetch(`${apiRest}/cliente`, {
      method: 'POST',
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
    const response = await authenticatedFetch(`${apiRest}/cliente/${customerId}`, {
      method: 'PUT',
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
    const response = await authenticatedFetch(`${apiRest}/cliente`);

    if (!response.ok) {
      throw new Error('Error al obtener clientes');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getAllCustomers:', error);
    throw error;
  }
};
