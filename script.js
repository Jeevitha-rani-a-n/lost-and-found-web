document.addEventListener("DOMContentLoaded", () => {
    const backendUrl = "http://localhost:3000";
    const reportForm = document.getElementById("reportForm");
    const adminLoginForm = document.getElementById("adminLoginForm");
  
    if (reportForm) {
      reportForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(reportForm);
        const data = Object.fromEntries(formData.entries());
  
        await fetch("http://localhost:3000/report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        
    alert("Item reported!");
    reportForm.reset();
        
    });
    }
  
    if (adminLoginForm) {
      adminLoginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = adminLoginForm.username.value;
        const password = adminLoginForm.password.value;
  
        if (username === "admin" && password === "pass123$") {
          window.location.href = "admin-dashboard.html";
        } else {
          alert("Incorrect credentials!");
        }
      });
    }
  });

  const backendUrl = "http://localhost:3000"; // Change if hosted

  // Admin dashboard load
  async function loadReportedItems() {
    const container = document.getElementById("reportedItems");
    if (!container) return;
  
    const res = await fetch(`${backendUrl}/items`);
    const items = await res.json();
  
    if (items.length === 0) {
      container.innerHTML = "<p>No lost items reported yet.</p>";
      return;
    }
  
    container.innerHTML = ""; // Clear placeholder
  
    items.forEach((item) => {
      const card = document.createElement("div");
      card.className = "item-card";
      card.innerHTML = `
  <h3>${item.item}</h3>
  <p><strong>Reported by:</strong> ${item.reporter}</p>
  <p><strong>Email:</strong> ${item.email}</p>
  <p><strong>Phone:</strong> ${item.phone}</p>
  <p><strong>Description:</strong> ${item.description}</p>
  <p><strong>Status:</strong> ${item.retrieved ? "✅ Retrieved" : "❌ Not Retrieved"}</p>
  ${
    !item.retrieved
      ? `
        <button onclick="contactUser('${item._id}')">📩 Contact</button>
        <button onclick="markRetrieved('${item._id}')">✅ Mark as Retrieved</button>
      `
      : ""
  }
  <button onclick="deleteItem('${item._id}')">🗑️ Delete</button>
  <hr/>
`;

      container.appendChild(card);
    });
  }
  
  async function markRetrieved(id) {
    await fetch(`${backendUrl}/mark-retrieved/${id}`, {
      method: "PUT",
    });
    alert("Marked as Retrieved!");
    loadReportedItems();
  }
  
  async function deleteItem(id) {
    const confirmed = confirm("Are you sure you want to delete this item?");
    if (!confirmed) return;
  
    await fetch(`${backendUrl}/delete/${id}`, {
      method: "DELETE",
    });
    alert("Item deleted.");
    loadReportedItems();
  }

  async function contactUser(id) {
    const res = await fetch(`${backendUrl}/contact/${id}`, {
      method: "POST",
    });
  
    if (res.ok) {
      alert("Message sent to the reporter's phone 📱");
    } else {
      alert("Failed to send the message.");
    }
  }
  
  
  window.addEventListener("DOMContentLoaded", loadReportedItems);
  
  