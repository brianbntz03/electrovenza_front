import React from 'react';

export default function Header({ onLogout }) {
  
  const username = localStorage.getItem('user_name');
  
  const handleMenuToggle = (e) => {
    e.preventDefault();
    const body = document.body;
    
    if (window.innerWidth <= 991.98) {
      // En móviles: alternar entre mostrar/ocultar completamente
      body.classList.toggle('sidebar-open');
      body.classList.remove('sidebar-collapse');
    } else {
      // En desktop: comportamiento normal de colapso
      body.classList.toggle('sidebar-collapse');
    }
  };

  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light d-flex justify-between items-center px-3">
      {/* Left navbar links */}
      <ul className="navbar-nav d-flex align-items-center">
        <li className="nav-item">
          <a className="nav-link d-flex align-items-center" onClick={handleMenuToggle} href="#" role="button">
            <i className="fas fa-bars"></i>
          </a>
        </li>
      </ul>

      {/* Right navbar links */}
      <ul className="navbar-nav ml-auto d-flex align-items-center">
        <li className="nav-item d-flex align-items-center mx-2">
          <span className="text-dark font-weight-bold">{username}</span>
        </li>
        <li className="nav-item d-flex align-items-center">
          <a
            className="nav-link d-flex align-items-center"
            href="#"
            role="button"
            onClick={onLogout}
          >
            <i className="fas fa-sign-out-alt mr-1"></i> Cerrar Sesión
          </a>
        </li>
      </ul>
    </nav>
  );
}