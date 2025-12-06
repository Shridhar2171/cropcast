class MobileMenu extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: none;
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.85);
                    z-index: 500;
                    backdrop-filter: blur(6px);
                    animation: fadeIn 0.25s ease-out;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .menu-container {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    gap: 2rem;
                    transform: translateY(20px);
                    animation: slideUp 0.35s ease-out forwards;
                }

                @keyframes slideUp {
                    from { transform: translateY(60px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                .close-btn {
                    position: absolute;
                    top: 1.2rem;
                    right: 1.2rem;
                    background: none;
                    border: none;
                    color: white;
                    font-size: 2.5rem;
                    cursor: pointer;
                    transition: 0.3s;
                }

                .close-btn:hover {
                    opacity: 0.7;
                }

                .nav-link {
                    color: white;
                    text-decoration: none;
                    font-size: 1.7rem;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                    padding: 0.6rem 1.2rem;
                    border-radius: 0.6rem;
                    transition: all 0.3s ease;
                }

                .nav-link:hover {
                    background: rgba(255, 255, 255, 0.18);
                    transform: scale(1.08);
                }
            </style>

            <button class="close-btn" aria-label="Close menu">✖</button>

            <div class="menu-container">
                <a href="/" class="nav-link">Home</a>
                <a href="/about" class="nav-link">About</a>
                <a href="/crops" class="nav-link">Crops</a>
                <a href="/contact" class="nav-link">Contact</a>
            </div>
        `;

        // Close button functionality
        this.shadowRoot.querySelector(".close-btn").addEventListener("click", () => {
            this.closeMenu();
        });
    }

    openMenu() {
        this.style.display = "block";
        document.body.style.overflow = "hidden";
    }

    closeMenu() {
        this.style.display = "none";
        document.body.style.overflow = "";
    }
}

customElements.define("mobile-menu", MobileMenu);
