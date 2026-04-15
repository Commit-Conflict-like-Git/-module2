import React from 'react'
import '../../assets/css/signup.css'
import '../../assets/css/signupPages/information.css'
import '../../assets/css/button.css'

function SignupInfo({onNext, formData, onFormData}) {
    const isAllFilled = 
        formData.name.trim() !== '' && 
        formData.birth !== '' && 
        formData.phoneNumber.trim() !== '';

    // 전화번호 하이픈 생성
    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        let formattedValue = '';

        if (value.length <= 3) {
            formattedValue = value;
        } else if (value.length <= 7) {
            formattedValue = value.replace(/(\d{3})(\d{1,4})/, '$1-$2');
        } else {
            formattedValue = value.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
        }

        // 최대 13자(010-1234-5678)까지만 저장
        if (formattedValue.length <= 13) {
            onFormData({ ...formData, phoneNumber: formattedValue });
        }
    };

    const handleNext = () => {
        if (isAllFilled) {
            onNext();
        }
    }
    
    return (
        <div className='inner-body'>
            <div className="title-group">
                <img src="src/assets/img/paw.svg" alt="소제목" className="paw"/>
                <div className="title">회원가입</div>
            </div>

            <div className='content-container'>
                <div className='input-row'>
                    <label className='info-label'>이름</label>
                    <input
                        type="text"
                        placeholder='  이름을 입력해 주세요.'
                        value={formData.name}
                        className='textbox'
                        onChange={(e) => onFormData({...formData, name: e.target.value})}
                    />
                </div>
                <div className='input-row'>
                    <label className='info-label'>성별</label>
                    <div className='radio-group'>
                        <label><input type="radio" name='gender' value='female' checked={formData.gender === 'female'} onChange={(e) => onFormData({...formData, gender: e.target.value})}/> 여</label>
                        <label><input type="radio" name='gender' value='male' checked={formData.gender === 'male'} onChange={(e) => onFormData({...formData, gender: e.target.value})}/> 남</label>
                    </div>
                </div>
                <div className='input-row'>
                    <label className='info-label'>생년월일</label>
                    <input
                        type='date'
                        value={formData.birth}
                        className='textbox'
                        onChange={(e) => onFormData({...formData, birth: e.target.value})}
                    />
                </div>
                <div className='input-row'>
                    <label className='info-label'>전화번호</label>
                    <input
                        type="text"
                        placeholder='  전화번호를 입력해 주세요.'
                        className='textbox'
                        value={formData.phoneNumber}
                        onChange={handlePhoneChange}
                    />
                </div>
            </div>

            <div className='button-container'>
                <button
                    onClick={handleNext}
                    className='btn1'
                    style={{
                        background: isAllFilled ? '#C2AA84' : '#BDBDBD',
                        cursor: isAllFilled ? 'pointer' : 'not-allowed'
                    }}
                > 다음 &gt; </button>
            </div>
        </div>
    );
}

export default SignupInfo
