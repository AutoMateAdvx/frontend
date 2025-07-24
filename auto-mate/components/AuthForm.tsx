"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from 'next/link'
import { Control } from 'react-hook-form'
import { useRouter } from 'next/navigation'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createAccount, signInAccount } from '@/lib/actions/user.action'
import { toast } from 'sonner'
import OTPModel from './OTPModel'
import { VerifyEmail } from './VerifyEmail'

type BaseFormValues = {
  email: string
}

type SignUpFormValues = {
  email: string
  fullName: string
}

type FormValues<T extends formType> = T extends "signIn" ? BaseFormValues : SignUpFormValues

const signInSchema = z.object({
  email: z.string().email("请提供有效的邮箱地址")
})

const signUpSchema = z.object({
  email: z.string().email("请提供有效的邮箱地址"),
  fullName: z.string().min(2, "姓名至少需要2个字符")
})

type formType = "signIn" | "signUp"

export default function AuthForm({ type }: { type: formType }) {

  const [isLoading, setIsLoading] = useState(false)
  const isSignIn = type === "signIn"
  const router = useRouter()
  const form = useForm<FormValues<formType>>({
    resolver: zodResolver(isSignIn ? signInSchema : signUpSchema),
    defaultValues: isSignIn
      ? { email: "" }
      : { email: "", fullName: "" }
  })

  async function onSubmit(values: FormValues<formType>) {
    setIsLoading(true)

    try {
      if (isSignIn) {
        const { email } = values
        const res = await signInAccount({ email })
        if (res.code != -1) {
          setAccountId(res.accountId)
          toast.success("登录验证邮件已发送")
        } else {
          toast.error(res.message)
        }
      } else {
        const { email, fullName } = values as SignUpFormValues
        const res = await createAccount({ email, fullName })
        if (res.code != -1) {
          setAccountId(res.accountId)
          toast.success("注册验证邮件已发送")
          // router.replace("/sign-in")
        } else {
          toast.error(res.message)
        }

      }
    } catch (error: any) {
      toast.error(error.message || "操作失败，请重试")
    } finally {
      setIsLoading(false)
    }
  }
  // 获取表单当前值
  const formValues = form.watch()
  
  const [accountId, setAccountId] = useState("")
  return (

    <div className='w-full max-w-md mx-auto'>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold'>{isSignIn ? "欢迎回来" : "创建账户"}</h1>
        <p className='text-muted-foreground mt-2'>
          {isSignIn ? "请登录您的账户继续" : "填写信息创建新账户"}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>邮箱地址</FormLabel>
                <FormControl>
                  <Input
                    placeholder="example@domain.com"
                    type="email"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!isSignIn && (
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>姓名</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="请输入您的姓名"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button
            className='w-full bg-primary hover:bg-primary/90'
            type="submit"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isSignIn ? "发送验证码..." : "注册中..."}
              </span>
            ) : (
              isSignIn ? "获取验证码" : "注册"
            )}
          </Button>

          <div className='text-center mt-4'>
            <span className='text-muted-foreground'>
              {isSignIn ? "还没有账户？" : "已有账户？"}
            </span>
            <Link
              href={isSignIn ? "/sign-up" : "/sign-in"}
              className='text-primary font-medium hover:underline ml-2'
            >
              {isSignIn ? "注册" : "登录"}
            </Link>
          </div>
        </form>
      </Form>
      <div className='text-center'>
        <p className='text-muted-foreground mt-2'>
          or
        </p>
        <OTPModel />
        {accountId ? <VerifyEmail email={formValues.email} fullName={isSignIn ? undefined : (formValues as SignUpFormValues).fullName!} accountId={accountId} /> : ""}
      </div>
    </div>

  )
}