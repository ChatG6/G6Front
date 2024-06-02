
import React, { useRef, useEffect, ReactNode  } from 'react';

interface ModalProps {
 role?:string;
 children: ReactNode;
}

const Savemodal: React.FC<ModalProps> = ({  children ,role }) => {

 return (
    <div id='modal' className={role}
    style={{
      minWidth:"13rem"
    }}
    >
      {children}
    </div>
 );
};

export default Savemodal;
