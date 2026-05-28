import React, { useState, useCallback, useEffect } from "react";
import VoiceForm from "./components/VoiceForm";
import VoiceSearch from "./components/VoiceSearch";
import ItemList from "./components/ItemList";
import ChatWindow from "./components/ChatWindow";
import useLocalStorage from "./hooks/useLocalStorage";
import "./App.css";

function App() {
  const [items, setItems] = useLocalStorage("voiceCrudItems", []);
  const [filteredItems, setFilteredItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState("");

  const filterItems = useCallback(
    (query) => {
      const lowerQuery = query.toLowerCase();

      const filtered = items.filter(
        (item) =>
          item.title.toLowerCase().includes(lowerQuery) ||
          item.description?.toLowerCase().includes(lowerQuery),
      );

      setFilteredItems(filtered);
      setSearchQuery(query);
    },
    [items],
  );

  useEffect(() => {
    if (searchQuery) {
      filterItems(searchQuery);
    } else {
      setFilteredItems(items);
    }
  }, [items, searchQuery, filterItems]);

  useEffect(() => {
    if (!notification) return undefined;
    const timer = window.setTimeout(() => setNotification(""), 3200);
    return () => window.clearTimeout(timer);
  }, [notification]);

  const notify = (message) => {
    setNotification(message);
  };

  const handleAddItem = (itemData) => {
    const newItem = {
      id: Date.now(),
      ...itemData,
    };

    setItems((prev) => [...prev, newItem]);
    notify("Item added successfully.");
  };

  const handleUpdateItem = (updatedItem) => {
    setItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
    );

    setEditingItem(null);
    notify("Item updated successfully.");
  };

  const handleDeleteItem = (id, skipConfirm = false) => {
    if (
      skipConfirm ||
      window.confirm("Are you sure you want to delete this item?")
    ) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      notify("Item removed successfully.");
    }
  };

  const handleToggleItem = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    );
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  const handleSearch = useCallback(
    (query) => {
      filterItems(query);
    },
    [filterItems],
  );

  const handleClearSearch = () => {
    filterItems("");
  };

  const stats = {
    total: items.length,
    completed: items.filter((item) => item.completed).length,
    active: items.filter((item) => !item.completed).length,
  };

  return (
    <div className="app-shell">
      <div className="app-content">
        <header className="page-header">
          <div className="page-intro">
            <p className="eyebrow">Voice CRUD dashboard</p>
          </div>

          <div className="header-meta">
            <span className="header-chip">{stats.total} items</span>
            <span className="header-chip">{stats.active} active</span>
            <span className="header-chip">{stats.completed} completed</span>
          </div>
        </header>

        {notification && <div className="toast-banner">{notification}</div>}

        <section className="dashboard-grid">
          <aside className="panel panel-sidebar">
            <div className="panel-header">
              <div>
                <h2>Quick add</h2>
                <p>
                  Use the form or voice controls to add new items in seconds.
                </p>
              </div>
            </div>
            <VoiceForm
              onAddItem={handleAddItem}
              onUpdateItem={handleUpdateItem}
              editingItem={editingItem}
              onCancelEdit={handleCancelEdit}
            />
          </aside>

          <main className="panel panel-main">
            <div className="panel-header panel-header-split">
              <div>
                <h2>Item library</h2>
                <p>
                  Search, review, and update your current list with polished
                  controls.
                </p>
              </div>
              <div className="search-block">
                <VoiceSearch onSearch={handleSearch} />
              </div>
            </div>

            {searchQuery && (
              <div className="search-info-panel">
                <span>
                  Showing {filteredItems.length} of {items.length} items for “
                  {searchQuery}”.
                </span>
                <button
                  onClick={handleClearSearch}
                  className="clear-search-btn"
                >
                  Clear search
                </button>
              </div>
            )}

            <ItemList
              items={filteredItems}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
              onToggle={handleToggleItem}
            />
          </main>

          <aside
            className="panel panel-chat"
            style={{
              backgroundColor: "#f9f9f900",
              border: "none",
              boxShadow: "none",
            }}
          >
            <ChatWindow
              items={items}
              onAddItem={handleAddItem}
              onDeleteItem={handleDeleteItem}
              onUpdateItem={handleUpdateItem}
              onSearch={handleSearch}
              onClearSearch={handleClearSearch}
            />
          </aside>
        </section>
      </div>
    </div>
  );
}

export default App;
