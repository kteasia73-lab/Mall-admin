import React, {useEffect, useState} from 'react'
import { api, setAuth } from '../api'
import { io } from 'socket.io-client'
import Announcements from './Announcements'
import Tickets from './Tickets'
import FoodCourt from './FoodCourt'

export default function Dashboard(){
  const [alerts, setAlerts] = useState([])
  const [tickets, setTickets] = useState([])
  const [shops, setShops] = useState([])
  const token = localStorage.getItem('MALL_ADMIN_TOKEN')

  useEffect(()=>{ if(token) setAuth(token) }, [token])

  useEffect(()=>{
    api.get('/security/alerts').then(r=>setAlerts(r.data)).catch(()=>{})
    api.get('/tickets').then(r=>setTickets(r.data)).catch(()=>{})
    api.get('/foodcourt/shops').then(r=>setShops(r.data)).catch(()=>{})

    const socket = io(import.meta.env.VITE_BACKEND || 'http://localhost:4000')
    socket.on('connect', ()=> console.log('socket connected'))
    socket.on('security_alert', data => setAlerts(prev=>[data,...prev]))
    socket.on('ticket_created', t => setTickets(prev=>[t,...prev]))
    socket.on('food_order', o => setShops(prev=> prev.map(s => s.id === o.shopId ? {...s, status: 'Busy'} : s)))
    return ()=> socket.disconnect()
  },[])

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h3>Teasia Mall — Admin</h3>
        <p style={{marginTop:8}}>Manage announcements, tickets, food court & security alerts</p>
        <hr/>
        <nav>
          <ul style={{paddingLeft:0}}>
            <li style={{listStyle:'none',margin:'10px 0'}}>Overview</li>
            <li style={{listStyle:'none',margin:'10px 0'}}>Announcements</li>
            <li style={{listStyle:'none',margin:'10px 0'}}>Tickets</li>
            <li style={{listStyle:'none',margin:'10px 0'}}>Food Court</li>
          </ul>
        </nav>
        <button style={{marginTop:20}} onClick={()=>{localStorage.removeItem('MALL_ADMIN_TOKEN'); location.reload()}}>Sign out</button>
      </aside>

      <main className="main">
        <div className="header">
          <h2>Overview</h2>
          <div>Live dashboard</div>
        </div>

        <div className="grid">
          <div className="small-card">
            <h4>Security Alerts</h4>
            {alerts.slice(0,6).map(a=> <div key={a._id || a.id} className="list-item">{a.type} — {a.details ? JSON.stringify(a.details).slice(0,80) : a.msg}</div>)}
          </div>

          <div className="small-card">
            <h4>Recent Tickets</h4>
            {tickets.slice(0,6).map(t=> <div key={t._id || t.id} className="list-item">{t.subject || t.name} — {t.status}</div>)}
          </div>

          <div className="small-card">
            <h4>Food Court</h4>
            {shops.map(s=> <div key={s.id} className="list-item">{s.name} — {s.status}</div>)}
          </div>
        </div>

        <section style={{marginTop:20}}>
          <Announcements />
        </section>

        <section style={{marginTop:20}}>
          <Tickets />
        </section>

        <section style={{marginTop:20}}>
          <FoodCourt />
        </section>
      </main>
    </div>
  )
}
