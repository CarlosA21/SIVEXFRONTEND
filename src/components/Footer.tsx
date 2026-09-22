// src/components/Footer.tsx
import React from 'react';


const Footer: React.FC = () => {
  const year = new Date().getFullYear().toString();

  
  return (
    <footer className="footer text-center py-3 mt-auto">
      <div className="container">
        <span>© {year} SIVEX. Todos los derechos reservados.</span>
      </div>
    </footer>
  );
};

export default Footer;
