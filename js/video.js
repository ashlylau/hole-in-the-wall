async function loadModel() {
    const net = await bodyPix.load(/** optional arguments, see below **/);

    console.log('here');
}

async function getSegmentedImage(img) {
    const net = await bodyPix.load(/** optional arguments, see below **/);

    const segmentation = await net.segmentPerson(img);
    const array = segmentation.data;
    console.log(array.includes(0));
    console.log(array.includes(1));
    console.log(segmentation.data);

    return segmentation;
}

function drawImage(img, segmentation) {
    // The mask image is an binary mask image with a 1 where there is a person and
    // a 0 where there is not.
    const coloredPartImage = bodyPix.toMask(segmentation);
    const opacity = 0.7;
    const flipHorizontal = false;
    const maskBlurAmount = 0;
    const canvas = document.getElementById('canvas');
    // Draw the mask image on top of the original image onto a canvas.
    // The colored part image will be drawn semi-transparent, with an opacity of
    // 0.7, allowing for the original image to be visible under.
    bodyPix.drawMask(
        canvas, img, coloredPartImage, opacity, maskBlurAmount,
        flipHorizontal);
}

/**
 * Draw an image on a canvas
 */
function renderImageToCanvas(image, size, canvas) {
    canvas.width = size[0];
    canvas.height = size[1];
    const ctx = canvas.getContext('2d');
  
    ctx.drawImage(image, 0, 0);
}

/**
 * Converts an array of pixel data into an ImageData object
 */
async function renderToCanvas(a, ctx) {
    // const [height, width] = a.shape;
    const width = 400;
    const height = 300;
    const imageData = new ImageData(width, height);
  
    // const data = await a.data();
    const data = a;
  
    for (let i = 0; i < height * width; ++i) {
      const j = i * 4;
      const k = i * 3;
  
      imageData.data[j + 0] = data[k + 0];
      imageData.data[j + 1] = data[k + 1];
      imageData.data[j + 2] = data[k + 2];
      imageData.data[j + 3] = 255;
    }
  
    ctx.putImageData(imageData, 0, 0);
}

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

loadModel();

/** Take screenshot */
document.getElementById("snap").addEventListener("click", function() {
    context.drawImage(video, 0, 0, 400, 300);

    segmentImage();
});

async function segmentImage() {
    const img = document.getElementById('canvas');

    const net = await bodyPix.load();
    const segmentation = await net.segmentPerson(img);

    // const segmentation = getSegmentedImage(img);

    // renderToCanvas(array, context);
    // drawImage(img, segmentation)

    // The mask image is an binary mask image with a 1 where there is a person and
    // a 0 where there is not.
    const coloredPartImage = bodyPix.toMask(segmentation);
    const opacity = 0.7;
    const flipHorizontal = false;
    const maskBlurAmount = 0;
    const canvas = document.getElementById('canvas');
    // Draw the mask image on top of the original image onto a canvas.
    // The colored part image will be drawn semi-transparent, with an opacity of
    // 0.7, allowing for the original image to be visible under.
    bodyPix.drawMask(
        canvas, img, coloredPartImage, opacity, maskBlurAmount,
        flipHorizontal);
}
