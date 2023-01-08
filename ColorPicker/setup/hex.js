const hex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"];
const btn = document.getElementById("btn");
const color = document.querySelector(".color");

btn.addEventListener("click", () => {
    let arr = ['#']
    for (let i = 0; i < 6; i++) {
        arr.push(hex[Math.floor(Math.random()*hex.length)]);
    }
    colorCode = arr.join("");
    document.body.style.backgroundColor = colorCode;
    color.textContent = colorCode;
});

