import React, { useState, useCallback, useEffect } from 'react';
import VoiceForm from './components/VoiceForm';
import VoiceSearch from './components/VoiceSearch';
import ItemList from './components/ItemList';
import ChatWindow from './components/ChatWindow';
import useLocalStorage from './hooks/useLocalStorage';
import './App.css';

function App() {
  const [items, setItems] = useLocalStorage('voiceCrudItems', []);
  const [filteredItems, setFilteredItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filterItems = useCallback((query) => {
    const lowerQuery = query.toLowerCase();

    const filtered = items.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.description?.toLowerCase().includes(lowerQuery)
    );

    setFilteredItems(filtered);
    setSearchQuery(query);
  }, [items]);

  useEffect(() => {
    if (searchQuery) {
      filterItems(searchQuery);
    } else {
      setFilteredItems(items);
    }
  }, [items, searchQuery, filterItems]);

  const handleAddItem = (itemData) => {
    const newItem = {
      id: Date.now(),
      ...itemData,
    };

    setItems((prev) => [...prev, newItem]);

    alert('Item added successfully!');
  };

  const handleUpdateItem = (updatedItem) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      )
    );

    setEditingItem(null);

    alert('Item updated successfully!');
  };

  const handleDeleteItem = (id, skipConfirm = false) => {
    if (skipConfirm || window.confirm('Are you sure you want to delete this item?')) {
      setItems((prev) =>
        prev.filter((item) => item.id !== id)
      );
    }
  };

  const handleToggleItem = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  const handleSearch = useCallback((query) => {
    filterItems(query);
  }, [filterItems]);

  const handleClearSearch = () => {
    filterItems('');
  };

  return (
    <div className="app">
      <div className="app-content">

        <header className="app-header">
          <h1>Voice CRUD App</h1>
          <p>Create, Read, Update, Delete with Voice Commands</p>
        </header>

        <div className="main-container">

          <aside className="sidebar">
            <VoiceForm
              onAddItem={handleAddItem}
              onUpdateItem={handleUpdateItem}
              editingItem={editingItem}
              onCancelEdit={handleCancelEdit}
            />
          </aside>

          <main className="content">

            <div className="search-section">
              <VoiceSearch onSearch={handleSearch} />

              {searchQuery && (
                <div className="search-info">
                  <span>
                    Showing {filteredItems.length} of {items.length} items
                  </span>

                  <button
                    onClick={handleClearSearch}
                    className="clear-search-btn"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            <ItemList
              items={filteredItems}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
              onToggle={handleToggleItem}
            />

            <footer className="app-footer">
              <p>
                Tip: Use voice commands to search and manage your items!
              </p>
            </footer>

          </main>

          <aside className="chat-sidebar">
            <ChatWindow
              items={items}
              onAddItem={handleAddItem}
              onDeleteItem={(id) => handleDeleteItem(id, true)}
              onSearch={handleSearch}
              onClearSearch={handleClearSearch}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}

export default App;