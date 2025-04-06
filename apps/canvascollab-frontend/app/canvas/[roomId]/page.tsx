import { RoomCanvas } from "@/components/RoomCanvas";
import { initdraw } from "@/draw";
import { use, useEffect, useRef } from "react";

export default async function CanvasPage({params }:{params:{roomId:string}}) {

    const roomId=(await params).roomId;

    console.log("roomId",roomId);

    return <RoomCanvas roomId={roomId} />;

    
}