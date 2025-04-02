// src/components/RecipeItem.jsx
import React from 'react';

function RecipeItem({ recipe, onDelete, onEdit, onView }) {
  // *** CHANGE: Destructure new fields ***
  const { id, name, ingredients, instructions } = recipe;

  const handleDeleteClick = () => {
    // Maybe add confirmation here
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      onDelete(id);
    }
  };

  // *** Call onView with the recipe object ***
  const handleViewClick = () => {
    onView(recipe);
  };

  // *** Call onEdit with the recipe object ***
  const handleEditClick = () => {
    onEdit(recipe);
  };

  return (
    <li className="list-none bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between h-full overflow-hidden"> {/* Added overflow-hidden */}

      {/* Content Area - Allow scrolling if content overflows */}
      <div className="p-4 sm:p-5 flex-grow"> {/* Add padding here, make scrollable */}
        {/* Recipe Name */}
        <h3 className="text-lg font-semibold text-gray-800 mb-3 break-words line-clamp-2" title={name}>
          {name}
        </h3>

        {/* *** NEW: Ingredients Section *** */}
        <div className="mb-3">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Ingredients</h4>
          {/* Preserve whitespace and line breaks from textarea input */}
          <p className="text-sm text-gray-600 whitespace-pre-wrap line-clamp-3 -indent-1"> {/* Limit initial lines shown */}
            {ingredients || <span className="italic text-gray-400">No ingredients listed.</span>}
          </p>
        </div>

        {/* *** NEW: Instructions Section *** */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Instructions</h4>
          {/* Preserve whitespace and line breaks */}
          <p className="text-sm text-gray-600 whitespace-pre-wrap line-clamp-6 -indent-1"> {/* Limit initial lines shown */}
            {instructions || <span className="italic text-gray-400">No instructions provided.</span>}
          </p>
        </div>
      </div>

      {/* Action Buttons Area - Fixed at bottom */}
      <div className="mt-auto flex-shrink-0 p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-end space-x-2"> {/* Adjusted styling */}
        {/* View Button */}
        <button
          onClick={handleViewClick}
          title="View Recipe"
          className="px-2.5 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500 transition-colors"
        >
          View
        </button>
        {/* Edit Button */}
        <button
          onClick={handleEditClick}
          title="Edit Recipe"
          className="px-2.5 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500 transition-colors"
        >
          Edit
        </button>
        {/* Delete Button */}
        <button
          onClick={handleDeleteClick}
          title="Delete Recipe"
          className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-100 rounded hover:bg-red-100 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-red-500 transition-colors"
        >
          Delete
        </button>
      </div>
    </li>
  );
}

export default RecipeItem;