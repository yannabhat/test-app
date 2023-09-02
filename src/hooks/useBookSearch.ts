import axios from 'axios'
import {useEffect,useState} from 'react'
function useBookSearch(query: string,pageNumber : number) {
    
    const [loading , setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [data, setData] = useState([])
    const [hasMore, setHasMore] = useState(false)
    
    useEffect(()=>{
        setData([])
        
    },[query])

    useEffect(()=>{
        setLoading(true)
        setError(false)
        let cancel : any
        axios({
            method : 'GET',
            url : 'http://openlibrary.org/search.json',
            params : {
                q :query,
                page : pageNumber
            },
            cancelToken : new axios.CancelToken((c:any)=> cancel = c)
        })
        .then((res)=>{
            setData((prevs:any) => {
                
                return [...new Set([...prevs,...res.data.docs.map((b:any) => b.title)])]
            })
           
            setHasMore(res.data.docs.length > 0)
           
        })
        .catch(err =>{
            if(axios.isCancel(err) ) return
            setError(true)
        }).finally(()=>{
            setLoading(false)
        })

        return ()=>cancel()

    },[query,pageNumber])
    return {loading,data,hasMore,error}
}
export  {
    useBookSearch
}
