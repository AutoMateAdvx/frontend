import React from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem
} from './ui/sidebar'


function AppSidebar() {

    return (
        <Sidebar className="w-180">
            <SidebarHeader className="p-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                       任务说明
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="flex-1 overflow-y-auto">
                {/* <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            className={cn(
                                                "flex items-center font-semibold gap-3 p-6"
                                            )}
                                        >

                                            <span>{item.title}</span>

                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup> */}
                <h1>hello</h1>

            </SidebarContent>
        </Sidebar>
    )
}

export default AppSidebar