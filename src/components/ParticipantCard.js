import React, { useRef } from 'react';
import { formatWhatsAppLink } from '../utils/helpers';

const ParticipantCard = ({ participant, onReportError, onDownload }) => {
  const organizerPhoneNumber = participant.TELEFONO_ORGANIZADOR || '584248438932'; // Fallback si no hay datos
  const whatsappMessage = `HOLA, SOY ${participant.NOMBRE} CON CÉDULA ${participant.CEDULA}. NECESITO AYUDA CON MI INSCRIPCIÓN EN EL EVENTO ${participant.EVENTO}.`;

  const cardRef = useRef(null);

  // Función auxiliar para renderizar una fila de dato
  const DataRow = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-2 border-b border-gray-100 last:border-b-0">
      <span className="font-semibold text-gray-700 sm:w-1/2 text-left sm:text-right pr-2">
        {label}:
      </span>
      <span className="text-gray-900 sm:w-1/2 text-left sm:text-left pl-2 break-words">
        {value || 'NO HAY DATOS'}
      </span>
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <div ref={cardRef} className="p-2">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">DATOS DEL PARTICIPANTE</h2>
        <div className="space-y-1 text-base"> {/* Reducido space-y para compactar */}
          <DataRow label="EVENTO" value={participant.EVENTO} />
          <DataRow label="FECHA DE CARRERA" value={participant.FECHA_CARRERA} />
          <DataRow label="CÉDULA" value={participant.CEDULA} />
          <DataRow label="NOMBRE" value={participant.NOMBRE} />
          <DataRow label="FECHA DE NACIMIENTO" value={participant.FECHA_NACIMIENTO} />
          <DataRow label="EDAD" value={participant.EDAD} />
          <DataRow label="CATEGORÍA" value={participant.CATEGORIA} />
          <DataRow label="CLUB" value={participant.CLUB} />
          <DataRow label="DORSAL ASIGNADO" value={participant.DORSAL} />
          <DataRow label="MODALIDAD" value={participant.MODALIDAD} />
          <DataRow label="TELÉFONO" value={participant.TELEFONO} />
          <DataRow label="EMAIL" value={participant.EMAIL?.toLowerCase()} /> {/* Email en minúsculas */}
          <DataRow label="TALLA CAMISA" value={participant.TALLA_CAMISA} />
        </div>
      </div>
      <button
        onClick={() => onReportError(formatWhatsAppLink(organizerPhoneNumber, whatsappMessage))}
        className="w-full mt-6 bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition-colors text-lg font-semibold shadow-md"
      >
        REPORTAR ERROR DE INSCRIPCIÓN
      </button>
      <button
        onClick={() => onDownload(cardRef)}
        className="w-full mt-3 bg-orange-600 text-white py-3 rounded-xl hover:bg-orange-700 transition-colors text-lg font-semibold shadow-md"
      >
        DESCARGAR FICHA (PNG)
      </button>
    </div>
  );
};

export default ParticipantCard;