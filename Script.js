const detalhes = document.getElementById("detalhes");

document
  .getElementById("openModal")
  .addEventListener("click", () => {
      detalhes.classList.add("active");
  });

document
  .getElementById("fecharModal")
  .addEventListener("click", () => {
      detalhes.classList.remove("active");
  });

detalhes.addEventListener("click", (e) => {
    if (e.target === detalhes) {
        modal.classList.remove("active");
    }
});