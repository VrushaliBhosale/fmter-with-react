import React, { useEffect, useState } from 'react';

const ShowCommon = (props) =>{
  const [data,setData] = useState([]);
  useEffect(()=>{
    let val = (props.audits && props.audits)||(props.remaining && props.remaining);
    setData(val);
  },[props])

  const getScoreDifference = (score) => {
    let msg = '';     
    if(score === 0){
      msg="score is similar (0)"
    }else if(score<0){
      msg=`decreased by ${score*(-1)}`
    }else if(score>0){
      msg=`increased by ${score}`
    }
    return msg;
  }
  return (
    <div>
      {props.audits && props.audits.length>0 && <h3>Common Urls</h3>||null}
    {
      // props.audits && props.audits.length>0 && 
      data && data === props.audits && data.length>0 &&
        data.map((elem,index)=>{
          let keys=Object.keys(elem.run1Audits)
          return (
            <div  key={index} style={{
              margin:'20px'
            }}>
            <div style={{fontWeight:'bold'}}>{elem.url}</div>
            <div>

              <div style={{
                display:'flex',
                flexDirection:'row',
              }}>
                <div>
                  <span>Run1:{elem.timeStamp1}</span>
                  <div>
                    {
                      keys.map((key,index)=>{
                        return(<div key={index}>{key}:{elem.run1Audits[key]}</div>)
                      })
                    }
                  </div>
                </div>

                <div>
                  <span>Run2:{elem.timeStamp2}</span>
                  <div>
                    {
                      keys.map((key,index)=>{
                        return(<div key={index}>{key}:{elem.run2Audits[key]}</div>)
                      })
                    }
                  </div>
                </div>
              </div>

              <div style={{marginTop:'10px'}}> 
                <div style={{fontWeight:'bold'}}>Summary</div>
                <div>
                {
                  keys.map((key,index)=>{
                  return(<div key={index}>{key}:{getScoreDifference(elem.diff[key])}</div>)
                  })
                }
                </div>
              </div>
            </div>
            </div>
          )
        })
    }
    {props.remaining && props.remaining.length>0 && <h3>Urls that haven't found any match.</h3>||null}
    {
      // props.remaining && props.remaining.length>0 &&
      data && data===props.remaining && data.length>0 &&
      data.map((elem,index)=>{
        let keys=Object.keys(elem.scores)
        return(
          <div key = {index} style={{
              margin:'20px'
              }}>
              <div style={{fontWeight:'bold'}}>{elem.url}</div>
              <div>{elem.timeStamp}</div>
              <div>
                {keys.map((key,index)=>{
                  return(<div key={index}>{key}:{elem.scores[key]}</div>)
                })}
              </div>
            </div>
        )
      })
    }
    </div>
  )
}
export default ShowCommon