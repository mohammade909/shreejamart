import React from "react";
import { Link } from "react-router-dom";

const CategorySection = () => {
  return (
    <section
      className="gi-category body-bg py-[40px] max-[767px]:py-[30px] wow fadeInUp"
      data-wow-duration="2s"
    >
      <div className="flex flex-wrap justify-between items-center mx-auto min-[1600px]:max-w-[1600px] min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
        <div className="w-full flex flex-wrap px-[12px] mb-[-15px]">
          <div className="min-[1200px]:w-full basis-auto max-w-full border-content-color">
            <div className="gi-category-block owl-carousel flex">
              <div className="gi-cat-box transition-all duration-[0.3s] ease-in-out p-[15px] rounded-[5px] relative bg-[#fff6ec]">
                <div className="gi-cat-icon h-full p-[15px] flex flex-col items-center justify-center bg-[#fff] relative rounded-[5px] z-[5]">
                  <span className="gi-lbl px-[5px] absolute top-[0] right-[0] bg-[#5caf90] text-[#fff] text-[12px] font-semibold rounded-bl-[5px] rounded-tr-[5px]">
                    30%
                  </span>
                  <i className="fi fi-tr-peach transition-all duration-[0.3s] ease-in-out text-[40px] my-[10px] text-[#5caf90] leading-[0]"></i>
                  <div className="gi-cat-detail text-center">
                    <Link to={'/products'}>
                      <h4 className="gi-cat-title m-[0] text-[15px] leading-[22px] font-semibold text-[#4b5966] capitalize font-manrope">
                        Fruits
                      </h4>
                    </Link>
                    <p className="items m-[0] text-[13px] leading-[28px] text-[#777]">
                      320 Items
                    </p>
                  </div>
                </div>
              </div>
              <div className="gi-cat-box transition-all duration-[0.3s] ease-in-out p-[15px] rounded-[5px] relative bg-[#e2fde2]">
                <div className="gi-cat-icon h-full p-[15px] flex flex-col items-center justify-center bg-[#fff] relative rounded-[5px] z-[5]">
                  <i className="fi fi-tr-bread transition-all duration-[0.3s] ease-in-out text-[40px] my-[10px] text-[#5caf90] leading-[0]"></i>
                  <div className="gi-cat-detail text-center">
                    <a href="shop-left-sidebar-col-3.html">
                      <h4 className="gi-cat-title m-[0] text-[15px] leading-[22px] font-semibold text-[#4b5966] capitalize font-manrope">
                        Bakery
                      </h4>
                    </a>
                    <p className="items m-[0] text-[13px] leading-[28px] text-[#777]">
                      65 Items
                    </p>
                  </div>
                </div>
              </div>
              <div className="gi-cat-box transition-all duration-[0.3s] ease-in-out p-[15px] rounded-[5px] relative bg-[#ffeae9]">
                <div className="gi-cat-icon h-full p-[15px] flex flex-col items-center justify-center bg-[#fff] relative rounded-[5px] z-[5]">
                  <span className="gi-lbl px-[5px] absolute top-[0] right-[0] bg-[#5caf90] text-[#fff] text-[12px] font-semibold rounded-bl-[5px] rounded-tr-[5px]">
                    15%
                  </span>
                  <i className="fi fi-tr-corn transition-all duration-[0.3s] ease-in-out text-[40px] my-[10px] text-[#5caf90] leading-[0]"></i>
                  <div className="gi-cat-detail text-center">
                    <a href="shop-left-sidebar-col-3.html">
                      <h4 className="gi-cat-title m-[0] text-[15px] leading-[22px] font-semibold text-[#4b5966] capitalize font-manrope">
                        Vegetables
                      </h4>
                    </a>
                    <p className="items m-[0] text-[13px] leading-[28px] text-[#777]">
                      548 Items
                    </p>
                  </div>
                </div>
              </div>
              <div className="gi-cat-box transition-all duration-[0.3s] ease-in-out p-[15px] rounded-[5px] relative bg-[#fde1f5]">
                <div className="gi-cat-icon h-full p-[15px] flex flex-col items-center justify-center bg-[#fff] relative rounded-[5px] z-[5]">
                  <span className="gi-lbl px-[5px] absolute top-[0] right-[0] bg-[#5caf90] text-[#fff] text-[12px] font-semibold rounded-bl-[5px] rounded-tr-[5px]">
                    10%
                  </span>
                  <i className="fi fi-tr-coffee-pot transition-all duration-[0.3s] ease-in-out text-[40px] my-[10px] text-[#5caf90] leading-[0]"></i>
                  <div className="gi-cat-detail text-center">
                    <a href="shop-left-sidebar-col-3.html">
                      <h4 className="gi-cat-title m-[0] text-[15px] leading-[22px] font-semibold text-[#4b5966] capitalize font-manrope">
                        Dairy & Milk
                      </h4>
                    </a>
                    <p className="items m-[0] text-[13px] leading-[28px] text-[#777]">
                      48 Items
                    </p>
                  </div>
                </div>
              </div>
              <div className="gi-cat-box transition-all duration-[0.3s] ease-in-out p-[15px] rounded-[5px] relative bg-[#ecf0ff]">
                <div className="gi-cat-icon h-full p-[15px] flex flex-col items-center justify-center bg-[#fff] relative rounded-[5px] z-[5]">
                  <i className="fi fi-tr-french-fries transition-all duration-[0.3s] ease-in-out text-[40px] my-[10px] text-[#5caf90] leading-[0]"></i>
                  <div className="gi-cat-detail text-center">
                    <a href="shop-left-sidebar-col-3.html">
                      <h4 className="gi-cat-title m-[0] text-[15px] leading-[22px] font-semibold text-[#4b5966] capitalize font-manrope">
                        Snack & Spice
                      </h4>
                    </a>
                    <p className="items m-[0] text-[13px] leading-[28px] text-[#777]">
                      59 Items
                    </p>
                  </div>
                </div>
              </div>
              <div className="gi-cat-box transition-all duration-[0.3s] ease-in-out p-[15px] rounded-[5px] relative bg-[#f9f9d9]">
                <div className="gi-cat-icon h-full p-[15px] flex flex-col items-center justify-center bg-[#fff] relative rounded-[5px] z-[5]">
                  <i className="fi fi-tr-hamburger-soda transition-all duration-[0.3s] ease-in-out text-[40px] my-[10px] text-[#5caf90] leading-[0]"></i>
                  <div className="gi-cat-detail text-center">
                    <a href="shop-left-sidebar-col-3.html">
                      <h4 className="gi-cat-title m-[0] text-[15px] leading-[22px] font-semibold text-[#4b5966] capitalize font-manrope">
                        Juice & Drinks
                      </h4>
                    </a>
                    <p className="items m-[0] text-[13px] leading-[28px] text-[#777]">
                      845 Items
                    </p>
                  </div>
                </div>
              </div>
              <div className="gi-cat-box transition-all duration-[0.3s] ease-in-out p-[15px] rounded-[5px] relative bg-[#fff6ec]">
                <div className="gi-cat-icon h-full p-[15px] flex flex-col items-center justify-center bg-[#fff] relative rounded-[5px] z-[5]">
                  <i className="fi fi-tr-shrimp transition-all duration-[0.3s] ease-in-out text-[40px] my-[10px] text-[#5caf90] leading-[0]"></i>
                  <div className="gi-cat-detail text-center">
                    <a href="shop-left-sidebar-col-3.html">
                      <h4 className="gi-cat-title m-[0] text-[15px] leading-[22px] font-semibold text-[#4b5966] capitalize font-manrope">
                        Seafood
                      </h4>
                    </a>
                    <p className="items m-[0] text-[13px] leading-[28px] text-[#777]">
                      652 Items
                    </p>
                  </div>
                </div>
              </div>
              <div className="gi-cat-box transition-all duration-[0.3s] ease-in-out p-[15px] rounded-[5px] relative bg-[#e2fde2]">
                <div className="gi-cat-icon h-full p-[15px] flex flex-col items-center justify-center bg-[#fff] relative rounded-[5px] z-[5]">
                  <i className="fi fi-tr-juice transition-all duration-[0.3s] ease-in-out text-[40px] my-[10px] text-[#5caf90] leading-[0]"></i>
                  <div className="gi-cat-detail text-center">
                    <a href="shop-left-sidebar-col-3.html">
                      <h4 className="gi-cat-title m-[0] text-[15px] leading-[22px] font-semibold text-[#4b5966] capitalize font-manrope">
                        Beverages
                      </h4>
                    </a>
                    <p className="items m-[0] text-[13px] leading-[28px] text-[#777]">
                      369 Items
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
