import React from 'react'
import '../../assets/css/signup.css'
import '../../assets/css/button.css'

function SignupInfo({onNext, formData, onFormData}) {

    const handleNext = () => {
        onNext();
    }
    
    return (
        <div className='inner-body'>
            이름 <input
                type="text"
                placeholder='이름을 입력해 주세요.'
                onChange={(e) => onFormData({...formData, name: e.target.value})}
            /> <br/>
            성별 <input
                type="radio"
                name='gender'
                value='female'
                checked={formData.gender === 'female'}
                onChange={(e) => onFormData({...formData, gender: e.target.value})}
            /> 여
            <input
                type="radio"
                name='gender'
                value='male'
                checked={formData.gender === 'male'}
                onChange={(e) => onFormData({...formData, gender: e.target.value})}
            /> 남 <br/>
            생년월일 <input/> <br/>

            전화번호 <input
                type="text"
                placeholder='전화번호를 입력해 주세요'
            /> <br/>

            <button onClick={handleNext}> 다음 </button>
        </div>
    );
}

export default SignupInfo
