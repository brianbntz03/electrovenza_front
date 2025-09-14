import React from 'react';

export default function Header({ onLogout }) {
  const handleMenuToggle = (e) => {
    e.preventDefault();
    const body = document.body;
    
    // Para móviles, usar sidebar-open en lugar de sidebar-collapse
    if (window.innerWidth <= 991.98) {
      body.classList.toggle('sidebar-open');
    } else {
      body.classList.toggle('sidebar-collapse');
    }
  };

  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      {/* Left navbar links */}
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" onClick={handleMenuToggle} href="#" role="button"><i className="fas fa-bars"></i></a>
        </li>
      </ul>

      {/* Right navbar links */}
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <a
            className="nav-link"
            href="#"
            role="button"
            onClick={onLogout} // Aquí se llama a la función para cerrar sesión
          >
            <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
          </a>
        </li>
      </ul>
    </nav>
  );
}