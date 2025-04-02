// src/pages/RecipesPage.jsx
import React, { useState, useEffect } from 'react';
import RecipeItem from '../components/RecipeItem';
import ViewRecipeModal from '../components/ViewRecipeModal'; // Import the modal
import ImportRecipeModal from '../components/ImportRecipeModal'; // <-- Import new modal
import { parseRecipeFromJsonLd } from '../utils/recipeParser'; // <-- Import parser utility (create this next)

// --- Icons ---
// Plus Icon for FAB
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

// Close Icon for Sidebar
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// *** NEW: Import Icon (Download Style) ***
const ImportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    {/* Replaced path data with Heroicons ArrowDownTrayIcon */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);
// --- End Icons ---

// *** Receive onUpdateRecipe prop ***
function RecipesPage({ recipes, onAddRecipe, onDeleteRecipe, onUpdateRecipe }) {
  // --- Form State ---
  const [newRecipeName, setNewRecipeName] = useState('');
  const [newRecipeIngredients, setNewRecipeIngredients] = useState('');
  const [newRecipeInstructions, setNewRecipeInstructions] = useState('');

  // --- Control State ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Renamed for clarity
  const [editingRecipe, setEditingRecipe] = useState(null); // Store recipe being edited (null if adding)
  const [viewingRecipe, setViewingRecipe] = useState(null); // Store recipe being viewed
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // Control view modal
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState('');
  // --- Handlers ---

  // Called when clicking "+" FAB or "Add New Recipe" button if implemented
  const handleOpenAddSidebar = () => {
    setEditingRecipe(null); // Ensure not in edit mode
    setNewRecipeName(''); // Clear form
    setNewRecipeIngredients('');
    setNewRecipeInstructions('');
    setIsSidebarOpen(true);
  };

  // Called from RecipeItem's "Edit" button
  const handleOpenEditSidebar = (recipe) => {
    setEditingRecipe(recipe); // Set the recipe to edit
    setNewRecipeName(recipe.name); // Pre-fill form
    setNewRecipeIngredients(recipe.ingredients);
    setNewRecipeInstructions(recipe.instructions);
    setIsSidebarOpen(true);
  };

  // Called from RecipeItem's "View" button
  const handleOpenViewModal = (recipe) => {
    setViewingRecipe(recipe);
    setIsViewModalOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setEditingRecipe(null); // Clear editing state on close
    // Optionally clear form fields too, or leave them as they were
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingRecipe(null);
  };

  // Handles the submit button click in the sidebar
  const handleSidebarSubmit = (event) => {
    event.preventDefault();
    if (!newRecipeName.trim()) {
      alert("Please enter a recipe name.");
      return;
    }

    const recipeData = {
      name: newRecipeName,
      ingredients: newRecipeIngredients,
      instructions: newRecipeInstructions,
    };

    if (editingRecipe) {
      // Update existing recipe
      onUpdateRecipe(editingRecipe.id, recipeData);
    } else {
      // Add new recipe
      onAddRecipe(recipeData);
    }

    // Optionally close sidebar after submit, or leave open
    // handleCloseSidebar();
    // Clear form only if adding? Or always? Depends on desired UX
    if (!editingRecipe) {
      setNewRecipeName('');
      setNewRecipeIngredients('');
      setNewRecipeInstructions('');
    }
  };
  // *** NEW: Import Handlers ***
  const handleOpenImportModal = () => {
    setImportError(''); // Clear previous errors
    setIsImportModalOpen(true);
  };

  const handleCloseImportModal = () => {
    setIsImportModalOpen(false);
    setImportLoading(false); // Reset loading state if modal is closed
    setImportError('');
  };

  const handleImportRecipe = async (url) => {
    if (!url || !url.startsWith('http')) {
      setImportError("Please enter a valid URL (starting with http/https).");
      return;
    }

    setImportLoading(true);
    setImportError('');

    // ==============================================================
    // !!! USING THIRD-PARTY PROXY (allorigins.win) - DEVELOPMENT ONLY !!!
    // ==============================================================
    const proxyBaseUrl = 'https://api.allorigins.win/raw?url=';
    const proxyFetchUrl = `${proxyBaseUrl}${encodeURIComponent(url)}`; // Encode the target URL

    try {
      console.log(`Attempting to fetch HTML via allorigins proxy: ${proxyFetchUrl}`);

      // *** Use the actual proxy fetch call ***
      const response = await fetch(proxyFetchUrl);

      // *** REMOVE OR COMMENT OUT THE SIMULATION CODE ***
      /*
      // await new Promise(resolve => setTimeout(resolve, 1500));
      // const simulatedHtml = `...`;
      // const htmlContent = simulatedHtml;
      */
      // *** END REMOVED SIMULATION ***

      if (!response.ok) {
        // Handle errors from the proxy or the target site
        throw new Error(`Failed to fetch through proxy: ${response.status} ${response.statusText}`);
      }

      // Get the HTML content from the proxy response
      const htmlContent = await response.text();


      // --- Parsing Logic ---
      console.log("Attempting to parse HTML for JSON-LD...");
      const parsedRecipeData = parseRecipeFromJsonLd(htmlContent);

      if (parsedRecipeData) {
        console.log("Parsed recipe data:", parsedRecipeData);
        // Add the successfully parsed recipe
        onAddRecipe({
          name: parsedRecipeData.name || 'Untitled Imported Recipe',
          ingredients: parsedRecipeData.ingredients || '',
          instructions: parsedRecipeData.instructions || '',
          // You might want to add the source URL too
          // sourceUrl: url
        });
        handleCloseImportModal(); // Close modal on success
      } else {
        console.error("Failed to find or parse Recipe JSON-LD from HTML.");
        setImportError("Couldn't find recipe data (JSON-LD) on that page. The site might not support this import method.");
      }

    } catch (error) {
      console.error("Error during recipe import:", error);
      // Handle fetch errors (network, proxy unavailable) or unexpected parsing errors
      setImportError(`Failed to fetch or process the URL. ${error.message || ''}`);
    } finally {
      setImportLoading(false);
    }
    // ==============================================================
    // End of Backend Requirement section
    // ==============================================================
  };

  // Effect for body scroll lock (Adjust based on sidebar/modal open)
  useEffect(() => {
    // Lock if sidebar is open on small screens OR if view modal is open
    const shouldLock = (isSidebarOpen && window.innerWidth < 1024) || isViewModalOpen;
    document.body.style.overflow = shouldLock ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isSidebarOpen, isViewModalOpen]); // Depend on both


  return (
    <div className="relative">

      {/* ==== Main Content Area (Recipe List) ==== */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 h-16 flex items-center">
          My Recipes
        </h2>
        <div>
          {recipes.length === 0 ? (
            <p className="text-gray-500 italic text-center py-10">
              No recipes yet. Click the '+' button to add your first one!
            </p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recipes.map((recipe) => (
                <RecipeItem
                  key={recipe.id}
                  recipe={recipe}
                  onDelete={onDeleteRecipe}
                  // *** Pass new handlers ***
                  onEdit={handleOpenEditSidebar}
                  onView={handleOpenViewModal}
                />
              ))}
            </ul>
          )}
        </div>
      </div>


      {/* ==== Floating Action Buttons ==== */}
      <div className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 z-20 space-y-3">
        {/* Import FAB */}
        {!isSidebarOpen && !isImportModalOpen && ( // Hide if sidebar or import modal is open
          <button
            onClick={handleOpenImportModal}
            className="flex items-center justify-center w-14 h-14 bg-teal-600 text-white rounded-full shadow-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition ease-in-out duration-150"
            title="Import Recipe from URL"
          >
            <ImportIcon />
          </button>
        )}
        {/* Add FAB */}
        {!isSidebarOpen && !isImportModalOpen && ( // Hide if sidebar or import modal is open
          <button
            onClick={handleOpenAddSidebar}
            className="flex items-center justify-center w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ease-in-out duration-150"
            title="Add New Recipe Manually"
          >
            <PlusIcon />
          </button>
        )}
      </div>

      {/* ==== Sidebar Area (Add Recipe Form) ==== */}
      {/* Overlay background (only rendered when sidebar is open) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 z-30 lg:hidden"
          onClick={handleCloseSidebar} // Close sidebar on overlay click
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar Container - positioned fixed, transitions applied */}
      <div
        className={`fixed inset-y-0 right-0 z-40 w-full max-w-md bg-white shadow-xl border-l border-gray-200 transform transition-transform ease-in-out duration-300
                           ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
                           flex flex-col 
                           top-0.5 bottom-0 {/* <--- POSITIONING: Explicit top/bottom */}
                           h-100[calc(100vh-4rem)] {/* <--- HEIGHT: Fill below nav (4rem = h-16) */}
                           ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
                           `} // Removed inset-y-0 and pt-6
      >
        {/* --- Sidebar Header --- */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-xl font-semibold text-gray-800">
            {/* Conditional Title */}
            {editingRecipe ? 'Edit Recipe' : 'Add a New Recipe'}
          </h3>
          <button
            onClick={handleCloseSidebar} // Use close handler
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
            title="Close Panel"
          >
            <CloseIcon />
          </button>
        </div>

        {/* --- Sidebar Content (Form) --- */}
        {/* Make form scrollable if content overflows */}
        <div className="p-6  overflow-y-auto flex-grow">
          {/* Give form an ID for potentially associating buttons */}
          <form id="recipe-sidebar-form" onSubmit={handleSidebarSubmit} className="space-y-4">
            {/* Recipe Name Input */}
            <div>
              <label htmlFor="recipeName" className="block text-sm font-medium text-gray-700 mb-1"> {/* Added classes */}
                Recipe Name
              </label>
              <input
                type="text" // Ensure type is text
                id="recipeName"
                value={newRecipeName}
                onChange={(e) => setNewRecipeName(e.target.value)}
                required
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400" // Added classes
                placeholder="e.g., Chicken Curry" // Added placeholder
              />
            </div>

            {/* Ingredients Input */}
            <div>
              <label htmlFor="recipeIngredients" className="block text-sm font-medium text-gray-700 mb-1"> {/* Added classes */}
                Ingredients
              </label>
              <textarea
                id="recipeIngredients"
                value={newRecipeIngredients}
                onChange={(e) => setNewRecipeIngredients(e.target.value)}
                rows="5"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 resize-y" // Added classes
                placeholder="e.g.,
- 1 chicken breast
- 1 tbsp curry powder
- ..." // Added placeholder
              />
            </div>

            {/* Instructions Input */}
            <div>
              <label htmlFor="recipeInstructions" className="block text-sm font-medium text-gray-700 mb-1"> {/* Added classes */}
                Instructions
              </label>
              <textarea
                id="recipeInstructions"
                value={newRecipeInstructions}
                onChange={(e) => setNewRecipeInstructions(e.target.value)}
                rows="7"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 resize-y" // Added classes
                placeholder="e.g.,
1. Cut chicken...
2. Sauté onions...
3. Add curry powder..." // Added placeholder
              />
            </div>
            {/* No submit button inside form needed if triggered externally */}
          </form>
        </div>

        {/* --- Sidebar Footer --- */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0 flex justify-end">
          <button
            type="button" // Use type="button"
            onClick={handleSidebarSubmit} // Call the combined handler
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {/* Conditional Button Text */}
            {editingRecipe ? 'Save Changes' : 'Add Recipe'}
          </button>
        </div>
      </div>
      {/* End Sidebar Container */}

      {/* ==== View Recipe Modal ==== */}
      {/* Render the modal conditionally */}
      {isViewModalOpen && (
        <ViewRecipeModal
          recipe={viewingRecipe}
          onClose={handleCloseViewModal}
        />
      )}
      {/* ==== Import Recipe Modal ==== */}
      {isImportModalOpen && (
        <ImportRecipeModal
          isOpen={isImportModalOpen}
          onClose={handleCloseImportModal}
          onImport={handleImportRecipe}
          loading={importLoading}
          error={importError}
        />
      )}
    </div>
  );
}

export default RecipesPage;