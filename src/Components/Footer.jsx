"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Instagram, 
  ChevronRight, 
  Mail, 
  MapPin, 
  Phone
} from 'lucide-react';

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "/pricing" },
        { name: "Testimonials", href: "#testimonials" },
        { name: "FAQ", href: "/faq" },
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Blog", href: "/blog" },
        { name: "Documentation", href: "/docs" },
        { name: "Learning Paths", href: "/paths" },
        { name: "Community", href: "/community" },
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Contact Us", href: "/contact" },
        { name: "Partners", href: "/partners" },
      ]
    }
  ];

  const socialLinks = [
    { icon: <Twitter size={20} />, href: "https://twitter.com" },
    { icon: <Github size={20} />, href: "https://github.com" },
    { icon: <Linkedin size={20} />, href: "https://linkedin.com" },
    { icon: <Instagram size={20} />, href: "https://instagram.com" },
  ];

  return (
    <footer className="bg-emerald-50 dark:bg-black pt-16 pb-8 border-t border-emerald-100 dark:border-emerald-900/20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-200 dark:bg-emerald-900/30 rounded-full mix-blend-multiply filter blur-[96px] opacity-30 -translate-y-1/4 translate-x-1/4"></div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-300 dark:bg-emerald-800/20 rounded-full mix-blend-multiply filter blur-[96px] opacity-20 -translate-x-1/4 -translate-y-1/4"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xl mr-3">S</div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">SkillSync</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Personalized AI-powered learning journeys to help you achieve your career goals and master new skills efficiently.
            </p>
            <div className="space-y-3">
              <div className="flex items-center">
                <MapPin size={18} className="text-emerald-600 dark:text-emerald-400 mr-3" />
                <span className="text-gray-600 dark:text-gray-400">123 Learning Avenue, Education City</span>
              </div>
              <div className="flex items-center">
                <Mail size={18} className="text-emerald-600 dark:text-emerald-400 mr-3" />
                <a href="mailto:info@SkillSync.com" className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400">
                  info@SkillSync.com
                </a>
              </div>
              <div className="flex items-center">
                <Phone size={18} className="text-emerald-600 dark:text-emerald-400 mr-3" />
                <a href="tel:+1234567890" className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400">
                  +1 (234) 567-890
                </a>
              </div>
            </div>
          </div>
          
          {/* Links columns */}
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center"
                    >
                      <ChevronRight size={14} className="mr-2" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Bottom bar with copyright and social links */}
        <div className={`pt-8 mt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <p className="text-gray-600 dark:text-gray-400 text-sm text-center md:text-left">
            © {currentYear} SkillSync. All rights reserved.
          </p>
          
          <div className="flex space-x-4">
            {socialLinks.map((link, i) => (
              <a 
                key={i} 
                href={link.href}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors border border-gray-200 dark:border-gray-700"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;