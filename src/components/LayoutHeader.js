import React from 'react';

const LayoutHeader = ({ eventName, raceDate, showConfirmation }) => {
  return (
    <header className="w-full bg-gradient-to-r from-orange-500 to-orange-700 p-4 shadow-lg">
      <div className="container mx-auto text-center">
        <h1 className="text-white text-3xl md:text-4xl font-bold tracking-tight">
          R&C EVENTOS DEPORTIVOS
        </h1>
        <p className="text-white text-lg md:text-xl mt-1 font-semibold">
          VERIFICACIÓN DE INSCRIPCIONES
        </p>
        {eventName && eventName !== 'NO HAY DATOS' && (
          <p className="text-white text-xl md:text-2xl mt-2 font-bold">
            {eventName}
          </p>
        )}
        {raceDate && raceDate !== 'NO HAY DATOS' && (
          <p className="text-white text-md md:text-lg mt-1 font-medium">
            FECHA: {raceDate}
          </p>
        )}
        {showConfirmation && (
          <p className="text-white text-2xl md:text-3xl mt-4 font-extrabold">
            ¡PARTICIPACIÓN CONFIRMADA!
          </p>
        )}
      </div>
    </header>
  );
};

export default LayoutHeader;