import React from 'react'
import { SidebarProvider } from '../ui/sidebar'
import AppSidebar from '../AppSidebar'
import Navbar from '../Navbar'

function SidebarLayout({children}:{children:React.ReactNode}) {
  return (
    <div className='min-h-screen w-full'>
        <SidebarProvider className='flex'>
            <AppSidebar/> 
            <main className="flex flex-col w-full">
                <Navbar />
                <div className="px-4">
                  {children}
                </div>
              </main>
        </SidebarProvider>
    </div>
  )
}

export default SidebarLayout