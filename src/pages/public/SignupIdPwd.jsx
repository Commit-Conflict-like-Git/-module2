import React from 'react'
import '../../assets/css/signup.css'
import '../../assets/css/button.css'

function SignupIdPwd({onNext, formData, onFormData}) {

    const handleNext = () => {
        onNext();
    }

    return (
        <div className='inner-body'>
            이메일 <input
                type='email'
                placeholder='이메일을 입력해 주세요.'
                value={formData.email}
                onChange={(e) => onFormData({...formData, email: e.target.value})}
            /> <br/>
            비밀번호 <input
                type='password'
                placeholder='비밀번호를 입력해 주세요.'
                value={formData.password}
            /> <br/>
            비밀번호
            <br/>
            확인
            <button onClick={handleNext}> 다음 </button>
        </div>
    )
}

export default SignupIdPwd
