import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useState } from 'react';
import { api } from '../lib/api';

type Category = {
  id: number;
  name: string;
  _count?: { products: number };
};

export default function CategoriesPage() {
  const qc = useQueryClient();
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get<Category[]>('/categories');
      return res.data;
    },
  });

  const createCategory = useMutation({
    mutationFn: async () => {
      await api.post('/categories', { name });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      setName('');
      alert('Category created');
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || 'Failed to create category');
    },
  });

  const updateCategory = useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      await api.put(`/categories/${id}`, { name });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      setEditingId(null);
      setEditName('');
      alert('Category updated');
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || 'Failed to update category');
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      alert('Category deleted');
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || 'Failed to delete category');
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    createCategory.mutate();
  }

  function handleEdit(category: Category) {
    setEditingId(category.id);
    setEditName(category.name);
  }

  function handleUpdate(e: FormEvent) {
    e.preventDefault();
    if (editingId) {
      updateCategory.mutate({ id: editingId, name: editName });
    }
  }

  function handleDelete(id: number) {
    if (confirm('Are you sure you want to delete this category?')) {
      deleteCategory.mutate(id);
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 h-full overflow-auto">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center text-2xl">
          🏷️
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Categories</h1>
          <p className="text-slate-600">Manage product categories</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 space-y-4"
      >
        <h2 className="text-xl font-semibold text-slate-800 mb-2">
          Add New Category
        </h2>
        <div className="flex gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 border-2 border-slate-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-indigo-500 transition-colors"
            placeholder="Category name"
            required
          />
          <button
            type="submit"
            disabled={createCategory.isPending}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg text-base font-semibold disabled:opacity-60"
          >
            {createCategory.isPending ? 'Adding…' : '+ Add'}
          </button>
        </div>
      </form>

      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 overflow-auto">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">
          All Categories
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left">
                <th className="py-3 px-4 font-bold">Name</th>
                <th className="py-3 px-4 font-bold">Products</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories?.map((cat) => (
                <tr key={cat.id} className="border-t border-slate-100">
                  <td className="py-3 px-4">
                    {editingId === cat.id ? (
                      <form onSubmit={handleUpdate} className="flex gap-2">
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="border-2 border-indigo-300 rounded px-2 py-1 text-sm"
                          required
                          autoFocus
                        />
                        <button
                          type="submit"
                          className="text-emerald-600 hover:text-emerald-800 font-medium text-sm"
                        >
                          ✓ Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="text-slate-600 hover:text-slate-800 font-medium text-sm"
                        >
                          ✕ Cancel
                        </button>
                      </form>
                    ) : (
                      <span className="font-semibold">{cat.name}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {cat._count?.products || 0} products
                  </td>
                  <td className="py-3 px-4 text-right">
                    {editingId !== cat.id && (
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {(!categories || categories.length === 0) && (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-slate-400">
                    <div className="text-3xl mb-2">🏷️</div>
                    <p>No categories yet</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

