import React, { useState } from 'react'
import { addNewProduct } from '../../store/features/productSlice'
import { useDispatch } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'
import BrandSelector from '../common/BrandSelector'
import CategorySelector from '../common/CategorySelector'
import { Stepper, Step, StepLabel } from "@mui/material"
import ImageUploader from '../common/ImageUploader'
import { getAllProducts } from '../../store/features/productSlice'

function AddProduct() {
    const dispatch = useDispatch()
    const [showNewBrandInput, setShowNewBrandInput] = useState(false)
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false)
    const [newBrand, setNewBrand] = useState("")
    const [newCategory, setNewCategory] = useState("")
    const [activeStep, setActiveStep] = useState(0)
    const steps = ["Add new Product", "Upload Product Image"]
    const [productId, setProductId] = useState(null)
    const [product, setProduct] = React.useState({
        name: "",
        description: "",
        price: "",
        brand: "",
        category:"",
        inventory: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target

        setProduct((prevState) => ({
            ...prevState, [name]: value
        }))
    }

    const handleCategoryChange = (category) => {
        setProduct({ ...product, category:category })
        if (category === "New") {
            setShowNewCategoryInput(true)
        } else {
            setShowNewCategoryInput(false)
        }
    }

    const handleBrandChange = (brand) => {
        setProduct({ ...product, brand })
        if (brand === "New") {
            setShowNewBrandInput(true)
        } else {
            setShowNewBrandInput(false)
        }
    }

    const handleAddNewProduct = async (e) => {
    e.preventDefault()
    try {
        // Transform the product data to match backend expectations
        const productData = {
            ...product,
            category: {
                name: product.category  // Wrap the string in an object
            }
        }
         console.log("Product data being sent:", JSON.stringify(productData, null, 2))
        const result = await dispatch(addNewProduct(productData)).unwrap();

        setProductId(result.id)
        toast.success(result.message)
        resetForm()
        setActiveStep(1)
        dispatch(getAllProducts())

    } catch (error) {
        toast.error(error.message)
    }
}
    const resetForm = () => {
        setProduct({
            name: "",
            description: "",
            price: "",
            brand: "",
            category:"",
            inventory: ""
        })
        setShowNewBrandInput(false)
        setShowNewCategoryInput(false)

    }
    const handlePreviousStep = () => {
        setActiveStep((prevStep) => Math.max(prevStep - 1, 0))
    }

    return (
        <section className='container mt-5 mb-5'>
            <ToastContainer />
            <div className='d-flex justify-content-center'>
                <div className='col-md-6 col-xs-12'>
                    <h4>Add New Product</h4>
                    <Stepper activeStep={activeStep} className='mb-4'>

                        {steps.map((label) => (
                            <Step key={label} label={label}><StepLabel>{label}</StepLabel></Step>
                        ))}

                    </Stepper>
                    <div>
                        {activeStep === 0 && (
                            <form onSubmit={(e) => handleAddNewProduct(e)}>
                                <div className='mb-3'>
                                    <label htmlFor="name" className='form-label'>Name:</label>
                                    <input className='form-control'
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={product.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor="name" className='form-label'>Price:</label>
                                    <input className='form-control'
                                        type="number"
                                        id="price"
                                        name="price"
                                        value={product.price}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor="name" className='form-label'>Inventory:</label>
                                    <input className='form-control'
                                        type="number"
                                        id="inventory"
                                        name="inventory"
                                        value={product.inventory}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className='mb-3'>
                                    <BrandSelector
                                        selectedBrand={product.brand}
                                        onBrandChange={handleBrandChange}
                                        newBrand={newBrand}
                                        showNewBrandInput={showNewBrandInput}
                                        setNewBrand={setNewBrand}
                                        setShowNewBrandInput={setShowNewBrandInput}
                                    />

                                </div>

                                <div className='mb-3'>
                                    <CategorySelector
                                        selectedCategory={product.category}
                                        onCategoryChange={handleCategoryChange}
                                        newCategory={newCategory}
                                        showNewCategoryInput={showNewCategoryInput}
                                        setNewCategory={setNewCategory}
                                        setShowNewCategoryInput={setShowNewCategoryInput}
                                    />


                                </div>

                                <div className='mb-3'>
                                    <label htmlFor="description" className="form-label">Description:</label>
                                    <textarea
                                        className="form-control"
                                        id="description"
                                        name="description"
                                        value={product.description}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                                <button type="submit" className='btn btn-secondary btn-sm' >Save Product</button>
                            </form>
                        )}

                        {activeStep === 1 && (
                            <div className='container'>
                                <ImageUploader productId={productId} />
                                <button className='btn btn-secondary btn-small mt-3' onClick={handlePreviousStep}>Previous</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AddProduct
