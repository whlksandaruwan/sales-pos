import { useState, useRef } from 'react';
import { api } from '../lib/api';

type Provider = 'electricity' | 'water';

function getProviderDisplay(provider: Provider) {
  if (provider === 'electricity') {
    return { label: 'CEB - Electricity', logo: '⚡' };
  }
  return { label: 'Water Board', logo: '💧' };
}

export default function BillPaymentsPage() {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [provider, setProvider] = useState<Provider>('electricity');
  const [reference, setReference] = useState('');
  const [fetched, setFetched] = useState<{
    amount: number;
    status: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState<any | null>(null);

  async function handleFetch() {
    if (!reference) {
      alert('Please enter bill reference');
      return;
    }
    setLoading(true);
    setPaid(null);
    try {
      const res = await api.post('/bill-payments/fetch', {
        provider,
        reference,
      });
      setFetched({
        amount: Number(res.data.amount),
        status: res.data.status,
      });
    } catch (err: any) {
      console.error('Fetch bill error:', err);
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to fetch bill. Please check if backend is running.';
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  async function handlePay() {
    if (!fetched) return;
    setLoading(true);
    try {
      const res = await api.post(
        '/bill-payments/pay',
        {
          provider,
          reference,
          amount: fetched.amount,
        },
        {
          headers: {
            'idempotency-key': `${Date.now()}-${provider}-${reference}`,
          },
        },
      );
      setPaid(res.data);
      setFetched(null);
      setReference('');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  }

  function handlePrintReceipt() {
    if (!receiptRef.current) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const receiptContent = receiptRef.current.innerHTML;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Bill Payment Receipt</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            @page {
              size: 79mm 76mm;
              margin: 0;
            }
            body {
              font-family: 'Courier New', monospace;
              width: 79mm;
              height: 76mm;
              padding: 2mm;
              font-size: 9pt;
              line-height: 1.2;
              overflow: hidden;
            }
            .receipt-container {
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
            }
            .header {
              text-align: center;
              border-bottom: 1px dashed #000;
              padding-bottom: 1.5mm;
              margin-bottom: 1.5mm;
            }
            .header h1 {
              font-size: 12pt;
              margin-bottom: 0.5mm;
              font-weight: bold;
            }
            .header p {
              font-size: 8pt;
            }
            .section {
              margin-bottom: 1.5mm;
            }
            .section-title {
              font-size: 7pt;
              text-transform: uppercase;
              margin-bottom: 0.3mm;
              font-weight: bold;
            }
            .section-value {
              font-size: 9pt;
              font-weight: bold;
              word-wrap: break-word;
            }
            .amount {
              font-size: 12pt;
              font-weight: bold;
              text-align: center;
            }
            .divider {
              border-top: 1px dashed #000;
              margin: 1.5mm 0;
            }
            .footer {
              text-align: center;
              font-size: 6pt;
              margin-top: auto;
              padding-top: 1.5mm;
              border-top: 1px dashed #000;
              line-height: 1.3;
            }
            .footer p {
              margin-bottom: 0.5mm;
            }
            @media print {
              body {
                padding: 1.5mm;
              }
            }
          </style>
        </head>
        <body>
          ${receiptContent}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }

  return (
    <div className="max-w-3xl mx-auto h-full overflow-auto">
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 space-y-4 sm:space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-2xl">
            💳
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Bill Payments</h1>
        </div>
        <p className="text-slate-600 text-base">
          Record electricity and water bill payments. Actual payment is done on
          the official provider websites below.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-sm text-slate-700">
          <p className="font-semibold">Official online payment links:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              CEB (Electricity):{' '}
              <a
                href="https://payment.ceb.lk/instantpay"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                Open CEB Instant Pay Portal
              </a>
            </li>
            <li>
              NWSDB Water Board: {' '}
              <a
                href="https://ebis.waterboard.lk/smartzone/English/OnlinePayments"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                Open NWSDB Online Payment Portal
              </a>
            </li>
          </ul>
          <p className="text-xs text-slate-500">
            After paying on the official site, you can use this screen to save
            the payment details into your POS history.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-base font-bold mb-3 text-slate-700">
              Service Provider
            </label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as Provider)}
              className="w-full border-2 border-slate-300 rounded-xl px-4 py-4 text-base font-medium focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="electricity">⚡ Electricity</option>
              <option value="water">💧 Water</option>
            </select>
          </div>
          <div>
            <label className="block text-base font-bold mb-3 text-slate-700">
              Bill / Account Number
            </label>
            <input
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="w-full border-2 border-slate-300 rounded-xl px-4 py-4 text-base focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Enter reference number"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleFetch}
          disabled={loading || !reference}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
        >
          {loading ? '⏳ Fetching...' : '🔍 Fetch Bill Details'}
        </button>

        {fetched && (
          <div className="border-2 border-blue-200 bg-blue-50 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-slate-700">
                Bill Amount:
              </span>
              <span className="text-3xl font-bold text-blue-600">
                Rs.{fetched.amount.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-slate-700">
                Status:
              </span>
              <span className="text-lg font-bold text-orange-600">
                {fetched.status}
              </span>
            </div>
            <button
              type="button"
              onClick={handlePay}
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-xl text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
            >
              {loading ? '⏳ Processing...' : '✓ Pay Bill Now'}
            </button>
          </div>
        )}

        {paid && (
          <>
            {/* Screen view */}
            <div className="border-2 border-emerald-200 bg-emerald-50 rounded-xl p-6 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-2xl">
                    {getProviderDisplay(paid.provider as Provider).logo}
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-emerald-700 font-semibold">
                      Bill Payment Receipt
                    </div>
                    <div className="text-sm text-slate-500">Ahasna Sale Center</div>
                  </div>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <div>Txn ID</div>
                  <div className="font-mono font-semibold">
                    #{paid.id ?? '-'}
                  </div>
                </div>
              </div>

              {/* Provider & account */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-slate-500 text-xs font-semibold uppercase">
                    Provider
                  </div>
                  <div className="font-semibold text-slate-900">
                    {getProviderDisplay(paid.provider as Provider).label}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 text-xs font-semibold uppercase">
                    Customer Account
                  </div>
                  <div className="font-semibold text-slate-900">
                    {paid.reference}
                  </div>
                </div>
              </div>

              {/* Amount & status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-slate-500 text-xs font-semibold uppercase">
                    Amount Paid
                  </div>
                  <div className="text-2xl font-bold text-emerald-600">
                    Rs.{Number(paid.amount).toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 text-xs font-semibold uppercase">
                    Status
                  </div>
                  <div className="font-semibold text-emerald-700">
                    {paid.status}
                  </div>
                </div>
              </div>

              {/* Date & time */}
              <div className="flex flex-col sm:flex-row justify-between gap-2 text-xs text-slate-600 border-t border-emerald-200 pt-3">
                <div>
                  <span className="font-semibold">Date &amp; Time: </span>
                  <span className="font-mono">
                    {new Date(paid.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <button
                    type="button"
                    onClick={handlePrintReceipt}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-emerald-500 text-emerald-700 text-xs font-semibold hover:bg-emerald-50"
                  >
                    🖨 Print Receipt
                  </button>
                </div>
              </div>
            </div>

            {/* Hidden print-optimized receipt */}
            <div ref={receiptRef} style={{ display: 'none' }}>
              <div className="receipt-container">
                <div className="header">
                  <h1>AHASNA SALE CENTER</h1>
                  <p>Bill Payment Receipt</p>
                </div>

                <div className="section">
                  <div className="section-title">Txn ID</div>
                  <div className="section-value">#{paid.id ?? '-'}</div>
                </div>

                <div className="divider"></div>

                <div className="section">
                  <div className="section-title">Provider</div>
                  <div className="section-value">
                    {getProviderDisplay(paid.provider as Provider).label}
                  </div>
                </div>

                <div className="section">
                  <div className="section-title">Account</div>
                  <div className="section-value">{paid.reference}</div>
                </div>

                <div className="divider"></div>

                <div className="section">
                  <div className="section-title">Amount</div>
                  <div className="amount">Rs. {Number(paid.amount).toFixed(2)}</div>
                </div>

                <div className="section">
                  <div className="section-title">Status</div>
                  <div className="section-value">{paid.status}</div>
                </div>

                <div className="divider"></div>

                <div className="section">
                  <div className="section-title">Date</div>
                  <div className="section-value">
                    {new Date(paid.createdAt).toLocaleString('en-GB', { 
                      day: '2-digit', 
                      month: '2-digit', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>

                <div className="footer">
                  <p>Thank you!</p>
                  <p>Computer-generated receipt</p>
                  <p>Software By INNOVATECH</p>
                  <p>0742256408</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
