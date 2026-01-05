import React, { useState,useEffect} from 'react'

const ProductImage = ({ productId }) => {
    const [productImg, setProductImg] = useState(null);

    useEffect(() => {
        const fetchProductImage = async (id) => {
            try {
                
                const response = await fetch(
                    // `http://shopnowdbdeployment-env.eba-urmrin7p.ap-south-1.elasticbeanstalk.com/api/v1/images/image/download/${id}`
                    `
                    http://localhost:9090/api/v1/images/image/download/${id}`
                    
                );

                const blob = await response.blob();
                const reader = new FileReader();
                reader.readAsDataURL(blob);

                reader.onloadend = () => {
                    setProductImg(reader.result);
                };

                

            } catch (error) {
                console.error("Error fetching image:", error);
            }
        };

        if (productId) {
            fetchProductImage(productId);
        }
    }, [productId]);



    return (
        <div>
            <img src={productImg} alt='Product Image'></img>
        </div>
    )
}

export default ProductImage
