// src/components/ViewRecipeModal.jsx
import React, { useEffect } from 'react';

// Simple Close Icon
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

function ViewRecipeModal({ recipe, onClose }) {
    // Effect to handle Escape key press
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        // Cleanup listener on component unmount
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    // Prevent rendering if no recipe is provided
    if (!recipe) return null;

    return (
        // Fixed position container covering the screen (modal wrapper)
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-800 bg-opacity-75"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            {/* Click outside handler (on the backdrop) */}
            <div className="fixed inset-0" onClick={onClose} aria-hidden="true"></div>

            {/* Modal Content Box */}
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-modal-scale-in"> {/* Added animation class */}

                {/* Modal Header */}
                <div className="flex items-start justify-between p-4 border-b border-gray-200 flex-shrink-0">
                    <h2 id="modal-title" className="text-xl font-semibold text-gray-900 truncate pr-4" title={recipe.name}>
                        {recipe.name}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                        aria-label="Close modal"
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* Modal Body (Scrollable) */}
                <div className="p-6 space-y-4 overflow-y-auto flex-grow">
                    {/* Ingredients */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Ingredients</h3>
                        <p className="text-base text-gray-700 whitespace-pre-wrap">
                            {recipe.ingredients || <span className="italic text-gray-400">No ingredients listed.</span>}
                        </p>
                    </div>

                     {/* Instructions */}
                    <div>
                         <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Instructions</h3>
                        <p className="text-base text-gray-700 whitespace-pre-wrap">
                             {recipe.instructions || <span className="italic text-gray-400">No instructions provided.</span>}
                        </p>
                    </div>
                </div>

                {/* Modal Footer (Optional, e.g., for just a close button) */}
                <div className="flex items-center justify-end p-4 border-t border-gray-200 flex-shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
}

export default ViewRecipeModal;