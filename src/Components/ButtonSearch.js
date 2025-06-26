import { useState } from 'react'

export default function ButtonSearch() {
  const [search, setSearch] = useState('')
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [busqueda, setBusqueda] = useState("")

  const handleSearch = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:3001/articulos/find')
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`)
      }
      const data = await response.json()
      setData(data)
    } catch (error) {
      console.error("Error detallado:", error)
      setError(`No se pudo conectar con el servidor. Verifica que el servidor esté corriendo en el puerto 3001: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    setError(null)
    handleSearch()
  }

  const handleSearchChange = (e) => {
    setBusqueda(e.target.value)
  }

  const handleSearchClick = () => {
    handleSearch(busqueda)
  }

  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando artículos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error de conexión</h3>
        <p>{error}</p>
        <button onClick={handleRetry}>Reintentar</button>
      </div>
    )
  }
  if (data) {
    return (
      <div className="data-container">
        <h3>Datos obtenidos:</h3>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    )
  }
  if (busqueda) {
    return (
      <div className="search-container">
        <input type="text" value={busqueda} onChange={handleSearchChange} />
        <button onClick={handleSearchClick}>Buscar</button>
      </div>
    )
  }
  

  return (
    <button onClick={handleSearch}>buscar</button>
  )
}
