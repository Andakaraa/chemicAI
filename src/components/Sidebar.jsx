import React, { useState, useRef } from 'react';
import { XIcon } from './Icons';

async function fetchPubChemName(smiles, retries = 3) {
  if (!smiles) return null;

  const encoded = encodeURIComponent(smiles);
  const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encoded}/synonyms/JSON`;

  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);

      if (res.status === 503 || res.status === 500) {
        await new Promise(r => setTimeout(r, 400 * (i + 1)));
        continue;
      }

      if (!res.ok) return null;

      const j = await res.json();
      const syn = j?.InformationList?.Information?.[0]?.Synonym;

      if (Array.isArray(syn) && syn.length > 0) {
        const prefer = syn.find(s => s && !/inchi|inchikey|iupac|smiles|cas/i.test(s));
        return prefer || syn[0];
      }

      return null;

    } catch (e) {
      await new Promise(r => setTimeout(r, 400 * (i + 1)));
    }
  }
  return null;
}

export const Sidebar = ({ isOpen, onClose, history: initialHistory = [], authToken, apiBaseUrl, onSelect }) => {
  const history = initialHistory || [];
  const [loading, setLoading] = useState(false);
  const nameCacheRef = useRef({});


  const handleSelect = async (item) => {
    if (onSelect && item && (item.id || item.generation_id)) {
      const id = item.id || item.generation_id;
      onSelect(id);
      onClose && onClose();
    }
  };

  return (
    <>
      <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`fixed top-0 left-0 h-full w-72 bg-[#161616] border-r border-gray-800 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 border-b border-gray-800 flex justify-between items-center">
          <h3 className="font-bold text-white">History</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XIcon />
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">
          {loading ? (
            <p className="text-gray-500 text-sm italic">Loading...</p>
          ) : history.length === 0 ? (
            <p className="text-gray-500 text-sm italic">No history yet.</p>
          ) : (
            <ul className="space-y-3">
                {history.map((item, index) => {
                  const smiles = item.smiles || item.smi_string || item.meta?.ori_smiles;
                  const cached = nameCacheRef.current[smiles];

                  if (!cached) {
                    fetchPubChemName(smiles).then(name => {
                      nameCacheRef.current[smiles] = name || smiles;
                      item.displayName = name || smiles; 
                    });
                  }

                  return (
                    <li 
                      key={item.id || item.generation_id || index}
                      onClick={() => handleSelect(item)}
                      className="text-sm text-gray-300 bg-[#1E1E1E] p-3 rounded border border-gray-800 hover:border-gray-600 cursor-pointer transition break-words"
                      title={smiles}
                    >
                      {cached || item.displayName || smiles || `History ${index + 1}`}
                    </li>
                  );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;