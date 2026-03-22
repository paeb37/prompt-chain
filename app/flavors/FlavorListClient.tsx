'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Settings2, Search, Copy } from 'lucide-react';
import { createFlavor, updateFlavor, deleteFlavor, duplicateFlavor } from './actions';
import { useRouter } from 'next/navigation';

type Flavor = {
  id: number;
  slug: string;
  description: string;
  step_count: number;
};

export default function FlavorListClient({ initialFlavors }: { initialFlavors: Flavor[] }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFlavor, setEditingFlavor] = useState<Flavor | null>(null);
  const [formData, setFormData] = useState({ slug: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenCreate = () => {
    setEditingFlavor(null);
    setFormData({ slug: '', description: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (flavor: Flavor) => {
    setEditingFlavor(flavor);
    setFormData({ slug: flavor.slug, description: flavor.description || '' });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this flavor? All its steps will also be deleted.')) return;
    try {
      await deleteFlavor(id);
    } catch (e: any) {
      alert('Error: ' + e.message);
    }
  };

  const handleDuplicate = async (id: number) => {
    if (!confirm('Are you sure you want to duplicate this flavor and all its steps?')) return;
    try {
      const newFlavorId = await duplicateFlavor(id);
      router.push(`/flavors/${newFlavorId}`);
    } catch (e: any) {
      alert('Error: ' + e.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingFlavor) {
        await updateFlavor(editingFlavor.id, formData);
      } else {
        await createFlavor(formData);
      }
      setIsModalOpen(false);
    } catch (e: any) {
      alert('Error: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredFlavors = initialFlavors.filter((flavor) => {
    if (!searchQuery) return true;
    const lowerQuery = searchQuery.toLowerCase();
    return (
      (flavor.slug && flavor.slug.toLowerCase().includes(lowerQuery)) ||
      (flavor.description && flavor.description.toLowerCase().includes(lowerQuery))
    );
  });

  return (
    <div>
      {/* Search + Create toolbar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#71717a' }} />
          <input
            type="text"
            placeholder="Search by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              padding: '0.75rem 1rem 0.75rem 2.5rem',
              color: '#f4f4f5',
              fontSize: '0.95rem',
              outline: 'none',
            }}
          />
        </div>
        {searchQuery && (
          <span style={{ fontSize: '0.85rem', color: '#a1a1aa', whiteSpace: 'nowrap' }}>
            {filteredFlavors.length} {filteredFlavors.length === 1 ? 'result' : 'results'}
          </span>
        )}
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
            whiteSpace: 'nowrap',
          }}
        >
          <Plus style={{ width: 16, height: 16 }} />
          New Flavor
        </button>
      </div>

      {/* Flavor card grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
        {filteredFlavors.map((flavor) => (
          <div key={flavor.id} style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f4f4f5', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {flavor.slug}
              </h3>
              <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
                <button onClick={() => handleDuplicate(flavor.id)} title="Duplicate Flavor" style={{ background: 'none', border: 'none', padding: '0.35rem', cursor: 'pointer', color: '#71717a', borderRadius: '6px' }}>
                  <Copy style={{ width: 15, height: 15 }} />
                </button>
                <button onClick={() => handleOpenEdit(flavor)} title="Edit Metadata" style={{ background: 'none', border: 'none', padding: '0.35rem', cursor: 'pointer', color: '#71717a', borderRadius: '6px' }}>
                  <Pencil style={{ width: 15, height: 15 }} />
                </button>
                <button onClick={() => handleDelete(flavor.id)} title="Delete Flavor" style={{ background: 'none', border: 'none', padding: '0.35rem', cursor: 'pointer', color: '#71717a', borderRadius: '6px' }}>
                  <Trash2 style={{ width: 15, height: 15 }} />
                </button>
              </div>
            </div>

            <p style={{ color: '#a1a1aa', fontSize: '0.85rem', marginBottom: '1rem', flex: 1, lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
              {flavor.description || <span style={{ fontStyle: 'italic', color: '#52525b' }}>No description provided.</span>}
            </p>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#71717a', fontWeight: 600 }}>
                {flavor.step_count} {flavor.step_count === 1 ? 'Step' : 'Steps'}
              </span>
              <Link
                href={`/flavors/${flavor.id}`}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a855f7', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}
              >
                <Settings2 style={{ width: 15, height: 15 }} />
                Build Chain
              </Link>
            </div>
          </div>
        ))}
        {filteredFlavors.length === 0 && (
          <div style={{
            gridColumn: '1 / -1',
            padding: '3rem',
            textAlign: 'center',
            color: '#71717a',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '16px',
            border: '1px dashed rgba(255,255,255,0.08)',
          }}>
            {searchQuery ? 'No humor flavors found matching your search.' : 'No humor flavors found. Create one to get started!'}
          </div>
        )}
      </div>

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
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f4f4f5', marginBottom: '1.5rem' }}>
              {editingFlavor ? 'Edit Flavor' : 'Create New Flavor'}
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ color: '#a1a1aa', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>
                  Slug (Name) <span style={{ color: '#f43f5e' }}>*</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. gen-z-sarcasm"
                  value={formData.slug}
                  onChange={e => setFormData({ ...formData, slug: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    color: '#f4f4f5',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ color: '#a1a1aa', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>
                  Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe what this flavor aims to generate..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    color: '#f4f4f5',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    color: '#f4f4f5',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '10px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                    color: '#fff',
                    border: 'none',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '10px',
                    fontWeight: 600,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.5 : 1,
                  }}
                >
                  {loading ? 'Saving...' : 'Save Flavor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
