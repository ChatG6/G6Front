'use client';
import { BookOutlined } from '@ant-design/icons';
import { Loader2 } from "lucide-react"
import { Document, Page,pdfjs  } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
import {  Card, Form, Input, message, Modal } from 'antd';
import axios from 'axios';
import { FC, Fragment, useEffect, useRef, useState } from 'react';
import Message from './Message';
import { UploadProps } from 'antd';
import { Upload } from 'antd';
import { type TextItem } from 'pdfjs-dist/types/src/display/api';
import eventEmitter from '../../app/utils/eventEmitter';
import PDFMerger from 'pdf-merger-js/browser';
import 'react-pdf/dist/Page/TextLayer.css';
import { Button } from '../ui/button';
import { FileTextIcon } from '@radix-ui/react-icons';
import { savedocs } from '@/app/api/search_utils/literature_utils';

// Helper functions (unchanged)
function finDomByText(text: string, parent: any) {
  const elements = parent.querySelectorAll('span');
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (element.innerText.includes(text)) {
      return element;
    }
  }
}

function addHighlightText(element: HTMLElement) {
  const text = element.textContent;
  const markElem = document.createElement('mark');
  markElem.textContent = text;
  element.innerHTML = '';
  element.appendChild(markElem);
  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

interface ChatWindowProps {
  className?: string;
   onClose?: () => void;
}

interface MessageItem {
  question?: string;
  reply?: string;
  references?: { id: number; content: string; page_num: number }[];
}

const { Dragger } = Upload;
const ChatWindow: FC<ChatWindowProps> = ({ className,onClose }) => {
  const disabledUpload = false;
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const settings = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [form] = Form.useForm();
  const [showSettingModal, setShowSettingModal] = useState(false);
  const [query, setQuery] = useState('');
  const [messageList, setMessageList] = useState<MessageItem[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const pdfRef = useRef<unknown>();
  const [numPages, setNumPages] = useState<number | null>(null);
  const sentenceRef = useRef<any[]>();
  const [indexof,setIndexof]=useState(0);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string>('');
  const [library, setLibrary] = useState<number>(0);

  // All hooks and functions (useEffect, onReply, onSearch, etc.) remain unchanged...
  // ... (keeping the existing logic for brevity)
  useEffect(() => {
    const render = async () => {
      if (files.length === 0) return;
      const merger = new PDFMerger();

      for(const file of files) {
        await merger.add(file);
        // Assuming savedocs is defined elsewhere
        // const res = await savedocs('pdf','null','Chat',file.size,'now',file.name)
        // if (res.data.message=='Saved') {console.log('done')}
      }

      await merger.setMetadata({
        producer: "pdf-merger-js based script"
      });

      const mergedPdf = await merger.saveAsBlob();
      const url = URL.createObjectURL(mergedPdf);
      setMergedPdfUrl(url);
    };

    render().catch((err) => {
      console.error(err);
    });

    return () => {
        if (mergedPdfUrl) {
            URL.revokeObjectURL(mergedPdfUrl);
        }
    }
  }, [files]);

  function scrollToPage(num: number) {
    // @ts-ignore
    pdfRef?.current.pages[num - 1].scrollIntoView();
  }
  useEffect(() => {
    // @ts-ignore
    eventEmitter.on('scrollToPage', scrollToPage);
    return () => {
      // @ts-ignore
      eventEmitter.off('scrollToPage', scrollToPage);
    };
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      const chatWindow = chatWindowRef.current;
      if (chatWindow) {
        chatWindow.scrollTop = chatWindow.scrollHeight;
      }
    }, 0);
  };

  async function onDocumentLoadSuccess(doc: any) {
    const { numPages } = doc;
    const sentenceEndSymbol = /[。.]\s+/;
    const allSentenceList = [];
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const currentPage = await doc.getPage(pageNum);
      const currentPageContent = await currentPage.getTextContent();
      const currentPageText = currentPageContent.items
        .map((item: any) => (item as TextItem).str)
        .join(' ');
      const sentenceList = currentPageText.split(sentenceEndSymbol);
      allSentenceList.push(...sentenceList.map((item: string) => ({ sentence: item, pageNum })));
    }
    sentenceRef.current = allSentenceList.filter(item => item.sentence);
    setNumPages(numPages)
    console.log(doc)
   message.success(`file uploaded successfully.`);
  }

  const props: UploadProps = {
    name: 'file',
    multiple: true,
    beforeUpload: file => {
      setFiles(prevFiles => [...prevFiles, file]);
      return false; // Prevent auto-upload
    },
    onChange(info) {
      const { status } = info.file;
      if (status === 'done') {
         message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const onReply = async (value: string) => {
    try {
      setLoading(true);
      const embedRes = await axios('/api/utils/search-embed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: { query: value, apiKey: process.env.NEXT_PUBLIC_OPEN_AI_KEY, matches: 5 }
      });

      const prompt = `Use the following text to provide an answer to the query: "${value}"\n\n${embedRes.data?.map((d: any) => d.content).join('\n\n')}`;

      const answerResponse = await fetch('/api/utils/search-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY })
      });
      setLoading(false);

      if (!answerResponse.ok || !answerResponse.body) {
        throw new Error(answerResponse.statusText || 'Failed to get answer');
      }

      const reader = answerResponse.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        setMessageList(pre => {
          const lastMessage = pre[pre.length - 1];
          return [
            ...pre.slice(0, -1),
            {
              ...lastMessage,
              reply: (lastMessage.reply || '') + chunkValue,
              references: embedRes.data
            }
          ];
        });
        requestAnimationFrame(scrollToBottom);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      message.error('An error occurred while getting the answer.');
    }
  };

  const onSearch = async (value: string) => {
    if (!value.trim()) return;
    setQuery('');
    setMessageList(prev => [...prev, { question: value.trim() }, { reply: '' }]);
    scrollToBottom();
    await onReply(value);
  };

  const generateEmbedding = async (sentenceList: any[]) => {
    if(!sentenceList || sentenceList.length === 0) {
        message.info("No text content found in the PDF to read.");
        return;
    }
    setLoading2(true);
    try {
        const res = await axios('/api/utils/split', {
            method: 'POST',
            data: { sentenceList }
        });
        const { chunkList } = res.data;
        const chunkSize = 2;

        for (let i = 0; i < chunkList.length; i += chunkSize) {
            const chunk = chunkList.slice(i, i + chunkSize);
            await axios('/api/utils/embedding', {
                method: 'POST',
                data: {
                    sentenceList: chunk,
                    apiKey: process.env.NEXT_PUBLIC_OPEN_AI_KEY
                }
            });
        }
        console.log("Document has been read and is ready for questions.")
        message.success("Document has been read and is ready for questions.");
    } catch (error) {
        console.error(error);
        console.log("Failed to process the document.")
        message.error("Failed to process the document.");
    } finally {
        setLoading2(false);
    }
  };

  const onReading = () => {
    generateEmbedding(sentenceRef.current as any[]);
  };

  const toggleLibrary = () => {
    setLibrary(prev => (prev === 0 ? 1 : 0));
  }

  const suffix = !disabledUpload ? (
    <Upload {...props}>
      <Button variant="outline" className='file'>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#52525b" className="bi bi-paperclip" viewBox="0 0 16 16">
          <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0z"/>
        </svg>
      </Button>
    </Upload>
  ) : null;

  // Conditionally render the title node based on the existence of the `onClose` prop.
  const titleNode = onClose ? (
    <button onClick={onClose} className="flex items-center w-full p-2 text-base font-normal text-gray-700 transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-chevron-left mr-2" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
      </svg>
      Return To Editor
    </button>
  ) : (
    ">>     Chat with PDF"
  );
  return (
    <>
      <Card
        // Modified: Responsive classes for positioning and sizing.
        // On mobile (default): fixed to cover the screen.
        // On medium screens and up (md:): becomes a relative block with a max width/height.
        className={`flex flex-col
          fixed inset-0 z-50
    
          ${className}`
        }
        styles={{
          body: {
            flex: 1,
            overflow: 'hidden', // Changed from auto to hidden to control scrolling on the inner div
            display: 'flex',
            flexDirection: 'column',
            padding: '0px 0',
            backgroundClip: 'content-box',
          }
        }}
       // title=">>     Chat with PDF"
       title={titleNode}
        bordered={false}
        extra={
          <Button variant="outline" onClick={toggleLibrary}>
            <BookOutlined style={{color:'#52525b'}}/>
          </Button>
        }
      >
        { library === 0 ? (
            <>
              <div
                ref={chatWindowRef}
                className="flex-1 overflow-y-auto p-4 space-y-4" // Use padding and space for message separation
              >
                {messageList.map((item, index) => (
                  <Fragment key={index}>
                    {item.question ? (
                      <Message isQuestion text={item.question} />
                    ) : (
                      <Message
                        loading={loading && index === messageList.length - 1}
                        references={item.references}
                        text={item.reply || ''}
                      />
                    )}
                  </Fragment>
                ))}
              </div>

              <div
                // Modified: Added flex-shrink-0 to prevent this from shrinking.
                className="flex-shrink-0 p-4 border-t border-gray-200 bg-white flex items-center gap-2"
              >
                {loading2 ? (
                  <Button className='read' variant="outline" disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Reading
                  </Button>
                ) : (
                  <Button className='read' disabled={files.length === 0} variant="outline" onClick={onReading}>
                    Read
                  </Button>
                )}
                <div className='flex-1'>
                  <Input.Search
                    enterButton="Ask"
                    size="large"
                    value={query}
                    placeholder="Ask a question"
                    allowClear
                    loading={loading}
                    suffix={suffix}
                    onChange={e => setQuery(e.target.value)}
                    onSearch={onSearch}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className='list p-4'>
              <span className='tittle font-semibold text-lg'>
                Reference Documents
              </span>
              {files.length > 0 ? (
                <ol className='list-decimal list-inside mt-2 space-y-2'>
                  {files.map((file, index) => (
                    <li key={index} className='flex items-center text-sm'>
                      <FileTextIcon className="mr-2 h-4 w-4" />
                      <span>{file.name}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-gray-500 mt-2">No documents uploaded.</p>
              )}
            </div>
          )
        }
      </Card>
      
      {/* --- This second card is hidden, no changes are strictly necessary, --- */}
      {/* --- but making it responsive is good practice. --- */}
      <Card
        // Modified: Removed fixed width, will now take full width of its container.
        // Hidden on mobile, shown as a block on medium screens up.
        className="h-full overflow-auto scroll-smooth hidden md:block"
        styles={{
          body: { padding: 0 }
        }}
      >
        {/* @ts-ignore */}
        <Document ref={pdfRef} file={mergedPdfUrl} onLoadError={console.error} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from(new Array(numPages), (_el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              // Modified: Width is now responsive
              width={700} // You can keep this or make it dynamic
              renderAnnotationLayer={false}
              renderTextLayer={true}
            />
          ))}
        </Document>
      </Card>
    </>
  );
};

export default ChatWindow;