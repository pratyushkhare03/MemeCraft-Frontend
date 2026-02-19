// ==================== MEMECRAFT AI — SHARED NAVIGATION ====================
// Call renderNav('page-id') in each page to inject consistent nav
// page-id: 'home' | 'studio' | 'gallery' | 'templates'

function renderNav(activePage = 'home') {
    const pages = [
        { id: 'home',      href: 'index.html',     icon: 'fa-house',           label: 'Home' },
        { id: 'studio',    href: 'studio.html',    icon: 'fa-wand-sparkles',   label: 'Studio' },
        { id: 'gallery',   href: 'gallery.html',   icon: 'fa-images',          label: 'Gallery' },
        { id: 'templates', href: 'templates.html', icon: 'fa-layer-group',     label: 'Templates' },
    ];

    const navHTML = `
    <header class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-3 flex flex-wrap items-center justify-between gap-3">
        <!-- Brand -->
        <a href="index.html" class="flex items-center gap-2 group no-underline">
            <i class="fa-regular fa-face-smile text-2xl sm:text-3xl text-amber-500 group-hover:scale-110 transition-transform duration-300"></i>
            <span class="font-meme text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                MEMECRAFT<span class="text-amber-500 text-base sm:text-lg">ai</span>
            </span>
            <span class="text-xs font-medium px-2 py-0.5 rounded-full bg-white/60 text-amber-700 border border-amber-200 ml-1 premium-blur hidden sm:inline">poster+</span>
        </a>

        <!-- Nav links -->
        <nav class="flex gap-1 sm:gap-2 flex-wrap">
            ${pages.map(p => `
            <a href="${p.href}"
               class="nav-link px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all hover-lift
                      ${activePage === p.id
                        ? 'bg-black text-white shadow-md'
                        : 'bg-white/60 text-gray-700 border border-gray-200 hover:bg-white hover:text-amber-600'}"
               aria-current="${activePage === p.id ? 'page' : 'false'}">
                <i class="fa-regular ${p.icon} text-xs sm:text-sm"></i>
                <span class="hidden xs:inline sm:inline">${p.label}</span>
            </a>`).join('')}
        </nav>
    </header>`;

    // Inject into #nav-root or prepend to body
    const navRoot = document.getElementById('nav-root');
    if (navRoot) {
        navRoot.innerHTML = navHTML;
    } else {
        document.body.insertAdjacentHTML('afterbegin', navHTML);
    }
}