export const getCommonUrls = async(run1Urls,run2Urls) => {
  let common=[];
  await run1Urls.map(url1=>{
   run2Urls.map(async url2=>{
     if(url1.url===url2.url){ 
       common.push({url:url1.url,id1:url1.id,id2:url2.id})
      }
   })
 })
 if(common.length>0){
   console.log("common at service:",common); 
    return common;
  }
  console.log("common at service:",common);
  return null;
}

const getRemainingForEachRun = async(common,runUrls) => {
  let remaining = [];
  let isPresent = false;

  await runUrls.map(async elem=>{
    common.map(each=>{
      if(elem.url===each.url){
        isPresent=true;
      }
    })
    !isPresent && remaining.push(elem);
    isPresent=false;
  })
  if(remaining.length>0){
    console.log("remaining :",remaining);
    return remaining;
  }
}

export const getRemainingurls = async(common,run1Urls,run2Urls) => {
  let remaining=[];
  if(common && common.length>0){
    remaining=[...getRemainingForEachRun(common,run1Urls),
    ...getRemainingForEachRun(common,run2Urls)]
    console.log("in service:",remaining)
  }
  else{
     run1Urls.map(async elem=>{
      remaining.push(elem);
    })
     run2Urls.map(async elem=>{
      remaining.push(elem);
    })
  }
    if(remaining.length>0){
      return remaining;
     }
}