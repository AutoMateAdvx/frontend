"use client"
import React from 'react'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from './ui/breadcrumb'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

function AppCrumb() {
  const pathname = usePathname()
  
  // 将路径分割成数组
  const pathSegments = pathname.split('/').filter(segment => segment !== '')
  
  // 构建面包屑项
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/')
    const isLast = index === pathSegments.length - 1
    
    return {
      name: segment.charAt(0).toUpperCase() + segment.slice(1), // 首字母大写
      href,
      isLast
    }
  })

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* 首页链接 */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {/* 动态生成面包屑项 */}
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {crumb.isLast ? (
                <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={crumb.href}>{crumb.name}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default AppCrumb