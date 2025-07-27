import { Button1 } from "@/components/ui/upg-btn";
import { DiscordLogoIcon,TwitterLogoIcon,InstagramLogoIcon,LinkedInLogoIcon,CheckCircledIcon } from "@radix-ui/react-icons";
import Image from 'next/image'
import { articles } from "@/public/props";
import Link from "next/link";
import { EB_Garamond } from 'next/font/google'


interface Article {
  type: string;
  date: string;
  cover: string;
  title: string;
}

const inter = EB_Garamond({
  subsets: ['latin'],
  display: 'swap',
})



export default function  Laptop(){
  return (
      <section className=" overflow-auto flex flex-col justify-center flex-wrap content-center text-center mt-4" >
      
      <div className="articles-container div-1 items-center flex-wrap flex-col flex w-full">
        <span className={`${inter.className} flex`}
        style={{
          fontSize:'80px',
          color:'#010542',
        }}>
          Blog
        </span>
        {articles.map((article: Article, index: number) => (
        <div key={index} className="article-card">
          <div className="article-cover">
            <Image width={70} height={70} src={article.cover} alt={article.title} />
          </div>
          <div className="article-details">
            <div className="article-meta">
              <span
              style={article.type=='Guide'?{ 
                color:'#7755cc',
              }:{
                color:'#ff88aa',
              }}
              >{article.type}</span>
              <span style={{
                color:'#999999'
              }}>{article.date}</span>
            </div>
            <h2 className={`${inter.className}`}>{article.title}</h2>
          </div>
        </div>
      ))}

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
  )
}
