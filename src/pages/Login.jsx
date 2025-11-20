import React, {useState} from 'react'
import { api, setAuth } from '../api'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const nav = useNavigate()

  async function submit(e){
    e.preventDefault()
    try{
      const res = await api.post('/admin/login', {email, password: pass})
      const token = res.data.token
      localStorage.setItem('MALL_ADMIN_TOKEN', token)
      setAuth(token)
      nav('/')
    }catch(err){
      alert(err?.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div className="page-center">
      <form className="card" onSubmit={submit}>
        <h2>Mall Admin Login</h2>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={pass} onChange={e=>setPass(e.target.value)} />
        <button type="submit">Sign in</button>
      </form>
    </div>
  )
}
