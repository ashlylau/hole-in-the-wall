/** Set up webcam */
var canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    video = document.getElementById('video'),
    vendorUrl = window.URL || window.webkitURL;

navigator.getMedia =    navigator.getUserMedia || 
                        navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia ||
                        navigator.msGetUserMedia;

navigator.getMedia({
    video: true,
    audio: false
}, function(stream) {
    video.srcObject = stream;
    video.play();
}, function(error) {
    // An error occured
    // error.code
});

/** Start game */
document.getElementById("start").addEventListener("click", function() {
    displayCountdown();
    setTimeout(() => {
        takeScreenshot();
    }, 4000);
});

/** Take screenshot */
document.getElementById("snap").addEventListener("click", function() {
    takeScreenshot();
});


function takeScreenshot() {
    context.drawImage(video, 0, 0, 800, 600);
    segmentImage();
}

async function segmentImage() {
    const img = document.getElementById('canvas');

    const net = await bodyPix.load();
    const segmentation = await net.segmentMultiPersonParts(img);

    console.log(segmentation);

    // The mask image is an binary mask image with a 1 where there is a person and
    // a 0 where there is not.
    const coloredPartImage = bodyPix.toColoredPartMask(segmentation);

    console.log(img);
    const opacity = 0.5;
    const flipHorizontal = false;
    const maskBlurAmount = 0;
    // Draw the mask image on top of the original image onto a canvas.
    // The colored part image will be drawn semi-transparent, with an opacity of
    // 0.7, allowing for the original image to be visible under.
    bodyPix.drawMask(
        canvas, img, coloredPartImage, opacity, maskBlurAmount,
        flipHorizontal);
}

function displayCountdown() {
    document.querySelector("#start").disabled = true;

    var countDown = 3;

    var t = setInterval(function() {
        if (countDown <= 0) {
          document.querySelector("#start").disabled = false;
          clearInterval(t);
        }
        document.getElementById('timer').innerHTML = countDown;
        countDown -= 1;
      }, 1000);
}