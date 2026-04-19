import React, { useState } from 'react'
import { checkEmail } from '../../services/authService'
import Modal from '../../components/public/modalOneBtn'
import '../../assets/css/signup.css'
import '../../assets/css/signupPages/information.css'
import '../../assets/css/button.css'

function SignupInfo({onNext, formData, onFormData}) {
    // 이메일 중복여부 확인
    const [isEmailChecked, setIsEmailChecked] = useState(false);
    // 비밀번호 일치여부 확인
    const isPasswordMatch = formData.password === formData.passwordConfirm;
    // 모달
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMsg, setModalMsg] = useState('');

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

        // 최대 13자까지 저장
        if (formattedValue.length <= 13) {
            onFormData({ ...formData, phoneNumber: formattedValue });
        }
    };
    
    const isAllFilled = 
        formData.name.trim() !== '' && 
        formData.birth !== '' && 
        formData.phoneNumber.trim() !== '' &&
        formData.email.trim() !== '' &&
        formData.password.trim() !== '' &&
        formData.passwordConfirm.trim() !== '' &&
        isEmailChecked &&
        isPasswordMatch;

    const handleEmailCheck = async () => {
        if (!formData.email.trim()){
            alert("이메일입력");
            return;
        }
        try {
            const isDuplicated = await checkEmail(formData.email);
            if (isDuplicated) {
                setModalMsg("동일한 이메일이 이미 존재합니다.")
                setIsModalOpen(true);
                setIsEmailChecked(false);
            } else {
                setIsEmailChecked(true);
            }
        } catch (error) {
            console.log("중복 확인 중 오류 발생")
        }
    };

    const handleEmailChange = (e) => {
        setIsEmailChecked(false);
        onFormData({...formData, email: e.target.value});
    };
    
    const handleNext = () => {
        if (isAllFilled) {
            onNext();
        }
    }
    
    return (
        <div className='inner-body'>
            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                modalText={modalMsg} 
            />

            <div className="title-group">
                <img src="src/assets/img/paw.svg" alt="소제목" className="paw"/>
                <div className="title">회원가입</div>
            </div>

            <div className='signup-container'>
                <div className='input-row'>
                    <label className='info-label'>이름</label>
                    <input
                        type="text"
                        placeholder='  이름을 입력해 주세요.'
                        value={formData.name}
                        className='info-textbox'
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
                        className='info-textbox'
                        onChange={(e) => onFormData({...formData, birth: e.target.value})}
                    />
                </div>
                <div className='input-row'>
                    <label className='info-label'>전화번호</label>
                    <input
                        type="text"
                        placeholder='  전화번호를 입력해 주세요.'
                        className='info-textbox'
                        value={formData.phoneNumber}
                        onChange={handlePhoneChange}
                    />
                </div>
                <div className='input-row'>
                    <label className='info-label'>이메일</label>
                    <input
                        type='email'
                        placeholder='  이메일을 입력해 주세요.'
                        className='info-textbox'
                        value={formData.email}
                        onChange={(e) => onFormData({...formData, email: e.target.value})}
                    />
                    <button 
                        className='btn1'
                        onClick={handleEmailCheck}
                    >
                        {isEmailChecked ? "확인됨" : "중복확인"}
                    </button>
                </div>
                <div className='input-row'>
                    <label className='info-label'>비밀번호</label>
                    <input
                        type='password'
                        placeholder='  비밀번호를 입력해 주세요.'
                        className='info-textbox'
                        value={formData.password}
                        onChange={(e) => onFormData({...formData, password: e.target.value})}
                    />
                </div>
                <div className='input-row'>
                    <label className='info-label'>비밀번호 확인</label>
                    <input
                        type='password'
                        placeholder='  비밀번호를 다시 입력해주세요.'
                        className='info-textbox'
                        value={formData.passwordConfirm || ''}
                        onChange={(e) => onFormData({...formData, passwordConfirm: e.target.value})}
                    />
                </div>
            </div>

            <div className='button-container'>
                <button
                    onClick={handleNext}
                    className='btn1'
                    disabled={!isAllFilled}
                > 다음 &gt; </button>
            </div>
        </div>
    );
}

export default SignupInfo
