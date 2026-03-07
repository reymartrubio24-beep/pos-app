import React from 'react';

const ProductFilters = ({ search, setSearch, category, setCategory, categories }) => {
  return (
    <div style={{ marginBottom: '24px' }}>
      <div className="pos-search-wrapper">
        <input 
          type="text" 
          placeholder="Search product or scan barcode..." 
          className="input-field pos-search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <svg className="pos-search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none' }}>
        {categories.map(c => (
          <button 
            key={c}
            className={`category-pill ${category === c ? 'active' : ''}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductFilters;
