export default function CompanyPage() {
    return (
      <div className="max-w-3xl bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          🏢 Company Details
        </h1>
  
        <div className="space-y-2 text-base text-slate-700">
          <div>
            <span className="font-semibold">Shop Name: </span>
            <span>My Bookshop</span>
          </div>
          <div>
            <span className="font-semibold">Address: </span>
            <span>123 Main Street, City, Country</span>
          </div>
          <div>
            <span className="font-semibold">Phone: </span>
            <span>+91-98765-43210</span>
          </div>
          <div>
            <span className="font-semibold">Email: </span>
            <span>info@mybookshop.local</span>
          </div>
          <div>
            <span className="font-semibold">GST / Tax No: </span>
            <span>GSTIN-1234-5678-90</span>
          </div>
          <div>
            <span className="font-semibold">Website: </span>
            <span>www.mybookshop.local</span>
          </div>
        </div>
  
        <p className="text-xs text-slate-400">
          You can edit this page text in <code>CompanyPage.tsx</code> to match your
          real company details.
        </p>
      </div>
    );
  }