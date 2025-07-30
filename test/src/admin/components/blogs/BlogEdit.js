import React, { useEffect , useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { updateBlog, resetState } from "../../../redux/blogSlice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import SuccessModal from "../../../components/SuccessModal";
import ErrorModal from "../../../components/ErrorModal";
import { TiPencil } from "react-icons/ti";
const BlogEdit = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { blog, loading, error, message } = useSelector((state) => state.blogs);
 const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false);
  const initialValues = {
    title: blog.title || "",
    content: blog.content || "",
    tags: blog.tags || "",
    status: blog.status || "",
    blog_excerpt: blog.blog_excerpt || "",
    blog_image: null,
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    content: Yup.string().required("Content is required"),
    tags: Yup.string(),
    status: Yup.string().required("Status is required"),
    blog_excerpt: Yup.string(),
  });

  const handleSubmit = (values) => {
    const updatedBlog = new FormData();

    Object.keys(values).forEach((key) => {
      if (values[key] !== null && values[key] !== "") {
        if (key === "blog_image") {
          updatedBlog.append(key, values[key]);
        } else {
          updatedBlog.append(key, values[key]);
        }
      }
    });

  
    dispatch(updateBlog({ blog_id: id, updatedData: updatedBlog }));
    // navigate(`/dashboard/blogs/view/${id}`);
  };

   useEffect(() => {
      if (message) {
        setOpen(true);
      }
      if (error) {
        setOpenError(true);
      }
    }, [message, error]);
  if (!blog) return <div>Loading...</div>;

  return (
    <div className="pb-20">
      <div className="max-w-full mx-auto bg-white p-8 shadow-lg rounded">
        <h1 className="text-2xl font-bold mb-6">Edit Blog Post</h1>

      <SuccessModal open={open} setOpen={setOpen} message={message} reset={resetState} />
      <ErrorModal open={openError} setOpen={setOpenError} error={error} reset={resetState} />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ setFieldValue, values }) => (
            <Form>
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700">
                  Title
                </label>
                <Field
                  id="title"
                  name="title"
                  type="text"
                  className="w-full mt-2 p-2 border border-gray-300 rounded bg-gray-100"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="content" className="block text-gray-700">
                  Content
                </label>
                <ReactQuill
                  value={values.content}
                  onChange={(value) => setFieldValue("content", value)}
                  className="bg-white"
                />
                <ErrorMessage
                  name="content"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="blog_excerpt" className="block text-gray-700">
                  Excerpt
                </label>
                <Field
                  as="textarea"
                  id="blog_excerpt"
                  name="blog_excerpt"
                  className="w-full mt-2 p-2 border border-gray-300 rounded bg-gray-100"
                  rows="2"
                />
                <ErrorMessage
                  name="blog_excerpt"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="tags" className="block text-gray-700">
                  Tags
                </label>
                <Field
                  id="tags"
                  name="tags"
                  type="text"
                  className="w-full mt-2 p-2 border border-gray-300 rounded bg-gray-100"
                />
                <ErrorMessage
                  name="tags"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="status" className="block text-gray-700">
                  Status
                </label>
                <Field
                  as="select"
                  id="status"
                  name="status"
                  className="w-full mt-2 p-2 border border-gray-300 rounded bg-gray-100"
                >
                  <option value="" label="Select status" />
                  <option value="draft" label="Draft" />
                  <option value="published" label="Published" />
                </Field>
                <ErrorMessage
                  name="status"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="blog_image" className="block text-gray-700">
                  Image
                </label>
                <input
                  id="blog_image"
                  name="blog_image"
                  type="file"
                  className="w-full mt-2 p-2 border border-gray-300 rounded bg-gray-100"
                  onChange={(event) => {
                    setFieldValue("blog_image", event.currentTarget.files[0]);
                  }}
                />
                <ErrorMessage
                  name="blog_image"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default BlogEdit;
