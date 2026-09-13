import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  AudioWaveform,
  ChevronDown,
  CircleDot,
  Facebook,
  Film,
  Headphones,
  Instagram,
  Linkedin,
  Menu,
  Mic2,
  Music2,
  Piano,
  Radio,
  SlidersHorizontal,
  Sparkles,
  Volume2,
  VolumeX,
  Waves,
  X,
  Youtube,
} from 'lucide-react';

const orchestraImage = 'https://images.pexels.com/photos/2296100/pexels-photo-2296100.jpeg?auto=compress&cs=tinysrgb&h=1800&w=2400';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Work', path: '/work' },
  { label: 'Services', path: '/services' },
  { label: 'Contact', path: '/contact' },
];

const socialLinks = [
  { label: 'Instagram', href: 'https://www.instagram.com/drimelproductions?stkn=MTlvazJ6NGh3NnUwOA==', icon: Instagram },
  { label: 'Facebook', href: 'https://www.facebook.com/share/18SPLgyPvn/?mibextid=wwXIfr', icon: Facebook },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/drim%C3%A8l-productions/', icon: Linkedin },
  { label: 'YouTube', href: 'https://youtube.com/@drimelproductions?si=ZB8AZOp1QiUvyIee', icon: Youtube },
];

const tracks = [
  '6zCRxw9s3uak9hOc2Zrtyi',
  '6N78o6UnFgjGXHkN50uoyS',
  '5Y1LNJKIjgZIsrkiAeKSQj',
  '2mwnyvxZvoVSXnO9BAwVn3',
  '0z8AUAjiQp61jUTVd6bL6Q',
];

const services = [
  { number: '01', title: 'Music Composition', text: 'Original compositions tailored to the emotional and narrative requirements of each project.', icon: Music2 },
  { number: '02', title: 'Music Production', text: 'From musical concept to arrangement, production and final master.', icon: SlidersHorizontal },
  { number: '03', title: 'Orchestration', text: 'Symphonic arrangements, ensemble writing and cinematic orchestration.', icon: Piano },
  { number: '04', title: 'Background Score', text: 'Music for films, theatre, documentaries, digital content and visual storytelling.', icon: Film },
  { number: '05', title: 'Film & Theatre Music', text: 'Narrative-driven music designed around scenes, characters and dramatic structure.', icon: Sparkles },
  { number: '06', title: 'Advertising & Jingles', text: 'Original music and memorable sonic identities for brands and campaigns.', icon: Radio },
  { number: '07', title: 'Recording & Mixing', text: 'Professional recording, editing and mixing for vocals, instruments and productions.', icon: Headphones },
  { number: '08', title: 'Vocal Production', text: 'Vocal arrangement, recording direction and production.', icon: Mic2 },
  { number: '09', title: 'Live Orchestra Production', text: 'Production support for live ensemble and orchestral performances.', icon: AudioWaveform },
  { number: '10', title: 'Sound Design', text: 'Atmospheric soundscapes and sonic elements for visual media.', icon: Waves },
];

const pageMeta: Record<string, { title: string; description: string }> = {
  '/': { title: 'D’Rimél Productions | Music Production, Composition & Orchestration', description: 'D’Rimél Productions is a professional music production house specializing in music composition, production, orchestration, background scores, film and theatre music, recording, mixing and cinematic soundscapes.' },
  '/about': { title: 'About D’Rimél Productions | Music & Orchestration', description: 'Discover the creative house and musical philosophy behind D’Rimél Productions.' },
  '/work': { title: 'Works | D’Rimél Productions', description: 'Listen to selected music from D’Rimél Productions for listening, storytelling and visual imagination.' },
  '/services': { title: 'Music Production Services | D’Rimél Productions', description: 'Composition, production, orchestration, scoring, recording, mixing and sound design.' },
  '/contact': { title: 'Contact D’Rimél Productions', description: 'Start a project with D’Rimél Productions.' },
};

function navigate(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function Logo({ compact = false }: { compact?: boolean }) {
  return <img className={compact ? 'brand-logo brand-logo--compact' : 'brand-logo'} src="/Logo.png" alt="D’Rimél Productions" />;
}

function SocialLinks() {
  return <div className="social-links" aria-label="Social media links">
    {socialLinks.map(({ label, href, icon: Icon }) => <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}><Icon size={16} strokeWidth={1.5} /></a>)}
  </div>;
}

function AudioController({ route }: { route: string }) {
  const [enabled, setEnabled] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const spotifyPlayingRef = useRef(false);

  const startSound = async () => {
    if (!enabled || spotifyPlayingRef.current) return;

    if (!audioRef.current) {
      const audio = new Audio('/drimel-ambient-score.mp3');
      audio.loop = true;
      audio.volume = 0.18;
      audioRef.current = audio;
    }

    if (audioRef.current.paused) {
      try {
        await audioRef.current.play();
      } catch {
        console.log('Autoplay blocked. Waiting for user interaction.');
      }
    }
  };

  const stopSound = () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }
  };

  useEffect(() => {
    const handleSpotifyPlayback = (event: Event) => {
      const customEvent = event as CustomEvent<{ playing: boolean }>;
      const playing = customEvent.detail?.playing;

      spotifyPlayingRef.current = playing;

      if (playing) {
        stopSound();
      } else if (enabled) {
        startSound();
      }
    };

    window.addEventListener(
      'spotify-playback',
      handleSpotifyPlayback
    );

    const handleFirstInteraction = () => {
      if (!spotifyPlayingRef.current && enabled) {
        startSound();
      }
    };

    window.addEventListener('click', handleFirstInteraction, {
      once: true,
    });

    window.addEventListener('touchstart', handleFirstInteraction, {
      once: true,
    });

    window.addEventListener('keydown', handleFirstInteraction, {
      once: true,
    });

    if (enabled && !spotifyPlayingRef.current) {
      startSound();
    }

    return () => {
      window.removeEventListener(
        'spotify-playback',
        handleSpotifyPlayback
      );

      window.removeEventListener(
        'click',
        handleFirstInteraction
      );

      window.removeEventListener(
        'touchstart',
        handleFirstInteraction
      );

      window.removeEventListener(
        'keydown',
        handleFirstInteraction
      );
    };
  }, [enabled]);

  const toggle = () => {
    if (enabled) {
      setEnabled(false);
      stopSound();
    } else {
      setEnabled(true);

      if (!spotifyPlayingRef.current) {
        startSound();
      }
    }
  };

  return (
    <button
      className="sound-toggle"
      onClick={toggle}
      aria-label={enabled ? 'Turn sound off' : 'Turn sound on'}
    >
      {enabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
      <span>SOUND {enabled ? 'ON' : 'OFF'}</span>
    </button>
  );
}
function Header({ route }: { route: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <header className={`site-header ${scrolled ? 'site-header--scrolled' : ''}`}>
      <div className="header-inner">
        <button
          className="logo-button"
          onClick={() => go('/')}
          aria-label="Go to home"
        >
          <Logo compact />
        </button>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={route === item.path ? 'active' : ''}
              onClick={() => go(item.path)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="header-actions">
          <SocialLinks />
          <AudioController route={route} />

          <button
            className="menu-button"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close navigation' : 'Open navigation'}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mobile-menu">
          <div className="mobile-menu__links">
            {navItems.map((item) => (
              <button
                key={item.path}
                className={route === item.path ? 'active' : ''}
                onClick={() => go(item.path)}
              >
                {item.label}
                <ArrowUpRight size={16} />
              </button>
            ))}
          </div>

          <div className="mobile-menu__footer">
            <SocialLinks />
          </div>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return <footer className="site-footer"><div className="footer-grid"><div><Logo /><p className="footer-note">Music • Composition • Production • Orchestration</p></div><div><p className="footer-label">Quick links</p><div className="footer-links">{navItems.map((item) => <button key={item.path} onClick={() => navigate(item.path)}>{item.label}</button>)}</div></div><div><p className="footer-label">Contact</p><a href="mailto:info@drimelproductions.com">info@drimelproductions.com</a><a href="tel:+918448033672">+91 8448033672</a></div><div><p className="footer-label">Social</p><SocialLinks /></div></div><div className="footer-bottom"><span>© 2026 D’Rimél Productions. All Rights Reserved.</span><span>Delhi · India</span></div></footer>;
}

function SectionHeading({ eyebrow, title, text, align = 'left' }: { eyebrow: string; title: string; text?: string; align?: 'left' | 'center' }) {
  return <div className={`section-heading section-heading--${align}`}><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{text && <p>{text}</p>}</div>;
}

function Waveform({ compact = false }: { compact?: boolean }) {
  return <div className={`waveform ${compact ? 'waveform--compact' : ''}`} aria-hidden="true">{Array.from({ length: compact ? 18 : 32 }).map((_, index) => <i key={index} style={{ height: `${18 + ((index * 17) % 58)}%`, animationDelay: `${index * 0.045}s` }} />)}</div>;
}

function PageTransition({ children, route }: { children: ReactNode; route: string }) {
  return <main key={route} className="page-transition">{children}</main>;
}

function ButtonLink({ children, path, secondary = false }: { children: ReactNode; path: string; secondary?: boolean }) {
  return <button className={`button-link ${secondary ? 'button-link--secondary' : ''}`} onClick={() => navigate(path)}>{children}{!secondary && <ArrowRight size={16} />}</button>;
}

function Hero({ children, eyebrow, title, text, image = false }: { children?: ReactNode; eyebrow: string; title: string; text?: string; image?: boolean }) {
  return <section className={`page-hero ${image ? 'page-hero--image' : ''}`} style={image ? { backgroundImage: `url(${orchestraImage})` } : undefined}><div className="page-hero__inner"><span className="eyebrow reveal reveal--one">{eyebrow}</span><h1 className="reveal reveal--two">{title}</h1>{text && <p className="hero-copy reveal reveal--three">{text}</p>}{children}</div>{image && <div className="hero-scroll"><span>Scroll to listen</span><Waveform compact /></div>}</section>;
}

type SpotifyController = {
  play: () => void;
  pause: () => void;
  addListener: (
    event: string,
    callback: (event: any) => void
  ) => void;
};

const spotifyControllers = new Map<string, SpotifyController>();

let activeSpotifyTrackId: string | null = null;

let spotifyApiPromise: Promise<any> | null = null;

function getSpotifyAPI() {
  if (spotifyApiPromise) return spotifyApiPromise;

  spotifyApiPromise = new Promise((resolve) => {
    if ((window as any).IFrameAPI) {
      resolve((window as any).IFrameAPI);
      return;
    }

    (window as any).onSpotifyIframeApiReady = (IFrameAPI: any) => {
      resolve(IFrameAPI);
    };
  });

  return spotifyApiPromise;
}

function SpotifyTrackEmbed({
  id,
  index,
}: {
  id: string;
  index: number;
}) {
  const embedRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let controller: SpotifyController | null = null;
    let mounted = true;

    const setupSpotify = async () => {
      const IFrameAPI = await getSpotifyAPI();

      if (!mounted || !embedRef.current) return;

      const options = {
        width: '100%',
        height: 152,
        uri: `spotify:track:${id}`,
      };

      IFrameAPI.createController(
        embedRef.current,
        options,
        (EmbedController: SpotifyController) => {
          if (!mounted) return;

          controller = EmbedController;
          spotifyControllers.set(id, EmbedController);

          EmbedController.addListener(
  'playback_started',
  () => {
    // Pause all other Spotify tracks
    spotifyControllers.forEach(
      (otherController, otherId) => {
        if (otherId !== id) {
          otherController.pause();
        }
      }
    );

    // Remember the currently playing track
    activeSpotifyTrackId = id;

    // Pause website background music
    window.dispatchEvent(
      new CustomEvent('spotify-playback', {
        detail: { playing: true },
      })
    );
  }
);


          EmbedController.addListener(
  'playback_update',
  (event: any) => {
    const data = event?.data;

    if (!data) return;

    // Ignore events from tracks that are not currently active
    if (activeSpotifyTrackId !== id) return;

    // Spotify track paused
    if (data.isPaused) {
      activeSpotifyTrackId = null;

      window.dispatchEvent(
        new CustomEvent('spotify-playback', {
          detail: { playing: false },
        })
      );

      return;
    }

    // Spotify track finished
    if (
      data.duration > 0 &&
      data.position >= data.duration - 1000
    ) {
      activeSpotifyTrackId = null;

      window.dispatchEvent(
        new CustomEvent('spotify-playback', {
          detail: { playing: false },
        })
      );
    }
  }
);

          }
        );
      };

    setupSpotify();

    return () => {
      mounted = false;

      if (controller) {
        spotifyControllers.delete(id);
      }
    };
  }, [id]);

  return (
    <article className="work-card">
      <div className="work-card__meta">
        <span>
          Track {String(index + 1).padStart(2, '0')}
        </span>
        <CircleDot size={12} />
      </div>

      <div
        ref={embedRef}
        aria-label={`Spotify track ${index + 1}`}
      />
    </article>
  );
}

function HomePage() {
  return <><section className="home-hero" style={{ backgroundImage: `url(${orchestraImage})` }}><div className="home-hero__content"><span className="eyebrow reveal reveal--one">Music • Composition • Production • Orchestration</span><h1 className="reveal reveal--two">Where a thought<br /><em>becomes a Melody</em></h1><p className="hero-copy reveal reveal--three">D’Rimél Productions composes symphonic works that fuse Western classical discipline, the freedom of jazz, and the soul of world traditions — scores built for the screen, the stage, and the space between.</p><div className="hero-actions reveal reveal--four"><ButtonLink path="/work">Explore the work</ButtonLink><ButtonLink path="/contact" secondary>Commission a score</ButtonLink></div></div><div className="hero-scroll"><span>Scroll to listen</span><Waveform compact /></div></section><section className="intro-section content-shell"><div className="intro-visual"><div className="orbit orbit--one" /><div className="orbit orbit--two" /><AudioWaveform size={210} strokeWidth={0.8} /><span className="visual-caption">DRP / 2026</span></div><div className="intro-copy"><span className="eyebrow">The sound of D’Rimél</span><h2>A room for<br /><em>uncommon sound.</em></h2><p>D’Rimél Productions is a contemporary music production house creating original compositions, orchestration, scores and sound experiences for film, theatre, advertising, artists and visual storytelling.</p><ButtonLink path="/services">Discover our services</ButtonLink></div></section><section className="pillars-section content-shell"><SectionHeading eyebrow="The house is built on" title="Four creative pillars." /><div className="pillar-grid">{[{ title: 'Composition', text: 'Original musical ideas shaped into emotionally meaningful compositions.', icon: Music2 }, { title: 'Orchestration', text: 'Symphonic writing, ensemble arrangements and cinematic orchestration.', icon: Piano }, { title: 'Sound', text: 'Recording, production, mixing and atmospheric sound design.', icon: Headphones }, { title: 'Story', text: 'Music created around films, theatre, advertising, artists and visual narratives.', icon: Film }].map(({ title, text, icon: Icon }, index) => <article className="pillar-card" key={title}><span className="pillar-number">0{index + 1}</span><Icon size={25} strokeWidth={1.2} /><h3>{title}</h3><p>{text}</p><ArrowUpRight className="pillar-arrow" size={18} /></article>)}</div></section><section className="featured-section content-shell"><div className="featured-header"><SectionHeading eyebrow="From the catalogue" title="Selected works." text="A small listening room for music made to move through image, memory and atmosphere." /><ButtonLink path="/work">View all works</ButtonLink></div><div className="featured-grid">{tracks.slice(0, 3).map((id, index) => <SpotifyTrackEmbed key={id} id={id} index={index} />)}</div></section><section className="closing-cta"><div><span className="eyebrow">The next movement</span><h2>Have a story<br /><em>that needs music?</em></h2><p>Let's create something extraordinary.</p><ButtonLink path="/contact">Start a project</ButtonLink></div></section></>;
}

function AboutPage() {
  return <><Hero eyebrow="The house" title="About the house" text="D’Rimél Productions is a contemporary music production house dedicated to creating emotionally powerful, technically refined and cinematic musical experiences." /><section className="editorial-section content-shell"><div className="editorial-index">01 <span /> Approach</div><div className="editorial-body"><h2>Music with a point of view.</h2><p>We work at the intersection of composition and production, bringing structure, colour and feeling into the same frame. Every piece begins with the story it needs to serve — then finds its own language through orchestration, texture and performance.</p><p>Our work moves across background scoring, film, theatre, advertising, artists, recording, mixing and acoustic soundscapes. The process is collaborative, considered and responsive to the world around the music.</p></div></section><section className="philosophy-section content-shell"><div><span className="eyebrow">Creative philosophy</span><h2>Music serves<br /><em>the story.</em></h2></div><div className="philosophy-art"><Waveform /><p>Emotion / Atmosphere / Narrative / Image</p></div><p className="philosophy-copy">The strongest score does not compete for attention. It deepens the moment, gives shape to silence and lets the audience feel what an image cannot say alone.</p></section><FounderSection /></>;
}

function FounderSection() {
  return <section className="founder-section content-shell"><div className="founder-image"><img src="/images/founder-portrait.png" alt="Hrishabh Saxena at the piano" /><div className="image-caption">Hrishabh Saxena / Music Director</div></div><div className="founder-copy"><span className="eyebrow">The founder</span><h2>Hrishabh<br /><em>Saxena</em></h2><p className="founder-role">Founder • Music Director • Composer • Producer • Multi-Instrumentalist</p><p>Hrishabh Saxena is a Music Director, Composer, Producer and Multi-Instrumentalist with extensive experience in music performance, composition, production and orchestration.</p><p>With around 15 years of experience with musical instruments, Piano is his primary instrument. He also works with harmonica, mandolin, flute, cajon, melodica, violin, harmonium, guitar and other instruments.</p><p>His musical knowledge and creative interests span Western Classical, Symphony Orchestra, Jazz, Rock, Fusion, Bollywood, Latin Music, Flamenco, Indian Classical Music, Indian Raagas and contemporary cinematic scoring.</p><p>His approach bridges Indian musical traditions, Western classical, orchestral, jazz and contemporary production.</p><ButtonLink path="/contact">Collaborate with Hrishabh</ButtonLink></div></section>;
}

function WorkPage() {
  return <><Hero eyebrow="The catalogue" title="Selected works" text="Music created for listening, storytelling and visual imagination." /><section className="works-section content-shell"><div className="works-intro"><span className="eyebrow">Listen in full</span><p>Five pieces from the D’Rimél catalogue, presented through Spotify.</p></div><div className="works-grid">{tracks.map((id, index) => <SpotifyTrackEmbed key={id} id={id} index={index} />)}</div></section></>;
}

function ServicesPage() {
  return <><Hero eyebrow="What we make" title="Music, composed with purpose." text="From the first musical idea to the final master, every detail is shaped around feeling, narrative and sound." /><section className="services-section content-shell">{services.map(({ number, title, text, icon: Icon }) => <article className="service-row" key={title}><span className="service-number">{number}</span><Icon className="service-icon" size={27} strokeWidth={1.1} /><h2>{title}</h2><p>{text}</p><ArrowUpRight className="service-arrow" size={21} /></article>)}</section><section className="services-cta content-shell"><span className="eyebrow">Have a brief?</span><h2>Let's find the<br /><em>right frequency.</em></h2><ButtonLink path="/contact">Start a conversation</ButtonLink></section></>;
}

type FormValues = { name: string; email: string; mobile: string; company: string; projectType: string; budget: string; description: string; timeline: string; referral: string; consent: boolean };
const initialForm: FormValues = { name: '', email: '', mobile: '', company: '', projectType: '', budget: '', description: '', timeline: '', referral: '', consent: false };

function ContactForm() {
  const [values, setValues] = useState<FormValues>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const update = (key: keyof FormValues, value: string | boolean) => setValues((current) => ({ ...current, [key]: value }));
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Partial<Record<keyof FormValues, string>> = {};
    if (!values.name.trim()) next.name = 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = 'Please enter a valid email address.';
    if (values.mobile && !/^[+\d][\d\s()-]{7,}$/.test(values.mobile)) next.mobile = 'Please enter a valid mobile number.';
    if (!values.description.trim() || values.description.trim().length < 30) next.description = 'Please share at least 30 characters about the project.';
    if (!values.consent) next.consent = 'Please confirm that we may contact you about this enquiry.';
    setErrors(next);
    if (!Object.keys(next).length) setSubmitted(true);
  };
  if (submitted) return <div className="form-success"><Sparkles size={28} strokeWidth={1.2} /><span className="eyebrow">Enquiry received</span><h2>Thank you.</h2><p>Your enquiry has been received. The D’Rimél Productions team will get back to you soon.</p><button className="text-link" onClick={() => { setSubmitted(false); setValues(initialForm); }}>Send another enquiry <ArrowRight size={15} /></button></div>;
  return <form className="contact-form" onSubmit={submit} noValidate><div className="form-grid"><Field label="Full Name *" value={values.name} onChange={(value) => update('name', value)} error={errors.name} /><Field label="Email Address *" type="email" value={values.email} onChange={(value) => update('email', value)} error={errors.email} /><Field label="Mobile Number" value={values.mobile} onChange={(value) => update('mobile', value)} error={errors.mobile} /><Field label="Company / Organization" value={values.company} onChange={(value) => update('company', value)} /><SelectField label="Project Type" value={values.projectType} onChange={(value) => update('projectType', value)} options={['Film', 'Theatre', 'Advertising', 'Album / Single', 'Other']} /><SelectField label="Budget Range" value={values.budget} onChange={(value) => update('budget', value)} options={['To be discussed', 'Under ₹1L', '₹1L – ₹5L', '₹5L+']} /><Field label="Preferred Timeline" value={values.timeline} onChange={(value) => update('timeline', value)} /><Field label="How did you hear about us?" value={values.referral} onChange={(value) => update('referral', value)} /></div><label className="field field--full"><span>Project Description *</span><textarea rows={6} value={values.description} onChange={(event) => update('description', event.target.value)} placeholder="Tell us about the world this music needs to inhabit." />{errors.description && <small>{errors.description}</small>}</label><label className="consent-field"><input type="checkbox" checked={values.consent} onChange={(event) => update('consent', event.target.checked)} /><span>I consent to D’Rimél Productions contacting me about this project enquiry. *</span></label>{errors.consent && <small className="consent-error">{errors.consent}</small>}<button className="button-link form-submit" type="submit">Send project enquiry <ArrowRight size={16} /></button></form>;
}

function Field({ label, value, onChange, error, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; error?: string; type?: string }) {
  return <label className="field"><span>{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} />{error && <small>{error}</small>}</label>;
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return <label className="field"><span>{label}</span><div className="select-wrap"><select value={value} onChange={(event) => onChange(event.target.value)}><option value="">Select one</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select><ChevronDown size={16} /></div></label>;
}

function ContactPage() {
  return <><Hero eyebrow="Start a project" title="Let's create something extraordinary." text="Have a film, theatre production, advertisement, album, single or musical idea? Let's bring it to life." /><section className="contact-section content-shell"><div className="contact-details"><span className="eyebrow">Say hello</span><h2>Begin with<br /><em>a feeling.</em></h2><p>Tell us where the project is going. We’ll meet you there with the right instruments, instincts and collaborators.</p><div className="contact-list"><div><span>Email</span><a href="mailto:info@drimelproductions.com">info@drimelproductions.com</a></div><div><span>Mobile</span><a href="tel:+918448033672">+91 8448033672</a></div></div><SocialLinks /></div><div className="form-wrap"><ContactForm /></div></section></>;
}

function App() {
  const [route, setRoute] = useState(window.location.pathname);
  useEffect(() => {
    const onPopState = () => setRoute(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);
  useEffect(() => {
    const meta = pageMeta[route] ?? pageMeta['/'];
    document.title = meta.title;
    let description = document.querySelector('meta[name="description"]');
    if (!description) { description = document.createElement('meta'); description.setAttribute('name', 'description'); document.head.appendChild(description); }
    description.setAttribute('content', meta.description);
  }, [route]);
  const page = route === '/about' ? <AboutPage /> : route === '/work' ? <WorkPage /> : route === '/services' ? <ServicesPage /> : route === '/contact' ? <ContactPage /> : <HomePage />;
  return <div className="app-shell"><Header route={route} /><PageTransition route={route}>{page}</PageTransition><Footer /></div>;
}

export default App;
