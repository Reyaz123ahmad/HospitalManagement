import React from 'react'
import { Link } from 'react-router-dom'

const History = () => {
  return (
    <div>
      <div className='delete'><Link to="/delete-account">delete</Link></div>
    </div>
  )
}

export default History
