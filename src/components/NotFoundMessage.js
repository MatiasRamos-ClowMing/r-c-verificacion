import React from 'react';
import { formatWhatsAppLink } from '../utils/helpers';

const NotFoundMessage = ({ onContactOrganizer, organizerPhoneNumber }) => {
  const whatsappMessage = 'HOLA, NO ME ENCUENTRO INSCRITO EN LA CARRERA. ¿PODRÍAN AYUDARME?';

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">¡UPS!</h2>
      <p className="text-gray-700 mb-6 text-lg">
        USTED NO ESTÁ INSCRITO EN LA CARRERA. POR FAVOR, COMUNÍQUESE CON EL ORGANIZADOR.
      </p>
      <button
        onClick={() => onContactOrganizer(formatWhatsAppLink(organizerPhoneNumber, whatsappMessage))}
        className="w-full bg-orange-600 text-white py-3 rounded-xl hover:bg-orange-700 transition-colors text-lg font-semibold shadow-md"
      >
        CONTACTAR AL ORGANIZADOR VÍA WHATSAPP
      </button>
    </div>
  );
};

export default NotFoundMessage;