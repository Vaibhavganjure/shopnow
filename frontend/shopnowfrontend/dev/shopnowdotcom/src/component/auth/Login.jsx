import React, { use, useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import { login } from '../../store/features/authSlice'
import { Button, Card, Col, Container, InputGroup, Row, Form } from 'react-bootstrap'
import { BsPersonFill, BsLockFill } from 'react-icons/bs'

const Login = () => {

    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const from = location.state?.from?.pathname || "/";
    const [errorMessage, setErrorMessage] = useState(null);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
            window.location.reload();
        }
    }, [isAuthenticated, navigate, from]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prevstate) => ({
            ...prevstate,
            [name]: value,
        }));
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!credentials.email && !credentials.password) {
            toast.error("Please fill Username and password");
            setErrorMessage("Please fill Username and password");
            return
        }
        try {
            await dispatch(login(credentials)).unwrap();
            toast.success("Login successful!");
            clearForm();
        } catch (error) {
            toast.error("Login failed. Please check your credentials.");
        }
    };

    const clearForm = () => {
        setCredentials({
            email: "",
            password: "",
        });
    }


    return (
        <Container className='mt-5 mb-5'>
            <ToastContainer />
            <Row className='justify-content-center'>
                <Col xs={12} sm={8} md={8} lg={6} xl={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title className='text-center mb-4'>Login</Card.Title>
                            <Form onSubmit={handleLogin}>
                                <Form.Group className="mb-3" controlId="username">
                                    <Form.Label>Email address</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <BsPersonFill />
                                        </InputGroup.Text>

                                        <Form.Control
                                            type="text"
                                            name="email"
                                            value={credentials.email}
                                            onChange={handleInputChange}
                                            placeholder="Enter email"
                                            isInvalid={!!errorMessage}
                                            required
                                        />
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="password">
                                    <Form.Label>Email password</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <BsLockFill />
                                        </InputGroup.Text>

                                        <Form.Control
                                            type="text"
                                            name="password"
                                            value={credentials.password}
                                            onChange={handleInputChange}
                                            placeholder="Enter password"
                                            required
                                            isInvalid={!!errorMessage}
                                        />
                                    </InputGroup>

                                </Form.Group>
                                <Button
                                    variant='outline-primary'
                                    type='submit'
                                    className='w-100'
                                    onClick={handleLogin}>
                                    Login
                                </Button>
                            </Form>
                            <div className='text-center mt-4 mb-4'>
                                Don't have an account yet?{" "}
                                <Link to={"/register"} style={{ textDecoration: "none" }}>Register here</Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

        </Container>
    )

}
export default Login
