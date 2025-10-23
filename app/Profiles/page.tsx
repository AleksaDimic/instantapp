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
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../supabaseClient";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  display: "swap",
});
export default function Profile() {
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [changemail, setChangeEmail] = useState("");
  const [errshow1, setErrShow1] = useState("");
  const [show2, setShow2] = useState(false);
  const [changusername, setChangeUsername] = useState("");
  const [errshow2, setErrShow2] = useState("");
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const lastLoginDate = user?.last_sign_in_at
    ? new Date(user.last_sign_in_at).toLocaleDateString("en-CA")
    : "N/A";

  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.push("/Profiles");
      } else {
        router.push("/Signin");
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

  async function ChangeEmail(e: any) {
    if (e.key === "Enter") {
      if (changemail === "") {
        setErrShow1("Enter Changed Email");
      } else {
        setErrShow1("");
      }

      try {
        const { data, error } = await supabase.auth.updateUser({
          email: changemail,
        });
        alert("Please Verify the Email Addres!");
        setUser(data.user);
        setChangeEmail("");
        setErrShow1("");
        console.log(error);
        console.log(user);
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function ChangeUsername(e: any) {
    if (e.key === "Enter") {
      if (changusername === "") {
        setErrShow2("Enter Changed Email");
      } else {
        setErrShow2("");
      }

      try {
        console.log(user);
        const { data, error } = await supabase.auth.updateUser({
          data: { displayName: changusername, full_name: changusername },
        });
        setUser(data.user);
        setChangeUsername("");
        setErrShow2("");
        console.log(error);
        console.log(user);
        setShow2(!show2);
      } catch (error) {
        console.log(error);
      }
    }
  }

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
              {user?.user_metadata?.avatar_url ? (
                <div>
                  <Image
                    src={user?.user_metadata?.avatar_url}
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
                {show2 ? (
                  <div className="flex flex-row items-center gap-2">
                    <div>Username:</div>
                    <input
                      placeholder={
                        user?.user_metadata?.full_name ||
                        user?.user_metadata?.displayName
                      }
                      className={`${
                        errshow2 ? "border-red-500" : "border-neutral-600"
                      } outline-0 border  p-2 ho-8 rounded-lg w-40 md:w-80`}
                      value={changusername}
                      onChange={(e) => setChangeUsername(e.target.value)}
                      onKeyDown={ChangeUsername}
                    />
                  </div>
                ) : (
                  <div>
                    Username:{" "}
                    {changusername ||
                      user?.user_metadata?.full_name ||
                      user?.user_metadata?.displayName}
                  </div>
                )}
                {show1 ? (
                  <div className="flex flex-row items-center gap-2">
                    <div>Email:</div>
                    <input
                      placeholder={user?.new_email || user?.email}
                      className={`${
                        errshow1 ? "border-red-500" : "border-neutral-600"
                      } outline-0 border  p-2 ho-8 rounded-lg w-40 md:w-80`}
                      value={changemail}
                      onChange={(e) => setChangeEmail(e.target.value)}
                      onKeyDown={ChangeEmail}
                    />
                  </div>
                ) : (
                  <div>Email: {user?.new_email || user?.email}</div>
                )}
                <div>
                  User Verified: {user?.email_confirmed_at ? "✅ Yes" : "❌ No"}
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
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push("/Signin");
                }}
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
                <div
                  onClick={() => {
                    setShow1(!show1);
                    setShow(!show);
                  }}
                  className="flex flex-row items-center gap-2 hover:text-blue-400 hover:scale-110 active:scale-100 transition-all"
                >
                  Change Email <Pen size={15} />
                </div>
                <div
                  onClick={() => {
                    setShow2(!show2);
                    setShow(!show);
                  }}
                  className="flex flex-row items-center gap-2 mt-5 hover:text-blue-400 hover:scale-110 active:scale-100 transition-all"
                >
                  Change Username <Pen size={15} />
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
                <div>Login Method: {user?.app_metadata?.provider}</div>
                <div>Rating Level: {"⭐️⭐️⭐️⭐️"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
