import React from 'react';
import '../../assets/css/modal.css';

const ModalThreeBtn = ({
    isOpen,
    onClose,
    onApprove,
    onReject,
    modalText,
    approveText = "승인하기",
    rejectText = "거절하기",
    cancelText = "취소"
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-body">
                    {modalText}
                </div>

                <div className="modal-btn-container">
                    <button onClick={onApprove} className="btn1">
                        {approveText}
                    </button>

                    <button onClick={onReject} className="btn1">
                        {rejectText}
                    </button>

                    <button onClick={onClose} className="btn1">
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalThreeBtn;