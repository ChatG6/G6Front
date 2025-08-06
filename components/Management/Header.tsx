"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
//import logo from "@/public/Logo.svg";
import logo from "@/public/logo-chatg6-svg.svg";
import { Button1 } from "../ui/upg-btn";
import { DoubleArrowUpIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useState, useCallback, useEffect } from "react";
import URLS from "@/app/config/urls";
import axios from "axios";
// MODIFIED: Imported icons from lucide-react for a more attractive UI
import { Gem, Rocket, LogOut, XCircle } from "lucide-react";

const useMediaQuery = (width: number) => {
  const [targetReached, setTargetReached] = useState(false);

  const updateTarget = useCallback((e: MediaQueryListEvent) => {
    if (e.matches) {
      setTargetReached(true);
    } else {
      setTargetReached(false);
    }
  }, []);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${width}px)`);
    media.addEventListener("change", updateTarget);

    if (media.matches) {
      setTargetReached(true);
    }

    return () => media.removeEventListener("change", updateTarget);
  }, []);

  return targetReached;
};
export default function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const loading = status === "loading";
  const username = session?.user?.name || "";
  const isBreakpoint = useMediaQuery(768);
  const isBreakpoint2 = useMediaQuery(850);
  const handleupgrade = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/pricing`;
    //redirect(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/pricing`)
  };
    const [quota, setquota] = useState(50);
      const [quotaplg, setquotaplg] = useState(50);
      const [substatus, setsubstatus] = useState('');
      const [up, setup] = useState(false);
      const [canc, setcanc] = useState(false);
      const [res, setres] = useState(false);
      useEffect(() => {
          const fetchLR = async ()=> {
            const resp = await axios.post(URLS.endpoints.status);
            console.log(resp.data.statuss)
            console.log(resp.data.quota)
            console.log(resp.data.error)
            console.log(resp.data.error)
            if (resp.data.statuss != 'unknown') {setsubstatus(resp.data.statuss); 
             // console.log(resp.data.error)  
             }
            if (resp.data.quota != 500) {setquota(resp.data.quota); //console.log(resp.data.error)
            }
            if (resp.data.quotaplg != 500) {setquotaplg(resp.data.quotaplg); //console.log(resp.data.error)
            }
            if (resp.data.statuss === 'active') {setcanc(true)}
            else if (resp.data.statuss === 'Free Trial') {setup(true)}
            else {setres(true)}
          }
          fetchLR();
          },[substatus,setsubstatus,quota,setquota])
    const handleCancel = async () => {
   
       const subscription = false;
       let priceId = '';
       try {
         const  resp  = await axios.post(URLS.endpoints.stripe_session,
           { priceId, subscription });
          if (resp.data.status) {
              setsubstatus('canceled')
              setcanc(false);
              setres(true)
              
          }
        // console.log('data', resp.data)
      
       } catch (error) {
         //console.error('Error during checkout:', error);
  
         return
       }
     };
 
  return (
    <header
      className={`h-20 flex items-center justify-around ${isBreakpoint?'':'pl-4'}`}
      style={

    {
      display:(pathname === "/editor" || pathname === "/account")?"none":"flex",
      paddingRight:"28px",



    }
        
          
        
      }
    >
      {isBreakpoint ? (
        <>
          <div
            className="pt-0 auth-options flex justify-end items-center"
            style={{ width: "30%",gap:"16px" }}
          >
            <Link className="" href={"/editor"}>
              <Button1
                className="rounded-[12px] font-normal whitespace-nowrap"
                style={{
                  backgroundColor: "#323dd6",
                }}
              >
                Start writing
              </Button1>
            </Link>
            {session ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{username[0]}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>{session.user?.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link className="header-link" href={"/api/auth/signout"}>
                        Sign Out
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link className="header-link" href={"/pricing"}>
                        Pricing
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link className="header-link" href={"/"}>
                        About
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link className="header-link" href={"/blog"}>
                        Blog
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Button1
                        variant="outline"
                        onClick={handleupgrade}
                        className="upg-btn ml-2 mr-2 text-sm"
                        style={{
                          backgroundColor: "#545CEB",
                        }}
                      >
                        <DoubleArrowUpIcon />
                        <span className="ml-2">Upgrade</span>
                      </Button1>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <HamburgerMenuIcon className="h-8 w-8" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Link className="header-link" href={"/pricing"}>
                        Pricing
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link className="header-link" href={"/"}>
                        About
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link className="header-link" href={"/blog"}>
                        Blog
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link
                        className="header-link"
                        href={"/api/auth/sigin"}
                      >
                        Sign in
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          <nav
            className="flex flex-row items-center justify-start"
            style={{
              width: "70%",
            }}
          >
            <div className="flex justify-start">
              <Link className="header-link" href={"/"}>
                <Image src={logo} alt="ChatG6 Logo" width={100} height={50} />
              </Link>
            </div>
          </nav>
        </>
      ) : (
        <>
          <div
            className="auth-options flex items-center gap-2"
            style={{ width: "35%" }}
          >
            {session ? (
              <>
                <Link className="" href={"/editor"}>
                  <Button1
                    className="rounded-[12px] font-normal whitespace-nowrap"
                    style={{
                      backgroundColor: "#323dd6",
                    }}
                  >
                    Start writing
                  </Button1>
                </Link>
                {/*<Button1
                  onClick={handleupgrade}
                  variant="outline"
                  className="upg-btn"
                  style={{
                    backgroundColor: "#545CEB",
                  }}
                >
                  <DoubleArrowUpIcon />
                  <span className="ml-2">Upgrade</span>
                </Button1>*/}
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{username[0]}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>{session.user?.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                   {/* <DropdownMenuItem>
                      <Link className="header-link" href={"/profile"}>
                        User Profile
                      </Link>
                    </DropdownMenuItem>*/}
                    {/* Subscription Status Section */}
      <div className="px-2 py-1.5 text-sm">
        {substatus === 'active' ? (
            <div className="flex items-center gap-2 text-gray-800">
                <Gem className="h-4 w-4" style={{
                    color: "#545CEB",
                  }} />
                <span>Premium Plan</span>
            </div>
        ) : (
            <div className="flex items-center gap-2 text-gray-600">
                <span>Free Plan</span>
            </div>
        )}
      </div>

      {/* Action Buttons Section */}
      {substatus === 'active' ? (
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="p-0">
                 <button onClick={handleCancel} className="w-full text-left flex items-center gap-2 px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 focus:bg-red-50 rounded-sm">
                    <XCircle className="h-4 w-4" />
                    <span>Cancel Subscription</span>
                 </button>
            </DropdownMenuItem>
        ) : (
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="p-0">
                <button onClick={handleupgrade} className="w-full text-left flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm">
                    <Rocket className="h-4 w-4" />
                    <span>Upgrade to Premium</span>
                </button>
            </DropdownMenuItem>
        )}
     
                    <DropdownMenuItem>
                      <Link className="header-link" href={"/api/auth/signout"}>
                        Sign Out
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                {/*<Link
                  className="hover:bg-gray-200 bg-gray-100 duration-300 text-[14px] text-[#18181B] rounded-[10px] py-2 px-4 font-normal whitespace-nowrap"
                  href={"/api/auth/signin"}
                  //style={{padding:'8px 16px'}}
                >
                  Sign in
                </Link>*/}
                <Link
                  className="hover:bg-gray-200 bg-gray-100 duration-300 text-[14px] text-[#18181B] rounded-[12px] py-2 px-4 font-normal whitespace-nowrap"
                  href={"/api/auth/signin"}
                >
                  Sign in
                </Link>
                <Link 
                className=""
                
                href={"/editor"}>
                  <Button1
                    className="rounded-[12px] font-normal whitespace-nowrap"
                    style={{
                      backgroundColor: "#323dd6",
                     
       // fontFamily: "Inter",
       // fontFeatures: "normal",
        fontSize: "15px",
        fontStyle: "normal",
       // fontVariationAxes: "normal",
        fontWeight: 400,
       lineHeight: "1.4em",
//pargaphS: "0px",
        textAlign: "start",
        color:"#ffffff",

    
                    }}
                  >
                    Start writing
                  </Button1>
                </Link>
              </div>
            )}
          </div>
          <nav
            className="flex flex-row items-center"
            style={{
              width: "65%",
            }}
          >
            <div className="flex" style={{ width: "40%" }}>
              <Link
                className=" duration-300 text-[15.5px] text-[#3f3f46] w-fit rounded-[6px] p-[3px] px-4 font-normal "
                href={"/"}
              >
                <Image src={logo} alt="ChatG6 Logo" width={100} height={50} />
              </Link>
            </div>

            <div
              className="relative right-20 left-20 flex justify-center items-center gap-0.5"
             style={{ width: isBreakpoint2? "40%":"45%" }}
            >
              <Link
                className="hover:bg-gray-200 duration-300 text-[15.5px] text-[#3f3f46] rounded-[6px] p-[3px] px-3 font-normal whitespace-nowrap"
                href={"/pricing"}
              >
                Pricing
              </Link>
              <Link
                className="hover:bg-gray-200 duration-300 text-[15.5px] text-[#3f3f46] rounded-[6px] p-[3px] px-3 font-normal whitespace-nowrap"
                href={"/"}
              >
                About
              </Link>
              <Link
                className="hover:bg-gray-200 duration-300 text-[15.5px] text-[#3f3f46] rounded-[6px] p-[3px] px-3 font-normal whitespace-nowrap"
                href={"/blog"}
              >
                Blog
              </Link>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
