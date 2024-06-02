"use client";
import { FC, useState } from "react";
import SearchButton from "@/components/Search/SearchButton";
import SearchDataFetch from "@/components/Search/SearchDataFetch";
import SearchBar from "@/components/Search/SearchBar";
import PlagiarismChecker from "@/components/Search/PlagiarismChecker";
import Container from "@/components/Search/Container";
import LiteratureReview from "@/components/Search/literature_review";
import LiteraturePopup from "@/components/Search/literature_popup";
import ReferencePopup from "@/components/Search/ReferencePopup";
import Article from "@/components/Search/article";
import ImportPopup from "@/components/Search/import_popup";


const App: FC = () => {
  const [_searchRes, setSearchRes] = useState<unknown>(null);
  const [customLR, setCustomLR] = useState<boolean>(false);
  const [customRef, setCustomRef] = useState<boolean>(false);
  const [query, getQuery] = useState("");
  const [Searching, setSearchState] = useState<boolean>(false);
  const [engine, setEngine] = useState("semantic");
  const [popup, setShowPopup] = useState<boolean>(false);
  const [hasImportLr, setHasImportLr] = useState<boolean>(false)
  const [hasImportArt, setHasImportArt] = useState<boolean>(false)
  const [hasImportOut, setHasImportOut] = useState<boolean>(false)
  const [hasImportRef, setHasImportRef] = useState<boolean>(false)
  const [lrContent, setLrContent] = useState("");
  const [artContent, setArtContent] = useState("");
  const [reflst, setReflst] = useState("");
  const [projectName, setProjectName] = useState("")

  const [type, setType] = useState("lr");

  // This function get the query from the search bar
  const handleSearchInputChange = (e: any) => {
    getQuery(e.target.value);
    setSearchState(false);
  };
  const clear = (e: any) => {
    getQuery('');
    setSearchState(false);
  };
  // This function set the Research results output
  const handleSearchButtonClick = (e: any) => {
    setEngine(e.target.value);
    getQuery(query);
    setSearchState(true);
  };
  const handleViewLiterature = () => {
    setCustomLR(true);
  };
  const handleViewRef = () => {
    setCustomRef(true);
  };
  function setText(value: string) {
    switch (type) {
      case "lr":
        setLrContent(value);
        break;
      case "art":
        setArtContent(value);
        break;
      case "out":
        setArtContent(value);
        break;
      case "ref":
        setReflst(value);
        break;
    }
  }
  function setHasImport(value:boolean) {
    switch (type) {
      case "lr":
        setHasImportLr(value);
        break;
      case "art":
        setHasImportArt(value);
        break;
      case "out":
        setHasImportOut(value);
        break;
      case "ref":
        setHasImportRef(value);
        break;
    }
  }
  return (
    <main className="search-main">
      {/* {popup && (
          <ImportPopup setProjectName={setProjectName} hasImported={setHasImport} onExit={setShowPopup} onSetTitle={getQuery} type={type} onSend={setText} />
      )} */}
      <SearchBar value={query} onChange={handleSearchInputChange} handleClear={clear} />
    <div className='flex flex-col '>
      <div className='flex flex-row justify-center content-center items-center '>
        <Container>
          <div className="flex flex-col p-2 items-center"      
          style={{
            border:'1px solid black',
            borderRadius:'8px',
            height:'100%',
            width:'100%',
          }}>
            <div className="flex felx-row items-center justify-between content-between h-12 w-full">
              <h1>Search tools</h1>
              <div className="search-buttons">
                <SearchButton label="arxiv" onClick={handleSearchButtonClick} />
                <SearchButton label="archive" onClick={handleSearchButtonClick} />
                <SearchButton label="semantic" onClick={handleSearchButtonClick} />
              </div>
            </div>
            <SearchDataFetch
              searchEngine={engine}
              isSearching={Searching}
              query={query}
              onFetch={setSearchRes}
            />
          </div>
          
        </Container>

        <Container>
          <LiteratureReview
            projectName={projectName}
            setHasImport={setHasImport}
            value={lrContent}
            query={query}
            importType={setType}
            setOutput={setLrContent}
            isImport={setShowPopup}
            hasImported = {hasImportLr}
          />
        </Container>
      </div>
      <div className='flex flex-row justify-center content-center items-center'>
        <Container>
          <Article
            hasImportedArt={hasImportArt}
            hasImportedOut={hasImportOut}
            projectName={projectName}
            setHasImport={setHasImport}
            value={artContent}
            query={query}
            importType={setType}
            setOutput={setArtContent}
            isImport={setShowPopup}
          />
        </Container>
        <Container>
          <PlagiarismChecker />
          <button className="view-custom-lr-btn" onClick={handleViewLiterature}>
            Create Custom Literature Review
          </button>
          <button className="view-custom-lr-btn" onClick={handleViewRef}>
            Create Custom references list
          </button>
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
        </Container>
      </div>
    </div>
     
    </main>
  );
};

export default App;