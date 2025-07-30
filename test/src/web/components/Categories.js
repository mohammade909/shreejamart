import React from "react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { useSelector } from "react-redux";

export const getCategoryIcon = (categoryName, size = 'text-4xl') => {
  const iconMap = {
    "Fruits & Vegetables": <i className="fi fi-rs-grape" />,
    "Groceries & Staples": <i className="fi fi-ts-grocery-bag" />,
    "Dairy Products": <i className="fi fi-ts-milk-bottle" />,
    "Personal Care": <i className="fi fi-ts-hr-person" />,
    "Fresh Vegetables": <i className="fi fi-ts-carrot" />,
    "Spices & Masalas": <i className="fi fi-ts-pepper" />,
    "Household Supplies": <i className="fi fi-ts-cleaning-bottle" />,
    "Organic Products": <i className="fi fi-ts-leaf" />,
    "Rice & Grains": <i className="fi fi-ts-wheat" />,
    "Meat & Seafood": <i className="fi fi-ts-fish" />,
    "Fresh Fruits": <i className="fi fi-tr-apple-crate" />,
    "Beverages": <i className="fi fi-ts-coffee-pot" />,
    "Milk": <i className="fi fi-ts-milk" />,
    "Cheese": <i className="fi fi-ts-cheese" />,
    "Bakery & Snacks": <i className="fi fi-ts-bread" />,
    "Cookies": <i className="fi fi-ts-cookie-bite" />,
    "Dried Fruit": <i className="fi fi-ts-peanut" />,
  };
  // Get the corresponding icon or return the default one
  const IconComponent = iconMap[categoryName] || (
    <i className="fi fi-ts-grape" />
  );
  // Return the icon with additional styling if needed
  return React.cloneElement(IconComponent, {
    className: `${IconComponent.props.className} ${size} text-secondary`,
  });
};

const CategoryCard = ({ icon: Icon, title, items, discount, bgColor }) => (
 
  <div className={`${bgColor} border p-5 rounded-lg `}>
    <div
      className={`relative p-6 rounded-xl  bg-white shadow-sm hover:shadow-lg transition-shadow `}
    >
      {discount && (
        <span className="absolute top-4 right-4 bg-secondary text-white text-sm font-medium px-2 py-1 rounded-md">
          {discount}%
        </span>
      )}
      <div className="flex flex-col items-center space-y-2">
        <div className="text-green-500 w-12 h-12">{Icon}</div>
        <h3 className="text-gray-700 font-semibold text-base">{title.split(' ')[0]}</h3>
        <p className="text-gray-400 text-xs">{items} Items</p>
      </div>
    </div>
  </div>

);

const bgColors = [
  "bg-orange-50/50 bg-gradient-to-t from-white to-orange-50",
  "bg-indigo-50/50 bg-gradient-to-t from-white to-indigo-50",
  "bg-teal-50/50 bg-gradient-to-t from-white to-teal-50",
  "bg-pink-50/50 bg-gradient-to-t from-white to-pink-50",
  "bg-purple-50/50 bg-gradient-to-t from-white to-purple-50",
  "bg-yellow-50/50 bg-gradient-to-t from-white to-yellow-50",
  "bg-green-50/50 bg-gradient-to-t from-white to-green-50",
];
const Categories = () => {
  const { categories } = useSelector((state) => state.categories);

  const categoryList = categories.map((category) => {
    const randomBgColor = bgColors[Math.floor(Math.random() * bgColors.length)]; 

    return {
      icon: getCategoryIcon(category.name),
      name: category.name,
      items: category.items || 89,
      discount: category.discount || 10,
      bgColor: randomBgColor, 
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 my-14 ">
      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={40}
        slidesPerView={1}
        loop={true}
        grabCursor={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        breakpoints={{
          550: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 30,
          },

          992: {
            slidesPerView: 5,
            spaceBetween: 40,
          },
        }}
        className="category-swiper"
      >
        {categoryList.map((category, index) => (
          <SwiperSlide key={index}>
            <CategoryCard
              icon={category.icon}
              title={category.name}
              items={category.items}
              discount={category.discount}
              bgColor={category.bgColor}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Categories;
