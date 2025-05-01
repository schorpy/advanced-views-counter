import { useEffect } from "react";


import Navbar from "@/components/navbar/navbar"
import NavbarMobile from "@/components/navbar/navbar-mobile"
import { ModeToggle } from "../mode-toggle";

import {  Outlet } from "react-router-dom";


export default function LayoutOne() {
  // let showApplicationLayout = !wpclickizy.isAdmin;
  let showApplicationLayout = true;


  return (
    <div className="grid min-h-screen w-full">


      <div className="flex flex-col">
        {showApplicationLayout &&
          <header className="sticky top-8 z-50 flex h-14 items-center bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <NavbarMobile/>
          <Navbar/>
            <ModeToggle />
            
          </header>
        }
        <main>

          <Outlet />
        </main>
      </div>
    </div>
  )
}
