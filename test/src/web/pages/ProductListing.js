import React, { useEffect, useState } from "react";
import { Star, Grid, List, Filter } from "lucide-react";
import ReactPaginate from "react-paginate";
import { fetchProducts } from "../../redux/productsSlice";
import { fetchCategories } from "../../redux/categorySlice";
import { useDispatch, useSelector } from "react-redux";

import { useSearchParams } from "react-router-dom";

import { FiGrid } from "react-icons/fi";
import ProductCard from "../components/ProductCard";
import FilterSidebar from "./FilterSidebar";
const ProductListing = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [viewType, setViewType] = useState("grid");
  const { auth } = useSelector((state) => state.auth); // 'grid' or 'list'
  const { categories } = useSelector((state) => state.categories);
  const [openDropdown, setOpenDropdown] = useState(null);

  React.useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
  // Adjust to your Redux state structure
  const { products, pagination } = useSelector((state) => state.products); // Adjust to your Redux state structure
  const [filters, setFilters] = useState({
    search: searchQuery || "",
    category: "",
    status: "",
  });

  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchProducts({ page, ...filters, vendorId: "" }));
  }, [dispatch, page, filters]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handlePageChange = ({ selected }) => {
    setPage(selected + 1);
  };

  const weights = ["100g", "250g", "500g", "1kg"];

  const toggleCategory = (category) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category?.includes(category)
        ? prev.category.filter((c) => c !== category)
        : [...(prev.category || []), category],
    }));

    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="w-full mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}

        <FilterSidebar
          categories={categories}
          selectedCategories={selectedCategories}
          toggleCategory={toggleCategory}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          // weights={weights}
        />
        {/* Main Content */}
        <div className="w-full md:w-3/4">
          {/* Toolbar */}
          <div className="bg-white rounded-sm hidden border p-1 mb-6 md:flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setViewType("grid")}
                className={`p-2 rounded ${
                  viewType === "grid" ? "bg-secondary" : ""
                }`}
              >
                <FiGrid
                  className={`h-6 w-6  ${
                    viewType === "grid"
                      ? "bg-secondary text-white"
                      : "text-primary"
                  }`}
                />
              </button>
              <button
                onClick={() => setViewType("list")}
                className={`p-2 rounded ${
                  viewType === "list" ? "bg-secondary" : ""
                }`}
              >
                <List
                  className={`h-6 w-6 ${
                    viewType === "list"
                      ? "bg-secondary text-white"
                      : "text-primary"
                  }`}
                />
              </button>
              <span className="text-gray-500">Showing 1-12 of 48 products</span>
            </div>
            <div className="flex items-center border-l space-x-4">
              <select className="rounded-lg px-4 py-2 ">
                <option>Popularity</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {products.length > 0 ? (
            <div
              className={
                viewType === "grid"
                  ? "grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6"
                  : "space-y-6"
              }
            >
              {products.map((product) => (
                <ProductCard
                  key={product.product_id}
                  product={product}
                  viewType={viewType}
                  // Uncomment these lines if you want to handle favorite and like actions
                  // onAddToFavorite={(product) => handleFavorite(product)}
                  // onLike={(product) => handleLike(product)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6 h-screen">
              <i class="fi fi-ts-cart-shopping-fast text-gray-500 text-6xl"></i>
              <p className="text-lg text-gray-600">No products available.</p>
              <p className="text-gray-500">
                Try adding new products or adjusting your filters.
              </p>
            </div>
          )}

          {pagination?.totalPages > 1 && (
            <div className="mt-10 border-t py-5">
              <ReactPaginate
                previousLabel={"← Previous"}
                nextLabel={"Next →"}
                breakLabel={"..."}
                pageCount={pagination.totalPages}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageChange}
                containerClassName={"flex justify-center gap-2"}
                activeClassName={"text-white bg-secondary font-bold"}
                pageClassName={
                  "px-3 py-1 border rounded text-primary hover:bg-gray-200 hover:text-primary cursor-pointer"
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListing;
