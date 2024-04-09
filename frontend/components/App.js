import React from 'react'
import { Link, Routes, Route } from 'react-router-dom'
import Home from './Home'
import Form from './Form'

function App() {
  return (
    <div id="app">
      <nav>
        {/* NavLinks here */}
        <Link to='/'>Home</Link>
        <Link to='/order'>Order</Link>
      </nav>
      {/* Route and Routes here */}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/order' element={<Form />} />
      </Routes>
    </div>
  )
}

export default App
