import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { api } from '@/lib/api'

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(num);
}

const Countvisitor = () => {
    const [visitor,setvisitor]=useState(500)
    const visitcount=async()=>{
        const result=await axios.get(api.visitcount.visitcountget)
        setvisitor(result.data.data)
    }
    useEffect(()=>{
        visitcount()
    },[])
  return (
    <div>
      Total views {formatNumber(visitor)}
    </div>
  )
}

export default Countvisitor
