/* AIE401 Workshop 1, shared behaviour: header, theme, storage, toast, copy, timer, confetti. */
(function () { try { var t = localStorage.getItem("aie401-theme"); if (t === "light" || t === "dark") document.documentElement.setAttribute("data-theme", t); } catch (e) {} })();

const AIE = {
  root: document.currentScript ? document.currentScript.src.replace(/assets\/site\.js.*$/, "") : "../",
  get(k, d) { try { const v = localStorage.getItem("aie401-" + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem("aie401-" + k, JSON.stringify(v)); } catch (e) {} },
  esc(s) { return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); },
  shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; },
  toast(msg) {
    let t = document.getElementById("toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("show"); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 2200);
  },
  async copy(text, msg) {
    try { await navigator.clipboard.writeText(text); }
    catch (e) { const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove(); }
    AIE.toast(msg || "Copied to clipboard");
  },
  download(name, text) {
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type: "text/plain" })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  },
  confetti() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = document.createElement("canvas"); c.className = "confetti"; document.body.appendChild(c);
    const x = c.getContext("2d"); c.width = innerWidth; c.height = innerHeight;
    const cols = ["#57b29f", "#008da5", "#003e66", "#99d0c5", "#ffdd00"];
    const P = Array.from({ length: 140 }, () => ({ x: Math.random() * c.width, y: -20 - Math.random() * c.height * .4, r: 4 + Math.random() * 5, c: cols[Math.floor(Math.random() * cols.length)], vy: 2 + Math.random() * 3, vx: -1.5 + Math.random() * 3, a: Math.random() * 6 }));
    let f = 0; (function draw() { x.clearRect(0, 0, c.width, c.height); P.forEach(p => { p.y += p.vy; p.x += p.vx; p.a += .1; x.fillStyle = p.c; x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); x.restore(); }); if (++f < 170) requestAnimationFrame(draw); else c.remove(); })();
  },
  beep() { try { const a = new (window.AudioContext || window.webkitAudioContext)(); [0, .25, .5].forEach(t => { const o = a.createOscillator(), g = a.createGain(); o.frequency.value = 880; o.connect(g); g.connect(a.destination); g.gain.setValueAtTime(.15, a.currentTime + t); o.start(a.currentTime + t); o.stop(a.currentTime + t + .15); }); } catch (e) {} },
  fmt(s) { const neg = s < 0; s = Math.abs(Math.round(s)); return (neg ? "+" : "") + Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); },
  /* Countdown timer bound to an element: AIE.timer(el, barEl, onEnd) */
  timer(el, bar, onEnd) {
    const T = { total: 0, left: 0, run: false, h: null,
      set(sec) { this.stop(); this.total = this.left = sec; this.paint(); },
      start() { if (this.run || this.total <= 0) return; this.run = true; let last = Date.now(); this.h = setInterval(() => { const n = Date.now(); this.left -= (n - last) / 1000; last = n; if (this.left <= 0 && !this.ended) { this.ended = true; AIE.beep(); onEnd && onEnd(); } this.paint(); }, 250); },
      stop() { this.run = false; clearInterval(this.h); },
      reset() { this.stop(); this.ended = false; this.left = this.total; this.paint(); },
      paint() { el.textContent = AIE.fmt(this.left); el.classList.toggle("warn", this.left > 0 && this.left <= 60); el.classList.toggle("over", this.left <= 0); if (bar) bar.style.width = (this.total ? Math.min(100, (1 - Math.max(0, this.left) / this.total) * 100) : 0) + "%"; }
    };
    return T;
  },
  header(title, sub) {
    const h = document.createElement("header"); h.className = "topbar";
    h.innerHTML = `<a class="brand" href="${AIE.root}index.html"><span class="brand-mark" aria-hidden="true">AI</span><span class="brand-text">${title}<small>${sub || "AIE401 Artificial Intelligence for Educators, Workshop 1"}</small></span></a>
      <a class="top-btn hide-sm" href="${AIE.root}index.html">All resources</a>
      <button type="button" class="top-btn" id="theme-btn" aria-pressed="false">Dark mode</button>`;
    document.body.prepend(h);
    const sk = document.createElement("a"); sk.className = "skip-link"; sk.href = "#main"; sk.textContent = "Skip to main content"; document.body.prepend(sk);
    const b = h.querySelector("#theme-btn");
    const isDark = () => { const t = document.documentElement.getAttribute("data-theme"); return t ? t === "dark" : matchMedia("(prefers-color-scheme: dark)").matches; };
    const paint = () => { b.setAttribute("aria-pressed", isDark()); b.textContent = isDark() ? "Light mode" : "Dark mode"; };
    b.onclick = () => { const n = isDark() ? "light" : "dark"; document.documentElement.setAttribute("data-theme", n); try { localStorage.setItem("aie401-theme", n); } catch (e) {} paint(); };
    paint();
  },
  footer() {
    const f = document.createElement("footer"); f.className = "footer";
    f.innerHTML = `Blackpool School of Computing, Blackpool and The Fylde College. AIE401 Artificial Intelligence for Educators. All learner names, answers and scenarios are fictional. Your answers and progress are saved only in this browser.`;
    document.getElementById("main").appendChild(f);
  }
};
