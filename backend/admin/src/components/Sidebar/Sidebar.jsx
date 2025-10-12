import React from 'react'
import "./Sidebar.css"
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink to="/add" className="sidebar-option">
            <img src={assets.add_icon} alt="Add Item" />
            <p>Add Products</p>
        </NavLink>
        <NavLink to="/list" className="sidebar-option">
            <img src={assets.order_icon} alt="List Item" />
            <p>List Products</p>
        </NavLink>
        <NavLink to="/orders" className="sidebar-option">
            <img src={assets.order_placed_icon} alt="Manage Order" width="30px"/>
            <p>Manage Orders</p>
        </NavLink>
        <NavLink to="/contacts" className="sidebar-option">
            <img src={assets.manage_contacts} alt="Contacts" width="30px"/>
            <p>Manage Contacts</p>
        </NavLink>
        <NavLink to="/users" className="sidebar-option">
            <img src={assets.manage_users} alt="Users" width="30px"/>
            <p>Manage Users</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
