# Especificación: Tipo Movimiento CC - Administrador

## Descripción General
Nueva funcionalidad para administradores que permite gestionar tipos de movimientos de Cuenta Corriente con valor "internal" = False.

## Ubicación en Menú
- **Menú Principal**: CONFIGURACION
- **Submenú**: Tipo Mov CC
- **Rol**: Solo ADMIN

## Estructura de Archivos

### Componentes Requeridos
```
src/Components/
├── Crear/CrearTipoMovimientoCC.js          # Formulario de creación
├── tablasListado/ListadoTipoMovimientoCC.js # Tabla de listado
└── modals/EditarTipoMovimientoCCModal.js    # Modal de edición

src/pages/
└── PageTipoMovimientoCC.js                  # Página principal
```

## API Endpoint
- **Base URL**: `${REACT_APP_API_URL}/tipo-movimiento`
- **Métodos**: GET, POST, PUT, DELETE
- **Filtro**: `internal = false`

## Estructura de Datos

### Modelo TipoMovimientoCC
```javascript
const TipoMovimientoCCSchema = {
  nombre: 'string',     // Nombre del tipo de movimiento
  signo: '+ | -',      // Solo puede ser '+' o '-'
  internal: false      // Siempre false (fijo)
};
```

## Componente de Creación

### CrearTipoMovimientoCC.js
```javascript
// src/Components/Crear/CrearTipoMovimientoCC.js
import React, { useState } from 'react';
import api from '../../service/apiRest';

const CrearTipoMovimientoCC = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    signo: '+',
    internal: false // Siempre false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tipo-movimiento', formData);
      onSuccess();
      setFormData({
        nombre: '',
        signo: '+',
        internal: false
      });
    } catch (error) {
      console.error('Error al crear tipo movimiento:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="card-header">
        <h3>Crear Tipo Movimiento CC</h3>
      </div>
      <div className="card-body">
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
      </div>
      <div className="card-footer">
        <button type="submit" className="btn btn-primary">
          Crear Tipo Movimiento
        </button>
      </div>
    </form>
  );
};

export default CrearTipoMovimientoCC;
```

## Componente de Listado

### ListadoTipoMovimientoCC.js
```javascript
// src/Components/tablasListado/ListadoTipoMovimientoCC.js
import React, { useState, useEffect } from 'react';
import api from '../../service/apiRest';
import EditarTipoMovimientoCCModal from '../modals/EditarTipoMovimientoCCModal';

const ListadoTipoMovimientoCC = ({ refresh }) => {
  const [tiposMovimiento, setTiposMovimiento] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);

  const fetchTiposMovimiento = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tipo-movimiento', {
        params: { internal: false }
      });
      setTiposMovimiento(response.data);
    } catch (error) {
      console.error('Error al cargar tipos de movimiento:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTiposMovimiento();
  }, [refresh]);

  const handleDelete = async (nombre) => {
    if (window.confirm(`¿Está seguro de eliminar "${nombre}"?`)) {
      try {
        await api.delete(`/tipo-movimiento/${nombre}`);
        fetchTiposMovimiento();
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  };

  if (loading) return <div className="text-center">Cargando...</div>;

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h3>Tipos de Movimiento CC</h3>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Signo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tiposMovimiento.map((item, index) => (
                  <tr key={index}>
                    <td>{item.nombre}</td>
                    <td>
                      <span className={`badge ${item.signo === '+' ? 'badge-success' : 'badge-danger'}`}>
                        {item.signo}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary mr-2"
                        onClick={() => setEditingItem(item)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(item.nombre)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {editingItem && (
        <EditarTipoMovimientoCCModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSuccess={() => {
            setEditingItem(null);
            fetchTiposMovimiento();
          }}
        />
      )}
    </>
  );
};

export default ListadoTipoMovimientoCC;
```

## Modal de Edición

### EditarTipoMovimientoCCModal.js
```javascript
// src/Components/modals/EditarTipoMovimientoCCModal.js
import React, { useState } from 'react';
import api from '../../service/apiRest';

const EditarTipoMovimientoCCModal = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: item.nombre,
    signo: item.signo,
    internal: false // Siempre false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/tipo-movimiento/${item.nombre}`, formData);
      onSuccess();
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Editar Tipo Movimiento CC</h5>
              <button type="button" className="close" onClick={onClose}>
                <span>&times;</span>
              </button>
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
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Actualizar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditarTipoMovimientoCCModal;
```

## Página Principal

### PageTipoMovimientoCC.js
```javascript
// src/pages/PageTipoMovimientoCC.js
import React, { useState } from 'react';
import CrearTipoMovimientoCC from '../Components/Crear/CrearTipoMovimientoCC';
import ListadoTipoMovimientoCC from '../Components/tablasListado/ListadoTipoMovimientoCC';

const PageTipoMovimientoCC = () => {
  const [refresh, setRefresh] = useState(0);

  const handleSuccess = () => {
    setRefresh(prev => prev + 1);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-4">
          <CrearTipoMovimientoCC onSuccess={handleSuccess} />
        </div>
        <div className="col-md-8">
          <ListadoTipoMovimientoCC refresh={refresh} />
        </div>
      </div>
    </div>
  );
};

export default PageTipoMovimientoCC;target.value})}
                  required
                  maxLength={100}
                />
              </div>
              
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  className="form-control"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  maxLength={255}
                />
              </div>
              
              <div className="form-group">
                <label>Tipo *</label>
                <select
                  className="form-control"
                  value={formData.tipo}
                  onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                  required
                >
                  <option value="debito">Débito</option>
                  <option value="credito">Crédito</option>
                </select>
              </div>
              
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={formData.activo}
                  onChange={(e) => setFormData({...formData, activo: e.target.checked})}
                />
                <label className="form-check-label">Activo</label>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditarTipoMovimientoCCModal;
```

## Página Principal

### PageTipoMovimientoCC.js
```javascript
// src/pages/PageTipoMovimientoCC.js
import React, { useState } from 'react';
import CrearTipoMovimientoCC from '../Components/Crear/CrearTipoMovimientoCC';
import ListadoTipoMovimientoCC from '../Components/tablasListado/ListadoTipoMovimientoCC';

const PageTipoMovimientoCC = () => {
  const [refreshList, setRefreshList] = useState(0);

  const handleCreateSuccess = () => {
    setRefreshList(prev => prev + 1);
  };

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Tipos de Movimiento CC</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">Configuración</li>
                <li className="breadcrumb-item active">Tipo Mov CC</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              <CrearTipoMovimientoCC onSuccess={handleCreateSuccess} />
            </div>
            <div className="col-md-8">
              <ListadoTipoMovimientoCC refresh={refreshList} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PageTipoMovimientoCC;
```

## Servicio API

### tipoMovimientoCCService.js
```javascript
// src/service/tipoMovimientoCCService.js
import api from './apiRest';

export const tipoMovimientoCCService = {
  getAll: () => 
    api.get('/tipo-movimiento', { params: { internal: true } }),
  
  getById: (id) => 
    api.get(`/tipo-movimiento/${id}`),
  
  create: (data) => 
    api.post('/tipo-movimiento', { ...data, internal: true }),
  
  update: (id, data) => 
    api.put(`/tipo-movimiento/${id}`, { ...data, internal: true }),
  
  delete: (id) => 
    api.delete(`/tipo-movimiento/${id}`)
};
```

## Configuración de Menú

### Actualización del Sidebar (Aside.js)
```javascript
// Agregar en src/Components/Aside.js dentro del menú CONFIGURACION
{userRole === 'ADMIN' && (
  <li className="nav-item">
    <Link to="/tipo-movimiento-cc" className="nav-link">
      <i className="nav-icon fas fa-exchange-alt"></i>
      <p>Tipo Mov CC</p>
    </Link>
  </li>
)}
```

## Ruta de Navegación

### App.js - Agregar Ruta
```javascript
// Agregar en App.js
import PageTipoMovimientoCC from './pages/PageTipoMovimientoCC';

// Dentro del Router
<Route 
  path="/tipo-movimiento-cc" 
  element={
    <PrivateRoute requiredRole="ADMIN">
      <PageTipoMovimientoCC />
    </PrivateRoute>
  } 
/>
```

## Validaciones

### Reglas de Validación
```javascript
const tipoMovimientoCCValidation = {
  nombre: {
    required: true,
    minLength: 3,
    maxLength: 100,
    pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
  },
  descripcion: {
    maxLength: 255
  },
  tipo: {
    required: true,
    enum: ['debito', 'credito']
  },
  internal: {
    fixed: true // Siempre true
  }
};
```

## Permisos

### Restricciones de Acceso
- **Solo ADMIN** puede acceder a esta funcionalidad
- **Menú visible** únicamente para administradores
- **Ruta protegida** con validación de rol
- **API endpoints** con validación de permisos en backend

## Características Principales

1. **CRUD Completo**: Crear, leer, actualizar y eliminar tipos de movimiento
2. **Filtro Automático**: Solo muestra movimientos con `internal = true`
3. **Validaciones**: Formularios con validación en tiempo real
4. **Interfaz Responsiva**: Compatible con AdminLTE
5. **Confirmaciones**: Diálogos de confirmación para eliminación
6. **Estados Visuales**: Badges para tipo y estado activo/inactivo