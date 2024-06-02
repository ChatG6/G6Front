import {FC} from 'react';


interface props{
  value:string
}
const handledown2 = async(pdfUrl: any)=> {
  window.open(pdfUrl);
  window.focus()

}
const Result:FC<props> = ({value}) => {
  const item = JSON.parse(value)
  
  return (
    <div className='result'>
      <h4>Title:{item.title}</h4>
      <h4>Author:{item.author}</h4>
      <h4>Published:{item.published}</h4>
      {(item['pdf_url'] !=='') && (
        <h4>PDF:<button onClick={() => handledown2(item.pdf_url)}>Download</button></h4>
      )}
    </div>
  );
};

export default Result;
