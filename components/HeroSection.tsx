/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight, FaLeaf } from 'react-icons/fa';

const HeroSection = () => {
  const images = [
    { alt: "Monstera Plant", src: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80" },
    { alt: "Snake Plant", src: "https://images.unsplash.com/photo-1593482892290-f54927b4cbdd?auto=format&fit=crop&w=800&q=80" }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <section className="relative w-full overflow-hidden bg-[#edf7ed]">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Text Content */}
          <div className="space-y-6 animate-fade-in text-center lg:text-left">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold border border-green-200">
              <FaLeaf className="text-green-500" />
              <span>Fresh Plants, Delivered to Your Door</span>
            </div>

            <h1 className="flex flex-col space-y-1">
              <span className="font-sans text-3xl md:text-4xl lg:text-5xl text-gray-800 font-semibold leading-snug">
                Bring Nature Into
              </span>
              <span className="font-serif text-5xl md:text-6xl lg:text-7xl italic font-bold leading-tight text-green-700">
                Your Home
              </span>
              <span className="font-sans text-base md:text-lg text-gray-500 font-normal mt-2">
                Premium plants at prices you&apos;ll love
              </span>
            </h1>

            {/* Stats strip */}
            <div className="flex gap-8 justify-center lg:justify-start pt-2">
              {[
                { value: '100+', label: 'Plant Varieties', color: 'text-green-700' },
                { value: '5★', label: 'Customer Rated', color: 'text-amber-500' },
                { value: 'Free', label: 'Care Guide', color: 'text-green-600' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-yellow-400 text-yellow-900 font-bold py-3.5 px-8 rounded-full hover:bg-yellow-300 transition-all duration-300 hover:scale-105 shadow-lg shadow-yellow-900/20"
              >
                Shop Now
              </Link>
              <Link
                href="/#categories"
                className="inline-flex items-center gap-2 bg-white text-green-700 font-bold py-3.5 px-8 rounded-full border-2 border-green-300 hover:bg-green-50 transition-all duration-300"
              >
                Browse Categories
              </Link>
            </div>
          </div>

          {/* Image Carousel — hidden on mobile, visible on lg+ */}
          <div className="hidden lg:block relative w-full animate-slide-up">

            {/* Decorative ring behind image */}
            <div className="absolute -inset-3 rounded-3xl -z-10 bg-green-100 transform rotate-2" />

            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl bg-white">
              <img
                src={images[currentIndex].src}
                alt={images[currentIndex].alt}
                className="object-cover w-full h-full transition-all duration-700"
              />

              {/* Price badge overlay */}
              <div className="absolute top-5 left-5 bg-amber-400 text-amber-900 font-bold px-4 py-2 rounded-2xl text-sm shadow-md">
                From ₹999
              </div>

              {/* Carousel Controls */}
              <div className="absolute bottom-6 right-6 flex space-x-2">
                <button onClick={prevSlide} className="bg-white/90 hover:bg-white text-green-800 p-3 rounded-full shadow-md transition-all hover:scale-110" aria-label="Previous slide">
                  <FaChevronLeft size={12} />
                </button>
                <button onClick={nextSlide} className="bg-white/90 hover:bg-white text-green-800 p-3 rounded-full shadow-md transition-all hover:scale-110" aria-label="Next slide">
                  <FaChevronRight size={12} />
                </button>
              </div>

              {/* Dots */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-green-600 w-6' : 'bg-white/60 w-2.5'}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-3 border border-green-100">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <FaLeaf className="text-green-600" />
              </div>
              <div>
                <div className="text-xs text-gray-400">New Arrivals</div>
                <div className="text-sm font-bold text-green-700">Every Week!</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
