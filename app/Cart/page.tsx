"use client";
import { CornerUpLeft, House, Trash } from "lucide-react";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { supabase } from "../supabaseClient";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  display: "swap",
});
interface Cart {
  id: number;
  Name: string;
  Price: number;
  Stock: number;
  Images_Url: string;
  platform: string;
}
export default function Cart() {
  const router = useRouter();
  const [carts, setCart] = useState<Cart[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
      } else {
        router.push("/Signin");
      }
    })();
  }, []);
  useEffect(() => {
    const getCart = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("Cart")
        .select("*")
        .eq("user_id", user.id)
        .order("id", { ascending: false });

      if (error) console.log(error);
      if (data) setCart(data);
    };

    getCart();
  });
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
  async function DeleteCart(cartId: number) {
    const { error } = await supabase
      .from("Cart")
      .delete()
      .select("*")
      .eq("id", cartId);

    if (error) {
      console.log(error);
    } else {
      setCart((prev) => prev.filter((p) => p.id !== cartId));
    }
  }
  return (
    <div
      className={`${poppins.className} bg-neutral-800 min-h-screen text-gray-400 cursor-default select-none`}
    >
      <div>
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
            Cart
          </div>
        </div>
        <div>
          <div className="flex flex-row items-center justify-between m-5">
            <div className="text-2xl m-10">Products</div>
            <div className="flex flex-col gap-4">
              <div className="text-xl border-1 border-blue-400 bg-blue-400 p-2 rounded-lg text-white hover:border-blue-500 hover:bg-blue-500 hover:scale-110 active:scale-100 hover:shadow-lg hover:shadow-blue-500 transition-all">
                Checkout
              </div>
              <div className="text-xl ml-5">
                Total:{" "}
                {carts.reduce(
                  (sum, item) => sum + item.Price * Number(item.Stock),
                  0
                )}
                $
              </div>
            </div>
          </div>
          {carts && carts.length === 0 ? (
            <div className="text-center text-gray-400 text-lg mt-10">
              Your cart is empty
            </div>
          ) : (
            carts.map((cart) => (
              <div key={cart.id} className="gap-6 px-5 py-4">
                <div className="border-1 border-neutral-900 bg-neutral-900 shadow-lg shadow-neutral-400/80 p-4 rounded-lg hover:scale-95 transition-all flex flex-col md:flex-row items-center gap-4">
                  <div className="w-24 h-24 bg-neutral-700 flex items-center justify-center rounded-lg text-gray-500">
                    <Image
                      src={convertImgurUrl(cart.Images_Url)}
                      width={50}
                      height={50}
                      alt={cart.Name || "Product Image"}
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-2 md:ml-4">
                    <div className="text-xl font-semibold text-white">
                      {cart.Name}
                    </div>
                    <div className="text-xl font-semibold text-white">
                      {cart.platform}
                    </div>
                    <div className="flex flex-row items-center gap-4 text-gray-300 text-lg">
                      <div>
                        <span className="font-medium">Price:</span> {cart.Price}
                        $
                      </div>
                      <div>
                        <span className="font-medium">Quantity:</span>{" "}
                        {cart.Stock}
                      </div>
                      <div>
                        <span className="font-medium">Subtotal:</span>{" "}
                        {Math.floor(cart.Price * Number(cart.Stock))}$
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 md:mt-0">
                    <button
                      onClick={() => DeleteCart(cart.id)}
                      className="text-red-500 hover:text-red-600 flex items-center gap-1 font-medium"
                    >
                      Delete <Trash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
