let express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose")

app.use(express.static(__dirname + '/public'));
mongoose.connect('mongodb://localhost:27017/code_diary', {useNewUrlParser: true});
//parsing snip into an object
app.use(bodyParser.urlencoded({extended: true}));
//so I dont have to keep defining ejs
app.set("view engine", "ejs"); 

//database model setup
let snipSchema = new mongoose.Schema({
	title: String,
	code: String,
	language: String,
	framework: String,
	usage: String,
	comment: String
});

// make Snip the model template
let Snippet = mongoose.model("Snippet", snipSchema);

//gets the landing page- renders landing.ejs
app.get("/", (req, res) => {
	res.render("landing.ejs")
})

// //new search func
// 	app.get("/search", (req, res) =>{
// 	 	res.render("search.ejs")
// 	 })

// 	 app.get("/searchResults", (req, res) => {
// 	 	res.render("searchResults")
// 	})
// 	app.post("/search", (req, res) => {
// 		let searchWords = req.body.searchWords;
// 		res.render("searchResults", {searchWords: searchWords})
// 	})

//gets the snips page, renders snips.ejs
app.get("/snips", (req, res) => {
	Snippet.find({}, (err, allSnippets) => {
		res.render("snips", {snippet: allSnippets})
	})
})

//accepts form info from addNew.ejs and pushed to newSnip, redirects back to /snips
app.post("/snips", (req, res) => {
	let title = req.body.title;
	let language = req.body.language;
	let framework = req.body.framework;
	let usage = req.body.usage;
	let code = req.body.code;
	let comment = req.body.comment;
	let newSnip = {title: title, language: language, framework: framework, usage: usage, code: code, comment: comment};
	Snippet.create(newSnip, (err, newlyCreated) => {
		if(err){
		console.log("error")
	} else {
		res.redirect("/snips")
	}
	})
})
// renders addNew form page
app.get("/javaScript/new", (req, res) => {
	res.render("addNew");
})

//expands on each tile, redirecting to an individual ejs
app.get("/snips/:id", (req, res) => {
	Snippet.findById(req.params.id, function(err, foundSnippet){
		res.render("show.ejs", {snippet: foundSnippet});
		})
	})

app.listen(3000, () => {
	console.log("Server is listening on Port 3000");
})
	