import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import heroImg from '../assets/hero-gym.jpg';
import featureImg from '../assets/feature-gym.jpg';
import './LandingPage.css';

/* ──────────────────────────────────────────────
   Animated counter hook
   ────────────────────────────────────────────── */
function useCountUp(target, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!startOnView || !inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration, startOnView]);

  return { count, ref };
}

/* ──────────────────────────────────────────────
   Reveal on scroll wrapper
   ────────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div
      ref={ref}
      className={`lp-reveal ${inView ? 'visible' : ''} ${delay ? `lp-reveal-delay-${delay}` : ''} ${className}`}
    >
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════
   LANDING PAGE COMPONENT
   ══════════════════════════════════════════════ */
export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Stats counter
  const stat1 = useCountUp(14, 1500);
  const stat2 = useCountUp(2.4, 1500);
  const stat3 = useCountUp(4.9, 1500);
  const stat4 = useCountUp(91, 1500);

  return (
    <div className="landing-page">
      {/* ════════════ NAVBAR ════════════ */}
      <nav className="lp-navbar">
        <div className="lp-navbar-inner">
          <Link to="/" className="lp-logo">
            <span className="lp-logo-badge">WB</span>
            <span className="lp-logo-text">Workout Buddy // 01</span>
          </Link>

          <ul className={`lp-nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            <li><a href="#features" className="lp-nav-link" onClick={() => setMobileMenuOpen(false)}>Training</a></li>
            <li><a href="#nutrition" className="lp-nav-link" onClick={() => setMobileMenuOpen(false)}>Nutrition</a></li>
            <li><a href="#trainers" className="lp-nav-link" onClick={() => setMobileMenuOpen(false)}>Trainers</a></li>
            <li><a href="#community" className="lp-nav-link" onClick={() => setMobileMenuOpen(false)}>Community</a></li>
            <li><a href="#pricing" className="lp-nav-link" onClick={() => setMobileMenuOpen(false)}>Pricing</a></li>
            <li>
              <Link to="/auth" className="lp-nav-cta" onClick={() => setMobileMenuOpen(false)}>
                Start Training <span className="arrow">↗</span>
              </Link>
            </li>
          </ul>

          <button
            className="lp-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* ════════════ HERO ════════════ */}
      <section className="lp-hero">
        <div className="lp-container">
          <div className="lp-hero-inner">
            {/* Left — copy */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="lp-hero-badge">
                  <span className="lp-hero-badge-dot" />
                  14,000+ Workouts Logged This Week
                </div>
              </motion.div>

              <motion.h1
                className="lp-hero-heading"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                Track the
                <br />
                work.
                <br />
                <span className="accent">Own</span> the
                <br />
                outcome.
              </motion.h1>

              <motion.p
                className="lp-hero-sub"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Your all-in-one fitness companion for workout tracking, nutrition,
                trainer booking, and a community that keeps you moving.
              </motion.p>

              <motion.div
                className="lp-hero-ctas"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.55 }}
              >
                <Link to="/auth" className="lp-btn-primary">
                  Claim Free Trial <span className="arrow" style={{ transform: 'rotate(-45deg)', display: 'inline-block' }}>↗</span>
                </Link>
                <a href="#features" className="lp-btn-secondary">
                  Explore the Platform <span>›</span>
                </a>
              </motion.div>

              {/* Social proof */}
              <motion.div
                className="lp-social-proof"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <div className="lp-avatars">
                  <span className="lp-avatar">A</span>
                  <span className="lp-avatar">M</span>
                  <span className="lp-avatar">S</span>
                  <span className="lp-avatar">K</span>
                </div>
                <div className="lp-stars">★★★★★</div>
                <span className="lp-social-proof-text">Loved by 14k+ Athletes</span>
              </motion.div>
            </div>

            {/* Right — visual */}
            <motion.div
              className="lp-hero-visual"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
            >
              <div className="lp-hero-img-wrapper">
                <img src={heroImg} alt="Athlete training in a dark gym" loading="eager" />
                <div className="lp-hero-saved-badge">Workout Saved / 08:58</div>
              </div>

              <div className="lp-telemetry">
                <div className="lp-telemetry-label">
                  <span className="dot" /> Live Telemetry
                </div>
                <div className="lp-telemetry-stats">
                  <div>
                    <div className="lp-telemetry-stat-val">08</div>
                    <div className="lp-telemetry-stat-label">Weeks Active</div>
                  </div>
                  <div>
                    <div className="lp-telemetry-stat-val">94%</div>
                    <div className="lp-telemetry-stat-label">Show-up Rate</div>
                  </div>
                </div>
              </div>

              <div className="lp-hero-watermark">01</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════ STATS STRIP ════════════ */}
      <section className="lp-stats">
        <div className="lp-container">
          <div className="lp-stats-grid">
            <div className="lp-stat" ref={stat1.ref}>
              <div className="lp-stat-value">{stat1.count}K+</div>
              <div className="lp-stat-label">Active Athletes</div>
            </div>
            <div className="lp-stat" ref={stat2.ref}>
              <div className="lp-stat-value">{stat2.count}M</div>
              <div className="lp-stat-label">Workouts Logged</div>
            </div>
            <div className="lp-stat" ref={stat3.ref}>
              <div className="lp-stat-value">{stat3.count}/5</div>
              <div className="lp-stat-label">Community Rating</div>
            </div>
            <div className="lp-stat" ref={stat4.ref}>
              <div className="lp-stat-value">{stat4.count}%</div>
              <div className="lp-stat-label">Weekly Consistency</div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ FEATURES OVERVIEW ════════════ */}
      <section className="lp-features-overview" id="features">
        <div className="lp-container">
          <div className="lp-features-header">
            <Reveal>
              <div className="lp-section-header">
                <div className="lp-section-tag">Built for the Work</div>
                <h2 className="lp-section-heading">
                  Every rep.
                  <br />
                  <span className="accent">Every milestone.</span>
                </h2>
              </div>
            </Reveal>
            <Reveal delay={2}>
              <p className="lp-section-sub">
                Your training, nutrition, trainer sessions, and community life in one focused system.
              </p>
            </Reveal>
          </div>

          <div className="lp-feature-cards">
            <Reveal delay={1}>
              <div className="lp-feature-card">
                <span className="lp-feature-card-tag">01 / Train</span>
                <span className="lp-feature-card-icon">◎</span>
                <div className="lp-feature-card-img">
                  <img src={heroImg} alt="Workout tracking" loading="lazy" />
                </div>
                <h3 className="lp-feature-card-title">Workout Tracking</h3>
                <p className="lp-feature-card-desc">
                  Log every set, rep, and PR in seconds so your progress never gets lost between sessions.
                </p>
              </div>
            </Reveal>

            <Reveal delay={2}>
              <div className="lp-feature-card">
                <span className="lp-feature-card-tag">02 / Fuel</span>
                <span className="lp-feature-card-icon">⚡</span>
                <h3 className="lp-feature-card-title">Nutrition Snapshots</h3>
                <p className="lp-feature-card-desc">
                  See calories, macros, and daily habits at a glance without turning food into a spreadsheet.
                </p>
              </div>
            </Reveal>

            <Reveal delay={3}>
              <div className="lp-feature-card">
                <span className="lp-feature-card-tag">03 / Coach</span>
                <span className="lp-feature-card-icon">☆</span>
                <h3 className="lp-feature-card-title">Trainer Booking</h3>
                <p className="lp-feature-card-desc">
                  Discover trusted trainers, compare specialties, and book a session that fits your week.
                </p>
              </div>
            </Reveal>

            <Reveal delay={4}>
              <div className="lp-feature-card">
                <span className="lp-feature-card-tag">04 / Community</span>
                <span className="lp-feature-card-icon">⟡</span>
                <h3 className="lp-feature-card-title">Community Feed</h3>
                <p className="lp-feature-card-desc">
                  Share wins, ask questions, and stay inspired by people who are putting in the work too.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════════ NUTRITION SECTION ════════════ */}
      <section className="lp-nutrition" id="nutrition">
        <div className="lp-container">
          <div className="lp-nutrition-inner">
            {/* Left — heading + image */}
            <div>
              <Reveal>
                <div className="lp-section-header">
                  <div className="lp-section-tag">Fuel the Work</div>
                  <h2 className="lp-section-heading">
                    Eat with
                    <br />
                    <span className="accent">intent.</span>
                    <br />
                    <strong>Train with
                    <br />
                    clarity.</strong>
                  </h2>
                  <p className="lp-section-sub" style={{ marginTop: 16 }}>
                    Nutrition tracking that gives you useful signals, not another source of noise.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={2}>
                <div className="lp-nutrition-image">
                  <img src={featureImg} alt="Athletes training with weights" loading="lazy" />
                </div>
              </Reveal>
            </div>

            {/* Right — numbered list */}
            <div>
              <div className="lp-numbered-list">
                <Reveal delay={1}>
                  <div className="lp-numbered-item">
                    <span className="lp-numbered-num">01</span>
                    <div>
                      <h3 className="lp-numbered-title">Log Your Meals in Seconds</h3>
                      <p className="lp-numbered-desc">
                        Capture meals, water, and habits in one clean daily view that keeps the signal clear.
                      </p>
                    </div>
                    <span className="lp-numbered-icon">⇌</span>
                  </div>
                </Reveal>

                <Reveal delay={2}>
                  <div className="lp-numbered-item">
                    <span className="lp-numbered-num">02</span>
                    <div>
                      <h3 className="lp-numbered-title">See Your Daily Balance</h3>
                      <p className="lp-numbered-desc">
                        Understand your calorie and macro rhythm without losing sight of the bigger picture.
                      </p>
                    </div>
                    <span className="lp-numbered-icon">⚡</span>
                  </div>
                </Reveal>

                <Reveal delay={3}>
                  <div className="lp-numbered-item">
                    <span className="lp-numbered-num">03</span>
                    <div>
                      <h3 className="lp-numbered-title">Build a Routine You Can Repeat</h3>
                      <p className="lp-numbered-desc">
                        Pair better fueling with your training history and make consistency feel measurable.
                      </p>
                    </div>
                    <span className="lp-numbered-icon">☑</span>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ TRAINERS SECTION ════════════ */}
      <section className="lp-trainers" id="trainers">
        <div className="lp-container">
          <div className="lp-trainers-inner">
            <Reveal>
              <div className="lp-section-header">
                <div className="lp-section-tag">Book Your Edge</div>
                <h2 className="lp-section-heading">
                  The right coach
                  <br />
                  <span className="accent">changes the equation.</span>
                </h2>
                <p className="lp-section-sub" style={{ marginTop: 16 }}>
                  Find specialists for strength, mobility, nutrition, and everything in between.
                  Book a session when you are ready to level up.
                </p>
                <div style={{ marginTop: 32 }}>
                  <Link to="/auth" className="lp-btn-primary">
                    Browse Trainers <span className="arrow" style={{ transform: 'rotate(-45deg)', display: 'inline-block' }}>↗</span>
                  </Link>
                </div>
              </div>
            </Reveal>

            <Reveal delay={2}>
              <div className="lp-community-preview" style={{ background: '#111' }}>
                <div className="lp-community-preview-header">Available Trainers</div>

                {[
                  { name: 'Sarah K.', specialty: 'Strength & Conditioning', rating: '4.9', sessions: '340+' },
                  { name: 'Marcus T.', specialty: 'Mobility & Recovery', rating: '4.8', sessions: '210+' },
                  { name: 'Alex P.', specialty: 'Nutrition & Performance', rating: '5.0', sessions: '180+' },
                ].map((trainer, i) => (
                  <div className="lp-feed-item" key={i}>
                    <div className="lp-feed-user">
                      <span className="lp-feed-avatar" style={{
                        background: ['#c8ff00', '#ff5555', '#5555ff'][i],
                        color: i === 0 ? '#000' : '#fff'
                      }}>
                        {trainer.name[0]}
                      </span>
                      <span className="lp-feed-name">{trainer.name}</span>
                      <span className="lp-feed-time">★ {trainer.rating}</span>
                    </div>
                    <div className="lp-feed-content">
                      {trainer.specialty} · {trainer.sessions} sessions
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════════ COMMUNITY SECTION ════════════ */}
      <section className="lp-community" id="community">
        <div className="lp-container">
          <div className="lp-community-inner">
            <div>
              <Reveal>
                <div className="lp-section-header">
                  <div className="lp-section-tag">Never Train Alone</div>
                  <h2 className="lp-section-heading">
                    Your fitness
                    <br />
                    <span className="accent">community.</span>
                  </h2>
                  <p className="lp-section-sub" style={{ marginTop: 16 }}>
                    Share wins, ask questions, and stay inspired by people who are putting in the work too.
                  </p>
                </div>
              </Reveal>

              <div className="lp-community-features">
                <Reveal delay={1}>
                  <div className="lp-community-feature">
                    <span className="lp-community-feature-icon">💬</span>
                    <div>
                      <div className="lp-community-feature-title">Share Wins</div>
                      <div className="lp-community-feature-desc">
                        Post your PRs, milestones, and progress photos to celebrate with others.
                      </div>
                    </div>
                  </div>
                </Reveal>

                <Reveal delay={2}>
                  <div className="lp-community-feature">
                    <span className="lp-community-feature-icon">🔥</span>
                    <div>
                      <div className="lp-community-feature-title">Stay Accountable</div>
                      <div className="lp-community-feature-desc">
                        Weekly check-ins and streak tracking keep you honest and motivated.
                      </div>
                    </div>
                  </div>
                </Reveal>

                <Reveal delay={3}>
                  <div className="lp-community-feature">
                    <span className="lp-community-feature-icon">🤝</span>
                    <div>
                      <div className="lp-community-feature-title">Find Training Partners</div>
                      <div className="lp-community-feature-desc">
                        Connect with athletes near you who share similar goals and schedules.
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>

            <Reveal delay={2}>
              <div className="lp-community-preview">
                <div className="lp-community-preview-header">Community Feed — Live</div>

                <div className="lp-feed-item">
                  <div className="lp-feed-user">
                    <span className="lp-feed-avatar">J</span>
                    <span className="lp-feed-name">Jordan M.</span>
                    <span className="lp-feed-time">2m ago</span>
                  </div>
                  <div className="lp-feed-content">
                    Just hit a 315lb deadlift PR! 🎉 Been working towards this for 12 weeks. The consistency paid off.
                  </div>
                </div>

                <div className="lp-feed-item">
                  <div className="lp-feed-user">
                    <span className="lp-feed-avatar" style={{ background: '#ff5555', color: '#fff' }}>R</span>
                    <span className="lp-feed-name">Riley S.</span>
                    <span className="lp-feed-time">8m ago</span>
                  </div>
                  <div className="lp-feed-content">
                    Week 6 of my cut — down 8lbs and strength is holding. Nutrition tracker has been a game changer.
                  </div>
                </div>

                <div className="lp-feed-item">
                  <div className="lp-feed-user">
                    <span className="lp-feed-avatar" style={{ background: '#5555ff', color: '#fff' }}>A</span>
                    <span className="lp-feed-name">Ava T.</span>
                    <span className="lp-feed-time">15m ago</span>
                  </div>
                  <div className="lp-feed-content">
                    First session with Coach Sarah — absolutely worth it. Already booked for next week 💪
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════════ CTA BANNER ════════════ */}
      <section style={{
        borderTop: '1px solid var(--lp-border)',
        padding: '100px 0',
        textAlign: 'center'
      }}>
        <div className="lp-container">
          <Reveal>
            <div className="lp-section-tag" style={{ textAlign: 'center' }}>Ready?</div>
            <h2 className="lp-section-heading" style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 24px' }}>
              Stop planning.
              <br />
              <span className="accent">Start training.</span>
            </h2>
            <p className="lp-section-sub" style={{ textAlign: 'center', margin: '0 auto 40px', maxWidth: 480 }}>
              Join 14,000+ athletes who track every rep, fuel every meal, and never train alone.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/auth" className="lp-btn-primary">
                Claim Free Trial <span className="arrow" style={{ transform: 'rotate(-45deg)', display: 'inline-block' }}>↗</span>
              </Link>
              <a href="#features" className="lp-btn-secondary">
                Explore Features <span>›</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════ FOOTER ════════════ */}
      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-footer-inner">
            <div className="lp-footer-brand">
              <div className="lp-footer-brand-name">
                <span className="lp-logo-badge" style={{ fontSize: 10, padding: '4px 8px' }}>WB</span>
                Workout Buddy
              </div>
              <p className="lp-footer-brand-desc">
                Your all-in-one fitness companion. Track workouts, monitor nutrition,
                book trainers, and connect with a community that pushes you forward.
              </p>
            </div>

            <div>
              <div className="lp-footer-col-title">Platform</div>
              <ul className="lp-footer-links">
                <li><a href="#features" className="lp-footer-link">Workout Tracking</a></li>
                <li><a href="#nutrition" className="lp-footer-link">Nutrition</a></li>
                <li><a href="#trainers" className="lp-footer-link">Trainers</a></li>
                <li><a href="#community" className="lp-footer-link">Community</a></li>
              </ul>
            </div>

            <div>
              <div className="lp-footer-col-title">Company</div>
              <ul className="lp-footer-links">
                <li><a href="#" className="lp-footer-link">About</a></li>
                <li><a href="#" className="lp-footer-link">Blog</a></li>
                <li><a href="#" className="lp-footer-link">Careers</a></li>
                <li><a href="#" className="lp-footer-link">Contact</a></li>
              </ul>
            </div>

            <div>
              <div className="lp-footer-col-title">Support</div>
              <ul className="lp-footer-links">
                <li><a href="#" className="lp-footer-link">Help Center</a></li>
                <li><a href="#" className="lp-footer-link">FAQ</a></li>
                <li><a href="#" className="lp-footer-link">Status</a></li>
                <li><a href="#" className="lp-footer-link">API Docs</a></li>
              </ul>
            </div>
          </div>

          <div className="lp-footer-bottom">
            <span className="lp-footer-copyright">© 2026 Workout Buddy. All rights reserved.</span>
            <div className="lp-footer-legal">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
