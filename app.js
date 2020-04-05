const 	express = require("express")
	,	ejs = require("ejs")
	,	bodyParser = require("body-parser")
	,	mongoose = require("mongoose")
	,	Campground = require("./models/campground.js")
	,	seedDb = require("./seedDb.js")
	,	Comment = require("./models/comment.js")
;

const app = express();

// setup
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
//mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect("mongodb+srv://rest-api-db:Mongmma4819!@cluster0-ttdya.mongodb.net/yelp_camp?retryWrites=true&w=majority", 
	{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
	.catch(err => {
		console.log(err);
		alert(err);
		return;
	});
// mongodb+srv://rest-api-db:<password>@cluster0-ttdya.mongodb.net/test?retryWrites=true&w=majority


// seed db
//seedDb();

// root route
app.get("/", (req, res) => {
	res.render("landing");
})

// INDEX route - campgrounds get route
app.get("/campgrounds", (req, res) => {
	Campground.find({})
		.catch((err)=>{
			console.log(err);
		})
		.then((campgrounds)=>{
			res.render("index", {campgrounds: campgrounds});
		});
});

// NEW route - campground add new route
app.get("/campgrounds/new", (req, res) => {
	res.render("./views/campgrounds/newCampground.ejs");
});

// CREATE route - campgrounds post route
app.post("/campgrounds", (req, res) => {
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var newCampground = {name: name, image: image, description: description};
	Campground.create(newCampground, (err, campground)=>{
		if (err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	})
});

// SHOW route - show a specific campground 
app.get("/campgrounds/:id", (req, res) => {
	//var id = req.params.id;
	Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// ========================================
// COMMENTS ROUTES
// ========================================
// NEW
app.get("/campgrounds/:id/comments/new", (req, res) => {
	Campground.findById(req.params.id)
		.then(campground => {
			res.render("comments/new", {campground: campground});
		})
		.catch(err => {
			console.log(err);
		})
});

app.post("/campgrounds/:id/comments/new", (req, res) => {
	let campgroundId = req.params.id;
	Campground.findById(campgroundId)
		.then(campground => {
			// figure out how to match comment to campground 
			// console.log(req.params);
			// console.log(req.body);
			// res.redirect("/campgrounds/" + campgroundId);
			// return;
			let campgroundComment = req.body.Comment;
			let newComment = new Comment({
				author: campgroundComment.author
			,	text: campgroundComment.text
			})
			Comment.create(newComment)
				.then(comment => {
					Campground.findByIdAndUpdate(campgroundId, 
						{$push: {comments: newComment._id}},
						{safe: true, upsert: true},
						function (err, doc) {
							if (err) {
								console.log(err);
							} else {
								console.log("comment added");
							}
						}
					)
				})
				.catch(err => {
					console.log(err);
				})
				.finally(() => {
					res.redirect("/campgrounds/" + campgroundId);
				})
		})
		.catch(err => {
			console.log(err);
		})
});

// start the server
app.listen(3000, () => {
	console.log("The YelpCamp server started on port 3000");
})
