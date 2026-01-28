const Footer = () => {
  return (
    <footer className="w-full bg-white text-black pt-8 pb-2 px-6 border-t border-[#e5e5e5] mt-48">
      <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-8">
          {/* Brand - Left side */}
          <div>
            <h2 className="text-xl font-light tracking-wide mb-4">Mannat Shawl's</h2>
            <p className="text-sm font-light text-black/70 leading-relaxed max-w-md mb-6">
              Authentic Kashmiri handicrafts - handwoven Pashmina shawls, traditional Kurtas, and luxurious carpets
            </p>
            
            {/* Contact Information */}
            <div className="space-y-2 text-sm font-light text-black/70">
              <div>
                <p className="font-normal text-black mb-1">Visit Us</p>
                <p>Residency Road, Lal Chowk</p>
                <p>Srinagar, Kashmir 190001</p>
              </div>
              <div>
                <p className="font-normal text-black mb-1 mt-3">Contact</p>
                <p>+91 (194) 250-1234</p>
                <p>hello@mannatshawls.com</p>
              </div>
            </div>
          </div>

          {/* Link lists - Right side */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Shop */}
            <div>
              <h4 className="text-sm font-normal mb-4">Shop</h4>
              <ul className="space-y-2">
                <li><a href="/category/new-in" className="text-sm font-light text-black/70 hover:text-black transition-colors">New In</a></li>
                <li><a href="/category/shawls" className="text-sm font-light text-black/70 hover:text-black transition-colors">Shawls</a></li>
                <li><a href="/category/kurtas" className="text-sm font-light text-black/70 hover:text-black transition-colors">Kurtas</a></li>
                <li><a href="/category/carpets" className="text-sm font-light text-black/70 hover:text-black transition-colors">Carpets</a></li>
                <li><a href="/category/stoles" className="text-sm font-light text-black/70 hover:text-black transition-colors">Stoles</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-sm font-normal mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="/about/size-guide" className="text-sm font-light text-black/70 hover:text-black transition-colors">Size Guide</a></li>
                <li><a href="/about/customer-care" className="text-sm font-light text-black/70 hover:text-black transition-colors">Care Instructions</a></li>
                <li><a href="/about/customer-care" className="text-sm font-light text-black/70 hover:text-black transition-colors">Returns</a></li>
                <li><a href="/about/customer-care" className="text-sm font-light text-black/70 hover:text-black transition-colors">Shipping</a></li>
                <li><a href="/about/customer-care" className="text-sm font-light text-black/70 hover:text-black transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-sm font-normal mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm font-light text-black/70 hover:text-black transition-colors">Instagram</a></li>
                <li><a href="#" className="text-sm font-light text-black/70 hover:text-black transition-colors">Pinterest</a></li>
                <li><a href="#" className="text-sm font-light text-black/70 hover:text-black transition-colors">Newsletter</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section - edge to edge separator */}
      <div className="border-t border-[#e5e5e5] -mx-6 px-6 pt-2">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm font-light text-black mb-1 md:mb-0">
            © 2024 Mannat Shawl's. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="/privacy-policy" className="text-sm font-light text-black hover:text-black/70 transition-colors">
              Privacy Policy
            </a>
            <a href="/terms-of-service" className="text-sm font-light text-black hover:text-black/70 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;