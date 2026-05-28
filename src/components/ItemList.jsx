import React from 'react';
import './ItemList.css';

const ItemList = ({ items, onEdit, onDelete, onToggle }) => {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <p>
          No items yet. Add one using the voice assistant or the form on the left.
        </p>
      </div>
    );
  }

  return (
    <div className="items-container">
      <div className="list-header">
        <h2>Items</h2>
        <span className="count-pill">{items.length} total</span>
      </div>

      <div className="list-wrapper">
        {items.map((item) => (
          <div key={item.id} className={`list-item ${item.completed ? 'completed' : ''}`}>
            <div className="left-section">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => onToggle(item.id)}
                className="item-checkbox"
                aria-label={`Mark ${item.title} as ${item.completed ? 'incomplete' : 'complete'}`}
              />

              <div className="item-content">
                <h3>{item.title}</h3>
                {item.description && <p>{item.description}</p>}
                <span className="date">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="right-section">
              <button onClick={() => onEdit(item)} className="action-button edit-button">
                Edit
              </button>
              <button onClick={() => onDelete(item.id)} className="action-button delete-button">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemList;
