import React from 'react'
import { Button } from './ui/button'
import { Github } from 'lucide-react'
import Image from 'next/image'

const OTPModel = () => {
  return (
    <div className='flex justify-center gap-4 mt-2'>
      <Button>
        <Image src={"/brand/github.svg"} width={16} height={16} alt='github'/>
      </Button>
       <Button>
        <Image src={"/brand/google.svg"} width={16} height={16} alt='github'/>
      </Button>
        <Button>
        <Image src={"/brand/wechat.svg"} width={16} height={16} alt='github'/>
      </Button>
    </div>
  )
}

export default OTPModel
