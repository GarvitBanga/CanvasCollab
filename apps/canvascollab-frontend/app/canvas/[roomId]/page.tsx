// import { RoomCanvas } from "@/components/RoomCanvas";
// import { initdraw } from "@/draw";
// import { use, useEffect, useRef } from "react";
// import dynamic from "next/dynamic"
import ClientAuthCheck from "@/components/ClientAuthCheck";
import type { Metadata, ResolvingMetadata } from 'next'
// You can define your own props explicitly like this:
type Props = {
    params: Promise<{ roomId: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }
   

export default async function CanvasPage( { params, searchParams }: Props,
    parent: ResolvingMetadata
  ) {
    const { roomId } = await params;
  return <ClientAuthCheck roomId={roomId} />;
}