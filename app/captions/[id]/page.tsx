import { requireAdmin } from '@/utils/auth';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import BackButton from '@/components/BackButton';

export default async function CaptionDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>,
  searchParams: Promise<{ flavor?: string, page?: string }>
}) {
  await requireAdmin();
  const supabase = await createClient();
  const { id } = await params;
  const resolvedSearchParams = await searchParams;

  const { data: caption, error } = await supabase
    .from('captions')
    .select(`*, images ( url ), profiles!profile_id ( email ), humor_flavors ( slug )`)
    .eq('id', id)
    .single();

  if (error || !caption) notFound();

  let modelResponses: any[] = [];
  let debugError: any = null;
  let stepTypesMap: Record<number, string> = {};

  if (caption.llm_prompt_chain_id) {
    const { data: responses, error: responsesError } = await supabase
      .from('llm_model_responses')
      .select(`id, llm_model_id, llm_user_prompt, llm_model_response, llm_system_prompt, llm_temperature, processing_time_seconds, created_datetime_utc, humor_flavor_step_id, llm_models ( name, provider_model_id )`)
      .eq('llm_prompt_chain_id', caption.llm_prompt_chain_id)
      .order('created_datetime_utc', { ascending: true });

    if (responsesError) {
      debugError = responsesError;
    } else if (responses && responses.length > 0) {
      const stepIds = Array.from(new Set(responses.map(r => r.humor_flavor_step_id).filter(Boolean)));
      let stepDetailsMap: Record<number, any> = {};

      if (stepIds.length > 0) {
        const { data: stepsData, error: stepsError } = await supabase.from('humor_flavor_steps').select('*').in('id', stepIds);
        if (!stepsError && stepsData) {
          stepDetailsMap = stepsData.reduce((acc, step) => { acc[step.id] = step; return acc; }, {} as Record<number, any>);
          const stepTypeIds = Array.from(new Set(stepsData.map(s => s.humor_flavor_step_type_id).filter(Boolean)));
          if (stepTypeIds.length > 0) {
            const { data: typesData } = await supabase.from('humor_flavor_step_types').select('*').in('id', stepTypeIds);
            if (typesData) {
              stepTypesMap = typesData.reduce((acc, t: any) => { acc[t.id] = t.name || t.type || t.slug || `Type ${t.id}`; return acc; }, {} as Record<number, string>);
            }
          }
        }
      }

      modelResponses = responses.map(r => ({
        ...r,
        humor_flavor_steps: r.humor_flavor_step_id ? stepDetailsMap[r.humor_flavor_step_id] : null
      }));

      modelResponses.sort((a: any, b: any) => {
        const orderA = a.humor_flavor_steps?.order_by || 0;
        const orderB = b.humor_flavor_steps?.order_by || 0;
        if (orderA === orderB) return new Date(a.created_datetime_utc).getTime() - new Date(b.created_datetime_utc).getTime();
        return orderA - orderB;
      });
    }
  }

  const imageUrl = Array.isArray(caption.images) ? caption.images[0]?.url : (caption.images as any)?.url;
  const userEmail = Array.isArray(caption.profiles) ? caption.profiles[0]?.email : (caption.profiles as any)?.email;
  const flavorSlug = Array.isArray(caption.humor_flavors) ? caption.humor_flavors[0]?.slug : (caption.humor_flavors as any)?.slug;

  const currentParams = new URLSearchParams();
  if (resolvedSearchParams.flavor) currentParams.set('flavor', resolvedSearchParams.flavor);
  if (resolvedSearchParams.page) currentParams.set('page', resolvedSearchParams.page);
  const queryString = currentParams.toString();
  const fallbackUrl = `/captions${queryString ? `?${queryString}` : ''}`;

  const metaRow = (label: string, value: React.ReactNode) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
      <span style={{ color: '#71717a' }}>{label}</span>
      <span style={{ color: '#f4f4f5', fontWeight: 500 }}>{value}</span>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0d0a1c' }}>
      <header style={{
        background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
        padding: '1.5rem 2rem',
        boxShadow: '0 4px 20px rgba(124, 58, 237, 0.3)',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <BackButton fallbackUrl={fallbackUrl} label="← Back to Captions" />
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', margin: '0.5rem 0 0' }}>Caption Detail</h1>
        </div>
      </header>

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
          {/* Left: Context */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              overflow: 'hidden',
            }}>
              <div style={{ background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '280px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {imageUrl ? (
                  <img src={imageUrl} alt="Context" style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }} />
                ) : (
                  <div style={{ color: '#52525b', padding: '2rem', textAlign: 'center' }}>No image available</div>
                )}
              </div>

              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#71717a', marginBottom: '0.4rem' }}>Generated Caption</div>
                  <p style={{ fontSize: '1.1rem', color: '#f4f4f5', fontStyle: 'italic', lineHeight: 1.5, margin: 0 }}>
                    &ldquo;{caption.content}&rdquo;
                  </p>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {metaRow('Flavor', flavorSlug ? (
                    <Link href="/flavors" style={{ color: '#a855f7', textDecoration: 'none', fontWeight: 600, background: 'rgba(168,85,247,0.1)', padding: '0.15rem 0.5rem', borderRadius: '6px' }}>
                      {flavorSlug}
                    </Link>
                  ) : (caption.humor_flavor_id || 'None'))}
                  {metaRow('Author', <span style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>{userEmail || caption.profile_id}</span>)}
                  {metaRow('Likes', <span style={{ color: '#ec4899', fontWeight: 700 }}>{caption.like_count}</span>)}
                  {metaRow('Date', new Date(caption.created_datetime_utc).toLocaleDateString())}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Prompt Chain */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '1.25rem',
            }}>
              <div style={{ marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f4f4f5', marginBottom: '0.25rem' }}>Prompt Chain Outputs</h2>
                <div style={{ color: '#71717a', fontSize: '0.85rem' }}>
                  {modelResponses.length} {modelResponses.length === 1 ? 'response' : 'responses'} from chain <span style={{ color: '#38bdf8' }}>#{caption.llm_prompt_chain_id}</span>
                </div>
              </div>

              {debugError && (
                <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '12px', padding: '1rem', marginBottom: '1rem', color: '#fb7185', display: 'flex', gap: '0.75rem' }}>
                  <AlertCircle style={{ width: 18, height: 18, flexShrink: 0 }} />
                  <div>
                    <h3 style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Database Query Error</h3>
                    <pre style={{ fontSize: '0.75rem', fontFamily: 'var(--font-fira-code), monospace', whiteSpace: 'pre-wrap' }}>{JSON.stringify(debugError, null, 2)}</pre>
                  </div>
                </div>
              )}

              {!caption.llm_prompt_chain_id ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#52525b', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.06)' }}>
                  <p>No prompt chain was recorded for this caption.</p>
                  <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>This might be an older caption generated before tracing was enabled.</p>
                </div>
              ) : modelResponses.length === 0 && !debugError ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#52525b', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.06)' }}>
                  <p>Prompt chain ID found, but no response steps were recorded.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {modelResponses.map((step, index) => {
                    const modelObj = Array.isArray(step.llm_models) ? step.llm_models[0] : step.llm_models;
                    const modelName = modelObj?.name || `Model ID: ${step.llm_model_id}`;
                    const providerModelId = modelObj?.provider_model_id || '';
                    const stepObj = step.humor_flavor_steps;
                    const stepOrder = stepObj?.order_by || index + 1;
                    const stepDescription = stepObj?.description || '';
                    const stepTypeName = stepObj?.humor_flavor_step_type_id ? stepTypesMap[stepObj.humor_flavor_step_type_id] : 'General';

                    let parsedResponse = null;
                    let isArray = false;
                    try {
                      if (step.llm_model_response && (step.llm_model_response.startsWith('{') || step.llm_model_response.startsWith('['))) {
                        parsedResponse = JSON.parse(step.llm_model_response);
                        if (Array.isArray(parsedResponse)) { isArray = true; }
                        else if (parsedResponse.choices?.[0]?.message?.content) {
                          try {
                            const inner = JSON.parse(parsedResponse.choices[0].message.content);
                            if (Array.isArray(inner)) { parsedResponse = inner; isArray = true; }
                            else { parsedResponse = parsedResponse.choices[0].message.content; }
                          } catch { parsedResponse = parsedResponse.choices[0].message.content; }
                        }
                      }
                    } catch { /* keep raw */ }

                    return (
                      <div key={step.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden' }}>
                        {/* Step Header */}
                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #a855f7, #ec4899)', color: '#fff', fontWeight: 700, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {index + 1}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f4f4f5', margin: 0 }}>Step {stepOrder} - {stepTypeName}</h3>
                            </div>
                            {stepDescription && <p style={{ fontSize: '0.85rem', color: '#71717a', marginBottom: '0.5rem' }}>{stepDescription}</p>}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                              <div><div style={{ color: '#52525b', fontWeight: 600, marginBottom: '0.15rem' }}>Order</div><div style={{ color: '#d4d4d8', fontFamily: 'var(--font-fira-code), monospace' }}>{stepOrder}</div></div>
                              <div><div style={{ color: '#52525b', fontWeight: 600, marginBottom: '0.15rem' }}>Model</div><div style={{ color: '#d4d4d8', fontFamily: 'var(--font-fira-code), monospace' }}>{modelName} <span style={{ color: '#52525b', fontSize: '0.7rem' }}>({providerModelId})</span></div></div>
                              <div><div style={{ color: '#52525b', fontWeight: 600, marginBottom: '0.15rem' }}>Temp</div><div style={{ color: '#d4d4d8', fontFamily: 'var(--font-fira-code), monospace' }}>{step.llm_temperature != null ? step.llm_temperature.toFixed(2) : 'Default'}</div></div>
                              <div><div style={{ color: '#52525b', fontWeight: 600, marginBottom: '0.15rem' }}>Time</div><div style={{ color: '#d4d4d8', fontFamily: 'var(--font-fira-code), monospace' }}>{step.processing_time_seconds}s</div></div>
                            </div>
                          </div>
                        </div>

                        {/* Step Content */}
                        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {step.llm_system_prompt && (
                            <div>
                              <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a1a1aa', marginBottom: '0.4rem' }}>System prompt</h4>
                              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                                <p style={{ fontSize: '0.85rem', color: '#d4d4d8', fontFamily: 'var(--font-fira-code), monospace', whiteSpace: 'pre-wrap', lineHeight: 1.5, margin: 0 }}>{step.llm_system_prompt}</p>
                              </div>
                            </div>
                          )}
                          <div>
                            <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a1a1aa', marginBottom: '0.4rem' }}>User prompt</h4>
                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)', maxHeight: '16rem', overflowY: 'auto' }}>
                              <p style={{ fontSize: '0.85rem', color: '#d4d4d8', fontFamily: 'var(--font-fira-code), monospace', whiteSpace: 'pre-wrap', lineHeight: 1.5, margin: 0 }}>{step.llm_user_prompt}</p>
                            </div>
                          </div>
                          <div>
                            <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a1a1aa', marginBottom: '0.4rem' }}>Model response</h4>
                            <div style={{ background: 'rgba(16,185,129,0.05)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.15)' }}>
                              {isArray ? (
                                <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                  {(parsedResponse as string[]).map((item, i) => (
                                    <li key={i} style={{ fontSize: '0.85rem', color: '#d4d4d8' }}>&ldquo;{item}&rdquo;</li>
                                  ))}
                                </ul>
                              ) : (
                                <pre style={{ fontSize: '0.85rem', color: '#10b981', fontFamily: 'var(--font-fira-code), monospace', whiteSpace: 'pre-wrap', maxHeight: '24rem', overflowY: 'auto', margin: 0 }}>
                                  {typeof parsedResponse === 'string' ? parsedResponse : (parsedResponse ? JSON.stringify(parsedResponse, null, 2) : step.llm_model_response)}
                                </pre>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Raw Data */}
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.25rem' }}>
              <details>
                <summary style={{ cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: '#71717a', outline: 'none' }}>
                  View Raw Caption Data
                </summary>
                <pre style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.02)', color: '#a1a1aa', padding: '1rem', borderRadius: '8px', overflow: 'auto', fontSize: '0.75rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                  {JSON.stringify(caption, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
