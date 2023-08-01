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
      const observer = lozad('.lozad', {
          rootMargin: '2500px 0px', // syntax similar to that of CSS Margin
          threshold: 0.1, // ratio of element convergence
          enableAutoReload: true // it will reload the new image when validating attributes changes
      });

      observer.observe();


    document.addEventListener('touchmove', preventZoom, { passive: false });
    // Function to prevent default touchmove behavior
    function preventZoom(event) {
      event.preventDefault();
    }

      var typewriterText = document.getElementById("type");
      var typewriterTextM = document.getElementById("chatterMobile");
      //typewriter
      function typeWrite(text) {
          typewriterText.textContent = ""
          typewriterTextM.textContent = ""

          let charIndex = 0;
          var typingSpeed = 40;
          clearTimeout(animateType)

          function typeNextCharacter() {
              if (charIndex < text.length) {
                  typewriterText.textContent += text.charAt(charIndex);
                  typewriterTextM.textContent += text.charAt(charIndex);
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
                  image.style.width = pWidth + "px"
              }
              if (video) {
                  video.style.width = pWidth + "px"
                  //  video.pause()
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
      percent.innerHTML = "(&thinsp;0%&thinsp;)"
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
          // ele.style.display = 'block'
          ele.style.opacity = '1'

          var imageElement = ele.querySelector('img');
          var videoElement = ele.querySelector('video');
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
              videoElement.play()


              videoElement.addEventListener('loadeddata', (e) => {
                  //   videoElement.play()
              });



              var textTracks = videoElement.textTracks;
              var videoAltText = textTracks[0].label
              currentText = videoAltText
              if (info === false) {
                  typeWrite(currentText)
              }
          }
      }


      function next(ele) {
          ele.style.width = sizerW - (marginSize / 11) + "px"
          ele.style.height = sizerH - (marginSize / 11) + "px"
          var videoElement = ele.querySelector('video');
          var imageElement = ele.querySelector('img');
          if (videoElement) {
              videoElement.pause();
          } else {
              observer.triggerLoad(imageElement);
          }
          ele.style.top = Math.max(0, (height - parseFloat(ele.style.height, 10)) / 2) + "px"
          ele.style.left = width * 2 + "px"
          // ele.style.display = 'none'
          ele.style.opacity = '0'

      }




      function leftOff(ele) {
          ele.style.width = sizerW - (marginSize / 11) + "px"
          ele.style.height = sizerH - (marginSize / 11) + "px"
          var videoElement = ele.querySelector('video');
          var imageElement = ele.querySelector('img');
          if (videoElement) {
              videoElement.pause();
          } else {}
          ele.style.top = Math.max(0, (height - parseFloat(ele.style.height, 10)) / 2) + "px"
          ele.style.left = width * 2 + "px"
          ele.style.opacity = '0'
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
          next(slideDOM[slideArr[1]])
          next(slideDOM[slideArr[slideDOM.length - 1]])
          for (i = 2; i < slideDOM.length; i++) {
              leftOff(slideDOM[slideArr[i]])
          }
      }


      //innit
      var slideshowx = document.getElementById('slideshow');
      var loaderx = document.getElementById('loader');
      var orbElement = document.getElementById('orb');

      var entry = false
      setTimeout(function() {
          slider(true, true)
          counter();
          slideshowx.style.opacity = "1"
          orbElement.style.opacity = "1"
          setTimeout(function() {
              entry = true;
              loaderx.style.display = "none"
          }, 500)
      }, 2500)


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
          document.getElementById('percent').style.color = "#54f408"

      }


      //click/touch event
      document.addEventListener("touchStart", click, false)
      document.addEventListener("click", click, false)

      var slideContainer = document.getElementById("slide-container");
      var infoContainer = document.getElementById("info-container");
      var thumbnails = document.getElementById("thumbnails");

      var chatter = document.getElementById("chatter");
      var chatterM = document.getElementById("chatterMobile");

      var tClick = 0;
      var imageContainers = document.querySelectorAll('.image-container');


      function click(ev) {
          var isLeftHalfClick = (ev.clientX) < width / 2;
          var isIgnored = ev.target.closest("#orb");
          var isIgnoredAgainAgain = ev.target.closest("#chatter");
          var email = document.getElementById("email");

          function toggleThis() {
              chatterM.style.display = "none"
              if (slideContainer.style.display === "none") {
                  slideContainer.style.display = "block";
                  infoContainer.style.display = "none";
                  if (width < 1200) {
                      chatter.style.display = "none";
                      chatterM.style.display = "block";
                  }
                  info = false
                  typeWrite(currentText)

              } else {
                  document.removeEventListener('touchmove', preventZoom);
                  slideContainer.style.display = "none";
                  infoContainer.style.display = "block";
                  chatter.style.display = "inline-block";
                  setTimeout(function() {
                      thumbnails.style.opacity = "1";


                  }, 100)
                  email.style.display = "none";
                  info = true
                  typeWrite("e-mail ...")
                  if (tClick === 0) {
                      styleThumb()
                  }
                  tClick += 1
              }
          }
          var isIgnoredAgain = ev.target.closest("#info-container");
          if (!isIgnoredAgainAgain) {
              if (!isIgnoredAgain) {
                  if (!isIgnored) {
                      if (entry === true) {
                          counter(ev.isTrusted, isLeftHalfClick);
                          slider(isLeftHalfClick, false)
                      }
                  } else {
                      toggleThis()
                  }
              }
          } else {
              toggleThis()
          }
          // ev.preventDefault();
      }



      // Add a click event listener to each element with class 'image-container'
      imageContainers.forEach(function(container, index) {
          container.addEventListener('click', function() {
              // Get the index of the clicked element among all elements with the class 'image-container'
              var clickedIndex = Array.from(imageContainers).indexOf(container);
              slideContainer.style.display = "block";
              infoContainer.style.display = "none";
              if (width < 1200) {
                  chatter.style.display = "none";
                  chatterM.style.display = "block";
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


      var toggleDark = document.getElementById("dark-light");
      var toggleOrb = document.getElementById("orb");
      var blockButton = document.getElementsByClassName("block-button");
      var blockColor = document.getElementsByClassName("block-color");
      var anchorTags = document.querySelectorAll('a:not(.block-button)');

      // Function to enable dark mode
      function enableDarkMode() {
          document.body.classList.add("toggle-dark");
          toggleOrb.classList.add("toggle-orb");
          anchorTags.forEach(function(anchor) {
              anchor.classList.add('toggle-dark');
          });
          for (i = 0; i < blockColor.length; i++) {
              blockColor[i].classList.add("block-color-toggle");
          }
      }

      // Function to disable dark mode
      function disableDarkMode() {
          document.body.classList.remove("toggle-dark");
          toggleOrb.classList.remove("toggle-orb");
          anchorTags.forEach(function(anchor) {
              anchor.classList.remove('toggle-dark');
          });
          for (i = 0; i < blockButton.length; i++) {
              blockButton[i].classList.remove("block-button-toggle");
          }
          for (i = 0; i < blockColor.length; i++) {
              blockColor[i].classList.remove("block-color-toggle");
          }
      }

      var darkModeToggle = document.getElementById('darkModeToggle');
      darkModeToggle.addEventListener('change', () => {
          if (darkModeToggle.checked) {
              enableDarkMode();
          } else {
              disableDarkMode();
          }
      });


      function logFocusedElement() {
          const focusedElement = document.activeElement;
          console.log("Currently focused element:", focusedElement);
      }

      // Attach an event listener to the document to detect focus changes
      document.addEventListener("focusin", logFocusedElement);


      // Disable pinch-to-zoom gesture on mobile devices
      document.addEventListener('touchmove', function(event) {
          event.preventDefault();
      }, { passive: false });



  });