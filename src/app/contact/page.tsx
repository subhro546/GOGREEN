"use client";

import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock, FaWhatsapp } from "react-icons/fa";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      alert("Please fill out all fields.");
      return;
    }
    setLoading(true);
    // Simulate API submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 1000);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-brand-hero min-h-screen pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-secondary italic mb-4">
              Contact Us
            </h1>
            <p className="text-text-dark/70 text-lg max-w-2xl mx-auto">
              Have questions about our plants, shipping, or need care advice? Get in touch with our friendly support team.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            
            {/* Contact Details Column */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-brand/5 space-y-8">
                <h3 className="text-2xl font-serif font-bold text-brand-secondary">Get In Touch</h3>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-hero text-brand-secondary rounded-xl flex items-center justify-center shrink-0 text-lg">
                    <FaPhoneAlt />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-dark text-sm">Call Us</h4>
                    <p className="text-text-dark/80 mt-1 font-medium">
                      <a href="tel:+917596811595" className="hover:underline">+91 7596811595</a>
                    </p>
                    <p className="text-xs text-text-dark/50 mt-0.5">Mon - Sat: 9 AM - 6 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-hero text-brand-secondary rounded-xl flex items-center justify-center shrink-0 text-lg">
                    <FaWhatsapp />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-dark text-sm">WhatsApp</h4>
                    <p className="text-text-dark/80 mt-1 font-medium">
                      <a 
                        href="https://wa.me/917980028176" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        +91 79800 28176
                      </a>
                    </p>
                    <p className="text-xs text-text-dark/50 mt-0.5">Chat with us directly</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-hero text-brand-secondary rounded-xl flex items-center justify-center shrink-0 text-lg">
                    <FaEnvelope />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-dark text-sm">Email Support</h4>
                    <p className="text-text-dark/80 mt-1 font-medium">
                      <a href="mailto:gogreen.nursery20@gmail.com" className="hover:underline">gogreen.nursery20@gmail.com</a>
                    </p>
                    <p className="text-xs text-text-dark/50 mt-0.5">We respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-hero text-brand-secondary rounded-xl flex items-center justify-center shrink-0 text-lg">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-dark text-sm">Nursery Location</h4>
                    <p className="text-text-dark/80 mt-1 font-medium">
                      <a 
                        href="https://www.google.com/maps/search/?api=1&query=Go+Green+Nursery+Kolkata+Maheshtala"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        Kali Nagar, South Padirhati, Makalhati Mauza
                      </a>
                    </p>
                    <p className="text-xs text-text-dark/50 mt-0.5">Kolkata, Maheshtala, West Bengal 700066</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-hero text-brand-secondary rounded-xl flex items-center justify-center shrink-0 text-lg">
                    <FaClock />
                  </div>
                  <div>
                    <h4 className="font-bold text-text-dark text-sm">Working Hours</h4>
                    <p className="text-text-dark/80 mt-1 font-medium">9:00 AM - 7:00 PM</p>
                    <p className="text-xs text-text-dark/50 mt-0.5">Open every day except Sundays</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form Column */}
            <div className="lg:col-span-2">
              <div className="bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-brand/5">
                <h3 className="text-2xl font-serif font-bold text-brand-secondary mb-8">Send Us A Message</h3>
                
                {submitted ? (
                  <div className="p-8 bg-green-50 rounded-2xl border border-green-200 text-center space-y-4">
                    <div className="text-5xl">✉️</div>
                    <h4 className="text-2xl font-bold text-green-800">Thank You!</h4>
                    <p className="text-green-700 max-w-md mx-auto">
                      Your message has been received successfully. One of our plant experts will contact you soon.
                    </p>
                    <button 
                      onClick={() => setSubmitted(false)}
                      className="mt-4 bg-brand-secondary hover:bg-brand-topbar text-white px-6 py-2.5 rounded-xl font-bold transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-text-dark/20 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-1">Email Address</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-text-dark/20 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-all"
                          placeholder="johndoe@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-1">Subject</label>
                      <input
                        type="text"
                        required
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-text-dark/20 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-all"
                        placeholder="Inquiry about Monstera plant care..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-dark mb-1">Message</label>
                      <textarea
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl border border-text-dark/20 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition-all resize-none"
                        placeholder="Write your message here..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto px-8 py-4 bg-brand-secondary text-white rounded-xl font-bold hover:bg-brand-topbar transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
