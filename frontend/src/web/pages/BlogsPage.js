import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBlogs } from "../../redux/blogSlice";
import { Link } from "react-router-dom";
import { formatDateTime } from "../utils/helpers";
import BlogSidebar from "../components/BlogSidebar";
const BlogsPage = () => {
  const dispatch = useDispatch();
  const { blogs } = useSelector((state) => state.blogs);

  useEffect(() => {
    dispatch(getBlogs({ page: 1 }));
  }, [dispatch]);

  return (
<main className="container mx-auto px-2 py-12 flex gap-4">
  {/* Sidebar */}
  <div className="w-1/3">
    <BlogSidebar />
  </div>

  {/* Main Content */}
  <div className="w-2/3 grid grid-cols-2 gap-4">
    {blogs?.map((blog) => (
      <div
        key={blog.blog_id}
        className="bg-white rounded-md overflow-hidden  transition-shadow"
      >
        <div className="aspect-w-4 aspect-h-3">
          <img
            src={blog.blog_image}
            alt={blog.title}
            className="w-full h-48 object-cover"
          />
        </div>
        <div className="py-4">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span>{formatDateTime(blog.created_at)}</span>
            <span className="mx-2">-</span>
            <span>{blog.category}</span>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            {blog.title}
          </h3>
          <Link
            to={`/blogs/${blog.blog_id}`}
            className="inline-block text-gray-600 hover:text-gray-800"
          >
            Read More »
          </Link>
        </div>
      </div>
    ))}
  </div>
</main>

  );
};

export default BlogsPage;
