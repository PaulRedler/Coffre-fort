import {useEffect,useState} from "react";
import {useParams} from "react-router-dom";

export default function DocumentView(){
  const {id}=useParams();
  const [doc,setDoc]=useState(null);
  const [analysis,setAnalysis]=useState(null);

  useEffect(()=>{
    fetch(`/api/documents/${id}`,{
      headers:{Authorization:"Bearer "+localStorage.getItem("token")}
    })
      .then(r=>r.json())
      .then(setDoc)
  },[]);

  async function analyze(){
    const r= await fetch(`/api/documents/${id}/analyze`,{
      method:"POST",
      headers:{Authorization:"Bearer "+localStorage.getItem("token")}
    });
    setAnalysis(await r.json());
  }

  return (
    <div>
      <h1>{doc?.label}</h1>
      <button onClick={analyze}>Analyser</button>
      {analysis && <pre>{JSON.stringify(analysis,null,2)}</pre>}
    </div>
  );
}
