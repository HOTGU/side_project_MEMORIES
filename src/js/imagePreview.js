const img = document.querySelector("img");
const imgFile = document.querySelector("input[name=thumbnail]");
const fileName = document.getElementById("js-fileName");

imgFile.style.display = "none";

const paintFileName = (file) => {
    fileName.innerHTML = "";
    const span = document.createElement("span");
    span.innerText = `파일이름: ${file.name}`;
    fileName.appendChild(span);
};

const paintPreview = (file) => {
    const previousBlob = img.src;
    URL.revokeObjectURL(previousBlob);
    const blob = URL.createObjectURL(file);
    img.src = blob;
};

const handleChange = (e) => {
    const files = e.target.files;
    const file = files[0];
    paintFileName(file);
    paintPreview(file);
};

img.addEventListener("click", () => imgFile.click());
imgFile.addEventListener("change", handleChange);
