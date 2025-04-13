document.addEventListener("DOMContentLoaded", function () {
    var selectElement = document.querySelector("#select_target");

    if (selectElement) {
        jQuery(selectElement).select2();
    }
});

const tabs = document.querySelectorAll('[role="tab"]');
const panels = document.querySelectorAll('[role="tabpanel"]');


function activateTab(tab) {
   
    tabs.forEach(t => {
        t.setAttribute("aria-selected", "false");
        t.classList.remove("bg-sky-500/50", "text-white");
        t.classList.add("bg-gray-200", "text-gray-400");
    });

    panels.forEach(p => {
        p.hidden = true;
        p.classList.remove("animate-fade"); // Reset animasi sebelum menambahkannya kembali
    });

    tab.setAttribute("aria-selected", "true");
    tab.classList.add("bg-sky-500/50", "text-white");
    tab.classList.remove("bg-gray-200", "text-gray-400");

    const panel = document.getElementById(tab.getAttribute("aria-controls"));
    panel.hidden = false; // Tampilkan panel

   
    setTimeout(() => {
        panel.classList.add("animate-fade");
    }, 10);
}

// Tetapkan tab default saat halaman dimuat
const defaultTab = document.querySelector('[role="tab"][aria-selected="true"]');
if (defaultTab) activateTab(defaultTab);
else activateTab(tabs[0]); // Pilih tab pertama jika tidak ada yang aktif

// Event listener untuk klik tab
tabs.forEach(tab => {
    tab.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        activateTab(tab);
    });
});

