import React from 'react'
import { useDispatch, useSelector } from "react-redux"
import { getAllCategories, addCategory } from '../../store/features/categorySlice'
import { useEffect } from 'react'
function CategorySelector({ selectedCategory,
    onCategoryChange,
    newCategory,
    showNewCategoryInput,
    setNewCategory,
    setShowNewCategoryInput }) {

    const dispatch = useDispatch()
    const categories = useSelector((state) => state.category.categories)

    useEffect(() => {
        dispatch(getAllCategories())
        
    }, [dispatch])
// console.log(categories)
    const handleAddNewCategory = () => {
        if (newCategory !== "") {
            dispatch(addCategory(newCategory))
            onCategoryChange(newCategory)
            setNewCategory("")
            setShowNewCategoryInput(false)
        }
    }

    const handleCategoryChange = (e) => {
        if (e.target.value === "New") {
            setShowNewCategoryInput(true)
        } else {
            onCategoryChange(e.target.value)
        }
    }

    const handleNewCategoryChange = (e) => {
        setNewCategory(e.target.value)
    }
    return (
        <div className='mb-3'>
            <label className='form-label'>Category :</label>

            <select
                className='form-select'
                required
                value={selectedCategory}
                onChange={handleCategoryChange}
            >
                <option value="">All Categories</option>
                <option value="New">All New Categories</option>

                {categories.map((category, index) => (
                    <option key={index} value={category.name}>
                        {category.name}
                    </option>
                ))}
            </select>

            {showNewCategoryInput && (
                <div className='input-group'>
                    <input type="text"
                        className='form-control'
                        value={newCategory}
                        placeholder='Enter new Category'
                        onChange={(e) => handleNewCategoryChange(e)}
                    />

                    <button className='btn btn-secondary btn-sm'
                        type="button"
                        onClick={(e) => handleAddNewCategory(e)}>
                        Add Category
                    </button>

                </div>
            )}


        </div>
    )
}
export default CategorySelector