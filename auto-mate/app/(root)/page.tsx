'use client'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { getCurrentUser } from '@/lib/actions/user.action'

interface User {
  $id: string
  name: string
  email: string
  // 其他用户属性
}

export default function Home() {
  const { t } = useTranslation('common')
  return (
  <main>
    page
  </main>
  )
}