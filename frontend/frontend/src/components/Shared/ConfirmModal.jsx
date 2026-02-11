import React from "react";
import Modal from "./Modal";

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmText = "Yes, Delete",
    cancelText = "Cancel",
    type = "warning" // warning, danger
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} type={type}>
            <p>{message}</p>
            <div className="modal-actions">
                <button className="btn-secondary" onClick={onClose}>
                    {cancelText}
                </button>
                <button
                    className={type === 'danger' ? 'btn-danger' : 'btn-primary'}
                    onClick={() => {
                        onConfirm();
                        onClose();
                    }}
                >
                    {confirmText}
                </button>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
