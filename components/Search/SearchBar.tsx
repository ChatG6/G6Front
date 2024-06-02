import { Cross2Icon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import {FC} from 'react'

interface props{
  value:string,
  onChange:(e:unknown) => void,
  handleClear:(e:unknown) => void,
}

const SearchBar:FC<props> = ({value,onChange,handleClear}) => {
  return (
    <div className="flex flex-row bg-white p-1 proj-search items-center"
    style={{
      width:'380px'
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
        height:'30px',
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
