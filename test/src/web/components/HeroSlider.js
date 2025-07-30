import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Import Swiper styles

const HeroSlider = () => {
  return (
    <div className="swiper-container my-12">
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        loop
      >
        {/* Slide 1 */}
        <SwiperSlide
          style={{
            backgroundImage: "url(./hero-bg/1.jpg)", // Replace with your image URL
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "60vh", // Set the height of the slide
          }}
        >
          <div className="slide-content px-8 py-20 text-start ">
            <h2 className="text-primary text-4xl font-extrabold leading-tight mb-4 drop-shadow-lg">
              Heading 1
            </h2>
            <h4 className="text-primary text-xl font-medium mb-6 drop-shadow-md">
              Subheading 1
            </h4>
            <p className="text-primary text-lg mb-6 leading-relaxed max-w-2xl  drop-shadow-md">
              This is some content for the first slide.
            </p>
            <button className="bg-secondary text-white py-2 px-6 rounded-lg shadow-md hover:bg-primary-dark transition duration-300">
              Learn More
            </button>
          </div>
        </SwiperSlide>

        {/* Slide 2 */}
        <SwiperSlide
          style={{
            backgroundImage: "url(./hero-bg/2.jpg)", // Replace with your image URL
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "60vh", // Set the height of the slide
          }}
        >
          <div className="slide-content text-center p-8">
            <h2 className="text-white text-3xl font-bold">Heading 2</h2>
            <h4 className="text-white text-xl">Subheading 2</h4>
            <p className="text-white">
              This is some content for the second slide.
            </p>
            <button className="bg-blue-500 text-white py-2 px-4 rounded">
              Learn More
            </button>
          </div>
        </SwiperSlide>

        {/* Slide 3 */}
        <SwiperSlide
          style={{
            backgroundImage: "url(https://via.placeholder.com/800x400)", // Replace with your image URL
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "60vh", // Set the height of the slide
          }}
        >
          <div className="slide-content text-center p-8">
            <h2 className="text-white text-3xl font-bold">Heading 3</h2>
            <h4 className="text-white text-xl">Subheading 3</h4>
            <p className="text-white">
              This is some content for the third slide.
            </p>
            <button className="bg-blue-500 text-white py-2 px-4 rounded">
              Learn More
            </button>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default HeroSlider;
