import { FC } from "react";
import '../styles/productCard.css';


export type Product = {
    id: number;
    type: 'nft' | 'physical' | 'vinyl' | 'merch';
    title: string;
    artist: string;
    price: number;
    currency: string;
    previewUrl?: string;
    image?: string;
    badges?: string[];
}

type ProductCardProps = {
    product: Product;
    onPreview: (url: String) => void;
    onAddToCart: () => void;
}

export const ProductCard = ({ product, onPreview, onAddToCart }: ProductCardProps) => {
    return (
        <div className="ProductCard">
            <div className={`product-card ${product.type}`}>
                <div className="product-badges">
                    {product.badges?.map((badge) => (
                        <span key={badge} className="badge">{badge}</span>
                    ))}
                </div>
                <img src={product.image} alt={product.title} />
                <div className="product-info">
                    <h4>{product.title}</h4>
                    <p className="artist">{product.artist}</p>
                    <div className="price">{product.price} {product.currency}</div>
                    <div className="product-actions">
                        {product.previewUrl && (
                            <button
                                className="preview-btn"
                                onClick={() => onPreview(product.previewUrl!)}
                            >▶ Preview</button>
                        )}
                        <button
                            className="buy-btn"
                            onClick={onAddToCart}
                        >{product.type === 'nft' ? 'Mint NFT' : 'Add to Cart'}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}