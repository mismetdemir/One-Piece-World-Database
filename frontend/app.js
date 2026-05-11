const characterList = document.getElementById("characterList");
const characterForm = document.getElementById("characterForm");

async function fetchCharacters() {
  const response = await fetch("/api/characters");
  const characters = await response.json();

  characterList.innerHTML = "";

  characters.forEach((character) => {
    const card = document.createElement("div");
    card.className = "character-card";

    card.innerHTML = `
      <h3>${character.name}</h3>
      <p><strong>Affiliation:</strong> ${character.affiliation}</p>
      <p><strong>Bounty:</strong> ${character.bounty || 0}</p>
      <p><strong>Status:</strong> ${character.status || "Unknown"}</p>
      <button onclick="deleteCharacter(${character.id})">Delete</button>
    `;

    characterList.appendChild(card);
  });
}

characterForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const newCharacter = {
    name: document.getElementById("name").value,
    affiliation: document.getElementById("affiliation").value,
    bounty: Number(document.getElementById("bounty").value),
    status: document.getElementById("status").value
  };

  const response = await fetch("/api/characters", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newCharacter)
  });

  if (!response.ok) {
    const error = await response.json();
    alert(error.message);
    return;
  }

  characterForm.reset();
  fetchCharacters();
});

async function deleteCharacter(id) {
  await fetch(`/api/characters/${id}`, {
    method: "DELETE"
  });

  fetchCharacters();
}

fetchCharacters();