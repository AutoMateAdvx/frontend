import React from 'react'
// import { ThemeProvider } from '../theme-provider';
import { Toaster } from '../ui/sonner';
import { ThemeProvider } from '../theme-provider';

function BaseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <ThemeProvider storageKey="vite-ui-theme">
      <div>
        {children}
        <Toaster />
      </div>
    </ThemeProvider>
  )
}

export default BaseLayout