import React from 'react'
import "./Users.css"
import { useState } from 'react'
import axios from "axios"
import {toast} from "react-toastify"
import { useEffect } from 'react'
import {useNavigate} from "react-router-dom"

const Users = () => {

  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const fetchUsersList = async () => {
    setIsLoading(true);
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/list`);

    if(response.data.success) setUserList(response.data.data);      
    else toast.error(response.data.error);

    setIsLoading(false)
  }

  const removeUser = async (userId) => {
    const isConfirmed = window.confirm("Are You Sure You Want to Delete This User?");
    if (!isConfirmed) return;
    setIsLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/remove`, { userId });
      if (response.data.success) 
      {
        toast.success(response.data.message);
        await fetchUsersList();
      }
      else toast.error(response.data.error);
    setIsLoading(false);
  }

  const blockUser = async (userId, blockState) => {
    const isConfirmed = window.confirm("Are You Sure You Want to Block This User?");
    if (!isConfirmed) return;
    setIsLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/block`, { userId, blockState });
      if (response.data.success) 
      {
        toast.success(response.data.message);
        await fetchUsersList();
      }
      else toast.error(response.data.error);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchUsersList();
  }, [])

  if (isLoading) {
      return (
          <div className="loader-container">
              <div className="loader"></div>
          </div>
      );
  }


  return (
    <div className='user-list add flex-col'>
        <p>All Users List</p>
        <div className="user-table">
          <div className="user-table-format title">
            <b>Avatar</b>
            <b>Name</b>
            <b>Email</b>
            <b>Provider(s)</b>
            <b>Email Verified</b>
            <b>Created</b>
            <b>Total Orders</b>
            <b>Total Spent</b>
            <b>Active</b>
            <b>Action</b>
          </div>

          {
              userList.map((user, index) => {
                  return <div key={index} className="user-table-format">
                    {
                      user?.avatarUrl
                      ?   <img src={user?.avatarUrl} alt={user?.name} />
                      :   <span>{user?.name?.charAt(0).toUpperCase()}</span>
                    }
                    <p className="name">{user.name}</p>
                    <p className="email">{user.email}</p>
                    <p className="provider">{user.providers}</p>
                    <p className={`email-valid ${user.isEmailValid ? "valid" : "invalid"}`}>
                      {user.isEmailValid ? "Yes" : "No"}
                    </p>
                    <p className="createdAt">{user.createdAt}</p>
                    <p className="totalOrders">{user.totalOrders}</p>
                    <p className="totalSpent">₹ {user.totalSpent}</p>
                    <p className="active">
                      {user.activeSession === "Active" ? (
                        <span className="status-active">Active</span>
                      ) : (
                        <span className="status-inactive">Offline</span>
                      )}
                    </p>
                    <div className="action-buttons">
                      <button className="view" onClick={() => navigate("/user-view", { state: {userId: user.id} })}>View</button>
                      <button className={`block ${user.isBlocked ? "unblock" : ""}`} onClick={() => blockUser(user.id, !user.isBlocked)}>
                        {user.isBlocked ? "Unblock" : "Block"}
                      </button>
                      <button onClick={() => removeUser(user.id)}>Delete</button>
                    </div>
                  </div>
              })
          }
        </div>
    </div>
  )
}

export default Users
