import React, { useEffect } from "react";
import BlogSidebar from "../components/BlogSidebar";
import { getBlogById } from "../../redux/blogSlice";
import { useParams } from "react-router-dom";
import { fetchReviewsByEntity } from "../../redux/reviewSlice";
import Reviews from "../../components/products/Reviews";
import { Star, Heart, Share2, ShoppingCart, ImageOff } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { formatDateTime } from "../utils/helpers";
const BlogPage = () => {
  const dispatch = useDispatch();
  const { reviews } = useSelector((state) => state.reviews);
  const { id } = useParams();
  const { blog } = useSelector((state) => state.blogs);
  const { auth } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(getBlogById(id));
    dispatch(
      fetchReviewsByEntity({
        entityType: "blogs",
        entityId: id,
      })
    );
  }, [dispatch, id]);
  const comments = [
    {
      name: "John Doe",
      date: "October 14, 2018",
      comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      avatar: "/api/placeholder/40/40",
    },
    {
      name: "Jenifer Lowes",
      date: "October 14, 2018",
      comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      avatar: "/api/placeholder/40/40",
    },
  ];

  const averageRating = reviews?.length
    ? (
        reviews?.reduce((sum, review) => sum + parseFloat(review.rating), 0) /
        reviews.length
      ).toFixed(1)
    : "0.0";

  const RenderStars = ({ rating, size = 20 }) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={size}
        fill={index < Math.floor(rating) ? "#FFD700" : "none"}
        color="#FFD700"
        className="inline-block"
      />
    ));
  };
  return (
    <main className="container mx-auto px-2 py-12 flex gap-4">
      <div className="flex gap-8">
        <div className="w-1/3">
          <BlogSidebar />
        </div>

        {/* Main Content */}
        <div className="w-2/3 ">
          <img
            src={blog?.blog_image}
            alt="Blog header"
            className="mb-6 w-full rounded-lg object-cover"
          />

          <div className="mb-8">
            <div className="mb-2 text-sm text-gray-500">
              {formatDateTime(blog?.created_at || new Date())} -{" "}
              {blog?.category}
            </div>
            <h1 className="mb-4 text-2xl font-bold">{blog?.title}</h1>
            <div
              className="space-y-4 text-gray-600"
              dangerouslySetInnerHTML={{ __html: blog?.content }}
            ></div>
          </div>

          <Reviews
            reviews={reviews}
            entityId={id}
            entityType="blogs"
            auth={auth}
          />
        </div>
      </div>
    </main>
  );
};

export default BlogPage;
