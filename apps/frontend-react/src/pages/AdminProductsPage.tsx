import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useEffect, useState } from 'react';
import { api } from '../lib/api';
import bwipjs from 'bwip-js';

export default function AdminProductsPage() {
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [bulkText, setBulkText] = useState('');
  const [showBulk, setShowBulk] = useState(false);
  const [stockProduct, setStockProduct] = useState<any | null>(null);
  const [stockQuantity, setStockQuantity] = useState('');
  const [barcodeProduct, setBarcodeProduct] = useState<any | null>(null);

  const [form, setForm] = useState({
    name: '',
    sku: '',
    isbn: '',
    price: '',
    cost: '',
    unit: 'pcs',
    reorderThreshold: '0',
    barcode: '',
    categoryId: '',
  });

  const qc = useQueryClient();

  useEffect(() => {
    if (!barcodeProduct) return;
    const canvas = document.getElementById(
      'barcode-canvas',
    ) as HTMLCanvasElement | null;
    if (!canvas) return;
    try {
      // @ts-ignore
      bwipjs.toCanvas(canvas, {
        bcid: 'code128',
        text: String(barcodeProduct.barcode || barcodeProduct.sku),
        scale: 3,
        height: 10,
        includetext: true,
        textxalign: 'center',
      });
    } catch (e) {
      console.error('Failed to render barcode', e);
    }
  }, [barcodeProduct]);

  const { data, isLoading } = useQuery({
    queryKey: ['products', query],
    queryFn: async () => {
      const res = await api.get('/products', {
        params: query ? { q: query } : undefined,
      });
      return res.data;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data;
    },
  });

  const saveProduct = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name,
        sku: form.sku,
        isbn: form.isbn || undefined,
        price: Number(form.price),
        cost: Number(form.cost),
        unit: form.unit,
        reorderThreshold: Number(form.reorderThreshold) || 0,
        barcode: form.barcode || undefined,
        categoryId: form.categoryId ? Number(form.categoryId) : undefined,
      };
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, payload);
      } else {
        await api.post('/products', payload);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      setShowForm(false);
      setEditingProduct(null);
      setForm({
        name: '',
        sku: '',
        isbn: '',
        price: '',
        cost: '',
        unit: 'pcs',
        reorderThreshold: '0',
        barcode: '',
      });
      alert('Product saved');
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || 'Failed to save product');
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/products/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || 'Failed to delete product');
    },
  });

  const bulkImport = useMutation({
    mutationFn: async () => {
      const lines = bulkText
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);
      if (lines.length === 0) return;

      // Expected CSV: name,sku,isbn,price,cost,unit,reorderThreshold,barcode(optional)
      const payload = lines.map((line) => {
        const [name, sku, isbn, price, cost, unit, reorderThreshold, barcode] =
          line.split(',').map((p) => p.trim());
        return {
          name,
          sku,
          isbn: isbn || undefined,
          price: Number(price),
          cost: Number(cost),
          unit: unit || 'pcs',
          reorderThreshold: Number(reorderThreshold) || 0,
          barcode: barcode || undefined,
        };
      });

      await api.post('/products/bulk', payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      setBulkText('');
      setShowBulk(false);
      alert('Bulk products imported');
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || 'Bulk import failed');
    },
  });

  function openNewForm() {
    setEditingProduct(null);
    setForm({
      name: '',
      sku: '',
      isbn: '',
      price: '',
      cost: '',
      unit: 'pcs',
      reorderThreshold: '0',
      barcode: '',
      categoryId: '',
    });
    setShowForm(true);
  }

  function openEditForm(p: any) {
    setEditingProduct(p);
    setForm({
      name: p.name || '',
      sku: p.sku || '',
      isbn: p.isbn || '',
      price: String(p.price ?? ''),
      cost: String(p.cost ?? ''),
      unit: p.unit || 'pcs',
      reorderThreshold: String(p.reorderThreshold ?? '0'),
      barcode: p.barcode || '',
      categoryId: String(p.categoryId ?? ''),
    });
    setShowForm(true);
  }

  const adjustStock = useMutation({
    mutationFn: async () => {
      if (!stockProduct) return;
      await api.post('/stock/adjust', {
        productId: stockProduct.id,
        storeId: 1,
        quantity: Number(stockQuantity),
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      setStockProduct(null);
      setStockQuantity('');
      alert('Stock adjusted successfully');
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || 'Failed to adjust stock');
    },
  });

  function handleFormSubmit(e: FormEvent) {
    e.preventDefault();
    saveProduct.mutate();
  }

  return (
    <div className="space-y-4 sm:space-y-6 relative h-full flex flex-col overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-2xl">
            📦
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Products</h1>
            <p className="text-slate-600">Manage your inventory</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-72">
            <input
              placeholder="🔍 Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          <button
            type="button"
            onClick={openNewForm}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-xl text-sm font-semibold shadow-md whitespace-nowrap"
          >
            + Add Product
          </button>
          <button
            type="button"
            onClick={() => setShowBulk(true)}
            className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-3 rounded-xl text-sm font-semibold shadow-md whitespace-nowrap"
          >
            ⬆ Bulk Import
          </button>
        </div>
      </div>

      {/* Barcode Print Modal */}
      {barcodeProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h2 className="text-xl font-bold text-slate-800 mb-3 text-center">
              Barcode Label
            </h2>
            <p className="text-sm text-slate-600 text-center mb-2">
              {barcodeProduct.name} ({barcodeProduct.sku})
            </p>
            <div className="border border-slate-200 rounded-lg p-3 flex items-center justify-center mb-4">
              <canvas id="barcode-canvas" />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  const canvas = document.getElementById(
                    'barcode-canvas',
                  ) as HTMLCanvasElement | null;
                  if (!canvas) {
                    alert('Barcode not ready yet');
                    return;
                  }
                  const dataUrl = canvas.toDataURL('image/png');
                  const w = window.open('', '_blank');
                  if (!w) return;
                  w.document.write(`<!DOCTYPE html>
                    <html>
                    <head>
                      <title>Barcode</title>
                      <style>
                        @page { size: 80mm 40mm; margin: 0; }
                        body {
                          margin: 0;
                          display: flex;
                          justify-content: center;
                          align-items: center;
                          height: 100vh;
                        }
                        img { width: 90%; }
                      </style>
                    </head>
                    <body>
                      <img src="${dataUrl}" />
                    </body>
                    </html>`);
                  w.document.close();
                  w.focus();
                  setTimeout(() => {
                    w.print();
                    w.close();
                  }, 300);
                }}
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2.5 rounded-lg text-sm font-semibold"
              >
                Print Label
              </button>
              <button
                type="button"
                onClick={() => setBarcodeProduct(null)}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 py-2.5 rounded-lg text-sm font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex-1 flex flex-col min-h-0">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="text-4xl mb-2">⏳</div>
            <p className="text-lg">Loading products...</p>
          </div>
        ) : data && data.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <div className="text-4xl mb-2">📦</div>
            <p className="text-lg">No products found</p>
          </div>
        ) : (
          <div className="overflow-auto flex-1">
            <table className="w-full">
            <thead className="bg-slate-50 border-b-2 border-slate-200">
              <tr className="text-left">
                <th className="py-3 px-3 sm:py-4 sm:px-6 text-sm sm:text-base font-bold text-slate-700">
                  Product Name
                </th>
                <th className="py-3 px-3 sm:py-4 sm:px-6 text-sm sm:text-base font-bold text-slate-700 hidden lg:table-cell">
                  SKU
                </th>
                <th className="py-3 px-3 sm:py-4 sm:px-6 text-sm sm:text-base font-bold text-slate-700 hidden xl:table-cell">
                  ISBN
                </th>
                <th className="py-3 px-3 sm:py-4 sm:px-6 text-sm sm:text-base font-bold text-slate-700 hidden md:table-cell">
                  Barcode
                </th>
                <th className="py-3 px-3 sm:py-4 sm:px-6 text-sm sm:text-base font-bold text-slate-700">
                  Price
                </th>
                <th className="py-3 px-3 sm:py-4 sm:px-6 text-sm sm:text-base font-bold text-slate-700">
                  Stock
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.map((p: any) => (
                <tr
                  key={p.id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <td className="py-3 px-3 sm:py-4 sm:px-6 text-sm sm:text-base font-semibold">
                    {p.name}
                  </td>
                  <td className="py-3 px-3 sm:py-4 sm:px-6 text-sm sm:text-base text-slate-600 hidden lg:table-cell">
                    {p.sku}
                  </td>
                  <td className="py-3 px-3 sm:py-4 sm:px-6 text-sm sm:text-base text-slate-600 hidden xl:table-cell">
                    {p.isbn || '—'}
                  </td>
                  <td className="py-3 px-3 sm:py-4 sm:px-6 text-sm sm:text-base font-mono text-slate-600 hidden md:table-cell">
                    {p.barcode}
                  </td>
                  <td className="py-3 px-3 sm:py-4 sm:px-6 text-sm sm:text-base font-bold text-emerald-600">
                    Rs.{Number(p.price).toFixed(2)}
                  </td>
                  <td className="py-3 px-3 sm:py-4 sm:px-6 flex items-center gap-2 sm:gap-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                        (p.stock?.reduce(
                          (s: number, st: any) => s + st.quantity,
                          0,
                        ) ?? 0) < 10
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {p.stock?.reduce(
                        (s: number, st: any) => s + st.quantity,
                        0,
                      ) ?? 0}{' '}
                      units
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setStockProduct(p);
                        setStockQuantity('');
                      }}
                      className="text-xs px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-semibold text-slate-700"
                    >
                      Stock
                    </button>
                    <button
                      type="button"
                      onClick={() => setBarcodeProduct(p)}
                      className="text-xs px-2 py-1 rounded-lg bg-purple-100 hover:bg-purple-200 font-semibold text-purple-700"
                    >
                      🖨 Barcode
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditForm(p)}
                      className="text-xs px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-semibold text-slate-700"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Delete this product?')) {
                          deleteProduct.mutate(p.id);
                        }
                      }}
                      className="text-xs px-2 py-1 rounded-lg bg-red-100 hover:bg-red-200 font-semibold text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {/* Stock Adjustment Modal */}
      {stockProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Adjust Stock
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Product
                </label>
                <div className="text-lg font-bold text-slate-900">
                  {stockProduct.name}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Current Stock
                </label>
                <div className="text-2xl font-bold text-emerald-600">
                  {stockProduct.stock?.reduce(
                    (s: number, st: any) => s + st.quantity,
                    0,
                  ) ?? 0}{' '}
                  units
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Adjust By (+ to add, - to remove)
                </label>
                <input
                  type="number"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  className="w-full border-2 border-slate-300 rounded-lg px-4 py-3 text-lg font-semibold text-center focus:outline-none focus:border-blue-500"
                  placeholder="e.g. +10 or -5"
                  autoFocus
                />
                <p className="text-xs text-slate-500 mt-1">
                  Positive to add stock, negative to remove
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => adjustStock.mutate()}
                  disabled={!stockQuantity || adjustStock.isPending}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
                >
                  {adjustStock.isPending ? 'Adjusting...' : 'Adjust Stock'}
                </button>
                <button
                  onClick={() => setStockProduct(null)}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 py-3 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Form Drawer */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-end z-20">
          <div className="w-full sm:max-w-lg bg-white h-full p-4 sm:p-6 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-slate-500 hover:text-slate-700 text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Name
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border-2 border-slate-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    SKU
                  </label>
                  <input
                    value={form.sku}
                    onChange={(e) =>
                      setForm({ ...form, sku: e.target.value })
                    }
                    className="w-full border-2 border-slate-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    ISBN (optional)
                  </label>
                  <input
                    value={form.isbn}
                    onChange={(e) =>
                      setForm({ ...form, isbn: e.target.value })
                    }
                    className="w-full border-2 border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Category
                </label>
                <select
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm({ ...form, categoryId: e.target.value })
                  }
                  className="w-full border-2 border-slate-300 rounded-lg px-3 py-2"
                >
                  <option value="">Select Category</option>
                  {categories?.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Price (Rs.)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    className="w-full border-2 border-slate-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Cost (Rs.)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.cost}
                    onChange={(e) =>
                      setForm({ ...form, cost: e.target.value })
                    }
                    className="w-full border-2 border-slate-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Unit
                  </label>
                  <input
                    value={form.unit}
                    onChange={(e) =>
                      setForm({ ...form, unit: e.target.value })
                    }
                    className="w-full border-2 border-slate-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Reorder Threshold
                  </label>
                  <input
                    type="number"
                    value={form.reorderThreshold}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        reorderThreshold: e.target.value,
                      })
                    }
                    className="w-full border-2 border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Barcode (leave blank to auto-generate)
                </label>
                <input
                  value={form.barcode}
                  onChange={(e) =>
                    setForm({ ...form, barcode: e.target.value })
                  }
                  className="w-full border-2 border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <button
                type="submit"
                disabled={saveProduct.isPending}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg text-sm font-semibold disabled:opacity-60"
              >
                {saveProduct.isPending
                  ? 'Saving…'
                  : editingProduct
                  ? 'Update Product'
                  : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {showBulk && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-30 p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-4 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">
                Bulk Import Products (CSV)
              </h2>
              <button
                type="button"
                onClick={() => setShowBulk(false)}
                className="text-slate-500 hover:text-slate-700 text-xl"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-slate-600">
              Paste CSV rows in the format:
              <br />
              <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                name, sku, isbn, price, cost, unit, reorderThreshold, barcode
              </code>
              <br />
              Example:
              <br />
              <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                Book A, BOOK-A, 9780000000001, 199.00, 120.00, pcs, 5,
              </code>
            </p>
            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              className="w-full h-40 border-2 border-slate-300 rounded-lg px-3 py-2 text-sm font-mono"
              placeholder="Paste CSV lines here..."
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowBulk(false)}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={bulkImport.isPending}
                onClick={() => bulkImport.mutate()}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-slate-800 hover:bg-slate-900 disabled:opacity-60"
              >
                {bulkImport.isPending ? 'Importing…' : 'Import'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
