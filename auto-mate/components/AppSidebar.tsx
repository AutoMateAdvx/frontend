"use client"
import { usePathname } from 'next/navigation'
import {
  Home,
  Inbox,
  Calendar,
  Search,
  Settings,
  Link as LucideLink,
  LayoutDashboard,
  FolderArchive,
  Image as ImageIcon,
  Video,
  MoreHorizontal,
  LogOut
} from 'lucide-react'
import React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem
} from './ui/sidebar'
import Image from 'next/image'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { DropdownMenuLabel } from '@radix-ui/react-dropdown-menu'
import { Button } from './ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils' // 假设您有一个工具类库
import FileUploader from './FileUploader'

const items = [
  {
    title: "看板",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "文档",
    url: "/documents",
    icon: FolderArchive,
  },
  {
    title: "图片",
    url: "/images",
    icon: ImageIcon,
  },
  {
    title: "视频",
    url: "/videos",
    icon: Video,
  },
  {
    title: "其他",
    url: "/others",
    icon: MoreHorizontal,
  },
]

interface Props {
  fullName: string
  avatar: string
  email: string
}

function AppSidebar({ fullName, avatar, email }: Props) {
  const pathname = usePathname()

  return (
    <Sidebar className="w-64 border-r">
      <SidebarHeader className="p-4 border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link className='text-2xl font-bold' href={"/"}>文件处理</Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url ||
                  (item.url !== '/' && pathname.startsWith(item.url))

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "flex items-center font-semibold gap-3 p-6",
                        isActive ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"
                      )}
                    >
                      <Link href={item.url}>
                        <item.icon className={cn(
                          "w-10 h-10",
                          isActive ? "text-blue-600" : "text-gray-500"
                        )} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>


      </SidebarContent>
      <SidebarFooter>
        <FileUploader ownId={"undefined"} accountId={"undefined"}/>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
            设置
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className='my-auto'>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "flex items-center gap-3 px-4 py-2",
                    pathname === '/settings' ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"
                  )}
                >
                  <Link href="/settings">
                    <Settings className={cn(
                      "w-5 h-5",
                      pathname === '/settings' ? "text-blue-600" : "text-gray-500"
                    )} />
                    <span>设置</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "flex items-center gap-3 px-4 py-2",
                    pathname === '/search' ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"
                  )}
                >
                  <Link href="/search">
                    <Search className={cn(
                      "w-5 h-5",
                      pathname === '/search' ? "text-blue-600" : "text-gray-500"
                    )} />
                    <span>搜索</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarMenu>

          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <section className='flex p-4 text-start gap-3'>
                  <Button className="relative w-10 h-10 rounded-full overflow-hidden">
                    {avatar ? (
                      <Image
                        src={avatar}
                        alt="用户头像"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-lg font-medium">
                          {fullName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </Button>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{fullName}</p>
                    <p className="text-sm text-gray-500 truncate">{email}</p>
                  </div>
                </section>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={"end"}>
                <DropdownMenuLabel>我的账户</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  个人信息
                </DropdownMenuItem>
                <DropdownMenuItem>
                  账单
                </DropdownMenuItem>
                <DropdownMenuItem variant={"destructive"}>
                  <LogOut />退出
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar