"use client";

import Image from "next/image";
import { Poppins } from "next/font/google";
import {
  ActivityIcon,
  Apple,
  BellRing,
  BookOpen,
  Camera,
  Clipboard,
  Cpu,
  CreditCard,
  Film,
  MapPin,
  Menu,
  MessageCircle,
  Newspaper,
  PenLine,
  PhoneOutgoing,
  SearchSlash,
  ShieldUser,
  ShoppingBag,
  ShoppingBasket,
  SquareUser,
  Star,
  StarHalf,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "./supabaseClient";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

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
interface Ratings {
  id: number;
  user_id: string;
  rating: number;
}

export default function Home() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const [showM, setShowM] = useState(false);
  const [showP, setShowP] = useState(false);
  const [showS, setShowS] = useState(false);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [ratings, setRating] = useState<Ratings[]>([]);
  const [user, setUser] = useState<any>(null);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.push("/");
      } else {
        router.push("/Signin");
      }
    })();
  }, []);
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
    async function SeacrhProducts() {
      const { data, error } = await supabase.from("Products").select("*");
      if (error) console.log(error);
      else setProducts(data || []);
    }
    SeacrhProducts();
  }, []);
  useEffect(() => {
    const getRating = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("Ratings")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.log(error);
      } else {
        setRating(data);
      }
    };
    getRating();
  }, [user]);
  useEffect(() => {
    const GetUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    GetUser();
  }, []);

  function InputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setFilteredProducts([]);
      setShowDropdown(false);
      return;
    }

    const matches = products.filter((p) =>
      p.Name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(matches);
    setShowDropdown(true);
  }

  function SelectProduct(id: number) {
    router.push(`/product/${id}`);
    setQuery("");
    setShowDropdown(false);
  }

  return (
    <div
      className={`${poppins.className} bg-neutral-800 min-h-screen text-gray-400 p-1 cursor-default select-none`}
    >
      <div>
        <div className="border-b border-gray-400">
          <div className="lg:flex hidden flex-row items-center justify-between">
            <div className="flex flex-row gap-4 m-2 ml-7">
              <div className="flex flex-col items-center">
                <div
                  className="hover:text-blue-400 hover:underline hover:underline-offset-4 transition-all flex flex-row items-center gap-2"
                  onMouseEnter={() => setShow(!show)}
                >
                  Contact <PhoneOutgoing size={15} />
                </div>
                <div onMouseLeave={() => setShow(!show)}>
                  {show && (
                    <div className="absolute  left-5 top-10 w-45 h-20 z-50 flex flex-col items-center rounded-md bg-neutral-700">
                      <div className="mt-2 flex flex-row items-center gap-2">
                        Conact Number <ShieldUser size={20} />
                      </div>
                      <a href="https://wa.me/381645624181" target="_blank">
                        <div className="mt-3 hover:underline">
                          +381 64 5624 181
                        </div>
                      </a>
                    </div>
                  )}
                </div>
              </div>
              <a href="https://discord.gg/BcRP8UgCyK" target="_blank">
                <div className="hover:text-blue-400 hover:underline hover:underline-offset-4 transition-all flex flex-row items-center gap-2">
                  Support <PenLine size={15} />
                </div>
              </a>
            </div>
            <div className="flex flex-row gap-5 items-center mr-7">
              <div
                onClick={() => router.push("/Rating")}
                className="hover:text-blue-400 hover:underline hover:underline-offset-4 transition-all flex flex-row items-center gap-2"
              >
                <div>Rating</div>
                <Star size={15} />
              </div>
              <div className="hover:text-blue-400 hover:underline hover:underline-offset-4 transition-all flex flex-row items-center gap-2">
                <div>Updates</div>
                <BellRing size={15} />
              </div>
              {userEmail === "akidimke136@gmail.com" && (
                <div
                  onClick={() => router.push("/admin-panel")}
                  className="hover:text-blue-400 hover:underline hover:underline-offset-4 transition-all flex flex-row items-center gap-2"
                >
                  <div className="sm:flex hidden">Admin</div>
                  <User size={15} />
                </div>
              )}
            </div>
          </div>
          <div className="flex lg:hidden">
            {showM ? (
              <div>
                <X size={20} onClick={() => setShowM(!showM)} className="m-5" />
              </div>
            ) : (
              <div>
                <Menu
                  size={20}
                  onClick={() => setShowM(!showM)}
                  className="m-5"
                />
              </div>
            )}
            {showM && (
              <div className="flex flex-row items-center justify-between w-full">
                <div className="flex flex-row gap-4 m-1">
                  <div className="flex flex-col items-center">
                    <div
                      className="hover:text-blue-400 hover:underline hover:underline-offset-4 transition-all flex flex-row items-center gap-2"
                      onMouseEnter={() => setShow(!show)}
                    >
                      Contact <PhoneOutgoing size={15} />
                    </div>
                    <div onMouseLeave={() => setShow(!show)}>
                      {show && (
                        <div className="absolute  left-10 top-12 w-45 h-20 z-50 flex flex-col items-center rounded-md bg-neutral-700">
                          <div className="mt-2 flex flex-row items-center gap-2">
                            Conact Number <ShieldUser size={20} />
                          </div>
                          <a href="https://wa.me/381645624181" target="_blank">
                            <div className="mt-3 hover:underline">
                              +381 64 5624 181
                            </div>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  <a href="https://discord.gg/H5dUpbchCb" target="_blank">
                    <div className="hover:text-blue-400 hover:underline hover:underline-offset-4 transition-all flex flex-row items-center gap-2">
                      Support <PenLine size={15} />
                    </div>
                  </a>
                </div>
                <div className="flex flex-row gap-5 items-center mr-7">
                  <div
                    onClick={() => router.push("/Rating")}
                    className="hover:text-blue-400 hover:underline hover:underline-offset-4 transition-all flex flex-row items-center gap-2"
                  >
                    <div className="sm:flex hidden">Rating</div>
                    <Star size={15} />
                  </div>
                  <div className="hover:text-blue-400 hover:underline hover:underline-offset-4 transition-all flex flex-row items-center gap-2">
                    <div className="sm:flex hidden">Updates</div>
                    <BellRing size={15} />
                  </div>
                  {userEmail === "akidimke136@gmail.com" && (
                    <div
                      onClick={() => router.push("/admin-panel")}
                      className="hover:text-blue-400 hover:underline hover:underline-offset-4 transition-all flex flex-row items-center gap-2"
                    >
                      <div className="sm:flex hidden">Admin</div>
                      <User size={15} />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex lg:flex-row flex-col items-center justify-between">
            <div className="flex flex-row items-center justify-between w-full lg:w-50">
              <div className="text-2xl m-4 animate-caret-blink ml-7">
                Instant <span className="text-blue-400">App</span>
              </div>
              <div className="flex lg:hidden flex-row items-center gap-5">
                <div className="flex flex-col items-center gap-2">
                  <AnimatePresence>
                    {showP && (
                      <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ x: 20, opacity: 0 }}
                        className="absolute top-8 text-blue-400"
                      >
                        Profile
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <a href="/Profiles">
                    <Button
                      variant="ghost"
                      onMouseEnter={() => setShowP(!showP)}
                      onMouseLeave={() => setShowP(!showP)}
                    >
                      <SquareUser />
                    </Button>
                  </a>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <AnimatePresence>
                    {showS && (
                      <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        className="absolute top-8 right-6 text-blue-400"
                      >
                        Cart
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <a href="/Cart">
                    <Button
                      variant="ghost"
                      className="mr-4"
                      onMouseEnter={() => setShowS(!showS)}
                      onMouseLeave={() => setShowS(!showS)}
                    >
                      <ShoppingBasket />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
            <div>
              <div className="relative w-full max-w-lg mx-auto">
                <div className="flex">
                  <button
                    onClick={() =>
                      filteredProducts[0] &&
                      SelectProduct(filteredProducts[0].id)
                    }
                    className="border-3 border-neutral-600 h-9 w-10 lg:mb-0 mb-4 flex
            items-center justify-center rounded-l-md hover:bg-neutral-600
            hover:scale-115 hover:shadow-md hover:shadow-neutral-600
            transition-all"
                  >
                    <SearchSlash size={15} />
                  </button>
                  <input
                    type="text"
                    value={query}
                    onChange={InputChange}
                    onFocus={() => setShowDropdown(filteredProducts.length > 0)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                    placeholder="Search for your app..."
                    className="outline-0 border-3 border-neutral-600 rounded-r-md
            xl:w-[800px] lg:w-[650px] md:w-[550px] sm:w-[450px] w-[350px]
            lg:mb-0 mb-4 h-9 text-sm indent-1 focus:borer-b-3
            focus:border-b-blue-400 focus:ring-blue-400 transition-all"
                  />
                </div>

                {showDropdown && filteredProducts.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-neutral-900 border border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => SelectProduct(p.id)}
                        className="px-4 py-2 hover:bg-blue-500 transition-all hover:text-white cursor-pointer flex flex-row items-center gap-2"
                      >
                        <div>
                          <div className="w-24 h-24 bg-neutral-700 flex items-center justify-center text-gray-400 rounded-lg">
                            {p.Name.slice(0, 2).toUpperCase()}
                          </div>
                        </div>
                        <div>{p.Name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="hidden lg:flex flex-row items-center gap-5">
              <div className="flex flex-col items-center gap-2">
                <AnimatePresence>
                  {showP && (
                    <motion.div
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ x: 20, opacity: 0 }}
                      className="absolute top-8 text-blue-400"
                    >
                      Profile
                    </motion.div>
                  )}
                </AnimatePresence>
                <a href="/Profiles">
                  <Button
                    variant="ghost"
                    onMouseEnter={() => setShowP(!showP)}
                    onMouseLeave={() => setShowP(!showP)}
                  >
                    <SquareUser />
                  </Button>
                </a>
              </div>
              <div className="flex flex-col items-center gap-2">
                <AnimatePresence>
                  {showS && (
                    <motion.div
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ x: -20, opacity: 0 }}
                      className="absolute top-8 right-6 text-blue-400"
                    >
                      Cart
                    </motion.div>
                  )}
                </AnimatePresence>
                <a href="/Cart">
                  <Button
                    variant="ghost"
                    className="mr-4"
                    onMouseEnter={() => setShowS(!showS)}
                    onMouseLeave={() => setShowS(!showS)}
                  >
                    <ShoppingBasket />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div>
          <div className="m-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">View Product</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <Link href="/products" className="cursor-default">
                  <DropdownMenuLabel>All Products</DropdownMenuLabel>
                </Link>
                <DropdownMenuGroup>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Category</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem>
                          Productivity / Tools
                          <DropdownMenuShortcut>
                            <Clipboard size={15} />
                          </DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Social / Communication
                          <DropdownMenuShortcut>
                            <MessageCircle size={15} />
                          </DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Entertainment / Media
                          <DropdownMenuShortcut>
                            <Film size={15} />
                          </DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Health & Fitness
                          <DropdownMenuShortcut>
                            <ActivityIcon size={15} />
                          </DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Finance / Money
                          <DropdownMenuShortcut>
                            <CreditCard size={15} />
                          </DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Education / Learning
                          <DropdownMenuShortcut>
                            <BookOpen size={15} />
                          </DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Photography / Video
                          <DropdownMenuShortcut>
                            <Camera size={15} />
                          </DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Shopping / E-commerce
                          <DropdownMenuShortcut>
                            <ShoppingBag size={15} />
                          </DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Travel / Navigation
                          <DropdownMenuShortcut>
                            <MapPin size={15} />
                          </DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          News / Magazines
                          <DropdownMenuShortcut>
                            <Newspaper size={15} />
                          </DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>More...</DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Platform</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem>
                          Apple | IOS
                          <DropdownMenuShortcut>
                            <Apple size={15} />
                          </DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Android
                          <DropdownMenuShortcut>
                            <Cpu size={15} />
                          </DropdownMenuShortcut>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Rating</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem className="flex items-center justify-center">
                          {ratings.map((rating) => (
                            <div key={rating.id}>
                              <div>{rating.rating}</div>
                            </div>
                          ))}
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
