
export function convertIsoToDMY(isoDate){
  if (!isoDate) return 'No disponible';
  
  const date = new Date(isoDate);
  
  // Verificar si la fecha es válida
  if (isNaN(date.getTime())) {
    return 'Fecha inválida';
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // ¡Mes empieza en 0!
  const year = date.getFullYear();

  const formatted = `${day}/${month}/${year}`;
  return formatted
}

// helper para pasar camelCase -> snake_case
export function toSnakeCase(obj) {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase);
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
      acc[snakeKey] = toSnakeCase(obj[key]);
      return acc;
    }, {});
  }
  return obj;
}