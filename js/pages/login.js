"use strict";

window.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("formLogin");
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        event.stopPropagation();
        login(
            document.getElementById("txtUsername").value.trim(),
            document.getElementById("txtPassword").value.trim()
        )
            .then((response) => {
                location.href = "pages/dashboard.html";
            })
            .catch((err) => {
                console.error(err);
                mostraAlert("errore", err);
            });
    });
});
