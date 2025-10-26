"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { CornerUpLeft, Star } from "lucide-react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  display: "swap",
});

export default function RatingPage() {
  const [user, setUser] = useState<any>(null);
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [average, setAverage] = useState<number | null>(null);
  const [totalVotes, setTotalVotes] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) setUser(session.user);
    })();
  }, []);
  async function fetchAverage() {
    const { data, error } = await supabase.from("Ratings").select("rating");
    if (error) {
      console.error(error);
      return;
    }
    if (data && data.length > 0) {
      const total = data.reduce((sum, r) => sum + r.rating, 0);
      setAverage(total / data.length);
      setTotalVotes(data.length);
    } else {
      setAverage(0);
      setTotalVotes(0);
    }
  }

  useEffect(() => {
    fetchAverage();
  }, []);

  async function handleRate(value: number) {
    if (!user) {
      alert("Please sign in to rate the shop.");
      return;
    }

    const { error } = await supabase.from("Ratings").upsert(
      [
        {
          user_id: user.id,
          rating: value,
        },
      ],
      { onConflict: "user_id" }
    );

    if (error) {
      console.error("Rating error:", error);
    } else {
      setRating(value);
      fetchAverage();
    }
  }

  return (
    <div
      className={`${poppins.className} min-h-screen bg-neutral-900 text-gray-200 flex flex-col`}
    >
      <div className="flex justify-between items-center w-full px-6 py-4 border-b border-neutral-700 shadow-lg shadow-neutral-900 bg-neutral-900">
        <Link href="/" className="cursor-default">
          <div
            className="border border-green-500 bg-green-500 text-white font-medium px-4 py-2 rounded-lg flex flex-row gap-2 items-center 
      hover:bg-green-600 hover:border-green-600 hover:shadow-lg hover:shadow-green-500/40 
      hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <CornerUpLeft size={18} />
            Home
          </div>
        </Link>
        <div className="text-2xl font-semibold text-white tracking-wide">
          Rating
        </div>
      </div>
      <div className="flex items-center justify-center h-svh">
        <div className="bg-neutral-800 p-8 rounded-2xl shadow-xl shadow-neutral-950 w-[90%] md:w-[400px] text-center">
          <h1 className="text-2xl font-semibold mb-6 text-white">
            Rate My Shop
          </h1>
          <div className="flex justify-center mb-4">
            {[1, 2, 3, 4, 5].map((value) => (
              <Star
                key={value}
                size={36}
                className={`cursor-pointer transition-all ${
                  value <= (hover || rating)
                    ? "fill-yellow-400 text-yellow-400 scale-110"
                    : "text-gray-500"
                }`}
                onClick={() => handleRate(value)}
                onMouseEnter={() => setHover(value)}
                onMouseLeave={() => setHover(0)}
              />
            ))}
          </div>
          <div className="mt-4 text-lg text-gray-300">
            {average ? (
              <>
                Average Rating:{" "}
                <span className="text-yellow-400 font-semibold">
                  {average.toFixed(1)} / 5
                </span>
                <div className="text-sm text-gray-500 mt-1">
                  ({totalVotes} votes)
                </div>
              </>
            ) : (
              <div>No ratings yet</div>
            )}
          </div>

          <div className="mt-8 text-sm text-gray-400">
            Click on the stars to leave your rating ✨
          </div>
        </div>
      </div>
    </div>
  );
}
