var express = require("express");
var router  = express.Router();
var Campground= require("../models/campground");
var middleware = require("../middleware");


router.get("/campgrounds",function(req,res){
    Campground.find({},function(err,allcampgrounds)
    {
        if(err)
        console.log("Something went wrong!");
        else
        res.render("campgrounds/index",{campgrounds: allcampgrounds, currentUser: req.user});
    });
    
});

router.post("/campgrounds",middleware.isLoggedIn,function(req,res){
    var name=req.body.name;
    var price=req.body.price;
    var image=req.body.image;
    var description=req.body.description;
    var author={
        id: req.user._id,
        username: req.user.username
    }
    var ob={name: name,price: price,image: image,description: description, author: author};
    Campground.create(ob,function(err,newly){
        if(err)
        console.log("Something went wrong in addition");
        else
        res.redirect("/campgrounds");
    });
    
});

router.get("/campgrounds/new",middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new");
});

router.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err)
        console.log("Could not find id");
        else
        res.render("campgrounds/show", {campground: foundCampground});
    });
});


router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwner,function(req,res){
    Campground.findById(req.params.id,function(err, foundCampground){
        res.render("campgrounds/edit",{campground: foundCampground});
    });
});

router.post("/campgrounds/:id",middleware.checkCampgroundOwner,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err, updatedCampground){
        if(err)
        res.redirect("/campgrounds");
        else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

router.delete("/campgrounds/:id",middleware.checkCampgroundOwner,function (req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err)
        res.redirect("/campgrounds");
        else
        res.redirect("/campgrounds");
    })
});

module.exports = router;