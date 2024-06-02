import { Switch } from "@/components/ui/switch"

import { Button1 } from "@/components/ui/upg-btn";
import { DiscordLogoIcon,TwitterLogoIcon,InstagramLogoIcon,LinkedInLogoIcon,CheckCircledIcon } from "@radix-ui/react-icons";
import Image from 'next/image'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Link from "next/link";
import { EB_Garamond } from 'next/font/google'



const inter = EB_Garamond({
  subsets: ['latin'],
  display: 'swap',
})

import img from '@/public/Container.svg'
import icon2 from '@/public/Overlay.svg'

import icon from '@/public/icons/icon.svg'
import { outline } from "../api/search_utils/literature_utils";







export default async function pricing() {
  return (
    <section className="home-page overflow-auto flex flex-col justify-center flex-wrap content-center text-center mt-4" >
      
      <div className="div-1 items-center flex-wrap flex-col flex w-full">
        <span className={`${inter.className} flex`}
        style={{
          fontSize:'80px',
          color:'#010542',
        }}>
          Simple, transparent pricing
        </span>
        <div className="flex flex-col justify-center content-center mt-4"
        style={{
          alignContent: 'center',
          flexWrap: 'wrap',
        }}
        >
          <span style={{
            width:'600px',
            fontSize:'22px'
          }}>
            No credit card required, cancel anytime
          </span>
        </div>
        <div className="flex flex-row justify-center content-center items-center mt-12 mb-6  flex-wrap">
          <Switch className='correction-switch' />
          <span className=" ml-4 text-xs flex flex-row gap-1 items-center text-left h-full">
            Annual
            <Image src={icon2} alt='7'/>
          </span>
        </div>

        <div className="mt-4 flex flex-row gap-12 w-full justify-center ">
            <div className="text-left flex flex-col gap-4 w-1/6 justify-between p-2"  
            style={{
              height:'27rem',
              border:'1px solid rgba(0,0,0,0.05)',
              borderRadius:'16px'
            }}
            >
              <div className="flex flex-col gap-4 w-full justify-center">
                <span
                style={{
                  color:'#A1A1AA',
                }}
                >
                  Free
                </span>
                <div>
                  <span className={`${inter.className}`}
                  style={{
                    color:'black',
                    fontSize:'80px'
                  }}
                  >
                    &#36;0
                  </span>
                  <span
                  style={{
                    color:'#71717A',
                    fontSize:'18px'
                  }}                
                  >
                    /month
                  </span>
                </div>
                <ul className="flex flex-col gap-1">
                  <li className="  text-xs flex flex-row gap-1 items-center text-left">
                    <CheckCircledIcon 
                    style={{
                      color:'#1722BE',
                    }}
                    />
                    200 AI words per day
                  </li>
                  <li className="  text-xs flex flex-row gap-1 items-center text-left">
                    <CheckCircledIcon 
                    style={{
                      color:'#1722BE',
                    }}
                    />
                    Unlimited PDF uploads
                  </li>
                  <li className="  text-xs flex flex-row gap-1 items-center text-left">
                    <CheckCircledIcon
                    style={{
                      color:'#1722BE',
                    }}
                    />
                    AI Autocomplete
                  </li>
                  <li className="  text-xs flex flex-row gap-1 items-center text-left">
                    <CheckCircledIcon
                    style={{
                      color:'#1722BE',
                    }}
                    />
                    Journal & web citations
                  </li>
                  <li className="  text-xs flex flex-row gap-1 items-center text-left">
                    <CheckCircledIcon
                    style={{
                      color:'#1722BE',
                    }}
                    />
                    AI editing commands
                  </li>
                </ul>
              </div>
              <Button1 
              variant={"outline"}
              className=" text-sm w-full" 
              style={{
                
              }}>
                Start for free
              </Button1>
            </div>


            <div className="text-left flex flex-col gap-4 w-1/6 justify-between p-2" 
            style={{
              height:'27rem',
              border:'1px solid rgba(0,0,0,0.1)',
              borderRadius:'16px'
            }}
            >
              <div className="flex flex-col gap-4 w-full justify-center">
                <span
                style={{
                  color:'#A1A1AA',
                }}
                >
                  Unlimited
                </span>
                <div>
                  <span className={`${inter.className}`}
                  style={{
                    color:'black',
                    fontSize:'80px'
                  }}
                  >
                    &#36;20
                  </span>
                  <span
                  style={{
                    color:'#71717A',
                    fontSize:'18px'
                  }}                
                  >
                    /month
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="  text-xs flex flex-row gap-1 items-center text-left">
                    <CheckCircledIcon 
                    style={{
                      color:'#1722BE',
                    }}
                    />
                    Unlimited AI words 
                  </span>
                  <span className="  text-xs flex flex-row gap-1 items-center text-left">
                    <CheckCircledIcon 
                    style={{
                      color:'#1722BE',
                    }}
                    />
                    AI Autocomplete
                  </span>
                  <span className="  text-xs flex flex-row gap-1 items-center text-left">
                    <CheckCircledIcon
                    style={{
                      color:'#1722BE',
                    }}
                    />
                   Unlimited PDF uploads
                  </span>
                  <span className="  text-xs flex flex-row gap-1 items-center text-left">
                    <CheckCircledIcon
                    style={{
                      color:'#1722BE',
                    }}
                    />
                    Journal & web citations
                  </span>
                  <span className="  text-xs flex flex-row gap-1 items-center text-left">
                    <CheckCircledIcon
                    style={{
                      color:'#1722BE',
                    }}
                    />
                    AI editing commands
                  </span>
                  <span className="  text-xs flex flex-row gap-1 items-center text-left">
                    <CheckCircledIcon
                    style={{
                      color:'#1722BE',
                    }}
                    />
                    Priority support
                  </span>
                  <span className="  text-xs flex flex-row gap-1 items-center text-left">
                    <CheckCircledIcon
                    style={{
                      color:'#1722BE',
                    }}
                    />
                    Access to latest features
                  </span>
                </div>
              </div>
              
              <Button1 
              className=" text-sm w-full " 
              style={{
                backgroundColor:'#545CEB',
              }}>
                Go
              </Button1>
            </div>

          </div>

        <div className="flex flex-row items-center gap-9 mt-12 mb-12">
          <div className="flex flex-col">
            <div></div>
            <span className=" flex flex-row gap-1 text-left">
              <Image src={icon} alt='7'/>
              <span className="font-bold text-xl">
                Team Pricing 
              </span>
              <span className="text-lg">
                (5+ seats)
              </span>
            </span>
            <span className="mt-1 text-xs  text-left"
            style={{
              width:'30rem'
            }}
            >
              Give your research team the most advanced AI tools. Suitable for research labs and Universities.
            </span>
          </div>
              <Button1 
              className=" text-sm" 
              variant={"outline"}
              style={{
          
                
              }}>
                Enquire Now
              </Button1>
          
        </div>
      </div>

      {/* ___________________________________________________________________________ */}

      <div className="div-4 flex flex-col items-center"
      style={{
        backgroundColor:'#FAFAFA',
      }}
      >
      <span className="text-xs mt-24" 
        style={{
          color:'#1722BE',
        }}
        >
          CUSTOMER LOVE
        </span>
        <span className={`${inter.className} text-6xl mt-4`}
        style={{
          color:'#27272A'
        }}
        >
          Join 2 million empowered writers 
        </span>
        <span className="text-xl mt-4 mb-6"
        style={{
          color:'#52525B'
        }}
        >
          Join researchers from across the globe transforming their paper writing process
        </span>
        <Image className="mb-24" src={img} alt="11"/>
      </div>

      {/* ___________________________________________________________________________ */}

      <div className="div-7 flex flex-wrap content-center justify-center text-start flex-col items-center"
      style={{
        backgroundColor:'#FFFFFF'
      }}
      >
        
      <span className="text-xs mt-24" 
        style={{
          color:'#1722BE',
        }}
        >
          SUPPORT
        </span>
        <span className={`${inter.className} text-6xl mt-4 mb-4`}
        style={{
          color:'#27272A'
        }}
        >
          Frequently asked questions 
        </span>

        <Accordion type="single" collapsible className="text-2xl mb-24 mt-4"
        style={{
          width:'1040px',

        }}
        >
          <AccordionItem value="item-1" className="bg-white ps-4 pe-4  rounded-lg mb-2">
            <AccordionTrigger>Can I cancel my subscription at any time?</AccordionTrigger>
            <AccordionContent className="text-base">
              Yes, you can cancel your plan at any time. You will still have access to all documents previously created with ChatG6.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2"  className="bg-white ps-4 pe-4  rounded-lg mb-2">
            <AccordionTrigger>How does the word count work?</AccordionTrigger>
            <AccordionContent className="text-base">
            We only ever count words that you accept from ChatG6. If you {`don't`} like a generation and {`don't`} accept it, it is NOT added towards your word count 😊 
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3"  className="bg-white ps-4 pe-4  rounded-lg mb-2">
            <AccordionTrigger>What kind of citations does ChatG6 make and how can I ensure the accuracy?</AccordionTrigger>
            <AccordionContent className="text-base">
            ChatG6 uses AI to find most relevant citations for your text. Choose between APA, MLA, Harvard and more.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4"  className="bg-white ps-4 pe-4  rounded-lg mb-2">
            <AccordionTrigger>What payment methods are available?</AccordionTrigger>
            <AccordionContent className="text-base">
            Our secure Stripe checkout supports all major credit cards.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* ___________________________________________________________________________ */}

      <div className="div-8 flex flex-col items-center"
      >
        <span className={`${inter.className} text-6xl mt-24`}
        style={{
          color:'#27272A'
        }}
        >
          Try ChatG6 for free today
        </span>
        <span className="text-xl mt-4"
        style={{
          color:'#52525B'
        }}
        >
          Write your first paper with ChatG6 today and never look back
        </span>
        <Link className="header-link" href={"/editor"}>
          <Button1 
            className="mt-10 text-2xl h-14 mb-24" 
            style={{
              width:'250px',
              backgroundColor:'#545CEB',
            }}>
              Start writing
          </Button1>
        </Link>
      </div>

      {/* ___________________________________________________________________________ */}
      
      <div className="div-9  flex flex-wrap  justify-center text-start flex-col items-center  "
      style={{
        backgroundColor:'#18181B',
      }}
      >
        <div className="flex flex-wrap  justify-center text-start flex-row items-start gap-8 mt-24">
          <div className="flex flex-col flex-wrap justify-center content-center items-start gap-4 w-40">
          <span className="text-2xl"
          style={{
            color:'#FAFAFA',
          }}
          >
            ChatG6
          </span>
          <span
          style={{
            color:'#D4D4D8',
          }}
          >
          Supercharge your next research paper
          </span>
            <Link className="header-link" href={"/editor"}>
              <Button1 
              className=" text-sm" 
              style={{
                width:'100px',
                backgroundColor:'#545CEB',
              }}>
                Start writing
              </Button1>
            </Link>

          </div>
          
          <div className="flex flex-col flex-wrap justify-center content-center items-start  gap-4 w-40">
        <span 
          style={{
            color:'#FAFAFA',
          }}
          >
            Use Cases
          </span>
          <span 
          style={{
            color:'#A1A1AA',
          }}
          >
            AI Essay Writer
          </span>
          <span 
          style={{
            color:'#A1A1AA',
          }}
          >
            Essay Expander
          </span>
          <span 
          style={{
            color:'#A1A1AA',
          }}
          >
            Sentence & Paragraph Expansion
          </span>
          <span 
          style={{
            color:'#A1A1AA',
          }}
          >
            AI Essay Outline Generation
          </span>
          <span 
          style={{
            color:'#A1A1AA',
          }}
          >
            AI Summarizer
          </span>
          <span 
          style={{
            color:'#A1A1AA',
          }}
          >
            Paragraph Generator
          </span>
          <span 
          style={{
            color:'#A1A1AA',
          }}
          >
            For Researchers
          </span>
          <span 
          style={{
            color:'#A1A1AA',
          }}
          >
            Paraphrasing Tool
          </span>
          <span 
          style={{
            color:'#A1A1AA',
          }}
          >
            Literature Review Generator
          </span>
          <span 
          style={{
            color:'#A1A1AA',
          }}
          >
            Thesis Statement Generator
          </span>
          </div>

          <div className="flex flex-col flex-wrap justify-center content-center items-start  gap-4 w-40">
        <span 
          style={{
            color:'#FAFAFA',
          }}
          >
            Company
          </span>
          <span 
          style={{
            color:'#A1A1AA',
          }}
          >
            Careers
          </span>
          <span 
          style={{
            color:'#A1A1AA',
          }}
          >
            Influencer program
          </span>

          </div>
          
          <div className="flex flex-col flex-wrap justify-center content-center items-start  gap-4 w-40">
        <span 
          style={{
            color:'#FAFAFA',
          }}
          >
            Legal
          </span>
          <span 
          style={{
            color:'#A1A1AA',
          }}
          >
            Terms of Service
          </span>
          <span 
          style={{
            color:'#A1A1AA',
          }}
          >
            Privacy Policy
          </span>
          <span 
          style={{
            color:'#A1A1AA',
          }}
          >
            Refund Policy
          </span>
          </div>
        </div>
        
        <div className="flex flex-wrap  justify-center text-start flex-row items-center gap-64 mt-10 border-t-2 h-16 " 
        style={{
          color:'#A1A1AA'
        }}
        >
          <span className="flex flex-col">
            <span>
              Copyright© 2024 G6 Company Inc.
            </span>
            <span> 
              All rights reserved.
            </span>
          </span>
          <div className="flex flex-row content-evenly gap-7">
          <DiscordLogoIcon/>
          <LinkedInLogoIcon/>
          <TwitterLogoIcon/>
          <InstagramLogoIcon/>
          </div>
        </div>
      </div>
      {/* ___________________________________________________________________________ */}
    </section>
  );
}
