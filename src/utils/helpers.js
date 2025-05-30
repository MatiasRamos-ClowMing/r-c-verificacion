export const parseGoogleSheetData = (htmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const rows = Array.from(doc.querySelectorAll('table tbody tr'));

  const columnMap = {
    'C': 'CEDULA',
    'B': 'NOMBRE',
    'D': 'FECHA_NACIMIENTO',
    'F': 'EDAD_HOJA',
    'I': 'CATEGORIA_HOJA',
    'J': 'CLUB',
    'G': 'DORSAL_HOJA',
    'H': 'GENERO',
    'K': 'MODALIDAD',
    'L': 'TELEFONO',
    'M': 'EMAIL',
    'N': 'TALLA_CAMISA',
    'R': 'EVENTO',
    'S': 'FECHA_CARRERA',
    'T': 'TELEFONO_ORGANIZADOR'
  };

  const getColumnIndex = (colLetter) => {
    const charCode = colLetter.charCodeAt(0);
    const baseCharCode = 'A'.charCodeAt(0);
    return charCode - baseCharCode;
  };

  const data = rows.slice(1).map(row => {
    const cells = Array.from(row.querySelectorAll('td'));
    const rowData = {};

    for (const colLetter in columnMap) {
      const colName = columnMap[colLetter];
      const colIndex = getColumnIndex(colLetter);
      let cellContent = cells[colIndex] ? cells[colIndex].textContent.trim() : 'No hay datos';

      if (colName !== 'EMAIL') {
        cellContent = cellContent.toUpperCase();
      }
      rowData[colName] = cellContent;
    }
    return rowData;
  });
  return data;
};

export const formatWhatsAppLink = (phoneNumber, message) => {
  const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanedPhoneNumber}?text=${encodedMessage}`;
};

export const calculateAge = (birthDateString) => {
  if (!birthDateString || birthDateString === 'NO HAY DATOS') {
    return 'No hay datos';
  }
  const parts = birthDateString.split('/');
  if (parts.length !== 3) {
    return 'No hay datos';
  }
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);

  const birthDate = new Date(year, month, day);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const getCategory = (age) => {
  if (typeof age !== 'number' || isNaN(age)) {
    return 'No aplica';
  }
  if (age >= 18 && age <= 29) return 'LIBRE (18-29)';
  if (age >= 30 && age <= 39) return 'MASTER A (30-39)';
  if (age >= 40 && age <= 49) return 'MASTER B (40-49)';
  if (age >= 50 && age <= 59) return 'MASTER C (50-59)';
  if (age >= 60) return 'VETERANOS (60+)';
  return 'JUVENIL (<18)';
};

export const generateDorsal = (cedula) => {
  if (!cedula || cedula === 'NO HAY DATOS') {
    return 'NO ASIGNADO';
  }
  let hash = 0;
  for (let i = 0; i < cedula.length; i++) {
    const char = cedula.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return (Math.abs(hash % 10000) + 1000).toString();
};