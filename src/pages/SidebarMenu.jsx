import React, { useState } from 'react'

const SidebarMenu = () => {
    const [isClick,setIsClick]=useState(false);

     function handleSidebarMenu(){
        setIsClick(true)
    } 
  return (
    <div>
      <button onClick={handleSidebarMenu}>SidebarMenu</button>
    </div>
  )
}

export default SidebarMenu
