 window.onload = function() {
     var slideDOM = document.getElementsByClassName("slide"),
         countDOM = document.getElementsByClassName("countIn"),
         w = window,
         d = document,
         width = w.innerWidth || e.clientWidth || g.clientWidth,
         height = w.innerHeight || e.clientHeight || g.clientHeight,
         slideArr = [],
         t = -1,
         animateType;
     //typewriter
     function typeWrite(text) {

         var typewriterText = document.getElementById("type");
         typewriterText.textContent = ""
         let charIndex = 0;
         var typingSpeed = 40;
         clearTimeout(animateType)
         function typeNextCharacter() {
             if (charIndex < text.length) {
                 typewriterText.textContent += text.charAt(charIndex);
                 charIndex++;
                 animateType = setTimeout(typeNextCharacter, typingSpeed);
             }
         }
         typeNextCharacter();
     }
     typeWrite("hello ...")

     //p tag = image width
     function styleThumb() {
         var containers = document.getElementsByClassName("image-container");
         for (let container of containers) {
             var paragraph = container.querySelector("p");
             var image = container.querySelector("img");
             var pWidth;
             if (paragraph) {
                 pWidth = paragraph.offsetWidth;
             }

             if (image) {
                 image.style.width = pWidth + "px"
             }
         }
     }


     //slide map
     for (i = 0; i < slideDOM.length; i++) {
         slideArr.push(i)
     }

     //generate counter functions

     document.getElementById('counter').innerHTML = "";
     var percent = document.createElement("div");
     percent.setAttribute("id", "percent");
     document.getElementById('counter').appendChild(percent);
     for (i = 0; i < slideDOM.length; i++) {
         var count = document.createElement("div");
         count.classList.add("count");
         var countIn = document.createElement("div");
         var txt = document.createTextNode('⠿');
         countIn.appendChild(txt);
         countIn.classList.add("countIn");
         count.appendChild(countIn);
         document.getElementById('counter').appendChild(count);
     }

     //layout sizing
     var sizerW = width
     var sizerH = height
     var sHeight = 50;
     var offset = 0;

     if (height > width) {
         sizerW = width
         sizerH = height
         sHeight = height
         offset = 100
     }

     function getSize() {
         w = window,
             d = document,
             width = w.innerWidth || e.clientWidth || g.clientWidth,
             height = w.innerHeight || e.clientHeight || g.clientHeight,
             sizerW = width,
             sizerH = height,
             sHeight = 50,
             offset = 0;

         if (height > width) {
             sizerW = width
             sizerH = height
             sHeight = height
             offset = 100
         }
     };

     //reset slideshow when browser is resized
     addEventListener("resize", (event) => {});
     onresize = (event) => {
         getSize()
         slider(true, true)
     }

     //slider functions
     function center(ele) {
         ele.style.width = sizerW + "px"
         ele.style.height = sizerH + "px"
         ele.style.top = Math.max(0, (height - parseFloat(ele.style.height, 10)) / 2) + "px"
         ele.style.left = Math.max(0, (width - parseFloat(ele.style.width, 10)) / 2) + "px"
     }

     function left(ele) {
         ele.style.top = Math.max(0, (height - parseFloat(ele.style.height, 10)) / 2) + "px"
         ele.style.left = 0 - offset + 'px'
     }

     function right(ele) {
         ele.style.top = Math.max(0, (height - parseFloat(ele.style.height, 10)) / 2) + "px"
         ele.style.left = Math.max(0, (width - parseFloat(ele.style.width, 10))) + offset + "px"

     }

     function leftOff(ele) {
         ele.style.top = Math.max(0, (height - parseFloat(ele.style.height, 10)) / 2) + "px"
         ele.style.left = "-50%"
     }

     function rightOff(ele) {
         ele.style.top = Math.max(0, (height - parseFloat(ele.style.height, 10)) / 2) + "px"
         ele.style.left = "150%"
     }

     //slider
     function slider(toggle, resize) {
         if (resize === false) {
             if (toggle === true) {
                 slideArr.unshift(slideArr.pop());

             } else {
                 slideArr.push(slideArr.shift())

             }
         }
         for (i = 0; i < slideDOM.length; i++) {
             slideDOM[i].style.width = "50px"
             slideDOM[i].style.height = sHeight + "px"

         }
         leftOff(slideDOM[slideArr[0]])
         left(slideDOM[slideArr[1]])
         center(slideDOM[slideArr[2]])
         right(slideDOM[slideArr[3]])
         rightOff(slideDOM[slideArr[4]])
         for (i = 5; i < slideDOM.length; i++) {
             leftOff(slideDOM[slideArr[i]])
         }
     }


     //innit
     slider(false, false)
     counter();

     //top counter animation /  ticker
     function counter(clicker, toggle) {

         if (toggle === true) {
             t -= 1;

         } else {
             t += 1;

         }
         if (t >= slideDOM.length) {
             t = 0;
             for (i = 0; i < slideDOM.length; i++) {}
         }

         if (t <= -1) {
             t = slideDOM.length - 1;
         }

         for (i = 0; i < slideDOM.length; i++) {
             countDOM[i].style.color = "#707070"

         }
         for (i = 0; i < (t + 1); i++) {
             countDOM[i].style.color = "#4CBB17"
         }


         var percentText = "(&thinsp;" + (t + 1) + "&thinsp;/&thinsp;" + slideDOM.length + "&thinsp;)"
         document.getElementById('percent').innerHTML = percentText
     }


     //click/touch event
     document.addEventListener("touchStart", click, false)
     document.addEventListener("click", click, false)

     var slideContainer = document.getElementById("slide-container");
     var infoContainer = document.getElementById("info-container");
     var tClick = 0;


     function click(ev) {
         var isLeftHalfClick = (ev.clientX) < width / 2;
         var isIgnored = ev.target.closest("#orb");
         var isIgnoredAgain = ev.target.closest("#info-container");
         if (!isIgnoredAgain) {

             if (!isIgnored) {
                 counter(ev.isTrusted, isLeftHalfClick);
                 slider(isLeftHalfClick, false)
             } else {
                 if (slideContainer.style.display === "none") {
                     slideContainer.style.display = "block";
                     infoContainer.style.display = "none";
                     typeWrite("hello ...")

                     //document.body.style.overflow = "hidden";

                 } else {
                     slideContainer.style.display = "none";
                     infoContainer.style.display = "block";
                     // document.body.style.overflow = "inherit";
                     typeWrite("johnprovencher@gmail.com")
                     if (tClick === 0) {
                         styleThumb()
                     }
                     tClick += 1
                 }
             }
         }

         ev.preventDefault();
     }


     //dark mode

     var toggleDark = document.getElementById("dark-light");
     var toggleOrb = document.getElementById("orb");
     var blockButton = document.getElementsByClassName("block-button");
     var blockColor = document.getElementsByClassName("block-color");

     toggleDark.addEventListener("click", function() {
         // Toggle the 'styles-toggled' class on the element
         document.body.classList.toggle("toggle-dark");
         toggleOrb.classList.toggle("toggle-orb");

         for (i = 0; i < blockButton.length; i++) {
             blockButton[i].classList.toggle("block-button-toggle");
         }
         for (i = 0; i < blockColor.length; i++) {
             blockColor[i].classList.toggle("block-color-toggle");
         }
     });




 }