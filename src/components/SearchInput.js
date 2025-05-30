import React from 'react';

const SearchInput = ({ searchTerm, setSearchTerm, onSearch }) => {
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <input
        type="text"
        placeholder="INTRODUCE NÚMERO DE CÉDULA..."
        className="w-full px-5 py-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-gray-800 text-lg placeholder-gray-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button
        onClick={onSearch}
        className="w-full mt-4 bg-orange-600 text-white py-3 rounded-xl hover:bg-orange-700 transition-colors text-lg font-semibold shadow-md"
      >
        BUSCAR INSCRIPCIÓN
      </button>
    </div>
  );
};

export default SearchInput;