const a1 = document.querySelector(".firstA");
const a2 = document.querySelector(".secondA");
const a3 = document.querySelector(".thirdA");
const line = document.querySelector("#line");

a1.addEventListener("mouseover", function(){
    line.classList.toggle("mouseoverFirstA");
});

a1.addEventListener("mouseout", function(){
    line.classList.remove("mouseoverFirstA");
})

a2.addEventListener("mouseover", function(){
    line.classList.toggle("mouseoverSecondA");
});

a2.addEventListener("mouseout", function(){
    line.classList.remove("mouseoverSecondA");
})

a3.addEventListener("mouseover", function(){
    line.classList.toggle("mouseoverThirdA");
});

a3.addEventListener("mouseout", function(){
    line.classList.remove("mouseoverThirdA");
})
