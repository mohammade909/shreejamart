import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  deleteProduct,
  updateProduct,
} from "../../redux/productsSlice";
import axios from "axios"; // Replace with your thunk
import { fetchCategories } from "../../redux/categorySlice"; // Replace with your thunk
import ReactPaginate from "react-paginate";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import ConfirmPopup from "../ConfirmPopup";
import { BASEURL } from "../../baseurl";
import toast from "react-hot-toast";
import ProductStats from "./ProductStats";
import ProductFilters from "./ProductFilter";
const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { vendor } = useSelector((state) => state.vendors);
  const { categories } = useSelector((state) => state.categories); // Adjust to your Redux state structure
  const { products, pagination } = useSelector((state) => state.products); // Adjust to your Redux state structure
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    status: "",
    limit: "",
  });

  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts({ page, ...filters, vendorId: vendor?.vendor_id }));
    dispatch(fetchCategories());
  }, [dispatch, page, filters, vendor]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handlePageChange = ({ selected }) => {
    setPage(selected + 1);
  };

  const handleAction = (productId, action) => {
    if (action === "approve") {
    } else if (action === "reject") {
    } else if (action === "view") {
      // View product details
      if (vendor?.vendor_id) {
        navigate(`/vendor/products/${productId}`);
      } else {
        navigate(`/dashboard/products/${productId}`); // Replace with your route path
      }
    } else if (action === "edit") {
      // Call reject API
    } else if (action === "delete") {
      setOpen(true);
      setProductId(productId);
    }
  };
  const handleStatusChange = async (productId, newStatus) => {
    try {
      // Update status via API call
      dispatch(
        updateProduct({ productId, updatedData: { status: newStatus } })
      );
      toast.success("Product updated successfully");
      dispatch(
        fetchProducts({ page, ...filters, vendorId: vendor?.vendor_id })
      );
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error);
      alert("Error updating status");
    }
  };

  return (
    <div className="container mx-auto px-4 pb-20">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-gray-900">Product List</h1>
        <div className="text-sm font-medium text-gray-700 border border-gray-300 bg-white rounded-sm py-2 px-3">
          Total Products <span className="ml-1 bg-green-50 border border-green-400 text-green-500 px-3 py-1 rounded-md"> {pagination?.totalProducts}</span>
        </div>
      </div>
      <ProductStats products={products} />
      <ConfirmPopup
        isOpen={open}
        onClose={() => setOpen(false)}
        actionFunction={deleteProduct}
        message="Are you sure you want to delete this Product?"
        id={productId}
      />

      <ProductFilters
        filters={filters}
        handleFilterChange={handleFilterChange}
        categories={categories}
        vendor={vendor}
      />

      {/* Product Table */}
      <div className="overflow-x-auto no-scrollbar">
        <table className="min-w-full bg-white shadow rounded-lg text-xs">
          <thead>
            <tr className="bg-black text-white font-normal text-left text-sm">
              <th className="px-6 py-2 font-normal">Sr.N</th>
              <th className="px-6 py-2 font-normal ">Image</th>
              <th className="px-6 py-2 font-normal">Name</th>
              <th className="px-6 py-2 font-normal">Category</th>
              {vendor?.vendor_id ? (
                <th className="px-6 py-2 font-normal">Stock</th>
              ) : (
                <th className="px-6 py-2 font-normal">Vendor</th>
              )}
              {vendor?.vendor_id ? <th className="px-6 py-2 font-normal">Unit</th> : null}

              <th className="px-6 py-2 font-normal">Price</th>
              <th className="px-6 py-2 font-normal">Stock value</th>
              <th className="px-6 py-2 font-normal">Status</th>
              <th className="px-6 py-2 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product, index) => {
              const parsedImages =
                typeof product.images === "string"
                  ? JSON.parse(product.images)
                  : product.images;
              return (
                <tr key={product.product_id} className="border-b">
                  <td className="px-6 py-4 font-semibold">{index + 1}.</td>
                  <td className="px-6 py-4">
                    <img
                      src={parsedImages.featured_image}
                      alt={product.name}
                      className="w-12 h-12 object-cover"
                      onError={(e) => {
                        e.target.src = "/default_grocery.jpg";
                        e.target.alt = "Default gr Image";
                      }}
                    />
                  </td>
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4">{product.category_name}</td>
                  {vendor?.vendor_id ? (
                    <td className="px-6 py-4">
                      {Number(product.stock_quantity).toFixed(0)}
                    </td>
                  ) : (
                    <td className="px-6 py-4">
                      {product.vendor_name || "N/A"}
                    </td>
                  )}
                  {vendor?.vendor_id ? (
                    <td className="px-6 py-4">{product.unit_of_measurement}</td>
                  ) : null}

                  <td className="px-6 py-4">₹{product.price}</td>
                  <td className="px-6 py-4">
                    ₹
                    {Number(product.price) *
                      Number(product.stock_quantity).toFixed(0)}
                  </td>
                  <td className="px-6 py-4">
                    <p
                      className={`border border-gray-300 px-2 py-1 rounded-md ${
                        product.status === "available"
                          ? "bg-secondary text-white"
                          : "bg-orange-50 text-orange-700"
                      }  `}
                    
                    >{ product.status}</p>
                    {/* <select
                      className={`border border-gray-300 px-2 py-1 rounded-md ${
                        product.status === "available"
                          ? "bg-secondary text-white"
                          : "bg-orange-50 text-orange-700"
                      }  `}
                      value={product.status}
                      onChange={(e) =>
                        handleStatusChange(product.product_id, e.target.value)
                      }
                    >
                      {vendor?.vendor_id ? (
                        <>
                          <option value="in_stock">In Stock</option>
                          <option value="out_of_stock">Out Of Stock</option>
                        </>
                      ) : (
                        <>
                          <option value="available">Available</option>
                          <option value="reject">Reject</option>
                          <option value="pending">Pending</option>
                        </>
                      )}
                    </select> */}
                  </td>
                  <td className="px-6 py-4">
                    <td className="px-6 py-4">
                      <Menu
                        as="div"
                        className="relative inline-block text-left"
                      >
                        <div>
                          <Menu.Button className="flex items-center rounded-full bg-gray-100 p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                            <EllipsisVerticalIcon className="h-5 w-5" />
                          </Menu.Button>
                        </div>
                        <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
                          <div className="py-1">
                            {vendor?.vendor_id ? (
                              <>
                                <Menu.Item>
                                  <button
                                    onClick={() =>
                                      handleAction(product.product_id, "edit")
                                    }
                                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                                  >
                                    Edit
                                  </button>
                                </Menu.Item>
                                <Menu.Item>
                                  <button
                                    onClick={() =>
                                      handleAction(product.product_id, "delete")
                                    }
                                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-100 hover:text-red-700"
                                  >
                                    Delete
                                  </button>
                                </Menu.Item>
                                <Menu.Item>
                                  <button
                                    onClick={() =>
                                      handleAction(product.product_id, "view")
                                    }
                                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-green-100 hover:text-green-700"
                                  >
                                    View Details
                                  </button>
                                </Menu.Item>
                              </>
                            ) : (
                              <>
                                <Menu.Item>
                                  <button
                                    onClick={() =>
                                      handleStatusChange(
                                        product.product_id,
                                        "available"
                                      )
                                    }
                                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    Approve
                                  </button>
                                </Menu.Item>
                                <Menu.Item>
                                  <button
                                    onClick={() =>
                                      handleStatusChange(
                                        product.product_id,
                                        "reject"
                                      )
                                    }
                                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    Reject
                                  </button>
                                </Menu.Item>
                                <Menu.Item>
                                  <button
                                    onClick={() =>
                                      handleAction(product.product_id, "view")
                                    }
                                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-green-100 hover:text-green-700"
                                  >
                                    View Details
                                  </button>
                                </Menu.Item>
                              </>
                            )}
                          </div>
                        </Menu.Items>
                      </Menu>
                    </td>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {pagination?.totalPages > 1 && (
        <div className="mt-4">
          <ReactPaginate
            previousLabel={"← Previous"}
            nextLabel={"Next →"}
            breakLabel={"..."}
            pageCount={pagination.totalPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageChange}
            containerClassName={"flex justify-center gap-2"}
            activeClassName={"text-blue-500 font-bold"}
            pageClassName={
              "px-3 py-1 border rounded hover:bg-gray-200 cursor-pointer"
            }
          />
        </div>
      )}
    </div>
  );
};

export default Products;
