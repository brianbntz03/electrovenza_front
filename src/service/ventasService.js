import { apiRest } from './apiRest';

/**
 * Service for wholesale sales operations
 */

/**
 * Create a new wholesale sale
 * @param {Object} saleData - Sale data
 * @param {number} saleData.cliente_id - Customer ID
 * @param {string} saleData.metodo_pago - Payment method (efectivo, transferencia, cheque)
 * @param {Array} saleData.items - Array of sale items
 * @param {number} saleData.items[].articulo_id - Product ID
 * @param {number} saleData.items[].cantidad - Quantity
 * @param {number} saleData.items[].precio_unitario - Unit price (wholesale price)
 * @returns {Promise} API response with created sale
 */
export const createVentaMayorista = async (saleData) => {
  try {
    const token = localStorage.getItem('auth_token');
    const vendedor_id = localStorage.getItem('user_id');

    const response = await fetch(`${apiRest}/ventas-mayorista`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ...saleData,
        vendedor_id: parseInt(vendedor_id),
        tipo_venta: 'mayorista'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear la venta mayorista');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en createVentaMayorista:', error);
    throw error;
  }
};

/**
 * Get wholesale sales list
 * @param {Object} filters - Optional filters
 * @returns {Promise} API response with sales list
 */
export const getVentasMayorista = async (filters = {}) => {
  try {
    const token = localStorage.getItem('auth_token');
    const queryParams = new URLSearchParams(filters).toString();
    const url = `${apiRest}/ventas-mayorista${queryParams ? `?${queryParams}` : ''}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener ventas mayoristas');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getVentasMayorista:', error);
    throw error;
  }
};
