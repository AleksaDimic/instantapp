"use client";
import { AtSign, Eye, EyeOff, User } from "lucide-react";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import google from "../Signin/Images/google.png";
import github from "../Signin/Images/github.png";
import { supabase } from "../supabaseClient";
import { redirect, useRouter } from "next/navigation";
import { getDisplayName } from "next/dist/shared/lib/utils";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  display: "swap",
});
export default function SignIn() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errname, setErrName] = useState("");
  const [erremail, setErrEmail] = useState("");
  const [errpassword, setErrPassword] = useState("");
  const router = useRouter();

  async function SignInEmailandPassword() {
    const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,63}$/;
    let valid = true;

    if (name === "") {
      setErrName("Enter Name!");
      valid = false;
    } else {
      setErrName("");
    }

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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            displayName: name,
          },
        },
      });
      if (error) {
        console.error(error);
      } else if (data.user) {
        router.push("/Verify");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function GoogleLogin() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) console.log(error);
    return data;
  }

  async function GithubLogin() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
    });
    if (error) console.log(error);
    return data;
  }

  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.push("/");
      } else {
        router.push("/Register");
      }
    })();
  }, []);
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
          <div className="text-2xl text-center mt-3 animate-bounce">
            Register
          </div>
          <div className="text-center">Welcome, What's Up!</div>
          <div className="border-t border-gray-300 mt-5" />
          <div className="mt-10">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row items-center justify-between">
                <label>Username</label>
                {errname && <div className="text-red-500">{errname}</div>}
              </div>
              <div className="flex flex-row items-center">
                <div
                  className={`${
                    errname ? " border-red-500" : "border-neutral-600"
                  } border-3 rounded-l-md h-10 w-10 hover:bg-blue-400 hover:border-blue-400 hover:text-black hover:shadow-md hover:shadow-blue-400 hover:scale-110 active:scale-100 transition-all flex items-center justify-center`}
                >
                  <User size={20} />
                </div>
                <input
                  type="email"
                  placeholder="John Wick"
                  className={` ${
                    errname ? " border-red-500" : "border-neutral-600"
                  } w-full border-3 outline-0 rounded-r-md h-10 text-sm indent-1 focus:border-b-3 focus:border-b-blue-400 focus:ring-blue-400 transition-all`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-7">
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
            You have a account,{" "}
            <a href="/Signin">
              <span className="text-blue-400 hover:underline">Signin</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
