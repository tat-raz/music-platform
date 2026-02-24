import { FC } from "react";
import style from './ProductCard.module.scss';


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

export const ProductCard: FC<ProductCardProps> = ({ product, onPreview, onAddToCart }: ProductCardProps) => {
    return (
        <div className={style.ProductCard}>
            <div className={`${style.productCard} ${style[product.type]}`}>
                <div className={style.productBadges}>
                    {product.badges?.map((badge) => (
                        <span key={badge} className={style.badge}>{badge}</span>
                    ))}
                </div>
                <img src={product.image} alt={product.title} />
                <div className={style.productInfo}>
                    <h4>{product.title}</h4>
                    <p className={style.artist}>{product.artist}</p>
                    <div className={style.price}>{product.price} {product.currency}</div>
                    <div className={style.productActions}>
                        {product.previewUrl && (
                            <button
                                className={style.previewButton}
                                onClick={() => onPreview(product.previewUrl!)}
                            >▶ Preview</button>
                        )}
                        <button
                            className={style.buyButton}
                            onClick={onAddToCart}
                        >{product.type === 'nft' ? 'Mint NFT' : 'Add to Cart'}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}