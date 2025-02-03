import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBlogs } from "../../redux/blogSlice";
import { Link } from "react-router-dom";
import { formatDateTime } from "../utils/helpers";
import { Search } from "lucide-react";

const BlogSidebar = () => {

  const dispatch = useDispatch();
  const { blogs } = useSelector((state) => state.blogs);
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    dispatch(getBlogs({ page: 1, filters:{search:searchQuery} }));
  }, [dispatch, searchQuery]);


  const categories = [
    { name: "Organic", count: 2 },
    { name: "Fruits", count: 3 },
    { name: "Vegetables", count: 2 },
    { name: "Fastfood", count: 2 },
  ];
  

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
   
  };

  return (
    <div className="w-full">
    {/* Search Section */}
    <div className="mb-8 ">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search Our Blog"
          className="w-full rounded-md border px-4 py-3 focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
        />
        <Search
          className="absolute right-3 top-3.5 text-gray-400"
          size={20}
        />
      </div>
    </div>

    {/* Recent Articles Section */}
    <div className="mb-8 rounded-md border p-8">
      <h3 className="mb-4 text-lg font-semibold">Recent Articles</h3>
      
      {/* Divider with Quote Icon */}
      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-2 border-gray-200"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-4">
            <svg
              className="h-4 w-4 text-gray-700"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 14"
            >
              <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
            </svg>
          </span>
        </div>
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {blogs?.length > 0 ? (
          blogs?.map((article, index) => (
            <div key={index} className="flex gap-4">
              <img
                src={article.blog_image}
                alt={article.title}
                className="h-20 w-20 rounded-md object-cover"
                onError={(e) => {
                  e.target.src = "/default_image.png";
                  e.target.onerror = null;
                }}
              />
              <div>
                <h4 className="font-semibold line-clamp-2">{article.title}</h4>
                <p className="text-sm text-gray-500">{formatDateTime(article.created_at)}</p>
                <p className="text-sm text-secondary">- {article.category}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No recent articles found</p>
        )}
      </div>
    </div>

    {/* Categories Section */}
    <div className="rounded-md border p-3">
      <h3 className="mb-4 text-lg font-semibold">Categories</h3>
      <div className="space-y-2">
        {categories.length > 0 ? (
          categories.map((category, index) => (
            <div 
              key={index} 
              className="flex cursor-pointer justify-between hover:text-secondary"
            >
              <span>{category.name}</span>
              <span className="text-gray-500">- {category.count}</span>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No categories found</p>
        )}
      </div>
      <button 
        className="mt-4 w-full rounded bg-secondary px-4 py-2 text-white transition-colors hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
      >
        Filter
      </button>
    </div>
  </div>
  );
};

export default BlogSidebar;
