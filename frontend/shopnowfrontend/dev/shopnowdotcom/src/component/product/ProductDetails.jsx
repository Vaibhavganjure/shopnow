import React, { useEffect } from 'react'
import { useParams } from "react-router-dom"
import { getProductByID, setQuantity } from '../../store/features/productSlice'
import { FaShoppingCart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux"
import ImageZoomify from '../common/ImageZoomify'
import QuantityUpdater from '../utils/QuantityUpdater'
import { addToCart, clearCartMessages } from '../../store/features/cartSlice';
import { toast, ToastContainer } from "react-toastify"
import StockStatus from '../utils/StockStatus';


const ProductDetails = () => {
    const { productId } = useParams()
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const { product, quantity } = useSelector((state) => state.product)
    const dispatch = useDispatch()
    const { errorMessage, successMessage } = useSelector((state) => state.cart)
    const productOutOfStock = product?.inventory <= 0;

    useEffect(() => {
        dispatch(getProductByID(productId))
    }, [dispatch, productId])

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(clearCartMessages());
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(clearCartMessages())
        }
    }, [successMessage, errorMessage, dispatch]);

    const handleAddToCart = () => {
        if(!isAuthenticated){
            toast.error("Please login to add items to cart");
            return;
        }
        dispatch(addToCart({ productId, quantity }))

    };

    const handleIncreaseQuantity = () => {
        dispatch(setQuantity(quantity + 1))

    }
    const handleDecreaseQuantity = () => {
        if (quantity > 1) {
            dispatch(setQuantity(quantity - 1))
        }
    }


    return (
        <div className="container mt-4 mb-4">
            <ToastContainer />
            {product ? (
                <div className="row product-details">

                    <div className="col-md-2">
                        {product.images.map((img) => (
                            <div key={img.id} className="mt-4 image-container">
                                <ImageZoomify productId={img.id} />
                            </div>
                        ))}
                    </div>
                    <div className='col-md-8 details-container'>
                        <h1 className='product-name'>{product.name}</h1>
                        <h4 className='price'>$: {product.price}</h4>
                        <p className='product-description'>{product.description}</p>
                        <p className='product-name'>Brand: {product.brand.toUpperCase()}</p>

                        <p className='product-name'>
                            Rating: <span className='rating'>some stars</span>
                        </p>

                        <StockStatus inventory={product.inventory} />

                        <p>Quantity:</p>
                        <span><QuantityUpdater
                            quantity={quantity}
                            onIncrease={handleIncreaseQuantity}
                            onDecrease={handleDecreaseQuantity}
                            disabled={productOutOfStock}

                        /></span>
                        <div className='d-flex gap-2 mt-3'>
                            <button className='add-to-cart-button' onClick={handleAddToCart} disabled={productOutOfStock}><FaShoppingCart /> Add to cart</button>
                            <button className='buy-now-button' disabled={productOutOfStock}>Buy now</button>
                        </div>
                    </div>

                </div>
            ) : <p>No products</p>}
        </div>

    )
}

export default ProductDetails
