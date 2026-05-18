const form = document.getElementById("contactForm");
const submitBtn = document.getElementById("submitBtn");
const statusMsg = document.getElementById("formStatus");

if (!form || !submitBtn || !statusMsg) {
  console.warn("Contact form script could not initialize: missing form elements.");
} else {
  function showStatus(text, success = true) {
    statusMsg.textContent = text;
    statusMsg.style.display = "block";
    statusMsg.style.color = success ? "#0b8" : "#e00";
  }

  function clearStatus() {
    statusMsg.textContent = "";
    statusMsg.style.display = "none";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearStatus();

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    const formData = new FormData(form);

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        body: formData
      });

      const result = await res.json();

      if (res.ok && result.success) {
        form.reset();
        showStatus("✔️ Mensaje enviado correctamente.", true);
      } else {
        showStatus(result.error || "Error enviando mensaje.", false);
      }
    } catch (err) {
      console.error(err);
      showStatus("Error de red. Intenta de nuevo.", false);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send";
    }
  });
}
