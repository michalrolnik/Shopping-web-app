import React, { useState } from "react";
import './AddProduct.css';
import upload_area from "../../assets/upload_area.svg"
import { Form } from "react-router-dom";

const AddProduct=()=>{

    const[image,setImage]=useState(false);

    const imageHandler=(e)=>{
        setImage(e.target.files[0]);

    }

    const[productDetails,SetProductDetails]=useState({
        name:"",
        image:"",
        category:"women",
        new_price: "",
        old_price:"",
    })

    const onChangeHandler=(e)=>{
        SetProductDetails({...productDetails,[e.target.name]:e.target.value});

    }

    const Add_product= async()=>{
        console.log(productDetails)

        //להעביר את זה לבק
        let responseData;
        let product=productDetails;
        let formData= new FormData();
        formData.append('product',image);
        await fetch('http://localhost:4000/upload',{
            // Send a request to the server to upload the image
            method: "POST",
            headers: {
              Accept: "application/json",
            },
            body: formData,
          }).then((resp) => resp.json()).then((data) => {responseData = data});
      
        if (responseData.success) {
            product.image = responseData.image_url;
            console.log(product);
            await fetch('http://localhost:4000/addproduct',{
                // Send a request to the server to upload the image
                method: "POST",
                headers: {
                  Accept: "application/json",
                  'Content-Type': "application/json",
                },
                body: JSON.stringify(product),
              }).then((resp) => resp.json()).then((data) => {data.success?alert('Product Added'):alert('Failed')});


        }
    }
    return(
        <div className="add-product">
            <div className="addproduct-itemfield">
                <p>Product title</p>
                <input value={productDetails.name} onChange={onChangeHandler} type="text" name='name' placeholder="type here"></input>
            </div>

            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p>Price</p>
                    <input value={productDetails.old_price} onChange={onChangeHandler} type="text" name='old_price' placeholder="type here"></input>
                </div>

                <div className="addproduct-itemfield">
                    <p>Offer Price</p>
                    <input value={productDetails.new_price} onChange={onChangeHandler} type="text" name='new_price' placeholder="type here"></input>
                </div>
            </div>

            <div className="addproduct-itemfield">
                <p>Product Category</p>
                <select value={productDetails.category} onChange={onChangeHandler} name="category" className="add-product-selector">                       
                  <option value="women">Women</option>
                  <option value="men">Men</option>
                  <option value="kid">kid</option>
              </select>
            </div>
            <div className="addproduct-itemfield">
                <label htmlFor="file-input">
                    <img src={image?URL.createObjectURL(image):upload_area} className="addproduct-thumnail-img"></img>


                </label>

                \\מאפשר בלחיצה על התמונה הזאת זה יפתח את דפדפן הקבצים במחשב
                <input onClick={imageHandler} type="file" name='image' id='file-input' hidden></input>
            </div>
            <button onClick={()=>{Add_product()}} className="addproduct-btn">ADD</button>
                
        </div>
    );
};
export default AddProduct;