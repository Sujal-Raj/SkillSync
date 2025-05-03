"use client"
import Link from 'next/link'
import React from 'react'

function Navbar() {
  return (
    <>
    <Link href={"/sign-up"} >Sign Up</Link>
    <Link href={"/login"} >Login</Link>
    </>

    
  )
}

export default Navbar