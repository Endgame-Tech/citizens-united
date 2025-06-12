import LandingHero from "./components/LandingHero";
import LandingNavbar from "./components/LandingNavbar";
import LandingUnderstand from "./components/LandingUnderstand";
import LandingOrganise from "./components/LandingOrganise";
import LandingTrack from "./components/LandingTrack";
import LandingCta from "./components/LandingCta";
import LandingFooter from "./components/LandingFooter";
import ScrollProgressBar from "../../components/ui/ScrollProgressBar";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const LandingPage = (): React.ReactElement => {
  const mainRef = useRef<HTMLDivElement>(null);

  // Scroll to top when landing page loads
  useEffect(() => {
    window.scrollTo(0, 0);

    // Setup smooth scrolling for anchor links
    const setupSmoothScrolling = () => {
      const anchorLinks = document.querySelectorAll('a[href^="#"]');

      anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          if (href === '#') return;

          e.preventDefault();

          const targetId = href?.replace('#', '');
          const targetElement = document.getElementById(targetId || '');

          if (targetElement) {
            gsap.to(window, {
              duration: 1,
              scrollTo: {
                y: targetElement,
                offsetY: 80
              },
              ease: "power3.inOut"
            });
          }
        });
      });
    };

    // Initialize page animations
    const initAnimations = () => {
      // Fade in sections as they come into view
      gsap.utils.toArray('.animate-on-scroll').forEach((section: any) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );
      });
    };

    setupSmoothScrolling();
    initAnimations();

    // Cleanup scroll triggers when component unmounts
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="font-poppins min-h-screen flex flex-col bg-white dark:bg-background-dark transition-colors duration-300">
      {/* Progress Bar */}
      <ScrollProgressBar />

      {/* Navbar */}
      <LandingNavbar />

      {/* Hero Section */}
      <LandingHero />

      {/* Main Sections */}
      <main ref={mainRef}>
        <div id="understand" className="animate-on-scroll">
          <LandingUnderstand />
        </div>
        <div id="organise" className="animate-on-scroll">
          <LandingOrganise />
        </div>
        <div id="track" className="animate-on-scroll">
          <LandingTrack />
        </div>
        <div id="get-started" className="animate-on-scroll">
          <LandingCta />
        </div>
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
