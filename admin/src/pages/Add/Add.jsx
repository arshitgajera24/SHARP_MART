import React, { useState } from 'react'
import "./Add.css"
import axios from "axios"
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'

const Add = () => {

    const [data, setData] = useState({
        image: "",
        name: "",
        description: "",
        category: "Vegetables",
        ratings: "",
        price: "",
        original_price: "",
        isAvailable: false
    })
    const [isLoading, setIsLoading] = useState(false);

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setData(data => ({...data, [name]:value}));
    }

    const onSubmitHandler = async (e) => {
        setIsLoading(true);
        e.preventDefault();

        const formData = new FormData();
        formData.append("image", data.image);
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("category", data.category);
        formData.append("ratings", data.ratings);
        formData.append("price", data.price);
        formData.append("original_price", data.original_price);
        formData.append("isAvailable", data.isAvailable);


        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/product/add`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        if(response.data.success) {
            setData({
                image: "",
                name: "",
                description: "",
                category: "Vegetables",
                ratings: "",
                price: "",
                original_price: "",
                isAvailable: false
            })
            toast.success(response.data.message);
        }
        else
        {
            toast.error(response.data.error);
        }
        setIsLoading(false);
    }

    if(isLoading) {
        return <div className="loader-container">
            <span className="loader"></span>
        </div>
    }
    
  return (
    <div className='add'>
        <form className='flex-col' onSubmit={onSubmitHandler} encType='multipart/form-data'>
            <div className="add-img-upload flex-col">
                <p>Upload Image</p>
                <label htmlFor="image">
                    <img src={data.image ? URL.createObjectURL(data.image) : assets.upload_area} alt="Upload Image" />
                </label>
                <input onChange={(e) => setData(data => ({...data, image: e.target.files[0]}))} type="file" id='image' name='image' hidden />
            </div>
            <div className="add-product-name flex-col">
                <p>Product Name</p>
                <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Enter Product Name' />
            </div>
            <div className="add-product-description flex-col">
                <p>Product Description</p>
                <textarea onChange={onChangeHandler} value={data.description} name="description" rows="6" placeholder='Describe Product Here'></textarea>
            </div>
            <div className='add-category flex-col'>
                    <p>Select Category</p>
                    <select name="category" onChange={onChangeHandler} value={data.category}>
                        <option value="Vegetables">Vegetables</option>
                        <option value="Fruits">Fruits</option>
                        <option value="Drinks">Drinks</option>
                        <option value="Dairy">Dairy</option>
                        <option value="Bakery">Bakery</option>
                        <option value="Grains">Grains</option>
                        <option value="Instant">Instant</option>
                    </select>
            </div>
            <div className='add-ratings flex-col'>
                <p>Product Ratings</p>
                <input onChange={onChangeHandler} value={data.ratings} type="number" name='ratings' placeholder='Ratings'/>
            </div>
            <div className="add-price">
                <div className="add-offer-price flex-col">
                    <p>Offer Price</p>
                    <input onChange={onChangeHandler} value={data.price} type="number" name='price' placeholder='Offer Price'/>
                </div>
                <div className="add-original-price flex-col">
                    <p>Original Price</p>
                    <input onChange={onChangeHandler} value={data.original_price} type="number" name='original_price' placeholder='Original Price'/>
                </div>
            </div>
            <div className='add-availability'>
                <input onChange={(e) => setData(data => ({...data, isAvailable: e.target.checked}))} checked={data.isAvailable} type="checkbox" name='isAvailable'/>&nbsp;&nbsp;Product is Available in Current Stock ? or De-Activate it
            </div>
            <button type='submit' className='add-btn'>ADD</button>
        </form>
    </div>
  )
}

export default Add
