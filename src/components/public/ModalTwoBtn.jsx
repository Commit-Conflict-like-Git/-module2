import React from 'react'
import '../../assets/css/modal.css'

const ModalTwoBtn =({ isOpen, onClose, onConfirm, modalText }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className='modal-content' onClick={(e) => e.stopPropagation()}>
                <div className='modal-body'>
                    {modalText}
                </div>
                <div className='modal-btn-container'>
                    <button onClick={onConfirm} className='btn1'>확인</button>
                    <button onClick={onClose} className='btn1'>취소</button>
                </div>
            </div>
        </div>

    )


}

export default ModalTwoBtn