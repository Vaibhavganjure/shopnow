import React, { useEffect } from "react";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap"
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getUserCart } from "../../store/features/cartSlice";
import { logoutUser } from "../services/authService";
import { useNavigate } from "react-router-dom";


const MyNavBar = () => {

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart)
  const userId = localStorage.getItem("userId");
  const userRoles = useSelector((state) => state.auth.roles);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/");

  }

  useEffect(() => {
    () => {
      if (userId) {
        dispatch(getUserCart(userId));
      }
    }

  }, [dispatch, userId]);

  return (
    <Navbar expand="lg" sticky="top" className="nav-bg">
      <Container>

        {/* Brand */}
        <Navbar.Brand as={Link} to="/">
          <span className="shop-home">ShopNow.com</span>
        </Navbar.Brand>

        {/* Mobile Toggle */}
        <Navbar.Toggle />

        <Navbar.Collapse>

          {/* LEFT MENU */}
          <Nav className="me-auto">
            <Nav.Link to={"/products"} as={Link}>
              All Products
            </Nav.Link>
          </Nav>

          {userRoles.includes("ROLE_ADMIN") && (
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/add-product">
                Manage Shop
              </Nav.Link>
            </Nav>
          )}


          {/* RIGHT MENU */}
          <Nav className="ms-auto">
            <NavDropdown title="Account">
              {userId ? (
                <>
                  <NavDropdown.Item as={Link} to={`/my-account/${userId}`}>
                    My Account
                  </NavDropdown.Item>

                  

                  <NavDropdown.Divider />

                  <NavDropdown.Item as={Link} to={"/logout"} onClick={handleLogout}>
                    Logout
                  </NavDropdown.Item>
                </>) : (
                <>

                  <NavDropdown.Item as={Link} to={"/login"}>
                    Login
                  </NavDropdown.Item>

                  <NavDropdown.Item as={Link} to="/register">
                    Register
                  </NavDropdown.Item>

                </>
              )
              }

            </NavDropdown>

            {userId && (
              <Link to={`user/${userId}/my-cart`} className="nav-link me-1 position-relative">
                <FaShoppingCart className="shopping-cart-icon" />

                {
                  cart.items.length > 0 ? (<div className="badge-overlay">{cart.items.length}</div>)
                    : (<div className="badge-overlay">0</div>)
                }

              </Link>
            )}
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
export default MyNavBar
