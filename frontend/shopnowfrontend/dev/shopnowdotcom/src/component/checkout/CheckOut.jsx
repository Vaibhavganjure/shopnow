import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserCart } from '../../store/features/cartSlice';
import { placeOrder, createPaymentIntent } from '../../store/features/orderSlice';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { toast, ToastContainer } from 'react-toastify';
import { Container, FormGroup, Row, Col, Form, Card } from 'react-bootstrap';
import AddressForm from "../common/AddressForm"
import { getCountryNames } from '../../store/features/userSlice';
import { cardElementOptions } from '../utils/CardElementOptions';
import {ClipLoader} from "react-spinners"
import LoadSpinner from '../common/LoadSpinner';



function CheckOut() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { userId } = useParams();
  // console.log("userId",userId)
  const cart = useSelector((state) => state.cart)
  const [countries, setCountries] = useState([]);


  const stripe = useStripe();
  const elements = useElements();

  const [cardError, setCardError] = useState("");
  const [loading, setLoading] = useState(false);


  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [billingAddress, setBillingAddress] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
    contact: "",
    countryCode: ""
  });



  useEffect(() => {
    const fetchCountries = async () => {
      const response = await dispatch(getCountryNames()).unwrap();
      setCountries(response);
    }
    fetchCountries();
  }, [dispatch]);



  const getCountryCode = (countryValue) => {
    if (!countryValue) return '';
    if (countryValue.length === 2) return countryValue; // Already a code
    const found = countries.find(c => c.name === countryValue);
    return found ? found.code : countryValue;
  };



  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserInfo({
      ...userInfo,
      [name]: value
    });
  };

  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    setBillingAddress({
      ...billingAddress,
      [name]: value
    });
  };

  useEffect(() => {
    dispatch(getUserCart(userId))
  }, [dispatch, userId])
  // console.log("user cart ", cart)

  const handlePaymentAndOrder = async (event) => {
    event.preventDefault()
    setLoading(true)

    if (!stripe || !elements) {
      toast.error("Payment system loading...");
      setLoading(false);
      return;
    }

    if (!cart || !cart.totalAmount) {
      toast.error("Cart is empty or invalid");
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement)

    try {
      console.log("Creating payment intent with:", { amount: cart.totalAmount, currency: "usd" });

      // Dispatch and get the response
      const paymentIntentResponse = await dispatch(
        createPaymentIntent({
          amount: cart.totalAmount,
          currency: "usd"
        })
      ).unwrap();

      console.log("Payment intent response:", paymentIntentResponse);

      // Get clientSecret from response
      const clientSecret = paymentIntentResponse.clientSecret || paymentIntentResponse.client_secret;

      if (!clientSecret) {
        console.error("No client secret in response:", paymentIntentResponse);
        toast.error("Failed to initialize payment");
        return;
      }

      console.log("Confirming payment...");
      console.log("Billing address:", billingAddress);
      console.log("Country value:", billingAddress.country);
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: `${userInfo.firstName} ${userInfo.lastName}`,
              email: userInfo.email,
              address: {
                line1: billingAddress.street,
                city: billingAddress.city,
                state: billingAddress.state,
                country: getCountryCode(billingAddress.country),
              },
            },
          },
        }
      );

      if (error) {
        console.error("Stripe error:", error);
        toast.error(error.message);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        console.log("Payment succeeded, placing order...");
        await dispatch(placeOrder({ userId })).unwrap();
        toast.success("Payment successful! Your order has been placed.");
        setTimeout(() => {
          window.location.href=`/user-profile/${userId}/profile`
        }, 2000);
      }

    } catch (error) {
      console.error('Payment error:', error);
      toast.error("Error processing payment: " + (error?.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container className='mt-5 mb-5'>
      <ToastContainer />
      <div className='d-flex justify-content-center'>
        <Row>
          <Col md={8}>
            <Form className='p-4 border rounded shadow-sm'>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <label htmlFor='firstName' className='form-label'>
                      Firstname
                    </label>
                    <input
                      type='text'
                      className='form-control mb-2'
                      id='firstName'
                      name='firstName'
                      value={userInfo.firstName}
                      onChange={(e) => handleInputChange(e)}
                    />
                  </FormGroup>
                </Col>

                <Col md={6}>
                  <FormGroup>
                    <label htmlFor='lastName' className='form-label'>
                      Lastname
                    </label>
                    <input
                      type='text'
                      className='form-control mb-2'
                      id='lastName'
                      name='lastName'
                      value={userInfo.lastName}
                      onChange={(e) => handleInputChange(e)}
                    />
                  </FormGroup>
                </Col>
              </Row>

              <FormGroup>
                <label htmlFor='email' className='form-label'>
                  Email
                </label>
                <input
                  type='email'
                  className='form-control mb-2'
                  id='email'
                  name='email'
                  value={userInfo.email}
                  onChange={handleInputChange}
                />
              </FormGroup>

              <div>
                <h6>Enter Billing Address</h6>
                <AddressForm
                  onChange={handleAddressChange}
                  address={billingAddress}
                />
              </div>

              <div className='form-group'>
                <label htmlFor='card-element' className='form-label'>
                  <h6>Credit or Debit Card</h6>
                </label>
                <div id='card-element' className='form-control'>
                  <CardElement options={cardElementOptions}
                    onChange={(e) => { setCardError(e.error ? e.error.message : "") }}

                  />
                  {cardError && <div className='text-danger'>{cardError}</div>}
                </div>
              </div>
            </Form>
          </Col>

          <Col md={4}>
            <h6 className='mt-4 text-center cart-title'>Your Order Summary</h6>
            <hr />

            <Card style={{ backgroundColor: "whiteSmoke" }}>
              <Card.Body>
                <Card.Title className='mb-2 text-muted text-success'>
                  Total Amount : ${cart.totalAmount.toFixed(2)}
                </Card.Title>
              </Card.Body>

              <button
                type='button'
                className='btn btn-warning mt-3'
                disabled={!stripe}
                onClick={(e) => handlePaymentAndOrder(e)}>
                  {loading ? <ClipLoader size={20} color={"/123abc"}/>:"Pay Now"}
                 
              </button>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  )
}

export default CheckOut
