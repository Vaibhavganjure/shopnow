import React, { useEffect, useState } from 'react'
import Hero from '../hero/Hero'
import Paginator from '../common/Paginator';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProductImage from '../utils/ProductImage';
import { toast, ToastContainer } from "react-toastify";
import { useSelector,useDispatch } from 'react-redux';
import { setTotalItems } from '../../store/features/paginationSlice'
import { getdistinctProducts } from '../../store/features/productSlice';
import LoadSpinner from '../common/LoadSpinner'
import StockStatus from '../utils/StockStatus';


const Home = () => {
    const dispatch=useDispatch()
    const {distinctProducts} = useSelector((state)=>state.product);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const { searchQuery, selectedCategory,imageSearchResults } = useSelector((state) => state.search)
    const { itemsPerPage, currentPage } = useSelector((state) => state.pagination)
    const isLoading = useSelector((state) => state.product.isLoading)

    useEffect(() => {
        dispatch(getdistinctProducts());
       
    }, [dispatch]);

    useEffect(() => {
        dispatch(setTotalItems(filteredProducts.length));
    }, [filteredProducts, dispatch])


    useEffect(() => {
        const results = distinctProducts.filter((product) => {
            const matchesQuery = product.name.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCategory = selectedCategory === "all" || product.category.name.toLowerCase().includes(selectedCategory.toLowerCase())
            const matchesImageSearch = imageSearchResults.length > 0 ? imageSearchResults.some((result)=>product.toLowerCase().includes(result.name.toLowerCase())):true;
            return matchesQuery && matchesCategory && matchesImageSearch;
        })
        setFilteredProducts(results);
    }, [searchQuery, selectedCategory,distinctProducts,imageSearchResults])

    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;

    const currentProducts = filteredProducts.slice(
        indexOfFirstProduct,
        indexOfLastProduct
    );
    if (isLoading) {
        return (
            <div>
                <LoadSpinner />
            </div>
        )
    }

    return (
        <>
            <Hero />
            <div className='d-flex flex-wrap justify-content-center p-5'>
                <ToastContainer />

                {
                    currentProducts &&
                    currentProducts.map((product) => (
                        <Card key={product.id} className="home-product-card">
                            <Link to={`products/${product.name}`} className='link'>
                                <div className='image-container'>{product.images.length > 0 && (<ProductImage productId={product.images[0].id} />)}</div>
                            </Link>
                            <Card.Body>

                                <p className="product-description">
                                    {product.name}- {product.description}
                                </p>

                                <h4 className="price">$: {product.price}</h4>

                               <StockStatus inventory={product.inventory}/>

                                <Link to={`products/${product.name}`} className="shop-now-button">
                                    Buy Now {""}
                                </Link>

                            </Card.Body>

                        </Card>


                    ))}


            </div>
            <Paginator />
        </>
    )
}

export default Home
