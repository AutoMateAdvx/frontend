"use client"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    InputOTP,
    InputOTPGroup,
  
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { LoaderCircle, X } from "lucide-react"
import { saveAccount, verifyOTP } from "@/lib/actions/user.action"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function VerifyEmail({accountId,email,fullName}:{accountId:string,email:string,fullName:string|undefined}) {
    const router = useRouter()
    const [isOpen,setIsOpen] = useState(true)
    const [isLoading,setIsLoading] = useState(false)
    const [password,setPassword] = useState("")
    async function handleVerify(): Promise<void> {
        setIsLoading(true)
        try {
           const sessionId = await verifyOTP({userId:accountId,otp:password}) 
           if(sessionId) router.push("/")
        } catch (error) {
            toast.error("操作失败，请重试")
        }finally{
            setIsLoading(false)
        }
        
    }
   async function  handleRegister() {
    setIsLoading(true)
        try {
           const sessionId = await verifyOTP({userId:accountId,otp:password}) 
           const res =await saveAccount(accountId,email,fullName!)
           if(res.code!=-1){
                   if(sessionId) router.push("/")
           }
        } catch (error) {
            toast.error("操作失败，请重试")
        }finally{
            setIsLoading(false)
        }
   }
    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                    <AlertDialogTitle className="relative text-black pt-9 pb-3 font-bold text-3xl text-center">
                        输入你的OTP
                        <X onClick={()=>{
                            setIsOpen(false)
                        }} className="size-5 hover:text-black text-muted-foreground absolute right-0 top-0"/>
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                      我们已经向您的邮箱发送了一封验证码，请注意查看
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <InputOTP value={password} onChange={setPassword} className=""  maxLength={6}>
                    <InputOTPGroup className="flex flex-row justify-between items-center w-full text-black text-center">
                        <InputOTPSlot className="border-secondary font-bold text-2xl p-6 rounded-sm border-2" index={0} />
                        <InputOTPSlot className="border-secondary font-bold text-2xl p-6 rounded-sm border-2" index={1} />
                        <InputOTPSlot className="border-secondary font-bold text-2xl p-6 rounded-sm border-2" index={2} />
                        <InputOTPSlot className="border-secondary font-bold text-2xl p-6 rounded-sm border-2" index={3} />
                        <InputOTPSlot className="border-secondary font-bold text-2xl p-6 rounded-sm border-2" index={4} />
                        <InputOTPSlot className="border-secondary font-bold text-2xl p-6 rounded-sm border-2" index={5} />
                    </InputOTPGroup>
                </InputOTP>
                <AlertDialogFooter>
                    <div className="w-full flex flex-col gap-4">
                    <AlertDialogAction onClick={()=>{
                        if (fullName){
                            handleRegister()
                        }else{
                            handleVerify()
                        }
                    }} disabled={isLoading} className="text-zinc-900 p-6 text-xl font-bold">
                        {!isLoading?"提交":<><LoaderCircle className="animate-spin"/>提交中</>}
                        </AlertDialogAction>
                    </div>

                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
