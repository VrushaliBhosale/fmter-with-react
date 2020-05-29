import React, { useEffect, useState } from 'react';
import CommonUrlsTable from '../tables/commonUrls';
import RemainingUrlsTable from '../tables/remainingUrls';
import {memo} from 'react';

const ShowCommon = (props) =>{
  const [data,setData] = useState([]);
  useEffect(()=>{
    let val = (props.audits && props.audits)||(props.remaining && props.remaining);
    setData(val);
  },[props])

  return (
    <>
      {props.audits && props.audits.length>0 && <h3>Common Urls</h3>}
      {
        data && data === props.audits && data.length>0 &&
          data.map((elem,index)=>{
            return <CommonUrlsTable data={elem} key={index} />
          })
      }
      {props.remaining && props.remaining.length>0 && <h3>Urls that haven't found any match.</h3>}
      {
        data && data===props.remaining && data.length>0 &&
        data.map((elem,index)=>{
          return <RemainingUrlsTable data={elem} key={index}/>
        })
      }
    </>
  )
}
export default memo(ShowCommon);