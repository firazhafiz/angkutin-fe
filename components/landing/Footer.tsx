import Image from "next/image";
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { MdOutlineMail, MdPhone } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="relative w-full pt-30 font-sans text-white overflow-hidden">
      <div className="w-full h-full">
        <Image
          src="/images/layer1-footer.svg"
          alt="Footer Background"
          width={100}
          height={100}
          className="absolute top-0 left-0 object-cover w-full h-full z-1"
          priority
        />
        <Image
          src="/images/layer2-footer.svg"
          alt="Footer Background"
          width={100}
          height={100}
          className="absolute top-0 left-0 object-cover w-full h-full z-2"
          priority
        />
        <Image
          src="/images/layer3-footer.svg"
          alt="Footer Background"
          width={100}
          height={100}
          className="absolute top-0 left-0 object-cover w-full h-full z-3 opacity-60"
          priority
        />
      </div>
      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-12 pb-6 mt-14 flex flex-col gap-10">
        <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-12 lg:gap-16">
          <div className="flex-1 flex flex-col gap-4">
            <div className=" items-center gap-2">
              <Image
                src="/logo/angkutin_white.png"
                alt="Angkutin Logo"
                width={175}
                height={70}
                className="object-contain "
              />
            </div>
            <p className="text-sm md:text-base font-normal leading-relaxed text-white/90 max-w-xs">
              A smart waste management solution offering efficient, eco-friendly
              services for collection, recycling, and disposal, committed to
              sustainability and a cleaner future for communities.
            </p>
          </div>
          {/* About Angkut.in */}
          <div className="flex-1 min-w-[200px] ">
            <h3 className="text-base md:text-lg font-bold mb-3">
              About Angkut.in
            </h3>
            <ul className="flex flex-col gap-2 text-sm md:text-base font-normal">
              <li>
                <a href="/auth/login" className="hover:underline text-white/80">
                  Login
                </a>
              </li>
              <li>
                <a
                  href="/auth/register"
                  className="hover:underline text-white/80"
                >
                  Register
                </a>
              </li>

              <li>
                <a href="#about" className="hover:underline text-white/80">
                  About Us
                </a>
              </li>
            </ul>
          </div>
          {/* Help */}
          <div className="flex-1 min-w-[200px]">
            <h3 className="text-base md:text-lg font-bold mb-3">Help</h3>
            <ul className="flex flex-col gap-2 text-sm md:text-base font-normal">
              <li>
                <a
                  href="#consultation"
                  className="hover:underline text-white/80"
                >
                  Consultation
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:underline text-white/80">
                  Terms and Condition
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:underline text-white/80">
                  Privacy and Policy
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:underline text-white/80">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          {/* Get in Touch */}
          <div className="flex-1 w-full">
            <h3 className="text-base md:text-lg font-bold mb-3">
              Get in Touch
            </h3>
            <ul className="flex flex-col gap-2 text-sm md:text-base font-normal">
              <li className="flex items-center gap-3">
                <FaInstagram size={18} />
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-white/80"
                >
                  Instagram
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaLinkedin size={18} />
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-white/80"
                >
                  LinkedIn
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MdOutlineMail size={18} />
                <a
                  href="mailto:Kb3tD@example.com"
                  className="hover:underline text-white/80"
                >
                  angkutinwaste@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MdPhone size={18} />
                <a
                  href="tel:+6282332676848"
                  className="hover:underline text-white/80"
                >
                  +62 823 326 768 48
                </a>
              </li>
            </ul>
          </div>
        </div>
        {/* Copyright */}
        <div className="border-t border-white/20 pt-6 text-center text-xs md:text-sm text-white/80 font-normal">
          2025 • Angkut.in. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
