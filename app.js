const express               = require('express');
const app 		            = express();
const User                  = require('./models/user');
const passport              = require('passport');
const LocalStrategy         = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');

const mongoose              = require('mongoose');
const bodyParser            = require('body-parser');


mongoose.connect("mongodb://localhost/auth_demo_app", { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'ejs')
app.use(require("express-session")({
    secret: "Boomer",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
//configuring passport
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//LANDING PAGE
app.get('/', (req,res)=>{
	res.render('home');
})

//register route
app.get('/register',(req, res)=>{
	res.render('register')
})
app.post('/register', (req,res)=>{
	User.register(new User({username: req.body.username}), req.body.password, (err, user)=>{
		if(err){
			console.log(err);
			return res.render('register');
		} else {
			
			passport.authenticate('local')(req,res, ()=>{
				res.redirect('/login');
			});
		}
	});
});
//LOGIN PAGE
app.get('/login', (req, res)=>{
	res.render('login')
})
//login post
app.post('/login', passport.authenticate('local',{
	successRedirect: '/secret',
	failureRedirect: '/login'
}), (req,res)=>{
	
})

//LOGOUT ROUTE
app.get('/logout',(req, res)=>{
	req.logout();
	res.redirect('/');
})
const isLoggedIn = (req, res, next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
//SECRET ROUTE
app.get('/secret', isLoggedIn, (req,res)=>{
	res.render('secret')
})


app.listen(3000, ()=>{
	console.log('login app has begun!')
})
