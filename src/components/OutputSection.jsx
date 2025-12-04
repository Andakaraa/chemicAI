import React, { useState, useMemo } from 'react';

const getMoleculeImageUrl = (smiles, opts = {}) => {
  if (!smiles) return null;
  try {
    const encoded = encodeURIComponent(smiles);
    const inputSpec = 'compound/smiles';
    const operation = 'PNG';
    const params = new URLSearchParams();
    if (opts.image_size) params.set('image_size', opts.image_size);
    if (opts.bgcolor) params.set('bgcolor', opts.bgcolor);
    const query = params.toString();
    const base = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/${inputSpec}/${encoded}/${operation}`;
    return query ? `${base}?${query}` : base;
  } catch (err) {
    console.warn('Failed to build PubChem PUG URL for SMILES:', smiles, err);
    return null;
  }
};

const removeAsterisks = (text) => {
  if (typeof text !== 'string') return text;
  return text.replace(/\*+/g, '');
};

const renderAnalysis = (rawText) => {
  const text = typeof rawText === 'string' ? rawText.replace(/\r/g, '') : String(rawText);

  const lines = text.split('\n').map(l => l.replace(/\t/g, '    '));
  const sections = [];
  let current = { heading: null, body: [] };
  let introText = [];

  const headingRe = /^\s*(\d+)\.\s*(.*)$/;
  let firstHeadingFound = false;

  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (firstHeadingFound) {
        if (current.heading || current.body.length) current.body.push('');
      } else {
        if (introText.length) introText.push('');
      }
      continue;
    }

    const m = trimmed.match(headingRe);
    if (m) {
      firstHeadingFound = true;
      if (current.heading || current.body.length) sections.push(current);
      current = { heading: `${m[1]}. ${m[2]}`.trim(), body: [] };
    } else {
      if (!firstHeadingFound) {
        introText.push(trimmed);
      } else {
        current.body.push(trimmed);
      }
    }
  }
  if (current.heading || current.body.length) sections.push(current);

  const effectiveSections = sections.length ? sections : [{ heading: null, body: lines.map(l => l.trim()) }];

  const allNodes = [];
  
  if (introText.length > 0) {
    const cleanIntro = introText
      .filter(t => t)
      .map(t => removeAsterisks(t).replace(/^• +/, ''))
      .join(' ');
    
    if (cleanIntro) {
      allNodes.push(
        <div key="intro" className="mb-6 text-gray-300 text-sm leading-relaxed">
          <p>{cleanIntro}</p>
        </div>
      );
    }
  }

  const sectionNodes = effectiveSections.map((sec, si) => {
    return (
      <div key={si} className="mb-4 text-left">
        {sec.heading && <p className="font-semibold mb-2">{removeAsterisks(sec.heading)}</p>}
        <ul className="list-none ml-0 space-y-2">
          {sec.body.map((ln, idx) => {
            if (!ln) return <li key={idx} />;

            const labelMatch = ln.match(/^([A-Za-z0-9 \-&]+:)\s*(.*)$/);
            if (labelMatch) {
              const label = removeAsterisks(labelMatch[1]);
              const content = labelMatch[2];

              if (/Perkiraan\s+Modal/i.test(label)) {
                const subItems = [];
                let j = idx + 1;
                while (j < sec.body.length) {
                  const cand = sec.body[j];
                  if (!cand) { j++; continue; }
                  if (/^[A-Za-z0-9 \-&]+:\s*/.test(cand)) {
                    if (/^SA Score:/i.test(cand) || /^Estimasi Modal:/i.test(cand)) {
                      subItems.push(cand);
                      sec.body[j] = '';
                      j++;
                      continue;
                    }
                  }
                  break;
                }

                return (
                  <li key={idx} className="pl-2">
                    <div className="flex items-start gap-3">
                      <span className="text-lg leading-none">•</span>
                      <div className="flex-1">
                        <div className="font-medium">{label} <span className="font-normal">{content}</span></div>
                        {subItems.length > 0 && (
                          <ul style={{ marginLeft: '11px' }} className="mt-2 space-y-1">
                            {subItems.map((siText, k) => (
                              <li key={k} className="flex items-start gap-2">
                                <span className="text-sm">•</span>
                                <div className="text-sm">{removeAsterisks(siText.replace(/^(SA Score:|Estimasi Modal:)\s*/i, match => match))}</div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </li>
                );
              }

              return (
                <li key={idx} className="flex items-start gap-3 pl-2">
                  <span className="text-lg leading-none">•</span>
                  <div className="flex-1">
                    <span className="font-medium">{label} </span>
                    <span className="font-normal">{content}</span>
                  </div>
                </li>
              );
            }

            return (
              <li key={idx} className="flex items-start gap-3 pl-2">
                <span className="text-lg leading-none">•</span>
                <div className="flex-1 whitespace-pre-wrap">{removeAsterisks(ln)}</div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  });

  return <div>{allNodes.concat(sectionNodes)}</div>;
};

export const OutputSection = ({ outputData, isLoading }) => {
  const [imageErrors, setImageErrors] = useState({});
  const [imageLoading, setImageLoading] = useState({});
  const [copied, setCopied] = useState(false);

  // Memoize molecule grid early (at component level, not conditionally)
  const moleculeList = useMemo(() => {
    if (!outputData || !outputData.generated_molecules && !outputData.result?.generated_molecules && !outputData.molecules) {
      return [];
    }
    return (outputData.generated_molecules || outputData.result?.generated_molecules || outputData.molecules || []).slice(0, 10);
  }, [outputData]);
  if (isLoading) {
    return (
      <div className="space-y-6 h-full flex flex-col">
        <h2 className="text-xl font-bold text-white border-b border-gray-800 pb-2">Output</h2>
        <div className="flex-1 bg-[#161616] border border-gray-800 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 min-h-[400px]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500"></div>
          <p className="mt-4 text-sm">Generating molecules...</p>
        </div>
      </div>
    );
  }

  if (!outputData) {
    return (
      <div className="space-y-6 h-full flex flex-col">
        <h2 className="text-xl font-bold text-white border-b border-gray-800 pb-2">Output</h2>
        <div className="flex-1 bg-[#161616] border border-gray-800 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 min-h-[400px]">
          <div className="text-4xl text-gray-500">⚗️</div>
          <p className="mt-4 text-sm">Configure parameters and click Run to generate molecules.</p>
        </div>
      </div>
    );
  }

  const status = outputData.status;
  const meta = outputData.meta || {};
  const generated = outputData.generated_molecules || outputData.result?.generated_molecules || outputData.molecules || [];
  const analysis = outputData.analysis_result || outputData.result?.analysis_result || outputData.analysis || '';

  return (
    <div className="space-y-6 h-full animate-fade-in-up">
      <h2 className="text-xl font-bold text-white border-b border-gray-800 pb-2">Output</h2>

      <div className="bg-[#161616] border border-gray-800 rounded-lg p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-blue-500"></div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-green-500 font-bold text-lg">{status === 'success' ? 'Generation Complete' : status}</h3>
            <p className="text-gray-500 text-xs font-mono">{meta.algorithm ? `Algorithm: ${meta.algorithm}` : ''}</p>
          </div>
          <div className="text-right text-xs text-gray-400">
            <div>Original: <span className="font-mono">{meta.ori_smiles || outputData.smi_string || outputData.smiles}</span></div>
            <div>Optimized prop: <span className="font-medium text-white">{meta.optimized_prop || outputData.property_to_optimize || outputData.property}</span></div>
          </div>
        </div>
      </div>

      {generated.length > 0 && (
        <div className="bg-[#161616] border border-gray-800 rounded-lg p-6">
          <h3 className="text-white font-bold text-lg mb-4">Generated Molecules</h3>
          <div className="grid grid-cols-2 gap-4">
            {moleculeList.map((mol, index) => {
              const smiles = mol.sample || mol.smiles || '';
              const imageUrl = getMoleculeImageUrl(smiles);
              const hasError = imageErrors[index];

              return (
                <div key={index} className="bg-[#1E1E1E] border border-gray-700 rounded-lg p-4 hover:border-green-500/50 transition flex flex-col">
                  {imageUrl && !hasError ? (
                    <div className="mb-3 h-40 bg-[#0a0a0a] rounded border border-gray-700 flex items-center justify-center overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={`Molecule ${index + 1}`}
                        className="max-w-full max-h-full object-contain"
                        loading="lazy"
                        decoding="async"
                        onError={() => setImageErrors(prev => ({ ...prev, [index]: true }))}
                      />
                    </div>
                  ) : (
                    <div className="mb-3 h-40 bg-[#0a0a0a] rounded border border-gray-700 flex items-center justify-center">
                      <span className="text-gray-600 text-xs">Image unavailable</span>
                    </div>
                  )}

                  <div className="space-y-2 text-xs flex-1 flex flex-col">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Score:</span>
                      <span className="text-green-400 font-mono">{typeof mol.score === 'number' ? mol.score.toFixed(4) : mol.score}</span>
                    </div>
                    <div className="mt-auto">
                      <p className="text-gray-500 mb-1">SMILES:</p>
                      <p className="font-mono text-[10px] break-all text-gray-300 bg-[#0a0a0a] p-2 rounded">{smiles || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {analysis && (
        <div className="bg-[#161616] border border-gray-800 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <h3 className="text-white font-bold text-lg mb-4">Analysis</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  try {
                    const payload = typeof analysis === 'string' ? analysis : JSON.stringify(analysis, null, 2);
                    await navigator.clipboard.writeText(payload);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  } catch (err) {
                    console.warn('Copy failed', err);
                  }
                }}
                className="px-3 py-1 text-xs rounded bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700"
                title="Copy analysis"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-gray-700 rounded-lg p-4 analysis-text">
            {(() => {
              let parsed = null;
              try {
                if (typeof analysis === 'string') {
                  parsed = JSON.parse(analysis);
                } else {
                  parsed = analysis;
                }
              } catch (err) {
                parsed = null;
              }

              if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                const entries = Object.entries(parsed);
                return (
                  <div className="space-y-4">
                    {entries.map(([k, v]) => (
                      <div key={k} className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="inline-block px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded font-semibold">{removeAsterisks(k)}</span>
                        </div>
                        <div className="w-full">
                          <div className="text-gray-300 text-sm bg-[#050505] p-3 rounded text-left leading-relaxed">{renderAnalysis(typeof v === 'object' ? removeAsterisks(JSON.stringify(v, null, 2)) : removeAsterisks(String(v)))}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }

              return <div className="text-gray-300 text-sm leading-relaxed text-left">{renderAnalysis(typeof analysis === 'string' ? removeAsterisks(analysis) : removeAsterisks(JSON.stringify(analysis, null, 2)))}</div>;
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default OutputSection;