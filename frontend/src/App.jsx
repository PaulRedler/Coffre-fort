import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// --- Fake API (to be replaced with backend calls) ---
const api = {
  async login(username, password) {
    return { token: "dummy-token", role: username === "admin" ? "admin" : "user" };
  },
  async getDocuments() {
    return [
      { id: 1, title: "Contrat.pdf", summary: "Contrat de prestation..." },
      { id: 2, title: "Facture.pdf", summary: "Facture du 14/02..." }
    ];
  },
  async analyzeDocument(id) {
    return {
      summary: "Résumé automatique du document...",
      keywords: ["contrat", "signature", "client"]
    };
  }
};

// --- Components ---
function Login({ setAuth }) {
  const [username, setU] = useState("");
  const [password, setP] = useState("");

  async function submit() {
    const res = await api.login(username, password);
    setAuth(res);
  }

  return (
    <div className="p-10 flex flex-col gap-4 max-w-md mx-auto">
      <h1 className="text-3xl font-bold">Connexion</h1>
      <input className="border p-2" placeholder="Utilisateur" onChange={e=>setU(e.target.value)}/>
      <input className="border p-2" placeholder="Mot de passe" type="password" onChange={e=>setP(e.target.value)}/>
      <button className="bg-blue-600 text-white p-2 rounded" onClick={submit}>Se connecter</button>
    </div>
  );
}

function DocumentList() {
  const [docs, setDocs] = useState([]);

  useEffect(()=>{
    api.getDocuments().then(setDocs);
  },[]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Documents</h1>
      <ul className="space-y-3">
        {docs.map(d => (
          <li key={d.id} className="p-4 border rounded">
            <Link to={`/documents/${d.id}`} className="text-blue-600 underline">{d.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DocumentView({ id }) {
  const [analysis, setAnalysis] = useState(null);

  async function runAnalysis() {
    const result = await api.analyzeDocument(id);
    setAnalysis(result);
  }

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Document #{id}</h1>
      <button onClick={runAnalysis} className="bg-green-600 text-white p-2 rounded">Analyser</button>

      {analysis && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-xl font-bold">Résumé IA</h2>
          <p>{analysis.summary}</p>
          <h3 className="font-semibold mt-2">Mots-clés :</h3>
          <ul className="list-disc ml-6">
            {analysis.keywords.map(k => <li key={k}>{k}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

function Wrapper() {
  const [auth, setAuth] = useState(null);

  if (!auth) return <Login setAuth={setAuth} />;

  return (
    <Router>
      <nav className="p-4 bg-gray-200 flex gap-4">
        <Link to="/documents" className="underline">Documents</Link>
        {auth.role === "admin" && <Link to="/admin" className="underline">Admin</Link>}
      </nav>

      <Routes>
        <Route path="/documents" element={<DocumentList />} />
        <Route path="/documents/:id" element={<DynamicDocView />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

function DynamicDocView() {
  const id = window.location.pathname.split("/").pop();
  return <DocumentView id={id} />;
}

function AdminPanel() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Panel Admin</h1>
      <p>Ici : gestion des rôles, fenêtres d'accès, etc.</p>
    </div>
  );
}

export default function App(){
  return <Wrapper />;
}
