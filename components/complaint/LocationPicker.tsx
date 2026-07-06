"use client";

import { useState } from "react";

interface LocationPickerProps {
  onLocationSelect: (latitude: number, longitude: number) => void;
}

export default function LocationPicker({
  onLocationSelect,
}: LocationPickerProps) {
  const [loading, setLoading] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setLatitude(lat);
        setLongitude(lng);

        onLocationSelect(lat, lng);

        setLoading(false);
      },
      (error) => {
        console.error(error);
        alert("Unable to fetch your location.");
        setLoading(false);
      }
    );
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={getCurrentLocation}
        className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
      >
        {loading ? "Getting Location..." : "Use Current Location"}
      </button>

      {latitude !== null && longitude !== null && (
        <div className="rounded border p-3">
          <p>
            <strong>Latitude:</strong> {latitude}
          </p>

          <p>
            <strong>Longitude:</strong> {longitude}
          </p>
        </div>
      )}
    </div>
  );
}