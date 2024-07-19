"use client";
import React, { FC, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
//import { FiCopy } from 'react-icons/fi'; 
import EditorToolbar,{ modules, formats} from "./Mobile_Toolbar";
// import "./custom-quill.css";
import { Sapling } from "@saplingai/sapling-js/observer";
import { useEffect } from "react";
import { addStyles, EditableMathField } from "react-mathquill";
import ReactDOM from "react-dom/client";
import Search from "@/components/editor/Mobile_Search_tools";
import {OpenAIOutlined,OpenAIFilled} from "@ant-design/icons"
import { useOnClickOutside } from "usehooks-ts";
import { GearIcon, Share2Icon,TrashIcon,FileTextIcon, FilePlusIcon,ChatBubbleIcon } from "@radix-ui/react-icons";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import katex from "katex";
import { archive, delete_docs, Import_editor, plagiarism, savedocs, update, uplo } from "@/app/api/search_utils/literature_utils";
import { Button } from "../ui/button";
import { Button1 } from "../ui/upg-btn";

import ToastNotification from "./ToastNotification";
import ContextMenu from "./contextmenu";
import LiteraturePopup from "../Search/literature_popup";
import ReferencePopup from "../Search/ReferencePopup";
import { pdf } from "@/app/lib/helpers";
import Savemodal from "./savemodal";
import { redirect } from "next/navigation";
import axios from "axios";
import URLS from "@/app/config/urls";
import { FilePlus, FileText } from "lucide-react";
import Savemodalshare from "./sharemodal";
import Notify from "../Management/notification";
import ChatWindow from "../chatWindow/Mobile_chatWindow";
const getFile = async (name: string) => {
  const content = document.querySelector(".ql-editor");
  const katexStylesheet = document.createElement("link");
  katexStylesheet.href =
    "https://cdn.jsdelivr.net/npm/katex@0.13.18/dist/katex.min.css";
  katexStylesheet.rel = "stylesheet";
  document.head.appendChild(katexStylesheet);

  const katexScript = document.createElement("script");
  katexScript.src =
    "https://cdn.jsdelivr.net/npm/katex@0.13.18/dist/katex.min.js";
  document.head.appendChild(katexScript);
  if (content?.innerHTML) {
    content.innerHTML = "loading document...";
    //console.log(name);
    // Assuming uplo is an async function that returns a promise
    try {
     // console.log(name);
      const message = await uplo(name); // Await the uplo function
      //console.log(message.data);
      // Assuming the message contains the HTML content you want to display
      if (message.data.message) {
        content.innerHTML = message.data.message;
        return { success: true };
      } // Update the content with the received HTML
    } catch (error) {
      content.innerHTML = "Error uploading or retrieving HTML content";
      return { success: false };
      //console.error("Error uploading or retrieving HTML content:", error);
    }
  }
};
const updateFile = async (name: string) => {
  const content = document.querySelector(".ql-editor");
  const katexStylesheet = document.createElement("link");
  katexStylesheet.href =
    "https://cdn.jsdelivr.net/npm/katex@0.13.18/dist/katex.min.css";
  katexStylesheet.rel = "stylesheet";
  // document.querySelector(".ql-editor")?.appendChild(katexStylesheet);
  content?.appendChild(katexStylesheet);
  const katexScript = document.createElement("script");
  katexScript.src =
    "https://cdn.jsdelivr.net/npm/katex@0.13.18/dist/katex.min.js";
  //document.querySelector(".ql-editor")?.appendChild(katexScript);
  content?.appendChild(katexScript);
  if (content?.innerHTML) {
    if (content.innerHTML != "<p><br></p>") {
      let c = content.innerHTML;
      const blob = new Blob([c], { type: "text/html" });
     // console.log(c);

      // Assuming uplo is an async function that returns a promise
      try {
        const message = await update(blob, name); // Await the uplo function
        //console.log(message.data);
        if (message.data.success) {
          return { success: true };
        } else {
          return { success: false };
        }
      } catch (error) {
       // console.error("Error uploading or retrieving HTML content:", error);
        return { success: false };
      }
    } else {
      content.innerHTML = "you can not save an empty doucument";
      return { success: false };
    }
  }
};
const shareAspdf = async (name: string) => {
  const editor = document.querySelector(".ql-editor");
  if (editor && editor?.innerHTML == "<p><br></p>") {  editor.innerHTML = "you can not share an empty doucument";
  return { success: false,link:''};}
  const katexStylesheet = document.createElement("link");
  katexStylesheet.href =
    "https://cdn.jsdelivr.net/npm/katex@0.13.18/dist/katex.min.css";
  katexStylesheet.rel = "stylesheet";
  // document.querySelector(".ql-editor")?.appendChild(katexStylesheet);
  editor?.appendChild(katexStylesheet);
  const katexScript = document.createElement("script");
  katexScript.src =
    "https://cdn.jsdelivr.net/npm/katex@0.13.18/dist/katex.min.js";
  //document.querySelector(".ql-editor")?.appendChild(katexScript);
  editor?.appendChild(katexScript);
  if (editor?.innerHTML) {
    try {

        //console.log(editor.innerHTML);
      const s = await pdf(editor.innerHTML);
     // console.log(s);
      const { download_url, status, total_pages } = s;
      //console.log(download_url);
      let res = await savedocs("pdf", download_url, status, total_pages, "now",name);
      if (res.data.message=="Saved") {
      return { success: true,link:download_url };}}
     catch (error) {
      return { success: false,link:''};
    }
  };}

  const newfile = async function (name:string) {
    //const title = document.querySelector('.font-bold.flex.flex-col.justify-center') as HTMLElement;
    //if (title)
//{title.innerHTML=name;}
    const r= await archive(name);
    //console.log(r.data)
   // console.log(title)
    return { success: true,date:r.data.date }; // Indicate success
    
  };
const initialContextMenu = {
  show: false,
  x: 0,
  y: 0,
};
export const Editor = () => {
  // const handleViewLiterature = () => {
  //   setCustomLR(true);
  // };
  // const handleViewRef = () => {
  //   setCustomRef(true);
  // };
  const [value, setValue] = React.useState("");
  const [number, setNumber] = React.useState(0);
  const [words,setWords]= React.useState(0);
  const [contextMenu, setContextMenu] = useState(initialContextMenu);
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [shareVisible, setshareVisible] = useState(false);
  const [sharelink, setsharelink] = useState("https://pub-cdn.apitemplate.io/2024/05/91e33013-2423-48f4-a076-e66e6dfc78b8.pdf");
  const [sharestate, setsharestate] = useState("Share")
  const [current,setcurrent]=useState("Untitteled")
  const [verifyMessage, setVerifyMessage] = useState("");
  const [isNotif, setIsNotif] = useState(false);
  const [collectedItems, setCollectedItems] = useState([ { name: "", type: "", recieveDate: "" },]);
  const [showModalpro, setshowModalpro] = useState(false);
  const [update, updateItems] = useState(false);
  const [filename, setFilename] = useState("");
  const ref1 = React.useRef<HTMLDivElement>(null);
  const ref2 = React.useRef<HTMLDivElement>(null);
  useOnClickOutside(ref1, handlecancel);
  useOnClickOutside(ref2, handlecancelpr);
  // const [home, sethome] = useState(false)
  // if (home) { redirect('http://localhost:3000')}
  const handleshare = async ()=>{
  setsharestate("Sharing...");
const title = document.querySelector('.font-bold.flex.flex-col.justify-center') as HTMLElement;
const button = document.querySelector('.upg-btn.ml-2.mr-2') as HTMLButtonElement;
button.disabled = true;
if (title) {//console.log(title.innerHTML)
      const res = await shareAspdf(title.innerHTML)
    if (res?.success){
     // console.log(res?.success)
      //console.log(res?.link)
      setsharelink(res?.link)
     setshareVisible(true)
     setsharestate("Share");
     button.disabled = false;//}
    } else {setsharestate("Share"); button.disabled = false;}
  }}

  const handlechange = async(name:string)=>{
    let c1;
    if (current!="Untitteled") {
     const n = await updateFile(current);
     if(n?.success) {setIsNotif(true);
      c1 = current.length > 10? `${current.substring(0, 10)}...` : current;
       setVerifyMessage(`${c1} updated successfully`)
     }}
     const c = await getFile(name);

     const title = document.querySelector('.font-bold.flex.flex-col.justify-center') as HTMLElement;
     const title2 = document.querySelector('.font-bold.flex.flex-col.flex-wrap.justify-center') as HTMLElement;
        if (title)
            {title.innerHTML=name.length > 14? `${name.substring(0, 14)}...` : name;}
        if (title2) {title2.innerHTML=name;}
      setcurrent(name);
      setshowModalpro(false)
    }
    function handlecancelpr() {
      setshowModalpro(false);
    }
  const quillRef = React.useRef<any>();
  useEffect(() => {
    const Fetch = async () => {
      if (update) {
        const resp = await Import_editor("html");
        if (resp.data) {
         // console.log(resp.data.imports);
          setCollectedItems(resp.data.imports);
        }
        updateItems(false);
      }
    };
    Fetch();
  }, [update, collectedItems]);
  useEffect(() => {
    const Fetch = async () => {
      const resp = await Import_editor("html");
      if (resp.data) {
        //console.log(resp.data.imports);
        setCollectedItems(resp.data.imports);
      }
    };
    Fetch();
  }, []);
  useEffect(() => {
    Sapling.init({
      key: process.env.NEXT_PUBLIC_SAPLING_API_KEY,
      endpointHostname: "https://api.sapling.ai",
      editPathname: "/api/v1/edits",
      advancedEdits: {
        advance_edits: true,
      },

      statusBadge: true,
      mode: "dev",
    });

    // Ensure the Quill instance is initialized before observing
    if (quillRef.current) {
      const quillInstance = quillRef.current.getEditor();

      // console.log('editor :',quillInstance);
      const contentEditable = quillInstance.root;
      //  console.log(contentEditable);
      Sapling.observe(contentEditable);
    }
  });
  const closeshare = () => {
    setshareVisible(false);
  };
  const PlagiarismChecker: FC = () => {
    const [quotaplg, setquotaplg] = useState(50);
    const [status, setstatus] = useState('');
    const [toastVisible, setToastVisible] = useState(false);
    const [output, setOutput] = useState("");
    const [checking, setCheckingState] = useState<boolean>(false);
    const [buttonText, setButtonText] = useState("Plagiarism Check");
    
    const handleCheckButton = () => {
      setCheckingState(true);
    };
    const showToast = () => {
      setToastVisible(true);
    };

    const closeToast = () => {
      setToastVisible(false);
    };

    useEffect(() => {
      const fetchLR = async ()=> {
        const resp = await axios.post(URLS.endpoints.status);
        //console.log(resp.data.statuss)
        //console.log(resp.data.quotaplg)
        if (resp.data.statuss != 'unknown') {setstatus(resp.data.statuss)}
        if (resp.data.quotaplg != 500) {setquotaplg(resp.data.quotaplg)}
      }
      fetchLR();
      },[status,setstatus,quotaplg,setquotaplg])
    useEffect(() => {
      try {
        const quill = quillRef.current.getEditor();
        const length = quill.getLength();
        const text = quill.getText(0, length);
        if (checking) {
          if (status==='active' || quotaplg!=0) {
          if (text.length === 1) {
            setOutput("Enter some text please");
          } else {
            setButtonText("checking..");
            const button: any = document.querySelector(
              ".plg-check-button-editor"
            );
            button.disabled = true;
            const plgFetch = async () => {
              const response = await plagiarism(text);
              setOutput(response?.data.message);
              setToastVisible(true);
              setButtonText("Plagiarism Check");
              button.disabled = false;
              if (status != 'active') {
                const resp = await axios.post(URLS.endpoints.quotaplg);
                if (resp.data.quotaplg != 500)
                {setquotaplg(resp.data.quotaplg)}
              }
            };
            plgFetch();
          }
       } else {setOutput("Quota has reached maximum.Upgrade for more content")
        setToastVisible(true)} } 
      } catch (error) {
        if (error instanceof Error) {
          setOutput(error.message);
        } else {
          setOutput("An unknown error occurred");
        }
      } finally {
        setCheckingState(false);
      }
      PlagiarismChecker;
    }, [checking, output]);
    return (
      <div className="plag">
        <ToastNotification visible={toastVisible} onClose={closeToast} />
        <Button
          className="plg-check-button-editor h-16  w-fit"
          variant="outline"
          onClick={handleCheckButton}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="#52525b"
            className="bi bi-shield-check"
            viewBox="0 0 16 16"
          >
            <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56" />
            <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0" />
          </svg>
          <span className="ml-2">{buttonText} </span>
        </Button>
        {/* <button onClick={showToast}>submit</button> */}
        {/* <p>{output}</p> */}
      </div>
    );
  };
 
 

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setValue(value);
    }
  };
  const handledelete = async(name:string)=>{
       
    let n1;
 const n = await delete_docs(name);
if(n?.data.success) {setIsNotif(true);
 n1 = name.length > 10? `${name.substring(0, 10)}...` : name;
   setVerifyMessage(`${n1} deleted successfully`)
   const filteredProjects = collectedItems.filter(project => project.name != name);
   setCollectedItems(filteredProjects)
   setshowModalpro(false)
 }

}
const handlegetprojs = () => {
  //console.log("done");
  setshowModalpro(true); // Show the modal
};

  const handleEditorChange = (value: string) => {
    setValue(value);
    const quill = quillRef.current.getEditor();
    const length = quill.getLength();
    const text = quill.getText();
    setNumber(length - 1);
    if(length-1==0)
      {
        setWords(0);
      }else{
        setWords(text.split(/\s+/).length-1 );
      }
  };
  const handleupgrade = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/pricing`
    
  };
  const handlenew = ()=>{
    //const newProjectName = prompt("Enter project name:");
    setShowModal(true);
  }
  const handleFilenameSubmit = async () => {
    //console.log("Filename submitted:", filename);
    // Here you can handle the filename, e.g., save the file to the server
    setShowModal(false); // Hide the modal
    let res;
    if (filename) {
            const res = await newfile(filename);
            const now = new Date();
           // console.log(now)
            const newpro = {name: filename, type: "html", recieveDate: res.date }
            setCollectedItems([...collectedItems, newpro]); // Add new project to the array
    } 
    setFilename(""); // Reset the filename input field
  };
  function handlecancel() {
    setShowModal(false);
    setFilename("");
  }

  const handleHideContextMenu = () => {
    setContextMenu(initialContextMenu);
  };
  
  // const handleredirect = () => {
  //   sethome(true)
  //   //redirect('/api/auth/signin?callbackUrl=/profile')
  // };
  const copyTextToClipboard = async (text:string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  function handleAI() {
    let x = 150;
    let y = 50;
    setContextMenu({ show: true, x, y });
  }
  return (
    <div className="Editor relative mx-auto flex flex-col">
       {isNotif && (
        <Notify message={verifyMessage} dur={30} display={setIsNotif} />
      )}
      {contextMenu.show && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          closeContextMenu={handleHideContextMenu}
        />
      )}
      {/* <ModeToggle /> */}
      <div className=" flex justify-between flex-row pe-2 ps-4 h-14 bg-white"
      style={{
        height:'5%'
      }}
      >
        {<span className="font-bold flex flex-col justify-center "
        style={{
            width:'50%',
          }}>
          Untitteled
        </span>}
        <span className="font-bold flex flex-col flex-wrap justify-center "
        style={{
            display:'none'
          }}>
          Untitteled
        </span>
{<div className="flex flex-col justify-center">
        <Sheet>
            <SheetTrigger className="ml-2 mr-2">
              <GearIcon className="w-4 h-4 " style={{ color: "#52525b" }} />
            </SheetTrigger>
            <SheetContent
              className="options-sheet"
              onInteractOutside={(event) => event.preventDefault()}
            >
              <SheetHeader>
                <SheetTitle
                  style={{
                    color: "#171717",
                    fontWeight: "normal",
                    marginLeft: "24px",
                  }}
                >
                  {" "}
                  &gt;&gt; &nbsp; &nbsp; Document Settings
                </SheetTitle>
                <SheetDescription className="mobile_sheet_description">
                  {<Search  />}
                 {/*<ChatWindow/>*/}
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
          </div>}
         <div className="flex flex-col justify-center">
         <Sheet>
            <SheetTrigger className="ml-2 mr-2">
              <ChatBubbleIcon/>
            </SheetTrigger>
            <SheetContent
              className="options-sheet"
              onInteractOutside={(event) => event.preventDefault()}
            >
              <SheetHeader>
                <SheetTitle
                  style={{
                    color: "#171717",
                    fontWeight: "normal",
                    marginLeft: "24px",
                  }}
                >
                  {" "}
                  &gt;&gt; &nbsp; &nbsp; Document Settings
                </SheetTitle>
                <SheetDescription className="mobile_sheet_description1">
                 {<ChatWindow/>}
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
         </div>
          <button
            title="AI-assistant"
            onClick={handleAI}
          >
      { /*OpenAIOutlined,OpenAIFilled,ApiFilled,RobotFilled,RobotOutlined*/}
      <OpenAIFilled/>
          </button>
          
                  <button onClick={handlenew}>
                  <FilePlusIcon />
                      </button>
                      {showModal && (
                        <Savemodal role="saveModal w-16">
                          <div>
                            <input
                              type="text"
                              value={filename}
                              onChange={(e) => setFilename(e.target.value)}
                              placeholder="Enter filename"
                            />
                            <div className="controls ">
                              <button onClick={handleFilenameSubmit}>Create</button>
                              <button onClick={handlecancel}>Cancel</button>
                            </div>
                          </div>{" "}
                        </Savemodal>
                      )}
                  
        <button
            title="import saved projects to editor"
            className="ql-getprojs"
            onClick={handlegetprojs}
          >
            
            <FileTextIcon/>
          </button>
        {showModalpro && (
            <Savemodal role="importModal">
              <h1>Saved works</h1>
              <div className="items">
                {collectedItems.map((option, index) => (
                 <li key={index} className="li-project-content">
                 <span  className="items-list items-list-project"
                 style={{
                   width: '100%',
                   display: 'flex',
                 }}
                 >
                   <span
                   style={{
                     display:'flex',
                     flexDirection:'row',
                     width:'80%',
                   }}
                   >
                   <FileText stroke="#71717a" />
                   {option.name.length > 10? `${option.name.substring(0, 10)}...` : option.name}<br/> 
                  </span>
                  <span  style={{
                              width:'80%',
                             display:'flex',
                             flexWrap:'wrap',
                             justifyContent:'end'
                              
                            }}
                            >
                              {/* <span className="ml-2 import-data">
                                {parse_date(option.recieveDate)}
                              </span>  */}
                              <button className='far fa-edit mr-4' onClick={()=>handlechange(option.name)}/>
                              <button  onClick={()=>handledelete(option.name)}><TrashIcon/> </button>
                            </span>
                          </span> {/* Render project as a button */}
                        </li>
                ))}
              </div>
              <div className="controls">
                <button onClick={handlecancelpr}>Cancel</button>
              </div>
            </Savemodal>
          )}
          <button  onClick={handleshare}>
          <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              fill="currentColor"
              className="bi bi-share-fill"
              viewBox="0 0 16 16"
            >
              <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5" />
            </svg>
           {/*<span className="ml-2">{sharestate}</span>*/}
          </button>
          <button  onClick={handleupgrade}><svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              fill="currentColor"
              className="bi bi-lightning-charge-fill"
              viewBox="0 0 16 16"
            >
              <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z" />
            </svg>
</button>
        {/*<div className="btn-div-editor">
         <Button1 onClick={handleshare} variant="outline" className="upg-btn ml-2 mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              fill="currentColor"
              className="bi bi-share-fill"
              viewBox="0 0 16 16"
            >
              <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5" />
            </svg>
            <span className="ml-2">{sharestate}</span>
          </Button1>
          { <Button1 variant="outline" className="upg-btn ml-2 mr-2" onClick={handleupgrade}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              fill="currentColor"
              className="bi bi-lightning-charge-fill"
              viewBox="0 0 16 16"
            >
              <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z" />
            </svg>
            <span className="ml-2">Upgrade</span>
          </Button1>}
    
          <Sheet>
            <SheetTrigger className="ml-2 mr-2">
              <GearIcon className="w-6 h-6 " style={{ color: "#52525b" }} />
            </SheetTrigger>
            <SheetContent
              className="options-sheet"
              onInteractOutside={(event) => event.preventDefault()}
            >
              <SheetHeader>
                <SheetTitle
                  style={{
                    color: "#171717",
                    fontWeight: "normal",
                    marginLeft: "24px",
                  }}
                >
                  {" "}
                  &gt;&gt; &nbsp; &nbsp; Document Settings
                </SheetTitle>
                <SheetDescription>
                  <Search />
                  
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>*/}
      </div>
      <EditorToolbar />
      <div id="context">
        <ReactQuill
          value={value}
          onChange={handleEditorChange}
          modules={modules}
          onKeyDown={handleKeyDown}
          formats={formats}
          ref={quillRef}
        />
      </div>

      <div className="flex justify-between items-center  center-div flex-wrap">
        <div className="content-center items-center flex flex-row" style={{height:'35px'}}>
          <div className="ml-3 text-base flext content-center ">
            {number} character
          </div>
          <div className="ml-3 text-base flext content-center ">
            {words} words
          </div>
        </div>
           
          <PlagiarismChecker />
      </div>
          
            <Savemodalshare role="saveModal" visible={shareVisible} onClose={closeshare}>
            <div>
              <div>
                <span style = {{
                display: 'inline-block',
                maxWidth: '300px', // Fixed width
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                verticalAlign: 'middle',
                 // Space between text and icon
              }}>{sharelink}</span>
              </div>
              <div className="controls">
              <button onClick={() => copyTextToClipboard(sharelink)}>Copy</button>
              <button onClick={closeshare}>Cancel</button>  </div>
              {copied && <p>Copied!</p>}
            </div>
            </Savemodalshare>
          
    </div>
  );
};

export default Editor;