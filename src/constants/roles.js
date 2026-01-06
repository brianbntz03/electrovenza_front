// Role constants for ElectroVenza system
export const ROLES = {
  ADMIN: 'administrador',
  RETAIL_SELLER: 'vendedor_minorista',
  WHOLESALE_SELLER: 'Vendedor Mayorista'
};

/**
 * Check if user has one of the allowed roles
 * @param {string} userRole - Current user's role
 * @param {Array<string>} allowedRoles - Array of allowed roles
 * @returns {boolean} True if user has allowed role
 */
export const hasRole = (userRole, allowedRoles) => {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
};

/**
 * Check if user is a wholesale seller
 * @param {string} userRole - Current user's role
 * @returns {boolean} True if user is wholesale seller
 */
export const isWholesaleSeller = (userRole) => userRole === ROLES.WHOLESALE_SELLER;

/**
 * Check if user is a retail seller
 * @param {string} userRole - Current user's role
 * @returns {boolean} True if user is retail seller
 */
export const isRetailSeller = (userRole) => userRole === ROLES.RETAIL_SELLER;

/**
 * Check if user is an administrator
 * @param {string} userRole - Current user's role
 * @returns {boolean} True if user is administrator
 */
export const isAdmin = (userRole) => userRole === ROLES.ADMIN;
