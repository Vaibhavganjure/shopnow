import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import bg1 from "../../assets/images/image1.png";
import bg2 from "../../assets/images/image2.png";
import bg3 from "../../assets/images/image3.png";
import bg4 from "../../assets/images/image4.png";

const images=[bg1,bg2,bg3,bg4]

const HeroSlider = () => {
  const settings = {
  infinite: true,
  speed: 1000,
  autoplay: true,
  autoplaySpeed: 5000,
  pauseOnHover: false,
  pauseOnFocus: false,
  pauseOnDotsHover: false
};


  return (
    <Slider {...settings} className="hero-slider">
           {images.map((img, index) => (
        <div key={index} className="slide">
          <img
            src={img}
            alt={`Slide ${index + 1}`}
            className="slide-image"
          />
        </div>
      ))}
    </Slider>
  );
};

export default HeroSlider;
