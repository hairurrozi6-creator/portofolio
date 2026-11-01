/**
 * ===================================================================
 * LUMINA VISUALS - MAIN JAVASCRIPT
 * Photographer Landing Page & WhatsApp Direct Integration
 * ===================================================================
 */

// ================= PENGATURAN / KONFIGURASI =================
// Cukup ubah nomor WhatsApp dan Nama Fotografer di bawah ini.
// Format nomor WA: Awali dengan kode negara tanpa simbol "+" (Contoh: "6281234567890")
const CONFIG = {
  photographerName: "Hairur Rozi",
  brandName: "SemetonGraphy",
  whatsappNumber: "6289686657858", // Nomor WhatsApp Anda
  instagram: "@semetongraphy",
  instagramUrl: "https://www.instagram.com/semetongraphy?rpxt=MTRlbmQ3bWN6ZHBzaw%3D%3D&utm_source=qr",
  displayPhoneFormatted: "+62 896-8665-7858" // Tampilan nomor di teks halaman
};

// ================= INITIALIZATION =================
document.addEventListener("DOMContentLoaded", () => {
  // Update tampilan nomor telepon di website dari config
  const dispNumber = document.getElementById("dispWaNumber");
  const footerNumber = document.getElementById("footerWaNumber");
  const yearElement = document.getElementById("currentYear");

  if (dispNumber) dispNumber.textContent = CONFIG.displayPhoneFormatted;
  if (footerNumber) footerNumber.textContent = CONFIG.displayPhoneFormatted;
  if (yearElement) yearElement.textContent = new Date().getFullYear();

  // Inisialisasi fitur
  initNavbar();
  initGalleryFilter();
  initScrollSpy();
});

// ================= NAVBAR & MOBILE MENU =================
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Sticky navbar saat di-scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Toggle menu mobile (hamburger)
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
      const icon = navToggle.querySelector("i");
      if (navMenu.classList.contains("open")) {
        icon.classList.remove("fa-bars-staggered");
        icon.classList.add("fa-xmark");
      } else {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars-staggered");
      }
    });

    // Tutup menu saat salah satu link diklik
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        const icon = navToggle.querySelector("i");
        if (icon) {
          icon.classList.remove("fa-xmark");
          icon.classList.add("fa-bars-staggered");
        }
      });
    });
  }
}

// ================= ACTIVE NAV HIGHLIGHT (SCROLL SPY) =================
function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    let scrollPosition = window.scrollY + 200;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  });
}

// ================= GALLERY FILTER =================
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Toggle class active tombol filter
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      galleryItems.forEach((item) => {
        const itemCategory = item.getAttribute("data-category");
        if (filterValue === "all" || itemCategory === filterValue) {
          item.classList.remove("hide");
        } else {
          item.classList.add("hide");
        }
      });
    });
  });
}

// Filter galeri dari tautan footer
function filterGalleryFromFooter(category) {
  const targetBtn = document.querySelector(`.filter-btn[data-filter="${category}"]`);
  if (targetBtn) {
    targetBtn.click();
  }
}

// ================= LIGHTBOX MODAL =================
function openLightbox(triggerButton) {
  const modal = document.getElementById("lightboxModal");
  const modalImg = document.getElementById("lightboxImg");
  const modalTitle = document.getElementById("lightboxTitle");
  const modalCategory = document.getElementById("lightboxCategory");
  const modalLocation = document.getElementById("lightboxLocation");
  const modalWaBtn = document.getElementById("lightboxWaBtn");

  const card = triggerButton.closest(".gallery-card");
  if (!card) return;

  const imgSrc = card.querySelector("img").getAttribute("src");
  const cat = card.querySelector(".gallery-cat").textContent;
  const name = card.querySelector(".gallery-name").textContent;
  const loc = card.querySelector(".gallery-location").textContent;

  modalImg.src = imgSrc;
  modalCategory.textContent = cat;
  modalTitle.textContent = name;
  modalLocation.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${loc.trim()}`;

  // Atur aksi tombol WhatsApp di dalam Lightbox
  modalWaBtn.onclick = () => {
    inquirePhoto(`${name} (${cat})`);
  };

  modal.classList.add("active");
  document.body.style.overflow = "hidden"; // Mencegah scrolling background
}

function closeLightbox() {
  const modal = document.getElementById("lightboxModal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }
}

// Tutup lightbox dengan tombol keyboard Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeLightbox();
    closeWaPopup();
  }
});

// ================= WHATSAPP MESSAGE BUILDER & REDIRECT =================
/**
 * Membuka chat WhatsApp dengan pesan terformat URL Encoded
 * @param {string} text - Pesan teks
 */
function openWhatsAppWithMessage(text) {
  const encodedText = encodeURIComponent(text);
  const waUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedText}`;
  window.open(waUrl, "_blank");
}

// Chat Cepat WhatsApp
function quickWhatsAppChat(customText) {
  const brandDisplay = CONFIG.photographerName === CONFIG.brandName 
    ? CONFIG.brandName 
    : `${CONFIG.photographerName} (${CONFIG.brandName})`;
  const defaultText = `Halo Kak ${brandDisplay}, saya ingin konsultasi mengenai pricelist dan ketersediaan jadwal pemotretan.`;
  openWhatsAppWithMessage(customText || defaultText);
}

// Tanya foto spesifik dari portfolio
function inquirePhoto(photoInfo) {
  const message = `Halo Kak ${CONFIG.photographerName}, saya melihat portofolio foto *"${photoInfo}"* di website. Mau tanya apakah bisa booking sesi dengan konsep dan mood seperti itu? Terima kasih!`;
  openWhatsAppWithMessage(message);
}

// Minta katalog PDF lengkap
function openCustomCatalogWA() {
  const message = `Halo ${CONFIG.brandName}, boleh minta info Price List & Katalog PDF lengkap untuk paket pemotretan tahun ini? Terima kasih!`;
  openWhatsAppWithMessage(message);
}

// ================= PILIH PAKET DARI PRICING CARD =================
function selectPackage(packageName, price) {
  const bookingSection = document.getElementById("contact");
  const packageSelect = document.getElementById("packageSelect");
  const clientNameInput = document.getElementById("clientName");

  // Set nilai select option
  if (packageSelect) {
    let matchedOption = false;
    for (let i = 0; i < packageSelect.options.length; i++) {
      if (packageSelect.options[i].value.toLowerCase().includes(packageName.toLowerCase()) ||
          packageName.toLowerCase().includes(packageSelect.options[i].value.toLowerCase())) {
        packageSelect.selectedIndex = i;
        matchedOption = true;
        break;
      }
    }

    if (!matchedOption) {
      packageSelect.value = packageName;
    }
  }

  // Scroll halus ke formulir booking
  if (bookingSection) {
    bookingSection.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      if (clientNameInput) {
        clientNameInput.focus();
      }
    }, 600);
  }
}

// ================= FORM BOOKING HANDLING =================
function handleFormSubmit(event) {
  event.preventDefault();

  const name = document.getElementById("clientName").value.trim();
  const selectedPackage = document.getElementById("packageSelect").value;
  const date = document.getElementById("shootDate").value;
  const location = document.getElementById("shootLocation").value.trim();
  const notes = document.getElementById("clientNotes").value.trim();

  // Validasi sederhana
  if (!name || !selectedPackage) {
    alert("Harap lengkapi Nama Anda dan Pilihan Paket terlebih dahulu!");
    return;
  }

  // Format tanggal jika ada
  let formattedDate = "Belum ditentukan / fleksibel";
  if (date) {
    try {
      const d = new Date(date);
      formattedDate = d.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch (e) {
      formattedDate = date;
    }
  }

  const brandGreeting = CONFIG.photographerName === CONFIG.brandName 
    ? CONFIG.brandName 
    : `${CONFIG.photographerName} (${CONFIG.brandName})`;

  // Susun template pesan WhatsApp yang rapi dan profesional
  const message = 
`Halo Kak ${brandGreeting}! ✨
Saya ingin mengajukan reservasi/konsultasi pemotretan dari website:

📝 *DETAIL RESERVASI:*
• *Nama Klien:* ${name}
• *Pilihan Paket:* ${selectedPackage}
• *Rencana Tanggal:* ${formattedDate}
• *Lokasi/Kota:* ${location ? location : "Akan didiskusikan"}
• *Catatan/Konsep:* ${notes ? notes : "-"}

Apakah jadwal untuk tanggal tersebut masih tersedia? Terima kasih! 🙏`;

  // Buka WhatsApp
  openWhatsAppWithMessage(message);
}

// ================= FLOATING WHATSAPP POPUP =================
function toggleWaPopup() {
  const popup = document.getElementById("waPopup");
  if (popup) {
    popup.classList.toggle("active");
  }
}

function closeWaPopup() {
  const popup = document.getElementById("waPopup");
  if (popup && popup.classList.contains("active")) {
    popup.classList.remove("active");
  }
}

// Klik di luar popup untuk menutupnya
document.addEventListener("click", (e) => {
  const widget = document.getElementById("waWidget");
  const popup = document.getElementById("waPopup");

  if (widget && popup && popup.classList.contains("active")) {
    if (!widget.contains(e.target)) {
      popup.classList.remove("active");
    }
  }
});
