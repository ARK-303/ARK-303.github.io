document.addEventListener("DOMContentLoaded", () => {
  const progressBar = document.getElementById("progressBar");
  const tocToggle = document.getElementById("tocToggle");
  const sidebarOverlay = document.getElementById("sidebarOverlay");
  const articleSidebar = document.getElementById("articleSidebar");
  const postContent = document.getElementById("postContent");
  const tocList = document.getElementById("tocList");

  const closeSidebar = () => {
    document.body.classList.remove("sidebar-open");
  };

  if (tocToggle) {
    tocToggle.addEventListener("click", () => {
      document.body.classList.toggle("sidebar-open");
    });
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", closeSidebar);
  }

  if (articleSidebar) {
    articleSidebar.querySelectorAll(".toc a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 980) closeSidebar();
      });
    });
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) closeSidebar();
  });

  if (progressBar) {
    const updateProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();
  }

  if (postContent && tocList) {
    const headings = Array.from(postContent.querySelectorAll("h2, h3"));

    tocList.innerHTML = "";

    const slugify = (text, index) => {
      const base = text
        .trim()
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
        .replace(/^-+|-+$/g, "");
      return base || `section-${index + 1}`;
    };

    headings.forEach((heading, index) => {
      if (!heading.id) heading.id = slugify(heading.textContent || "", index);

      const link = document.createElement("a");
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent || "";
      link.className = heading.tagName === "H3" ? "toc-level-3" : "toc-level-2";
      tocList.appendChild(link);
    });

    const tocLinks = Array.from(tocList.querySelectorAll("a"));

    const setActive = (id) => {
      tocLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length) setActive(visible[0].target.id);
      },
      {
        root: null,
        threshold: 0.01,
        rootMargin: "-20% 0px -65% 0px",
      }
    );

    headings.forEach((heading) => observer.observe(heading));
  }
});