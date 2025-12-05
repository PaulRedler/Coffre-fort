import {useState} from "react";

export default function Login() {
  const [email,setEmail] = useState("");
  const [password,setPassword]=useState("");

  async function login() {
    const res = await fetch("/api/auth/login", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({email,password})
    });
    const data = await res.json();
    localStorage.setItem("token", data.token);
    window.location.href="/documents";
  }

  return (
    <div>
      <input value={email} onChange={e=>setEmail(e.target.value)} />
      <input value={password} type="password" onChange={e=>setPassword(e.target.value)} />
      <button onClick={login}>Connexion</button>
    </div>
  );
}
