import React, { useState } from 'react';

export const InputForm = ({ formData, onInputChange, onReset, setFormData, authToken, apiBaseUrl, onSetOutput, onAddHistory, setIsLoading }) => {
  const [localLoading, setLocalLoading] = useState(false);
  const [smilesExamples] = useState([
    { name: 'Aspirin', smiles: 'CC(=O)Oc1ccccc1C(=O)O' },
    { name: 'Lisuride', smiles: '[H][C@@]12Cc3c[nH]c4cccc(C1=C[C@H](NC(=O)N(CC)CC)CN2C)c34' },
    { name: 'Caffeine', smiles: 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C' },
    { name: 'Lenalidomide', smiles: 'O=C1NC(=O)CCC1N3C(=O)c2cccc(c2C3)N' },
    { name: 'Ensitrelvir', smiles: 'Cn1cnc(CN2C(=O)N(Cc3cc(F)c(F)cc3F)C(=Nc3cc4cn(C)nc4cc3Cl)NC2=O)n1' },
    { name: 'Floxuridine', smiles: 'O=c1[nH]c(=O)n([C@H]2C[C@H](O)[C@@H](CO)O2)cc1F' },
    { name: 'Tolnaftate', smiles: 'Cc1cccc(N(C)C(=S)Oc2ccc3ccccc3c2)c1' }
  ]);

  const runGeneration = async () => {
    setLocalLoading(true);
    if (setIsLoading) setIsLoading(true);
    try {
      if (!formData.smiles || !formData.smiles.toString().trim()) {
        throw new Error('SMILES string kosong. Isi field SMILES sebelum Run.');
      }

      const payload = {
        smi_string: formData.smiles,
        num_molecules: parseInt(formData.numMolecules, 10),
        algorithm: formData.algorithm,
        property_to_optimize: formData.property,
        min_similarity: parseFloat(formData.similarity),
        particles: parseInt(formData.particles, 10),
        iterations: parseInt(formData.iterations, 10),
        minimize: !formData.maximize,
      };

      const url = `${apiBaseUrl || ''}/api/chem/generate`;
      console.log('Running generation', { url, payload, authTokenPresent: !!authToken });

      let res;
      try {
        res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          },
          body: JSON.stringify(payload),
        });
      } catch (netErr) {
        console.error('Network error when calling generate:', netErr, { url });
        const pageProto = (typeof window !== 'undefined' && window.location && window.location.protocol) ? window.location.protocol : null;
        const apiProto = url.startsWith('http:') ? 'http:' : url.startsWith('https:') ? 'https:' : null;
        const mixedContentHint = pageProto && apiProto && pageProto === 'https:' && apiProto === 'http:'
          ? 'Possible mixed-content issue: your site is served over HTTPS while the API is HTTP.'
          : '';
        const errMsg = `Network error when calling ${url}: ${netErr.message || netErr}. Possible causes: backend unreachable, CORS blocking the request, or network issues. ${mixedContentHint} Check the browser console (Network tab) for details.`;
        throw new Error(errMsg);
      }

      if (!res.ok) {
        let errBody = null;
        try {
          errBody = await res.json();
        } catch (parseErr) {
          errBody = await res.text().catch(() => null);
        }
        console.error('Server returned non-OK response', { status: res.status, body: errBody });
        const serverMsg = (errBody && (errBody.detail || errBody.message)) || `HTTP ${res.status}`;
        throw new Error(`Server error: ${serverMsg}`);
      }

      const data = await res.json();

      const processed = {
        ...formData,
        ...data,
        timestamp: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };

      if (onSetOutput) onSetOutput(processed);
      if (onAddHistory) {
        onAddHistory({
          smiles: formData.smiles,
          property: formData.property,
          algorithm: formData.algorithm,
          timestamp: new Date().toISOString()
        });
      }
      if (typeof fetchHistory === "function") {
        fetchHistory();
      }
      return processed;
    } catch (e) {
      console.error(e);
      alert(e.message || 'Error generating molecules');
      return null;
    } finally {
      setLocalLoading(false);
      if (setIsLoading) setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <h2 className="text-xl font-bold text-white border-b border-gray-800 pb-2">Input</h2>
      <div>
        <label className="block text-xs uppercase font-bold text-gray-500 mb-2 tracking-wider">SMILES Examples</label>
        <select 
          name="example" 
          value={formData.example} 
          onChange={(e) => {
            onInputChange(e);
            const selected = smilesExamples.find(ex => ex.name === e.target.value);
            if (selected) {
              setFormData(prev => ({ ...prev, smiles: selected.smiles }));
            }
          }} 
          className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md px-3 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
        >
          {smilesExamples.map((ex) => (
            <option key={ex.name} value={ex.name}>{ex.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs uppercase font-bold text-gray-500 mb-2 tracking-wider">SMILES String <span className="text-red-500">*</span></label>
        <textarea name="smiles" value={formData.smiles} onChange={onInputChange} rows="3" className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md px-3 py-2 font-mono text-sm text-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition resize-y"></textarea>
      </div>
      <div>
        <label className="block text-xs uppercase font-bold text-gray-500 mb-2 tracking-wider">Number of Molecules <span className="text-red-500">*</span></label>
        <input type="number" name="numMolecules" value={formData.numMolecules} onChange={onInputChange} className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md px-3 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500 transition" />
      </div>
      <div>
        <label className="block text-xs uppercase font-bold text-gray-500 mb-2 tracking-wider">Sampling Algorithm</label>
        <select name="algorithm" value={formData.algorithm} onChange={onInputChange} className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md px-3 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500 transition">
          <option>CMA-ES</option>
          <option>Spherical</option>
        </select>
      </div>
      <div>
        <label className="block text-xs uppercase font-bold text-gray-500 mb-2 tracking-wider">Property to Optimize</label>
        <div className="flex gap-4">
          <select name="property" value={formData.property} onChange={onInputChange} className="flex-1 bg-[#1E1E1E] border border-gray-700 rounded-md px-3 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500 transition">
            <option>QED</option>
            <option>plogP</option>
          </select>
          <button onClick={() => setFormData(prev => ({...prev, maximize: !prev.maximize}))} className={`flex items-center px-4 py-2 rounded-md cursor-pointer transition select-none border ${formData.maximize ? 'bg-green-600/20 border-green-500 text-green-400' : 'bg-gray-800 border-gray-700 text-gray-400'}`}>
            <div className={`w-3 h-3 rounded-full mr-2 transition-colors ${formData.maximize ? 'bg-green-400' : 'bg-gray-500'}`}></div>
            {formData.maximize ? 'Maximize' : 'Minimize'}
          </button>
        </div>
      </div>
      <div>
        <label className="block text-xs uppercase font-bold text-gray-500 mb-2 tracking-wider">Similarity Constraint <span className="text-red-500">*</span></label>
        <div className="flex items-center gap-4">
          <input type="range" min="0" max="1" step="0.1" name="similarity" value={formData.similarity} onChange={onInputChange} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500" />
          <span className="bg-[#1E1E1E] border border-gray-700 px-3 py-1 rounded text-sm text-gray-200 w-16 text-center">{formData.similarity}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase font-bold text-gray-500 mb-2 tracking-wider">Particles <span className="text-red-500">*</span></label>
          <input type="number" name="particles" value={formData.particles} onChange={onInputChange} className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md px-3 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500 transition" />
        </div>
        <div>
          <label className="block text-xs uppercase font-bold text-gray-500 mb-2 tracking-wider">Iterations <span className="text-red-500">*</span></label>
          <input type="number" name="iterations" value={formData.iterations} onChange={onInputChange} className="w-full bg-[#1E1E1E] border border-gray-700 rounded-md px-3 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500 transition" />
        </div>
      </div>
      <div className="flex gap-4 pt-4">
        <button onClick={onReset} className="flex-1 py-3 bg-[#2d3748] hover:bg-[#4a5568] rounded-md text-white font-medium transition border border-transparent hover:border-gray-500">Reset</button>
        <button onClick={runGeneration} disabled={localLoading} className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-60 rounded-md text-white font-bold transition shadow-lg shadow-green-900/20">{localLoading ? 'Running...' : 'Run'}</button>
      </div>
    </div>
  );
};

export default InputForm;