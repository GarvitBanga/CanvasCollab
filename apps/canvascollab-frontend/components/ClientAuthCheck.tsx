"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RoomCanvas } from "./RoomCanvas";

export default function ClientAuthCheck({ roomId }: { roomId: string }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
    } else {
      setAuthorized(true);
    }
  }, []);

  if (!authorized) return <div>Redirecting...</div>;

  return <RoomCanvas roomId={roomId} />;
}