import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../../services/authService'
import Modal from '../../components/public/modalOneBtn'
import '../../assets/css/login.css'
import '../../assets/css/button.css'

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState ({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({ email: '', password: ''});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    let newErrors = { email: '', password: '' };
    let isValid = true;

    // 유효성 검사
    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력하세요.";
      isValid = false;
    }
    if (!formData.password.trim()) {
      newErrors.password = "비밀번호를 입력하세요.";
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) return;

    try {
      await loginUser(formData.email, formData.password);
      navigate('/');
    } catch (error) {
      let message = "";

      if (error.code === 'auth/user-disabled-custom') {
        message = "비활성화 상태로 서비스 이용이 제한됩니다. 관리자에게 문의하세요. ";
      } else {
        message = "이메일 혹은 비밀번호가 일치하지 않습니다. "
      }

      setModalMsg(message);
      setIsModalOpen(true)
    }
  }

  return (
    <div className='inner-body login-page'>
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        modalText={modalMsg} 
      />

      <div className="title-group">
          <img src="src/assets/img/paw.svg" alt="소제목" className="paw"/>
          <div className="title">로그인</div>
      </div>

      <form onSubmit={handleLogin} className='login-container'>

          <div className='login-email'>
            <span>EMAIL</span>
            <input
              type='email'
              value={formData.email}
              className='login-email-input'
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className='error'>
            {errors.email && <p className='error-text'>{errors.email}</p>}
          </div>

          <div className='login-password'>
            <span>PW</span>
            <input
              type='password'
              value={formData.password}
              className='login-password-input'
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <div className='error'>
            {errors.password && <p className='error-text'>{errors.password}</p>}
          </div>
          <button type='submit' className='btn1'> 로그인 </button>

          <div className='login-footer'>
            <span>계정이 없으신가요?    </span>
            <span className='signup-link' onClick={() => navigate('/signup')}>회원가입</span>
          </div>
      </form>
    </div>
  )
}

export default Login
