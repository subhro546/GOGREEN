/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const HeroSection = () => {
  const images = [
    { alt: "Potted Monstera Plant", src: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80" },
    { alt: "Potted Snake Plant", src: "https://images.unsplash.com/photo-1593482892290-f54927b4cbdd?auto=format&fit=crop&w=800&q=80" }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  return (
    <section className="relative w-full bg-brand-hero py-20 lg:py-32 overflow-hidden flex items-center justify-center">
      {/* Optional decorative background elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
         {/* Placeholder for "abstract_green_shapes_and_leaves.svg" */}
         <div className="absolute top-10 right-10 w-64 h-64 bg-brand-topbar rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
         <div className="absolute top-0 -left-4 w-72 h-72 bg-brand-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="space-y-6 animate-fade-in text-center lg:text-left">
            <h1 className="flex flex-col space-y-2">
              <span className="font-sans text-3xl md:text-4xl lg:text-5xl text-text-dark font-medium leading-snug">
                Wide Range of Plants at
              </span>
              <span className="font-serif text-5xl md:text-6xl lg:text-7xl text-brand-secondary italic mt-2">
                Affordable Prices
              </span>
            </h1>
            
            <div className="pt-8">
              <Link href="/shop" className="inline-block bg-brand-secondary text-white font-bold py-4 px-10 rounded-full hover:bg-brand-topbar transition-all duration-300 transform hover:scale-105 shadow-lg">
                Shop Now
              </Link>
            </div>
          </div>

          {/* Image Carousel */}
          <div className="relative w-full max-w-lg mx-auto lg:max-w-none animate-slide-up">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl bg-white border border-brand/10">
              <img 
                src={images[currentIndex].src} 
                alt={images[currentIndex].alt}
                className="object-cover w-full h-full transition-all duration-500"
              />
              
              {/* Carousel Controls */}
              <div className="absolute bottom-6 right-6 flex space-x-3">
                <button 
                  onClick={prevSlide}
                  className="bg-white/80 hover:bg-white text-brand-dark p-3 rounded-full backdrop-blur-sm shadow-md transition-all"
                  aria-label="Previous slide"
                >
                  <FaChevronLeft />
                </button>
                <button 
                  onClick={nextSlide}
                  className="bg-white/80 hover:bg-white text-brand-dark p-3 rounded-full backdrop-blur-sm shadow-md transition-all"
                  aria-label="Next slide"
                >
                  <FaChevronRight />
                </button>
              </div>

              {/* Dots */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                {images.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-6' : 'bg-white/50'}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
            
            {/* Decorative background shape for image */}
            <div className="absolute -inset-4 bg-brand-secondary/10 rounded-3xl -z-10 transform rotate-3"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
