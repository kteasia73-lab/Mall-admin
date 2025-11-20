import React, {useEffect, useState} from 'react'
import { api } from '../api'

export default function Tickets(){
  const [list, setList] = useState([])

  useEffect(()=>{ api.get('/tickets').then(r=>setList(r.data)).catch(()=>{}) },[])

  async function resolveTicket(id){
    // simple stub: call backend route to update status (you can implement)
    await api.post('/tickets/resolve', { id }).catch(()=>{})
    setList(prev => prev.map(t => t._id === id ? {...t, status:'resolved'} : t))
  }

  return (
    <div className="small-card" style={{marginTop:12}}>
      <h4>Tickets</h4>
      {list.map(t => (
        <div key={t._id || t.id} className="list-item">
          <b>{t.subject || t.name}</b><div style={{fontSize:12,color:'#666'}}>{t.message || t.body}</div>
          <div style={{marginTop:6}}>
            <button onClick={()=>resolveTicket(t._id || t.id)}>Resolve</button>
          </div>
        </div>
      ))}
    </div>
  )
}
