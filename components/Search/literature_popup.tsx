import { FC, useState,useEffect } from "react";
import { literature,save, save_cite, updateImport} from "@/app/api/search_utils/literature_utils";
import { validateAuthors } from "@/app/lib/formVaild";
import { cfg } from "@/app/config/config";
import Notify from "../Management/notification";
import Savemodal from "./savemodelfinished";
import { parse_author_name } from "@/app/api/search_utils/dep";
import URLS from "@/app/config/urls";
import axios from "axios";
interface props {
  onExit: (e: boolean) => void;
}
type Item = {
  title: string;
  authors: string | string[];
  published: string;
  pdf_url: string;
  abstract: string;
};
const LiteraturePopup: FC<props> = ({onExit}) => {
  // hooks
  const [statusText, setStatus] = useState("Generate");
  const [lrOutput, setLrOutput] = useState("");
  const [errorMessage, setMessage] = useState("");
  const [errorMessageAuthor, setMessageAuthor] = useState("");
  const [saving, setSaveState] = useState<boolean>(false);
  const [content, setcontent] = useState<boolean>(false);
  const [outTriggr, setOutTrigger] = useState(false);
  const [liter, setliter] = useState("Literture");
  const [saveText, setSave] = useState("save work");
  const [isNotif, setIsNotif] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState("");
  const [saveM, setSaveM] = useState<boolean>(false);
  const [saveName, setSaveName] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [quota, setquota] = useState(50);
  const [status, setstatus] = useState('');
  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    pdf_url: "",
    published: "",
    abstract: "",
  });
  const [output,setOutput] = useState<boolean>(false)
  const [subject, setSubject] = useState("");
  const [style, setStyle] = useState("apa");
  const [collectedItems, setCollectedItems] = useState<Item[]>([]);
  // Value Handlers
  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value);
  };

  const handleSelectedStyle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStyle(e.target.value);
  };
  const handleDataChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleExit = () => {
    onExit(false);
  };
  const handleSave = async () => {
    const { title, authors, published, pdf_url, abstract } = formData;
    if (
      title.trim().length !== 0 &&
      authors.length !== 0 && // Check if authors array is not empty
      pdf_url.trim().length !== 0 &&
      published.trim().length !== 0 &&
      abstract.trim().length !== 0
    ) {
      const authors2 = authors.includes(",")
      ? authors.split(",").map((author) => author.trim())
      : [authors.trim()]
      console.log(parse_author_name(authors2));
      let author2 = parse_author_name(authors2)?.trim()
      if (!author2) {author2 = 'null'}
      const cite = await save_cite(author2,title,published,pdf_url,style)
      const newData = {
        title: title,
        authors: authors2,
        published: published,
        pdf_url: pdf_url,
        abstract: abstract,
      };
      if (!validateAuthors(authors)) {
        setMessageAuthor("Invalid Author Names");
      } else {
        if (collectedItems.length >= cfg.lr_limit) {
          setMessage(
            `Sorry but currently you can only enter ${cfg.lr_limit} research for each generating attempt.`
          );
        } else {
          setCollectedItems((prevData) => [...prevData, newData]);
          setMessageAuthor("");
          // Clear the input values
          setFormData({
            title: "",
            authors: "",
            pdf_url: "",
            published: "",
            abstract: "",
          });

          //setSubject("");
        }
      }
    } else {
      setMessage(
        "Please fill all feilds with required information to save it."
      );
    }
  };

  const handleSendData = async () => {
    try {
      if (status==='active' || quota!=0) {
      const data = collectedItems.filter(
        (ref) =>
          ref.title.trim().length !== 0 ||
          ref.authors.length !== 0 || // Check if authors array is not empty
          ref.pdf_url.trim().length !== 0 ||
          ref.published.trim().length !== 0 ||
          ref.abstract.trim().length !== 0
      );
      // Create a new list of references with authors as arrays
      /*
      const data = nonEmpty.map((ref) => ({
        ...ref,
        authors: ref.authors.includes(",")
          ? ref.authors.split(",").map((author) => author.trim())
          : [ref.authors.trim()],
      }));*/
      if (data.length === 0) {
        setMessage(
          "Please enter and save some researches to generate a full literature review."
        );
      } else {
        setOutput(true)
        setStatus("Generating...");
        setMessage("");
        const button: any = document.querySelector(".gener-btn");
        button.disabled = true;
        setLrOutput(
          "Generating a literature review from saved researches data..."
        );
        //setcontent(false);
        try {
          const response = await literature(data, style, subject);
          setLrOutput(response.data);
          setliter(response.data);
          if (status != 'active') {
            const resp = await axios.post(URLS.endpoints.quota);
            if (resp.data.quota != 500)
            {setquota(resp.data.quota)}
          }
          setcontent(true);
          setOutTrigger(true);
        } catch (err) {
        setIsNotif(true)
        setVerifyMessage("We're facing some traffic problems, please try again later")
        }
        //setcontent(false)
        setStatus("Generate");
        button.disabled = false;
        setCollectedItems([]);
      }} else { setIsNotif(true)
        setVerifyMessage("Quota has reached maximum.Upgrade for more content")}
    } catch (error) {
      setOutput(false)
      console.error("Error sending data to API:", error);
      setIsNotif(true)
      setVerifyMessage("error occured,please try again later")
    }
  };
  useEffect(() => {
    try {
      console.log(content);
      if (saving) {
        const fetchSR = async () => {
          if (!content) {
            setLrOutput("Please generate some work before saving");
            setcontent(false);
          } else {
            const button:any = document.querySelector(".save-lr")
            button.disabled = true
            setSave("saving...");
            //setLrOutput(`Writing a literature review about the topic ${query} ...`);
            try{
              //console.log(lrOutput);
              console.log(style);
              console.log(liter);
              console.log(subject);
              const response = await save(saveName,'lr',subject,liter,style,'null');
              console.log(response.data);
              if (response.data.error) {
                setIsNotif(true);
                setVerifyMessage(response.data.error);
              } else {
                setSaveM(false)
                setIsNotif(true);
                setVerifyMessage(`saved successfully as ${saveName}`);
              }
              //setSaveState(false)
              //setLrOutput('');
              } catch(err){
                setIsNotif(true)
                setVerifyMessage('we are facing som troubles.try again later')
                setcontent(false)
                setSaveState(false)
              }
            setSave("save work")
            button.disabled = false
          }
        };

        fetchSR();
      }
    } catch (error) {
      if (error instanceof Error) {
        setIsNotif(true)
        setVerifyMessage('try again later')
        setcontent(false)
      } else {
        setIsNotif(true)
        setVerifyMessage('try again later')
        setcontent(false)
      }
    } finally {
      setSaveState(false);
      setSaveM(false);
    }
  }, [saving,content,liter,saveName, lrOutput, subject, style]);
  const handleEditorChange = (
    event: React.ChangeEvent<HTMLParagraphElement>
  ) => {
    const value = event.target.textContent || "";
    if (outTriggr && content) {
      if (liter != "")
         { setliter(value);}
      setcontent(true);
    }
  };
  const handleSaveButton = () => {
    setSaveState(true);
  };
  return (
    <section className="custom-lr">
      <div className=''
      style={{
        backgroundColor:'#ffffff',
        height:'5%',
        width:'100%',
        top:'0px',
        position:'absolute',
        fontSize:'18px',
        color:'rgb(23, 23, 23)',
        textAlign:'center',
        alignItems:'center',
        display:'flex',
        border:'1px solid rgba(0, 0, 0, 0)',
        // borderRadius:'16px 0 0 0px',
      }}
      >
        <span 
        style={{
          marginLeft:'24px',
          // marginTop:'20px',
        }}
        >
          {'>>'} &nbsp; &nbsp; Custom Literature Review
        </span>
      </div>
      {/* will be added again later  */}
      {/* <section className="custom-lr-data">
      {isNotif && (
        <Notify message={verifyMessage} dur={30} display={setIsNotif} />
      )}
          <p className="error-msg-popup">{errorMessage}</p>

        <h1>Saved Data</h1>
        
        <ul className="output-lr">
          <p className="error-msg-popup">{errorMessage}</p>
          {collectedItems.map((_data, i) => (
            <li key={i}>Saved Data item: {i + 1}</li>
          ))}
        </ul>
      </section> */}
      {
        output?
        <section className="custom-lr-data1  h-full mt-16">
           {isNotif && (
            <Notify message={verifyMessage} dur={10} display={setIsNotif} />
          )}
        <div
        className="lroutput mr-2 ml-2 rounded-lg mb-5 px-3 py-2 text-black output-lr2"
        style={{
          backgroundColor:'#f9fafb',
          border:'1px solid rgba(0,0,0,0.1)'

        }}
        onInput={handleEditorChange}
        contentEditable="true"
        suppressContentEditableWarning
      >
        {lrOutput}
      </div>


        <div className="flex flex-row items-end justify-end">
        <div className="std-cont flex flex-row">
          <button id="btn" className="save-lr" onClick={() => setSaveM(true)}
          style={{
            height:'40px',
            width:'75px',
            // borderRadius:'1rem',
          }}
          >
            Save
          </button>
          {saveM && (
            <Savemodal  role="saveModal saveModalmod">
              <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    marginTop:"20px",
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
                    <button id="btn" className=" save-btn" onClick={handleSaveButton}>
                      {saveText}
                    </button>
                    <button onClick={() => setSaveM(false)}>Cancel</button>
                  </div>

                </div>
              </Savemodal>
          )}
        </div>
        <button id="btn" className="exit-lr-btn" onClick={handleExit}
            style={{
              height:'40px',
              width:'75px',
              // borderRadius:'1rem',

            }}
            >
              Cancel
          </button>
        </div>
      </section>
        :
        <section className="custom-lr-data" >
          {isNotif && (
            <Notify message={verifyMessage} dur={10} display={setIsNotif} />
          )}
          <p className="error-msg-popup">{errorMessage}</p>

          {/* <h1>Saved Data</h1>
          <ul className="output-lr">
            <p className="error-msg-popup">{errorMessage}</p>
            {collectedItems.map((_data, i) => (
              <li key={i}>Saved Data item: {i + 1}</li>
            ))}
          </ul> */}
          <div 
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          >
            <label htmlFor="Citation Type" 
            className="citation"
            style={{
              width:'fit-content',
              marginBottom:'0px',
            }}
            >
              Citation Type
            </label>
            <select
            onChange={handleSelectedStyle}
            value={style}
            className="cite-lr"
            >
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
          </div>
        <label htmlFor="subject">Subject</label>
        <input
          name="subject"
          value={subject}
          onChange={handleSubjectChange}
          placeholder="Science"
        />
        <label htmlFor="title">Title</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleDataChange}
          placeholder="Fourier Conversion"
        />
        <label htmlFor="authors">
          Authors <span className="error-msg-popup">{errorMessageAuthor}</span>
        </label>
        <input
          name="authors"
          value={formData.authors}
          onChange={handleDataChange}
          placeholder="John Doe, Frank Tom"
        />
        <label htmlFor="published">Publish Year</label>
        <input
          name="published"
          value={formData.published}
          onChange={handleDataChange}
          placeholder="2011"
          type="number"
          min="1905"
          max="2100"
        />
        <label htmlFor="pdf_url">PDF url</label>
        <input
          name="pdf_url"
          value={formData.pdf_url}
          onChange={handleDataChange}
          placeholder="http://website.com/file.pdf"
        />
        <label htmlFor="abstract">Abstract</label>
        <textarea
          className="abstract-lr"
          name="abstract"
          value={formData.abstract}
          onChange={handleDataChange}
          placeholder="Abstract"
        ></textarea>
        
        
        <section className="flex flex-row items-center justify-center">
          <button id="btn" onClick={handleSave}
          style={{
            height:'40px',
            width:'75px',
          }}
          >
            Save
          </button>
          <button id="btn" className="gener-btn" onClick={handleSendData}
          style={{
            height:'40px',
            width:'75px',
          }}
          >
            Generate
          </button>
          <button id="btn" className="exit-lr-btn" onClick={handleExit}
            style={{
              height:'40px',
              width:'75px',
            }}
            >
              Cancel
          </button>
        </section>

      </section>
      }
    </section>
  );
};

export default LiteraturePopup;
