// src/components/AddItemPopover.jsx
import React, { useState, useEffect } from 'react';
import {
    useFloating,
    useDismiss,
    useInteractions,
    FloatingFocusManager, // Manages focus in/out
    autoUpdate, // Automatically updates position on scroll/resize
    offset, // Add space between button and popover
    flip, // Flip placement if not enough space
    shift // Shift to stay in view
} from '@floating-ui/react';

// Receive refs, styles, context, day, slot props from PlannerPage
function AddItemPopover({
    isOpen,
    onClose,
    onAddItem,
    recipes = [],
    day, // Need day/slot to know what we're adding to
    slot,
    // Floating UI related props:
    referenceElement, // The button element
    updatePosition // Function to manually update position if needed
}) {
    const [selectedRecipeId, setSelectedRecipeId] = useState('');
    const [customText, setCustomText] = useState('');
    const [inputType, setInputType] = useState('recipe');

    // Floating UI Hooks
    const { refs, floatingStyles, context } = useFloating({
        elements: { // Pass the reference element received from props
            reference: referenceElement,
        },
        open: isOpen,
        onOpenChange: (open) => !open && onClose(), // Call onClose when Floating UI determines it should close
        placement: 'bottom-start', // Default placement
        whileElementsMounted: autoUpdate, // Keep position updated
        middleware: [
            offset(8), // Add 8px space between button and popover
            flip(),   // Flip to top/left/right if 'bottom-start' doesn't fit
            shift({ padding: 8 }) // Shift minimally to stay within viewport bounds
        ],
    });

    // Interaction Hooks (Dismiss on outside click/escape)
    const dismiss = useDismiss(context);
    const { getReferenceProps, getFloatingProps } = useInteractions([
        dismiss,
    ]);

    // Reset internal state when reference element changes (meaning a different button was clicked) or it closes
     useEffect(() => {
        if (isOpen) {
            setSelectedRecipeId('');
            setCustomText('');
            setInputType('recipe');
        }
    }, [isOpen, referenceElement]); // Reset if the trigger button changes

    const handleRecipeChange = (e) => {
        setSelectedRecipeId(e.target.value);
        setCustomText(''); // Clear custom text if recipe is selected
        setInputType('recipe');
    };

    const handleTextChange = (e) => {
        setCustomText(e.target.value);
        setSelectedRecipeId(''); // Clear recipe selection if text is entered
        setInputType('custom');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputType === 'recipe' && selectedRecipeId) {
            const recipe = recipes.find(r => r.id === parseInt(selectedRecipeId, 10));
            if (recipe) {
                // Pass day/slot info along with item data
                onAddItem({ type: 'recipe', data: recipe, day, slot });
                onClose();
            }
        } else if (inputType === 'custom' && customText.trim()) {
             // Pass day/slot info along with item data
            onAddItem({ type: 'custom', data: customText.trim(), day, slot });
            onClose();
        } else {
            console.warn("No item selected or entered.");
        }
    };

    // Only render if open AND we have a reference element
    if (!isOpen || !referenceElement) {
        return null;
    }

    return (
        // Use FloatingFocusManager to trap focus inside the popover
        <FloatingFocusManager context={context} modal={false}>
            {/* Popover Content Box - Positioned by Floating UI */}
            <div
                ref={refs.setFloating} // Set floating element ref
                style={floatingStyles} // Apply dynamic positioning styles
                {...getFloatingProps()} // Apply interaction props
                className="bg-white rounded-lg shadow-lg border border-gray-200 p-5 w-64 z-10" // Popover styles, z-index
            >
                {/* Optional: Close Button (less common in popovers, but possible) */}
                {/* <button onClick={onClose} className="...">X</button> */}

                <h4 className="text-sm font-medium text-gray-800 mb-3">Add Item</h4>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Recipe Selection */}
                    <div>
                        <label htmlFor={`recipe-select-${day}-${slot}`} className="block text-xs font-medium text-gray-600 mb-1">
                            Select Recipe
                        </label>
                        <select
                            id={`recipe-select-${day}-${slot}`} // Unique ID per instance
                            value={selectedRecipeId}
                            onChange={handleRecipeChange}
                             className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-2 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">-- Choose --</option>
                            {recipes.map(recipe => (
                                <option key={recipe.id} value={recipe.id}>{recipe.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* OR Separator */}
                    <div className="flex items-center">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink mx-2 text-xs text-gray-400">OR</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    {/* Custom Text Input */}
                    <div>
                         <label htmlFor={`custom-text-${day}-${slot}`} className="block text-xs font-medium text-gray-600 mb-1">
                            Type Custom
                        </label>
                        <input
                            type="text"
                            id={`custom-text-${day}-${slot}`} // Unique ID per instance
                            placeholder="e.g., Leftovers"
                            value={customText}
                            onChange={handleTextChange}
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-2 text-xs placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={!selectedRecipeId && !customText.trim()}
                            className="px-3 py-1.5 bg-indigo-600 border border-transparent rounded-md shadow-sm text-xs font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </FloatingFocusManager>
    );
}

export default AddItemPopover; 