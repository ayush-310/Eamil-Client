// Buttons.js
import React from 'react';

const Buttons = ({ handleFilter }) => {
    return (
        <div>
            <button onClick={() => handleFilter('all')}>All</button>
            <button onClick={() => handleFilter('read')}>Read</button>
            <button onClick={() => handleFilter('unread')}>Unread</button>
            <button onClick={() => handleFilter('favorites')}>Favorites</button>
        </div>
    );
};

export default Buttons;
