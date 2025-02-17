"use strict";

let data = null;
let graph;

window.addEventListener("DOMContentLoaded", function () {
  caricaDatiOrientati();
});

function caricaDatiOrientati() {
  graph = document.getElementById("chart-ritardo");

  vallauriRequest(`${serverUrl}admin/dashboard/orientati/statistiche`, "GET", {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  })
    .then((response) => {
      console.log(response);

      const flexOrientati = document.getElementById("output-orientati");

      let div = document.createElement("div");
      div.id = "orientatiTotali";
      div.textContent = "TOTALI: " + response.totali;
      flexOrientati.appendChild(div);

      div = document.createElement("div");
      div.id = "orientatiPresenti";
      div.textContent = "PRESENTI: " + response.presenti;
      flexOrientati.appendChild(div);

      div = document.createElement("div");
      div.id = "orientatiAssenti";
      div.textContent = "ASSENTI: " + response.assenti;
      flexOrientati.appendChild(div);
    })
    .catch((err) => {
      console.error(err);
    });

  vallauriRequest(`${serverUrl}admin/dashboard/gruppi/statistiche`, "GET", {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  })
    .then((response) => {
      getGroupsData(response.gruppi);
    })
    .catch((err) => {
      console.error(err);
    });
}

function getGroupsData(dataRaw) {
    console.log(dataRaw);
    if (dataRaw != null) {
        const labels = []; // Etichette (es. nomi dei gruppi)
        const datasetData = []; // Valori (es. ritardi in minuti)

        for (let i = 0; i < dataRaw.length; i++) {
            let ritardoInMin = getMinutes(
                dataRaw[i].orario_partenza,
                dataRaw[i].orario_partenza_effettivo
            );
            if (ritardoInMin != null) {
                labels.push(dataRaw[i].nome); // Aggiungi il nome del gruppo
                datasetData.push(ritardoInMin); // Aggiungi il valore di ritardo
            }
        }

        const chart = new Chart(graph, {
            type: "bar",
            data: {
                labels: labels, // Asse X
                datasets: [
                    {
                        label: "Ritardo gruppi (in minuti)", // Nome del dataset
                        data: datasetData, // Asse Y
                        backgroundColor: "rgba(75, 192, 192, 0.2)", // Colore riempimento barre
                        borderColor: "rgba(75, 192, 192, 1)", // Colore bordo barre
                        borderWidth: 1, // Spessore bordo
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true, // Il grafico parte da 0
                    },
                },
            },
        });
    } else {
        data = null;
    }
}

function getMinutes(fine, fineEff) {
  let data = new Date();
  data.setHours(parseInt(fine.split(":")[0]));
  data.setMinutes(parseInt(fine.split(":")[1]));
  try {
    let minutes = parseInt(fine.split(":")[1]);
    let ore = parseInt(fine.split(":")[0]);

    let minutesEff = parseInt(fineEff.split(":")[1]);
    let oreEff = parseInt(fineEff.split(":")[0]);

    if (oreEff > ore) {
      return minutesEff + (60 - minutes);
    } else if (minutesEff > minutes) {
      return minutesEff - minutes;
    } else return 0;
  } catch {
    return null;
  }
}
