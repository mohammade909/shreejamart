import React, { useEffect } from "react";
import { fetchProducts } from "../../redux/productsSlice";
import { useSelector, useDispatch } from "react-redux";

import ProductCard from "./ProductCard";
const ProductSection = ({ from, to }) => {
  const dispatch = useDispatch();

  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, vendorId: "" }));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 p-4">
      {products?.slice(from, to).map((product) => {
        return <ProductCard product={product} viewType={"grid"} />;
      })}
    </div>
  );
};

export default ProductSection;
