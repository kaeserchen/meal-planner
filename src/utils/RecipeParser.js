// src/utils/recipeParser.js

/**
 * Attempts to parse Schema.org Recipe data (JSON-LD) from an HTML string.
 *
 * @param {string} htmlContent The raw HTML content of the page.
 * @returns {object|null} An object with { name, ingredients, instructions } or null if not found/parsed.
 */
export function parseRecipeFromJsonLd(htmlContent) {
    if (!htmlContent) return null;

    try {
        // Use DOMParser to safely parse the HTML string in the browser
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');

        // Find all JSON-LD script tags
        const jsonLdScripts = doc.querySelectorAll('script[type="application/ld+json"]');

        for (const script of jsonLdScripts) {
            try {
                const jsonContent = JSON.parse(script.textContent);

                // Check if the root is a Recipe or an array/graph containing a Recipe
                let recipeData = null;
                if (jsonContent['@type'] === 'Recipe') {
                    recipeData = jsonContent;
                } else if (Array.isArray(jsonContent)) {
                    // Find the first item that is a Recipe
                    recipeData = jsonContent.find(item => item['@type'] === 'Recipe');
                } else if (jsonContent['@graph'] && Array.isArray(jsonContent['@graph'])) {
                     // Check inside "@graph" array (common structure)
                     recipeData = jsonContent['@graph'].find(item => item['@type'] === 'Recipe');
                }


                // If a Recipe object was found, extract relevant fields
                if (recipeData) {
                    console.log("Found recipeData:", JSON.stringify(recipeData, null, 2));
                    const name = recipeData.name || '';

                    // --- Ingredients ---
                    // Can be an array of strings or just a string
                    let ingredients = '';
                    if (Array.isArray(recipeData.recipeIngredient)) {
                         ingredients = recipeData.recipeIngredient.join('\n');
                    } else if (typeof recipeData.recipeIngredient === 'string') {
                        ingredients = recipeData.recipeIngredient;
                    }

                     // --- Instructions ---
                    // Can be a string, an array of strings, or array of HowToStep objects
                    let instructions = '';
                     if (typeof recipeData.recipeInstructions === 'string') {
                        instructions = recipeData.recipeInstructions;
                    } else if (Array.isArray(recipeData.recipeInstructions)) {
                        instructions = recipeData.recipeInstructions.map(step => {
                            if (typeof step === 'string') {
                                return step;
                            // Check for HowToStep or HowToSection structure
                            } else if (step['@type'] === 'HowToStep' && step.text) {
                                return step.text;
                            } else if (step['@type'] === 'HowToSection') {
                                // Handle sections: concatenate name and item texts
                                let sectionText = step.name ? `${step.name}:\n` : '';
                                if (step.itemListElement && Array.isArray(step.itemListElement)) {
                                    sectionText += step.itemListElement.map(item => item.text || '').join('\n');
                                }
                                return sectionText;
                            }
                            return ''; // Ignore unknown step formats
                        }).filter(Boolean).join('\n\n'); // Join steps with double newline
                    }

                    // Return the structured data matching our app's format
                    return { name, ingredients, instructions };
                }
            } catch (jsonError) {
                // Ignore scripts with invalid JSON
                console.warn("Skipping invalid JSON-LD script:", jsonError);
            }
        }

        // If no Recipe type was found in any script tag
        return null;

    } catch (error) {
        console.error("Error parsing HTML content:", error);
        return null;
    }
}