import React, { useEffect, useState } from "react";
import { Star, Grid, List, Filter } from "lucide-react";
import ReactPaginate from "react-paginate";
import { fetchProducts } from "../../redux/productsSlice";
import { fetchCategories } from "../../redux/categorySlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FiGrid } from "react-icons/fi";
import ProductCard from "../components/ProductCard";
import FilterSidebar from "./FilterSidebar";

const VendorStore = () => {
  const dispatch = useDispatch();
  const { vendorId } = useParams();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [viewType, setViewType] = useState("grid");
  const { auth } = useSelector((state) => state.auth);
  const { categories } = useSelector((state) => state.categories);
  const { products, pagination } = useSelector((state) => state.products);
  const [page, setPage] = useState(1);
  
  // Add debounce timer state
  const [searchTimer, setSearchTimer] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    status: "",
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Modified useEffect to handle search properly
  useEffect(() => {
    dispatch(fetchProducts({ page, vendorId, ...filters }));
  }, [dispatch, page, vendorId, filters.category, filters.status]);

  // Separate useEffect for handling search with debounce
  useEffect(() => {
    if (searchTimer) {
      clearTimeout(searchTimer);
    }

    const timer = setTimeout(() => {
      dispatch(fetchProducts({ page: 1, vendorId, ...filters }));
    }, 500); // 500ms debounce

    setSearchTimer(timer);

    return () => {
      if (searchTimer) {
        clearTimeout(searchTimer);
      }
    };
  }, [filters.search]);

  // Modified handleFilterChange to reset page when filters change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Reset to first page when search changes
    if (name === 'search') {
      setPage(1);
    }
  };

  const handlePageChange = ({ selected }) => {
    setPage(selected + 1);
  };

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
        <FilterSidebar
          categories={categories}
          selectedCategories={selectedCategories}
          toggleCategory={toggleCategory}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />
        
        <div className="w-full md:w-3/4">
          <div className="bg-white rounded-sm hidden border p-1 mb-6 md:flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setViewType("grid")}
                className={`p-2 rounded ${viewType === "grid" ? "bg-secondary" : ""}`}
              >
                <FiGrid
                  className={`h-6 w-6 ${
                    viewType === "grid" ? "bg-secondary text-white" : "text-primary"
                  }`}
                />
              </button>
              <button
                onClick={() => setViewType("list")}
                className={`p-2 rounded ${viewType === "list" ? "bg-secondary" : ""}`}
              >
                <List
                  className={`h-6 w-6 ${
                    viewType === "list" ? "bg-secondary text-white" : "text-primary"
                  }`}
                />
              </button>
            </div>

            {/* Modified Search Bar */}
            <div className="flex-1 mx-8">
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2  transition-colors duration-200 outline-none"
                />
                <button 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-secondary"
                  onClick={() => dispatch(fetchProducts({ page: 1, vendorId, ...filters }))}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-center border-l space-x-4 pl-4">
              <select className="rounded-lg px-4 py-2   outline-none">
                <option>Popularity</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
              </select>
            </div>
          </div>

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
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6 h-screen">
              <i className="fi fi-ts-cart-shopping-fast text-gray-500 text-6xl"></i>
              <p className="text-lg text-gray-600">No products available.</p>
              <p className="text-gray-500">
                Try adjusting your search or filters.
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

export default VendorStore;