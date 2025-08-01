"use client";
import React, { useEffect, useState } from "react";
import { Button, Input } from 'antd';
import { FilePlus,FileText,Search} from "lucide-react"; 
//import logo from '@/public/Logo.svg'
import logo from '@/public/logo-chatg6-svg.svg'
import Image from 'next/image'
import { Import_editor, archive, delete_docs, update, uplo, upload } from "@/app/api/search_utils/literature_utils";
import { parse_date } from "@/app/lib/utils";
import Savemodal from "./savemodelfinished";
import Notify from "../Management/notification";
import Link from "next/link";
import { MagnifyingGlassIcon,Cross2Icon} from "@radix-ui/react-icons";



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
       // console.log(message.data);
        return { success: true };
      } catch (error) {
        //console.error("Error uploading or retrieving HTML content:", error);
        return { success: false };
      }
    } else {
      content.innerHTML = "you can not save an empty doucument";
      return { success: false };
    }
  }
};
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
       // console.log(message.data);
        // Assuming the message contains the HTML content you want to display
        if (message.data.message) {
          content.innerHTML = message.data.message;
          return { success: true };
        }
        else { content.innerHTML = '';
            return { success: true };} // Update the content with the received HTML
      } catch (error) {
        content.innerHTML = "Error uploading or retrieving HTML content";
        return { success: false };
        console.error("Error uploading or retrieving HTML content:", error);
      }
    }
  };
const deleteContents = async function (name:string) {
    const editor = document.querySelector(".ql-editor");
    const button = document.querySelector(".ql-paraphrasebtn") as HTMLButtonElement;
    const title = document.querySelector('.font-bold.flex.flex-col.justify-center') as HTMLElement;
    const r= await archive(name);
   // console.log(r.data)
   // console.log(title)
    if (editor) {
      const content = editor.innerHTML; // Store the current content for logging or other purposes
      //console.log(content);
      if (title)
        {title.innerHTML=name;}
      // Clear the editor's content
      editor.innerHTML = ''; // This clears the editor
  
      button.disabled = false;
      return { success: true }; // Indicate success
    }
  };
  
  const newfile = async function (name:string) {
    //const title = document.querySelector('.font-bold.flex.flex-col.justify-center') as HTMLElement;
    //if (title)
//{title.innerHTML=name;}
    const r= await archive(name);
    //console.log(r.data)
   // console.log(title)
    return { success: true,date:r.data.date }; // Indicate success
    
  };
export const Projects = () => {
    const [show,setShow]=useState(true)
    const [current,setcurrent]=useState("Untitteled")
    const [showModal, setShowModal] = useState(false);
    const [filename, setFilename] = useState("");
    const [filename2, setFilename2] = useState("");
    const [projects, setProjects] = useState([ { name: "", type: "", recieveDate: "" },
    { name: "", type: "", recieveDate: "" },]);
    const [projects2, setProjects2] = useState([ { name: "", type: "", recieveDate: "" },
    { name: "", type: "", recieveDate: "" },]);
    const [isNotif, setIsNotif] = useState(false);
    const [search, setsearch] = useState(false);
    const [failed, setfailed] = useState(false);
    const [verifyMessage, setVerifyMessage] = useState("");
    const showmenu=()=>{
        if(show==true)
            setShow(false)
        else
            setShow(true)
    }
    const handlenew = ()=>{
      //const newProjectName = prompt("Enter project name:");
      setShowModal(true);
    }
    const handlesearch = (name:any)=>{
        //console.log(projects)
       // console.log(name)
        setfailed(false)
        //const newProjectName = prompt("Enter project name:");
        setFilename2(name);
        //options2 = projects.filter(project => project.name === filename2);
        //console.log(options2)
        //setProjects(options2)
        setsearch(true)
      }
    const handlechange = async(name:string)=>{
      if (current!="Untitteled") {
       const n = await updateFile(current);
       if(n?.success) {setIsNotif(true);
       // let c1 = current.length > 14? `${current.substring(0, 14)}...` : current;
         setVerifyMessage(`${current} updated successfully`)
       }}
       const c = await getFile(name);

        const title = document.querySelector('.font-bold.flex.flex-col.justify-center') as HTMLElement;
        const title2 = document.querySelector('.font-bold.flex.flex-col.flex-wrap.justify-center') as HTMLElement;
        if (title)
            {title.innerHTML=name.length > 14? `${name.substring(0, 14)}...` : name;}
        if (title2) {title2.innerHTML=name;}
        setcurrent(name);
        
      }
      const handledelete = async(name:string)=>{
       
       
        const n = await delete_docs(name);
       if(n?.data.success) {setIsNotif(true);
          setVerifyMessage(`${name} deleted successfully`)
          const filteredProjects = projects.filter(project => project.name != name);
          setProjects(filteredProjects)
          setProjects2(filteredProjects)
        }
    
      }
    let options = [
        { name: "option1", type: "Option 1", recieveDate: "" },
        { name: "option2", type: "Option 2", recieveDate: "" },
        // Add more options as needed
      ];
      let options2 = [
        { name: "option1", type: "Option 1", recieveDate: "" },
        { name: "option2", type: "Option 2", recieveDate: "" },
        // Add more options as needed
      ];
    //options = projects;
    useEffect(() => {
        const Fetch = async () => {
          const resp = await Import_editor("html");
          if (resp.data) {
           // console.log(resp.data.imports);
            setProjects(resp.data.imports);
            setfailed(false)
          }
        };
        Fetch();
      }, []);
      useEffect(() => {
        const Fetch = async () => {
            if((filename2 =='' ||filename2 ==' ') && projects[0]?.name === '' ) {
          const resp = await Import_editor("html");
          if (resp.data) {
            //console.log(resp.data.imports);
            setProjects(resp.data.imports);
            setProjects2(resp.data.imports)
            setfailed(false);
            //setFilename2('eg. Title')
          }}
        };
        Fetch();
      }, [setFilename2,filename2,projects2,search]);
      useEffect(() => {
        if (search) {
       setsearch(true);
      //console.log(filename2)
       //console.log(projects2)
         // Filter the projects array based on the name
  const filteredProjects = projects2.filter(project => project.name === filename2);
  projects2.forEach(project => console.log(project.name));
  //options = filteredProjects;
  // Update the filteredProjects array or however you wish to use the filtered data
  // For example, setting it to a state variable or logging it
  //console.log(filteredProjects);
  if (filteredProjects.length !=0)
  {setProjects(filteredProjects);}
  else {setfailed(true)
    //console.log(filename2)
  }
 // setsearch(false)
}
      }, [setFilename2,filename2,projects2,search]);
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
                setProjects([...projects, newpro]); // Add new project to the array
        } 
        setFilename(""); // Reset the filename input field
      };
      function handlecancel() {
        setShowModal(false);
        setFilename("");
      }
      const handleClear=()=>{
        setFilename2("")
      }

    return (
        <div className="hamburgermenu " >
           <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
            <div className="flex row w-full justify-between main-side-bar ">
                <Link className='ml-1 flex justify-center' href={"/"}>
                  <Image className=''  src={logo} alt="ChatG6 Logo" width={100} height={50}  style={show? {display:'none'}:{display:'flex'}}/>
                </Link>
          
                <button onClick={showmenu} className="flex flex-col justify-center h-full mr-1" >
                    {
                    show?
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#52525b" className="bi bi-layout-sidebar-inset-reverse" viewBox="0 0 16 16">
                            <path d="M2 2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm12-1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2z"/>
                            <path d="M13 4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1z"/>
                        </svg>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#52525b" className="bi bi-layout-sidebar-inset" viewBox="0 0 16 16">
                          <path d="M14 2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2z"/>
                          <path d="M3 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>
                        </svg>
                    }
                </button>
            </div>

            {isNotif && (
        <Notify message={verifyMessage} dur={10} display={setIsNotif} />
      )}
                <div className="list-projects" style={show? {display:'none'}:{display:'flex'}}>
                  <div className="flex flex-row bg-white p-1 proj-search items-center">
                    <MagnifyingGlassIcon color="rgba(0, 0, 0, 0.5)"/>
                    <input 
                    type="text"
                    placeholder="input search text"
                    value={filename2}
                    className="search-input ml-2"
                    onChange={(e) => handlesearch(e.target.value)}
                    />
                    <button
                    onClick={handleClear}
                    >
                      <Cross2Icon/>
                    </button>
                  </div>
                    <div className="std-cont">
                      <button className="new-pro" onClick={handlenew}>
                          <FilePlus/>
                          <span className="ml-2">
                              New Project
                          </span>
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
                    </div>
                    
                    <ol className="mt-4 ol">
                    { !failed && projects.map((option, index) => (
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
                              width:'50%',
                            }}
                            >
                              <FileText stroke="#71717a" />
                              {option.name.length > 10? `${option.name.substring(0, 10)}...` : option.name}<br/> 
                            </span>
                            <span className="project-buttons" 
                            style={{
                              width:'50%',
                              justifyContent:'end'
                              
                            }}
                            >
                              {/* <span className="ml-2 import-data">
                                {parse_date(option.recieveDate)}
                              </span>  */}
                              <button className='far fa-edit mr-4' onClick={()=>handlechange(option.name)}/>
                              <button className="fa fa-trash-o trash" onClick={()=>handledelete(option.name)}/ >
                            </span>
                          </span> {/* Render project as a button */}
                        </li>
                    ))}
                    </ol>
                </div>
        </div>
    );
  }

  export default Projects;