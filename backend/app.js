// CORS configuration
app.use(cors({
  origin: [
    'https://jobinternhub.onrender.com',
    'http://localhost:5173',
    'https://jobinternhub.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie']
}));

// Cookie parser middleware
app.use(cookieParser()); 