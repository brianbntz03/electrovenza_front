
export function convertIsoToDMY(isoDate){
  const date = new Date(isoDate);

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // ¡Mes empieza en 0!
  const year = date.getUTCFullYear();

  const formatted = `${day}-${month}-${year}`;
  return formatted
}