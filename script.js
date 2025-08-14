const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");
const generateBtn = document.getElementById("generateBtn");
const palette = document.getElementById("palette");

let uploadedImage = null;

imageInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImage.src = e.target.result;
            previewImage.style.display = "block";
            uploadedImage = previewImage;
        };
        reader.readAsDataURL(file);
    }
});

generateBtn.addEventListener("click", function () {
    if (!uploadedImage) {
        alert("Please upload an image first!");
        return;
    }
    const colorThief = new ColorThief();

    if (uploadedImage.complete) {
        generatePalette(colorThief);
    } else {
        uploadedImage.addEventListener("load", function () {
            generatePalette(colorThief);
        });
    }
});

function generatePalette(colorThief) {
    let colors = colorThief.getPalette(uploadedImage, 10);

    // Remove duplicate colors
    colors = colors.filter(
        (color, index, self) =>
            index === self.findIndex(c => c.join() === color.join())
    );

    palette.innerHTML = "";
    colors.forEach(color => {
        const hexCode = rgbToHex(color[0], color[1], color[2]);
        const card = document.createElement("div");
        card.classList.add("color-card");

        const box = document.createElement("div");
        box.classList.add("color-box");
        box.style.backgroundColor = hexCode;

        const code = document.createElement("div");
        code.classList.add("color-code");
        code.textContent = hexCode;

        card.appendChild(box);
        card.appendChild(code);
        palette.appendChild(card);
    });
}

function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }).join("");
}
