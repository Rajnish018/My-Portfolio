import express from "express";
import cors from "cors";
import { uploadDir } from "./middlewares/multer.middleware.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://my-portfolio-h5856vtu8-rajnish-kumars-projects-9b954ac3.vercel.app"
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||                                   // requests from Postman / curl
        origin.endsWith(".vercel.app") ||            // any Vercel deploy
        origin === "http://localhost:5173"           // local dev
      ) {
        callback(null, true);
      } else {
        console.error("CORS blocked:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Backend is live!" });
});

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
