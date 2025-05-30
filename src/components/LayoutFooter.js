import React from 'react';

const LayoutFooter = () => {
  const emailAddress = 'ruedaycorre0@gmail.com';
  const emailSubject = 'CONSULTA DESDE VERIFICACIÓN DE INSCRIPCIONES';
  const emailBody = 'HOLA, ME CONTACTO DESDE LA APLICACIÓN DE VERIFICACIÓN DE INSCRIPCIONES PARA...';

  const mailtoLink = `mailto:${emailAddress}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  return (
    <footer className="w-full bg-black p-4 mt-8 shadow-inner">
      <div className="container mx-auto text-center">
        <a
          href={mailtoLink}
          className="inline-block bg-white text-black py-2 px-6 rounded-xl hover:bg-gray-200 transition-colors text-lg font-semibold shadow-md"
          target="_blank"
          rel="noopener noreferrer"
        >
          CONTACTAR POR CORREO ELECTRÓNICO
        </a>
      </div>
    </footer>
  );
};

export default LayoutFooter;