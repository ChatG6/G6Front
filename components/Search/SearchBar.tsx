import { Cross2Icon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import {FC} from 'react'

interface props{
  value:string,
  onChange:(e:unknown) => void,
  handleClear:(e:unknown) => void,
}

const SearchBar:FC<props> = ({value,onChange,handleClear}) => {
  return (
    <div className="flex flex-row bg-white p-1 proj-search items-center "
    style={{
      width:'80%',
      //maxWidth:'40%',
      //position:'fixed',
      //right:'50%',
      //left:'50%',
      //top:'8%'
      //right:'50px'
    }}
    >
      <MagnifyingGlassIcon color="rgba(0, 0, 0, 0.5)"/>
      <input 
      type="text"
      placeholder="Search..."
      value={value}
      className="search-input ml-2"
      style={{
        width:'90%',
        height:'15px',
      }}
      onChange={onChange}
      />
      <button
      onClick={handleClear}
      >
        <Cross2Icon/>
      </button>
    </div>
  );
}



export default SearchBar;
