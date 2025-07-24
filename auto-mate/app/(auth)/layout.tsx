import Image from 'next/image'
import React from 'react'

const Layout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className='min-h-screen w-full flex'>
      <section className='bg-pink-600 w-1/2 hidden lg:flex xl:w-2/5 p-10 flex-col gap-2 justify-center text-center items-center'>
        
        <Image src={"/vercel.svg"} alt='logo' width={80} height={80} className='h-auto mb-8'/>
        <div className='space-y-5 text-white'>
        <h1 className='text-5xl font-bold'>文件转换</h1>
        <p className='text-2xl'>
          方便的转换你需要的文件
        </p>
        </div>
      </section>
      <section className='flex flex-1 flex-col text-black justify-center items-center bg-white p-4'>
        {children}
      </section>
    </div>
  )
}

export default Layout
