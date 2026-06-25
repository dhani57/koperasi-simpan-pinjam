import React from 'react';
import Modal from '@/Components/Modal';

export default function ConfirmModal({
    show = false,
    onClose = () => {},
    onConfirm = () => {},
    title = 'Konfirmasi',
    message = 'Apakah Anda yakin?',
    confirmText = 'Setujui',
    cancelText = 'Batal',
    type = 'primary' // 'primary' | 'danger'
}) {
    // Styling base for buttons
    const btnBase = "inline-flex justify-center rounded-md px-4 py-2 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all";
    
    // Type specific styling
    const confirmBtnClass = type === 'danger' 
        ? `${btnBase} bg-red-600 text-white hover:bg-red-500 focus:ring-red-500`
        : `${btnBase} bg-blue-600 text-white hover:bg-blue-500 focus:ring-blue-500`;

    const cancelBtnClass = "mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto";

    return (
        <Modal show={show} onClose={onClose} maxWidth="sm">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                    {/* Icon */}
                    <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 ${type === 'danger' ? 'bg-red-100' : 'bg-blue-100'}`}>
                        {type === 'danger' ? (
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        ) : (
                            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                            </svg>
                        )}
                    </div>
                    {/* Content */}
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">
                            {title}
                        </h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                {message}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Actions */}
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                    type="button"
                    className={confirmBtnClass + " sm:ml-3 sm:w-auto w-full"}
                    onClick={onConfirm}
                >
                    {confirmText}
                </button>
                <button
                    type="button"
                    className={cancelBtnClass}
                    onClick={onClose}
                >
                    {cancelText}
                </button>
            </div>
        </Modal>
    );
}
