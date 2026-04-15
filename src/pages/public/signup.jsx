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
    })

    const nextStep = () => {
        if (formData.role === 'owner' && step === 2) {
            setStep(4);
        } else if (formData.role === 'trainer' && step === 3) {
            setStep(4);
        } else {
            setStep(step + 1);
        }
    };


    return (
        <div className='signup-container'>
            {step === 0 && <SignupRoleSelect formData={formData} onFormData={setFormData} onNext={nextStep}/>}

            {step === 1 && <SignupInfo formData={formData} onFormData={setFormData} onNext={nextStep}/>}
            {step === 2 && <SignupIdPwd formData={formData} onFormData={setFormData} onNext={nextStep}/>}

            {/* 훈련사 자격증 */}
            {step === 3 && <SignupLicense formData={formData} onFormData={setFormData} onNext={nextStep}/>}

            {/* 회원가입 완료 */}
            {step === 4 && <SignupFinish role={formData.role}/>}
        </div>
    )
}

export default Signup
