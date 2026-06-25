import React from 'react';
import Modal from '@/Components/Modal';

export default function AlertModal({
    show = false,
    onClose = () => {},
    title = 'Peringatan',
    message = '',
    confirmText = 'Mengerti',
    type = 'danger' // 'primary' | 'danger' | 'warning'
}) {
    const btnBase = "inline-flex justify-center rounded-md px-4 py-2 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all";
    
    let confirmBtnClass = `${btnBase} bg-red-600 text-white hover:bg-red-500 focus:ring-red-500`;
    let iconClass = 'bg-red-100 text-red-600';
    
    if (type === 'primary') {
        confirmBtnClass = `${btnBase} bg-blue-600 text-white hover:bg-blue-500 focus:ring-blue-500`;
        iconClass = 'bg-blue-100 text-blue-600';
    } else if (type === 'warning') {
        confirmBtnClass = `${btnBase} bg-yellow-600 text-white hover:bg-yellow-500 focus:ring-yellow-500`;
        iconClass = 'bg-yellow-100 text-yellow-600';
    }

    return (
        <Modal show={show} onClose={onClose} maxWidth="sm">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                    {/* Icon */}
                    <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 ${iconClass.split(' ')[0]}`}>
                        <svg className={`h-6 w-6 ${iconClass.split(' ')[1]}`} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
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
                    className={confirmBtnClass + " w-full sm:w-auto"}
                    onClick={onClose}
                >
                    {confirmText}
                </button>
            </div>
        </Modal>
    );
}
