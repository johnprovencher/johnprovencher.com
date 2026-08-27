document.addEventListener('DOMContentLoaded', function() {
    var slideDOM = document.getElementsByClassName("slide"),
        countDOM = document.getElementsByClassName("countIn"),
        w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
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

    // lozad (DELAY OBSERVING UNTIL AFTER FIRST slider() POSITIONS THE SLIDES)
    const observer = lozad('.lozad', {
        rootMargin: '0px 0px', // was '2500px 0px' (too eager on load)
        threshold: 0.1,
        enableAutoReload: true
    });

    let didObserve = false;
    function startObservingOnce() {
        if (didObserve) return;
        didObserve = true;
        observer.observe();
    }

    // Preload above-the-fold thumbnails + first slide early (during SVG animation)
    function preloadEarly() {
        // Only first ~6 thumbnails (above the fold)
        var thumbnailImages = document.querySelectorAll('#thumbnails .lozad');
        var aboveFold = Math.min(6, thumbnailImages.length);
        for (var i = 0; i < aboveFold; i++) {
            if (thumbnailImages[i] && thumbnailImages[i].dataset.src) {
                var preload = new Image();
                preload.src = thumbnailImages[i].dataset.src;
            }
        }

        // First shown slide only (first featured slide when featured mode starts on)
        var firstSlide = slideDOM[featuredArr.length > 0 ? featuredArr[0] : 0];
        if (firstSlide) {
            var firstSlideImg = firstSlide.querySelector('.lozad');
            if (firstSlideImg && firstSlideImg.dataset.src) {
                var preload = new Image();
                preload.src = firstSlideImg.dataset.src;
            }

            // start buffering a first-slide video during intro animation
            var firstSlideVideo = firstSlide.querySelector('video');
            if (firstSlideVideo) {
                firstSlideVideo.preload = 'auto';
                firstSlideVideo.load();
            }
        }
    }

    // Start preloading immediately
    setTimeout(preloadEarly, 100);

    // once the first in-view thumbnails load, force the rest (no scroll cascade)
    var thumbsForced = false;
    function loadAllThumbnails() {
        if (thumbsForced) return;
        thumbsForced = true;

        var thumbs = Array.prototype.slice.call(document.querySelectorAll('#thumbnails .lozad'));
        if (thumbs.length === 0) return;
        var firstBatch = thumbs.slice(0, 6);
        var rest = thumbs.slice(6);
        var pending = firstBatch.length;
        var restLoaded = false;

        function loadRest() {
            if (restLoaded) return;
            restLoaded = true;
            rest.forEach(function(img) {
                observer.triggerLoad(img);
            });
        }

        function done() {
            pending -= 1;
            if (pending <= 0) loadRest();
        }

        firstBatch.forEach(function(img) {
            observer.triggerLoad(img);
            if (img.complete && img.naturalWidth > 0) {
                done();
            } else {
                img.addEventListener('load', done, { once: true });
                img.addEventListener('error', done, { once: true });
            }
        });

        // safety net if a first-batch image never fires
        setTimeout(loadRest, 4000);
    }

    var typewriterText = document.getElementById("type");
    var typewriterEmail = document.getElementById("typeEmail");
    var typewriterTextM = document.getElementById("chatterMobile");
    var mType = false;

    // typewriter
    function typeWrite(text) {
        if (mType === true) {
            typewriterEmail.textContent = "";
        } else {
            typewriterText.textContent = "";
            typewriterTextM.textContent = "";
        }

        let charIndex = 0;
        var typingSpeed = 40;
        clearTimeout(animateType);

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

    // p tag = image width
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
                image.style.width = pWidth + "px";
            }
            if (video) {
                video.style.width = pWidth + "px";
                // video.pause()
                video.controls = false;
            }
        }
    }

    // slide map
    for (i = 0; i < slideDOM.length; i++) {
        slideArr.push(i);
    }

    // featured slides (flagged per media item in the CMS → data-featured on the slide)
    var featuredArr = [];
    for (i = 0; i < slideDOM.length; i++) {
        if (slideDOM[i].dataset.featured) {
            featuredArr.push(i);
        }
    }
    var featuredMode = featuredArr.length > 0;

    // each bar keeps its own position — browsing one mode never moves the other bar
    var featuredPos = 0;
    var allPos = 0;

    // generate counter functions — two stacked health bars:
    // top = featured set, bottom = all items; the lit one is the active mode
    var counterEl = document.getElementById('counter');
    counterEl.innerHTML = "";

    function buildHealthBar(id) {
        var row = document.createElement("div");
        row.classList.add("health-row");
        row.setAttribute("id", id);
        var pct = document.createElement("div");
        pct.classList.add("percent");
        pct.innerHTML = "(&thinsp;0%&thinsp;)";
        row.appendChild(pct);
        var dots = [];
        for (var j = 0; j < 10; j++) {
            var count = document.createElement("div");
            count.classList.add("count");
            var countIn = document.createElement("div");
            var txt = document.createTextNode('⠿');
            countIn.appendChild(txt);
            countIn.classList.add("countIn");
            count.appendChild(countIn);
            row.appendChild(count);
            dots.push(countIn);
        }
        counterEl.appendChild(row);
        return { row: row, pct: pct, dots: dots };
    }

    var featuredBar = buildHealthBar("featured-bar");
    var allBar = buildHealthBar("all-bar");
    if (featuredArr.length === 0) {
        featuredBar.row.style.display = "none";
    }

    // hovering a bar shows its name instead of the percent
    featuredBar.label = "select";
    allBar.label = "all";
    [featuredBar, allBar].forEach(function(bar) {
        bar.row.addEventListener('mouseenter', function() {
            bar.hover = true;
            bar.pct.innerHTML = "(&thinsp;" + bar.label + "&thinsp;)";
        });
        bar.row.addEventListener('mouseleave', function() {
            bar.hover = false;
            renderCounter();
        });
    });

    // layout sizing
    var marginSize = height;
    var sizerW = width;
    var sizerH = height;
    var sHeight = 50;
    var offset = 0;

    if (height > width) {
        var marginSize = width;
        offset = 100;
    }

    function getSize() {
        w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        width = w.innerWidth || e.clientWidth || g.clientWidth,
        height = w.innerHeight || e.clientHeight || g.clientHeight,
        sizerW = width,
        sizerH = height,
        sHeight = 50,
        offset = 0;

        if (height > width) {
            sizerW = width;
            sizerH = height;
            sHeight = height;
            offset = 100;
        }
    };

    // reset slideshow when browser is resized
    addEventListener("resize", (event) => {});
    onresize = (event) => {
        getSize();
        slider(true, true);
    };

    const slides = document.querySelectorAll('.slide');

    // only the centered video is ever allowed to play
    var activeVideo = null;

    function playVideo(videoElement) {
        // WKWebView (Instagram/iOS in-app browser) only allows play() when the
        // muted property is set — the HTML attribute alone isn't reliable
        videoElement.muted = true;
        activeVideo = videoElement;
        var playPromise = videoElement.play();
        if (playPromise !== undefined) {
            playPromise.catch(function() {
                // retry only if this video is still the centered one —
                // otherwise a fast-advance pause() rejection would resurrect
                // an off-screen video and exhaust iOS's decoder pool
                if (videoElement === activeVideo) {
                    videoElement.muted = true;
                    videoElement.play().catch(function() {});
                }
            });
        }
    }

    function pauseVideo(videoElement) {
        if (videoElement === activeVideo) {
            activeVideo = null;
        }
        videoElement.pause();
        videoElement.preload = 'none';
    }

    // slider functions
    function center(ele) {
        ele.style.width = sizerW - (marginSize / 15) + "px";
        ele.style.height = sizerH - (marginSize / 15) + "px";
        ele.style.top = Math.max(0, (height - parseFloat(ele.style.height, 10)) / 2) + "px";
        ele.style.left = Math.max(0, (width - parseFloat(ele.style.width, 10)) / 2) + "px";
        ele.style.opacity = '1';

        var imageElement = ele.querySelector('img');
        var videoElement = ele.querySelector('video');

        if (imageElement) {
            // ✅ load the centered image immediately (sequencing)
            observer.triggerLoad(imageElement);

            var imageAltText = imageElement.getAttribute('alt');
            currentText = imageAltText;
            if (info === false) {
                typeWrite(currentText);
            }
        }

        if (videoElement) {
            videoElement.controls = false;
            videoElement.preload = 'auto';
            playVideo(videoElement);

            var textTracks = videoElement.textTracks;
            var videoAltText = textTracks[0].label;
            currentText = videoAltText;
            if (info === false) {
                typeWrite(currentText);
            }
        }
    }

    function next(ele) {
        ele.style.width = sizerW - (marginSize / 15) + "px";
        ele.style.height = sizerH - (marginSize / 15) + "px";
        var videoElement = ele.querySelector('video');
        var imageElement = ele.querySelector('img');

        if (videoElement) {
            pauseVideo(videoElement);
        } else if (imageElement) {
            // ✅ preload next image only (sequenced)
            observer.triggerLoad(imageElement);
        }

        ele.style.top = Math.max(0, (height - parseFloat(ele.style.height, 10)) / 2) + "px";
        ele.style.left = width * 2 + "px";
        ele.style.opacity = '0';
    }

    function leftOff(ele) {
        ele.style.width = sizerW - (marginSize / 15) + "px";
        ele.style.height = sizerH - (marginSize / 15) + "px";
        var videoElement = ele.querySelector('video');
        var imageElement = ele.querySelector('img');
        if (videoElement) {
            pauseVideo(videoElement);
        } else {}
        ele.style.top = Math.max(0, (height - parseFloat(ele.style.height, 10)) / 2) + "px";
        ele.style.left = width * 2 + "px";
        ele.style.opacity = '0';
    }

    // slider
    function slider(toggle, resize) {
        if (resize === false) {
            if (toggle === true) {
                slideArr.unshift(slideArr.pop());
            } else {
                slideArr.push(slideArr.shift());
            }
        }

        for (i = 0; i < slideDOM.length; i++) {
            // slideDOM[i].style.width = "50px"
            // slideDOM[i].style.height = sHeight + "px"
        }

        center(slideDOM[slideArr[0]]);
        next(slideDOM[slideArr[1]]);
        next(slideDOM[slideArr[slideDOM.length - 1]]);
        for (i = 2; i < slideDOM.length; i++) {
            leftOff(slideDOM[slideArr[i]]);
        }
    }

    // innit
    var slideshowx = document.getElementById('slideshow');
    var loaderx = document.getElementById('loader');
    var orbElement = document.getElementById('orb');

    var entry = false;
    setTimeout(function() {
        if (featuredMode) {
            // open on the first featured slide
            slideArr = shiftArrayToNumber(slideArr, featuredArr[0]);
            t = featuredArr[0];
            slider(true, true);
            renderCounter();
        } else {
            slider(true, true);
            counter();
        }

        // ✅ start observing only after slides are positioned
        startObservingOnce();
        slideshowx.style.opacity = "1";
        orbElement.style.opacity = "1";
        if (width < 1200) {
            orbElement.click();
        }
        setTimeout(function() {
            entry = true;
            loaderx.style.display = "none";
        }, 500);
    }, 2500);

    // top counter animation / ticker
    function counter(clicker, toggle) {
        if (toggle === true) {
            t -= 1;
        } else {
            t += 1;
        }

        if (t >= slideDOM.length) {
            t = 0;
        }

        if (t <= -1) {
            t = slideDOM.length - 1;
        }

        renderCounter();
    }

    function renderBar(bar, current, total, active) {
        var percentage = total > 0 ? (current / total) * 100 : 0;
        var scale = (percentage / 100) * 10;
        var fill = active ? "#54f408" : "rgba(84, 244, 8, .35)";
        for (var j = 0; j < 10; j++) {
            bar.dots[j].style.color = j < scale ? fill : "rgba(255,255,255, .4)";
        }
        bar.pct.innerHTML = "(&thinsp;" + (bar.hover ? bar.label : Math.floor(percentage) + "%") + "&thinsp;)";
        bar.pct.style.color = fill;
    }

    function renderCounter() {
        if (featuredMode) {
            var fPos = featuredArr.indexOf(t);
            if (fPos !== -1) {
                featuredPos = fPos;
            }
        } else {
            allPos = t;
        }
        renderBar(featuredBar, featuredPos + 1, featuredArr.length, featuredMode);
        renderBar(allBar, allPos + 1, slideDOM.length, !featuredMode);
    }

    function setFeaturedMode(on) {
        featuredMode = on && featuredArr.length > 0;
    }

    function jumpToSlide(index) {
        slideArr = shiftArrayToNumber(slideArr, index);
        t = index;
        slider(true, true);
        renderCounter();
    }

    function advance(isLeftHalfClick) {
        if (featuredMode && featuredArr.length > 0) {
            var pos = featuredArr.indexOf(slideArr[0]);
            if (pos === -1) {
                jumpToSlide(featuredArr[0]);
                return;
            }
            if (isLeftHalfClick) {
                // backward loops within the featured set
                jumpToSlide(featuredArr[pos === 0 ? featuredArr.length - 1 : pos - 1]);
            } else if (pos === featuredArr.length - 1) {
                // featured done — switch off, start from the first item of all,
                // and reset featured so a re-toggle starts it fresh
                featuredPos = 0;
                setFeaturedMode(false);
                jumpToSlide(0);
            } else {
                jumpToSlide(featuredArr[pos + 1]);
            }
        } else {
            counter(true, isLeftHalfClick);
            slider(isLeftHalfClick, false);
        }
    }

    featuredBar.row.addEventListener('click', function(ev) {
        ev.stopPropagation();
        if (entry !== true) {
            return;
        }
        if (!featuredMode && featuredArr.length > 0) {
            // resume where you left off in the featured set
            setFeaturedMode(true);
            jumpToSlide(featuredArr[featuredPos]);
        }
    });

    allBar.row.addEventListener('click', function(ev) {
        ev.stopPropagation();
        if (entry !== true) {
            return;
        }
        if (featuredMode) {
            // switching to the all bar resumes where you left off in the full slideshow
            setFeaturedMode(false);
            jumpToSlide(allPos);
        }
    });

    // click/touch event
    document.addEventListener("touchStart", click, false);
    document.addEventListener("click", click, false);

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
        var isIgnoredAgain = ev.target.closest("#info-container");
        var isIgnoredAgainAgain = ev.target.closest("#chatter");
        var email = document.getElementById("email");

        function toggleThis() {
            chatterM.style.display = "none";
            if (slideContainer.style.display === "none") {
                mType = false;
                slideContainer.style.display = "block";
                infoContainer.style.display = "none";
                if (width < 1200) {
                    chatter.style.display = "none";
                    chatterM.style.display = "block";
                }
                info = false;
                typeWrite(currentText);
            } else {
                mType = false;
                slideContainer.style.display = "none";
                infoContainer.style.display = "block";
                chatter.style.display = "inline-block";
                setTimeout(function() {
                    thumbnails.style.opacity = "1";
                }, 100);
                email.style.display = "none";
                info = true;
                typeWrite("works ...");
                if (tClick === 0) {
                    styleThumb();
                }
                tClick += 1;
                loadAllThumbnails();
            }
        }

        if (!isIgnoredAgainAgain) {
            if (!isIgnoredAgain) {
                if (!isIgnored) {
                    if (entry === true) {
                        advance(isLeftHalfClick);
                    }
                } else {
                    toggleThis();
                }
            }
        } else {
            toggleThis();
        }
        // ev.preventDefault();
    }

    // Add a click event listener to each element with class 'image-container'
    imageContainers.forEach(function(container, index) {
        container.addEventListener('click', function() {
            // Get the index of the clicked element among all elements with the class 'image-container'
            var clickedIndex = Array.from(imageContainers).indexOf(container);

            // clicking any thumbnail exits featured mode
            setFeaturedMode(false);

            info = false;
            var targetNumber = clickedIndex;

            var shiftedArray = shiftArrayToNumber(slideArr, targetNumber);
            slideArr = shiftedArray;
            t = targetNumber - 1;

            // Position slides BEFORE showing container (prevents layout shift on mobile)
            slider(true, true);
            counter();

            // Show container after slides are positioned
            slideContainer.style.display = "block";
            infoContainer.style.display = "none";
            if (width < 1200) {
                chatter.style.display = "none";
                chatterM.style.display = "block";
            }
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

    const appendCurrentTimeAndDate = () => {
        const now = new Date();
        const options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        };

        const formattedTimeAndDate = now.toLocaleString(undefined, options);
        const timexElement = document.getElementById('timex');

        if (timexElement) {
            timexElement.textContent = formattedTimeAndDate;
        }
    };

   setInterval(function() {
       appendCurrentTimeAndDate();
   }, 1000)
   
    let preventZoom = function(event) {
        event.preventDefault();
    };
    document.getElementById('slideshow').addEventListener('touchmove', preventZoom, { passive: false });

    document.getElementById('slideshow').addEventListener("touchend", function(event) {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    });
});
