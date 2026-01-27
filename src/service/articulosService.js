import { apiRest } from './apiRest';
import { authenticatedFetch } from '../utils/authenticatedFetch';

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
    const queryParams = new URLSearchParams(filters).toString();
    const url = `${apiRest}/articulos${queryParams ? `?${queryParams}` : ''}`;

    const response = await authenticatedFetch(url);

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

/**
 * Get articles by category ID
 * @param {number|string} categoryId - The category ID
 * @returns {Promise<Array>} List of articles in the category
 * @throws {Error} If the request fails
 */
export const getArticulosByCategoria = async (categoryId) => {
  const response = await authenticatedFetch(
    `${apiRest}/articulos/by-category-id/${categoryId}`
  );

  if (response.status === 404) {
    throw new Error('Categoría no encontrada');
  }

  if (!response.ok) {
    throw new Error('Error al obtener artículos');
  }

  return response.json();
};

/**
 * Get only active articles by category
 * @param {number|string} categoryId - The category ID
 * @returns {Promise<Array>} List of active articles
 */
export const getArticulosActivosByCategoria = async (categoryId) => {
  const articulos = await getArticulosByCategoria(categoryId);
  return articulos.filter(art => art.activo === true);
};
