// src/components/ImportRecipeModal.jsx
import React, { useState, useEffect } from 'react';

// Simple Close Icon
const CloseIcon = () => (<svg>{/* ... */}</svg>); // Reuse or import your CloseIcon

function ImportRecipeModal({ isOpen, onClose, onImport, loading, error }) {
    const [url, setUrl] = useState('');

    // Reset URL when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setUrl(''); // Clear URL when closing
        }
    }, [isOpen]);

    const handleSubmit = (event) => {
        event.preventDefault();
        onImport(url); // Call the import handler passed from parent
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-800 bg-opacity-75">
            {/* Backdrop */}
            <div className="fixed inset-0" onClick={onClose} aria-hidden="true"></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg flex flex-col animate-modal-scale-in">

               {/* Header */}
               <div className="flex items-start px-4 py-3 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 whitespace-nowrap">
                        Import Recipe from URL
                    </h2>
                </div> 

                {/* Body */}
                <form onSubmit={handleSubmit}>
                    <div className="px-6 pt-4 pb-6 space-y-4">
                        <p className="text-sm text-gray-600">
                            Paste the URL of a recipe page below.
                        </p>
                        <div>
                            <label htmlFor="import-url" className="sr-only">Recipe URL</label>
                            <input
                                type="url" // Use type="url" for basic validation
                                id="import-url"
                                name="import-url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                required
                                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
                                placeholder="https://www.example-recipe-site.com/..."
                                disabled={loading} // Disable input while loading
                            />
                        </div>
                        {/* Loading Indicator */}
                        {loading && (
                            <div className="flex items-center justify-center text-sm text-gray-500">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Importing...
                            </div>
                        )}
                        {/* Error Message */}
                        {error && (
                            <p className="text-sm text-red-600 text-center">{error}</p>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end px-4 py-3 border-t border-gray-200 space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !url}
                            className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Importing...' : 'Import Recipe'}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}

export default ImportRecipeModal;