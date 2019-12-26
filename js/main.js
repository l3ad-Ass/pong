//Main function
function main(e){
    animateInterval=requestAnimationFrame(animate);
}

//Global variable declaration
var canvas,ctx,animateInterval;



canvas=document.getElementById("screen");
ctx=canvas.getContext("2d");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

//Global functions


//Animation loop
function animate(){
    ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
    
    //Drawing calls
    

    //Update Calls
    

    //Recurr animate function
    requestAnimationFrame(animate);
}

//Resize adjustment

window.onresize = resize;

function resize(e){
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
}

//Onload calback to main function
window.onload = main;