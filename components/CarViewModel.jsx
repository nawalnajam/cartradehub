"use client";

import ImageSlider from "@/components/ImageSlider";

export default function CarViewModal({ ad, onClose }) {
  if (!ad) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-3xl rounded-2xl p-6 relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 text-xl"
        >
          ✕
        </button>

        {/* IMAGE SLIDER */}
        <ImageSlider images={ad.images || []} />

        {/* DETAILS */}
        <div className="mt-6 space-y-2">
          <h2 className="text-2xl font-bold">
            {ad.brand} {ad.model} ({ad.year})
          </h2>

          <p className="text-blue-600 font-semibold text-lg">
            PKR {ad.price}
          </p>

          <p className="text-gray-600">{ad.location}</p>
          <p className="text-sm text-gray-500">
            Posted on {new Date(ad.createdAt).toDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}