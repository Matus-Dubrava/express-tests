const router = require('express').Router();

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/register', (req, res) => {
  res.send('post register');
});

router.post('/login', (req, res) => {
  res.send('post login');
});

router.get('/logout', (req, res) => {
  res.send('logging out');
});

module.exports = router;
