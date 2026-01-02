# Feature Specification: Gestión de Tipo de Vendedor

**Feature Branch**: `002-gestion-tipo-vendedor`
**Created**: 2025-12-30
**Status**: Draft
**Input**: User description: "el adminstrador debe poder definir el tipo de vendedor. Por defecto, los vendedores creados con anterioridad al feature de vendedor mayorista son del tipo vendedor minorista. El administrador debe poder crear o editar vendedores definiendo de que tipo de vendedor se trata, para ello contara con las url de * gestion/vendedores/ para listar y editar vendedores * /gestion/crearvendedores para crear y definiri el tipo de vendedor que estoy creando"

## User Scenarios & Testing

### User Story 1 - Editar Tipo de Vendedor Existente (Priority: P1)

El administrador puede modificar el tipo de un vendedor ya registrado en el sistema, cambiándolo entre vendedor minorista y vendedor mayorista según las necesidades del negocio.

**Why this priority**: Esta es la funcionalidad más crítica porque permite al administrador actualizar vendedores que ya existen en el sistema (que por defecto son minoristas) para convertirlos en mayoristas, habilitando inmediatamente la funcionalidad de ventas mayoristas implementada en el feature 001-vendedor-mayorista.

**Independent Test**: Navegar a `/gestion/vendedores/`, seleccionar un vendedor existente, cambiar su tipo de "Vendedor Minorista" a "Vendedor Mayorista", guardar los cambios, verificar que el cambio se refleja en la lista de vendedores y que el vendedor ahora puede acceder al menú de ventas mayoristas al iniciar sesión.

**Acceptance Scenarios**:

1. **Given** un administrador está en la página de listado de vendedores, **When** hace clic en "Editar" para un vendedor existente, **Then** se muestra un formulario con los datos del vendedor incluyendo un campo de selección para "Tipo de Vendedor"

2. **Given** un administrador está editando un vendedor, **When** cambia el tipo de vendedor de "Vendedor Minorista" a "Vendedor Mayorista" y guarda, **Then** el sistema actualiza el tipo de vendedor y muestra un mensaje de confirmación

3. **Given** un vendedor fue cambiado de minorista a mayorista, **When** el vendedor inicia sesión, **Then** ve el menú de vendedor mayorista (Ventas Mayorista, Clientes, Cuenta Corriente) en lugar del menú minorista

---

### User Story 2 - Crear Vendedor con Tipo Específico (Priority: P2)

El administrador puede crear un nuevo vendedor especificando desde el inicio si será vendedor minorista o vendedor mayorista, evitando tener que editar el tipo después de la creación.

**Why this priority**: Aunque importante, esta funcionalidad es secundaria porque se puede lograr el mismo resultado creando el vendedor y luego editando su tipo. Sin embargo, mejora significativamente la eficiencia del proceso de alta de vendedores.

**Independent Test**: Navegar a `/gestion/crearvendedores`, completar el formulario de nuevo vendedor seleccionando "Vendedor Mayorista" como tipo, crear el vendedor, verificar en el listado que aparece con el tipo correcto, y confirmar que el nuevo vendedor puede acceder al menú mayorista al iniciar sesión.

**Acceptance Scenarios**:

1. **Given** un administrador está en la página de crear vendedor, **When** completa el formulario incluyendo la selección de tipo de vendedor, **Then** puede elegir entre "Vendedor Minorista" y "Vendedor Mayorista"

2. **Given** un administrador crea un nuevo vendedor seleccionando "Vendedor Mayorista", **When** el vendedor es creado exitosamente, **Then** el vendedor aparece en el listado con tipo "Vendedor Mayorista" y tiene acceso a las funcionalidades mayoristas

3. **Given** un administrador crea un nuevo vendedor sin especificar el tipo, **When** el vendedor es creado, **Then** el sistema asigna automáticamente "Vendedor Minorista" como tipo por defecto

---

### User Story 3 - Visualizar Tipo de Vendedor en Listado (Priority: P3)

El administrador puede ver claramente el tipo de cada vendedor (minorista o mayorista) directamente en el listado de vendedores, facilitando la gestión y auditoría del equipo de ventas.

**Why this priority**: Esta es una mejora de usabilidad que facilita la gestión pero no es crítica para la funcionalidad. El administrador puede ver el tipo al editar cada vendedor si es necesario.

**Independent Test**: Navegar a `/gestion/vendedores/`, verificar que la tabla de vendedores incluye una columna "Tipo" que muestra "Vendedor Minorista" o "Vendedor Mayorista" para cada vendedor listado.

**Acceptance Scenarios**:

1. **Given** un administrador está en la página de listado de vendedores, **When** la página carga, **Then** cada vendedor muestra su tipo (Minorista/Mayorista) en una columna claramente visible

2. **Given** hay vendedores de ambos tipos en el sistema, **When** el administrador visualiza el listado, **Then** puede distinguir fácilmente entre vendedores minoristas y mayoristas sin necesidad de entrar en modo edición

---

### Edge Cases

- ¿Qué sucede cuando se cambia el tipo de un vendedor que tiene clientes asignados? ¿Se mantienen las asignaciones o se requiere reasignación?
- ¿Qué pasa si un vendedor mayorista tiene ventas registradas y se cambia a vendedor minorista? ¿Se conservan las ventas históricas?
- ¿Cómo se manejan los vendedores que están actualmente en sesión cuando su tipo es modificado? ¿Deben cerrar sesión y volver a iniciar?
- ¿Qué ocurre con los vendedores creados antes de este feature? ¿Se asigna automáticamente el tipo "minorista" o se requiere una migración de datos?
- ¿Puede un administrador eliminar o desactivar un tipo de vendedor, o los dos tipos (minorista/mayorista) son permanentes?

## Requirements

### Functional Requirements

- **FR-001**: El sistema DEBE permitir al administrador editar el tipo de vendedor (minorista/mayorista) desde la página de edición de vendedores en `/gestion/vendedores/`

- **FR-002**: El sistema DEBE permitir al administrador seleccionar el tipo de vendedor al crear un nuevo vendedor en `/gestion/crearvendedores`

- **FR-003**: El sistema DEBE asignar por defecto el tipo "Vendedor Minorista" a todos los vendedores existentes creados antes de la implementación de este feature

- **FR-004**: El sistema DEBE asignar por defecto el tipo "Vendedor Minorista" cuando se crea un nuevo vendedor sin especificar explícitamente el tipo

- **FR-005**: El sistema DEBE mostrar el tipo de vendedor (Minorista/Mayorista) en el listado de vendedores en `/gestion/vendedores/`

- **FR-006**: El sistema DEBE validar que solo existan dos tipos de vendedor: "Vendedor Minorista" (vendedor_minorista) y "Vendedor Mayorista" (vendedor_mayorista)

- **FR-007**: El sistema DEBE persistir el cambio de tipo de vendedor inmediatamente al guardar la edición

- **FR-008**: El sistema DEBE permitir cambiar el tipo de vendedor en cualquier momento sin restricciones [NEEDS CLARIFICATION: ¿Se debe validar que el vendedor no tenga clientes o ventas activas antes de permitir el cambio de tipo?]

- **FR-009**: El sistema DEBE mantener el historial de ventas y clientes del vendedor cuando se cambia su tipo [NEEDS CLARIFICATION: ¿Los clientes asignados deben cambiar automáticamente de tipo junto con el vendedor, o se requiere reasignación manual?]

- **FR-010**: El sistema DEBE aplicar las reglas de autorización correspondientes al nuevo tipo de vendedor inmediatamente después del cambio

### Key Entities

- **Vendedor (Seller)**: Representa un usuario con rol de vendedor en el sistema. Atributos clave: nombre, email, tipo de vendedor (minorista/mayorista), estado (activo/inactivo). El tipo de vendedor determina qué funcionalidades y menús están disponibles para ese usuario.

- **Tipo de Vendedor (Seller Type)**: Define la categoría del vendedor. Valores posibles: "vendedor_minorista" (retail seller) y "vendedor_mayorista" (wholesale seller). Este atributo está vinculado al campo `role` en la tabla de usuarios y determina el acceso a funcionalidades específicas.

## Success Criteria

### Measurable Outcomes

- **SC-001**: El administrador puede cambiar el tipo de un vendedor existente en menos de 30 segundos desde que accede a la página de edición

- **SC-002**: El administrador puede crear un nuevo vendedor con el tipo especificado en menos de 2 minutos

- **SC-003**: Todos los vendedores existentes en el sistema antes de este feature aparecen con tipo "Vendedor Minorista" por defecto sin intervención manual

- **SC-004**: El 100% de los cambios de tipo de vendedor se reflejan inmediatamente en el menú del vendedor en su próximo inicio de sesión

- **SC-005**: El listado de vendedores muestra claramente el tipo de cada vendedor sin necesidad de hacer clic adicional en cada registro

- **SC-006**: No se producen errores de autorización cuando un vendedor accede a las funcionalidades correspondientes a su tipo recién asignado

## Out of Scope

Las siguientes funcionalidades NO están incluidas en esta especificación:

- Creación de tipos de vendedor personalizados o adicionales más allá de minorista y mayorista
- Asignación automática de clientes basada en el tipo de vendedor
- Migración automática de ventas históricas entre tipos
- Notificaciones automáticas a vendedores cuando su tipo es modificado
- Reportes de auditoría sobre cambios de tipo de vendedor
- Validación de permisos específicos para cambiar el tipo de vendedor (se asume que solo administradores tienen acceso)
- Cambios masivos (bulk) de tipo para múltiples vendedores simultáneamente

## Assumptions

- El sistema ya cuenta con un modelo de usuario/vendedor existente que puede ser extendido con el campo `tipo` o `role`
- Las páginas `/gestion/vendedores/` y `/gestion/crearvendedores` ya existen en el sistema y solo requieren modificaciones para agregar el campo de tipo de vendedor
- El rol "administrador" tiene permisos completos para editar cualquier vendedor
- El backend ya implementa la lógica de roles del feature 001-vendedor-mayorista y solo necesita habilitar la edición del campo `role`
- Los vendedores existentes en la base de datos tienen el campo `role` con valor `null` o vacío, y se asignará "vendedor_minorista" por defecto
- No hay necesidad de validar o migrar datos de clientes cuando un vendedor cambia de tipo (los clientes permanecen asignados al mismo vendedor)
- El cambio de tipo de vendedor no requiere aprobación de múltiples personas (workflow simple)

## Dependencies

- **Feature 001-vendedor-mayorista**: Este feature depende completamente de que el sistema ya tenga implementada la funcionalidad de vendedor mayorista, incluyendo el menú, rutas protegidas, y componentes de ventas mayoristas
- **Sistema de autenticación existente**: Requiere que el sistema de autenticación lea el campo `role` del usuario y lo almacene en localStorage
- **Base de datos de usuarios/vendedores**: Requiere acceso a la tabla de usuarios para agregar/modificar el campo de tipo de vendedor

## Risks

- **Impacto en vendedores activos**: Si un vendedor está en sesión cuando se modifica su tipo, podría experimentar errores de acceso hasta que cierre sesión y vuelva a iniciar
- **Pérdida de acceso a funcionalidades**: Un vendedor mayorista cambiado a minorista perderá acceso a sus clientes mayoristas hasta que sea revertido
- **Confusión en datos históricos**: Las ventas históricas de un vendedor que cambió de tipo podrían generar confusión al analizar reportes (ventas mayoristas asociadas a un vendedor actualmente minorista)
