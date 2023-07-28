  document.addEventListener('DOMContentLoaded', function() {
      var slideDOM = document.getElementsByClassName("slide"),
          countDOM = document.getElementsByClassName("countIn"),
          w = window,
          d = document,
          width = w.innerWidth || e.clientWidth || g.clientWidth,
          height = w.innerHeight || e.clientHeight || g.clientHeight,
          slideArr = [],
          t = -1,
          animateType,
          currentText,
          info = false;

      function shiftArrayToNumber(arr, targetNumber) {
          var index = arr.indexOf(targetNumber);
          if (index >= 0) {
              var leftPart = arr.slice(0, index);
              var rightPart = arr.slice(index);
              return rightPart.concat(leftPart);
          }
          return arr;
      }
      const observer = lozad(); // lazy loads elements with default selector as '.lozad'
      observer.observe();

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
              var video = container.querySelector("video");
              var pWidth;
              if (paragraph) {
                  pWidth = paragraph.offsetWidth;
              }

              if (image) {
                  // lazyLoadMedia(image);
                  image.style.width = pWidth + "px"
              }
              if (video) {
                  // lazyLoadMedia(video);
                  video.style.width = pWidth + "px"
                  video.pause()
                  video.controls = false;
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
      for (i = 0; i < 10; i++) {
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
      var marginSize = height
      var sizerW = width
      var sizerH = height
      var sHeight = 50;
      var offset = 0;

      if (height > width) {
          var marginSize = width
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



      const slides = document.querySelectorAll('.slide');



      //slider functions
      function center(ele) {
          ele.style.width = sizerW - (marginSize / 11) + "px"
          ele.style.height = sizerH - (marginSize / 11) + "px"
          ele.style.top = Math.max(0, (height - parseFloat(ele.style.height, 10)) / 2) + "px"
          ele.style.left = Math.max(0, (width - parseFloat(ele.style.width, 10)) / 2) + "px"
          ele.style.display = 'block'

          var imageElement = ele.querySelector('img');
          var videoElement = ele.querySelector('video');
          console.log(videoElement)
          if (imageElement) {
              var imageAltText = imageElement.getAttribute('alt');
              currentText = imageAltText
              if (info === false) {
                  typeWrite(currentText)
              }
          }
          if (videoElement) {

              // videoElement.play()
              videoElement.controls = false;
              // videoElement.play()

      
setInterval(function(){
console.log(videoElement.readyState)

        if (videoElement.readyState === 4) {
                  videoElement.play()
              }
},1000)


              var textTracks = videoElement.textTracks;
              var videoAltText = textTracks[0].label
              currentText = videoAltText
              if (info === false) {
                  typeWrite(currentText)
              }
          }
      }

      function left(ele) {
          ele.style.top = Math.max(0, (height - parseFloat(ele.style.height, 10)) / 2) + "px"
          ele.style.left = 0 - offset + 'px'
          ele.style.display = 'none'

      }

      function right(ele) {
          ele.style.top = Math.max(0, (height - parseFloat(ele.style.height, 10)) / 2) + "px"
          //   ele.style.left = Math.max(0, (width - parseFloat(ele.style.width, 10))) + offset + "px"
          ele.style.display = 'none'


      }

      function leftOff(ele) {
          var videoElement = ele.querySelector('video');
          if (videoElement) {
              //videoElement.pause();
          }
          ele.style.top = Math.max(0, (height - parseFloat(ele.style.height, 10)) / 2) + "px"
          ele.style.left = "-5000%"
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
          center(slideDOM[slideArr[0]])
          for (i = 1; i < slideDOM.length; i++) {
              leftOff(slideDOM[slideArr[i]])
          }
      }


      //innit
      slider(true, true)
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

          var percentage = ((t + 1) / (slideDOM.length)) * 100;
          var scale = (percentage / 100) * 10;
          for (i = 0; i < 10; i++) {
              countDOM[i].style.color = "rgba(255,255,255, .4)";
          }
          for (i = 0; i < scale; i++) {
              countDOM[i].style.color = "#54f408";
          }


          var roundedPercent = Math.floor(percentage);

          //var percentText = "(&thinsp;" + (t + 1) + "&thinsp;/&thinsp;" + slideDOM.length + "&thinsp;)"
          document.getElementById('percent').innerHTML = "(&thinsp;" + roundedPercent + "%&thinsp;)"
      }


      //click/touch event
      document.addEventListener("touchStart", click, false)
      document.addEventListener("click", click, false)

      var slideContainer = document.getElementById("slide-container");
      var infoContainer = document.getElementById("info-container");
      var chatter = document.getElementById("chatter");

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
                          if (width < 1200) {
                              chatter.style.display = "none";
                          }
                          info = false
                          typeWrite(currentText)

                      } else {
                          slideContainer.style.display = "none";
                          infoContainer.style.display = "block";
                          chatter.style.display = "inline-block";
                          info = true
                          typeWrite("e-mail?")
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


      var imageContainers = document.querySelectorAll('.image-container');

      // Add a click event listener to each element with class 'image-container'
      imageContainers.forEach(function(container, index) {
          container.addEventListener('click', function() {
              // Get the index of the clicked element among all elements with the class 'image-container'
              var clickedIndex = Array.from(imageContainers).indexOf(container);
              slideContainer.style.display = "block";
              infoContainer.style.display = "none";
              if (width < 1200) {
                  chatter.style.display = "none";
              }
              info = false
              var targetNumber = clickedIndex;

              var shiftedArray = shiftArrayToNumber(slideArr, targetNumber);
              slideArr = shiftedArray;
              t = targetNumber - 1
              slider(true, true)
              counter();
          });
      });


      // //dark mode
      // var toggleDark = document.getElementById("dark-light");
      // var toggleOrb = document.getElementById("orb");
      // var blockButton = document.getElementsByClassName("block-button");
      // var blockColor = document.getElementsByClassName("block-color");
      // var anchorTags = document.querySelectorAll('a:not(.block-button)');



      // var darkModePreference = localStorage.getItem('darkMode');
      // if (darkModePreference === 'dark') {
      //     enableDarkMode();
      // }

      // var darkModeToggle = document.getElementById('darkModeToggle');
      // darkModeToggle.checked = darkModePreference === 'dark';

      // darkModeToggle.addEventListener('change', () => {
      //     if (darkModeToggle.checked) {
      //         enableDarkMode();
      //         localStorage.setItem('darkMode', 'dark');
      //     } else {
      //         disableDarkMode();
      //         localStorage.setItem('darkMode', 'light');
      //     }
      // });

      // function enableDarkMode() {

      //     document.body.classList.add("toggle-dark");
      //     toggleOrb.classList.add("toggle-orb");
      //     anchorTags.forEach(function(anchor) {
      //         anchor.classList.add('toggle-dark');
      //     });
      //     for (i = 0; i < blockColor.length; i++) {
      //         blockColor[i].classList.add("block-color-toggle");
      //     }


      // }

      // function disableDarkMode() {
      //     document.body.classList.remove("toggle-dark");
      //     toggleOrb.classList.remove("toggle-orb");
      //     anchorTags.forEach(function(anchor) {
      //         anchor.classList.remove('toggle-dark');
      //     });
      //     for (i = 0; i < blockButton.length; i++) {
      //         blockButton[i].classList.remove("block-button-toggle");
      //     }
      //     for (i = 0; i < blockColor.length; i++) {
      //         blockColor[i].classList.remove("block-color-toggle");
      //     }
      // }




  });