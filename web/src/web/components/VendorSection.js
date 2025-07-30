import React, { useEffect } from "react";
import { fetchVendors } from "../../redux/vendorSlice";
import { useSelector, useDispatch } from "react-redux";
import VendorCard from "./VendorCard";
import LoadingCards from "./LoadingCards";
const VendorSection = () => {
  const dispatch = useDispatch();
  const { vendors, loading } = useSelector((state) => state.vendors);

  useEffect(() => {
    dispatch(fetchVendors({ page: 1, vendorId: "" }));
  }, []);

  return (
    <>
      {loading ? (
        <LoadingCards />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:px-8 px-4 py-4">
          {vendors?.slice(0, 5).map((vendor) => {
            return <VendorCard vendor={vendor} viewType={"grid"} />;
          })}
        </div>
      )}
    </>
  );
};

export default VendorSection;
