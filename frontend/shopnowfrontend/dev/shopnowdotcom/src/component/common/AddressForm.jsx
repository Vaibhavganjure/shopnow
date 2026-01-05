import React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCountryNames } from '../../store/features/userSlice'
import { Col, Row, Form } from 'react-bootstrap';
import { FaCheck, FaTimes } from 'react-icons/fa';


function AddressForm({ address, onChange, onSubmit, isEditing, onCancel, showButtons, showCheck, showTitle }) {

    const dispatch = useDispatch();
    const [countries, setCountries] = useState([])

    useEffect(() => {
        const fetchCountries = async () => {
            const response = await dispatch(getCountryNames()).unwrap();
            setCountries(response);
        }
        fetchCountries();

    }, [dispatch]);
    // console.log("countries",countries)

    return (
        <div className='p-4 m-4 border'>
            {showTitle && <h5>{isEditing ? "Edit Address" : "Add New Address"}</h5>
            }
            <Form.Group >
                <Form.Label>Street:</Form.Label>
                <Form.Control
                    type="text"
                    name="street"
                    value={address.street}
                    onChange={onChange}
                    required
                />
            </Form.Group>

            <Form.Group >
                <Form.Label>City:</Form.Label>
                <Form.Control
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={onChange}
                    required
                />
            </Form.Group>

            <Form.Group >
                <Form.Label>State/Province:</Form.Label>
                <Form.Control
                    type="text"
                    name="state"
                    value={address.state}
                    onChange={onChange}
                    required
                />
            </Form.Group>

            <Form.Group >
                <Form.Label>Address Type:</Form.Label>
                <Form.Control
                    as="select"
                    name="addressType"
                    value={address.addressType}
                    onChange={onChange}
                    required
                >
                    <option value="HOME">Home</option>
                    <option value="OFFICE">Office</option>
                    <option value="SHIPPING">Shipping</option>
                </Form.Control>
            </Form.Group>

            <Row>
                <Col md={4}>
                    <Form.Group>
                        <Form.Label>Country:</Form.Label>
                        <select
                            className="form-control"
                            name="country"
                            value={address.country}
                            onChange={onChange}
                            required
                        >
                            <option value="">Select a country</option>
                            {countries.map((country,index) => (
                                <option key={index} value={country.code}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group>
                        <Form.Label>Contact:</Form.Label>
                        <Form.Control
                            type="number"
                            name="contact"
                            value={address.contact}
                            onChange={onChange}
                            required
                        />
                    </Form.Group>
                </Col>
            </Row>


            {showButtons && (
                <div className='d-flex gap-4 mt-3'>
                    {showCheck && (
                        <div onClick={onSubmit} style={{ cursor: "pointer", color: "green" }}>
                            <FaCheck
                                size={24}
                                title={isEditing ? "Update Address" : "Add Address"}
                            />
                        </div>
                    )
                    }


                    <div onClick={onCancel} style={{ cursor: "pointer", color: "red" }}>
                        <FaTimes size={24} title="Cancel" />
                    </div>
                </div>
            )}


        </div>
    )
}





export default AddressForm
