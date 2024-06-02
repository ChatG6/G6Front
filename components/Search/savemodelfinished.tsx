
import React, { useRef, useEffect, ReactNode  } from 'react';

interface ModalProps {
 role?:string;
 children: ReactNode;
}

const Savemodal: React.FC<ModalProps> = ({  children ,role }) => {

 return (
    <div id='modal4' className={role}>
      {children}
    </div>
 );
};

export default Savemodal;
