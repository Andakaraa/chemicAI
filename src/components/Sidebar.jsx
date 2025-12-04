import React, { useEffect, useState, useRef } from 'react';
import { XIcon } from './Icons';

async function fetchPubChemName(smiles) {
  if (!smiles) return null;
  try {
    const encoded = encodeURIComponent(smiles);
    const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encoded}/synonyms/JSON`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const j = await res.json();
    const syn = j?.InformationList?.Information?.[0]?.Synonym;
    if (Array.isArray(syn) && syn.length > 0) {
      const prefer = syn.find(s => s && !/inchi|inchikey|iupac|smiles|cas/i.test(s));
      return prefer || syn[0];
    }
  } catch (e) {}
  return null;
}

export const Sidebar = ({ isOpen, onClose, history: initialHistory = [], authToken, apiBaseUrl, onSelect }) => {
  const [history, setHistory] = useState(initialHistory || []);
  const [loading, setLoading] = useState(false);
  const nameCacheRef = useRef({});

  useEffect(() => {
    if (!isOpen) return;
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiBaseUrl || ''}/api/chem/history`, {
          headers: {
            'Content-Type': 'application/json',
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          },
        });
        if (!res.ok) throw new Error('Failed to fetch history');
        const data = await res.json();
        setHistory(data || []);

        try {
          const cache = nameCacheRef.current;
          (data || []).forEach((item, idx) => {
            const smiles = item?.meta?.ori_smiles || item?.smi_string || item?.smiles;
            const itemId = item?.id || item?.generation_id;
            if (!smiles || !itemId) return;
            
            if (cache[smiles]) {
              setHistory(prev => 
                prev.map((h, i) => (h.id === itemId || h.generation_id === itemId) ? { ...h, displayName: cache[smiles] } : h)
              );
              return;
            }
            
            fetchPubChemName(smiles).then((name) => {
              if (name) {
                cache[smiles] = name;
                setHistory(prev => 
                  prev.map((h, i) => (h.id === itemId || h.generation_id === itemId) ? { ...h, displayName: name } : h)
                );
              }
            }).catch(() => {});
          });
        } catch (e) {
          console.warn('Name resolution error:', e);
        }
      } catch (e) {
        console.error('History fetch error', e);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [isOpen, apiBaseUrl, authToken]);

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
              {history.map((item, index) => (
                <li 
                  key={item.id || item.generation_id || index} 
                  onClick={() => handleSelect(item)} 
                  className="text-sm text-gray-300 bg-[#1E1E1E] p-3 rounded border border-gray-800 hover:border-gray-600 cursor-pointer transition break-words"
                  title={item.displayName || item.meta?.ori_smiles || item.smi_string || ''}
                >
                  {item.displayName || item.meta?.ori_smiles || item.smi_string || `History ${index + 1}`}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;