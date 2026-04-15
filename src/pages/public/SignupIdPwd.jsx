import React from 'react'
import '../../assets/css/signup.css'
import '../../assets/css/button.css'

function SignupIdPwd({onNext, formData, onFormData}) {

    const handleNext = () => {
        onNext();
    }

    return (
        <div className='inner-body'>
            <div className="title-group">
                <img src="src/assets/img/paw.svg" alt="소제목" className="paw"/>
                <div className="title">회원가입</div>
            </div>
            이메일 <input
                type='email'
                placeholder='이메일을 입력해 주세요.'
                value={formData.email}
                onChange={(e) => onFormData({...formData, email: e.target.value})}
            /> 
            <button className='btn1'>중복확인</button>
            <br/>
            비밀번호 <input
                type='password'
                placeholder='비밀번호를 입력해 주세요.'
                value={formData.password}
            /> <br/>
            비밀번호 확인 <input
                placeholder='비밀번호를 다시 입력해주세요.'
            />
            <br/>
            <button onClick={handleNext} className='btn1'> 다음 &gt; </button>
        </div>
    )
}

export default SignupIdPwd
