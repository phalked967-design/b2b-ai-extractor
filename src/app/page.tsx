"use client";
import React, { useState, useEffect } from 'react';
import { Database, Upload, FileText, BarChart3, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [saveStatus, setSaveStatus] = useState<string>("Ready to pipeline direct to production servers.");
  const [recordCount, setRecordCount] = useState<number>(0);

  // Initialize browser-native IndexedDB system instantly
  useEffect(() => {
    const request = indexedDB.open("ExtractIntelDB", 1);
    request.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("documents")) {
        db.createObjectStore("documents", { keyPath: "id", autoIncrement: true });
      }
    };
    request.onsuccess = (e: any) => {
      const db = e.target.result;
      const tx = db.transaction("documents", "readonly");
      const store = tx.objectStore("documents");
      const countReq = store.count();
      countReq.onsuccess = () => setRecordCount(countReq.result);
    };
  }, [isSaved]);

  const startExtractionSimulator = () => {
    setIsProcessing(true);
    setIsSaved(false);
    setExtractedData(null);
    setSaveStatus("Ready to pipeline direct to production servers.");
    
    setTimeout(() => {
      setIsProcessing(false);
      setExtractedData({
        "target_enterprise": "Global Logistics Corp Ltd",
        "identified_tax_id": "IN-GST-27AAAAA1111A1Z2",
        "invoice_valuation_metrics": {
          "net_currency": "USD",
          "gross_subtotal_amount": 42500.00,
          "calculated_applied_tax": 7650.00,
          "absolute_net_payable": 50150.00
        },
        "line_items_extracted": [
          { "id": 1, "sku": "AI-SRV-001", "units": 2, "unit_cost": 15000.00 },
          { "id": 2, "sku": "DATA-MIG-04", "units": 1, "unit_cost": 12500.00 }
        ]
      });
    }, 600);
  };

  const pushToNativeDatabase = () => {
    if (!extractedData) return;
    setSaveStatus("Writing transaction matrix directly to IndexedDB architecture...");
    
    const request = indexedDB.open("ExtractIntelDB", 1);
    request.onsuccess = (e: any) => {
      const db = e.target.result;
      const tx = db.transaction("documents", "readwrite");
      const store = tx.objectStore("documents");
      
      const payload = {
        enterprise_name: extractedData.target_enterprise,
        tax_id: extractedData.identified_tax_id,
        currency: extractedData.invoice_valuation_metrics.net_currency,
        net_payable: extractedData.invoice_valuation_metrics.absolute_net_payable,
        raw_json_payload: extractedData,
        timestamp: new Date().toISOString()
      };

      const addReq = store.add(payload);
      
      tx.oncomplete = () => {
        setIsSaved(true);
        setSaveStatus("🎉 Transaction successfully written to browser native database!");
      };
      
      addReq.onerror = () => {
        setSaveStatus("Pipeline Error: Failed to commit write matrix to hardware layer.");
      };
    };
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans p-6">
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur p-4 flex items-center justify-between mb-6 rounded-lg">
        <div className="flex items-center gap-2">
          <Database className="w-6 h-6 text-emerald-500" />
          <span className="font-bold text-lg text-white">ExtractIntel.AI</span>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl w-full mx-auto">
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-400" /> Document Ingestion Pipeline
            </h2>
            <div onClick={startExtractionSimulator} className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-950/40">
              <FileText className={`w-12 h-12 mb-3 ${isProcessing ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
              <p className="text-sm font-medium text-slate-200">Click to run automated extraction</p>
              <button className="mt-4 text-xs font-semibold bg-emerald-500 text-slate-950 px-4 py-2 rounded-md">
                {isProcessing ? 'Parsing...' : 'Trigger Auto-Extract'}
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" /> Diagnostics
            </h2>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/60">
                <p className="text-slate-500">Database Engine</p>
                <p className="font-bold text-emerald-400 mt-1 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Browser Core</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/60">
                <p className="text-slate-500">Committed Records</p>
                <p className="font-semibold text-slate-300 mt-1">{recordCount} Entries</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
          <div className="border-b border-slate-800 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-200">Structured AI Engine Streams Output</h2>
          </div>
          
          <div className="flex-1 bg-slate-950 p-5 font-mono text-xs text-emerald-400/90 min-h-[250px]">
            {isProcessing ? (
              <p className="text-emerald-500/70">Executing background parsing array...</p>
            ) : extractedData ? (
              <pre className="whitespace-pre-wrap">{JSON.stringify(extractedData, null, 2)}</pre>
            ) : (
              <p className="text-slate-600">System awaiting pipeline execution payload.</p>
            )}
          </div>

          <div className="p-4 bg-slate-900/50 flex items-center justify-between border-t border-slate-800">
            <p className="text-xs text-slate-400">{saveStatus}</p>
            {extractedData && (
              <button onClick={pushToNativeDatabase} disabled={isSaved} className={`text-xs font-semibold px-4 py-2 rounded-md transition-all flex items-center gap-1.5 ${isSaved ? 'bg-slate-800 text-emerald-400 border border-slate-700 cursor-not-allowed' : 'bg-emerald-500 text-slate-950 font-bold'}`}>
                {isSaved ? 'Data Synchronised' : 'Commit to Local DB'} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
