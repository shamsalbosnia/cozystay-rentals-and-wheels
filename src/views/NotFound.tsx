'use client';

import Link from "next/link";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/home/FooterSection";

const NotFound = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Oops! Page not found</p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link 
            href="/" 
            className="text-blue-500 hover:text-blue-700 underline"
          >
            Return to Home
          </Link>
          <Link 
            href="/admin" 
            className="text-blue-500 hover:text-blue-700 underline"
          >
            Go to Admin Dashboard
          </Link>
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default NotFound;
