"use client";
import React, {FC} from 'react'
import { useOnClickOutside } from 'usehooks-ts'
import { Switch } from "@/components/ui/switch"
import { Button } from '../ui/button';
import { MagicWandIcon ,UpdateIcon ,ClipboardIcon} from '@radix-ui/react-icons';
import {
  paraphrase,
  summarize,
  advanced_check,
  pdf,
  complete,
} from "@/app/lib/helpers";
interface contextmenuprops {
  x:number,
  y:number,
  closeContextMenu:()=>void
}
const ContextMenu: FC<contextmenuprops> = ({x,y,closeContextMenu}) => {
    const ContextMenuRef=React.useRef<HTMLDivElement>(null)
    useOnClickOutside(ContextMenuRef,closeContextMenu)

    const complet = async function () {
      const editor = document.querySelector(".ql-editor");
      const button = document.querySelector(".completebtn") as HTMLButtonElement;
      if (editor) {
        // Get the current selection
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) {
          // Save the current selection range
          const range = selection.getRangeAt(0);
          // Disable the button to prevent multiple clicks
          button.disabled = true;
          // Paraphrase the selected text
          const paraphrasedContent = await complete(selection.toString());
          // Replace the selected text with the paraphrased content
          range.deleteContents(); // Remove the selected text
          const textNode = document.createTextNode(paraphrasedContent); // Create a new text node with the paraphrased content
          range.insertNode(textNode); // Insert the new text node at the selection's position
          // Re-enable the button
          button.disabled = false;
        } else {
          const content = editor.innerHTML;
          console.log(content);
          button.disabled = true;
          const paraphrasedContent = await complete(content);
          editor.innerHTML = paraphrasedContent;
          button.disabled = false;
        }
      }
    };

    const paraphras = async function () {
      const editor = document.querySelector(".ql-editor");
      const button = document.querySelector(
        ".paraphrasebtn"
      ) as HTMLButtonElement;
      if (editor) {
        // Get the current selection
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) {
          // Save the current selection range
          const range = selection.getRangeAt(0);
          // Disable the button to prevent multiple clicks
          button.disabled = true;
          // Paraphrase the selected text
          const paraphrasedContent = await paraphrase(selection.toString());
          // Replace the selected text with the paraphrased content
          range.deleteContents(); // Remove the selected text
          const textNode = document.createTextNode(paraphrasedContent); // Create a new text node with the paraphrased content
          range.insertNode(textNode); // Insert the new text node at the selection's position
          // Re-enable the button
          button.disabled = false;
        } else {
          const content = editor.innerHTML;
          button.disabled = true;
          const paraphrasedContent = await paraphrase(content);
          editor.innerHTML = paraphrasedContent;
          button.disabled = false;
        }
      }
    };

    const insert = async function (textToInsert: any) {
      const editor = document.querySelector(".ql-editor");
      const button = document.querySelector(
        ".paraphrasebtn"
      ) as HTMLButtonElement;
      if (editor) {
        const content = editor.innerHTML;
        button.disabled = true;
        // Create a new text node with the text to insert
        const textNode = document.createTextNode(textToInsert);
    
        // Insert the text node at the end of the editor's content
        editor.appendChild(textNode);
    
        button.disabled = false;
        return { success: true };
      }
    };

    const summariz = async function () {
      const editor = document.querySelector(".ql-editor");
      const button = document.querySelector(
        ".summarizebtn"
      ) as HTMLButtonElement;

      if (editor) {
        // Get the current selection
        const selection = window.getSelection();
        console.log(selection);
        
        if (selection && selection.toString().length > 0) {
          // Save the current selection range
          const range = selection.getRangeAt(0);
          // Disable the button to prevent multiple clicks
          button.disabled = true;
          // Paraphrase the selected text
          const paraphrasedContent = await summarize(selection.toString());
          // Replace the selected text with the paraphrased content
          range.deleteContents(); // Remove the selected text
          const textNode = document.createTextNode(paraphrasedContent); // Create a new text node with the paraphrased content
          range.insertNode(textNode); // Insert the new text node at the selection's position
          // Re-enable the button
          button.disabled = false;
        } else {
          const content = editor.innerHTML;
          console.log(content);
          button.disabled = true;
          const paraphrasedContent = await summarize(content);
          editor.innerHTML = paraphrasedContent;
          button.disabled = false;
        }
      }
    };



  return (
    <div 
    className='contextmenu absolute z-20' 
    style={{ top: `${y}px`,right: `${x}px`, left: `${x}px`,border:'1px solid rgba(0,0,0,0.5)',borderRadius:'16px',backgroundColor:'white' ,width:'200px',height:'100px',display:'flex',flexDirection:'column',justifyContent:'space-around',alignItems:'start'}}
    ref={ContextMenuRef}
    onContextMenu={(e) => e.preventDefault()}
    >   
    <div className='contaxt-menu-correction'>
        <span>Correction Mode </span>
        <Switch className='correction-switch' />
    </div>
    <div className='contaxt-menu-btn-list completebtn' onClick={complet}>
      <button className='flex row contaxt-menu-btn' >
        <span className='mr-2'>Auto-Complete</span>
        <MagicWandIcon className='h-6'/>
      </button>  
    </div>
    <div className='contaxt-menu-btn-list '>
      <button className='flex row contaxt-menu-btn paraphrasebtn' onClick={paraphras}>
        <span className='mr-2 '>Rephrase</span>
        <UpdateIcon className='h-6'/>
      </button>      
    </div>
    <div className='contaxt-menu-btn-list '>
      <button className='flex row contaxt-menu-btn summarizebtn' onClick={summariz} >
        <span className='mr-2 '>Summarize</span>
        <ClipboardIcon className='h-6'/>
      </button>      
    </div>
    </div>
  )
}

export default ContextMenu