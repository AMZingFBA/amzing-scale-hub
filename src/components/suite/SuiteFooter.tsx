const SuiteFooter = () => {
  return (
    <footer className="py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div>
            <span className="text-xl font-bold">
              <span className="text-suite-orange">AMZing</span>
              <span className="text-white"> FBA</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-suite-gray">
            <a href="/mentions-legales" className="hover:text-white transition-colors">
              Mentions légales
            </a>
            <a href="/confidentialite" className="hover:text-white transition-colors">
              Politique de confidentialité
            </a>
            <a href="/cgv" className="hover:text-white transition-colors">
              CGV
            </a>
          </div>

          {/* Copyright */}
          <div className="text-sm text-suite-gray">
            © {new Date().getFullYear()} AMZing FBA
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SuiteFooter;
