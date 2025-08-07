import { FC, useState, useEffect,useRef } from "react";
import {
  searchAndProcess,
  save,
  updateImport,
} from "@/app/api/search_utils/literature_utils";
import ImportPopup from "@/components/Search/importmodalfinished";

import Savemodal from "./savemodalfinished2";
import Notify from "../Management/notification";
import { Import,Sparkles,Loader,RefreshCcw, Save,FileCog,BookMarked} from "lucide-react";
import { useOnClickOutside } from 'usehooks-ts'
import LiteraturePopup from "../Search/literature_popup";
import ReferencePopup from "../Search/ReferencePopup";
import URLS from "@/app/config/urls";
import axios from "axios";

interface props {
  query: string;
  value: string;
  hasImported: boolean;
  projectName: string;
  setHasImport: (e: boolean) => void;
  isImport: (e: boolean) => void;
  importType: (e: string) => void;
  setOutput: (e: string) => void;
}

const LiteratureReview: FC<props> = ({
  query,
  value,
  setOutput,
  isImport,
  importType,
  // setHasImport,
  // projectName,
  // hasImported = false,
}) => {
  const [liter, setliter] = useState("");
  const [style, setStyle] = useState("apa");
  const [generating, setGenerateState] = useState<boolean>(false);
  const [saving, setSaveState] = useState<boolean>(false);
  const [content, setcontent] = useState<boolean>(false);
  const [outTriggr, setOutTrigger] = useState(false);
  const [statusText, setStatus] = useState(true);
  const [saveText, setSave] = useState("save");
  const [saveM, setSaveM] = useState<boolean>(false);
  const [customLR, setCustomLR] = useState<boolean>(false);


  const ref1=useRef<HTMLDivElement>(null);
  const ref2=useRef<HTMLDivElement>(null);


  const handleViewLiterature = () => {
    setCustomLR(true);
  };

  useOnClickOutside(ref1,() => setSaveM(false))
  useOnClickOutside(ref2,() => setShowPopup(false))


  // const [importM, setImportM] = useState<boolean>(false);

  const [saveName, setSaveName] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [isNotif, setIsNotif] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState("");
  const [quota, setquota] = useState(5);
  const [status, setstatus] = useState('');


  const [projectName, setProjectName] = useState("")
  const [hasImportLr, setHasImportLr] = useState<boolean>(false)
  const [popup, setShowPopup] = useState<boolean>(false);
  const [query2, getQuery] = useState(query);
  const [type, setType] = useState("lr");
  const [lrContent, setLrContent] = useState("");


  const [customRef, setCustomRef] = useState<boolean>(false);
  const [projectName2, setProjectName2] = useState("")
  const [hasImportRef, setHasImportRef] = useState<boolean>(false)
  const [reflst, setReflst] = useState("");
  const [popup2, setShowPopup2] = useState<boolean>(false);
  const handleViewRef = () => {
    setCustomRef(true);
  };
  useEffect(() => {
    const fetchLR = async ()=> {
      const resp = await axios.post(URLS.endpoints.status);
      //console.log(resp.data.statuss)
      //console.log(resp.data.quota)
      if (resp.data.statuss != 'unknown') {setstatus(resp.data.statuss)}
      if (resp.data.quota != 500) {setquota(resp.data.quota)}
    }
    fetchLR();
    },[status,setstatus,quota,setquota])


  // function setHasImport(value:boolean) {
  //   setHasImportLr(value);
  // }
  function setText(value: string) {
    setLrContent(value);
  }





  const handleGenerateButton = () => {
    setOutput("");
    setcontent(false);
    setGenerateState(true);
  };
  const handleSaveButton = () => {
    setliter(lrContent);
    setSaveState(true);
  };

  const handleUpdateButton = async () => {
    const resp = await updateImport(projectName, liter, "lr");
    if (resp.data.message ==='updated') {
    setIsNotif(true);
    setVerifyMessage(`${projectName} updated successfuly`)}
    else {  setIsNotif(true);
      setVerifyMessage(`error while updating ${projectName}`)}

   // console.log(resp);
  };
  function handleImportButton(t: string) {
    importType(t);
    isImport(true);
    setOutTrigger(true);
    setcontent(true);
    setShowPopup(true)
  }
  const handleSelectedStyle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStyle(e.target.value);
  };
  const handleEditorChange = (
    event: React.ChangeEvent<HTMLParagraphElement>
  ) => {
    console.log(`query:${query}`);
    const value = event.target.textContent || " ";
    setliter(value);
    if (outTriggr && content) {
      if (liter != "") {
        setliter(value);
      }
      setcontent(true);
    }
  };
  useEffect(() => {
    try {
      if (generating) {
        const fetchLR = async () => {
          if (status==='active' || quota!=0) {
          if (query.length === 0) {
            setLrContent("Please write a topic in Search bar of search tools!");
            setcontent(false);
          } else {
            const button: any = document.querySelector(".gener-lr");
            button.disabled = true;

            setStatus(false);
            setLrContent(
              `Writing a literature review about the topic ${query} ...`
            );
            setcontent(false);
            try {
              const response = await searchAndProcess(query, style);
              setLrContent(response.data);
              setliter(response.data);
              if (status != 'active') {
                const resp = await axios.post(URLS.endpoints.quota);
                if (resp.data.quota != 500)
                {setquota(resp.data.quota)}
              }
              setOutTrigger(true);
              setcontent(true);
            } catch (err) {
              setLrContent(
                "We're facing some traffic problems, please try again later"
              );
              setGenerateState(false);
              setcontent(false);
            }
            setHasImportLr(false);
            setStatus(true);
            button.disabled = false;
            //setcontent(false);
          }}
        else { setIsNotif(true)
          setVerifyMessage("Quota has reached maximum.Upgrade for more content")}}
        fetchLR();
      }
    } catch (error) {
      if (error instanceof Error) {
        setLrContent(error.message);
        setcontent(false);
      } else {
        setLrContent("An unknown error occurred");
        setcontent(false);
      }
    } finally {
      setGenerateState(false);
    }
  }, [generating, value, query, style, setLrContent, setHasImportLr,quota,setquota,status,setstatus]);
  useEffect(() => {
    try {
      if (saving) {
        const fetchSR = async () => {
          if (!content) {
            setIsNotif(true);
            setVerifyMessage(`please generate som work before saving`);
            setcontent(false);
          } else {
            const button: any = document.querySelector(".save-lr");
            button.disabled = true;
            setSave("saving...");
            //setOutput(`Writing a literature review about the topic ${query} ...`);
            try {
              //console.log(value);
             // console.log(style);
             // console.log(`lr to send:\n ${liter}`);
             // console.log(`query:${query}`);
              const response = await save(
                saveName,
                "lr",
                query,
                liter,
                style,
                "null"
              );
             // console.log(response.data);
              if (response.data.error) {
                setErrMsg(response.data.error);
                setIsNotif(true);
                setVerifyMessage(response.data.error);
              } else {
                setErrMsg("");
                setIsNotif(true);
                setVerifyMessage(`saved successfully as ${saveName}`);
              }
              //setOutput('');
            } catch (err) {
              setIsNotif(true);
              setVerifyMessage(`failed try again later`);
              setcontent(false);
              setSaveState(false);
            }
            setSave("Save");
            setSaveM(false);
            button.disabled = false;
          }
        };

        fetchSR();
      }
    } catch (error) {
      if (error instanceof Error) {
        setIsNotif(true);
        setVerifyMessage(error.message);
        setcontent(false);
      } else {
        setIsNotif(true);
        setVerifyMessage(`error occured`);
        setcontent(false);
      }
    } finally {
      setSaveState(false);
    }
  }, [saving, value, query, style, content, setOutput, liter, saveName]);
  return (
    <div 
    style={{
      height:'100%',
      width:'100%'
    }}
    >
      <h1 className="text-lg mb-1"
      style={{
        color:'rgb(23, 23, 23)',
      }}
      >Literature Review</h1>
      <div className="flex flex-col p-2"      
      style={{
        border:'1px solid #d9d9d9',
        borderRadius:'8px',
        width:'100%',
        backgroundColor:'white',
      }}>
        <section className="flex flex-row items-center h-fit w-fit ">
          {isNotif && <Notify message={verifyMessage} dur={30} display={setIsNotif} />}


            <select
              onChange={handleSelectedStyle}
              value={style}
              className="cite-lr "
            >
              <option value="" disabled>
                Citation Type
              </option>
              <option value="apa">APA</option>
              <option value="ieee">IEEE</option>
              <option value="mla">MLA</option>
              <option value="ama">AMA</option>
              <option value="asa">ASA</option>
              <option value="aaa">AAA</option>
              <option value="apsa">APSA</option>
              <option value="mhra">MHRA</option>
              <option value="oscola">OSCOLA</option>
            </select>
            <div className="flex flex-row gap-4 items-center h-fit w-full">
            {statusText?
          <button className="gener-lr" onClick={handleGenerateButton} title="Generate a literature">
            <Sparkles color="#52525b"/>
          </button>
          :
          <button disabled>
            <Loader color="#52525b"/>
          </button>
          }
        <div ref={ref1}>
          {hasImportLr ? (
            <button className="save-lr" onClick={handleUpdateButton} title="Update literature ">
              <RefreshCcw color="#52525b"/>
            </button>
          ) : (
            <button className="save-lr" onClick={() => setSaveM(true)} title="Save literature">
              <Save color="#52525b" />
            </button>
          )}
          {saveM && (
            <Savemodal  role="saveModal">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <p className="err-lr-save">{errMsg}</p>
                <input
                  name="name"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  required
                  placeholder="Enter filename"
                />
                <div className="controls">
                  <button onClick={handleSaveButton}>{saveText}</button>
                  <button onClick={() => setSaveM(false)}>Cancel</button>
                </div>
              </div>
            </Savemodal>
          )}
        </div>
        <div className="cont-imp"  ref={ref2}>
          <button onClick={() => handleImportButton("lr")} title="Import Literatures">
            <Import color="#52525b"/>
          </button>

          {popup && (
            <ImportPopup  setProjectName={setProjectName} hasImported={setHasImportLr} onExit={setShowPopup} onSetTitle={getQuery} type={type} onSend={setText} />
          )}
        </div>
        <button className="view-custom-lr-btn1" onClick={handleViewLiterature} title="Custom Literature">
          <FileCog color="#52525b"/>
        </button>
        <button className="view-custom-lr-btn" onClick={handleViewRef} title="Reference List">
          <BookMarked color="#52525b"/>
        </button>

      </div> 
        </section>
          {customLR && <LiteraturePopup onExit={setCustomLR} />}
          {customRef && (
            <ReferencePopup
            projectName={projectName}
            hasImported={hasImportRef}
            setHasImported={setHasImportRef}
              value={reflst}
              setOutput={setReflst}
              importType={setType}
              isImport={setShowPopup}
              onExit={setCustomRef}
            />
          )}
          <div
            className="output-lr"
            onInput={handleEditorChange}
            contentEditable="true"
            suppressContentEditableWarning
            style={{
              width:'100%',
              color:'rgb(23, 23, 23)',
            }}
          >
            {lrContent}
          </div>
      </div>
    </div>
  );
};

export default LiteratureReview;






// import { FC, useState, useEffect } from "react";
// import {
//   searchAndProcess,
//   save,
//   updateImport,
// } from "@/app/api/search_utils/literature_utils";
// import Savemodal from "./savemodal";
// import Notify from "../Management/notification";
// interface props {
//   query: string;
//   value: string;
//   hasImported: boolean;
//   projectName: string;
//   setHasImport: (e: boolean) => void;
//   isImport: (e: boolean) => void;
//   importType: (e: string) => void;
//   setOutput: (e: string) => void;
// }

// const LiteratureReview: FC<props> = ({
//   query,
//   value,
//   setOutput,
//   isImport,
//   importType,
//   setHasImport,
//   projectName,
//   hasImported = false,
// }) => {
//   const [liter, setliter] = useState("");
//   const [style, setStyle] = useState("apa");
//   const [generating, setGenerateState] = useState<boolean>(false);
//   const [saving, setSaveState] = useState<boolean>(false);
//   const [content, setcontent] = useState<boolean>(false);
//   const [outTriggr, setOutTrigger] = useState(false);
//   const [statusText, setStatus] = useState("Generate");
//   const [saveText, setSave] = useState("save");
//   const [saveM, setSaveM] = useState<boolean>(false);
//   const [saveName, setSaveName] = useState("");
//   const [errMsg, setErrMsg] = useState("");
//   const [isNotif, setIsNotif] = useState(false);
//   const [verifyMessage, setVerifyMessage] = useState("");
//   const handleGenerateButton = () => {
//     setOutput("");
//     setcontent(false);
//     setGenerateState(true);
//   };
//   const handleSaveButton = () => {
//     setliter(value);
//     setSaveState(true);
//   };

//   const handleUpdateButton = async () => {
//     const resp = await updateImport(projectName, liter, "lr");
//     if (resp.data.message ==='updated') {
//     setIsNotif(true);
//     setVerifyMessage(`${projectName} updated successfuly`)}
//     else {  setIsNotif(true);
//       setVerifyMessage(`error while updating ${projectName}`)}

//     console.log(resp);
//   };
//   function handleImportButton(t: string) {
//     importType(t);
//     isImport(true);
//     setOutTrigger(true);
//     setcontent(true);
//   }
//   const handleSelectedStyle = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setStyle(e.target.value);
//   };
//   const handleEditorChange = (
//     event: React.ChangeEvent<HTMLParagraphElement>
//   ) => {
//     console.log(`query:${query}`);
//     const value = event.target.textContent || " ";
//     setliter(value);
//     if (outTriggr && content) {
//       if (liter != "") {
//         setliter(value);
//       }
//       setcontent(true);
//     }
//   };
//   useEffect(() => {
//     try {
//       if (generating) {
//         const fetchLR = async () => {
//           if (query.length === 0) {
//             setOutput("Please write a topic in Search bar of search tools!");
//             setcontent(false);
//           } else {
//             const button: any = document.querySelector(".gener-lr");
//             button.disabled = true;

//             setStatus("Generating...");
//             setOutput(
//               `Writing a literature review about the topic ${query} ...`
//             );
//             setcontent(false);
//             try {
//               const response = await searchAndProcess(query, style);
//               setOutput(response.data);
//               setliter(response.data);
//               setOutTrigger(true);
//               setcontent(true);
//             } catch (err) {
//               setOutput(
//                 "We're facing some traffic problems, please try again later"
//               );
//               setGenerateState(false);
//               setcontent(false);
//             }
//             setHasImport(false);
//             setStatus("Generate");
//             button.disabled = false;
//             //setcontent(false);
//           }
//         };

//         fetchLR();
//       }
//     } catch (error) {
//       if (error instanceof Error) {
//         setOutput(error.message);
//         setcontent(false);
//       } else {
//         setOutput("An unknown error occurred");
//         setcontent(false);
//       }
//     } finally {
//       setGenerateState(false);
//     }
//   }, [generating, value, query, style, setOutput, setHasImport]);
//   useEffect(() => {
//     try {
//       if (saving) {
//         const fetchSR = async () => {
//           if (!content) {
//             setIsNotif(true);
//             setVerifyMessage(`please generate som work before saving`);
//             setcontent(false);
//           } else {
//             const button: any = document.querySelector(".save-lr");
//             button.disabled = true;
//             setSave("saving...");
//             //setOutput(`Writing a literature review about the topic ${query} ...`);
//             try {
//               //console.log(value);
//               console.log(style);
//               console.log(`lr to send:\n ${liter}`);
//               console.log(`query:${query}`);
//               const response = await save(
//                 saveName,
//                 "lr",
//                 query,
//                 liter,
//                 style,
//                 "null"
//               );
//               console.log(response.data);
//               if (response.data.error) {
//                 setErrMsg(response.data.error);
//                 setIsNotif(true);
//                 setVerifyMessage(response.data.error);
//               } else {
//                 setErrMsg("");
//                 setIsNotif(true);
//                 setVerifyMessage(`saved successfully as ${saveName}`);
//               }
//               //setOutput('');
//             } catch (err) {
//               setIsNotif(true);
//               setVerifyMessage(`failed try again later`);
//               setcontent(false);
//               setSaveState(false);
//             }
//             setSave("Save");
//             setSaveM(false);
//             button.disabled = false;
//           }
//         };

//         fetchSR();
//       }
//     } catch (error) {
//       if (error instanceof Error) {
//         setIsNotif(true);
//         setVerifyMessage(error.message);
//         setcontent(false);
//       } else {
//         setIsNotif(true);
//         setVerifyMessage(`error occured`);
//         setcontent(false);
//       }
//     } finally {
//       setSaveState(false);
//     }
//   }, [saving, value, query, style, content, setOutput, liter, saveName]);
//   return (
//     <>
//       <h1>Literature Review</h1>
//       {isNotif && <Notify message={verifyMessage} dur={30} display={setIsNotif} />}
//       {saveM && (
//         <Savemodal onClose={() => setSaveM(false)}>
//           <p className="err-lr-save">{errMsg}</p>
//           <label htmlFor="name">Save as:</label>
//           <input
//             name="name"
//             value={saveName}
//             onChange={(e) => setSaveName(e.target.value)}
//             required
//           />
//           <button className="save-lr" onClick={handleSaveButton}>
//             {saveText}
//           </button>
//         </Savemodal>
//       )}
//       <section>
//         <select
//           onChange={handleSelectedStyle}
//           value={style}
//           className="cite-lr"
//         >
//           <option value="" disabled>
//             Citation Type
//           </option>
//           <option value="apa">APA</option>
//           <option value="ieee">IEEE</option>
//           <option value="mla">MLA</option>
//           <option value="ama">AMA</option>
//           <option value="asa">ASA</option>
//           <option value="aaa">AAA</option>
//           <option value="apsa">APSA</option>
//           <option value="mhra">MHRA</option>
//           <option value="oscola">OSCOLA</option>
//         </select>
//         <button className="gener-lr" onClick={handleGenerateButton}>
//           {statusText}
//         </button>
//         {hasImported ? (
//           <button className="save-lr" onClick={handleUpdateButton}>
//             update
//           </button>
//         ) : (
//           <button className="save-lr" onClick={() => setSaveM(true)}>
//             Save as
//           </button>
//         )}

//         <button onClick={() => handleImportButton("lr")}>Import</button>
//       </section>
//       <div
//         className="output-lr"
//         onInput={handleEditorChange}
//         contentEditable="true"
//         suppressContentEditableWarning
//       >
//         {value}
//       </div>
//     </>
//   );
// };

// export default LiteratureReview;
