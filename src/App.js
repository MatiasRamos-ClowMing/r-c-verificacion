import React, { useState, useEffect, useRef, useCallback } from 'react';
import LayoutHeader from './components/LayoutHeader';
import SearchInput from './components/SearchInput';
import ParticipantCard from './components/ParticipantCard';
import NotFoundMessage from './components/NotFoundMessage';
import LayoutFooter from './components/LayoutFooter';
import { parseGoogleSheetData, calculateAge, getCategory, generateDorsal } from './utils/helpers';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [participantData, setParticipantData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Iniciar en true para mostrar "Cargando" al inicio
  const [error, setError] = useState(null);
  const [allParticipants, setAllParticipants] = useState([]);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [eventName, setEventName] = useState('');
  const [raceDate, setRaceDate] = useState('');
  const [organizerPhoneNumber, setOrganizerPhoneNumber] = useState('584248438932'); // Default o fallback

  const googleSheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTMey0oHhYEKE2hmx7XkHk7yMe1sL2HLaRTNO4alVYj6thvsnHP5wfFbGhPDnQM0fsKjupszwvq57M3/pubhtml?gid=701684739&single=true';

  const fetchSheetData = useCallback(async () => {
    // Solo mostrar el spinner si es la carga inicial o si hay un error previo
    if (!allParticipants.length && !error) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const response = await fetch(googleSheetUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const htmlString = await response.text();
      const parsedData = parseGoogleSheetData(htmlString);
      setAllParticipants(parsedData);

      if (parsedData.length > 0) {
        setEventName(parsedData[0].EVENTO || '');
        setRaceDate(parsedData[0].FECHA_CARRERA || '');
        setOrganizerPhoneNumber(parsedData[0].TELEFONO_ORGANIZADOR || '584248438932');
      }
    } catch (e) {
      console.error('Error fetching or parsing sheet data:', e);
      setError('ERROR AL CARGAR LOS DATOS DE LA HOJA DE CÁLCULO. POR FAVOR, RECARGUE LA PÁGINA.');
      // Si hay un error crítico al cargar los datos iniciales, no dejar la pantalla en blanco
      // y mostrar el mensaje de error.
    } finally {
      setIsLoading(false);
    }
  }, [googleSheetUrl, allParticipants.length, error]);

  useEffect(() => {
    fetchSheetData(); // Carga inicial

    const intervalId = setInterval(fetchSheetData, 1000); // Actualización cada segundo

    return () => clearInterval(intervalId);
  }, [fetchSheetData]);

  const handleSearch = () => {
    setSearchAttempted(true);
    if (!searchTerm.trim()) {
      setParticipantData(null);
      return;
    }

    const normalizedSearchTerm = searchTerm.trim().toUpperCase();
    const foundParticipant = allParticipants.find(p =>
      p.CEDULA === normalizedSearchTerm
    );

    if (foundParticipant) {
      const edad = foundParticipant.EDAD_HOJA !== 'NO HAY DATOS' ? foundParticipant.EDAD_HOJA : calculateAge(foundParticipant.FECHA_NACIMIENTO);
      const categoria = foundParticipant.CATEGORIA_HOJA !== 'NO HAY DATOS' ? foundParticipant.CATEGORIA_HOJA : getCategory(edad);
      const dorsal = foundParticipant.DORSAL_HOJA !== 'NO HAY DATOS' ? foundParticipant.DORSAL_HOJA : generateDorsal(foundParticipant.CEDULA);

      setParticipantData({
        CEDULA: foundParticipant.CEDULA,
        NOMBRE: foundParticipant.NOMBRE,
        FECHA_NACIMIENTO: foundParticipant.FECHA_NACIMIENTO,
        EDAD: edad,
        CATEGORIA: categoria,
        CLUB: foundParticipant.CLUB,
        DORSAL: dorsal,
        MODALIDAD: foundParticipant.MODALIDAD,
        TELEFONO: foundParticipant.TELEFONO,
        EMAIL: foundParticipant.EMAIL,
        TALLA_CAMISA: foundParticipant.TALLA_CAMISA,
        EVENTO: foundParticipant.EVENTO,
        FECHA_CARRERA: foundParticipant.FECHA_CARRERA,
        TELEFONO_ORGANIZADOR: foundParticipant.TELEFONO_ORGANIZADOR
      });
    } else {
      setParticipantData(null);
    }
  };

  const handleWhatsAppRedirect = (link) => {
    window.open(link, '_blank');
  };

  const handleDownloadFicha = async () => {
    if (!participantData) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 1080;
    canvas.height = 1920;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#FF5E03';
    ctx.font = 'bold 70px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('INSCRIPCIÓN CONFIRMADA', canvas.width / 2, 120);

    ctx.fillStyle = '#111827';
    ctx.font = 'bold 60px Arial';
    ctx.fillText(participantData.EVENTO || 'EVENTO DEPORTIVO', canvas.width / 2, 220);

    ctx.fillStyle = '#4B5563';
    ctx.font = '40px Arial';
    ctx.fillText(participantData.FECHA_CARRERA || 'FECHA POR CONFIRMAR', canvas.width / 2, 290);

    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(100, 350);
    ctx.lineTo(canvas.width - 100, 350);
    ctx.stroke();

    const logoUrl = 'https://res.cloudinary.com/ddlhr4nyn/image/upload/v1748440295/logo_neon_d6zded.jpg';
    const logo = new Image();
    logo.crossOrigin = 'anonymous';
    logo.src = logoUrl;

    // Manejo de errores en la carga del logo para evitar que rompa la app
    try {
      await new Promise((resolve, reject) => {
        logo.onload = resolve;
        logo.onerror = (e) => {
          console.error("Error al cargar el logo:", e);
          reject(new Error("No se pudo cargar el logo."));
        };
      });

      const logoWidth = 300;
      const logoHeight = (logo.height / logo.width) * logoWidth;
      const logoX = (canvas.width - logoWidth) / 2;
      const logoY = 380;

      ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);
    } catch (e) {
      console.warn("El logo no pudo ser cargado, la ficha se generará sin él.");
      // Opcional: dibujar un placeholder o un mensaje de error en el canvas
      ctx.fillStyle = '#FF0000';
      ctx.font = '20px Arial';
      ctx.fillText('LOGO NO DISPONIBLE', canvas.width / 2, 450);
    }

    ctx.beginPath();
    ctx.moveTo(100, (logoY || 380) + (logoHeight || 0) + 30); // Usar logoY y logoHeight si se cargaron
    ctx.lineTo(canvas.width - 100, (logoY || 380) + (logoHeight || 0) + 30);
    ctx.stroke();

    ctx.strokeStyle = '#FF5E03';
    ctx.lineWidth = 8;
    const frameY = (logoY || 380) + (logoHeight || 0) + 60;
    ctx.beginPath();
    ctx.roundRect(80, frameY, canvas.width - 160, 900, 40);
    ctx.stroke();

    const showAthleteData = (label, value, yPos) => {
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 50px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(label, canvas.width / 2, yPos);

      ctx.fillStyle = '#4B5563';
      ctx.font = '45px Arial';
      ctx.fillText(value || '--', canvas.width / 2, yPos + 80);
    };

    let currentY = frameY + 100;
    showAthleteData('NOMBRE', participantData.NOMBRE, currentY);
    currentY += 200;
    showAthleteData('CATEGORÍA', participantData.CATEGORIA, currentY);
    currentY += 200;
    showAthleteData('DORSAL', participantData.DORSAL, currentY);
    currentY += 200;
    showAthleteData('CLUB', participantData.CLUB, currentY);

    ctx.fillStyle = '#6B7280';
    ctx.font = 'italic 30px Arial';
    ctx.fillText('R&C Eventos Deportivos', canvas.width / 2, canvas.height - 100);

    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `Inscripción_${participantData.NOMBRE?.replace(/\s/g, '_') || 'participante'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNewSearch = () => {
    setParticipantData(null);
    setSearchTerm('');
    setSearchAttempted(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <LayoutHeader
        eventName={eventName}
        raceDate={raceDate}
        showConfirmation={!!participantData}
      />
      <main className="flex-grow container mx-auto p-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-2xl border border-gray-200">
          {!participantData && (
            <SearchInput
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onSearch={handleSearch}
            />
          )}

          {isLoading && (
            <p className="text-center text-gray-600 text-lg">CARGANDO DATOS...</p>
          )}

          {error && (
            <p className="text-center text-red-600 text-lg">{error}</p>
          )}

          {!isLoading && !error && participantData && (
            <>
              <ParticipantCard
                participant={participantData}
                onReportError={handleWhatsAppRedirect}
                onDownload={handleDownloadFicha}
              />
              <button
                onClick={handleNewSearch}
                className="w-full mt-6 bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition-colors text-lg font-semibold shadow-md"
              >
                BUSCAR OTRA INSCRIPCIÓN
              </button>
            </>
          )}

          {!isLoading && !error && !participantData && searchAttempted && searchTerm.trim() && (
            <NotFoundMessage
              onContactOrganizer={handleWhatsAppRedirect}
              organizerPhoneNumber={organizerPhoneNumber}
            />
          )}
        </div>
      </main>
      <LayoutFooter />
    </div>
  );
};

export default App;