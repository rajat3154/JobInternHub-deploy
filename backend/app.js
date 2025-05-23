// CORS configuration
app.use(cors({
  origin: ['https://jobinternhub.onrender.com', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Cookie parser middleware
app.use(cookieParser()); 