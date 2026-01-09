import { apiRest } from './apiRest';

/**
 * Service for category operations
 */

/**
 * Get all categories from the API
 * @returns {Promise<Array>} List of all categories
 * @throws {Error} If the request fails
 */
export const getCategorias = async () => {
  const token = localStorage.getItem('jwt_token');
  const response = await fetch(`${apiRest}/categoria`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Error al obtener categorías');
  }

  return response.json();
};

/**
 * Get only active categories
 * @returns {Promise<Array>} List of active categories
 */
export const getCategoriasActivas = async () => {
  const categorias = await getCategorias();
  return categorias.filter(cat => cat.activo === true);
};
