import { apiRest } from './apiRest';

/**
 * Service for product operations
 */

/**
 * Get all products with optional filters
 * @param {Object} filters - Optional filters
 * @param {boolean} filters.precio_mayorista_required - Only products with wholesale price
 * @returns {Promise} API response with product list
 */
export const getArticulos = async (filters = {
  page: 1,
  limit: 10000000000000,
}) => {
  try {
    const token = localStorage.getItem('jwt_token');
    const queryParams = new URLSearchParams(filters).toString();
    const url = `${apiRest}/articulos${queryParams ? `?${queryParams}` : ''}`;

    const response = await fetch(url, {
      headers: {
          method: 'GET',
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        }});
    //console.log(await response.json());

    if (!response.ok) {
      throw new Error('Error al obtener artículos');
    }

    return (await response.json()).data;
  } catch (error) {
    console.error('Error en getArticulos:', error);
    throw error;
  }
};

/**
 * Get products with wholesale pricing only
 * @returns {Promise} API response with product list
 */
export const getArticulosMayorista = async () => {
  return getArticulos();
};
