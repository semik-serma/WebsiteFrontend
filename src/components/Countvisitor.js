import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { api } from '@/lib/api'
const Countvisitor = () => {
    const [visitor,setvisitor]=useState(500)
    const [count,setcount]=useState(1)
    const visitorcountpost=async()=>{
        const result=await axios.post(api.visitcount.visitcount,{
            visitor:crypto.randomUUID()
        })
        console.log(result)
    }
    const visitcount=async()=>{
        const result=await axios.get(api.visitcount.visitcountget)
        setvisitor(result.data.data)
    }
    // useEffect(()=>{
    // visitorcountpost()
    // },[count])
    useEffect(()=>{
        visitcount()
    },[])
  return (
    <div>
      Total views {visitor}
    </div>
  )
}

export default Countvisitor
