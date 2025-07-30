import React, { useState, useEffect } from "react";
import { formatDateTime } from "../../../web/utils/helpers";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
} from "@mui/material";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { getBlogs, deleteBlog } from "../../../redux/blogSlice";
import { Link } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const BlogList = () => {
  const dispatch = useDispatch();
  const { blogs, pagination } = useSelector((state) => state.blogs);
  const { auth } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "",
    search: "",
    sort: "newest",
    limit: 10,
  });
  const [selectedBlogId, setSelectedBlogId] = useState(null);

  useEffect(() => {
    dispatch(getBlogs({ page, filters }));
  }, [dispatch, page, filters]);

  const handleDeleteClick = (id) => {
    setSelectedBlogId(id);
    setOpen(true);
  };

  const handleDelete = async () => {
    dispatch(deleteBlog(selectedBlogId));
    setOpen(false);
    dispatch(getBlogs());
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handlePageChange = ({ selected }) => {
    setPage(selected + 1);
  };

  return (
    <>
      <div className="bg-white py-5 sm:py-5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="md:flex  justify-between items-center mb-2">
            <div className="">
              <h1 className="text-xl font-semibold text-left  text-gray-900 ">
                From the blog
              </h1>
              <p className="text-sm  text-gray-600">
                Learn how to grow your business with our expert advice.
              </p>
            </div>
            <div className="md:mt-0 my-6">
              <Link
                to="/dashboard/blog/add"
                className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Add New Blog
              </Link>
            </div>
          </div>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Filters
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    fullWidth
                    type="text"
                    label="Search..."
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    select
                    label="Status"
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                  >
                    <MenuItem value="">All Status</MenuItem>
                    <MenuItem value="published">Published</MenuItem>
                    <MenuItem value="draft">Drafts</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    select
                    label="Limit"
                    name="limit"
                    value={filters.limit}
                    onChange={handleFilterChange}
                  >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {blogs.length > 0 ? (
              blogs?.map((blog) => (
                <article
                  key={blog.blog_id}
                  className="flex flex-col items-start border rounded-t-2xl justify-between relative"
                >
                  <div className="relative w-full">
                    <img
                      alt={blog.title}
                      src={blog.blog_image} // Default image if none provided
                      onError={(e) => {
                        e.target.src = "/default_image.png";
                        e.target.alt = "Default blog Image"; // Update the alt text for accessibility
                      }}
                      className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                    />
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                  </div>
                  <div className="w-full px-3 pb-3">
                    <div className="mt-8 flex items-center justify-between text-xs">
                      <time
                        dateTime={blog.created_at}
                        className="text-gray-500"
                      >
                        {formatDateTime(blog.created_at)}
                      </time>
                      <span className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
                        {blog.status}
                      </span>
                    </div>
                    <div className="group relative">
                      <h3 className="mt-3 text-lg font-semibold capitalize leading-6 text-gray-900 group-hover:text-gray-600">
                        <Link to={`/dashboard/blogs/view/${blog.blog_id}`}>
                          <span className="absolute inset-0" />
                          {blog.title}
                        </Link>
                      </h3>
                      <p className="mt-5 text-sm leading-6 text-gray-600 line-clamp-3">
                        {blog.blog_excerpt}
                      </p>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(blog.blog_id)}
                        className="text-gray-400 hover:text-red-800"
                      >
                        <TrashIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                      <Link
                        to={`/dashboard/blogs/view/${blog.blog_id}`}
                        className="text-gray-400 hover:text-blue-800"
                      >
                        <PencilIcon className="h-5 w-5 " aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <p className="text-center py-5 text-red-300 tracking-wider font-sans">
                404! No Blogs Found
              </p>
            )}
          </div>
        </div>

        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon
                      className="h-6 w-6 text-red-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      Delete Blog
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this blog? This action
                        cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </div>
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
    </>
  );
};

export default BlogList;
