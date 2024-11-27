const upload = document.getElementById('upload'); // File input for image upload
const generate = document.getElementById('generate'); // Generate button
const watermarkTextInput = document.getElementById('watermarkText'); // Watermark text input
const opacitySlider = document.getElementById('opacitySlider'); // Slider for opacity
const opacityValueDisplay = document.getElementById('opacityValue'); // Display for current opacity value
const canvas = document.getElementById('canvas'); // Canvas for drawing
const context = canvas.getContext('2d'); // 2D drawing context for the canvas
const result = document.getElementById('result'); // Image element for displaying result
const download = document.getElementById('download'); // Download link
const info = document.getElementById('info'); // Info section for image details
let img; // Variable to store the uploaded image

// Event listener for file upload
upload.addEventListener('change', function() {
    const file = this.files[0]; // Get the uploaded file
    const reader = new FileReader(); // Create a FileReader object

    // When the file is loaded
    reader.onload = function(e) {
        img = new Image(); // Create a new Image object
        img.src = e.target.result; // Set the image source to the file data

        img.onload = function() {
            // Set canvas dimensions to match the image
            canvas.width = img.width;
            canvas.height = img.height;
            // Draw the image on the canvas
            context.drawImage(img, 0, 0);

            // Show the Generate button
            generate.style.display = 'block';

            // Display image dimensions and size
            const sizeInKB = (file.size / 1024).toFixed(2);
            info.innerHTML = `Image Dimensions: ${img.width} x ${img.height}px<br>Image Size: ${sizeInKB} KB`;
        };
    };
    reader.readAsDataURL(file); // Read the uploaded file as a data URL
});

// Event listener for the opacity slider
opacitySlider.addEventListener('input', function() {
    const opacityValue = parseFloat(this.value).toFixed(1); // Get the slider value and format it
    opacityValueDisplay.innerText = `Opacity: ${opacityValue}`; // Display the current opacity value
    generateWatermark(opacityValue); // Generate the watermark with the new opacity
});

// Function to generate the watermark
function generateWatermark(opacityValue) {
    if (!img) return; // Ensure the image is loaded

    // Clear previous watermarks
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0); // Redraw the image

    // Get custom watermark text; default to 'Watermark' if input is empty
    const watermarkText = watermarkTextInput.value || 'Watermark'; 
    context.font = '30px Arial'; // Set font style for watermark
    context.fillStyle = `rgba(255, 255, 255, ${opacityValue})`; // Set watermark color with opacity
    context.textAlign = 'center'; // Center text alignment

    const spacing = 150; // Distance between repeating watermarks
    const angle = -Math.PI / 4; // Angle for diagonal rotation

    // Calculate how many watermarks to draw
    const numX = Math.ceil(canvas.width / spacing);
    const numY = Math.ceil(canvas.height / spacing);

    // Draw the watermarks
    for (let i = 0; i < numX; i++) {
        for (let j = 0; j < numY; j++) {
            context.save(); // Save the current context state