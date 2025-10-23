"use client";

import Image from "next/image";
import { Poppins } from "next/font/google";
import {
  BellRing,
  Menu,
  PenLine,
  PhoneOutgoing,
  SearchSlash,
  ShieldUser,
  ShoppingBasket,
  SquareUser,
  Star,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "./supabaseClient";

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

export default function Home() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const [showM, setShowM] = useState(false);
  const [showP, setShowP] = useState(false);
  const [showS, setShowS] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
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
              <div className="hover:text-blue-400 hover:underline hover:underline-offset-4 transition-all flex flex-row items-center gap-2">
                <div>Rating</div>
                <Star size={15} />
              </div>
              <div className="hover:text-blue-400 hover:underline hover:underline-offset-4 transition-all flex flex-row items-center gap-2">
                <div>Updates</div>
                <BellRing size={15} />
              </div>
              {userEmail === "akidimke136@gmail.com" && (
                <div
                  onClick={() => router.push("admin-panel")}
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
                  <div className="hover:text-blue-400 hover:underline hover:underline-offset-4 transition-all flex flex-row items-center gap-2">
                    <div className="sm:flex hidden">Rating</div>
                    <Star size={15} />
                  </div>
                  <div className="hover:text-blue-400 hover:underline hover:underline-offset-4 transition-all flex flex-row items-center gap-2">
                    <div className="sm:flex hidden">Updates</div>
                    <BellRing size={15} />
                  </div>
                  {userEmail === "akidimke136@gmail.com" && (
                    <div
                      onClick={() => router.push("admin-panel")}
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
              <div className="flex flex-row items-center">
                <div className="border-3 border-neutral-600 h-9 w-10 lg:mb-0 mb-4 flex items-center justify-center rounded-l-md hover:bg-neutral-600 hover:scale-115 hover:shadow-md hover:shadow-neutral-600 transition-all">
                  <SearchSlash size={20} />
                </div>
                <input className="outline-0 border-3 border-neutral-600 rounded-r-md xl:w-[800px] lg:w-[650px] md:w-[550px] sm:w-[450px] w-[350px] lg:mb-0 mb-4 h-9 text-sm indent-1 focus:borer-b-3 focus:border-b-blue-400 focus:ring-blue-400 transition-all" />
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
        {products.map((product, index) => (
          <div key={index}>
            <div>
              <Image
                src={convertImgurUrl(product.Image_Url)}
                alt=""
                width={50}
                height={50}
              />
              <div>{product.Name}</div>
              <div>{product.Price}</div>
              <div>{product.Stock}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
