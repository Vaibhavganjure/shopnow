import React from 'react'
import ProductCard from './ProductCard'
import SearchBar from '../search/SearchBar'
import { getAllProducts, getProductsByCategory } from '../../store/features/productSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import Paginator from "../common/Paginator";
import { setTotalItems, setCurrentPage } from '../../store/features/paginationSlice'
import SideBar from '../common/SideBar'
import { setInitialSearchQuery } from '../../store/features/searchSlice'
import { useLocation, useParams } from 'react-router-dom'
import LoadSpinner from '../common/LoadSpinner'


const Products = () => {

    const dispatch = useDispatch();
    const { products, selectedBrands } = useSelector((state) => state.product)
    const [filteredProducts, setFilteredProducts] = useState([]);
    const { searchQuery, selectedCategory, imageSearchResults } = useSelector((state) => state.search)
    const { itemsPerPage, currentPage } = useSelector((state) => state.pagination)
    const isLoading = useSelector((state) => state.product.isLoading)
    const { name, categoryId } = useParams()
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search)
    const initialSearchQuery = queryParams.get("search") || name || "";


    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = filteredProducts.slice(
        indexOfFirstProduct,
        indexOfLastProduct
    );



    useEffect(() => {
        if (categoryId) {
            dispatch(getProductsByCategory(categoryId))
            // console.log(products)
        } else {
            dispatch(getAllProducts())
        }
    }, [categoryId, dispatch])


    useEffect(() => {

        if (!products || products.length === 0) return; // wait for fetch

        const results = products.filter((product) => {
            const matchesQuery = product.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory =
                selectedCategory === "all" ||
                product.category.name.toLowerCase().includes(selectedCategory.toLowerCase());
            const matchesBrand =
                selectedBrands.length === 0 ||
                selectedBrands.some((brand) => product.brand.toLowerCase().includes(brand.toLowerCase()));

            const matchesImageSearch = imageSearchResults.length > 0 ? imageSearchResults.some((result)=>product.toLowerCase().includes(result.name.toLowerCase())):true;
            return matchesQuery && matchesCategory && matchesBrand && matchesImageSearch;
        });

        setFilteredProducts(results);

    }, [products, searchQuery, selectedCategory, selectedBrands,imageSearchResults]);

    useEffect(() => {
        dispatch(setCurrentPage(1));
    }, [name, categoryId, dispatch]);

    useEffect(() => {
        dispatch(setInitialSearchQuery(initialSearchQuery))
    }, [initialSearchQuery, dispatch])

    useEffect(() => {
        dispatch(setTotalItems(filteredProducts.length));
    }, [filteredProducts, dispatch])


    if (isLoading) {
        return (
            <div>
                <LoadSpinner />
            </div>
        )
    }
    return (
        <>
            <div className='d-flex justify-content-center'>
                <div className='col-md-6 mt-2'>
                    <div className='search-bar input-group'>
                        <SearchBar />
                    </div>
                </div>
            </div>

            <div className='d-flex'>
                <aside className='sidebar' style={{ width: "250px", padding: "1rem" }}>
                    <search> <SideBar /></search>
                </aside>

                <section style={{ flex: 1 }}>
                    <ProductCard products={currentProducts} />

                </section>
            </div>
            <Paginator />
        </>
    )
}

export default Products
