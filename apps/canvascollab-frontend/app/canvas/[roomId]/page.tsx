import { RoomCanvas } from "@/components/RoomCanvas";
import { initdraw } from "@/draw";
import { use, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import ClientAuthCheck from "@/components/ClientAuthCheck";

export default async function CanvasPage({params }:{params:{roomId:string}}) {
    const roomId=(await params).roomId;
    return <ClientAuthCheck roomId={roomId} />;

    
}