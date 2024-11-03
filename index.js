const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const { connectDb } = require('./db/db');
const exceljs = require('exceljs');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// Setup session middleware
app.use(
  session({
    secret: 'your_secret_key', // Replace with your own secret key
    resave: false,
    saveUninitialized: true,
  })
);

// In-memory user store for demonstration (replace with MongoDB collection)
const users = [
  { username: 'markaz', password: '$2b$10$0EAn0ERyQyI6OqWav21YR.qYwTal/b4ePfwlcwz717U6pFM1OuKGK' }, // 'password' hashed with bcrypt
];

// Route to render login page
app.get('/login', (req, res) => {
    res.render('login', { error: null }); // Pass 'error' as null initially
  });
  
  // Handle login form submission
  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username);
  
    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.userId = user.username;
      return res.redirect('/'); // Redirect to the form page after successful login
    } else {
      res.render('login', { error: 'Invalid credentials' }); // Pass 'error' when credentials are invalid
    }
  });
  

// Middleware to check if user is authenticated
function checkAuth(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Protected route for the form
app.get('/', checkAuth, (req, res) => {
  res.render('form'); // Ensure 'form.ejs' is in the 'views' directory
});

// Handle form submission
app.post('/getdata', async (req, res) => {
    try {
        const collection = await connectDb(); // Ensure MongoDB connection
        await collection.insertOne(req.body); // Insert data into MongoDB
        res.redirect('/'); // Redirect to prevent form re-submission
    } catch (error) {
        console.error('Error occurred while saving data:', error.message); // Log the error to the console
        res.status(500).send('An error occurred while saving data.');
    }
});



// Generate Excel file route
app.get('/excel', checkAuth, async (req, res) => {
  try {
    const collection = await connectDb(); // Correct way to get the collection
    const formData = await collection.find().toArray();

    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('FormData');

    worksheet.columns = [
      { header: 'نمبر شمار', key: 'SrNo', width: 20 },
      { header: 'کتاب نمبر', key: 'BookNumber', width: 20 },
      { header: 'اسمائے کتب', key: 'BookName', width: 20 },
      { header: 'زبان', key: 'Lang', width: 20 },
      { header: 'تعداد', key: 'Quantity', width: 20 },
      { header: 'حصے', key: 'Parts', width: 20 },
      { header: 'صفحات', key: 'Pages', width: 20 },
      { header: 'فن نمبر', key: 'FunNumber', width: 20 },
      { header: 'مؤلف / مرتب', key: 'Author', width: 20 },
      { header: 'مترجم / جمع', key: 'Translator', width: 20 },
      { header: 'ناشر / مظبخ', key: 'Publisher', width: 20 },
      { header: 'قیمت تخمیا', key: 'Price', width: 20 },
      { header: 'تاریخ', key: 'Date', width: 20 },
      { header: 'ایڈیشن', key: 'Edition', width: 20 },
      { header: 'سن اشاعت', key: 'PublicationDate', width: 20 },
      { header: 'کیفیات', key: 'Conditions', width: 20 },
    ];

    formData.forEach((data) => {
      worksheet.addRow(data);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    res.setHeader('Content-Disposition', 'attachment; filename=formData.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    res.status(500).send('An error occurred while generating the Excel file.');
  }
});

// Start the server
app.listen(8081, () => {
  console.log('Server running on http://localhost:8080');
});
