import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerTrainPost } from '../../services/trainService'
import Modal2 from '../../components/public/ModalTwoBtn'
import paw from '../../assets/img/paw.svg'
import '../../assets/css/signup.css'
import '../../assets/css/button.css'
import '../../assets/css/trainPost.css'

function TrainPost() {
    // 모달
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        trainTitle: '',
        day: '월요일',
        date: '',
        ampm: '오전',
        trainTime: '',
        trainPlace: '',
        dogSize: '무관',
        ageGroup: '무관',
        price: '',
        trainDescription: '',
        trainImg: null
    });

    const handleTimeChange = (e) => {
        const timeValue = e.target.value;
        if (!timeValue) return;

        const [hours, minutes] = timeValue.split(':');
        const intHours = parseInt(hours);

        let ampm = '오전';
        let displayHours = intHours;

        if (intHours >= 12) {
            ampm = '오후';
            displayHours = intHours > 12 ? intHours - 12 : intHours;
        } else {
            displayHours = intHours === 0 ? 12 : intHours;
        }

        const formattedHours = String(displayHours).padStart(2, '0');

        setFormData({
            ...formData,
            ampm: ampm,
            trainTime: `${formattedHours}:${minutes}`
        })
    }

    const handleRegisterClick = async () => {
        try {
            setIsModalOpen(true);
        } catch (error) {
            console.log("훈련 등록에 실패했습니다. 다시 시도해주세요")
        }
    };

    const handleConfirmRegistration = async () => {
        try {
            const postId = await registerTrainPost(formData);
            
            setIsModalOpen(false);
            navigate('/train');
        } catch (error) {
            console.error("실제 발생 에러:", error);
            alert(`등록 실패: ${error.message}`); // 사용자에게 에러 내용 노출
            setIsModalOpen(false);
        }
    };

    return (
        <div className='inner-body'>
            <div className="title-group">
                <img src={paw} alt="소제목" className="paw"/>
                <div className="title">훈련 강좌 등록</div>
            </div>

            <div className='trainpost-container'>
                <div className='input-row'>
                    <label className='info-label'>훈련명 </label>
                    <input
                        type='text'
                        className='trainpost-textbox'
                        value={formData.trainTitle}
                        onChange={(e) => setFormData({...formData, trainTitle: e.target.value})}
                    />
                </div>

                <div className='input-row'>
                    <label className='info-label'>일시 </label>
                    <div style={{display: 'flex', gap: '10px', flex: 1}}>
                        <select className='trainpost-textbox' value={formData.day} onChange={(e) => setFormData({...formData, day: e.target.value})}>
                            <option>월요일</option><option>화요일</option>
                            <option>수요일</option><option>목요일</option>
                            <option>금요일</option> <option>토요일</option>
                            <option>일요일</option>
                        </select>
                        <input type='date' className='trainpost-textbox' value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})}/>
                    </div>
                </div>

                <div className='input-row'>
                    <label className='info-label'></label>
                    <input type='time' className='trainpost-textbox' value={formData.trainTime} onChange={(e) => setFormData({...formData, trainTime: e.target.value})}/>
                </div>

                <div className='input-row'>
                    <label className='info-label'>장소</label>
                    <select className='trainpost-textbox' value={formData.trainPlace} onChange={(e) => setFormData({...formData, trainPlace: e.target.value})}>
                        <option>A홀 실외 교육장</option>
                        <option>기초 훈련장</option>
                        <option>루시 교실</option>
                        <option>대형견 교실</option>
                        <option>시브로 교실</option>
                        <option>리트리버 교실</option>
                    </select>
                </div>

                <div className='input-row'>
                    <label className='info-label'>대상 견종</label>
                    <select className='trainpost-textbox' value={formData.dogSize} onChange={(e) => setFormData({...formData, dogSize: e.target.value})}>
                        <option>무관</option>
                        <option>소형</option>
                        <option>중형</option>
                        <option>대형</option>
                    </select>
                </div>

                <div className='input-row'>
                    <label className='info-label'>대상 연령대</label>
                    <select className='trainpost-textbox' value={formData.ageGroup} onChange={(e) => setFormData({...formData, ageGroup: e.target.value})}>
                        <option>무관</option>
                        <option>퍼피(1년 미만)</option>
                        <option>성견</option>
                        <option>노령견</option>
                    </select>
                </div>

                <div className='input-row'>
                    <label className='info-label'>비용</label>
                    <input
                        type='text'
                        className='trainpost-textbox'
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                    />
                </div>
            </div>

            <div className='trainpost-container-description'>
                <div className='input-row' style={{ alignItems: 'flex-start' }}>
                    <label className='info-label-description'>상세설명</label>
                    <textarea
                        className='trainpost-text'
                        value={formData.trainDescription}
                        onChange={(e) => setFormData({...formData, trainDescription: e.target.value})}
                    />
                </div>

                <div className='input-row'>
                    <label className='info-label'></label>
                    <div style={{display: 'flex', flex: 1}}>
                        <input type='text' className='trainpost-textbox' readOnly value={formData.trainImg?.name || ''}/>
                        <label className='btn1'>
                            파일업로드
                            <input type='file' style={{display: 'none'}} onChange={(e) => setFormData({...formData, trainImg: e.target.files[0]})}/>
                        </label>
                    </div>
                </div>
            </div>

            <div className='button-container'>
                <button className='btn1' onClick={handleRegisterClick}>등록</button>
            </div>

            <Modal2
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmRegistration}
                modalText="훈련을 등록하시겠습니까?"
            />
        </div>
    );
}

export default TrainPost
