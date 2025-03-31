// src/components/ReadOnlyPlannerView.jsx
import React from 'react';

// Helper function to format dates (same as in PlannerPage)
const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString(undefined, {
        month: 'short',   // e.g., 'Apr'
        day: 'numeric'    // e.g., '2'
    });
};

function ReadOnlyPlannerView({ mealPlan, daysOfWeek, mealSlots, weekDates }) {

    return (
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px', border: '1px solid #eee', padding: '10px', borderRadius: '5px' }}>
            {daysOfWeek.map((day, index) => {
                const date = weekDates[index];
                const formattedDate = formatDate(date);

                return (
                    // Use day for the key as before
                    <div key={day} style={{ border: '1px solid #ccc', padding: '10px', minWidth: '200px', flexShrink: 0 }}> {/* Slightly smaller minWidth? */}
                        <h3>
                            {day}
                            {formattedDate && <div style={{ fontSize: '0.8em', fontWeight: 'normal', color: '#555' }}>({formattedDate})</div>}
                        </h3>

                        {mealSlots.map(slot => {
                            // Safely access planned items, default to empty array if undefined
                            const plannedItems = mealPlan?.[day]?.[slot] ?? [];

                            return (
                                <div key={slot} style={{ borderTop: '1px dashed #eee', marginTop: '10px', paddingTop: '10px', minHeight: '80px' /* Adjust as needed */ }}>
                                    <strong>{slot.charAt(0).toUpperCase() + slot.slice(1).replace(/([A-Z])/g, ' $1').trim()}:</strong>
                                    <div>
                                        {/* List of planned items - READ ONLY */}
                                        <ul style={{ listStyle: 'disc', paddingLeft: '20px', margin: '5px 0' }}> {/* Use standard list style */}
                                            {plannedItems.length > 0 ? (
                                                plannedItems.map(item => (
                                                    // Use item.id as key
                                                    <li key={item.id} style={{ marginBottom: '3px' }}>
                                                        {/* Display based on type */}
                                                        <span>{item.type === 'recipe' ? item.recipeName : item.text}</span>
                                                        {/* NO REMOVE BUTTON */}
                                                    </li>
                                                ))
                                            ) : (
                                                <li style={{ fontStyle: 'italic', color: '#777', listStyle: 'none', paddingLeft: 0 }}>Empty</li>
                                            )}
                                        </ul>
                                        {/* NO INPUT SECTION (dropdown, text input, add button) */}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}

export default ReadOnlyPlannerView;