const express = require('express');
const app = express();

app.use(express.static('public'))

app.get('/',(req,res)=>{
    

    res.sendFile(__dirname +'/public/home.html')

})


const session = require('express-session');
const res = require('express/lib/response');

app.set('view engine', 'ejs');

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET' 
}));

app.get('/login', function(req, res) {
  res.render('pages/auth');
});

const port = process.env.PORT || 3000;
app.listen(port , () => console.log('App listening on port ' + port));


// index.js

/*  PASSPORT SETUP  */

const passport = require('passport');
var userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

app.get('/success', (req, res) => res.render('pages/logout'));
app.get('/s',(req,res)=>{
  res.send(userProfile)
})
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// index.js

/*  Google AUTH  */
 
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = '998050338194-glgscu25tb4t5bf79a4uplvk2n8g1nvm.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));
 
app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/success');
  });
  app.post('/logout', function(req, res) {
    req.session.destroy(function(e){
        req.logout();
        res.redirect('/');
    });
});
