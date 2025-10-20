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
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../firebaseConfig";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  display: "swap",
});

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/admin-panel");
      } else {
        router.push("Signin");
      }
    });
  });

  return (
    <div
      className={`${poppins.className} bg-neutral-800 min-h-screen text-gray-400 p-1 cursor-default select-none`}
    ></div>
  );
}
