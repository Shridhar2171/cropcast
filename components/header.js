class CustomHeader extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: "open" });

        this.shadowRoot.innerHTML = `
            <style>
                header {
                    background: #4CAF50;
                    color: white;
                    padding: 1rem 2rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-shadow: 0px 2px 5px rgba(0,0,0,0.1);
                }

                .logo {
                    font-size: 1.5rem;
                    font-weight: bold;
                }

                nav {
                    display: flex;
                    gap: 1.8rem;
                }

                nav a {
                    color: white;
                    text-decoration: none;
                    font-size: 1rem;
                    font-weight: 500;
                    transition: opacity 0.3s;
                }

                nav a:hover {
                    opacity: 0.7;
                }

                /* Hamburger menu button (hidden for desktop) */
                .menu-btn {
                    display: none;
                    font-size: 2rem;
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                }

                @media(max-width: 768px) {
                    nav {
                        display: none;
                    }
                    .menu-btn {
                        display: block;
                    }
                }
            </style>

            <header>
                <div class="logo">CropCast</div>

                <nav>
                    <a href="/">Home</a>
                    <a href="/about">About</a>
                    <a href="/crops">Crops</a>
                    <a href="/contact">Contact</a>
                </nav>

                <button class="menu-btn" id="openMenu">☰</button>
            </header>
        `;

        // Mobile menu open button event
        this.shadowRoot.getElementById("openMenu").addEventListener("click", () => {
            document.querySelector("mobile-menu").openMenu();
        });
    }
}

customElements.define("custom-header", CustomHeader);
