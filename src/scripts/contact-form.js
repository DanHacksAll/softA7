const form = document.getElementById("contactForm");
if (!form) return;

const submitBtn = document.getElementById("submitBtn");
const successMsg = document.getElementById("formSuccess");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";

  const formData = new FormData(form);

  try {
    const res = await fetch("/api/sendmail", {
      method: "POST",
      body: formData
    });

    const result = await res.json();

    if (res.ok && result.success) {
      form.reset();
      successMsg.style.display = "block";
    } else {
      alert("Error sending message");
    }
  } catch (err) {
    console.error(err);
    alert("Network error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Send";
  }
});
