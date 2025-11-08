function setupJDManagement() {
  const jdForm = document.querySelector("#jdForm");
  const jdList = document.querySelector("#jdList");
  const uploadBtn = document.querySelector("#jdUploadBtn");
  const uploadInput = document.querySelector("#jdUploadInput");
  if (!jdForm || !jdList) return;

  const render = () => {
    const jds = getStoredData(STORAGE_KEYS.jds) || [];
    if (!jds.length) {
      jdList.innerHTML = `<div class="empty-state"><strong>No job descriptions yet.</strong> Add one using the form above.</div>`;
      return;
    }

    jdList.innerHTML = jds
      .map(
        (jd) => `
        <article class="jd-card" data-id="${jd.id}">
          <div>
            <h3>${jd.title}</h3>
            <div class="chip-group">
              <span class="pill">${jd.department}</span>
              <span class="pill">${jd.location}</span>
              <span class="pill">Created ${jd.createdAt}</span>
            </div>
          </div>
          <p>${jd.description}</p>
          <div>
            <strong>Keywords:</strong>
            <div class="chip-group">
              ${jd.keywords.map((kw) => `<span class="tag">${kw}</span>`).join("")}
            </div>
          </div>
          <div class="jd-actions">
            <button class="btn btn-outline" data-action="edit">Edit</button>
            <button class="btn btn-danger" data-action="delete">Delete</button>
          </div>
        </article>
      `
      )
      .join("");
  };

  render();

  jdForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(jdForm);
    const jd = {
      id: formData.get("jdId") || `jd-${crypto.randomUUID().slice(0, 6)}`,
      title: formData.get("title"),
      department: formData.get("department"),
      location: formData.get("location"),
      createdAt: new Date().toISOString().slice(0, 10),
      keywords: formData
        .get("keywords")
        .split(",")
        .map((kw) => kw.trim())
        .filter(Boolean),
      description: formData.get("description"),
    };

    const jds = getStoredData(STORAGE_KEYS.jds) || [];
    const existingIndex = jds.findIndex((item) => item.id === jd.id);
    if (existingIndex >= 0) {
      jds[existingIndex] = jd;
    } else {
      jds.push(jd);
    }
    setStoredData(STORAGE_KEYS.jds, jds);
    refreshCandidateMatches(jd.id);
    jdForm.reset();
    jdForm.querySelector("[name='jdId']").value = "";
    render();
    // Events are automatically dispatched by setStoredData and refreshCandidateMatches
  });

  jdForm.addEventListener("reset", () => {
    setTimeout(() => jdForm.querySelector("[name='jdId']").value = "", 0);
  });

  jdList.addEventListener("click", (event) => {
    const action = event.target.dataset.action;
    const card = event.target.closest(".jd-card");
    if (!action || !card) return;
    const jdId = card.dataset.id;
    const jds = getStoredData(STORAGE_KEYS.jds) || [];

    if (action === "edit") {
      const jd = jds.find((item) => item.id === jdId);
      if (!jd) return;
      jdForm.querySelector("[name='jdId']").value = jd.id;
      jdForm.querySelector("[name='title']").value = jd.title;
      jdForm.querySelector("[name='department']").value = jd.department;
      jdForm.querySelector("[name='location']").value = jd.location;
      jdForm.querySelector("[name='keywords']").value = jd.keywords.join(", ");
      jdForm.querySelector("[name='description']").value = jd.description;
      jdForm.scrollIntoView({ behavior: "smooth" });
    }

    if (action === "delete") {
      const filtered = jds.filter((item) => item.id !== jdId);
      setStoredData(STORAGE_KEYS.jds, filtered);
      render();
      // Event is automatically dispatched by setStoredData
    }
  });

  if (uploadBtn && uploadInput) {
    uploadBtn.addEventListener("click", () => uploadInput.click());
    uploadInput.addEventListener("change", (event) => {
      if (!event.target.files.length) return;
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        jdForm.querySelector("[name='description']").value = reader.result;
      };
      reader.readAsText(file);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (!document.body.classList.contains("jd-page")) return;
  setupJDManagement();
});

