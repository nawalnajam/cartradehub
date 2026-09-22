"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  Calendar,
  Clock,
  Search,
  ChevronRight,
  BookOpen,
  Eye,
  Tag,
  ArrowUp,
  Home as HomeIcon,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  .blog-page {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
    background: linear-gradient(180deg, #ffffff 0%, #f3fcfd 100%);
  }
  .hph { font-family: 'Outfit', sans-serif; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards; }

  /* ---------------------------------------------
     Global green hover glow — cards + arrows
     --------------------------------------------- */
  .glow-card {
    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease, border-color 0.3s ease;
  }
  .glow-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.35), 0 18px 34px rgba(34, 197, 94, 0.16);
    border-color: rgba(34, 197, 94, 0.4);
  }
  .btn-arrow {
    transition: transform 0.3s ease, filter 0.3s ease, color 0.3s ease;
  }
  .btn-arrow:hover,
  button:hover .btn-arrow,
  a:hover .btn-arrow,
  .glow-hover-zone:hover .btn-arrow {
    transform: translateX(3px);
    filter: drop-shadow(0 0 6px rgba(34, 197, 94, 0.65));
    color: #22c55e;
  }

  /* ---------------------------------------------
     Hero
     --------------------------------------------- */
  .blog-hero {
    position: relative;
    height: 260px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    overflow: hidden;
    background: #072b30;
  }
  .blog-hero img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.35;
  }
  .blog-hero .hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(4,25,29,0.9) 0%, rgba(0,77,86,0.75) 100%);
  }
  .blog-hero-content { position: relative; z-index: 1; }
  .blog-hero h1 {
    font-family: 'Outfit', sans-serif;
    font-size: clamp(28px, 4vw, 40px);
    font-weight: 800;
    color: #ffffff;
    margin-bottom: 10px;
  }
  .blog-hero p {
    color: rgba(255,255,255,0.7);
    font-size: 14px;
    max-width: 460px;
    margin: 0 auto 14px;
    line-height: 1.6;
  }
  .hero-crumb {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 12.5px;
    font-weight: 600;
    color: rgba(255,255,255,0.65);
    letter-spacing: 0.02em;
  }
  .hero-crumb .current { color: #7ee8d8; }
  .glow-hover-zone { transition: color 0.3s ease; }
  .glow-hover-zone:hover { color: #4ade80; }

  @keyframes heroReveal {
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .blog-hero-content > * {
    opacity: 0;
    animation: heroReveal 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  .blog-hero-content h1 { animation-delay: 0.1s; }
  .blog-hero-content p { animation-delay: 0.24s; }
  .blog-hero-content .hero-crumb { animation-delay: 0.38s; }

  /* ---------------------------------------------
     Filters
     --------------------------------------------- */
  .category-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 6px 14px;
    border-radius: 99px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.25s ease;
    background: white;
    border: 1px solid #e2e8f0;
    color: #64748b;
  }
  .category-chip:hover {
    border-color: rgba(34, 197, 94, 0.4);
    color: #16a34a;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
  }
  .category-chip.active {
    background: linear-gradient(135deg, #00bcd4, #0097a7);
    color: white;
    border-color: transparent;
  }
  .category-chip.active:hover {
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.25), 0 0 16px rgba(34, 197, 94, 0.4);
  }

  .search-input-wrap { position: relative; }
  .search-input {
    padding: 10px 14px 10px 36px;
    border-radius: 12px;
    border: 1.5px solid #e2e8f0;
    outline: none;
    width: 100%;
    font-size: 13.5px;
    transition: all 0.2s ease;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .search-input:focus {
    border-color: #22c55e;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.14);
  }

  /* ---------------------------------------------
     Blog cards
     --------------------------------------------- */
  .blog-card {
    background: white;
    border-radius: 18px;
    overflow: hidden;
    border: 1px solid rgba(0,188,212,0.14);
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0,0,0,0.03);
  }
  .blog-card .card-img { position: relative; height: 170px; overflow: hidden; }
  .blog-card .card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
  .blog-card:hover .card-img img { transform: scale(1.08); }
  .category-tag {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 99px;
    background: #e0f7fa;
    color: #0097a7;
    font-size: 11px;
    font-weight: 700;
    margin-bottom: 10px;
  }
  .read-more-link {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    color: #0097a7;
    font-size: 12px;
    font-weight: 700;
    transition: color 0.25s ease;
  }
  .blog-card:hover .read-more-link { color: #16a34a; }

  /* ---------------------------------------------
     Footer
     --------------------------------------------- */
  .site-footer {
    position: relative;
    margin-top: 40px;
    background: linear-gradient(180deg, #072b30 0%, #04191d 100%);
    color: rgba(255,255,255,0.7);
    overflow: hidden;
  }
  .site-footer::before {
    content: '';
    position: absolute;
    top: -120px;
    right: -80px;
    width: 340px;
    height: 340px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,188,212,0.18) 0%, transparent 70%);
    pointer-events: none;
  }
  .footer-inner {
    position: relative;
    z-index: 1;
    max-width: 1280px;
    margin: 0 auto;
    padding: 56px 24px 0;
  }
  .footer-grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
    gap: 40px;
    padding-bottom: 40px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  @media (max-width: 900px) {
    .footer-grid { grid-template-columns: 1fr 1fr; row-gap: 32px; }
  }
  @media (max-width: 560px) {
    .footer-grid { grid-template-columns: 1fr; }
  }
  .footer-brand {
    font-family: 'Outfit', sans-serif;
    font-size: 20px;
    font-weight: 800;
    color: #ffffff;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }
  .footer-brand .dot { color: #00e5c7; }
  .footer-desc {
    font-size: 13px;
    line-height: 1.7;
    color: rgba(255,255,255,0.55);
    max-width: 300px;
    margin-bottom: 18px;
  }
  .footer-social { display: flex; gap: 10px; }
  .footer-social a {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.75);
    transition: all 0.25s ease;
  }
  .footer-social a:hover {
    background: rgba(34, 197, 94, 0.14);
    border-color: rgba(34, 197, 94, 0.45);
    color: #4ade80;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.14), 0 0 18px rgba(34, 197, 94, 0.45);
    transform: translateY(-2px);
  }
  .footer-heading {
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #ffffff;
    margin-bottom: 18px;
  }
  .footer-links { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }
  .footer-links a {
    position: relative;
    display: inline-flex;
    align-items: center;
    padding: 2px 4px;
    margin: -2px -4px;
    border-radius: 8px;
    font-size: 13.5px;
    color: rgba(255,255,255,0.55);
    text-decoration: none;
    transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
    cursor: pointer;
  }
  .footer-links a:hover {
    color: #4ade80;
    background: rgba(34, 197, 94, 0.1);
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.12), 0 0 14px rgba(34, 197, 94, 0.4);
    transform: translateX(3px);
  }
  .footer-contact-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 13px;
    color: rgba(255,255,255,0.6);
    margin-bottom: 14px;
    line-height: 1.5;
  }
  .footer-contact-item svg { color: #00bcd4; margin-top: 2px; flex-shrink: 0; }
  .footer-bottom {
    position: relative;
    z-index: 1;
    max-width: 1280px;
    margin: 0 auto;
    padding: 20px 24px 24px;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
    justify-content: space-between;
    font-size: 12.5px;
    color: rgba(255,255,255,0.4);
  }
  .footer-bottom-links { display: flex; gap: 18px; }
  .footer-bottom-links a { color: rgba(255,255,255,0.4); text-decoration: none; transition: color 0.2s ease; }
  .footer-bottom-links a:hover { color: rgba(255,255,255,0.75); }

  /* ---------------------------------------------
     Scroll-to-top arrow
     --------------------------------------------- */
  @keyframes scrollGlowPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.45), 0 4px 18px rgba(0,0,0,0.15); }
    50% { box-shadow: 0 0 0 8px rgba(34, 197, 94, 0), 0 4px 18px rgba(0,0,0,0.15); }
  }
  .scroll-top-btn {
    position: fixed;
    bottom: 26px;
    right: 26px;
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: linear-gradient(135deg, #00bcd4, #0097a7);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(34, 197, 94, 0.5);
    cursor: pointer;
    z-index: 50;
    animation: scrollGlowPulse 2.2s ease-in-out infinite;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .scroll-top-btn:hover {
    transform: translateY(-4px) scale(1.06);
    box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.3), 0 0 22px rgba(34, 197, 94, 0.6), 0 8px 20px rgba(0,0,0,0.2);
  }
  .scroll-top-btn svg { transition: transform 0.25s ease; }
  .scroll-top-btn:hover svg { transform: translateY(-2px); }
`;

const blogPosts = [
  { id: 1, title: "Top 10 Cars to Buy in Pakistan Under 3 Million PKR", excerpt: "Looking for an affordable car? Here's our comprehensive guide.", image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=250&fit=crop", date: "Apr 15, 2024", readTime: "8 min", category: "Buying Tips", views: 12500 },
  { id: 2, title: "How to Get Best Resale Value for Your Used Car", excerpt: "Expert tips to maximize your car's resale value.", image: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=400&h=250&fit=crop", date: "Apr 10, 2024", readTime: "6 min", category: "Selling Tips", views: 8900 },
  { id: 3, title: "Electric Vehicles in Pakistan: Complete Guide", excerpt: "Everything you need to know about EVs in Pakistan.", image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=250&fit=crop", date: "Apr 5, 2024", readTime: "10 min", category: "EV & Hybrid", views: 15700 },
  { id: 4, title: "Car Maintenance Checklist: Spring 2024", excerpt: "Essential maintenance tasks to keep your car running smoothly.", image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=250&fit=crop", date: "Mar 28, 2024", readTime: "5 min", category: "Maintenance", views: 6200 },
  { id: 5, title: "Toyota vs Honda: Which is Better?", excerpt: "Detailed comparison of Pakistan's most popular car brands.", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=250&fit=crop", date: "Mar 20, 2024", readTime: "7 min", category: "Car Reviews", views: 21000 },
  { id: 6, title: "Upcoming Cars in Pakistan 2024–2025", excerpt: "Exciting new launches coming to Pakistan.", image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=250&fit=crop", date: "Mar 15, 2024", readTime: "9 min", category: "Market News", views: 18300 },
  { id: 7, title: "A Complete Guide to Car Financing in Pakistan", excerpt: "Understand EMI plans, down payments, and how banks evaluate applications.", image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop", date: "Mar 8, 2024", readTime: "7 min", category: "Buying Tips", views: 9400 },
  { id: 8, title: "5 Red Flags to Watch for When Buying a Used Car", excerpt: "Avoid costly mistakes with this pre-purchase inspection checklist.", image: "https://images.unsplash.com/photo-1493238792000-8113da705763?w=400&h=250&fit=crop", date: "Feb 27, 2024", readTime: "6 min", category: "Buying Tips", views: 14100 },
  { id: 9, title: "How AI Is Changing Car Shopping in Pakistan", excerpt: "From image search to smart valuations — a look at what's next.", image: "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?w=400&h=250&fit=crop", date: "Feb 20, 2024", readTime: "5 min", category: "Market News", views: 11200 },
  { id: 10, title: "Suzuki Alto vs Cultus: Which City Car Wins?", excerpt: "A practical comparison for first-time buyers on a budget.", image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400&h=250&fit=crop", date: "Feb 12, 2024", readTime: "6 min", category: "Car Reviews", views: 16800 },
  { id: 11, title: "Winter Car Care: Preparing Your Vehicle for the Cold", excerpt: "Battery health, tyre pressure, and other seasonal must-dos.", image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=400&h=250&fit=crop", date: "Jan 30, 2024", readTime: "5 min", category: "Maintenance", views: 7300 },
  { id: 12, title: "Hybrid vs Petrol: What Actually Saves You More?", excerpt: "We break down the real cost of ownership over five years.", image: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=400&h=250&fit=crop", date: "Jan 18, 2024", readTime: "8 min", category: "EV & Hybrid", views: 13900 },
];

const categories = ["All", "Buying Tips", "Selling Tips", "Car Reviews", "Maintenance", "Market News", "EV & Hybrid"];

export default function BlogPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    let filtered = blogPosts;
    if (selectedCategory !== "All") filtered = filtered.filter((post) => post.category === selectedCategory);
    if (searchQuery) filtered = filtered.filter((post) => post.title.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredPosts(filtered);
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <style>{STYLES}</style>
      <div className="blog-page">
        <Navbar />

        {/* Hero */}
        <div className="blog-hero">
          <img
            src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1600&q=80"
            alt="Car magazine and notebook"
          />
          <div className="hero-overlay" />
          <div className="blog-hero-content">
            <h1>Car Trade Hub Blog</h1>
            <p>Expert insights, car reviews, and automotive news — straight from our team.</p>
            <span className="hero-crumb">
              <span
                className="glow-hover-zone"
                onClick={() => router.push("/")}
                style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}
              >
                <HomeIcon size={13} /> Home
              </span>
              <ChevronRight size={12} className="btn-arrow" /> <span className="current">Blog</span>
            </span>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`category-chip ${selectedCategory === cat ? "active" : ""}`}
                >
                  <Tag size={12} /> {cat}
                </button>
              ))}
            </div>
            <div className="search-input-wrap w-full md:w-60">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          {/* Blog Grid */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen size={48} className="mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-bold text-gray-700">No articles found</h3>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
              {filteredPosts.map((post, idx) => (
                <div
                  key={post.id}
                  className="blog-card glow-card fade-up"
                  style={{ animationDelay: `${(idx % 6) * 80}ms` }}
                  onClick={() => router.push(`/blog/${post.id}`)}
                >
                  <div className="card-img">
                    <img src={post.image} alt={post.title} />
                    <div className="absolute top-2 right-2 bg-black/55 backdrop-blur-sm px-2 py-0.5 rounded-full text-white text-xs flex items-center gap-1">
                      <Eye size={10} /> {post.views.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-4">
                    <span className="category-tag">{post.category}</span>
                    <h3 className="hph font-bold text-gray-800 text-sm mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-500 text-xs mb-3 line-clamp-2">{post.excerpt}</p>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><Calendar size={10} /> {post.date}</span>
                        <span className="flex items-center gap-1"><Clock size={10} /> {post.readTime}</span>
                      </div>
                      <span className="read-more-link">Read <ChevronRight size={12} className="btn-arrow" /></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="site-footer">
          <div className="footer-inner">
            <div className="footer-grid">
              <div>
                <div className="footer-brand">CarTradeHub<span className="dot">.</span></div>
                <p className="footer-desc">
                  Pakistan's trusted car marketplace. Every listing is checked for accuracy so buyers and sellers can deal with confidence.
                </p>
                <div className="footer-social">
                  <a href="#" aria-label="Facebook"><Facebook size={15} /></a>
                  <a href="#" aria-label="Instagram"><Instagram size={15} /></a>
                  <a href="#" aria-label="Twitter"><Twitter size={15} /></a>
                  <a href="#" aria-label="YouTube"><Youtube size={15} /></a>
                </div>
              </div>

              <div>
                <div className="footer-heading">Explore</div>
                <ul className="footer-links">
                  <li><a onClick={() => router.push("/")}>Homepage</a></li>
                  <li><a onClick={() => router.push("/cars")}>Browse Cars</a></li>
                  <li><a onClick={() => router.push("/about")}>About Us</a></li>
                  <li><a onClick={() => router.push("/contact")}>Contact Us</a></li>
                </ul>
              </div>

              <div>
                <div className="footer-heading">Categories</div>
                <ul className="footer-links">
                  <li><a onClick={() => setSelectedCategory("Buying Tips")}>Buying Tips</a></li>
                  <li><a onClick={() => setSelectedCategory("Selling Tips")}>Selling Tips</a></li>
                  <li><a onClick={() => setSelectedCategory("Car Reviews")}>Car Reviews</a></li>
                  <li><a onClick={() => setSelectedCategory("EV & Hybrid")}>EV & Hybrid</a></li>
                </ul>
              </div>

              <div>
                <div className="footer-heading">Get in Touch</div>
                <div className="footer-contact-item">
                  <Phone size={15} />
                  <span>+92 300 1234567</span>
                </div>
                <div className="footer-contact-item">
                  <Mail size={15} />
                  <span>support@cartradehub.pk</span>
                </div>
                <div className="footer-contact-item">
                  <MapPin size={15} />
                  <span>DHA Phase 8, Karachi, Pakistan</span>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} CarTradeHub. All rights reserved.</span>
            <div className="footer-bottom-links">
              <a>Privacy Policy</a>
              <a>Terms of Service</a>
              <a>Sitemap</a>
            </div>
          </div>
        </footer>

        {/* Floating scroll-to-top arrow */}
        {showScrollTop && (
          <button onClick={scrollToTop} aria-label="Scroll to top" className="scroll-top-btn">
            <ArrowUp size={20} className="btn-arrow" />
          </button>
        )}
      </div>
    </>
  );
}