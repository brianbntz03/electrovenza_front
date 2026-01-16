import { apiRest } from './apiRest';

/**
 * Service for wholesale sales operations
 */

/**
 * Create a new wholesale sale
 * @param {Object} saleData - Sale data
 * @param {number} saleData.cliente_id - Customer ID
 * @param {Array} saleData.articulos - Array of sale items
 * @param {number} saleData.articulos[].id - Product ID
 * @param {number} saleData.articulos[].cantidad - Quantity
 * @returns {Promise} API response with created sale
 */
export const createVentaMayorista = async (saleData) => {
  try {
    const token = localStorage.getItem('jwt_token');
    const vendedor_id = localStorage.getItem('vendedor_id');

    const response = await fetch(`${apiRest}/ventas-mayorista`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ...saleData,
        vendedor_id: parseInt(vendedor_id),
        fecha: new Date().toISOString(),
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear la venta mayorista');
    }

    return await response.text();
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
    const queryParams = new URLSearchParams(filters).toString();
    const url = `${apiRest}/ventas-mayorista${queryParams ? `?${queryParams}` : ''}`;

    const response = await fetch(url, {
          method: 'GET',
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
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
