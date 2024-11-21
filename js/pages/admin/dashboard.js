"use strict";

const pollingTime = 5000;
let groupsWrapper;

window.addEventListener("DOMContentLoaded", function () {
  getGruppi()
    .then(loadGraphic)
    .catch((err) => {
      console.error(err);
      mostraAlert("errore", err);
    });

    groupsWrapper = this.document.getElementById("groupsWrapper");
});

function loadGraphic(groups) {
  console.log(groups);
  for (let i = 0; i < groups.length; i++) creaGruppo(groups[i]);
  setTimeout(updateGroups, pollingTime);
}

function creaGruppo(group) {
  // Crea il div principale con classe "content"
  const contentDiv = document.createElement("div");
  contentDiv.className = "content";
  contentDiv.id = group.id;

  // Crea la sezione "top"
  const topDiv = document.createElement("div");
  topDiv.className = "top";

  const groupDiv = document.createElement("div");
  const groupTitle = document.createElement("h2");
  groupTitle.id = group.id + "-nome";
  groupTitle.textContent = group.nome;

  const groupMembers = document.createElement("p");
  groupMembers.id = group.id + "-orientatori";
  let output = "";

  if (group.nomi_orientatori.length >= 2) {
    output = group.nomi_orientatori[0];
    let j;
    for (j = 1; j < group.nomi_orientatori.length; j++)
      output += " - " + group.nomi_orientatori[j];
  } else if (group.nomi_orientatori.length == 1)
    output = group.nomi_orientatori[j];

  groupMembers.textContent = output;

  groupDiv.appendChild(groupTitle);
  groupDiv.appendChild(groupMembers);

  const onTimeSpan = document.createElement("span");
  const details = getInOrario(group);
  onTimeSpan.id = group.id + "-ontime";
  onTimeSpan.className = details.classe;
  onTimeSpan.textContent = details.text;

  topDiv.appendChild(groupDiv);
  topDiv.appendChild(onTimeSpan);

  // Crea la sezione centrale
  const centralDiv = document.createElement("div");
  const labInfo = document.createElement("p");
  labInfo.id = group.id + "-aula";
  labInfo.textContent = group.aula.nome + " - " + group.aula.posizione;

  const subjectTitle = document.createElement("h1");
  subjectTitle.id = group.id + "-materia";
  subjectTitle.textContent = group.aula.materia;

  centralDiv.appendChild(labInfo);
  centralDiv.appendChild(subjectTitle);

  // Crea la sezione "bottom"
  const bottomDiv = document.createElement("div");
  bottomDiv.className = "bottom";

  const nextLabText = document.createElement("p");
  nextLabText.className = "next-lab";
  nextLabText.textContent = "Prossimo Laboratorio";

  const nextLabTitle = document.createElement("h2");
  nextLabTitle.id = group.id + "-materiaprossima";
  nextLabTitle.textContent = group.prossima_tappa.aula.materia;

  const nextLabInfo = document.createElement("p");
  nextLabInfo.id = group.id + "-aulaprossima";
  nextLabInfo.textContent =
    group.prossima_tappa.aula.nome +
    " - " +
    group.prossima_tappa.aula.posizione;

  bottomDiv.appendChild(nextLabText);
  bottomDiv.appendChild(nextLabTitle);
  bottomDiv.appendChild(nextLabInfo);

  // Aggiungi tutto al contenitore principale
  contentDiv.appendChild(topDiv);
  contentDiv.appendChild(centralDiv);
  contentDiv.appendChild(bottomDiv);

  // Aggiungi il contenitore principale al body o a un altro elemento della pagina
  groupsWrapper.appendChild(contentDiv);
}

function getInOrario(group) {
  if (group.prossima_tappa) {
    const hours = parseInt(group.orario_partenza.split(":")[0]);
    const minutes = parseInt(group.orario_partenza.split(":")[1]);

    const hoursTappa =
      (minutes + group.prossima_tappa.minuti_arrivo) / 60 + hours;
    const minutesTappa = (minutes + group.prossima_tappa.minuti_arrivo) % 60;

    var d = new Date();
    d.getHours();
    d.getMinutes();
    d.getSeconds();

    if (
      !group.arrivato &&
      (d.getHours > hoursTappa ||
        (d.getHours > hoursTappa && d.getMinutes > minutesTappa))
    ) {
      return {
        classe: "late",
        text: "IN RITARDO",
      };
    }
  }
  return {
    classe: "on-time",
    text: "IN ORARIO",
  };
}

function updateGroups() {
  console.log("Faccio Polling");

  getGruppi()
    .then((groups) => {
      for (let i = 0; i < groups.length; i++) updateInfo(groups[i]);
      setTimeout(updateGroups, pollingTime);
    })
    .catch((err) => {
      console.error(err);
      mostraAlert("errore", err);
    });
}

function updateInfo(group) {
  // Trova il div principale del gruppo esistente
  const contentDiv = document.getElementById(group.id);
  if (!contentDiv) {
    console.error(`Gruppo con ID ${group.id} non trovato.`);
    return;
  }

  // Aggiorna la sezione "top"
  const groupTitle = document.getElementById(group.id + "-nome");
  if (groupTitle) groupTitle.textContent = group.nome;

  const groupMembers = document.getElementById(group.id + "-orientatori");
  if (groupMembers) {
    let output = "";
    if (group.nomi_orientatori.length >= 2) {
      output = group.nomi_orientatori[0];
      for (let j = 1; j < group.nomi_orientatori.length; j++) {
        output += " - " + group.nomi_orientatori[j];
      }
    } else if (group.nomi_orientatori.length === 1) {
      output = group.nomi_orientatori[0];
    }
    groupMembers.textContent = output;
  }

  const onTimeSpan = document.getElementById(group.id + "-ontime");
  if (onTimeSpan) {
    const details = getInOrario(group);
    onTimeSpan.className = details.classe;
    onTimeSpan.textContent = details.text;
  }

  // Aggiorna la sezione centrale
  const labInfo = document.getElementById(group.id + "-aula");
  if (labInfo) {
    labInfo.textContent = group.aula.nome + " - " + group.aula.posizione;
  }

  const subjectTitle = document.getElementById(group.id + "-materia");
  if (subjectTitle) {
    subjectTitle.textContent = group.aula.materia;
  }

  // Aggiorna la sezione "bottom"
  const nextLabTitle = document.getElementById(group.id + "-materiaprossima");
  if (nextLabTitle) {
    nextLabTitle.textContent = group.prossima_tappa.aula.materia;
  }

  const nextLabInfo = document.getElementById(group.id + "-aulaprossima");
  if (nextLabInfo) {
    nextLabInfo.textContent =
      group.prossima_tappa.aula.nome +
      " - " +
      group.prossima_tappa.aula.posizione;
  }
}
