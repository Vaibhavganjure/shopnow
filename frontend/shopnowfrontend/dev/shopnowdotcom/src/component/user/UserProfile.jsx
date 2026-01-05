import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getUserByID, updateAddress, addAddress, deleteAddress, setUserAddresses } from '../../store/features/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";
import { getUserOrders } from '../../store/features/orderSlice';
import { Table } from 'react-bootstrap';
import placeholder from '../../assets/images/placeholder.jpg';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import AddressForm from '../common/AddressForm';
import { toast, ToastContainer } from 'react-toastify';
import LoadSpinner from '../common/LoadSpinner';


const UserProfile = () => {
    const { userId } = useParams();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const loading = useSelector((state) => state.order.loading);
    const orders = useSelector((state) => state.order.orders);


    const [isEditing, setIsEditing] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [newAddress, setNewAddress] = useState({
        addressType: "HOME",
        street: "",
        city: "",
        state: "",
        country: "",
        contact: "",
    });

    if(loading){
      return(
        <div>
          <LoadSpinner/>
        </div>
      )
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAddress((prevAddress) => ({
            ...prevAddress,
            [name]: value,
        }));
    };

    const handleEditClick = (address) => {
        setNewAddress({
            addressType: address.addressType,
            street: address.street,
            city: address.city,
            state: address.state,
            country: address.country,
            contact: address.contact,
        });
        setIsEditing(true);
        setEditingAddressId(address.id);
        setShowForm(true);
    };

    const handleAddAddress = async () => {
        try {
            const response = await dispatch(
                addAddress({ address: newAddress, userId })
            ).unwrap();

            dispatch(setUserAddresses([...user.data.addresses, ...response.data])
            );

            toast.success(response.message);
            resetForm();
        } catch (error) {
            toast.error("Failed to add address");
        }
    };

    const handleUpdateAddress = async (id) => {
        const updatedAddressList = user.data.addresses.map((address) =>
            address.id === id ? { ...newAddress, id } : address
        );

        dispatch(setUserAddresses(updatedAddressList));
        try {
            const response = await dispatch(
                updateAddress({ id, address: newAddress })
            ).unwrap();
            toast.success(response.message);
            resetForm();
        } catch (error) {
            toast.error(error.message);
            dispatch(setUserAddresses(user.data.addresses));
        }
    };

    const handleDeleteAddress = async (id) => {
        if (!id) return;

        // ✅ optimistic UI update
        const updatedAddresses = user.data.addresses.filter(
            (address) => address.id !== id
        );

        dispatch(setUserAddresses(updatedAddresses));

        try {
            await dispatch(deleteAddress({ id })).unwrap();
            toast.success("Address deleted successfully");
        } catch (error) {
            // ❌ rollback if delete fails
            dispatch(setUserAddresses(user.data.addresses));
            toast.error("Delete failed");
        }
    };



    const resetForm = () => {
        setNewAddress({
            addressType: "HOME",
            street: "",
            city: "",
            state: "",
            country: "",
            contact: ""
        })
        setShowForm(false)
        setIsEditing(false)
        setEditingAddressId(null)
    }

    useEffect(() => {
        const fetchUser = async () => {
            if (userId) {
                try {
                    await dispatch(getUserByID(userId)).unwrap();
                } catch (error) {
                    console.log(error);
                }
            }
        };

        fetchUser();
    }, [dispatch, userId]);

    useEffect(() => {
        const fetchUserOrders = async () => {
            if (userId) {
                try {
                    await dispatch(getUserOrders(userId)).unwrap();
                } catch (error) {
                    console.log(error);
                }
            }
        }
        fetchUserOrders();
    }, [dispatch, userId]);
    


    return (
        <Container className='mt-5 mb-5'>
            <ToastContainer />
            <h2 className='cart-title'>Personal Information</h2>
            <Row>
                <Col md={4}>
                    <Card>
                        <Card.Header>Personal User Information</Card.Header>
                        <Card.Body className='text-center'>
                            <div className='mb-3'>
                                <img
                                    src={user?.data?.photo || placeholder}
                                    alt='"user picture'
                                    style={{ width: "100px", height: "100px" }}
                                    className='image-fluid rounded-circle' />
                            </div>
                            <Card.Text><strong>Full Name:</strong> {user?.data?.firstName} {user?.data?.lastName}</Card.Text>
                            <Card.Text><strong>Email:</strong> {user?.data?.email}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8}>
                    <Card className='mb-4'>
                        <Card.Header>User Addresses</Card.Header>
                        <ListGroup variant='flush'>
                            {user?.data?.addresses && user.data.addresses.length > 0 ? (
                                user.data.addresses.map((address, index) => (
                                    <ListGroup.Item key={address.id ?? index}>

                                        <Card className='p-2 mb-2 shadow'>
                                            <Card.Body>
                                                <Card.Text>
                                                    {" "}
                                                    {address.addressType} ADDRESS :{" "}
                                                </Card.Text>
                                                <hr />

                                                <Card.Text>
                                                    {address.street}, {address.city},{" "}
                                                    {address.state}, {address.country}
                                                </Card.Text>
                                            </Card.Body>

                                            <div className='d-flex gap-4'>
                                                <span
                                                    className='text-danger'
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => handleDeleteAddress(address.id)}
                                                >
                                                    <FaTrash />
                                                </span>


                                                <Link variant='primary'>
                                                    <span className='text-info'
                                                        onClick={() => handleEditClick(address)}>
                                                        <FaEdit />
                                                    </span>
                                                </Link>
                                            </div>

                                        </Card>

                                    </ListGroup.Item>
                                ))
                            ) : (<p>No address found</p>)}
                        </ListGroup>
                        <Link className='mb-2 ms-2' variant='success'>
                            <FaPlus onClick={() => {
                                setShowForm(true)
                                setIsEditing(false)
                            }
                            } />
                        </Link>


                        {showForm && (
                            <AddressForm
                                address={newAddress}
                                onChange={handleInputChange}
                                onSubmit={isEditing ? () => handleUpdateAddress(editingAddressId) : handleAddAddress}
                                onCancel={resetForm}
                                showButtons={showForm}
                                showCheck={showForm}
                                showTitle={showForm}
                            />

                        )}

                    </Card>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>Orders History</Card.Header>

                        <Container className="mt-5">
                            {Array.isArray(orders) && orders.length === 0 ? (
                                <p>No orders found at the moment.</p>
                            ) : (
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Date</th>
                                            <th>Total Amount</th>
                                            <th>Status</th>
                                            <th>Items</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {Array.isArray(orders) &&
                                            orders.map((order, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{order.id}</td>
                                                        <td>
                                                            {new Date(
                                                                order.orderDate
                                                            ).toLocaleDateString()}
                                                        </td>
                                                        <td>{order.totalAmount?.toFixed(2)}</td>
                                                        <td>{order.status}</td>
                                                        <td>
                                                            <Table size="sm" striped bordered hover>
                                                                <thead>
                                                                    <tr>
                                                                        <th>Item ID</th>
                                                                        <th>Name</th>
                                                                        <th>Brand</th>
                                                                        <th>Quantity</th>
                                                                        <th>Unit Price</th>
                                                                        <th>Total Price</th>
                                                                    </tr>
                                                                </thead>

                                                                <tbody>
                                                                    {Array.isArray(order.orderItems) &&
                                                                        order.orderItems.map((item, itemIndex) => (
                                                                            <tr key={itemIndex}>
                                                                                <td>{item.productId}</td>
                                                                                <td>{item.productName}</td>
                                                                                <td>{item.productBrand}</td>
                                                                                <td>{item.quantity}</td>
                                                                                <td>{item.price.toFixed(2)}</td>
                                                                                <td>
                                                                                    {(item.quantity * item.price).toFixed(2)}
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                </tbody>
                                                            </Table>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                    </tbody>
                                </Table>
                            )}

                            <div className="mb-2">
                                <Link to="/products">Start Shopping</Link>
                            </div>
                        </Container>
                    </Card>
                </Col>
            </Row>

        </Container >
    );
};

export default UserProfile
