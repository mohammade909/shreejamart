const experss = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const upload = require("express-fileupload");
const errorMiddleware = require("./middlewares/errorMiddleware");

// Routes starts here
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const vendorRoutes = require("./routes/vendorRoutes")
const productRoutes = require("./routes/productRoutes")
const categoryRoutes = require("./routes/categoryRoutes")
const cartRoutes = require("./routes/cartRoutes")
const locationRoutes = require("./routes/locationRoutes")
const orderRoutes = require("./routes/orderRoutes")
const commentRoutes = require("./routes/commentRoutes")
const blogRoutes = require("./routes/blogRoutes")
const partnerRoutes = require("./routes/partnerRoutes")
const transactionRoutes = require("./routes/transactionRoutes")
const reviewRoutes = require("./routes/reviewRoutes")
const notificationRoutes = require("./routes/notificationRoutes")
// const authRoutes = require("./routes/vendors");



// Middleware starts here
dotenv.config();
const app = experss();
app.use(experss.json());
app.use(upload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ origin: "*" }));

// API Endpoints starts at http://localhost:8000

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/vendors", vendorRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories",categoryRoutes);
app.use("/api/v1/cart",cartRoutes);
app.use("/api/v1/location",locationRoutes);
app.use("/api/v1/orders",orderRoutes);
app.use("/api/v1",commentRoutes);
app.use("/api/v1/blogs", blogRoutes);
app.use("/api/v1/partners", partnerRoutes);
app.use("/api/v1/transactions", transactionRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/notifications", notificationRoutes);


// Middle wares
app.use(errorMiddleware);

module.exports = app;
