"use client";
import { House, Trash } from "lucide-react";
import { Poppins } from "next/font/google";
import Link from "next/link";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  display: "swap",
});
export default function Cart() {
  return (
    <div
      className={`${poppins.className} bg-neutral-800 min-h-screen text-gray-400 cursor-default select-none`}
    >
      <div>
        <div className="flex justify-between items-center w-full px-6 py-4 border-b border-neutral-700 shadow-lg shadow-neutral-900 bg-neutral-900">
          <div className="text-2xl font-semibold text-white tracking-wide">
            Cart
          </div>

          <Link href="/" className="cursor-default">
            <div
              className="border border-green-500 bg-green-500 text-white font-medium px-4 py-2 rounded-lg flex flex-row gap-2 items-center 
      hover:bg-green-600 hover:border-green-600 hover:shadow-lg hover:shadow-green-500/40 
      hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Home <House size={18} />
            </div>
          </Link>
        </div>
        <div>
          <div className="flex flex-row items-center justify-between m-5">
            <div className="text-2xl m-10">Products</div>
            <div className="text-xl border-1 border-blue-400 bg-blue-400 p-2 rounded-lg text-white hover:border-blue-500 hover:bg-blue-500 hover:scale-110 active:scale-100 hover:shadow-lg hover:shadow-blue-500 transition-all">
              Checkout
            </div>
          </div>
          <div className="border-t border-neutral-600 grid grid-cols-1 md:grid-cols-2 gap-6 px-5 py-4">
            <div className="border-1 border-neutral-900 bg-neutral-900 shadow-lg shadow-neutral-400/80 p-4 rounded-lg hover:scale-95 transition-all flex flex-col md:flex-row items-center gap-4">
              <div className="w-24 h-24 bg-neutral-700 flex items-center justify-center rounded-lg text-gray-500">
                Image
              </div>
              <div className="flex-1 flex flex-col gap-2 md:ml-4">
                <div className="text-xl font-semibold text-white">Chat App</div>
                <div className="flex flex-row items-center gap-4 text-gray-300 text-lg">
                  <div>
                    <span className="font-medium">Price:</span> 250$
                  </div>
                  <div>
                    <span className="font-medium">Quantity:</span> 2
                  </div>
                  <div>
                    <span className="font-medium">Subtotal:</span> 500$
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2 md:mt-0">
                <button className="text-red-500 hover:text-red-600 flex items-center gap-1 font-medium">
                  Delete <Trash size={16} />
                </button>
              </div>
            </div>
            <div className="border-1 border-neutral-900 bg-neutral-900 shadow-lg shadow-neutral-400/80 p-4 rounded-lg hover:scale-95 transition-all flex flex-col md:flex-row items-center gap-4">
              <div className="w-24 h-24 bg-neutral-700 flex items-center justify-center rounded-lg text-gray-500">
                Image
              </div>
              <div className="flex-1 flex flex-col gap-2 md:ml-4">
                <div className="text-xl font-semibold text-white">Chat App</div>
                <div className="flex flex-row items-center gap-4 text-gray-300 text-lg">
                  <div>
                    <span className="font-medium">Price:</span> 250$
                  </div>
                  <div>
                    <span className="font-medium">Quantity:</span> 2
                  </div>
                  <div>
                    <span className="font-medium">Subtotal:</span> 500$
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2 md:mt-0">
                <button className="text-red-500 hover:text-red-600 flex items-center gap-1 font-medium">
                  Delete <Trash size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
