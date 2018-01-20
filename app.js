var express   =require("express");
var app       =express();
var methodOverride=require("method-override");
var bodyparser=require("body-parser");
var mongoose  =require("mongoose");
var expressSanitizer=require("express-sanitizer");
app.use(expressSanitizer());
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(methodOverride("_method"));
mongoose.connect("mongodb://localhost/restful_routing");
var blogSchema = new mongoose.Schema({
		title:String,
		image:String,
		body:String,
		created:{type:Date,default:Date.now}
	});
var Blog =mongoose.model("Blog",blogSchema);
/*Blog.create(
	{
		title:"Test Blog",
		image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVdaeWFjAGNQnGlP2TCpKHgWniQ8YGlusxlowwqaYiQ9LZo-bI",
		body:"This is blog post"
	},function(err,Campground){
		if(err)
			console.log(err);
		else
			console.log(Blog);
});*/

app.get("/",function(req,res){
		res.redirect("/blogs");
});
app.get("/blogs",function(req,res){//1. index route:to display the list
		Blog.find({},function(err,x){
		if(err)
			console.log(err);
		else
			res.render("index",{blogs:x});
});
});
app.get("/blogs/new",function(req,res){
		res.render("new");
});
app.get("/blogs/:id",function(req,res){//4. show route:to show info about one campground
	Blog.findById(req.params.id,function(err,blogFound){
	//function given by mongoose
		if(err)
			console.log(err);
		else
			res.render("show",{blogs:blogFound});
});
});
app.post("/blogs",function(req,res){//2. create route:to add new campground to db 
		var title=req.body.title;
		var img=req.body.image;
		var body=req.body.body;
		var newBlog={title:title,image:img,body:body};
		console.log(req.body);
		req.body.newBlog=req.sanitize(req.body.newBlog)	
		console.log(req.body);	
		Blog.create(newBlog,function(err,Blog){
		if(err)
			console.log(err);
		else
		res.redirect("/blogs");
})});
app.get("/blogs/:id/edit",function(req,res){
		Blog.findById(req.params.id,function(err,blogFound){//edit route
	//function given by mongoose
		if(err)
			console.log(err);
		else
			res.render("edit",{blogs:blogFound});
});
});
app.put("/blogs/:id",function(req,res){//update route
		var title=req.body.title;
		var img=req.body.image;
		var body=req.body.body;
		var updateBlog={title:title,image:img,body:body};
		Blog.findByIdAndUpdate(req.params.id,updateBlog,function(err,blogUpdate){//edit route
	//function given by mongoose
		if(err)
			console.log(err);
		else
			res.redirect("/blogs/"+req.params.id);
});
});
app.delete("/blogs/:id",function(req,res){//4. show route:to show info about one campground
	Blog.findByIdAndRemove(req.params.id,function(err){
	//function given by mongoose
		if(err)
			console.log(err);
		else
			res.redirect("/blogs");
});
});

app.listen(3000);
console.log("server is running");
