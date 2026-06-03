/* eslint-disable @next/next/no-img-element */
"use client";

import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { useState } from "react";
import { FaSearch, FaCalendarAlt, FaUser } from "react-icons/fa";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  image: string;
}

export default function BlogPage() {
  const allPosts: BlogPost[] = [
    {
      id: "1",
      title: "The Ultimate Guide to Watering Your Monstera Deliciosa",
      excerpt: "Monstera plants love humidity, but overwatering can be deadly. Learn the signs of overwatering and how to set a healthy watering schedule.",
      category: "Plant Care",
      date: "May 28, 2026",
      author: "Emma Watson",
      image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "2",
      title: "5 Indestructible Low-Light Houseplants for Beginners",
      excerpt: "No windows? No problem. These five robust indoor plants, including the ZZ Plant and Snake Plant, will thrive even in dark corners.",
      category: "Beginners",
      date: "May 24, 2026",
      author: "David Attenborough",
      image: "https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "3",
      title: "How to Repot Your Rootbound Houseplants Safely",
      excerpt: "Repotting can be stressful for plants. Follow our step-by-step nursery guide to transfer your plant into its new pot without root shock.",
      category: "Repotting",
      date: "May 15, 2026",
      author: "Sophia Green",
      image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "4",
      title: "Common Signs Your Plant Needs More Sunlight",
      excerpt: "Is your plant dropping leaves or growing leggy? Discover how houseplants communicate their light deficiencies and how to correct them.",
      category: "Plant Care",
      date: "May 08, 2026",
      author: "Emma Watson",
      image: "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "5",
      title: "Creating a Humidity Oasis: Tips for Tropical Plants",
      excerpt: "Ferns and Calatheas need extra humidity to keep their leaf tips from turning brown. Here are easy ways to increase humidity in dry air.",
      category: "Tropicals",
      date: "April 29, 2026",
      author: "Sophia Green",
      image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "6",
      title: "The Beginners Guide to Liquid Fertilizers",
      excerpt: "Feeding your plants is crucial during the spring and summer growth cycles. Learn how to dilute and apply liquid nutrients safely.",
      category: "Beginners",
      date: "April 22, 2026",
      author: "David Attenborough",
      image: "https://images.unsplash.com/photo-1593482892290-f54927b4cbdd?auto=format&fit=crop&w=600&q=80"
    }
  ];

  const categories = ["All", "Plant Care", "Beginners", "Repotting", "Tropicals"];
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = allPosts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-brand-hero min-h-screen pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-secondary italic mb-4">
              Green Blog
            </h1>
            <p className="text-text-dark/70 text-lg max-w-2xl mx-auto">
              Nursery-tested tips, guides, and care advice written by our horticulturists to help you make your plants thrive.
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-12">
            {/* Category Tags */}
            <div className="flex gap-2 flex-wrap justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                    selectedCategory === cat
                      ? "bg-brand-secondary text-white scale-105"
                      : "bg-white text-brand-secondary border border-brand/5 hover:bg-brand-hero"
                  }`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-3 rounded-xl border border-text-dark/15 focus:outline-none focus:ring-2 focus:ring-brand-secondary bg-white text-sm"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dark/40">
                <FaSearch />
              </span>
            </div>
          </div>

          {/* Blog Grid */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-brand/5 shadow-sm">
              <span className="text-4xl mb-4 block">🔍</span>
              <h3 className="text-xl font-bold text-brand-secondary">No articles found</h3>
              <p className="text-text-dark/60 mt-2">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article 
                  key={post.id}
                  className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-brand/5 flex flex-col group"
                >
                  {/* Blog Image */}
                  <div className="relative aspect-video bg-brand-hero overflow-hidden">
                    <img 
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-4 left-4 bg-brand-secondary text-white text-xxs font-bold px-3 py-1 rounded-full">
                      {post.category.toUpperCase()}
                    </span>
                  </div>

                  {/* Blog Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-xs text-text-dark/50 mb-3 font-medium">
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaUser />
                          {post.author}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-serif font-bold text-text-dark group-hover:text-brand-secondary transition-colors mb-3 leading-snug">
                        {post.title}
                      </h3>
                      
                      <p className="text-text-dark/70 text-sm line-clamp-3 mb-6">
                        {post.excerpt}
                      </p>
                    </div>

                    <button 
                      onClick={() => alert(`Reading article: "${post.title}" (Mock Read Flow)`)}
                      className="text-brand-secondary hover:text-brand-topbar font-bold text-sm text-left flex items-center gap-1.5 mt-auto group-hover:underline"
                    >
                      Read Article &rarr;
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
