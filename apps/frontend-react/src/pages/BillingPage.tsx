import { useEffect, useRef, useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { api } from '../lib/api';

type ExtraPayment = {
  id: number;
  method: 'Card' | 'QR' | 'DigitalWallet' | 'Credit';
  amount: string;
};

export default function BillingPage() {
  const scanInputRef = useRef<HTMLInputElement | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);
  const [scanCode, setScanCode] = useState('');
  const [cashTendered, setCashTendered] = useState('');
  const [discount, setDiscount] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [extraPayments, setExtraPayments] = useState<ExtraPayment[]>([]);
  const [lastSale, setLastSale] = useState<any>(null);
  const { items, addItem, increment, decrement, remove, clear} = useCartStore();

  useEffect(() => {
    scanInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.activeElement !== scanInputRef.current) {
        scanInputRef.current?.focus();
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const subtotal = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0,
  );
  const discountNum = Number(discount) || 0;
  const total = Math.max(0, subtotal - discountNum);

  async function handleScanSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!scanCode) return;
    try {
      const res = await api.get(
        `/products/by-barcode/${encodeURIComponent(scanCode)}`,
      );
      const p = res.data;
      addItem({ productId: p.id, name: p.name, price: Number(p.price) });
      setScanCode('');
      scanInputRef.current?.focus();
    } catch {
      alert('Product not found');
    }
  }

  function handleQuickCash(amount: number) {
    setCashTendered(String(amount));
  }

  function addExtraPayment() {
    const existingTotal = extraPayments.reduce(
      (sum, p) => sum + (Number(p.amount) || 0),
      0,
    );
    const cash = Number(cashTendered) || 0;
    const remaining = Math.max(0, total - cash - existingTotal);
    setExtraPayments((prev) => [
      ...prev,
      {
        id: Date.now(),
        method: 'Card',
        amount: remaining > 0 ? String(remaining) : '',
      },
    ]);
  }

  function updateExtraPayment(
    id: number,
    field: 'method' | 'amount',
    value: string,
  ) {
    setExtraPayments((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, [field]: value } : p,
      ),
    );
  }

  function removeExtraPayment(id: number) {
    setExtraPayments((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleCheckout() {
    if (items.length === 0) {
      alert('Cart is empty');
      return;
    }

    const cashAmount = Number(cashTendered) || 0;
    const extras = extraPayments
      .map((p) => ({
        method: p.method,
        amount: Number(p.amount) || 0,
      }))
      .filter((p) => p.amount > 0);

    const payments: { method: string; amount: number }[] = [];
    if (cashAmount > 0) {
      payments.push({ method: 'Cash', amount: cashAmount });
    }
    payments.push(...extras);

    if (payments.length === 0) {
      alert('Enter at least one payment (Cash, Card, QR, Digital Wallet, or Credit)');
      return;
    }

    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    if (totalPaid + 0.01 < total) {
      alert('Payment total is less than bill total');
      return;
    }

    const hasCredit = payments.some((p) => p.method === 'Credit');
    const customerIdNum = Number(customerId) || undefined;
    if (hasCredit && !customerIdNum) {
      alert('Credit sales require selecting a customer (enter Customer ID).');
      return;
    }

    try {
      const saleData = {
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          price: i.price,
          name: i.name,
        })),
        discount: discountNum > 0 ? discountNum : undefined,
        customerId: customerIdNum,
        payments,
        subtotal,
        total,
      };
      
      const res = await api.post('/sales', saleData);
      
      setLastSale({
        ...res.data,
        items: saleData.items,
        payments: saleData.payments,
        subtotal: saleData.subtotal,
        total: saleData.total,
        discount: discountNum,
        createdAt: new Date().toISOString(),
      });
      
      clear();
      setCashTendered('');
      setDiscount('');
      setCustomerId('');
      setExtraPayments([]);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Checkout failed');
    }
  }
  
  function handlePrintReceipt() {
    if (!lastSale) return;
    
    // Calculate totals
    const totalPaid = lastSale.payments?.reduce((sum: number, p: any) => sum + p.amount, 0) || 0;
    const change = totalPaid - (lastSale.total || 0);
    
    // Build plain text receipt for 79mm thermal printer (32 chars per line)
    let receipt = '';
    receipt += '\n';
    receipt += '================================\n';
    receipt += '     AHASNA SALE CENTER\n';
    receipt += '================================\n';
    receipt += '        Sales Receipt\n';
    receipt += '================================\n\n';
    receipt += `Invoice No: #${lastSale.id}\n`;
    receipt += `Date: ${new Date(lastSale.createdAt).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}\n\n`;
    receipt += '--------------------------------\n';
    receipt += 'ITEMS:\n';
    receipt += '--------------------------------\n';
    
    lastSale.items?.forEach((item: any) => {
      const name = item.name.substring(0, 28);
      const qty = item.quantity;
      const price = item.price.toFixed(2);
      const total = (item.price * item.quantity).toFixed(2);
      receipt += `${name}\n`;
      receipt += `  ${qty} x Rs.${price}`;
      const spaces = 32 - (`  ${qty} x Rs.${price}`.length + `Rs.${total}`.length);
      receipt += ' '.repeat(Math.max(1, spaces));
      receipt += `Rs.${total}\n`;
    });
    
    receipt += '--------------------------------\n';
    receipt += `Subtotal:`;
    const subSpaces = 32 - ('Subtotal:'.length + `Rs.${lastSale.subtotal?.toFixed(2)}`.length);
    receipt += ' '.repeat(Math.max(1, subSpaces));
    receipt += `Rs.${lastSale.subtotal?.toFixed(2)}\n`;
    
    if (lastSale.discount > 0) {
      receipt += `Discount:`;
      const discSpaces = 32 - ('Discount:'.length + `-Rs.${lastSale.discount.toFixed(2)}`.length);
      receipt += ' '.repeat(Math.max(1, discSpaces));
      receipt += `-Rs.${lastSale.discount.toFixed(2)}\n`;
    }
    
    receipt += '================================\n';
    receipt += `TOTAL:`;
    const totalSpaces = 32 - ('TOTAL:'.length + `Rs.${lastSale.total?.toFixed(2)}`.length);
    receipt += ' '.repeat(Math.max(1, totalSpaces));
    receipt += `Rs.${lastSale.total?.toFixed(2)}\n`;
    receipt += '================================\n\n';
    
    receipt += 'PAYMENT:\n';
    lastSale.payments?.forEach((payment: any) => {
      receipt += `  ${payment.method}:`;
      const paySpaces = 32 - (`  ${payment.method}:`.length + `Rs.${payment.amount.toFixed(2)}`.length);
      receipt += ' '.repeat(Math.max(1, paySpaces));
      receipt += `Rs.${payment.amount.toFixed(2)}\n`;
    });
    
    if (change > 0) {
      receipt += `  Change:`;
      const changeSpaces = 32 - ('  Change:'.length + `Rs.${change.toFixed(2)}`.length);
      receipt += ' '.repeat(Math.max(1, changeSpaces));
      receipt += `Rs.${change.toFixed(2)}\n`;
    }
    
    receipt += '\n================================\n';
    receipt += '   Thank you for your purchase!\n';
    receipt += '       Please come again\n';
    receipt += '================================\n\n';
    
    // Open print window with plain text
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt</title>
          <style>
            @page { 
              margin: 0;
              size: 79mm auto;
            }
            body {
              font-family: 'Courier New', monospace;
              font-size: 14px;
              line-height: 1.3;
              margin: 0;
              padding: 3mm 3mm 0 3mm;
              white-space: pre;
              font-weight: bold;
            }
            .footer {
              font-size: 11px;
              text-align: center;
              margin-top: 2mm;
              font-weight: 600;
              line-height: 1.4;
            }
          </style>
        </head>
        <body><pre>${receipt}</pre><div class="footer">Software By INNOVATECH Solutions<br>0742256408</div></body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }

  const cashAmount = Number(cashTendered) || 0;
  const extraTotal = extraPayments.reduce(
    (sum, p) => sum + (Number(p.amount) || 0),
    0,
  );
  const totalPaid = cashAmount + extraTotal;
  const change = Math.max(0, totalPaid - total);

  return (
    <>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full max-h-[calc(100vh-8rem)]">
      {/* Left: Cart Items */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col min-h-[400px] lg:min-h-0">
        <form onSubmit={handleScanSubmit} className="mb-6">
          <label className="block text-lg font-bold mb-3 text-slate-700">
            🔍 Scan Barcode
          </label>
          <input
            ref={scanInputRef}
            value={scanCode}
            onChange={(e) => setScanCode(e.target.value)}
            className="w-full border-2 border-slate-300 rounded-xl px-5 py-4 text-lg focus:outline-none focus:border-emerald-500 transition-colors"
            placeholder="Scan or type barcode here..."
            autoFocus
          />
        </form>

        <div className="flex-1 overflow-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-xl">Cart is empty</p>
              <p className="text-sm">Scan a product to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="border-b-2 border-slate-200">
                  <tr className="text-left">
                    <th className="py-3 text-sm sm:text-base font-bold text-slate-700">Item</th>
                    <th className="py-3 text-sm sm:text-base font-bold text-slate-700">Quantity</th>
                    <th className="py-3 text-sm sm:text-base font-bold text-slate-700">Price</th>
                    <th className="py-3 text-sm sm:text-base font-bold text-slate-700">Subtotal</th>
                    <th className="py-3"></th>
                  </tr>
                </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.productId} className="border-b border-slate-100">
                    <td className="py-4 text-sm sm:text-base font-medium">{item.name}</td>
                    <td className="py-4">
                      <div className="inline-flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                        <button
                          type="button"
                          className="w-8 h-8 bg-white rounded-md hover:bg-slate-200 font-bold text-lg"
                          onClick={() => decrement(item.productId)}
                        >
                          −
                        </button>
                        <span className="w-12 text-center font-bold text-lg">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="w-8 h-8 bg-white rounded-md hover:bg-slate-200 font-bold text-lg"
                          onClick={() => increment(item.productId)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-4 text-sm sm:text-base font-semibold">
                      Rs.{item.price.toFixed(2)}
                    </td>
                    <td className="py-4 text-sm sm:text-base font-bold text-emerald-600">
                      Rs.{(item.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="py-4">
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700 font-medium"
                        onClick={() => remove(item.productId)}
                      >
                        🗑️ Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>
      </div>

      {/* Right: Payment Panel */}
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 min-h-[400px] lg:min-h-0">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="text-sm font-medium mb-1">Total Amount</div>
          <div className="text-4xl font-bold">Rs.{total.toFixed(2)}</div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-base font-bold mb-2 text-slate-700">
              🎟 Discount (Rs.)
            </label>
            <input
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-base font-bold mb-2 text-slate-700">
              👤 Customer ID (for Credit Sales)
            </label>
            <input
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="Enter customer ID (optional)"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-base font-bold mb-3 text-slate-700">
              💵 Cash Tendered
            </label>
            <input
              value={cashTendered}
              onChange={(e) => setCashTendered(e.target.value)}
              className="w-full border-2 border-slate-300 rounded-xl px-4 py-4 text-xl font-semibold text-center focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="0.00"
            />
            <div className="mt-4 grid grid-cols-2 gap-2">
              {[20, 50, 100, 200, 500, 1000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  className="bg-slate-100 hover:bg-slate-200 rounded-lg px-4 py-3 text-base font-bold transition-colors"
                  onClick={() => handleQuickCash(amt)}
                >
                  Rs.{amt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-slate-700">
                Other Payments
              </span>
              <button
                type="button"
                onClick={addExtraPayment}
                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
              >
                + Add Payment
              </button>
            </div>

            {extraPayments.length === 0 && (
              <p className="text-xs text-slate-400">
                Use this to add Card / QR / Digital Wallet / Credit payments or split bills.
              </p>
            )}

            <div className="space-y-2 max-h-40 overflow-y-auto">
              {extraPayments.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-2 border border-slate-200 rounded-lg px-2 py-2"
                >
                  <select
                    value={p.method}
                    onChange={(e) =>
                      updateExtraPayment(p.id, 'method', e.target.value)
                    }
                    className="border-2 border-slate-300 rounded-lg px-2 py-1 text-sm"
                  >
                    <option value="Card">Card</option>
                    <option value="QR">QR</option>
                    <option value="DigitalWallet">Digital Wallet</option>
                    <option value="Credit">Credit</option>
                  </select>
                  <input
                    value={p.amount}
                    onChange={(e) =>
                      updateExtraPayment(p.id, 'amount', e.target.value)
                    }
                    className="flex-1 border-2 border-slate-300 rounded-lg px-2 py-1 text-sm"
                    placeholder="Amount"
                  />
                  <button
                    type="button"
                    onClick={() => removeExtraPayment(p.id)}
                    className="text-red-500 hover:text-red-700 text-lg px-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 space-y-1">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-slate-600">Paid Total:</span>
            <span className="font-semibold text-slate-800">
              Rs.{totalPaid.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-slate-600">Change:</span>
            <span className="font-bold text-lg text-emerald-600">
              Rs.{change.toFixed(2)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCheckout}
          disabled={items.length === 0}
          className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-5 rounded-xl text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
        >
          ✓ Complete Sale
        </button>
      </div>
    </div>

    {lastSale && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
          <div className="text-center mb-4">
            <div className="text-5xl mb-2">✅</div>
            <h2 className="text-2xl font-bold text-emerald-600">Sale Completed!</h2>
            <p className="text-slate-600">Invoice #{lastSale.id}</p>
          </div>
          
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between">
              <span className="text-slate-600">Subtotal:</span>
              <span className="font-semibold">Rs.{lastSale.subtotal?.toFixed(2)}</span>
            </div>
            {lastSale.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-600">Discount:</span>
                <span className="font-semibold text-red-600">-Rs.{lastSale.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span className="text-emerald-600">Rs.{lastSale.total?.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePrintReceipt}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold"
            >
              🖨 Print Receipt
            </button>
            <button
              onClick={() => setLastSale(null)}
              className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 py-3 rounded-lg font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}

    {lastSale && (
      <div ref={receiptRef} style={{ display: 'none' }}>
        <div className="receipt-container">
          <div className="header">
            <h1>AHASNA SALE CENTER</h1>
            <p>Sales Receipt</p>
          </div>

          <div className="section">
            <div className="section-title">Invoice No</div>
            <div className="section-value">#{lastSale.id}</div>
          </div>

          <div className="section">
            <div className="section-title">Date</div>
            <div className="section-value">
              {new Date(lastSale.createdAt).toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>

          <div className="divider"></div>

          <table className="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th className="text-right">Qty</th>
                <th className="text-right">Price</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {lastSale.items?.map((item: any, idx: number) => (
                <tr key={idx}>
                  <td>{item.name}</td>
                  <td className="text-right">{item.quantity}</td>
                  <td className="text-right">{item.price.toFixed(2)}</td>
                  <td className="text-right">{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="divider"></div>

          <div className="total-line" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Subtotal:</span>
            <span>Rs. {lastSale.subtotal?.toFixed(2)}</span>
          </div>

          {lastSale.discount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9pt' }}>
              <span>Discount:</span>
              <span>-Rs. {lastSale.discount.toFixed(2)}</span>
            </div>
          )}

          <div className="total-line" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11pt' }}>
            <span>TOTAL:</span>
            <span>Rs. {lastSale.total?.toFixed(2)}</span>
          </div>

          <div className="divider"></div>

          <div className="section">
            <div className="section-title">Payment Method(s)</div>
            {lastSale.payments?.map((payment: any, idx: number) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8pt', marginBottom: '0.5mm' }}>
                <span>{payment.method}:</span>
                <span>Rs. {payment.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="footer">
            <p>Thank you for your purchase!</p>
            <p>Please come again</p>
            <p style={{ marginTop: '2mm' }}>Software By INNOVATECH</p>
            <p>0742256408</p>
          </div>
        </div>
      </div>
    )}
  </>
  );
}
