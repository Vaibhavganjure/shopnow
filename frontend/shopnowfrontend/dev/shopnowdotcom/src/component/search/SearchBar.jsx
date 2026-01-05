import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { getAllCategories } from '../../store/features/categorySlice';
import { setSearchQuery, setSelectedCategory, clearFilters } from '../../store/features/searchSlice';
import { useNavigate, useParams } from 'react-router-dom';
import searchIcon from "../../assets/images/upload.jpg"
import ImageSearch from './ImageSearch';

function SearchBar() {
    const categories = useSelector((state) => state.category.categories);
    const dispatch = useDispatch();
    const { searchQuery, selectedCategory } = useSelector((state) => state.search);
    const { categoryId } = useParams()
    const [showImageSearch, setShowImageSearch] = useState(false)
    // const navigate=useNavigate()
    const handleCategoryChange = (e) => {
        dispatch(setSelectedCategory(e.target.value))
    }

    const handleClearFilters = () => {
        dispatch(clearFilters())
        setShowImageSearch(false)
        // navigate("/products")
    }
    const handleSearchQueryChange = (e) => {
        dispatch(setSearchQuery(e.target.value))
    }

    useEffect(() => {
        if (categoryId && categories.length > 0) {
            const selectedCategory = categories.find((category) => category.id === parseInt(categoryId, 10))
            if (selectedCategory) {
                dispatch(setSelectedCategory(selectedCategory.name))
            } else {
                dispatch(selectedCategory("all"))
            }
        }
    }, [categoryId, categories, dispatch])

    useEffect(() => {
        dispatch(getAllCategories());
    }, [dispatch])



    return (
        <>
            <div className="search-bar input-group input-group-sm">

                <select value={selectedCategory} onChange={handleCategoryChange} className="form-control-sm">
                    <option value="all">All Category</option>
                    {categories.map((category, index) => (
                        <option key={index} value={category.name}>{category.name}</option>
                    ))}
                </select>

                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchQueryChange}
                    className="form-control"
                    placeholder="search for product(e.g. watch...)"
                />
                <img
                    src={searchIcon}
                    alt="Image Search"
                    className='search-image-icon'
                    onClick={() => setShowImageSearch((prev) => !prev)} />

                <button className="search-button" onClick={handleClearFilters}>
                    Clear Filter
                </button>

            </div>
            {showImageSearch && <ImageSearch />}
        </>
    )
}

export default SearchBar
