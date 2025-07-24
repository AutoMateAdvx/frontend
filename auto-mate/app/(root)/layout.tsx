import AppSidebar from '@/components/AppSidebar'
import Navbar from '@/components/Navbar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { getCurrentUser } from '@/lib/actions/user.action'
import { redirect } from 'next/navigation'
import React from 'react'

async function layout({children}:{children:React.ReactNode}) {
  const currentUser = await getCurrentUser()
  if (!currentUser) return redirect("/sign-in")
  return (
    <div className='min-h-screen w-full'>
      <SidebarProvider defaultOpen>
              <AppSidebar {...currentUser} />
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

export default layout
