import React from 'react'
import '../../assets/css/modal.css'

const modalOneBtn =({ isOpen, onClose, modalText }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className='modal-content' onClick={(e) => e.stopPropagation()}>
                <div className='modal-body'>
                    {modalText}
                </div>
                <button onClick={onClose} className='btn1'>확인</button>
            </div>
        </div>

    )


}

export default modalOneBtn
