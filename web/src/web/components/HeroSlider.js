import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const slides = [
  {
    id: 1,
    image: "/hero-bg/1.jpg", // Ensure this path is correct
    title: "Heading 1",
    subtitle: "Subheading 1",
    description: "This is some content for the first slide.",
  },
  {
    id: 2,
    image: "/hero-bg/2.jpg",
    title: "Heading 2",
    subtitle: "Subheading 2",
    description: "This is some content for the second slide.",
  },
];

const HeroSlider = () => {
  return (
    <div className="my-12 mx-8">
      <Swiper
        spaceBetween={40}
        slidesPerView={1}
        loop={true}
        grabCursor={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        modules={[Autoplay, Navigation]}
        className="swiper w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide className="border-t-2 border-b-2 border-green-200"
            key={slide.id}
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "60vh",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div className="slide-content max-w-4xl p-8  bg-opacity-60 rounded-lg">
              <h2 className="text-gray-800 text-3xl font-bold mb-1">
                {slide.title}
              </h2>
              <h4 className="text-gray-700 text-xl mb-1">{slide.subtitle}</h4>
              <p className="text-gray-700">{slide.description}</p>
              <button className="bg-blue-500 text-white py-2 px-4 rounded mt-6">
                Learn More
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroSlider;
