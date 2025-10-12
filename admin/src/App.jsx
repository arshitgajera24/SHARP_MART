import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import Edit from './pages/Edit/Edit'
import Home from './pages/Home/Home'
import Error from './pages/Error/Error'
import Contacts from './pages/Contacts/Contacts'
import Users from './pages/Users/Users'
import UserView from './pages/UserView/UserView'

const App = () => {
  return (
    <div className="app">
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/add' element={<Add />} />
          <Route path='/edit' element={<Edit />} />
          <Route path='/list' element={<List />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/contacts' element={<Contacts />} />
          <Route path='/users' element={<Users />} />
          <Route path='/user-view' element={<UserView />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
