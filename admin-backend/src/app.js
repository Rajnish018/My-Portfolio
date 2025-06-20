import express from "express";
import cors from "cors";
import { uploadDir } from "./middlewares/multer.middleware.js";

const app = express();


// app.use(
  // cors({
    // origin: process.env.CORS_ORIGIN,
    // credentials: true,
  // })
// );

app.use(cors({
  origin: "*", // or: "https://rajnish-portfolio-018.vercel.app"
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// json data
app.use(express.json());

// url encoded data
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

// store file data

app.use("/uploads", express.static(uploadDir));

/*------------------------------------------PUBLIC ROUTE----------------------------------------------------------*/
import publicRoute from "./routes/Public Routes/public.route.js";
app.use("/api/v1/public", publicRoute);

/*------------------------------------------Admin ROUTE----------------------------------------------------------*/

import AdminRouter from "./routes/Admin Routes/admin.route.js";
app.use("/api/v1/admin", AdminRouter);

export default app;
