import {FC, ReactNode } from 'react';

interface props{
  children:ReactNode
}

const Container:FC<props> = ({children}) =>{
  return (
    <>
    <div className="container">
      {children}
    </div>
  </>
)}

export default Container