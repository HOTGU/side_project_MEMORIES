"use strict";var img=document.querySelector("img"),imgFile=document.querySelector("input[name=thumbnail]"),fileName=document.getElementById("js-fileName"),paintFileName=(imgFile.style.display="none",function(e){fileName.innerHTML="";var i=document.createElement("span");i.innerText="파일이름: "+e.name,fileName.appendChild(i)}),paintPreview=function(e){var i=img.src,i=(URL.revokeObjectURL(i),URL.createObjectURL(e));img.src=i},handleChange=function(e){e=e.target.files[0];paintFileName(e),paintPreview(e)};img.addEventListener("click",function(){return imgFile.click()}),imgFile.addEventListener("change",handleChange);