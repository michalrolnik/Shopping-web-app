import React from "react";
import './NewsLetter.css';

const  NewsLetter=()=>{
    return(
        <div className="newsletter">
            <h1>get exclusive offers on your email</h1>
            <p>suscribe to our newsletter and stay updated</p>
            <div>
                <input type="email" placeholder="your email id"/>
                <button>subsrice</button>
            </div>
        </div>
    )
}
export default NewsLetter ;