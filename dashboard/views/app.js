const PanelButton = document.querySelector(".PanelButton");
const PanelsBar = document.querySelector(".Pnav");
const ExitButton = document.querySelector(".Pnav a");

PanelButton.addEventListener("click", () => {
    PanelsBar.style.display = "block"
});

ExitButton.addEventListener("click", () => {
    PanelsBar.style.display = "none"
});
