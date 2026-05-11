document.addEventListener("DOMContentLoaded", () => {
  function resolveApiBaseUrl() {
    if (window.SW_API_BASE_URL) return String(window.SW_API_BASE_URL).replace(/\/$/, "");
    const fromLs = localStorage.getItem("SW_API_BASE_URL");
    if (fromLs) return fromLs.replace(/\/$/, "");
    const host = window.location.hostname || "";
    // Same Render/Railway service serves API + static files → call same origin.
    if (host.includes("onrender.com") || host.includes("railway.app")) {
      return window.location.origin;
    }
    return "http://localhost:5000";
  }
  const API_BASE_URL = resolveApiBaseUrl();
  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");
  const currentUser = savedUser ? JSON.parse(savedUser) : null;

  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => navLinks.classList.toggle("active"));
    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => navLinks.classList.remove("active"));
    });
  }

  const navbar = document.querySelector(".navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.style.boxShadow = window.scrollY > 50 ? "0 4px 6px -1px rgba(0,0,0,0.1)" : "none";
    });
  }

  function setStatus(el, message, isSuccess = false) {
    if (!el) return;
    el.textContent = message;
    el.style.display = "block";
    el.style.color = isSuccess ? "#10B981" : "#EF4444";
  }

  function showError(input, message) {
    const formGroup = input.parentElement;
    let errorMsg = formGroup.querySelector(".error-message");
    if (!errorMsg) {
      errorMsg = document.createElement("small");
      errorMsg.className = "error-message";
      errorMsg.style.color = "#EF4444";
      errorMsg.style.marginTop = "0.5rem";
      errorMsg.style.display = "block";
      formGroup.appendChild(errorMsg);
    }
    errorMsg.textContent = message;
    input.style.borderColor = "#EF4444";
  }

  function removeError(input) {
    const formGroup = input.parentElement;
    const errorMsg = formGroup.querySelector(".error-message");
    if (errorMsg) errorMsg.remove();
    input.style.borderColor = "#e2e8f0";
  }

  async function apiFetch(path, options = {}) {
    const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
    if (localStorage.getItem("token")) {
      headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    }
    const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Request failed");
    return data;
  }

  function enhanceNavbarAuth() {
    if (!navLinks || navLinks.dataset.authInjected === "true") return;
    navLinks.dataset.authInjected = "true";
    if (token && currentUser) {
      navLinks.insertAdjacentHTML(
        "beforeend",
        `<span style="color:#64FFDA;font-weight:600;">Hi, ${currentUser.name}</span>
         <a href="profile.html">Profile</a>
         ${currentUser.role === "admin" ? '<a href="admin.html">Admin</a>' : ""}
         <button id="logoutBtn" class="btn btn-primary" style="padding:0.5rem 1rem;">Logout</button>`
      );
      const logoutBtn = document.getElementById("logoutBtn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "index.html";
        });
      }
    } else {
      navLinks.insertAdjacentHTML(
        "beforeend",
        `<a href="login.html">Login</a><a href="register.html">Register</a>`
      );
    }
  }

  function enhanceFooterNewsletter() {
    const footerContent = document.querySelector(".footer-content");
    if (!footerContent || footerContent.querySelector("#newsletterForm")) return;
    footerContent.insertAdjacentHTML(
      "beforeend",
      `<div class="footer-col">
        <h3>Newsletter</h3>
        <p style="color:#8892b0;font-size:0.95rem;margin-bottom:1rem;">Get updates on web trends and offers.</p>
        <form id="newsletterForm">
          <input id="newsletterEmail" type="email" placeholder="Enter your email" style="width:100%;padding:0.8rem;border-radius:8px;border:1px solid #334155;margin-bottom:0.75rem;background:#112240;color:#fff;">
          <button class="btn btn-primary" style="width:100%;" type="submit">Subscribe</button>
          <small id="newsletterStatus" style="display:none;margin-top:0.5rem;"></small>
        </form>
      </div>`
    );

    const newsletterForm = document.getElementById("newsletterForm");
    const newsletterStatus = document.getElementById("newsletterStatus");
    newsletterForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("newsletterEmail").value.trim();
      try {
        const result = await apiFetch("/api/newsletter/subscribe", {
          method: "POST",
          body: JSON.stringify({ email }),
        });
        setStatus(newsletterStatus, result.message, true);
        newsletterForm.reset();
      } catch (error) {
        setStatus(newsletterStatus, error.message);
      }
    });
  }

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fields = ["name", "email", "phone", "subject", "message"];
      let isValid = true;
      fields.forEach((field) => {
        const input = document.getElementById(field);
        if (!input.value.trim()) {
          showError(input, `${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
          isValid = false;
        } else if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
          showError(input, "Valid email is required");
          isValid = false;
        } else {
          removeError(input);
        }
      });

      const formStatus = document.getElementById("formStatus");
      if (!isValid) return;
      try {
        const payload = Object.fromEntries(new FormData(contactForm).entries());
        const result = await apiFetch("/api/contact", { method: "POST", body: JSON.stringify(payload) });
        setStatus(formStatus, result.message, true);
        contactForm.reset();
      } catch (error) {
        setStatus(formStatus, error.message);
      }
    });
  }

  const quoteModal = document.getElementById("quoteModal");
  const quoteForm = document.getElementById("quoteForm");
  document.querySelectorAll("[data-open-quote]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (quoteModal) quoteModal.style.display = "flex";
    });
  });
  const closeQuoteModal = document.getElementById("closeQuoteModal");
  if (closeQuoteModal) {
    closeQuoteModal.addEventListener("click", () => {
      quoteModal.style.display = "none";
    });
  }
  if (quoteForm) {
    quoteForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const statusEl = document.getElementById("quoteStatus");
      try {
        const payload = Object.fromEntries(new FormData(quoteForm).entries());
        const result = await apiFetch("/api/quote", { method: "POST", body: JSON.stringify(payload) });
        setStatus(statusEl, result.message, true);
        quoteForm.reset();
      } catch (error) {
        setStatus(statusEl, error.message);
      }
    });
  }

  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const statusEl = document.getElementById("registerStatus");
      try {
        const payload = Object.fromEntries(new FormData(registerForm).entries());
        await apiFetch("/api/auth/register", { method: "POST", body: JSON.stringify(payload) });
        setStatus(statusEl, "Registration successful. Please login.", true);
        setTimeout(() => (window.location.href = "login.html"), 1200);
      } catch (error) {
        setStatus(statusEl, error.message);
      }
    });
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const statusEl = document.getElementById("loginStatus");
      try {
        const payload = Object.fromEntries(new FormData(loginForm).entries());
        const data = await apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify(payload) });
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setStatus(statusEl, "Login successful", true);
        setTimeout(() => (window.location.href = "profile.html"), 900);
      } catch (error) {
        setStatus(statusEl, error.message);
      }
    });
  }

  const profileCard = document.getElementById("profileCard");
  if (profileCard) {
    if (!token) window.location.href = "login.html";
    apiFetch("/api/auth/profile")
      .then((data) => {
        profileCard.innerHTML = `<h2 style="margin-bottom:1rem;">Welcome, ${data.user.name}</h2>
          <p><strong>Email:</strong> ${data.user.email}</p>
          <p><strong>Role:</strong> ${data.user.role}</p>
          <p><strong>Joined:</strong> ${new Date(data.user.createdAt).toLocaleString()}</p>`;
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "login.html";
      });
  }

  const adminPanel = document.getElementById("adminPanel");
  if (adminPanel) {
    if (!token) window.location.href = "login.html";
    Promise.all([apiFetch("/api/admin/contacts"), apiFetch("/api/admin/users"), apiFetch("/api/admin/quotes")])
      .then(([contactsData, usersData, quotesData]) => {
        const contactsRows = contactsData.contacts
          .map(
            (c) =>
              `<tr><td>${c.name}</td><td>${c.email}</td><td>${c.subject}</td><td>${new Date(c.createdAt).toLocaleDateString()}</td><td><button class="btn btn-primary delete-contact" data-id="${c._id}" style="padding:0.4rem 0.8rem;">Delete</button></td></tr>`
          )
          .join("");
        const usersRows = usersData.users
          .map((u) => `<tr><td>${u.name}</td><td>${u.email}</td><td>${u.role}</td><td>${new Date(u.createdAt).toLocaleDateString()}</td></tr>`)
          .join("");
        const quotesRows = quotesData.quotes
          .map((q) => `<tr><td>${q.name}</td><td>${q.email}</td><td>${q.serviceRequired}</td><td>${q.budget}</td><td>${q.phone}</td></tr>`)
          .join("");

        document.getElementById("contactsTableBody").innerHTML = contactsRows || "<tr><td colspan='5'>No contacts found</td></tr>";
        document.getElementById("usersTableBody").innerHTML = usersRows || "<tr><td colspan='4'>No users found</td></tr>";
        document.getElementById("quotesTableBody").innerHTML = quotesRows || "<tr><td colspan='5'>No quotes found</td></tr>";

        document.querySelectorAll(".delete-contact").forEach((btn) => {
          btn.addEventListener("click", async () => {
            try {
              await apiFetch(`/api/admin/contacts/${btn.dataset.id}`, { method: "DELETE" });
              btn.closest("tr").remove();
            } catch (error) {
              alert(error.message);
            }
          });
        });
      })
      .catch(() => {
        window.location.href = "login.html";
      });
  }

  enhanceNavbarAuth();
  enhanceFooterNewsletter();
});
