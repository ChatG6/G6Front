import React, { useRef, useEffect, ReactNode  } from 'react';
// import "@/components/editor/toolbar.css"
interface ModalProps {
 role?:string;
 visible: boolean;
 onClose: () => void;
 children: ReactNode;
}

const Savemodalshare: React.FC<ModalProps> = ({children ,role,visible, onClose}) => {
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
    
        if (visible) {
          timeoutId = setTimeout(() => {
            onClose();
          }, 4000);
        }
    
        return () => clearTimeout(timeoutId);
      }, [visible, onClose]);
 return (
   <>{visible && (<div id='modalshare' className={role}>
      {children}
    </div>)}</>
 );
};

export default Savemodalshare;
