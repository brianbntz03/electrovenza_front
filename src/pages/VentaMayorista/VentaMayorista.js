import React, { useState } from 'react';
import Swal from 'sweetalert2';
import CustomerSelector from './components/CustomerSelector';
import ProductSelector from './components/ProductSelector';
import SalesSummary from './components/SalesSummary';
import { createVentaMayorista } from '../../service/ventasService';

/**
 * Main page for wholesale sales
 * Allows wholesale sellers to make cash-only sales with wholesale pricing
 */
export default function VentaMayorista() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [submitting, setSubmitting] = useState(false);

  // Add product to cart
  const handleAddProduct = (producto) => {
    // Check if product already in cart
    const existingItem = cartItems.find(item => item.id === producto.id);

    if (existingItem) {
      // Increment quantity if not exceeding stock
      if (existingItem.cantidad < existingItem.stock_disponible) {
        setCartItems(cartItems.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        ));
        Swal.fire({
          icon: 'success',
          title: 'Cantidad actualizada',
          text: `Se incrementó la cantidad de "${producto.nombre}"`,
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Stock insuficiente',
          text: `No hay más stock disponible de "${producto.nombre}"`
        });
      }
    } else {
      // Add new product to cart
      setCartItems([
        ...cartItems,
        {
          ...producto,
          cantidad: 1
        }
      ]);
      Swal.fire({
        icon: 'success',
        title: 'Producto agregado',
        text: `"${producto.nombre}" agregado al carrito`,
        timer: 1500,
        showConfirmButton: false
      });
    }
  };

  // Remove product from cart
  const handleRemoveItem = (productId) => {
    const item = cartItems.find(i => i.id === productId);
    Swal.fire({
      title: '¿Eliminar producto?',
      text: `¿Desea eliminar "${item.nombre}" del carrito?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setCartItems(cartItems.filter(i => i.id !== productId));
      }
    });
  };

  // Update product quantity in cart
  const handleUpdateQuantity = (productId, newQuantity) => {
    setCartItems(cartItems.map(item =>
      item.id === productId
        ? { ...item, cantidad: newQuantity }
        : item
    ));
  };

  // Complete sale
  const handleCompleteSale = async () => {
    // Validations
    if (!selectedCustomer) {
      Swal.fire({
        icon: 'error',
        title: 'Cliente requerido',
        text: 'Debe seleccionar un cliente para completar la venta'
      });
      return;
    }

    if (cartItems.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Carrito vacío',
        text: 'Debe agregar al menos un producto para completar la venta'
      });
      return;
    }

    // Stock validation
    const itemsWithInsufficientStock = cartItems.filter(
      item => item.cantidad > item.stock_disponible
    );

    if (itemsWithInsufficientStock.length > 0) {
      const productNames = itemsWithInsufficientStock.map(i => i.nombre).join(', ');
      Swal.fire({
        icon: 'error',
        title: 'Stock insuficiente',
        text: `Los siguientes productos no tienen stock suficiente: ${productNames}`
      });
      return;
    }

    // Confirmation dialog
    const total = cartItems.reduce((sum, item) => sum + (item.cantidad * item.precio_mayorista), 0);

    const result = await Swal.fire({
      title: 'Confirmar venta',
      html: `
        <div class="text-left">
          <p><strong>Cliente:</strong> ${selectedCustomer.nombre}</p>
          <p><strong>Método de pago:</strong> ${metodoPago.charAt(0).toUpperCase() + metodoPago.slice(1)}</p>
          <p><strong>Total productos:</strong> ${cartItems.length}</p>
          <p><strong>Total:</strong> $${total.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, completar venta',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#28a745'
    });

    if (!result.isConfirmed) {
      return;
    }

    // Submit sale
    try {
      setSubmitting(true);

      const saleData = {
        cliente_id: selectedCustomer.id,
        articulos: cartItems.map(item => ({
          id: item.id,
          cantidad: item.cantidad,
        }))
      };

      const response = await createVentaMayorista(saleData);

      Swal.fire({
        icon: 'success',
        title: '¡Venta completada!',
        text: `La venta fue registrada exitosamente.`,
        confirmButtonText: 'Aceptar'
      });

      // Reset form
      setCartItems([]);
      setSelectedCustomer(null);
      setMetodoPago('efectivo');

    } catch (error) {
      console.error('Error al completar venta:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al completar venta',
        text: error.message || 'Ocurrió un error al procesar la venta. Por favor intente nuevamente.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-12">
              <h1>
                <i className="fas fa-shopping-cart mr-2"></i>
                Venta Mayorista
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            {/* Left column - Customer and payment */}
            <div className="col-md-4">
              <div className="card">
                <div className="card-header bg-info text-white">
                  <h3 className="card-title">
                    <i className="fas fa-file-invoice mr-2"></i>
                    Datos de la Venta
                  </h3>
                </div>
                <div className="card-body">
                  {/* Customer selector */}
                  <CustomerSelector
                    selectedCustomerId={selectedCustomer?.id}
                    onSelectCustomer={setSelectedCustomer}
                  />

                  {/* Payment method */}
                  <div className="form-group mt-3">
                    <label>
                      <i className="fas fa-money-bill-wave mr-2"></i>
                      Método de Pago *
                    </label>
                    <select
                      className="form-control"
                      value={metodoPago}
                      onChange={(e) => setMetodoPago(e.target.value)}
                    >
                      <option value="efectivo">Efectivo</option>
                      <option value="transferencia">Transferencia</option>
                      <option value="cheque">Cheque</option>
                    </select>
                    <small className="form-text text-muted">
                      Las ventas mayoristas son solo al contado (sin crédito)
                    </small>
                  </div>

                  {/* Complete sale button */}
                  <button
                    className="btn btn-success btn-block mt-4"
                    onClick={handleCompleteSale}
                    disabled={submitting || !selectedCustomer || cartItems.length === 0}
                  >
                    {submitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Procesando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check mr-2"></i>
                        Completar Venta
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Sales summary */}
              <SalesSummary
                items={cartItems}
                onRemoveItem={handleRemoveItem}
                onUpdateQuantity={handleUpdateQuantity}
              />
            </div>

            {/* Right column - Product selector */}
            <div className="col-md-8">
              <ProductSelector onAddProduct={handleAddProduct} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
