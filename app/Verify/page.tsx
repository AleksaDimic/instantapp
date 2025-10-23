"use client";
import { Poppins } from "next/font/google";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function VerifyPage() {
  return (
    <div
      className={`${poppins.className} min-h-screen flex flex-col items-center justify-center bg-neutral-800 text-gray-100 px-4`}
    >
      <div className="bg-neutral-800 rounded-2xl shadow-lg shadow-black/50 p-10 max-w-md w-full text-center">
        <div className="text-6xl mb-4">📧</div>
        <h1 className="text-2xl font-bold mb-2">Confirm Your Email</h1>
        <p className="text-gray-300 mb-6">
          We have sent you a verification link. <br />
          Please check your inbox and click the link to complete your
          registration.
        </p>
        <p className="text-sm text-gray-500">
          Didn't receive an email? Check your spam folder or{" "}
          <span className="text-blue-400 underline cursor-pointer">resend</span>
          .
        </p>
      </div>
    </div>
  );
}
