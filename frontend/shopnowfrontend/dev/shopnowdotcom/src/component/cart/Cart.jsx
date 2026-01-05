import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getUserCart, updateQuantity, removeItemFromCart, clearCartMessages, clearCart } from '../../store/features/cartSlice'
import { Card } from 'react-bootstrap'
import ProductImage from "../utils/ProductImage"
import QuantityUpdater from '../utils/QuantityUpdater'
import LoadSpinner from '../common/LoadSpinner'
import { toast, ToastContainer } from "react-toastify"
import { placeOrder } from '../../store/features/orderSlice'


const Cart = () => {
    const { userId } = useParams()
    const navigate=useNavigate()
    const dispatch = useDispatch()
    const cart = useSelector((state) => state.cart)
    const cartId = useSelector((state) => state.cart.cartId)
    const isLoading = useSelector((state) => state.cart.isLoading)
    const { errorMessage, successMessage } = useSelector((state) => state.cart)
    const successMessageOrder = useSelector((state) => state.order.successMessage)

    useEffect(() => {
        dispatch(getUserCart(userId))
    }, [dispatch, userId])

    const handleIncreaseQuantity = (itemId) => {
        const item = cart.items.find((item) => item.productId === itemId)
        if (item && cartId) {
            dispatch(updateQuantity({ cartId: cartId, itemId, newQuantity: item.quantity + 1 }))
        }
    }
    const handleDecreaseQuantity = (itemId) => {
        const item = cart.items.find((item) => item.productId === itemId)
        if (item && item.quantity > 1) {
            dispatch(updateQuantity({ cartId: cartId, itemId, newQuantity: item.quantity - 1 }))
        }
    }
    const handleRemoveFromCart = (itemId) => {

        dispatch(removeItemFromCart({ cartId: cartId, itemId }))

    }
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

    useEffect(() => {
        if (successMessageOrder) {
            toast.success(successMessageOrder);
        }

    }, [successMessageOrder]);

    
    useEffect(() => {
        if (successMessageOrder) {
            dispatch(clearCart());
        }
    }, [successMessageOrder, dispatch]);



    if (isLoading) {
        return <LoadSpinner />
    }

    const handlePlaceOrder = () => {
        navigate(`/checkout/${userId}/checkout`)
    }
    return (

        <div className='container mt-5 mb-5 p-5'>
            <ToastContainer />

            {cart.items.length === 0 ? <p className='mb-4 cart-title'>Your Cart is empty</p> :
                <div className='d-flex flex-column'>
                    <div className="d-flex justify-content-between mb-4 fw-bold">
                        <div className="text-center">Image</div>
                        <div className="text-center">Name</div>
                        <div className="text-center">Brand</div>
                        <div className="text-center">Price</div>
                        <div className="text-center">Quantity</div>
                        <div className="text-center">Total Price</div>
                        <div className="text-center">Action</div>
                    </div>
                    <hr className='mb-2 mt-2' />
                    <h3 className='mb-4 cart-title'>My Shopping Cart</h3>


                    {cart.items.map((item, index) => (
                        <Card key={index} className="mb-4">
                            <Card.Body className="d-flex justify-content-between align-items-center shadow">
                                <div className="d-flex align-items-center">
                                    <Link to={"#"}>
                                        <div className="cart-image-container">
                                            {item?.images?.length > 0 ? (
                                                <ProductImage productId={item.images[0].id} />
                                            ) : (
                                                <span>No image</span>
                                            )}
                                        </div>

                                    </Link>
                                </div>
                                <div className="text-center">{item.productName}</div>
                                <div className="text-center">{item.productBrand}</div>
                                <div className="text-center">
                                    ₹{item.productPrice?.toFixed(2)}
                                </div>
                                <div className="text-center"><QuantityUpdater
                                    quantity={item.quantity}

                                    onIncrease={() => handleIncreaseQuantity(item.productId)}
                                    onDecrease={() => handleDecreaseQuantity(item.productId)}

                                />
                                </div>
                                <div className="text-center">
                                    ₹{item.totalPrice?.toFixed(2)}
                                </div>
                                <div >
                                    <Link to={"#"} onClick={() => handleRemoveFromCart(item.productId)}>Remove</Link>
                                </div>
                            </Card.Body>
                        </Card>
                    ))}

                    <div className="cart-footer d-flex align-items-center mt-4">
                        <h4 className="mb-0 cart-title">
                            Total Cart Amount: ${cart.totalAmount?.toFixed(2)}

                        </h4>
                        <div className="ms-auto checkout-links">
                            <Link to="/products">Continue Shopping</Link>
                            <Link to="#" onClick={handlePlaceOrder}>Proceed to Checkout</Link>
                        </div>
                    </div>
                </div>}
        </div>
    )
}

export default Cart
