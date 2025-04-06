"use client";
import { Input } from "@repo/ui/input";

export function AuthPage({isSignin}:{isSignin:boolean}) {
     return <div className="w-screen h-screen flex flex-col items-center justify-center">
        <div className="p-6 m-2 bg-white rounded ">
            <div className="p-2">
            {/* <input type="text" placeholder="Enter Email" /> */}
            <Input type="text" placeholder="Enter Email" />
            
            </div>
            
            <div className="p-2">
            {/* <input type="password" placeholder="Enter Password" /> */}
            <Input type="password" placeholder="Enter Password" />
            </div>
            <div className="pt-2">
                <button onClick={()=>{

                }}>{isSignin?"Sign In":"Sign Up"}</button> 
            </div>

        </div>
     </div>
}