const port=4000;
const express = require("express");
const app = express();
const mongoose=require("mongoose");
const jwt= require("jsonwebtoken");
const multer=require("multer");
const path=require("path");
const cors=require("cors") ;
const { error } = require("console");

app.use(express.json())
app.use(cors());

//database connection with mongodb
mongoose.connect("mongodb+srv://rolnikmichal:050796mr@cluster0.8b5d4kw.mongodb.net/e-commerce");


//api creation
app.get("/",(req,res)=>{
    res.send("express app is running")

})

//image storage engin
const storage= multer.diskStorage({
    destination: './upload/images',
    filename: (req,file,cb)=>{
        return cb(
            null,
            `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );

    },

});

const upload =multer({storage:storage});


//create upload endpoint for images
// Creating Upload Endpoint for images
app.use("/images", express.static("upload/images")); // Serve static files from the 'upload/images' directory

app.post("/upload", upload.single("product"), (req, res) => {
  // Handle file upload and respond with the file URL
  res.json({
    success: 1,
    image_url:`http://localhost:${port}/images/${req.file.filename}`
  });
});

//schema for creating products
const Product=mongoose.model("Product",{
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
      },
    date: {
        type: Date,
        default: Date.now,
        
     },
    avilable: {
        type: Boolean,
        default: true,
    },
    
});
// Add a new product to the database:
app.post('/addproduct', async(req,res)=>{
    let products=await Product.find({});
    let id;
    if(products.length>0){
        let last_product_array=products.slice(-1);
        let last_product=last_product_array[0];
        id=last_product.id+1;
    }
    else {
        id=1;
    }

    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    });
    console.log(product);
    await product.save(); // Save the product to the database
    console.log("Saved");
    res.json({
       success: true,
       name: req.body.name,
    });
});

//creating API for deleting product
app.post('/removeproduct', async(req,res)=>{
    await Product.findOneAndDelete({id: req.body.id});
    console.log("Removed");
    res.json({
        success:true,
        name: req.body.name,
    })
})

//creating api for getting all products

app.get("/allproducts", async (req, res) => {
    let products = await Product.find({});
    console.log("All Products Fetched");
    console.log({products});
    res.send(products);
  });
  
//schema creating for user

const Users= mongoose.model('Users',{
    name:{
        type:String,
    },

    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:String,
        default:Date.now
    },
    

})

//creatin endpoint for registering the user
app.post('/signup',async(req,res)=>{
    let check= await Users.findOne({email:req.body.email})
    if(check){
        return res.status(400).json({success:false ,errors:"existing user found with same email" });
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i] = 0; // Initialize cart data
    }
    const user = new Users({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,
    });

    await user.save(); // Save the new user to the database

    const data={
        user:{
            id: user.id
        }
    }
    const token=jwt.sign(data,'secret_ecom');
    res.json({success:true,token})

    })

    //creat endpoint for user login
    //creating endpoint for user login
app.post("/login", async (req, res) => {
    let user = await Users.findOne({ email: req.body.email });
    if (user) {
      const passCompare = req.body.password === user.password;
      if (passCompare) {
        const data = {
          user: {
            id: user.id,
          },
        };
        const token = jwt.sign(data, "secret_ecom");
        res.json({ success: true, token });
      } else {
        res.json({ success: false, errors: "Wrong Password" });
      }
    } else {
      res.json({ success: false, errors: "Wrong Email" });
    }
  });

  //creating endpoint for new collection
  app.get('/newcollection', async(req,res)=>{
    let products= await Product.find({});
    let newcollection= products.slice(1).slice(-8);
    console.log("newcollection fetched");
    res.send(newcollection);
  })

  //crating endpoint for women category
  app.get('/popularinwomen', async(req,res)=>{
    let products= await Product.find({category:"women"});
    let popular_in_women=products.slice(0,4);
    console.log("popular in women fetched");
    res.send(popular_in_women)})

// Middleware to fetch user based on JWT token
const fetchUser = async (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
      res.status(401).send({ errors: "Please authenticate using valid token" });
    } else {
      try {
        const data = jwt.verify(token, "secret_ecom");
        req.user = data.user;
        next(); // Proceed to the next middleware or route handler
      } catch (error) {
        res.status(401).send({ errors: "Please authenticate using valid token" });
      }
    }
  };
  
  //creating endpoint for adding products in cartdata
  app.post("/addtocart", fetchUser, async (req, res) => {
    // Increment the quantity of an item in the user's cart
    let userData = await Users.findOne({ _id: req.user.id });
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate(
      { _id: req.user.id },
      { cartData: userData.cartData }
    );
    res.json({ success: true, message: "Added to cart" });
  });
  
  //creating endpoint to remove from cart data
  app.post("/removefromcart", fetchUser, async (req, res) => {
    // Decrement the quantity of an item in the user's cart
    let userData = await Users.findOne({ _id: req.user.id });
    if (userData.cartData[req.body.itemId] > 0)
      userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate(
      { _id: req.user.id },
      { cartData: userData.cartData }
    );
    res.json({ success: true, message: "Added to cart" });
  }); //
  
  //creating endpoint to get cart data
  app.post("/getcart", fetchUser, async (req, res) => {
    // Retrieve the user's cart data
    console.log("Get Cart");
    let userData = await Users.findOne({ _id: req.user.id });
    res.json(userData.cartData);
  });


    app.listen(port,(error)=>{
        if(!error){
            console.log("server running on port "+port);
        }
        else{
            console.log(error);
        }
    });  



