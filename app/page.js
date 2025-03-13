"use client";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-3xl font-bold mb-8">IT Support Ticketing System</h1>
      <div className="space-y-4">
        <Link href="/login">
          <button className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition">
            Login
          </button>
        </Link>
        <Link href="/signup">
          <button className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition">
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
}