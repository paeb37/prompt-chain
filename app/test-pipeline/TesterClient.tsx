'use client';

import { useState, useEffect } from 'react';
import { testFlavorGeneration, fetchImagesForSet } from './actions';
import { Play, Loader2, CheckCircle2, AlertCircle, TestTube2, Image as ImageIcon, FastForward } from 'lucide-react';

type Flavor = { id: number; slug: string; description: string };
type ImageSet = { id: number; slug: string; description: string };
type Image = { id: string; url: string };
type BatchResult = { image: Image; results?: any[]; error?: string };
type Props = { flavors: Flavor[]; imageSets: ImageSet[]; defaultImages: Image[] };

const panelStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '16px',
  padding: '1.25rem',
};

const selectStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '10px',
  padding: '0.75rem',
  color: '#f4f4f5',
  outline: 'none',
};

export default function TesterClient({ flavors, imageSets, defaultImages }: Props) {
  const [selectedSet, setSelectedSet] = useState<number | 'recent'>('recent');
  const [currentImages, setCurrentImages] = useState<Image[]>(defaultImages);
  const [loadingImages, setLoadingImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFlavor, setSelectedFlavor] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [batchTotal, setBatchTotal] = useState(0);
  const [batchResults, setBatchResults] = useState<BatchResult[] | null>(null);

  useEffect(() => {
    async function loadImages() {
      if (selectedSet === 'recent') {
        setCurrentImages(defaultImages);
        setSelectedImage(null);
        return;
      }
      setLoadingImages(true);
      setSelectedImage(null);
      try {
        const images = await fetchImagesForSet(selectedSet as number);
        setCurrentImages(images as any);
      } catch { setCurrentImages([]); }
      finally { setLoadingImages(false); }
    }
    loadImages();
  }, [selectedSet, defaultImages]);

  const handleTestSingle = async () => {
    if (!selectedImage || !selectedFlavor) return;
    setLoading(true); setBatchResults(null); setError(null); setResults(null);
    try {
      const data = await testFlavorGeneration(selectedImage, selectedFlavor);
      setResults(data);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  const handleTestBatch = async () => {
    if (selectedSet === 'recent' || currentImages.length === 0 || !selectedFlavor) return;
    if (!confirm(`Run pipeline on all ${currentImages.length} images? This may take a while.`)) return;
    setBatchLoading(true); setResults(null); setError(null); setBatchProgress(0); setBatchTotal(currentImages.length);
    const resultsArray: BatchResult[] = [];
    setBatchResults(resultsArray);
    for (let i = 0; i < currentImages.length; i++) {
      const img = currentImages[i];
      try {
        const data = await testFlavorGeneration(img.id, selectedFlavor);
        resultsArray.push({ image: img, results: data });
      } catch (e: any) { resultsArray.push({ image: img, error: e.message }); }
      setBatchProgress(i + 1);
      setBatchResults([...resultsArray]);
    }
    setBatchLoading(false);
  };

  const getSelectedImageUrl = () => currentImages.find(img => img.id === selectedImage)?.url;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
      {/* Config Column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Step 1: Dataset */}
        <div style={panelStyle}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#f4f4f5', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(56,189,248,0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0 }}>1</span>
            Select Data Set
          </h2>
          <select value={selectedSet} onChange={(e) => setSelectedSet(e.target.value === 'recent' ? 'recent' : parseInt(e.target.value))} style={selectStyle}>
            <option value="recent">Recent Uploads (Default)</option>
            {imageSets.map(set => <option key={set.id} value={set.id}>{set.slug}</option>)}
          </select>
        </div>

        {/* Step 2: Image */}
        <div style={panelStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#f4f4f5', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(56,189,248,0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0 }}>2</span>
              Select Image
            </h2>
            <span style={{ fontSize: '0.7rem', color: '#52525b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Optional for Batch</span>
          </div>
          {loadingImages ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
              <Loader2 style={{ width: 24, height: 24, color: '#38bdf8', animation: 'spin 1s linear infinite' }} />
            </div>
          ) : currentImages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#52525b' }}>
              <ImageIcon style={{ width: 28, height: 28, margin: '0 auto 0.5rem', opacity: 0.5 }} />
              <p style={{ fontSize: '0.85rem' }}>No images found.</p>
            </div>
          ) : (
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem',
              maxHeight: '16rem', overflowY: 'auto', padding: '0.25rem',
              background: 'rgba(255,255,255,0.02)', borderRadius: '10px',
            }}>
              {currentImages.map((img) => (
                <div key={img.id} onClick={() => setSelectedImage(img.id)}
                  style={{
                    cursor: 'pointer', borderRadius: '8px', overflow: 'hidden',
                    border: selectedImage === img.id ? '2px solid #a855f7' : '2px solid transparent',
                    aspectRatio: '1', transition: 'all 0.2s',
                  }}>
                  <img src={img.url} alt="Test" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Step 3: Flavor */}
        <div style={panelStyle}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#f4f4f5', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(168,85,247,0.15)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0 }}>3</span>
            Select Flavor
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '16rem', overflowY: 'auto' }}>
            {flavors.map((flavor) => (
              <label key={flavor.id}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '0.6rem', padding: '0.6rem',
                  borderRadius: '10px', cursor: 'pointer', transition: 'all 0.15s',
                  background: selectedFlavor === flavor.id ? 'rgba(168,85,247,0.1)' : 'transparent',
                  border: selectedFlavor === flavor.id ? '1px solid rgba(168,85,247,0.3)' : '1px solid rgba(255,255,255,0.05)',
                }}>
                <input type="radio" name="flavor" value={flavor.id} checked={selectedFlavor === flavor.id}
                  onChange={() => setSelectedFlavor(flavor.id)}
                  style={{ accentColor: '#a855f7', width: 16, height: 16, marginTop: '0.1rem' }} />
                <div>
                  <div style={{ fontWeight: 600, color: '#f4f4f5', fontSize: '0.9rem' }}>{flavor.slug}</div>
                  <div style={{ fontSize: '0.75rem', color: '#71717a', marginTop: '0.1rem' }}>{flavor.description || 'No description'}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Run buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button onClick={handleTestSingle} disabled={!selectedImage || !selectedFlavor || loading || batchLoading}
            style={{
              background: 'linear-gradient(135deg, #a855f7, #ec4899)', color: '#fff',
              fontWeight: 700, padding: '0.85rem', borderRadius: '10px', border: 'none',
              cursor: (!selectedImage || !selectedFlavor || loading || batchLoading) ? 'not-allowed' : 'pointer',
              opacity: (!selectedImage || !selectedFlavor || loading || batchLoading) ? 0.5 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            }}>
            {loading ? <><Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} /> Generating...</> :
              <><Play style={{ width: 18, height: 18 }} /> Run on Selected Image</>}
          </button>
          <button onClick={handleTestBatch} disabled={selectedSet === 'recent' || currentImages.length === 0 || !selectedFlavor || loading || batchLoading}
            style={{
              background: 'rgba(255,255,255,0.04)', color: '#a855f7',
              fontWeight: 700, padding: '0.85rem', borderRadius: '10px',
              border: '2px solid rgba(168,85,247,0.4)',
              cursor: (selectedSet === 'recent' || !selectedFlavor || loading || batchLoading) ? 'not-allowed' : 'pointer',
              opacity: (selectedSet === 'recent' || !selectedFlavor || loading || batchLoading) ? 0.5 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            }}>
            {batchLoading ? <><Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} /> Processing ({batchProgress}/{batchTotal})...</> :
              <><FastForward style={{ width: 18, height: 18 }} /> Run on Full Dataset ({currentImages.length})</>}
          </button>
        </div>
      </div>

      {/* Results Column */}
      <div>
        <div style={{ ...panelStyle, minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f4f4f5', margin: 0 }}>Pipeline Results</h2>
            {selectedFlavor && (
              <span style={{ fontSize: '0.8rem', fontWeight: 600, padding: '0.3rem 0.6rem', background: 'rgba(168,85,247,0.1)', color: '#a855f7', borderRadius: '999px' }}>
                Flavor: {flavors.find(f => f.id === selectedFlavor)?.slug}
              </span>
            )}
          </div>

          {!selectedImage && !results && !batchResults && !loading && !batchLoading && !error && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#52525b' }}>
              <TestTube2 style={{ width: 48, height: 48, marginBottom: '1rem', opacity: 0.5 }} />
              <p style={{ fontSize: '0.9rem' }}>Select inputs and run the pipeline to see results.</p>
            </div>
          )}

          {loading && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
              <Loader2 style={{ width: 40, height: 40, marginBottom: '1rem', animation: 'spin 1s linear infinite' }} />
              <p style={{ fontWeight: 600 }}>Running prompt chain...</p>
              <p style={{ fontSize: '0.85rem', color: '#71717a', marginTop: '0.25rem' }}>This may take 10-30 seconds.</p>
            </div>
          )}

          {batchLoading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}>
              <div style={{ width: '100%', maxWidth: '400px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#d4d4d8', marginBottom: '0.5rem' }}>
                  <span>Batch Progress</span><span>{batchProgress} / {batchTotal}</span>
                </div>
                <div style={{ width: '100%', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', height: '8px' }}>
                  <div style={{ width: `${(batchProgress / batchTotal) * 100}%`, background: 'linear-gradient(135deg, #a855f7, #ec4899)', borderRadius: '999px', height: '8px', transition: 'width 0.3s' }} />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '12px', padding: '1rem', color: '#fb7185', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <AlertCircle style={{ width: 18, height: 18, flexShrink: 0, marginTop: '0.1rem' }} />
              <div>
                <h3 style={{ fontWeight: 700, marginBottom: '0.25rem', fontSize: '0.9rem' }}>Pipeline Error</h3>
                <p style={{ fontSize: '0.85rem', fontFamily: 'var(--font-fira-code), monospace', whiteSpace: 'pre-wrap' }}>{error}</p>
              </div>
            </div>
          )}

          {results && (
            <div className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', padding: '0.75rem', borderRadius: '10px', color: '#10b981' }}>
                <CheckCircle2 style={{ width: 18, height: 18 }} />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Generated {results.length} captions!</span>
              </div>
              <div style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', padding: '1rem' }}>
                <div style={{ width: 120, height: 120, flexShrink: 0, borderRadius: '8px', overflow: 'hidden', background: '#000' }}>
                  <img src={getSelectedImageUrl()} alt="Input" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                  {results.slice(0, 3).map((caption: any, idx: number) => (
                    <div key={idx} style={{ background: 'rgba(255,255,255,0.04)', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', borderLeft: '3px solid #38bdf8', position: 'relative' }}>
                      <p style={{ fontSize: '0.85rem', color: '#d4d4d8', fontStyle: 'italic', lineHeight: 1.5, margin: 0 }}>
                        &ldquo;{caption.content || caption}&rdquo;
                      </p>
                    </div>
                  ))}
                  {results.length > 3 && <p style={{ fontSize: '0.75rem', color: '#52525b', fontStyle: 'italic' }}>+ {results.length - 3} more captions generated.</p>}
                </div>
              </div>
            </div>
          )}

          {batchResults && batchResults.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <h3 style={{ fontWeight: 700, color: '#f4f4f5', marginBottom: '1rem', fontSize: '1rem' }}>Batch Results ({batchResults.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '700px', overflowY: 'auto' }}>
                {batchResults.map((item, idx) => (
                  <div key={idx} className="animate-fadeIn" style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', padding: '1rem' }}>
                    <div style={{ width: 100, height: 100, flexShrink: 0, borderRadius: '8px', overflow: 'hidden', background: '#000' }}>
                      <img src={item.image.url} alt="Batch" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      {item.error ? (
                        <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '8px', padding: '0.5rem', color: '#fb7185', fontSize: '0.85rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                          <AlertCircle style={{ width: 14, height: 14, flexShrink: 0, marginTop: '0.15rem' }} />
                          <span style={{ fontFamily: 'var(--font-fira-code), monospace' }}>{item.error}</span>
                        </div>
                      ) : item.results ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          {item.results.map((caption: any, cIdx: number) => (
                            <div key={cIdx} style={{ background: 'rgba(255,255,255,0.04)', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', fontSize: '0.85rem', color: '#d4d4d8' }}>
                              &ldquo;{caption.content || caption}&rdquo;
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ color: '#52525b', fontSize: '0.85rem', display: 'flex', alignItems: 'center', height: '100%' }}>Waiting in queue...</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
