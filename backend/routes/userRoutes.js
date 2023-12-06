// backend/routes/userRoutes.js
const path = require('path');
const express = require('express');
const User = require('../models/User');
const router = express.Router();

//signup route
router.get('/signup', (req, res) => {
  const signupPath = path.join(__dirname, '../../public/signup.html');
  res.sendFile(signupPath);
});

router.post('/signup', async (req, res) => {
  try {
    const { username, password, fullname } = req.body;

    if (!username || !password || !fullname) {
      return res.status(400).json({ error: 'Please provide username, password, and fullname' });
    }

    const newUser = await User.create({ username, password, fullname });
    res.redirect('/users/dashboard'); // Redirect to signin page after successful signup
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//signin route
router.get('/signin', (req, res) => {
  if(req.session.user){
    return res.redirect('/users/dashboard');
  }
  const signinPath = path.join(__dirname, '../../public/signin.html');
  res.sendFile(signinPath);
});


router.post('/signin', async (req, res) => {
  //klk udah login gk bisa balik ke login
  if(req.session.user){
    return res.redirect('/users/dashboard');
  }
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user || user.password !== password) {
      return res.status(401).send('Invalid username or password');
    }

    // Inisialisasi req.session jika belum ada
    if (!req.session) {
      req.session = {};
    }

    req.session.user = user; // Set user di session setelah berhasil sign-in
    res.redirect('/users/dashboard'); // Redirect ke dashboard setelah sign-in berhasil
  } catch (error) {
    res.status(500).send('Error signing in');
  }
});


//logout route
router.get('/logout', (req, res) => {
  req.session.destroy(); // Destroy session on logout
  res.redirect('/users/signin'); // Redirect to signin page after logout
});


router.get('/dashboard', (req, res) => {
  // Deteksi login jika tidak ada, redirect ke signin
  if (!req.session || !req.session.user) {
    return res.redirect('/users/signin');
  }else{
    const dashboardPath = path.join(__dirname, '../../public/dashboard.html');
    res.sendFile(dashboardPath);
  }
  
});








// Other routes for signin, logout, profile, etc.

module.exports = router;
