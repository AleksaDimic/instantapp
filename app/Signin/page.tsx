"use client";
import { AtSign, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import google from "./Images/google.png";
import github from "./Images/github.png";
import { signInWithEmailAndPassword } from "firebase/auth/cordova";
import { auth } from "../firebaseConfig";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/navigation";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  display: "swap",
});
export default function SignIn() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erremail, setErrEmail] = useState("");
  const [errpassword, setErrPassword] = useState("");
  const router = useRouter();

  async function SignInEmailandPassword() {
    const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,63}$/;
    let valid = true;

    if (email === "") {
      setErrEmail("Enter Email!");
      valid = false;
    } else if (!regex.test(email)) {
      setErrEmail("Enter Valid Email");
      valid = false;
    } else {
      setErrEmail("");
    }

    if (password === "") {
      setErrPassword("Enter Password!");
      valid = false;
    } else if (password.length < 8) {
      setErrPassword("Enter Stronger Password!");
      valid = false;
    } else {
      setErrPassword("");
    }

    if (!valid) return;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Email", email);
      console.log("Password", password);
    } catch (error) {
      console.log("Error is here:", error);
    }
  }

  async function GoogleLogin() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  }

  async function GithubLogin() {
    const provider = new GithubAuthProvider();
    signInWithPopup(auth, provider);
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/");
      } else {
        router.push("Signin");
      }
    });
  });

  return (
    <div
      className={`${poppins.className} bg-neutral-800 min-h-screen text-gray-400 cursor-default select-none`}
    >
      <div className="flex items-center justify-center h-screen mr-5">
        <div className="border border-neutral-700 rounded-md p-5 w-[80%] md:w-[50%] xl:w-[40%]">
          <div className="flex flex-row justify-between items-center text-blue-400 text-lg animate-caret-blink">
            <div>InstantApp</div>
            <div>Community</div>
          </div>
          <div className="text-2xl text-center mt-3 animate-bounce">SignIn</div>
          <div className="text-center">Welcome, What's Up!</div>
          <div className="border-t border-gray-300 mt-5" />
          <div className="mt-10">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row items-center justify-between">
                <label>Email</label>
                {erremail && <div className="text-red-500">{erremail}</div>}
              </div>
              <div className="flex flex-row items-center">
                <div
                  className={`${
                    erremail ? " border-red-500" : "border-neutral-600"
                  } border-3 rounded-l-md h-10 w-10 hover:bg-blue-400 hover:border-blue-400 hover:text-black hover:shadow-md hover:shadow-blue-400 hover:scale-110 active:scale-100 transition-all flex items-center justify-center`}
                >
                  <AtSign size={20} />
                </div>
                <input
                  type="email"
                  placeholder="you@random.com"
                  className={` ${
                    erremail ? " border-red-500" : "border-neutral-600"
                  } w-full border-3 outline-0 rounded-r-md h-10 text-sm indent-1 focus:border-b-3 focus:border-b-blue-400 focus:ring-blue-400 transition-all`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-7">
              <div className="flex flex-row items-center justify-between">
                <label>Password</label>
                {errpassword && (
                  <div className="text-red-500">{errpassword}</div>
                )}
              </div>
              <div className="flex flex-row items-center">
                <div
                  onClick={() => setShow(!show)}
                  className={`${
                    errpassword ? " border-red-500" : "border-neutral-600"
                  } border-3 rounded-l-md h-10 w-10 hover:bg-blue-400 hover:border-blue-400 hover:text-black hover:shadow-md hover:shadow-blue-400 hover:scale-110 active:scale-100 transition-all flex items-center justify-center`}
                >
                  {show ? (
                    <div>
                      <Eye onClick={() => setShow(!show)} />
                    </div>
                  ) : (
                    <div>
                      <EyeOff onClick={() => setShow(!show)} />
                    </div>
                  )}
                </div>
                <input
                  type={show ? "text" : "password"}
                  placeholder={show ? "Password" : "••••••••"}
                  className={` ${
                    errpassword ? " border-red-500" : "border-neutral-600"
                  } w-full border-3 outline-0 rounded-r-md h-10 text-sm indent-1 focus:border-b-3 focus:border-b-blue-400 focus:ring-blue-400 transition-all`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center mt-5">
            <Button
              variant="ghost"
              className="w-[80%] text-lg border border-neutral-600"
              onClick={SignInEmailandPassword}
            >
              SignIn
            </Button>
          </div>
          <div className="flex flex-row items-center gap-2 mt-5">
            <div className="border-b-3 border-neutral-600 w-full"></div>
            <div>OR</div>
            <div className="border-b-3 border-neutral-600 w-full"></div>
          </div>
          <div className="flex items-center justify-center md:flex-row flex-col gap-5">
            <Button
              onClick={GoogleLogin}
              variant="ghost"
              className="flex flex-row items-center gap-2 border border-neutral-600 mt-5"
            >
              <div className="text-lg">Signin Google</div>
              <Image src={google} alt="Google" width={20} />
            </Button>
            <Button
              onClick={GithubLogin}
              variant="ghost"
              className="flex flex-row items-center gap-2 border border-neutral-600 mt-5"
            >
              <div className="text-lg">Signin Github</div>
              <Image src={github} alt="Github" width={20} />
            </Button>
          </div>
          <div className="border-b-3 border-neutral-600 w-full mt-5" />
          <div className="text-center mt-5">
            You don't have a account,{" "}
            <a href="/Register">
              <span className="text-blue-400 hover:underline">Register</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
