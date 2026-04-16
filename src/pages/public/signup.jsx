import React, { useState } from 'react'
import { signupWithDetail } from '../../services/authService';
import SignupRoleSelect from './SignupRoleSelect';
import SignupInfo from './SignupInfo';
import SignupLicense from './SignupLicense';
import SignupFinish from './SignupFinish';


function Signup() {
    const [step, setStep] = useState(0);

    const [formData, setFormData] = useState({
        role: '',
        name: '',
        gender: 'female',
        birth: '',
        phoneNumber: '',
        email: '',
        password: '',
        passwordConfirm: '',
        certificationFile: null
        // 파일 이름, 경로
    })

    const nextStep = async () => {
        if (formData.role === 'owner' && step === 1) {
            try {
                await signupWithDetail(formData);
                setStep(3);
            } catch (error) {
                console.log('회원가입 중 오류 발생');
            }         
        } else if (formData.role === 'trainer' && step === 2) {
            try {
                await signupWithDetail(formData);
                setStep(3);
            } catch (error) {
                console.log('회원가입 중 오류 발생');
            }   
        } else {
            setStep(step + 1);
        }
    };


    return (
        <div className='signup-container'>
            {step === 0 && <SignupRoleSelect formData={formData} onFormData={setFormData} onNext={nextStep}/>}
            {step === 1 && <SignupInfo formData={formData} onFormData={setFormData} onNext={nextStep}/>}

            {/* 훈련사 자격증 */}
            {step === 2 && <SignupLicense formData={formData} onFormData={setFormData} onNext={nextStep}/>}

            {/* 회원가입 완료 */}
            {step === 3 && <SignupFinish role={formData.role}/>}
        </div>
    )
}

export default Signup
