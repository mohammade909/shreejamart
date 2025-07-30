import React from "react";
import { Card, CardContent } from "@mui/material";
import { Package2, PackageX, Inbox, DollarSign } from "lucide-react";

const ProductStats = ({ products }) => {
  const calculateStats = () => {
    const stats = {
      totalStockValue: 0,
      totalStockQuantity: 0,
      outOfStockCount: 0,
      activeProducts: 0,
    };

    products.forEach((product) => {
      const stockQuantity = Number(product.stock_quantity) || 0;
      const price = Number(product.price) || 0;

      // Calculate total stock value
      stats.totalStockValue += stockQuantity * price;

      // Add to total stock quantity
      stats.totalStockQuantity += stockQuantity;

      // Count products by status
      if (product.status === "out_of_stock") {
        stats.outOfStockCount++;
      } else if (product.status === "available") {
        stats.activeProducts++;
      }
    });

    return stats;
  };

  const stats = calculateStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Stock Value
              </p>
              <h3 className="text-xl font-semibold mt-2">
                ₹{stats.totalStockValue.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Stock Quantity
              </p>
              <h3 className="text-xl font-semibold mt-2">
                {stats.totalStockQuantity.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Package2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Out of Stock Products
              </p>
              <h3 className="text-xl font-semibold mt-2">
                {stats.outOfStockCount}
              </h3>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <PackageX className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Active Products
              </p>
              <h3 className="text-xl font-semibold mt-2">
                {stats.activeProducts}
              </h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Inbox className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductStats;
