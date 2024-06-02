import { FC, useState, useEffect } from "react";
import { Import } from "@/app/api/search_utils/literature_utils";

interface props {
  onExit: (e: boolean) => void;
  onSend: (e: string) => void;
  onSetTitle: (e: string) => void;
  setProjectName: (e: string) => void;
  hasImported: (e: boolean) => void;
  type: string;
}

const ImportPopup: FC<props> = ({
  onExit,
  onSend,
  onSetTitle,
  hasImported,
  setProjectName,
  type,
}) => {
  const [collectedItems, setCollectedItems] = useState<any>([]);
  function handleExitBtn(e: any) {
    onExit(false);
  }
  useEffect(() => {
    const Fetch = async () => {
      const resp = await Import(type);
      console.log(resp.data.imports);
      setCollectedItems(resp.data.imports);
    };
    Fetch();
  }, [type]);
  function handleSelect(project: string) {
    const selected: any = collectedItems.filter(
      (item: any) => item.project === project
    );
    onSetTitle(selected[0].title);
    onSend(selected[0].content);
    setProjectName(selected[0].project);
    hasImported(true);
    onExit(false);
  }
  function handleSelectRef(project: string) {
    const selected: any = collectedItems.filter(
      (item: any) => item.project === project
    );
    onSend(selected[0].list);
    hasImported(true);
    setProjectName(selected[0].project);
    onExit(false);
  }
  return (
    <div id="modal3" className=" importModal ">
        <h1>Saved works</h1>
        <div className="items"
        style={{
          marginTop:'8px',
          marginBottom:'8px',
          height:'10rem'
        }}
        >
          {collectedItems.map((e: any, i: number) => (
                <button 
                className="items-list"
                onClick={() => handleSelect(e.project)} 
                key={i}
                style={{
                  border:'1px solid rgba(0,0,0,0)',
                  marginTop:'2px',
                  marginBottom:'2px',
                  
                }}
                >
                    <span className="import-data">{e.project}</span>{" "}
                </button>
          ))}
        </div>
        <div className="controls">
            <button onClick={handleExitBtn}>
                Cancel
            </button>
        </div>

    </div>
  );
};

export default ImportPopup;
