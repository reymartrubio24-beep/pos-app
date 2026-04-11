import React from 'react';

const ProductCard = ({ product, onClick }) => {
  const isOutOfStock = product.stock <= 0;

  return (
    <div 
      className={`premium-card product-card ${isOutOfStock ? 'opacity-50' : ''}`}
      onClick={() => !isOutOfStock && onClick(product)}
      style={isOutOfStock ? { pointerEvents: 'none', opacity: 0.6 } : {}}
    >
      <div className="product-image-placeholder">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="product-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
        ) : null}
        <svg 
          className="placeholder-cart-icon"
          style={{ display: product.image_url ? 'none' : 'block' }} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {isOutOfStock && (
          <div className="out-of-stock-badge">Out of Stock</div>
        )}
      </div>
      <div className="product-info-top">
        <div className="product-name-new">{product.name}</div>
        <div className={`product-category-badge cat-${product.category?.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')}`}>
          {product.category}
        </div>
      </div>
      <div className="product-info-bottom">
        <div className="product-price-new">₱{parseFloat(product.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        <div className={`product-stock-new ${product.stock > 0 && product.stock <= product.low_stock_threshold ? 'low-stock-alert' : ''}`}>
          {product.stock} left
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
