import React from 'react'
import { SidebarTrigger } from './ui/sidebar'

import { ModeToggle } from './ModeToggle'


function Navbar() {
  return <nav className='flex border-b-2 px-4 w-full border-muted justify-between h-[65px] items-center p-3'>
    <div className='flex justify-center items-center gap-4'>
      <SidebarTrigger/>
    </div>
    <div className='ml-4'>
    <ModeToggle/>
    </div>
  </nav>
}

export default Navbar
