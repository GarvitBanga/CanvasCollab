// import { RoomCanvas } from "@/components/RoomCanvas";
// import { initdraw } from "@/draw";
// import { use, useEffect, useRef } from "react";
// import dynamic from "next/dynamic"
import ClientAuthCheck from "@/components/ClientAuthCheck";

// You can define your own props explicitly like this:
// type CanvasPageProps = {
//     params: {
//       roomId: string;
//     };
//   };
// export default async function CanvasPage( { params }: CanvasPageProps,
//   ) {
//     const { roomId } = await params;
//   return <ClientAuthCheck roomId={roomId} />;
// }

export default function CanvasPage({ params }: { params: { roomId: string } }) {
  return <ClientAuthCheck roomId={params.roomId} />;
}