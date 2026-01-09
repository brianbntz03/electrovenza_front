# Feature Specification: Listado de Artículos por Categoría

**Feature Branch**: `catalogo_mayorista` (feature 004-articulos-categoria)
**Created**: 2026-01-08
**Status**: Draft
**Input**: Crear una página que liste los artículos de una categoría específica. El identificador de categoría se recibe en la URL. La presentación debe ser en formato de módulos/tarjetas estilo e-commerce (similar a Mercado Libre), no como tabla. Cada módulo presenta un artículo con su imagen, nombre, descripción, precio y stock.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visualizar Artículos de una Categoría (Priority: P1)

Como usuario del sistema, quiero ver todos los artículos disponibles de una categoría específica presentados en un formato visual de tarjetas, para poder explorar los productos de forma atractiva y encontrar lo que busco.

**Why this priority**: Esta es la funcionalidad principal de la página. Sin ella, el usuario no puede ver los productos de la categoría seleccionada.

**Independent Test**: Puede probarse accediendo a la página con un ID de categoría válido y verificando que se muestran las tarjetas de artículos con imagen, nombre, descripción, precio y stock.

**Acceptance Scenarios**:

1. **Given** el usuario navegó desde la página de categorías, **When** accede a la página de artículos de una categoría, **Then** ve una colección de tarjetas donde cada una representa un artículo activo de esa categoría.
2. **Given** la categoría tiene artículos registrados, **When** se carga la página, **Then** cada tarjeta muestra: imagen del artículo, nombre destacado, descripción resumida, precio correspondiente al rol del usuario, e indicador de disponibilidad.
3. **Given** existen artículos activos e inactivos en la categoría, **When** se muestra la página, **Then** solo se presentan los artículos marcados como activos.

---

### User Story 2 - Ver Precio Según Rol de Usuario (Priority: P1)

Como usuario del sistema, quiero ver el precio que corresponde a mi tipo de usuario (minorista o mayorista), para conocer el valor real que pagaré por los productos.

**Why this priority**: El precio es información crítica para la decisión de compra y debe ser precisa según el contexto del usuario.

**Independent Test**: Puede probarse iniciando sesión con diferentes roles y verificando que el precio mostrado corresponde al tipo de usuario.

**Acceptance Scenarios**:

1. **Given** el usuario es un vendedor mayorista, **When** visualiza un artículo, **Then** ve el precio mayorista del producto.
2. **Given** el usuario es un vendedor minorista o administrador, **When** visualiza un artículo, **Then** ve el precio minorista del producto.

---

### User Story 3 - Identificar Disponibilidad de Stock (Priority: P2)

Como usuario, quiero ver claramente si un artículo tiene stock disponible, para saber si puedo adquirirlo inmediatamente.

**Why this priority**: La información de stock es importante pero secundaria respecto a poder ver los artículos y sus precios.

**Independent Test**: Puede probarse verificando que los artículos muestran un indicador visual de disponibilidad basado en su cantidad en stock.

**Acceptance Scenarios**:

1. **Given** un artículo tiene stock mayor a cero, **When** se muestra su tarjeta, **Then** se indica visualmente que está disponible.
2. **Given** un artículo tiene stock igual a cero, **When** se muestra su tarjeta, **Then** se indica visualmente que no hay disponibilidad.

---

### User Story 4 - Visualización Responsive del Catálogo (Priority: P3)

Como usuario, quiero que las tarjetas de artículos se adapten a diferentes tamaños de pantalla, para poder explorar el catálogo desde cualquier dispositivo.

**Why this priority**: La experiencia responsive mejora la usabilidad pero no es crítica para la funcionalidad base.

**Independent Test**: Puede probarse redimensionando la ventana o accediendo desde diferentes dispositivos.

**Acceptance Scenarios**:

1. **Given** el usuario accede desde escritorio, **When** ve la página, **Then** las tarjetas se organizan en múltiples columnas (3-4 tarjetas por fila).
2. **Given** el usuario accede desde tablet, **When** ve la página, **Then** las tarjetas se reorganizan a 2 columnas.
3. **Given** el usuario accede desde móvil, **When** ve la página, **Then** las tarjetas se muestran en una sola columna.

---

### User Story 5 - Navegar de Vuelta a Categorías (Priority: P3)

Como usuario, quiero poder volver fácilmente a la lista de categorías, para continuar explorando otras categorías de productos.

**Why this priority**: La navegación de retorno es útil pero los usuarios pueden usar el botón atrás del navegador como alternativa.

**Independent Test**: Puede probarse verificando la presencia de un enlace o botón para volver a categorías.

**Acceptance Scenarios**:

1. **Given** el usuario está en la página de artículos de una categoría, **When** desea volver a categorías, **Then** encuentra un enlace visible que lo lleva de vuelta a la página de categorías.

---

### Edge Cases

- ¿Qué sucede cuando la categoría no tiene artículos activos? El usuario debe ver un mensaje indicando que no hay artículos disponibles en esta categoría.
- ¿Qué sucede si el ID de categoría en la URL no existe o es inválido? El usuario debe ver un mensaje de error apropiado.
- ¿Qué sucede si la carga de artículos falla? El usuario debe ver un mensaje de error con opción de reintentar.
- ¿Qué sucede con descripciones muy largas? El texto debe truncarse en la tarjeta para mantener consistencia visual.
- ¿Qué sucede si un artículo no tiene imagen? Se debe mostrar una imagen placeholder por defecto.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE recibir el identificador de categoría desde la URL para filtrar los artículos.
- **FR-002**: El sistema DEBE mostrar los artículos activos de la categoría como una colección de tarjetas/módulos (no como tabla).
- **FR-003**: Cada tarjeta de artículo DEBE mostrar la imagen del producto.
- **FR-004**: Cada tarjeta de artículo DEBE mostrar el nombre del producto de forma destacada.
- **FR-005**: Cada tarjeta de artículo DEBE mostrar una descripción resumida (truncada si es muy larga).
- **FR-006**: Cada tarjeta DEBE mostrar el precio correspondiente al rol del usuario: precio mayorista para vendedores mayoristas, precio minorista para otros roles.
- **FR-007**: Cada tarjeta DEBE mostrar un indicador de disponibilidad basado en el stock del artículo.
- **FR-008**: El sistema DEBE filtrar y mostrar únicamente los artículos marcados como activos.
- **FR-009**: El sistema DEBE mostrar un mensaje apropiado cuando la categoría no tiene artículos disponibles.
- **FR-010**: El sistema DEBE mostrar un mensaje de error con opción de reintentar si falla la carga de artículos.
- **FR-011**: El sistema DEBE mostrar un mensaje de error si el ID de categoría es inválido o no existe.
- **FR-012**: La disposición de las tarjetas DEBE adaptarse a diferentes tamaños de pantalla.
- **FR-013**: El sistema DEBE mostrar una imagen placeholder cuando un artículo no tiene imagen disponible.
- **FR-014**: El sistema DEBE proveer navegación para volver a la página de categorías.

### Key Entities

- **Artículo**: Representa un producto electrodoméstico dentro de una categoría. Atributos clave para visualización: identificador, nombre, descripción, imagen, precio minorista, precio mayorista, stock, estado activo.
- **Categoría**: Agrupación de artículos. Se utiliza su identificador para filtrar los artículos a mostrar.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Los usuarios pueden ver todos los artículos de una categoría en menos de 3 segundos desde que acceden a la página.
- **SC-002**: El 100% de los usuarios pueden identificar el nombre, imagen y precio de cada artículo sin interacción adicional.
- **SC-003**: Los usuarios ven el precio correcto según su rol (mayorista o minorista) con 100% de precisión.
- **SC-004**: El 100% de los usuarios pueden identificar si un artículo tiene stock disponible.
- **SC-005**: La página es usable en dispositivos con anchos de pantalla desde 320px hasta 1920px.
- **SC-006**: En caso de error de carga, el 100% de los usuarios ven un mensaje claro y pueden reintentar la operación.
- **SC-007**: Los usuarios pueden volver a la página de categorías con un solo clic.

## Assumptions

- Solo los usuarios autenticados pueden acceder a esta página.
- El rol del usuario se obtiene de la sesión actual (consistente con el sistema existente).
- Los artículos inactivos no se muestran en el catálogo público.
- La descripción en las tarjetas se truncará a un máximo razonable (ej: 100-150 caracteres) para mantener consistencia visual.
- El orden de presentación de artículos será el orden natural devuelto por el servidor.
- Las imágenes de artículos están disponibles en el servidor con el nombre especificado en el campo imagen.

## Out of Scope

- Detalle completo de un artículo individual (página de producto).
- Funcionalidad de agregar artículos al carrito desde esta vista.
- Búsqueda o filtrado de artículos dentro de la categoría.
- Ordenamiento de artículos (por precio, nombre, etc.).
- Paginación de artículos (se asume cantidad manejable por categoría).

## Dependencies

- **003-catalogo-categorias**: Esta página es el destino de navegación desde los bloques de categoría.
