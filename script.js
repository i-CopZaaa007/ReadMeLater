const form = document.getElementById("add-form");
const listDiv = document.getElementById("link-list");

let editingIndex = null;

function getData() {
  return JSON.parse(localStorage.getItem("readme-links") || "[]");
}

function saveData(data) {
  localStorage.setItem("readme-links", JSON.stringify(data));
}

function renderLinks() {
  const links = getData();
  listDiv.innerHTML = "";

  links.forEach((link, index) => {
    const card = document.createElement("div");
    card.className = "link-card";
    card.innerHTML = `
      <div class="link-content">
        <strong>${link.title}</strong>
        <em>${link.tags}</em>
        <p>${link.note}</p>
      </div>
      <div class="link-actions">
        <button onclick="markRead(${index})">${link.read ? "Read" : "Unread"}</button>
        <button onclick="editLink(${index})">Edit</button>
        <button onclick="deleteLink(${index})">Delete</button>
        <button onclick="gotoLink('${link.url}')">Go to Site</button>
      </div>
    `;
    listDiv.appendChild(card);
  });

  form.querySelector("button").textContent = editingIndex !== null ? "Save Edit" : "Add";
}

function gotoLink(url) {
  window.open(url, "_blank");
}

function markRead(index) {
  const links = getData();
  links[index].read = !links[index].read;
  saveData(links);
  renderLinks();
}

function deleteLink(index) {
  const links = getData();
  links.splice(index, 1);
  saveData(links);
  renderLinks();
}

function editLink(index) {
  const links = getData();
  const link = links[index];
  form.title.value = link.title;
  form.url.value = link.url;
  form.tags.value = link.tags.split(" ");
  form.note.value = link.note;
  editingIndex = index;
  renderLinks();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const links = getData();

  const newLink = {
    title: form.title.value,
    url: form.url.value,
    tags: form.tags.value,
    note: form.note.value,
    read: false,
  };

  if (editingIndex !== null) {
    newLink.read = links[editingIndex].read;
    links[editingIndex] = newLink;
    editingIndex = null;
  } else {
    links.push(newLink);
  }

  saveData(links);
  form.reset();
  renderLinks();
});

renderLinks();
