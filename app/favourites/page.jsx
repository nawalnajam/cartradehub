"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Heart, MapPin, Fuel, Settings2, Trash2, Eye, Calendar, Loader2 } from "lucide-react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
  .fav-page { font-family: 'Plus Jakarta Sans', sans-serif; min-height: 100vh; }
  .hph { font-family: 'Outfit', sans-serif; }
  .fav-card { background: rgba(255,255,255,0.9); backdrop-filter: blur(10px); border: 1px solid rgba(14,165,233,0.15); border-radius: 20px; overflow: hidden; transition: all 0.3s ease; cursor: pointer; }
  .fav-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(14,165,233,0.12); border-color: rgba(14,165,233,0.3); }
`;

export default function FavouritesPage() {
  const router = useRouter();
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/signin"); return; }
    fetchFavourites();
  }, []);

  const fetchFavourites = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/user/favourites", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setFavourites(data.favourites || []);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const removeFavourite = async (carId) => {
    setRemoving(prev => ({ ...prev, [carId]: true }));
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/user/favourites?carId=${carId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setFavourites(favourites.filter(car => car._id !== carId));
    } catch (error) { console.error(error); }
    finally { setRemoving(prev => ({ ...prev, [carId]: false })); }
  };

  if (loading) return (<div className="fav-page"><Navbar /><div className="flex justify-center items-center h-60"><Loader2 size={40} className="animate-spin text-sky-500" /></div></div>);

  return (
    <>
      <style>{STYLES}</style>
      <div className="fav-page">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="mb-8"><div className="flex items-center gap-3 mb-2"><div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r from-sky-500 to-emerald-500"><Heart size={20} className="text-white fill-white" /></div><h1 className="hph text-3xl font-bold text-gray-800">My Favourites</h1></div><p className="text-gray-500 ml-14">{favourites.length} saved {favourites.length === 1 ? "car" : "cars"}</p></div>
          {favourites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center"><div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 bg-gray-100"><Heart size={40} className="text-gray-300" /></div><h2 className="text-2xl font-semibold text-gray-800 mb-3">No Favourites Yet</h2><p className="text-gray-500 mb-8">Add your favourite cars to see them here</p><button onClick={() => router.push("/cars")} className="px-8 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-semibold transition hover:scale-105">Browse Cars</button></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favourites.map((car) => (
                <div key={car._id} className="fav-card group" onClick={() => router.push(`/cars/${car._id}`)}>
                  <div className="relative h-48 overflow-hidden"><img src={car.images?.[0] || "/placeholder.png"} alt={car.model} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" /><button onClick={(e) => { e.stopPropagation(); removeFavourite(car._id); }} disabled={removing[car._id]} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500/90 flex items-center justify-center transition hover:scale-110">{removing[car._id] ? <Loader2 size={14} className="animate-spin text-white" /> : <Trash2 size={14} className="text-white" />}</button><div className="absolute bottom-3 left-3 px-2 py-1 rounded-lg text-xs font-semibold text-white bg-black/60">{car.condition || "Used"}</div></div>
                  <div className="p-4"><h3 className="hph font-bold text-gray-800 text-lg">{car.brand} {car.model}</h3><p className="text-xl font-bold mb-2 bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">PKR {Number(car.price).toLocaleString()}</p><div className="flex flex-wrap gap-2 mb-4"><span className="flex items-center gap-1 text-xs text-gray-500"><Calendar size={11} />{car.year}</span><span className="flex items-center gap-1 text-xs text-gray-500"><Fuel size={11} />{car.fuelType || "—"}</span><span className="flex items-center gap-1 text-xs text-gray-500"><Settings2 size={11} />{car.transmission || "—"}</span><span className="flex items-center gap-1 text-xs text-gray-500"><MapPin size={11} />{car.location || "—"}</span></div><button className="w-full py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-emerald-500 transition hover:opacity-90"><Eye size={14} className="inline mr-2" />View Details</button></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}