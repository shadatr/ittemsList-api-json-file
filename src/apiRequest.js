import React from 'react'

const apiRequest = async(url='', option=null ,errmg=null) => {
      const response= await fetch(url, option);
      try{
        if (!response.ok) throw Error("data no accsesable")   
      }
      catch(er){
        errmg= er.massege
      }
      finally{
        return errmg

}}

export default apiRequest
