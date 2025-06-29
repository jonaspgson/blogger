<script>
  document.addEventListener("DOMContentLoaded", function() {
    if (location.pathname === "/" || location.pathname === "/index.html") {
      const titles = document.querySelectorAll(".post-title a");
      titles.forEach(link => {
        const original = link.textContent;
        const cutoff = original.indexOf(":");
        if (cutoff !== -1) {
          link.textContent = original.substring(0, cutoff);
        }
      });
    }
  });
</script>
