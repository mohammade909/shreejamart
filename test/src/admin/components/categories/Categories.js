import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, deleteCategory } from "../../../redux/categorySlice";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@mui/material";

const Categories = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [catId, setCatId] = useState();
  const [open, setOpen] = useState(false);

  const { auth } = useSelector((state) => state.auth);
  const categories = useSelector((state) => state.categories.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCreate = () => {
    navigate("/dashboard/categories/add");
  };

  const handleDelete = (id) => {
    setCatId(id);
    setOpen(true);
  };

  const handleUpdate = (categoryId) => {
    console.log(`Update category with ID: ${categoryId}`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Categories</h2>
        {auth?.user_type === "admin" && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            Create Category
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories?.map((category, index) => (
          <Card
            key={category.category_id}
            className="hover:shadow-lg transition-shadow"
          >
            <CardHeader className="bg-gray-50">
              <h2 className="text-xl font-semibold">{category.name}</h2>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-600 mb-4">{category.description}</p>

              {auth?.user_type === "admin" && (
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => handleUpdate(category.category_id)}
                    className="flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.category_id)}
                    className="flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this category?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  dispatch(deleteCategory(catId));
                  setOpen(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
