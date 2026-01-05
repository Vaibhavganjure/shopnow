import React, { use } from 'react'
import { getCountryNames, registerUser } from '../../store/features/userSlice'
import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { Col, Container, Form, Row, Button } from 'react-bootstrap'
import { toast, ToastContainer } from 'react-toastify'
import { Link } from 'react-router-dom'
import AddressForm from '../common/AddressForm'

const UserRegistration = () => {
  const dispatch = useDispatch();
  const [countries, setCountries] = useState([])
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    addressList: [
      {
        country: "",
        state: "",
        city: "",
        street: "",
        addressType: "",
        contact: ""
      }
    ]
  });

  const [addresses, setAddresses] = useState([
    {
      country: "",
      state: "",
      city: "",
      street: "",
      addressType: "HOME",
      contact: ""
    }
  ]);


  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };


  const handleAddressChange = (index, e) => {
    const { name, value } = e.target;
    const updatedAddresses = [...addresses];
    updatedAddresses[index] = { ...updatedAddresses[index], [name]: value, };
    setAddresses(updatedAddresses);
  };

  const addAddress = () => {
    setAddresses([
      ...addresses,
      {
        country: "",
        state: "",
        city: "",
        street: "",
        addressType: "HOME",
        contact: ""
      }
    ]);
  };

  const removeAddress = (index) => {
    const updatedAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(updatedAddresses);
  };

  useEffect(() => {
    const fetchCountries = async () => {
      const response = await dispatch(getCountryNames()).unwrap();
      setCountries(response.sort((a, b) => a.localeCompare(b)));
    }
    fetchCountries();

  }, [dispatch]);

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(registerUser({ user, addresses })).unwrap();
      resetForm()
      toast.success("Registration successful!");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    }
  };

  const resetForm = () => {
    setUser({ firstName: "", lastName: "", email: "", password: "" });

    setAddresses([
      {
        country: "",
        state: "",
        city: "",
        street: "",
        addressType: "HOME",
        contact: ""
      }
    ]);
  };


  return (
    <Container className="d-flex justify-content-center align-items-center mt-5 mb-5">
      <ToastContainer />
      <Form
        className="border p-4 rounded shadow"
        style={{ width: "100%", maxWidth: "600px" }}
      >
        <h3 className="mb-4 text-center">User Registration</h3>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="firstName">
              <Form.Label>First Name:</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={user.firstName}
                onChange={handleUserChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="lastName">
              <Form.Label>Last Name:</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={user.lastName}
                onChange={handleUserChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId="email">
          <Form.Label>Email:</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={user.email}
            onChange={handleUserChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            className='form-control'
            type="password"
            name="password"
            value={user.password}
            onChange={handleUserChange}
            required
          />
        </Form.Group>
        <h4 className='mt-4'>Addresses</h4>
        {addresses.map((address, index) => (
          <div key={index} className="border p-3 mb-3 rounded">
            <h4>Address {index+1}</h4>
            <AddressForm
              address={address}
              onChange={(e) => handleAddressChange(index, e)}
              onCancel={() => removeAddress(index)}
              showButtons={true}
            />
          </div>
        ))}
        <div className='d-flex gap-4 mb-2 mt-2'>
          <Button variant='primary' onClick={addAddress} size='sm'>
            Add Address
          </Button>

          <Button variant='success' type='submit' size='sm' onClick={handleRegistration}>
            Register
          </Button>
        </div>

        <div className='text-center mt-4 mb-4'>
          Already have an account?{" "}
          <Link to={"/login"} style={{ textDecoration: "none" }}>Login here</Link>
        </div>
      </Form>
    </Container>
  )
}

export default UserRegistration
