import React, { useState } from 'react'
import SignupRoleSelect from './SignupRoleSelect';
import SignupInfo from './SignupInfo';
import SignupIdPwd from './SignupIdPwd';
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
        pwd: ''
        // 파일 이름, 경로
    })

    const nextStep = () => {
        if (formData.role === 'owner' && step === 1) {
            setStep(3);
        } else if (formData.role === 'trainer' && step === 2) {
            setStep(3);
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
