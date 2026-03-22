'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { GripVertical, Plus, Pencil, Trash2, Code2, HelpCircle, X } from 'lucide-react';
import { createStep, updateStep, deleteStep, reorderSteps } from '../actions';

type Step = {
  id: number;
  humor_flavor_id: number;
  order_by: number;
  llm_temperature: number | null;
  llm_input_type_id: number;
  llm_output_type_id: number;
  llm_model_id: number;
  humor_flavor_step_type_id: number;
  llm_system_prompt: string | null;
  llm_user_prompt: string | null;
  description: string | null;
};

type Lookup = { id: number; name?: string; type?: string; slug?: string; description?: string };
type ModelLookup = { id: number; name: string; is_temperature_supported: boolean };

type Props = {
  flavorId: number;
  initialSteps: Step[];
  lookups: {
    inputTypes: Lookup[];
    outputTypes: Lookup[];
    models: ModelLookup[];
    stepTypes: Lookup[];
  };
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '8px',
  padding: '0.75rem',
  color: '#f4f4f5',
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  color: '#a1a1aa',
  fontSize: '0.9rem',
  display: 'block',
  marginBottom: '0.5rem',
  fontWeight: 600,
};

export default function StepBuilderClient({ flavorId, initialSteps, lookups }: Props) {
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<Step | null>(null);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showVariablesHelp, setShowVariablesHelp] = useState(false);

  const defaultForm = {
    humor_flavor_id: flavorId,
    humor_flavor_step_type_id: lookups.stepTypes[0]?.id || 1,
    llm_model_id: lookups.models[0]?.id || 1,
    llm_input_type_id: lookups.inputTypes[0]?.id || 1,
    llm_output_type_id: lookups.outputTypes[0]?.id || 1,
    llm_temperature: 1.0,
    llm_system_prompt: '',
    llm_user_prompt: '',
    description: '',
  };

  const [formData, setFormData] = useState<any>(defaultForm);

  useEffect(() => {
    setIsClient(true);
    setSteps(initialSteps);
  }, [initialSteps]);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    if (sourceIndex === destinationIndex) return;

    const newSteps = Array.from(steps);
    const [reorderedItem] = newSteps.splice(sourceIndex, 1);
    newSteps.splice(destinationIndex, 0, reorderedItem);
    const updatedSteps = newSteps.map((s, i) => ({ ...s, order_by: i + 1 }));
    setSteps(updatedSteps);

    try {
      const orderedIds = updatedSteps.map(s => s.id);
      await reorderSteps(flavorId, orderedIds);
    } catch (e: any) {
      alert('Failed to reorder: ' + e.message);
      setSteps(initialSteps);
    }
  };

  const handleOpenCreate = () => {
    setEditingStep(null);
    setFormData({ ...defaultForm, order_by: steps.length + 1 });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (step: Step) => {
    setEditingStep(step);
    setFormData({
      ...step,
      llm_temperature: step.llm_temperature ?? 1.0,
      llm_system_prompt: step.llm_system_prompt || '',
      llm_user_prompt: step.llm_user_prompt || '',
      description: step.description || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this step?')) return;
    try {
      await deleteStep(id, flavorId);
    } catch (e: any) {
      alert('Error: ' + e.message);
    }
  };

  const getModelName = (id: number) => lookups.models.find(m => m.id === id)?.name || 'Unknown';
  const getStepTypeName = (id: number) => {
    const found = lookups.stepTypes.find(t => t.id === id);
    return found ? (found.name || found.type || found.slug || found.description || `Type ${id}`) : `Type ${id}`;
  };
  const getLookupName = (item: any) => item.name || item.slug || item.type || item.description || `ID: ${item.id}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = { ...formData };
    if (payload.llm_temperature === '') payload.llm_temperature = null;

    try {
      if (editingStep) {
        await updateStep(editingStep.id, payload);
      } else {
        await createStep(payload);
      }
      setIsModalOpen(false);
    } catch (e: any) {
      alert('Error: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const promptVariables = [
    "${stepNOutput}", "${imageDescription}", "${imageAdditionalContext}",
    "${allCommunityContexts}", "${tenRandomCommunityContexts}", "${fiveRelevantCommunityContexts}",
    "${allTerms}", "${tenRandomTerms}", "${allCaptionExamples}", "${tenRandomCaptionExamples}",
    "${startRandomizeLines}", "${endRandomizeLines}"
  ];

  if (!isClient) return null;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f4f4f5', margin: 0 }}>Pipeline Steps</h2>
        <button
          onClick={handleOpenCreate}
          style={{
            background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
            color: '#fff',
            padding: '0.75rem 1.5rem',
            borderRadius: '10px',
            border: 'none',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
          }}
        >
          <Plus style={{ width: 16, height: 16 }} />
          Add Step
        </button>
      </div>

      {steps.length === 0 ? (
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '16px',
          border: '1px dashed rgba(255,255,255,0.08)',
          padding: '3rem',
          textAlign: 'center',
        }}>
          <Code2 style={{ width: 40, height: 40, color: '#52525b', margin: '0 auto 1rem' }} />
          <h3 style={{ color: '#f4f4f5', fontWeight: 600, marginBottom: '0.5rem' }}>No steps defined</h3>
          <p style={{ color: '#71717a', fontSize: '0.9rem' }}>Add the first step to start building this humor flavor&apos;s pipeline.</p>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="steps-list">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {steps.map((step, index) => (
                  <Draggable key={step.id.toString()} draggableId={step.id.toString()} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                          ...provided.draggableProps.style,
                          background: snapshot.isDragging ? 'rgba(168, 85, 247, 0.1)' : 'rgba(255,255,255,0.04)',
                          border: snapshot.isDragging ? '1px solid rgba(168, 85, 247, 0.4)' : '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '12px',
                          padding: '1rem',
                          display: 'flex',
                          gap: '1rem',
                          alignItems: 'center',
                        }}
                      >
                        <div {...provided.dragHandleProps} style={{ cursor: 'grab', color: '#52525b', display: 'flex', alignItems: 'center' }}>
                          <GripVertical style={{ width: 20, height: 20 }} />
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <span style={{
                              background: 'rgba(168, 85, 247, 0.15)',
                              color: '#a855f7',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              padding: '0.25rem 0.5rem',
                              borderRadius: '6px',
                            }}>
                              Step {index + 1} - {getStepTypeName(step.humor_flavor_step_type_id)}
                            </span>
                            <span style={{
                              fontSize: '0.75rem',
                              fontFamily: 'var(--font-fira-code), monospace',
                              color: '#818cf8',
                              background: 'rgba(129, 140, 248, 0.1)',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '6px',
                              border: '1px solid rgba(129, 140, 248, 0.2)',
                            }}>
                              via {getModelName(step.llm_model_id)}
                            </span>
                          </div>
                          <div style={{
                            fontSize: '0.85rem',
                            color: '#a1a1aa',
                            fontFamily: 'var(--font-fira-code), monospace',
                            whiteSpace: 'pre-wrap',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            background: 'rgba(255,255,255,0.02)',
                            padding: '0.5rem',
                            borderRadius: '8px',
                          }}>
                            {step.description || step.llm_system_prompt || step.llm_user_prompt || 'No description'}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                          <button onClick={() => handleOpenEdit(step)} style={{
                            background: '#a855f7', color: '#fff', border: 'none', padding: '0.5rem 0.75rem',
                            borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.3rem',
                          }}>
                            <Pencil style={{ width: 13, height: 13 }} />
                          </button>
                          <button onClick={() => handleDelete(step.id)} style={{
                            background: '#f43f5e', color: '#fff', border: 'none', padding: '0.5rem 0.75rem',
                            borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.3rem',
                          }}>
                            <Trash2 style={{ width: 13, height: 13 }} />
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: '#1a1025',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '900px',
            maxHeight: '90vh',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f4f4f5', margin: 0 }}>
                {editingStep ? 'Edit Step' : 'Create New Step'}
              </h3>
            </div>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              {/* Form */}
              <form onSubmit={handleSubmit} style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Step Type</label>
                    <select style={inputStyle} value={formData.humor_flavor_step_type_id}
                      onChange={e => setFormData({...formData, humor_flavor_step_type_id: parseInt(e.target.value)})}>
                      {lookups.stepTypes.map((t: any) => <option key={t.id} value={t.id}>{getLookupName(t)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Model</label>
                    <select style={inputStyle} value={formData.llm_model_id}
                      onChange={e => setFormData({...formData, llm_model_id: parseInt(e.target.value)})}>
                      {lookups.models.map((m: any) => <option key={m.id} value={m.id}>{getLookupName(m)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Input Type</label>
                    <select style={inputStyle} value={formData.llm_input_type_id}
                      onChange={e => setFormData({...formData, llm_input_type_id: parseInt(e.target.value)})}>
                      {lookups.inputTypes.map((t: any) => <option key={t.id} value={t.id}>{getLookupName(t)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Output Type</label>
                    <select style={inputStyle} value={formData.llm_output_type_id}
                      onChange={e => setFormData({...formData, llm_output_type_id: parseInt(e.target.value)})}>
                      {lookups.outputTypes.map((t: any) => <option key={t.id} value={t.id}>{getLookupName(t)}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label style={{ ...labelStyle, marginBottom: 0 }}>Temperature</label>
                    <span style={{ fontFamily: 'var(--font-fira-code), monospace', fontSize: '0.85rem', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '0.15rem 0.5rem', borderRadius: '6px' }}>
                      {formData.llm_temperature}
                    </span>
                  </div>
                  <input type="range" min="0" max="2" step="0.1"
                    style={{ width: '100%', accentColor: '#a855f7' }}
                    value={formData.llm_temperature || 1.0}
                    onChange={e => setFormData({...formData, llm_temperature: parseFloat(e.target.value)})} />
                </div>

                <div>
                  <label style={labelStyle}>Description (Internal note)</label>
                  <input type="text" style={inputStyle} value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="e.g. Extract visual elements" />
                </div>

                <div>
                  <label style={labelStyle}>System Prompt</label>
                  <textarea rows={4} style={{ ...inputStyle, fontFamily: 'var(--font-fira-code), monospace', fontSize: '0.85rem', resize: 'vertical' }}
                    value={formData.llm_system_prompt}
                    onChange={e => setFormData({...formData, llm_system_prompt: e.target.value})}
                    placeholder="You are an expert at..." />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label style={{ ...labelStyle, marginBottom: 0 }}>User Prompt Template</label>
                    <button type="button" onClick={() => setShowVariablesHelp(!showVariablesHelp)}
                      style={{
                        background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)',
                        color: '#38bdf8', fontSize: '0.75rem', fontWeight: 600, padding: '0.3rem 0.6rem',
                        borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem',
                      }}>
                      <HelpCircle style={{ width: 12, height: 12 }} />
                      {showVariablesHelp ? 'Hide Variables' : 'Show Variables'}
                    </button>
                  </div>
                  <textarea rows={4} style={{ ...inputStyle, fontFamily: 'var(--font-fira-code), monospace', fontSize: '0.85rem', resize: 'vertical' }}
                    value={formData.llm_user_prompt}
                    onChange={e => setFormData({...formData, llm_user_prompt: e.target.value})}
                    placeholder="Analyze this image and..." />
                </div>
              </form>

              {/* Variables Help Panel */}
              {showVariablesHelp && (
                <div style={{
                  width: '280px',
                  background: 'rgba(255,255,255,0.03)',
                  borderLeft: '1px solid rgba(255,255,255,0.08)',
                  padding: '1rem',
                  overflowY: 'auto',
                  flexShrink: 0,
                  position: 'relative',
                }}>
                  <button onClick={() => setShowVariablesHelp(false)}
                    style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#52525b', cursor: 'pointer' }}>
                    <X style={{ width: 14, height: 14 }} />
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <HelpCircle style={{ width: 14, height: 14 }} />
                    Prompt Variables
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#71717a', marginBottom: '0.75rem', paddingRight: '1.5rem' }}>
                    Use these placeholders in your prompts. Click to copy.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {promptVariables.map(v => (
                      <button key={v} type="button"
                        onClick={() => navigator.clipboard.writeText(v)}
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(56, 189, 248, 0.15)',
                          padding: '0.4rem 0.5rem',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontFamily: 'var(--font-fira-code), monospace',
                          color: '#38bdf8',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <button type="button" onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.08)', color: '#f4f4f5',
                  border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem 1.25rem',
                  borderRadius: '10px', fontWeight: 600, cursor: 'pointer',
                }}>
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={loading}
                style={{
                  background: 'linear-gradient(135deg, #a855f7, #ec4899)', color: '#fff',
                  border: 'none', padding: '0.75rem 1.25rem', borderRadius: '10px',
                  fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1,
                }}>
                {loading ? 'Saving...' : 'Save Step'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
