"use client";
import { Input } from "@repo/ui/input";
import { Button } from "@repo/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { HTTP_BACKEND_URL } from "@/config";

export function AuthPage({ isSignin }: { isSignin: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    const body = isSignin ? { email, password } : { email, password, name };

    const res = await fetch(`${HTTP_BACKEND_URL}/${isSignin ? "signin" : "signup"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (res.ok) {
      if (isSignin) {
        localStorage.setItem("token", data.token);
        router.push("/canvas/5");
      } else {
        alert("Signup successful! Please sign in.");
        router.push("/signin");
      }
    } else {
      alert(data.message || "Something went wrong.");
    }
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-tr from-blue-100 to-purple-100 flex items-center justify-center">
      <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-lg space-y-6">
        <h2 className="text-2xl font-semibold text-center">
          {isSignin ? "Welcome Back 👋" : "Create an Account 🚀"}
        </h2>

        {!isSignin && (
          <div className="space-y-2">
            <label className="block text-sm text-gray-600">Name</label>
            <Input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm text-gray-600">Email</label>
          <Input
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-gray-600">Password</label>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button
          onClick={handleSubmit}
          size="lg"
          variant="primary"
          className="w-full"
        >
          {isSignin ? "Sign In" : "Sign Up"}
        </Button>

        <p className="text-sm text-center text-gray-500">
          {isSignin ? "New here?" : "Already have an account?"}{" "}
          <a
            href={isSignin ? "/signup" : "/signin"}
            className="text-purple-600 hover:underline font-medium"
          >
            {isSignin ? "Sign Up" : "Sign In"}
          </a>
        </p>
      </div>
    </div>
  );
}