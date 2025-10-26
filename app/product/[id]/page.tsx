"use client";

import Image from "next/image";
import { Poppins } from "next/font/google";
import { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabaseClient";
import React from "react";
import {
  Apple,
  BellRing,
  Cpu,
  Heart,
  Menu,
  PanelBottom,
  PenLine,
  PhoneOutgoing,
  Save,
  SearchSlash,
  ShieldUser,
  ShoppingBasket,
  SquareUser,
  Star,
  User,
  WalletCards,
  X,
} from "lucide-react";
import Link from "next/link";
import { platform } from "os";

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
  platform: string;
}
interface Cart {
  id: number;
  Name: string;
  Price: number;
  Stock: number;
  Image_Url: string;
  platform: string;
}

export default function Home({ params }: { params: { id: number } }) {
  const { id } = React.use(params);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [stock, setStock] = useState("1");
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showC, setShowC] = useState(false);
  const [showM, setShowM] = useState(false);
  const [showP, setShowP] = useState(false);
  const [showS, setShowS] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [likedProducts, setLikedProducts] = useState<number[]>([]);
  const [savedProducts, setSavedProducts] = useState<number[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<number[]>([]);

  function convertImgurUrl(url?: string | null): string {
    if (!url || url.trim() === "") {
      return "/placeholder.png";
    }

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
      if (!session) {
        router.push("/Signin");
      }
    })();
  }, []);
  useEffect(() => {
    const ProductsView = async () => {
      const { data, error } = await supabase
        .from("Products")
        .select("*")
        .eq("id", id);

      if (error) console.log(error);
      if (data) setProducts(data);
    };

    ProductsView();
  });
  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      }
    })();
  }, []);
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

  async function SaveCart(product: Cart) {
    const { data, error } = await supabase.from("Cart").insert([
      {
        user_id: user.id,
        Name: product.Name,
        Price: product.Price,
        Stock: stock,
        Product_id: product.id,
        Images_Url: product.Image_Url,
        platform: product.platform,
      },
    ]);

    if (error) console.log(error);
    if (data) console.log(data);
  }

  return (
    <div
      className={`${poppins.className} bg-neutral-800 min-h-screen text-gray-400 p-1 cursor-default select-none`}
    >
      <div
        className="flex flex-col items-center justify-center mt-10"
        onClick={(e) => e.stopPropagation()}
      >
        {products.map((product, index) => (
          <div
            key={index}
            className=""
            onClick={() => router.push(`/product/${product.id}`)}
          >
            <div className="flex flex-col items-center">
              <Image
                src={convertImgurUrl(product.Image_Url)}
                alt=""
                width={600}
                height={100}
                className="rounded-full md:w-[600px] w-[350px] border-3 hover:scale-105 transition-all border-neutral-600 m-5"
              />
            </div>

            <div className="text-2xl m-10">{product.Name}</div>

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
                <div className="text-xl flex flex-row items-center gap-2">
                  Stock:{" "}
                  <span className="text-gray-400 text-sm">
                    <input
                      type="number"
                      className="w-10 border-1 border-neutral-600 focus:outline-0 m-1 rounded-md h-6 text-center"
                      value={stock}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        if (/^\d{0,3}$/.test(newValue)) {
                          setStock(newValue);
                        }
                      }}
                    />
                  </span>
                </div>
                <div className="text-xl flex flex-row items-center gap-2">
                  Platform:{" "}
                  <span className="text-blue-400 font-bold text-lg ">
                    {product.platform === "Apple" ? (
                      <div className="flex flex-row items-center gap-2">
                        {product.platform}
                        <Apple size={15} />
                      </div>
                    ) : (
                      <div className="flex flex-row items-center gap-2">
                        {product.platform}
                        <Cpu size={15} />
                      </div>
                    )}
                  </span>
                </div>
              </div>

              <div className="flex flex-row items-center gap-4">
                <div
                  className={`p-2 rounded-md transition-all border border-blue-400 ${
                    savedProducts.includes(product.id)
                      ? "bg-blue-400 text-white"
                      : "hover:bg-blue-400 hover:text-white"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    SaveProducts(product);
                  }}
                >
                  <Save size={15} />
                </div>
                <div
                  className={`p-2 rounded-md transition-all border border-red-400 ${
                    likedProducts.includes(product.id)
                      ? "bg-red-400 text-white"
                      : "hover:bg-red-400 hover:text-white"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    LikedItems(product);
                  }}
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
            <div
              className="flex items-center justify-center mt-10 mb-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                onClick={() => SaveCart(product)}
                className="text-lg flex flex-row items-center gap-2 border-1 border-neutral-600 w-[60%] justify-center p-2 rounded-lg shadow-lg shadow-neutral-600 hover:bg-neutral-600 hover:scale-105 active:scale-95 transition-all"
              >
                <WalletCards size={20} /> Add Cart
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
