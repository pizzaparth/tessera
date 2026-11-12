import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROOTLY_LANDING_HTML } from './landingHtml';

export const LandingPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    // Graceful error handler for missing optional images
    const images = root.querySelectorAll<HTMLImageElement>('img');
    images.forEach((img) => {
      img.addEventListener('error', () => {
        img.style.display = 'none';
      });
    });

    // Attach magnetic hover attraction physics to all .btn--primary buttons
    const magneticButtons = root.querySelectorAll<HTMLElement>(
      '.btn--primary, .nav__demo, [href="/demo"], [href^="/demo"]'
    );
    const cleanups: Array<() => void> = [];

    magneticButtons.forEach((btn) => {
      let isHovered = false;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.38;
        const deltaY = (e.clientY - centerY) * 0.38;
        btn.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
      };

      const handleMouseEnter = () => {
        isHovered = true;
        btn.style.transition = 'transform 0.08s ease-out, box-shadow 0.2s ease';
        btn.classList.add('shadow-xl');
      };

      const handleMouseLeave = () => {
        isHovered = false;
        btn.style.transition = 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.2s ease';
        btn.style.transform = 'translate3d(0, 0, 0)';
        btn.classList.remove('shadow-xl');
      };

      btn.addEventListener('mousemove', handleMouseMove);
      btn.addEventListener('mouseenter', handleMouseEnter);
      btn.addEventListener('mouseleave', handleMouseLeave);

      cleanups.push(() => {
        btn.removeEventListener('mousemove', handleMouseMove);
        btn.removeEventListener('mouseenter', handleMouseEnter);
        btn.removeEventListener('mouseleave', handleMouseLeave);
      });
    });

    // Intercept clicks on links and buttons
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a, button');
      if (!target) return;

      const href = target.getAttribute('href');
      const text = target.textContent || '';

      if (
        href === '/demo' ||
        href?.startsWith('/demo') ||
        target.classList.contains('nav__demo') ||
        text.includes('Try Demo') ||
        text.includes('Book a demo') ||
        text.includes('Log in')
      ) {
        e.preventDefault();
        navigate('/demo');
      } else if (href && href.startsWith('/')) {
        e.preventDefault();
        navigate(href);
      }
    };

    // Keyboard shortcut: Pressing 'D' or 'd' triggers Try Demo
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'd' || e.key === 'D') {
        navigate('/demo');
      }
    };

    root.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      cleanups.forEach((c) => c());
      root.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);

  return (
    <div
      ref={containerRef}
      className="rootly-landing-wrapper bg-white text-[#100f12] min-h-screen selection:bg-[#ebe5ff] selection:text-[#6d55bd]"
      dangerouslySetInnerHTML={{ __html: ROOTLY_LANDING_HTML }}
    />
  );
};

export default LandingPage;
