"use client";

import Image from "next/image";
import { Poppins } from "next/font/google";
import React, { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "../supabaseClient";
import { Heart, PanelBottom, Save } from "lucide-react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  display: "swap",
});
interface Product {
  id: number;
  Name: string;
  Price: number;
  Description: string;
  Stock: number;
  Image_Url: string;
  GitHub_Url: string;
}
interface SaveItems {
  id: number;
  SavesProducts: number;
}

export default function Home({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<any>(null);
  const [save, setSave] = useState<SaveItems[]>([]);
  const [saved, setSaved] = useState(id);
  const [liked, setLiked] = useState(id);
  const [likedProducts, setLikedProducts] = useState<number[]>([]);
  const [savedProducts, setSavedProducts] = useState<number[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<number[]>([]);
  const router = useRouter();

  function convertImgurUrl(url: string): string {
    if (
      url.startsWith("https://imgur.com/") &&
      url.length > "https://imgur.com/".length
    ) {
      const code = url.substring("https://imgur.com/".length);
      return `https://i.imgur.com/${code}.jpeg`;
    }
    return url;
  }

  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.push("/products");
      } else {
        router.push("/Signin");
      }
    })();
  }, []);
  useEffect(() => {
    const ProductsView = async () => {
      const { data, error } = await supabase
        .from("Products")
        .select("*")
        .order("id", { ascending: false });

      if (error) console.log(error);
      if (data) setProducts(data);
    };

    ProductsView();
  });
  useEffect(() => {
    const GetUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    GetUser();
  }, []);
  useEffect(() => {
    if (!user) return;

    const Saved = async () => {
      const { data, error } = await supabase
        .from("SaveProducts")
        .select("products_id")
        .eq("user_id", user.id);

      if (!error && data) {
        setSavedProducts(data.map((item) => Number(item.products_id)));
      }
    };

    Saved();
  }, [user]);
  useEffect(() => {
    if (!user) return;

    const Liked = async () => {
      const { data, error } = await supabase
        .from("LikedProducts")
        .select("products_id")
        .eq("user_id", user.id);

      if (!error && data) {
        setLikedProducts(data.map((item) => Number(item.products_id)));
      }
    };

    Liked();
  }, [user]);
  useEffect(() => {
    if (!user) return;

    const FAV = async () => {
      const { data, error } = await supabase
        .from("FavoriteProducts")
        .select("products_id")
        .eq("user_id", user.id);

      if (!error && data) {
        setFavoriteProducts(data.map((item) => Number(item.products_id)));
      }
    };

    FAV();
  }, [user]);

  if (products.length === 0)
    return (
      <div
        className={`${poppins.className} bg-neutral-800 min-h-screen text-gray-400 p-1 cursor-default select-none`}
      >
        <div className="flex justify-center items-center m-10">
          <div className="text-white text-3xl">Product not found.</div>
        </div>
      </div>
    );

  async function SaveProducts(product: Product) {
    if (!user) return;

    const isSaved = savedProducts.includes(product.id);

    if (isSaved) {
      const { error } = await supabase
        .from("SaveProducts")
        .delete()
        .eq("user_id", user.id)
        .eq("products_id", product.id);

      if (error) {
        console.log(error);
        return;
      }
      setSavedProducts((prev) => prev.filter((id) => id !== product.id));
      console.log("Proizvod uklonjen iz sačuvanih ❌");
    } else {
      const { error } = await supabase.from("SaveProducts").insert({
        user_id: user.id,
        products_id: product.id,
      });

      if (error) {
        console.log(error);
        return;
      }
      setSavedProducts((prev) => [...prev, product.id]);
      console.log("Proizvod sačuvan ✅");
    }
  }
  async function LikedItems(product: Product) {
    if (!user) return;

    const isLiked = likedProducts.includes(product.id);

    if (isLiked) {
      // Ako je već lajkovano → obriši iz baze
      const { error } = await supabase
        .from("LikedProducts")
        .delete()
        .eq("user_id", user.id)
        .eq("products_id", product.id);

      if (error) {
        console.log(error);
        return;
      }

      // Ukloni iz state-a
      setLikedProducts((prev) => prev.filter((id) => id !== product.id));
      console.log("Lajk uklonjen ❌");
    } else {
      // Ako nije lajkovano → dodaj u bazu
      const { error } = await supabase.from("LikedProducts").insert({
        user_id: user.id,
        products_id: product.id,
      });

      if (error) {
        console.log(error);
        return;
      }

      // Dodaj u state
      setLikedProducts((prev) => [...prev, product.id]);
      console.log("Proizvod lajkovan ❤️");
    }
  }
  async function FavoriteItems(product: Product) {
    if (!user) return;

    const isFavorite = favoriteProducts.includes(product.id);

    if (isFavorite) {
      const { error } = await supabase
        .from("FavoriteProducts")
        .delete()
        .eq("user_id", user.id)
        .eq("products_id", product.id);

      if (error) {
        console.log(error);
        return;
      }

      setFavoriteProducts((prev) => prev.filter((id) => id !== product.id));
      console.log("Lajk uklonjen ❌");
    } else {
      const { error } = await supabase.from("FavoriteProducts").insert({
        user_id: user.id,
        products_id: product.id,
      });

      if (error) {
        console.log(error);
        return;
      }
      setFavoriteProducts((prev) => [...prev, product.id]);
      console.log("Proizvod lajkovan ❤️");
    }
  }

  return (
    <div
      className={`${poppins.className} bg-neutral-800 min-h-screen text-gray-400 p-1 cursor-default select-none`}
    >
      <div className="grid grid-cols-5 gap-5 m-5">
        {products && products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="border border-neutral-600 p-2 rounded-md hover:scale-105 active:scale-95 transition-all"
              onClick={() => router.push(`/product/${product.id}`)}
            >
              <div className="flex flex-col items-center">
                <Image
                  src={convertImgurUrl(product.Image_Url)}
                  alt=""
                  width={100}
                  height={100}
                  className="rounded-lg m-5"
                />
              </div>
              <div className="text-2xl m-2">{product.Name}</div>
              <div className="border-t border-neutral-600 m-3" />
              <div className="flex flex-row items-end justify-between">
                <div>
                  <div className="text-xl">
                    Price:{" "}
                    <span className="text-blue-400 font-bold text-lg">
                      {product.Price}{" "}
                      <span className="text-gray-400 font-light">$</span>
                    </span>
                  </div>
                  <div className="text-xl">
                    Stock:{" "}
                    <span className="text-blue-400 font-bold text-lg">
                      {product.Stock}
                    </span>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-4">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      SaveProducts(product);
                    }}
                    className={`p-2 rounded-md transition-all border border-blue-400 ${
                      savedProducts.includes(product.id)
                        ? "bg-blue-400 text-white"
                        : "hover:bg-blue-400 hover:text-white"
                    }`}
                  >
                    <Save size={15} />
                  </div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      LikedItems(product);
                    }}
                    className={`p-2 rounded-md transition-all border border-red-400 ${
                      likedProducts.includes(product.id)
                        ? "bg-red-400 text-white"
                        : "hover:bg-red-400 hover:text-white"
                    }`}
                  >
                    <Heart size={15} />
                  </div>
                  <div
                    className={`p-2 rounded-md transition-all border border-yellow-400 ${
                      favoriteProducts.includes(product.id)
                        ? "bg-yellow-400 text-white"
                        : "hover:bg-yellow-400 hover:text-white"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      FavoriteItems(product);
                    }}
                  >
                    <PanelBottom size={15} />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 text-lg mt-10">
            Products not found!
          </div>
        )}
      </div>
    </div>
  );
}
