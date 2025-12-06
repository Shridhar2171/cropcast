
class CustomFooter extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                footer {
                    background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
                    color: white;
                    padding: 2rem 0;
                    margin-top: 4rem;
                }
                
                .footer-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }
                
                .footer-links {
                    display: flex;
                    gap: 1.5rem;
                    margin: 1rem 0;
                }
                
                .footer-links a {
                    color: white;
                    text-decoration: none;
                    transition: opacity 0.3s;
                }
                
                .footer-links a:hover {
                    opacity: 0.8;
                }
                
                .copy-text {
                    font-size: 0.875rem;
                    opacity: 0.8;
                }
            </style>
            
            <footer>
                <div class="container mx-auto px-4">
                    <div class="footer-content">
                        <div class="flex items-center space-x-2 mb-4">
                            <i data-feather="sun" class="w-6 h-6 text-white"></i>
                            <span class="text-xl font-bold">CropCast</span>
                        </div>
                        
                        <div class="footer-links">
                            <a href="#">Privacy Policy</a>
                            <a href="#">Terms of Service</a>
                            <a href="#">Contact Us</a>
                            <a href="#">About</a>
                        </div>
                        
                        <p class="copy-text">&copy; ${new Date().getFullYear()} CropCast Predictor. All rights reserved.</p>
                    </div>
                </div>
            </footer>
            
            <script src="https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.js"></script>
            <script>
                feather.replace();
            </script>
        `;
    }
}

customElements.define('custom-footer', CustomFooter);
