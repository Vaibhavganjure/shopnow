import React ,{useEffect,useState} from 'react'
import ImageZoom from "react-medium-image-zoom"
import "react-medium-image-zoom/dist/styles.css"

function ImageZoomify({ productId }) {
    const [productImg, setProductImg] = useState(null);

    useEffect(() => {
        const fetchProductImage = async (id) => {
            // const BASE_URL = "http://localhost:9090/api/v1"
            try {
                const response = await fetch(
                    // `http://shopnowdbdeployment-env.eba-urmrin7p.ap-south-1.elasticbeanstalk.com/api/v1/images/image/download/${id}`
                    `http://localhost:9090/api/v1/images/image/download/${id}`
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

    if (!productImg) return null;
    return (
        <div>
            <ImageZoom>
                <img src={productImg} alt='Product Image' className='resized-image' />
            </ImageZoom>

        </div>
    )
}

export default ImageZoomify
