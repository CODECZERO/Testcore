import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import "./styles/footer.css";

gsap.registerPlugin(ScrollTrigger);

function Footer() {
  const footerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      footerRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.3,
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
          end: "top 50%",
          scrub: false,
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  return (
    <div className="footer" ref={footerRef}>
      <footer>
        <div className="footer-content">
          <div className="footer-section">
            <h3>Testcore</h3>
            <p>Empowering education through technology. Manage exams, schedules, and results seamlessly.</p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#support">Support</a>
          </div>

          <div className="footer-section">
            <h4>Connect With Us</h4>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 Testcore. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
