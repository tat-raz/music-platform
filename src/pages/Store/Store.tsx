import React, { FC, useState } from 'react';
import { Header } from '../../components/Header/Header';
import { Product, ProductCard } from '../../components/ProductCard/ProductCard';
import productData from '../../data/products.json';
import style from './Store.module.scss';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';


export const Store: FC = () => {
    const navigate = useNavigate();

    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sortOption, setSortOption] = useState<string>('newest');
    const [cartItems, setCartItems] = useState<Product[]>([]);

    const [products, setProducts] = useState<Product[]>(productData as Product[]);

    const { user } = useAuth();

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

    const addToCart = async (product: Product) => {
        if (!user) {
            alert('Please sign in to add items to cart.');
            return;
        }

        if (user.riskScore >= 70) {
            await sendEvent('cart_add_blocked', {
            productId: product.id,
            productTitle: product.title,
            reason: 'high_risk_score',
            riskScore: user.riskScore,
            });

            alert('This action is blocked due to high risk activity.');
            return;
        }

        if (user.riskScore >= 30) {
            await sendEvent('cart_add_warning', {
            productId: product.id,
            productTitle: product.title,
            reason: 'medium_risk_score',
            riskScore: user.riskScore,
            });

            alert('Suspicious activity detected. This action will be monitored.');
        } else {
            await sendEvent('cart_add_success', {
            productId: product.id,
            productTitle: product.title,
            riskScore: user.riskScore,
            });
        }

        setCartItems((prev) => [...prev, product]);
    };
    
    const sendEvent = async (type: string, metadata?: object) => {
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        try {
            await fetch('http://localhost:5001/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                type,
                metadata,
            }),
            });
        } catch (error) {
            console.error('Failed to send event:', error);
        }
    };

    const removeFromCart = (index: number) => {
        setCartItems((prev) => prev.filter((_, i) => i !== index));
    };
    
      const totalByCurrency = cartItems.reduce<Record<string, number>>((totals, item) => {
        totals[item.currency] = (totals[item.currency] || 0) + item.price;
        return totals;
    }, {});

    const handleExploreDrops = () => {
        navigate("/store");
    }

    return (
        <div className={style.Store}>
            <Header />
            <div className={style.promoBanner}>
                <div className={style.promoContent}>
                    <h2>NFT Music Week</h2>
                    <p>Collect limited editions with bonus AR content!</p>
                    <button className={style.glowButton} onClick={handleExploreDrops}>Explore Drops</button>
                </div>
            </div>

            <div className={style.shopControls}>
                <div className={style.categoryFilters}>
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

                <div className={style.searchSort}>
                    <input 
                        type="text"
                        placeholder='Search...'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={style.searchInput}
                    />
                    <select className={style.sortSelect} onChange={(e) => setSortOption(e.target.value)}>
                        <option value="newest">Newest First</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                    </select>
                </div>
            </div>

            <div className={style.productsGrid}>
                {filtered.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onPreview={(url) => console.log('Play preview:', url)}
                        onAddToCart={() => addToCart(product)}
                    />
                ))}
            </div>

            {/* <div className={style.liveAuctions}>
                <h3 className={style.sectionTitle}>Live Auctions 🔥</h3>
                <div className={style.auctionCards}>
                    <div className={style.auctionItem}>
                        <div className={style.timer}>12h 45m left</div>
                        <img src="/auctions/1.jpg" alt="Auction Item" />
                        <div className={style.auctionInfo}>
                        <h4>Unreleased Track Demo</h4>
                        <p className={style.artist}>Top Secret Artist</p>
                        <div className={style.bidInfo}>
                            <span className={style.currentBid}>1.2 ETH</span>
                            <button className={style.bidButton}>Place Bid</button>
                        </div>
                        </div>
                    </div>
                </div>
            </div> */}

            <div className={style.cartSidebar}>
                <h4>Your Cart</h4>
                <div className={style.cartItems}>
                {cartItems.length === 0 ? (
                    <p>No items in cart.</p>
                ) : (
                    cartItems.map((item, index) => (
                    <div key={index} className={style.cartItem}>
                        <p>{item.title} — {item.price} {item.currency}</p>
                        <button className={style.removeButton} onClick={() => removeFromCart(index)}>✕</button>
                    </div>
                    ))
                )}
                </div>

                {cartItems.length > 0 && (
                <div className={style.cartSummary}>
                    {Object.entries(totalByCurrency).map(([currency, total]) => (
                    <p key={currency}><strong>Total:</strong> {total.toFixed(2)} {currency}</p>
                    ))}
                    <button className={style.checkoutButton}>Checkout with Crypto</button>
                </div>
                )}
            </div>
        </div>
    )
}