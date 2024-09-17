const express = require("express");
const cors = require('cors');
//middleware for logging details of incoming HTTP requests
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const db = require('./Config/db');
const userRoutes = require('./Routes/userRoutes');
const uploadRoutes = require('./Routes/uploadRoutes');
const nutrientRoutes = require('./Routes/nutrientRoutes_');
const FamilyProfileRoutes = require('./Routes/FamilyProfileRoutes');

 const Food = require('./Models/Food')
const path = require('path');
const app = express();
dotenv.config();

app.use(cors(
 {
  origin: ["https://deploy-mern-1hwq.vercel.app"],
  methods: ["POST", "GET"],
  credentials: "true"
 }
));
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

  


app.use('/api/images', express.static(path.join(__dirname, 'public/images')));

app.use('/api/user', userRoutes)

app.use('/api/uploads', uploadRoutes)
app.use('/api/', nutrientRoutes)
app.use('/api/', FamilyProfileRoutes)







const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server Running On Port ${PORT}....`);
});





