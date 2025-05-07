"use client"
import Features from "@/Components/Features";
import Hero from "@/Components/Hero";
import Navbar from "@/Components/Navbar";
import Testimonials from "@/Components/Testimonial";
import Cta from "@/Components/Cta";
import Footer from "@/Components/Footer"; 


export default function Home() {
  return (
    <>
      <Navbar/>
      <Hero/>
      <Features/>
      <Testimonials/>
      <Cta/>
      <Footer/>
    </>
  );
}
