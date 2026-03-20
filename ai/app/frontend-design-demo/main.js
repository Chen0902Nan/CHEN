const root = document.documentElement;
const glow = document.querySelector(".cursor-glow");
const revealItems = document.querySelectorAll("[data-reveal]");
const counters = document.querySelectorAll("[data-count]");
const liveClock = document.querySelector("#liveClock");

const setPointerPosition = (x, y) => {
  const xPercent = `${(x / window.innerWidth) * 100}%`;
  const yPercent = `${(y / window.innerHeight) * 100}%`;

  root.style.setProperty("--pointer-x", xPercent);
  root.style.setProperty("--pointer-y", yPercent);

  if (glow) {
    glow.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
  }
};

window.addEventListener("pointermove", (event) => {
  setPointerPosition(event.clientX, event.clientY);
});

setPointerPosition(window.innerWidth * 0.22, window.innerHeight * 0.18);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -8% 0px",
  },
);

revealItems.forEach((item) => observer.observe(item));

const animateCounter = (element) => {
  const target = Number(element.dataset.count || 0);
  const duration = 1200;
  const start = performance.now();

  const step = (timestamp) => {
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = String(Math.round(target * eased));

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };

  window.requestAnimationFrame(step);
};

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.6 },
);

counters.forEach((counter) => counterObserver.observe(counter));

const updateClock = () => {
  if (!liveClock) {
    return;
  }

  const time = new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());

  liveClock.textContent = time;
};

updateClock();
window.setInterval(updateClock, 1000);
