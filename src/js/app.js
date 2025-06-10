const API_URL = "http://localhost:7070/?method=allTickets";
let editingId = null;
let deleteId = null;

document.getElementById("addBtn").addEventListener("click", () => {
  editingId = null;
  document.getElementById("ticket-name").value = "";
  document.getElementById("ticket-desc").value = "";
  document.getElementById("modal-title").textContent = "Новый тикет";
  document.getElementById("modal").style.display = "flex";
});

document.getElementById("saveBtn").addEventListener("click", async () => {
  const name = document.getElementById("ticket-name").value;
  const description = document.getElementById("ticket-desc").value;
  const body = JSON.stringify({ name, description, status: false });

  if (editingId) {
    await fetch(`${API_URL}?method=updateById&id=${editingId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
  } else {
    await fetch(`${API_URL}?method=createTicket`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
  }
  closeModal();
  loadTickets();
});

async function loadTickets() {
  const res = await fetch(`${API_URL}?method=allTickets`);
  const tickets = await res.json();
  const container = document.getElementById("tickets");
  container.innerHTML = "";
  tickets.forEach((ticket) => {
    const div = document.createElement("div");
    div.className = "ticket" + (ticket.status ? " done" : "");
    div.innerHTML = `
      <span class="name" onclick="toggleDesc('${ticket.id}')">${ticket.name}</span>
      <div class="actions">
        <button onclick="toggleStatus('${ticket.id}', ${ticket.status})">✔️</button>
        <button onclick="editTicket('${ticket.id}')">✎</button>
        <button onclick="confirmDelete('${ticket.id}')">❌</button>
      </div>
    `;
    container.appendChild(div);
  });
}

async function toggleDesc(id) {
  const res = await fetch(`${API_URL}?method=ticketById&id=${id}`);
  const ticket = await res.json();
  alert(ticket.description);
}

async function toggleStatus(id, currentStatus) {
  await fetch(`${API_URL}?method=updateById&id=${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: !currentStatus }),
  });
  loadTickets();
}

async function editTicket(id) {
  editingId = id;
  const res = await fetch(`${API_URL}?method=ticketById&id=${id}`);
  const ticket = await res.json();
  document.getElementById("ticket-name").value = ticket.name;
  document.getElementById("ticket-desc").value = ticket.description;
  document.getElementById("modal-title").textContent = "Редактировать тикет";
  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function confirmDelete(id) {
  deleteId = id;
  document.getElementById("confirm").style.display = "flex";
}

function closeConfirm() {
  document.getElementById("confirm").style.display = "none";
}

document.getElementById("confirmYes").addEventListener("click", async () => {
  await fetch(`${API_URL}?method=deleteById&id=${deleteId}`);
  closeConfirm();
  loadTickets();
});

window.closeModal = closeModal;
window.toggleDesc = toggleDesc;
window.toggleStatus = toggleStatus;
window.editTicket = editTicket;
window.confirmDelete = confirmDelete;
window.closeConfirm = closeConfirm;

loadTickets();
