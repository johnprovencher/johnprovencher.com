 window.onload = function() {
     var slideDOM = document.getElementsByClassName("slide"),
         countDOM = document.getElementsByClassName("countIn"),
         w = window,
         d = document,
         width = w.innerWidth || e.clientWidth || g.clientWidth,
         height = w.innerHeight || e.clientHeight || g.clientHeight,
         slideArr = [],
         t = -1,
         animateType,
         currentText;


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
         ele.style.display = 'block'

         var imageElement = ele.querySelector('img');
         var videoElement = ele.querySelector('video');

         if (imageElement) {
             var imageAltText = imageElement.getAttribute('alt');
             currentText = imageAltText
             typeWrite(currentText)
         }

         if (videoElement) {
             videoElement.controls = false;
             videoElement.play();
             videoElement.controls = false;

             var textTracks = videoElement.textTracks;
             var videoAltText = textTracks[0].label
             currentText = videoAltText
             typeWrite(currentText)
             document.body.style.backgroundColor = "#" + currentText;
             document.getElementById("orb").style.backgroundColor = "#" + currentText;
         }




     }

     function left(ele) {
         var videoElement = ele.querySelector('video');
         if (videoElement) {
             videoElement.pause();
         }

         ele.style.top = Math.max(0, (height - parseFloat(ele.style.height, 10)) / 2) + "px"
         ele.style.left = 0 - offset + 'px'
         ele.style.display = 'none'

     }

     function right(ele) {
         var videoElement = ele.querySelector('video');
         if (videoElement) {
             videoElement.pause();
         }

         ele.style.top = Math.max(0, (height - parseFloat(ele.style.height, 10)) / 2) + "px"
         //   ele.style.left = Math.max(0, (width - parseFloat(ele.style.width, 10))) + offset + "px"
         ele.style.display = 'none'


     }

     function leftOff(ele) {
         ele.style.top = Math.max(0, (height - parseFloat(ele.style.height, 10)) / 2) + "px"
         //    ele.style.left = "-50%"
         ele.style.display = 'none'

     }

     function rightOff(ele) {
         ele.style.top = Math.max(0, (height - parseFloat(ele.style.height, 10)) / 2) + "px"
         //   ele.style.left = "150%"
         ele.style.display = 'none'
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
             // slideDOM[i].style.width = "50px"
             // slideDOM[i].style.height = sHeight + "px"

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
             countDOM[i].style.color = "rgba(255,255,255, .4)"

         }
         for (i = 0; i < (t + 1); i++) {
             countDOM[i].style.color = "#4CBB17"
         }

         var percentage = ((t + 1) / (slideDOM.length)) * 100;

         for (i = 0; i < slideDOM.length; i++) {
             countDOM[i].style.color = "rgba(255,255,255, .4)";
         }

         for (i = 0; i < t + 1; i++) {
             if (percentage > 40) {
                 document.getElementById('percent').style.color = "#4CBB17"
                 countDOM[i].style.color = "#4CBB17";
             } else {
                 document.getElementById('percent').style.color = "orangered"
                 countDOM[i].style.color = "orangered";
             }
         }


         const roundedPercent = Math.floor(percentage);

         //var percentText = "(&thinsp;" + (t + 1) + "&thinsp;/&thinsp;" + slideDOM.length + "&thinsp;)"
         document.getElementById('percent').innerHTML = "(&thinsp;" + roundedPercent + "%&thinsp;)"
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
         var isIgnoredAgainAgain = ev.target.closest("#chatter");
         var isIgnoredAgain = ev.target.closest("#info-container");
         if (!isIgnoredAgainAgain) {

             if (!isIgnoredAgain) {
                 if (!isIgnored) {
                     counter(ev.isTrusted, isLeftHalfClick);
                     slider(isLeftHalfClick, false)

                 } else {
                     if (slideContainer.style.display === "none") {
                         slideContainer.style.display = "block";
                         infoContainer.style.display = "none";
                         typeWrite(currentText)

                     } else {
                         slideContainer.style.display = "none";
                         infoContainer.style.display = "block";
                         typeWrite("johnprovencher@gmail.com")
                         if (tClick === 0) {
                             styleThumb()
                         }
                         tClick += 1
                     }
                 }
             }
         }

         // ev.preventDefault();
     }


     //dark mode
     var toggleDark = document.getElementById("dark-light");
     var toggleOrb = document.getElementById("orb");
     var blockButton = document.getElementsByClassName("block-button");
     var blockColor = document.getElementsByClassName("block-color");

     const darkModePreference = localStorage.getItem('darkMode');
     if (darkModePreference === 'dark') {
         enableDarkMode();
     }

     const darkModeToggle = document.getElementById('darkModeToggle');
     darkModeToggle.checked = darkModePreference === 'dark';

     darkModeToggle.addEventListener('change', () => {
         if (darkModeToggle.checked) {
             enableDarkMode();
             localStorage.setItem('darkMode', 'dark');
         } else {
             disableDarkMode();
             localStorage.setItem('darkMode', 'light');
         }
     });

     function enableDarkMode() {

         document.body.classList.add("toggle-dark");
         toggleOrb.classList.add("toggle-orb");

         for (i = 0; i < blockColor.length; i++) {
             blockColor[i].classList.add("block-color-toggle");
         }


     }

     function disableDarkMode() {
         document.body.classList.remove("toggle-dark");
         toggleOrb.classList.remove("toggle-orb");
         for (i = 0; i < blockButton.length; i++) {
             blockButton[i].classList.remove("block-button-toggle");
         }
         for (i = 0; i < blockColor.length; i++) {
             blockColor[i].classList.remove("block-color-toggle");
         }
     }





 }