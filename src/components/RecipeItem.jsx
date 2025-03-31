// src/components/RecipeItem.jsx
import React from 'react';

// Receive 'onDelete' function as a prop
function RecipeItem({ recipe, onDelete }) {
  const { id, name, description } = recipe; // Also destructure id

  // Function to handle the delete button click within this item
  const handleDeleteClick = () => {
    // Call the onDelete function passed down from the parent,
    // sending the id of this specific recipe back up.
    onDelete(id);
  };

  return (
    <li style={{ border: '1px solid #ccc', marginBottom: '10px', padding: '10px', listStyle: 'none' }}>
      <h3>{name}</h3>
      <p>{description}</p>
      <div style={{ marginTop: '5px' }}>
         <button style={{ marginRight: '5px' }} onClick={() => alert(`Viewing details for ${name}`)}>View</button>
         <button style={{ marginRight: '5px' }} onClick={() => alert(`Editing ${name}`)}>Edit</button>
         {/* Update the onClick handler for the Delete button */}
         <button onClick={handleDeleteClick}>Delete</button>
         {/* Alternatively, you could write it inline like this:
             <button onClick={() => onDelete(id)}>Delete</button>
             Using a separate handler function (handleDeleteClick) can be clearer if
             you need to do more complex things before calling the prop function.
          */}
      </div>
    </li>
  );
}

export default RecipeItem;
