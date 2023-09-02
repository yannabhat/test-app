import { useState,useRef,useCallback } from 'react'
import './App.css'
import { useBookSearch } from './hooks/useBookSearch'
function App() {
    const [query, setQuery] = useState('')
    const [pageNumber, setPageNumber] = useState(1)
    const observer = useRef<IntersectionObserver>()
    const {data,loading,error,hasMore}= useBookSearch(query,pageNumber)
    const lastBookElementRef = useCallback((node: any)=>{
      if(loading) return
      if(observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver(entries =>{
        if(entries[0].isIntersecting && hasMore){
          setPageNumber(prev =>{
            return prev + 1
          })
        }
      })
      if(node) observer.current.observe(node)
      
    },[loading, hasMore])
    
    const handleSearch = (e:React.ChangeEvent<HTMLInputElement>) =>{
      setQuery(e.target.value)
      setPageNumber(1)
    }
    return (
      <div className='container'>
        <div className='head'>
          <input type="text" value={query} onChange={handleSearch}/>
        </div>
        <div className='content'>
          {data?.map((el : any[],i : number) => {
          if (data.length === i + 1){
            return <div ref={lastBookElementRef}  key={i}>{el}</div>
          }else{
            return <div key={i}>{el}</div>
          }
          
        })}
        </div>
        
        <div>{loading && 'Loading....'}</div>
        <div>{error && 'Error'}</div>
      </div>
    )
}

export default App
