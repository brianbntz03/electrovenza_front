# Especificación Actualizada: Tipo Movimiento CC

## Cambios Principales

### Estructura de Datos Actualizada
```javascript
const TipoMovimientoCCSchema = {
  id: 'number',
  nombre: 'string',        // Ej: "Pago de cuota"
  signo: '+ | -',         // "+" o "-"
  internal: 'boolean',    // true o false
  fecha_creacion: 'ISO string',
  fecha_actualizacion: 'ISO string'
};
```

### Diseño de Página
- **Página principal**: Listado completo de tipos de movimiento
- **Botón "Nuevo"**: Link para mostrar formulario de creación
- **Sin filtros**: Muestra todos los tipos de movimiento (internal true y false)

## Componente de Creación Actualizado

```javascript
// src/Components/Crear/CrearTipoMovimientoCC.js
const CrearTipoMovimientoCC = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    signo: '+',
    internal: false
  });

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Nombre *</label>
        <input
          type="text"
          className="form-control"
          value={formData.nombre}
          onChange={(e) => setFormData({...formData, nombre: e.target.value})}
          required
          placeholder="Ej: Pago de cuota"
        />
      </div>
      
      <div className="form-group">
        <label>Signo *</label>
        <select
          className="form-control"
          value={formData.signo}
          onChange={(e) => setFormData({...formData, signo: e.target.value})}
          required
        >
          <option value="+">+ (Positivo)</option>
          <option value="-">- (Negativo)</option>
        </select>
      </div>
      
      <div className="form-check">
        <input
          type="checkbox"
          className="form-check-input"
          checked={formData.internal}
          onChange={(e) => setFormData({...formData, internal: e.target.checked})}
        />
        <label className="form-check-label">Internal</label>
      </div>
      
      <button type="submit" className="btn btn-primary">
        Crear Tipo Movimiento
      </button>
    </form>
  );
};
```

## Listado Actualizado

```javascript
// src/Components/tablasListado/ListadoTipoMovimientoCC.js
const ListadoTipoMovimientoCC = ({ refresh }) => {
  const fetchTiposMovimiento = async () => {
    try {
      const response = await api.get('/tipo-movimiento'); // Sin filtros
      setTiposMovimiento(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Signo</th>
          <th>Internal</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {tiposMovimiento.map(item => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.nombre}</td>
            <td>
              <span className={`badge ${item.signo === '+' ? 'badge-success' : 'badge-danger'}`}>
                {item.signo}
              </span>
            </td>
            <td>
              <span className={`badge ${item.internal ? 'badge-primary' : 'badge-secondary'}`}>
                {item.internal ? 'Sí' : 'No'}
              </span>
            </td>
            <td>
              <button onClick={() => setEditingItem(item)}>Editar</button>
              <button onClick={() => handleDelete(item.id)}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

## Página Principal Actualizada

```javascript
// src/pages/PageTipoMovimientoCC.js
const PageTipoMovimientoCC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <h1>Tipos de Movimiento CC</h1>
      </div>

      <section className="content">
        <div className="card">
          <div className="card-header">
            <h3>Listado de Tipos de Movimiento</h3>
            <button 
              className="btn btn-primary btn-sm float-right"
              onClick={() => setShowCreateForm(true)}
            >
              <i className="fas fa-plus"></i> Nuevo Tipo Movimiento
            </button>
          </div>
          <div className="card-body">
            <ListadoTipoMovimientoCC refresh={refreshList} />
          </div>
        </div>
        
        {showCreateForm && (
          <div className="card mt-3">
            <div className="card-header">
              <h3>Crear Nuevo Tipo Movimiento</h3>
              <button 
                className="btn btn-secondary btn-sm float-right"
                onClick={() => setShowCreateForm(false)}
              >
                Cancelar
              </button>
            </div>
            <div className="card-body">
              <CrearTipoMovimientoCC onSuccess={handleCreateSuccess} />
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
```

## Modal de Edición Actualizado

```javascript
// src/Components/modals/EditarTipoMovimientoCCModal.js
const EditarTipoMovimientoCCModal = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: item.nombre,
    signo: item.signo,
    internal: item.internal
  });

  return (
    <div className="modal show d-block">
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5>Editar Tipo Movimiento CC</h5>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Signo *</label>
                <select
                  className="form-control"
                  value={formData.signo}
                  onChange={(e) => setFormData({...formData, signo: e.target.value})}
                  required
                >
                  <option value="+">+ (Positivo)</option>
                  <option value="-">- (Negativo)</option>
                </select>
              </div>
              
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={formData.internal}
                  onChange={(e) => setFormData({...formData, internal: e.target.checked})}
                />
                <label className="form-check-label">Internal</label>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" onClick={onClose}>Cancelar</button>
              <button type="submit">Guardar Cambios</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
```

## Servicio API Actualizado

```javascript
// src/service/tipoMovimientoCCService.js
export const tipoMovimientoCCService = {
  getAll: () => 
    api.get('/tipo-movimiento'), // Sin filtros
  
  create: (data) => 
    api.post('/tipo-movimiento', data), // Envía data tal como viene
  
  update: (id, data) => 
    api.put(`/tipo-movimiento/${id}`, data), // Envía data tal como viene
  
  delete: (id) => 
    api.delete(`/tipo-movimiento/${id}`)
};
```

## Validaciones Actualizadas

```javascript
const tipoMovimientoCCValidation = {
  nombre: {
    required: true,
    minLength: 3,
    maxLength: 100
  },
  signo: {
    required: true,
    enum: ['+', '-']
  },
  internal: {
    type: 'boolean'
  }
};
```

## Ejemplo de Datos

```javascript
// Ejemplo de tipo de movimiento a crear
const ejemploTipoMovimiento = {
  "nombre": "Pago de cuota",
  "signo": "+",
  "internal": false
};
```

## Características Finales

1. **Listado Principal**: Página muestra todos los tipos de movimiento
2. **Botón Crear**: Link que despliega formulario de creación
3. **Campos Simplificados**: Solo nombre, signo (+/-) e internal (true/false)
4. **Sin Filtros**: API consume endpoint sin parámetros de filtro
5. **Edición Completa**: Modal permite editar todos los campos
6. **Validaciones**: Nombre requerido, signo requerido, internal opcional