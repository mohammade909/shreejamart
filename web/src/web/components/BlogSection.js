import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBlogs } from "../../redux/blogSlice";
import { Link } from "react-router-dom";
import { formatDateTime } from "../utils/helpers";
const BlogSection = () => {
  const dispatch = useDispatch();
  const { blogs } = useSelector((state) => state.blogs);

  useEffect(() => {
    dispatch(getBlogs({ page: 1 }));
  }, [dispatch]);
  // const blogs = [
  //   {
  //     id: 1,
  //     date: "June 30,2022",
  //     category: "Organic",
  //     title: "Marketing Guide: 5 Steps to Success to way.",
  //     image: "https://grabit-next.tigerheck.com/assets/img/blog/1.jpg",
  //     alt: "Fresh red cherries with green leaves",
  //   },
  //   {
  //     id: 2,
  //     date: "April 02,2022",
  //     category: "Fruits",
  //     title: "Best way to solve business deal issue in market.",
  //     image: "https://grabit-next.tigerheck.com/assets/img/blog/2.jpg",
  //     alt: "Bowl of almonds",
  //   },
  //   {
  //     id: 3,
  //     date: "Mar 09,2022",
  //     category: "Vegetables",
  //     title: "31 grocery customer service stats know in 2019.",
  //     image: "https://grabit-next.tigerheck.com/assets/img/blog/3.jpg",
  //     alt: "Orange soup with bread",
  //   },
  //   {
  //     id: 4,
  //     date: "January 25,2022",
  //     category: "Fastfood",
  //     title: "Business ideas to grow your business traffic.",
  //     image: "https://grabit-next.tigerheck.com/assets/img/blog/4.jpg",
  //     alt: "Iced tea with citrus",
  //   },
  // ];

  return (
    <section className="max-w-7xl mx-auto px-4 pb-10 pt-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl text-primary/80 mb-2 font-semibold">
            Latest <span className="text-secondary">Blog</span>
          </h2>
          <p className="text-gray-500 font-Poppins text-sm">
            We tackle interesting topics every day in {new Date().getFullYear()}.
          </p>
        </div>
        <Link to="/blogs" className="text-gray-600 hover:text-gray-800">
          All Blogs »
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog.blog_id}
            className="bg-white  overflow-hidden   transition-shadow"
          >
            <div className="aspect-w-4 aspect-h-3">
              <img
                src={blog.blog_image}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="py-4">
              <div className="flex items-center text-xs text-gray-500 mb-2">
                <span>{formatDateTime(blog.created_at)}</span>
                <span className="mx-2">-</span>
                <span>{blog.category}</span>
              </div>
              <h3 className="text-base font-medium  font-Poppins text-primary/80 mb-3">
                {blog.title}
              </h3>
              <Link
                to={`/blogs/${blog.blog_id}`}
                className="inline-block text-gray-600 hover:text-secondary"
              >
                Read More »
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlogSection;
