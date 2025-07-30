const experss = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const upload = require("express-fileupload");
const errorMiddleware = require("./middlewares/errorMiddleware");
const twilio = require('twilio');

const twilioClient = twilio(
  'AC27ee9465e5139f004902a4b8e4ba8d22',
  '3a59411b039ae246ba15124f8f7f75e1'
);
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



// twilio 
const otpStore = new Map();

// Generate random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
app.post('/api/send-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const otp = generateOTP();
    
    // Store OTP with phone number
    otpStore.set(phoneNumber, otp);
    
    // Send SMS using Twilio
    await twilioClient.messages.create({
      body: `Your verification code is: ${otp}`,
      to: phoneNumber,
      from: '+18312760340'
    });
    
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
});

app.post('/api/verify-otp', (req, res) => {
  const { phoneNumber, otp } = req.body;
  const storedOTP = otpStore.get(phoneNumber);
  if (storedOTP && storedOTP === otp) {
    otpStore.delete(phoneNumber); 
    res.json({ success: true, message: 'OTP verified successfully' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
});

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
