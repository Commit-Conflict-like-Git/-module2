import React from 'react'
import '../../assets/css/signup.css'
import '../../assets/css/button.css'

function SignupRoleSelect({formData, onFormData, onNext}) {

    const roleSelect = (type) => {
        onFormData({...formData, role: type});
        onNext();
    }
    return (
        <div className='inner-body'>
            <div className='role-select'>
                <img src="src/assets/img/dog.svg" alt="보호자" />
                <p className='role'>보호자</p>
                <button onClick={() => roleSelect('owner')}>회원가입하기</button>
            </div>
            <div className='role-select'>
                <img src="src/assets/img/trainer.svg" alt="훈련사" />
                <p className='role'>훈련사</p>
                <button onClick={() => roleSelect('trainer')}>회원가입하기</button>
            </div>
        </div>
    )
}

export default SignupRoleSelect
