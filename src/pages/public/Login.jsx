import React, { useState } from 'react'
import '../../assets/css/signup.css'

function Login() {

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  return (
    <div className='inner-body'>
      <div className="title-group">
          <img src="src/assets/img/paw.svg" alt="소제목" className="paw"/>
          <div className="title">로그인</div>
      </div>

      {/* <form onSubmit={handleLogin}> */}
      <form>
        <div>
          <div className='login-email'>
            <span>EMAIL</span>
            <input
              type='text'
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className='login-password'>
            <span>PW</span>
            <input
              type='password'
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button type='submit'> 로그인 </button>
        </div>
      </form>
    </div>
  )
}

export default Login
