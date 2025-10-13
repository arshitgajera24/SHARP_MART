import React, { useEffect, useState } from 'react'
import "./List.css"
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const List = () => {

    const [list, setList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const fetchList = async () => {
        setIsLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product/list`);

        if(response.data.success)
        {
            setList(response.data.data);
        }
        else
        {
            toast.error(response.data.error);
        }
        setIsLoading(false);
    }

    const removeFood = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this product?");
        if (!isConfirmed) return;

        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/product/remove`, {id})
        await fetchList();
        if(response.data.success)
        {
            toast.success(response.data.success)
        }
        else
        {
            toast.error(response.data.error);
        }
    }

    useEffect(() => {
        fetchList();
    }, [])

    if(isLoading) {
        return <div className="loader-container">
            <span className="loader"></span>
        </div>
    }

  return (
    <div className='list add flex-col'>
      <p>All Products List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Ratings</b>
          <b>Offer Price</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {
          list.map((item, index) => {
            return (
              <div key={index} className='list-table-format'>
                <img src={item.image} alt="Image" />
                <p className="name">{item.name}</p>
                <p className="category">{item.category}</p>
                <p className="ratings">{item.ratings}</p>
                <p className="price">&#8377; {item.price}</p>
                <p className="original_price">&#8377; {item.originalPrice}</p>
                <div className="action-buttons">
                    <button onClick={() => navigate("/edit", { state: item })}>Edit</button>
                    <button onClick={() => removeFood(item.id)}>Delete</button>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default List
