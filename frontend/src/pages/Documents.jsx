import {useEffect,useState} from "react";

export default function Documents(){
  const [docs,setDocs]=useState([]);

  useEffect(()=>{
    fetch("/api/documents", {
      headers:{"Authorization":"Bearer "+localStorage.getItem("token")}
    })
      .then(r=>r.json())
      .then(setDocs)
  },[]);

  return (
    <div>
      <h1>Documents</h1>
      {docs?.results?.map(d=>(
        <div key={d.id}>
          <a href={`/documents/${d.id}`}>{d.label}</a>
        </div>
      ))}
    </div>
  );
}
