import React, { useEffect, useState } from "react";
import { XIcon } from "./Icons";

export const Sidebar = ({ isOpen, onClose, history = [], onSelect }) => {
  const [names, setNames] = useState({});

  async function fetchPubChemName(smiles) {
    try {
      const encoded = encodeURIComponent(smiles);
      const res = await fetch(
        `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encoded}/synonyms/JSON`
      );
      if (!res.ok) return null;
      const j = await res.json();
      const syns = j?.InformationList?.Information?.[0]?.Synonym;
      if (Array.isArray(syns) && syns.length > 0) {
        const clean = syns.find(
          (s) => !/inchi|inchikey|smiles|cas/i.test(s)
        );
        return clean || syns[0];
      }
      return null;
    } catch (err) {
      return null;
    }
  }

  useEffect(() => {
    async function loadNames() {
      const newNames = { ...names };
      for (const item of history) {
        const smiles = item.smiles || item.smi_string || item.meta?.ori_smiles;
        if (!smiles) continue;
        if (!newNames[smiles]) {
          const name = item.pubchem_name || (await fetchPubChemName(smiles));
          newNames[smiles] = name || smiles;
        }
      }
      setNames(newNames);
    }
    loadNames();
  }, [history]);

  const handleSelect = (item) => {
    const id = item.generation_id ?? item.id ?? item.generationId ?? null;
     if (!id) {
      console.warn("⚠ History item tidak memiliki ID:", item);
      return;
    }
    onSelect(id);
    onClose && onClose();
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 left-0 h-full w-80 bg-[#161616] border-r border-gray-800 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-gray-800 flex justify-between items-center">
          <h3 className="font-bold text-white text-lg">History</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XIcon />
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-64px)] space-y-4">
          {history.length === 0 ? (
            <p className="text-gray-500 text-sm italic">No history yet.</p>
          ) : (
            history.map((item, index) => {
              const smiles = item.smiles || item.smi_string || item.meta?.ori_smiles;
              const display = names[smiles] || smiles;

              return (
                <div
                  key={item.id || item.generation_id || index}
                  onClick={() => handleSelect(item)}
                  className="bg-[#1E1E1E] border border-gray-700 hover:border-gray-500 transition rounded-xl p-4 cursor-pointer shadow-sm"
                >
                  <div className="text-white font-semibold text-md mb-1">
                    {display}
                  </div>

                  <div className="text-gray-400 text-xs font-mono break-words mb-3">
                    {smiles}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Algorithm:</span>
                      <span className="text-gray-300 ml-1">{item.algorithm}</span>
                    </div>

                    <div>
                      <span className="text-gray-500">Property:</span>
                      <span className="text-gray-300 ml-1">{item.property}</span>
                    </div>

                    {item.num_molecules && (
                      <div>
                        <span className="text-gray-500">Molecules:</span>
                        <span className="text-gray-300 ml-1">{item.num_molecules}</span>
                      </div>
                    )}

                    {item.similarity && (
                      <div>
                        <span className="text-gray-500">Similarity:</span>
                        <span className="text-gray-300 ml-1">{item.similarity}</span>
                      </div>
                    )}

                    {item.particles && (
                      <div>
                        <span className="text-gray-500">Particles:</span>
                        <span className="text-gray-300 ml-1">{item.particles}</span>
                      </div>
                    )}

                    {item.iterations && (
                      <div>
                        <span className="text-gray-500">Iterations:</span>
                        <span className="text-gray-300 ml-1">{item.iterations}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-gray-500 text-[10px] mt-3 text-right">
                    {new Date(item.timestamp).toLocaleString()}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
