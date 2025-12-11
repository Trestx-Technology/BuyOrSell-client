import { Footer } from '@/components/global/footer'
import React from 'react'
import CategoryNav from '../_components/CategoryNav'
import Navbar from '@/components/global/Navbar'

const JobsRootlayout = ({children}: {children: React.ReactNode}) => {
  return (
    <main className="bg-[#F9FAFC]">
      <Navbar className="hidden sm:flex" />
      <CategoryNav className="hidden sm:block" />
      <section className="w-full mx-auto px-4 lg:px-0">{children}</section>
      <Footer />  
    </main>
  )
}

export default JobsRootlayout
