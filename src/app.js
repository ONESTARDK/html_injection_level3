require("dotenv").config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var logger = require("morgan");
const mongoose = require("mongoose");

var app = express();
const port = parseInt(process.env.PORT) || 3000;

// Kiểm tra biến môi trường DB_URL
const urlConnect = process.env.DB_URL;
if (!urlConnect) {
    console.error("❌ Lỗi: DB_URL chưa được khai báo trong biến môi trường.");
    process.exit(1); // Dừng ứng dụng
}

// Kết nối MongoDB
mongoose.connect(urlConnect, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("✅ Kết nối database thành công!");
}).catch(err => {
    console.error("❌ Lỗi kết nối database:", err.message);
    process.exit(1);
});

// Khởi tạo session
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SECRET_KEY || 'defaultsecret',
    cookie: {
        maxAge: 86400000,
        httpOnly: false
    }
}));

// Cấu hình view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware logging + request parsing
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Khai báo các route
var indexRouter = require("./routes/index");
var adminRouter = require("./routes/admin");
var ticketRouter = require("./routes/ticket");

app.use(indexRouter);
app.use(adminRouter);
app.use(ticketRouter);

// Khởi động server
app.listen(port, () => {
    console.log(`[+] Running Level 6 on port ${port}, root: "${__dirname}"`);
});

module.exports = app;
