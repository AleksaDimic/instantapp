"use client";

import Image from "next/image";
import { Poppins } from "next/font/google";
import {
  BellRing,
  Check,
  ChevronsUpDown,
  CornerUpLeft,
  House,
  Menu,
  Pen,
  PenLine,
  PhoneOutgoing,
  SearchSlash,
  ShieldUser,
  ShoppingBasket,
  SquareUser,
  Star,
  Trash,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../supabaseClient";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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
const frameworks = [
  {
    value: "Android",
    label: "Android",
  },
  {
    value: "Apple",
    label: "IOS",
  },
];

export default function Home() {
  const [name, setName] = useState("");
  const [errname, setErrName] = useState("");
  const [price, setPrice] = useState("");
  const [errprice, setErrPrice] = useState("");
  const [description, setDescription] = useState("");
  const [errdescription, setErrDescription] = useState("");
  const [stock, setStock] = useState("");
  const [errstock, setErrStock] = useState("");
  const [image, setImage] = useState("");
  const [errimage, setErrImage] = useState("");
  const [githublinks, setGitHubLink] = useState("");
  const [errgithublinks, setErrGitHubLink] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [errvalue, setErrValue] = useState("");
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.push("/admin-panel");
      } else {
        router.push("/Signin");
      }
    })();
  }, []);

  async function AddProducts() {
    let valid = false;

    if (name === "") {
      setErrName("Enter Name!");
      valid = false;
    } else if (name.length < 20) {
      setErrName("Enter Valid Name!");
      valid = false;
    } else {
      setErrName("");
      valid = true;
    }

    if (price === "") {
      setErrPrice("Enter Price!");
      valid = false;
    } else if (!Number(price)) {
      setErrPrice("Enter Valid Price!");
      valid = false;
    } else if (price.toString().length < 3 || price.toString().length > 5) {
      setErrPrice("Price must be between 3 and 5 digits!");
      valid = false;
    } else {
      setErrPrice("");
      valid = true;
    }

    if (description === "") {
      setErrDescription("Enter Description!");
      valid = false;
    } else if (description.length <= 100) {
      setErrDescription("Description must be at most 250 characters!");
      valid = false;
    } else {
      setErrDescription("");
      valid = true;
    }

    if (stock === "") {
      setErrStock("Enter Stock!");
      valid = false;
    } else if (!Number(stock)) {
      setErrStock("Enter Valid Stock!");
      valid = false;
    } else {
      setErrStock("");
      valid = true;
    }

    if (image === "") {
      setErrImage("Enter Image!");
      valid = false;
    } else {
      setErrImage("");
      valid = true;
    }

    if (githublinks === "") {
      setErrGitHubLink("Enter Valid Link!");
      valid = false;
    } else {
      setErrGitHubLink("");
      valid = true;
    }
    if (value === "") {
      setErrValue("Enter Platform!");
      valid = false;
    } else {
      setErrValue("");
      valid = true;
    }

    if (!valid) return;

    try {
      const { data, error } = await supabase
        .from("Products")
        .insert({
          Name: name,
          Price: price,
          Description: description,
          Stock: stock,
          Image_Url: image,
          GitHub_Url: githublinks,
          platform: value,
        })
        .select();
      console.log(data);
      console.log(error);
      setName("");
      setPrice("");
      setDescription("");
      setStock("");
      setImage("");
      setGitHubLink("");
      setValue("");
    } catch (error) {
      console.log(error);
    }
  }

  async function DeleteDoc(productId: number) {
    const { error } = await supabase
      .from("Products")
      .delete()
      .eq("id", productId);

    if (error) {
      console.log(error);
    } else {
      setProducts((currentProducts) =>
        currentProducts.filter((p) => p.id !== productId)
      );
    }
  }

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
        <div className="flex flex-row items-center justify-between border-b-1 border-neutral-400">
          <Link href="/" className="cursor-default m-5">
            <div
              className="border border-green-500 bg-green-500 text-white font-medium px-4 py-2 rounded-lg flex flex-row gap-2 items-center 
      hover:bg-green-600 hover:border-green-600 hover:shadow-lg hover:shadow-green-500/40 
      hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <CornerUpLeft size={18} />
              Home
            </div>
          </Link>
          <div className="text-2xl m-5">Admin Panel</div>
        </div>
        <div className="text-2xl m-15">Add Products</div>
        <div className="flex lg:flex-row flex-col">
          <div className="">
            <div>
              <div className="text-xl ml-15 m-5">Name Products</div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`${
                  errname ? "border-red-500" : "border-neutral-600"
                } outline-0 border  md:w-[500px] w-[300px]  h-10 rounded-lg text-sm indent-2 ml-15`}
              />
              {errname && <div className="text-red-500 ml-15">{errname}</div>}
            </div>
            <div>
              <div className="text-xl ml-15 m-5">Price Products</div>
              <div className="flex flex-row items-center relative">
                <input
                  type="number"
                  className={`${
                    errprice ? "border-red-500" : "border-neutral-600"
                  } outline-0 border  md:w-[500px] w-[300px]  h-10 rounded-lg text-sm indent-6 ml-15`}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  max={999999}
                />
                <X
                  size={15}
                  className="absolute left-17"
                  onClick={() => setPrice("")}
                />
              </div>
              {errprice && <div className="text-red-500 ml-15">{errprice}</div>}
            </div>
            <div>
              <div className="text-xl ml-15 m-5">Description Products</div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`${
                  errdescription ? "border-red-500" : "border-neutral-600"
                } outline-0 border  md:w-[500px] w-[300px]  h-[150px] rounded-lg text-sm indent-2 ml-15`}
              />
              {errdescription && (
                <div className="text-red-500 ml-15">{errdescription}</div>
              )}
            </div>
            <div>
              <div className="text-xl ml-15 m-5">Stock Products</div>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className={`${
                  errstock ? "border-red-500" : "border-neutral-600"
                } outline-0 border  md:w-[500px] w-[300px]  h-10 rounded-lg text-sm indent-2 ml-15`}
              />
              {errstock && <div className="text-red-500 ml-15">{errstock}</div>}
            </div>
            <div>
              <div className="text-xl ml-15 m-5">Images Products</div>
              <input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className={`${
                  errimage ? "border-red-500" : "border-neutral-600"
                } outline-0 border  md:w-[500px] w-[300px]  h-10 rounded-lg text-sm indent-2 ml-15`}
              />
              {errimage && <div className="text-red-500 ml-15">{errimage}</div>}
            </div>
            <div>
              <div className="text-xl ml-15 m-5">Github Link Products</div>
              <input
                value={githublinks}
                onChange={(e) => setGitHubLink(e.target.value)}
                className={`${
                  errgithublinks ? "border-red-500" : "border-neutral-600"
                } outline-0 border  md:w-[500px] w-[300px]  h-10 rounded-lg text-sm indent-2 ml-15`}
              />
              {errgithublinks && (
                <div className="text-red-500 ml-15">{errgithublinks}</div>
              )}
            </div>
            <div className="m-5">
              <div>
                {" "}
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-[300px] justify-between bg-neutral-600 ml-10"
                    >
                      {value
                        ? frameworks.find(
                            (framework) => framework.value === value
                          )?.label
                        : "Select platform..."}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search platform..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>No platform found.</CommandEmpty>
                        <CommandGroup>
                          {frameworks.map((framework) => (
                            <CommandItem
                              key={framework.value}
                              value={framework.value}
                              onSelect={(currentValue) => {
                                setValue(
                                  currentValue === value ? "" : currentValue
                                );
                                setOpen(false);
                              }}
                              className={`${
                                errvalue
                                  ? "border-red-500"
                                  : "border-neutral-600"
                              } outline-0 border  md:w-[500px] w-[300px]  h-10 rounded-lg text-sm indent-2 ml-15`}
                            >
                              {framework.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  value === framework.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errvalue && (
                  <div className="ml-10 text-red-500">{errvalue}</div>
                )}
              </div>
            </div>
            <div>
              <Button onClick={AddProducts} variant="ghost" className="m-10">
                Add Products
              </Button>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-2 m-5">
              {products.map((product, index) => (
                <div key={index} className="">
                  <div className="border-1 border-neutral-600 flex flex-col items-center p-2 rounded-lg  m-15">
                    <Image
                      src={convertImgurUrl(product.Image_Url)}
                      alt=""
                      width={50}
                      height={50}
                      className="rounded-md"
                    />
                    <div className="text-lg m-5">{product.Name}</div>
                    <div className="flex flex-row gap-5">
                      <div>Price: {product.Price}</div>
                      <div>Stock: {product.Stock}</div>
                    </div>
                    <div className="flex flex-row gap-5 m-5">
                      <button
                        onClick={() => DeleteDoc(product.id)}
                        className="border-1 border-red-500 p-3 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash size={15} />
                      </button>
                      <button className="border-1 border-blue-500 p-3 rounded-lg hover:bg-blue-500 hover:text-black transition-all">
                        <Pen size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
