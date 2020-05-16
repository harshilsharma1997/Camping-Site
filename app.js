var express         =   require("express");
var app             =   express();
var bodyParser      =   require("body-parser");
var mongoose        =   require("mongoose");
var Campground      =   require("./models/campground");
var seedDB          =   require("./seeds");
var Comment         =   require("./models/comment");
var User            =   require("./models/user");
var passport        =   require("passport");
var LocalStrategy   =   require("passport-local");
var methodOverride  =   require("method-override");
var commentRoutes   =   require("./routes/comments");
var campgroundRoutes=   require("./routes/campgrounds");
var indexRoutes     =   require("./routes/index");
var flash           =   require("connect-flash");



// mongoose.connect("mongodb://localhost/yelp_camp");
// mongoose.connect("mongodb+srv://harshil:@aVKsP9fhJ5ax7h@yelpcamp-yqnz4.mongodb.net/test?retryWrites=true&w=majority");
mongoose.connect('mongodb+srv://harshil:@aVKsP9fhJ5ax7h@yelpcamp-yqnz4.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true, 
	useCreateIndex: true
}).then(() => {
	console.log('Connected to DB!');
}).catch(err => {
	console.log('ERROR:', err.message);
});

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://harshil:@aVKsP9fhJ5ax7h@yelpcamp-yqnz4.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();


// =================
// PASSPORT CONFIG
// =================

app.use(require("express-session")({
    secret: "learning wed d is fun!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error =req.flash("error");
    res.locals.success =req.flash("success");
    next();
});


app.use(indexRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);

app.listen(process.env.PORT||3000,process.env.IP,function(){
    console.log("YelpCamp has started!")
});





