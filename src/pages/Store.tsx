import React, { FC, useState } from 'react';
import { Header } from '../components/Header';
import { Product, ProductCard } from '../components/ProductCard';
import productData from '../data/products.json';
import '../styles/store.css';


export const Store: FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sortOption, setSortOption] = useState<string>('newest');
    const [cartItems, setCartItems] = useState<Product[]>([]);

    const [products, setProducts] = useState<Product[]>(productData as Product[]);

    const filtered = products
        .filter(p =>
            (selectedCategory === 'all' || p.type === selectedCategory) &&
            (p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
             p.artist.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .sort((a, b) => {
            if (sortOption === 'price-asc') return a.price - b.price;
            if (sortOption === 'price-desc') return b.price - a.price;
            return b.id - a.id; // default: newest first
    });

    const addToCart = (product: Product) => {
        setCartItems([...cartItems, product]);
    };
    
      const removeFromCart = (index: number) => {
        setCartItems((prev) => prev.filter((_, i) => i !== index));
    };
    
      const totalByCurrency = cartItems.reduce<Record<string, number>>((totals, item) => {
        totals[item.currency] = (totals[item.currency] || 0) + item.price;
        return totals;
    }, {});

    return (
        <div className='Store'>
            <Header />
            <div className="promo-banner">
                <div className="promo-content">
                    <h2>NFT Music Week</h2>
                    <p>Collect limited editions with bonus AR content!</p>
                    <button className="glow-btn">Explore Drops</button>
                </div>
            </div>

            <div className="shop-controls">
                <div className="category-filters">
                    {['all', 'nft', 'physical'].map(type => (
                        <button
                            key={type}
                            className={selectedCategory === type ? 'active' : ''}
                            onClick={() => setSelectedCategory(type)}
                        >
                            {type === 'all' ? 'All' : type === 'nft' ? 'Digital/NFT' : 'Physical'}
                        </button>
                    ))}
                </div>

                <div className="search-sort">
                    <input 
                        type="text"
                        placeholder='Search...'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='search-input'
                    />
                    <select className='sort-select' onChange={(e) => setSortOption(e.target.value)}>
                        <option value="newest">Newest First</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                    </select>
                </div>
            </div>

            <div className="products-grid">
                {filtered.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onPreview={(url) => console.log('Play preview:', url)}
                        onAddToCart={() => addToCart(product)}
                    />
                ))}
            </div>

            {/* <div className="live-auctions">
                <h3 className="section-title">Live Auctions 🔥</h3>
                <div className="auction-cards">
                    <div className="auction-item">
                        <div className="timer">12h 45m left</div>
                        <img src="/auctions/1.jpg" alt="Auction Item" />
                        <div className="auction-info">
                        <h4>Unreleased Track Demo</h4>
                        <p className="artist">Top Secret Artist</p>
                        <div className="bid-info">
                            <span className="current-bid">1.2 ETH</span>
                            <button className="bid-button">Place Bid</button>
                        </div>
                        </div>
                    </div>
                </div>
            </div> */}

            <div className="cart-sidebar">
                <h4>Your Cart</h4>
                <div className="cart-items">
                {cartItems.length === 0 ? (
                    <p>No items in cart.</p>
                ) : (
                    cartItems.map((item, index) => (
                    <div key={index} className="cart-item">
                        <p>{item.title} — {item.price} {item.currency}</p>
                        <button className="remove-btn" onClick={() => removeFromCart(index)}>✕</button>
                    </div>
                    ))
                )}
                </div>

                {cartItems.length > 0 && (
                <div className="cart-summary">
                    {Object.entries(totalByCurrency).map(([currency, total]) => (
                    <p key={currency}><strong>Total:</strong> {total.toFixed(2)} {currency}</p>
                    ))}
                    <button className="checkout-button">Checkout with Crypto</button>
                </div>
                )}
            </div>
        </div>
    )
}