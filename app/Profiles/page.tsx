"use client";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  ArrowDownToLine,
  BadgeEuro,
  Bell,
  Copyright,
  House,
  LogOut,
  Menu,
  Pen,
  PenLine,
  SquarePen,
  User,
  X,
} from "lucide-react";
import { Poppins } from "next/font/google";
import { useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  display: "swap",
});
export default function Profile() {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const lastLoginDate = user?.metadata?.lastSignInTime
    ? new Date(user.metadata.lastSignInTime).toLocaleDateString("en-CA")
    : "N/A";

  useEffect(() => {
    const GetAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/Profiles");
      } else {
        router.push("Signin");
      }
    });

    return () => GetAuth();
  }, []);
  return (
    <div
      className={`${poppins.className} bg-neutral-800 min-h-screen text-gray-400 cursor-default select-none`}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="flex justify-between items-center w-full px-6 py-4 border-b border-neutral-700 shadow-lg shadow-neutral-900 bg-neutral-900">
          <div className="text-2xl font-semibold text-white tracking-wide">
            Profile
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
          <div className="border-1 border-neutral-600  md:w-[700px] sm:w-[500px] w-[300px] rounded-lg mt-10 shadow-lg shadow-neutral-600 hover:scale-105 transition-all">
            <div className="text-center text-2xl mt-5">Account Overview</div>
            <div className="flex md:flex-row flex-col items-center">
              {user?.photoURL ? (
                <div>
                  <Image
                    src={user?.photoURL}
                    alt=""
                    width={1000}
                    height={20}
                    className="w-20 h-20 rounded-md flex justify-center items-center m-5"
                  />
                </div>
              ) : (
                <div className="border-1 border-neutral-600 w-20 h-20 rounded-full bg-neutral-600 flex justify-center items-center m-5">
                  <User size={35} />
                </div>
              )}
              <div className="flex flex-col gap-4">
                <div>Username: {user?.displayName}</div>
                <div>Email: {user?.email}</div>
                <div>
                  User Verified: {user?.emailVerified ? "✅ Yes" : "❌ No"}
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center md:justify-end justify-center gap-5 m-5">
              <div className="flex flex-col gap-5">
                <div
                  onClick={() => setShow(!show)}
                  className="border border-blue-400 bg-blue-400 p-2 text-white rounded-lg flex flex-row gap-2 items-center hover:bg-blue-500 hover:border-blue-500 hover:shadow-md hover:shadow-blue-500 hover:scale-110 active:scale-100 transition-all "
                >
                  Edit Profile <SquarePen size={15} />
                </div>
              </div>
              <div
                onClick={() => signOut(auth)}
                className="border border-red-400 bg-red-400 p-2 text-white rounded-lg flex flex-row gap-2 items-center hover:bg-red-500 hover:border-red-500 hover:shadow-md hover:shadow-red-500 hover:scale-110 active:scale-100 transition-all"
              >
                LogOut <LogOut size={15} />
              </div>
            </div>
          </div>
          {show && (
            <div
              onMouseLeave={() => setShow(!show)}
              className="flex justify-end items-center mr-35 md:mr-5 mt-5"
            >
              <div className="border-1 border-neutral-600 bg-neutral-600 rounded-md p-3 w-60 flex flex-col items-center">
                <div className="flex flex-row items-center gap-2 hover:text-blue-400 hover:scale-110 active:scale-100 transition-all">
                  Change Username <Pen size={15} />
                </div>
                <div className="flex flex-row items-center gap-2 mt-5 hover:text-blue-400 hover:scale-110 active:scale-100 transition-all">
                  Change Email <Pen size={15} />
                </div>
              </div>
            </div>
          )}
          <div>
            <div className="border-1 border-neutral-600  md:w-[700px] sm:w-[500px] w-[300px] rounded-lg mt-10 shadow-lg shadow-neutral-600 hover:scale-105 transition-all">
              <div className="text-center text-2xl mt-5">Order History</div>
              <div className="flex md:flex-row flex-col justify-between">
                <div>
                  <div className="text-xl m-5">Purchased Products</div>
                  <div className="text-md m-5">!Name of Products!</div>
                </div>
                <div>
                  <div className="text-xl m-5">Purchase Date</div>
                  <div className="text-md m-5">!Date Here!</div>
                </div>
                <div>
                  <div className="text-xl m-5">Actions</div>
                  <div className="text-md m-8 border border-blue-600 bg-blue-400 text-white p-2 rounded-md hover:bg-blue-600 hover:scale-110 active:scale-100 transition-all flex flex-row items-center gap-3">
                    Download
                    <ArrowDownToLine size={15} />
                  </div>
                  <div className="text-md m-8 border border-blue-600 bg-blue-400 text-white p-2 rounded-md hover:bg-blue-600 hover:scale-110 active:scale-100 transition-all flex flex-row items-center gap-3">
                    View Licence <Copyright size={15} />
                  </div>
                </div>
              </div>
            </div>
            <div className="border-1 border-neutral-600  md:w-[700px] sm:w-[500px] w-[300px] rounded-lg mt-10 shadow-lg shadow-neutral-600 hover:scale-105 transition-all">
              <div className="text-center text-2xl mt-5">Wishlist</div>
              <div className="flex md:flex-row flex-col items-center justify-around">
                <div className="border-1 border-neutral-600 p-1 rounded-lg shadow-lg shadow-neutral-600 m-5 hover:scale-110 transition-all">
                  <div className="text-xl m-3">Saved Items</div>
                  <div className="text-center text-lg font-bold m-4">
                    {"Here Text"}
                  </div>
                </div>
                <div className="border-1 border-neutral-600 p-1 rounded-lg shadow-lg shadow-neutral-600 m-5 hover:scale-110 transition-all">
                  <div className="text-xl m-3">Liked Items</div>
                  <div className="text-center text-lg font-bold m-4">
                    {"Here Text"}
                  </div>
                </div>
                <div className="border-1 border-neutral-600 p-1 rounded-lg shadow-lg shadow-neutral-600 m-5 hover:scale-110 transition-all">
                  <div className="text-xl m-3">Favorite Items</div>
                  <div className="text-center text-lg font-bold m-4">
                    {"Here Text"}
                  </div>
                </div>
              </div>
              <div className="m-7">
                <div className="text-md mb-1">Purchased from Wishlist</div>
                <div className="bg-neutral-700 rounded-full h-3 w-full">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all"
                    style={{ width: `${(1 / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="border-1 border-neutral-600 md:w-[700px] sm:w-[500px] w-[300px] rounded-lg mt-5 shadow-lg shadow-neutral-600 hover:scale-105 transition-all p-5 text-sm mb-5">
              <div className="text-center text-xl mb-3">Login Info</div>
              <div className="flex flex-col gap-2">
                <div>Last Login: {lastLoginDate}</div>
                <div>Login Method: {user?.providerData[0]?.providerId}</div>
                <div>Rating Level: {"⭐️⭐️⭐️⭐️"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
