import { Component, useEffect, useLayoutEffect, useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Github, Linkedin, Code2, Server, Database, Boxes, Palette, CheckCircle2, Send, FileQuestion } from "lucide-react";
import { getSeo, normalizePath } from "./seo";
import { AdminLogin, AdminPosts, Posts } from "./Posts";
import PortfolioWorkspace, { WorkspaceWelcome } from "./PortfolioWorkspace";
import { projects } from "./projects";

const validPaths = new Set(["/", "/about", "/skills", "/projects", "/posts", "/contact", "/admin", "/admin/dashboard"]);

function setMeta(selector, attribute, value) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    const match = selector.match(/\[(name|property)="([^"]+)"\]/);
    if (match) element.setAttribute(match[1], match[2]);
    document.head.appendChild(element);
  }
  element.setAttribute(attribute, value);
}

function Seo() {
  const { pathname } = useLocation();
  useEffect(() => {
    const path = normalizePath(pathname);
    const isNotFound = !validPaths.has(path);
    const page = getSeo(path);
    document.title = isNotFound ? "Page Not Found | Aenuka" : page.title;
    setMeta('meta[name="description"]', "content", page.description);
    setMeta('meta[name="keywords"]', "content", page.keywords);
    setMeta('meta[property="og:title"]', "content", page.title);
    setMeta('meta[property="og:description"]', "content", page.description);
    setMeta('meta[property="og:url"]', "content", page.canonicalUrl);
    setMeta('meta[property="og:image"]', "content", page.image);
    setMeta('meta[property="og:image:alt"]', "content", page.imageAlt);
    setMeta('meta[name="twitter:title"]', "content", page.title);
    setMeta('meta[name="twitter:description"]', "content", page.description);
    setMeta('meta[name="twitter:image"]', "content", page.image);
    setMeta('meta[name="twitter:image:alt"]', "content", page.imageAlt);
    setMeta('meta[name="robots"]', "content", path.startsWith("/admin") || isNotFound ? "noindex, nofollow" : "index, follow");
    let structuredData = document.head.querySelector('script[data-page-schema]');
    if (!structuredData) {
      structuredData = document.createElement("script");
      structuredData.type = "application/ld+json";
      structuredData.dataset.pageSchema = "true";
      document.head.appendChild(structuredData);
    }
    structuredData.textContent = JSON.stringify(page.structuredData);
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = page.canonicalUrl;
  }, [pathname]);
  return null;
}

function ProjectArtwork({ index }) {
  return <div className={`project-artwork artwork-${index % 3}`} aria-hidden="true" data-motion-graphic>
    {index % 3 === 0 ? <div className="service-illustration"><div className="service-node service-main"><Server size={30}/></div><div className="service-line"/><div className="service-children">{[Database, Boxes, Code2].map((Icon, i) => <div className="service-node" key={i}><Icon size={23}/></div>)}</div><span className="artwork-caption">CONNECTED BY DESIGN</span></div>
      : index % 3 === 1 ? <div className="quiz-illustration"><span className="quiz-label">{index === 1 ? "Quizora" : "Cypress"}</span><div className="quiz-sheet"><div className="quiz-sheet-top"><span>{index === 1 ? "Knowledge, in motion." : "Confidence, by design."}</span><CheckCircle2 size={20}/></div>{[80, 60, 90].map((width,i) => <div className="quiz-answer" key={i}><span>{String(i+1).padStart(2,"0")}</span><i style={{width:`${width}%`}}/></div>)}</div></div>
      : <div className="harvest-illustration"><div className="harvest-sun"/><div className="harvest-leaf leaf-one"/><div className="harvest-leaf leaf-two"/><div className="harvest-leaf leaf-three"/><span className="artwork-caption">ROOTED IN POSSIBILITY</span></div>}
  </div>;
}

function WorkCard({ project, index }) {
  return <article className="work-card" data-reveal><a className="work-art-link" href={project.link} target="_blank" rel="noopener noreferrer" aria-label={`Explore ${project.title} on GitHub (opens in a new tab)`}><ProjectArtwork index={index}/><span className="work-arrow"><ArrowUpRight size={20}/></span></a><div className="work-details"><p className="work-role">{project.role}</p><h3>{project.title}</h3><p className="work-description">{project.desc}</p><div className="work-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div><a className="text-link mt-5" href={project.link} target="_blank" rel="noopener noreferrer">View project <ArrowUpRight size={15}/><span className="sr-only"> on GitHub (opens in a new tab)</span></a></div></article>;
}

function Home() {
  return <WorkspaceWelcome/>;
}

function ContactInvitation() {
  return <section className="contact-invitation" data-reveal><div className="shell"><p className="eyebrow">Good things start with a conversation</p><h2>What shall we build next?</h2><p>An idea, a collaboration, or simply a hello.</p><Link to="/contact" className="button-primary">Let’s talk <ArrowUpRight size={17}/></Link></div></section>;
}

function About() {
  const timeline = [["2019","The first spark","Started building small web experiences after discovering HTML."],["2019–20","A stronger base","Completed Computer Science and Advanced English certificates at NIBM."],["2020–23","Stayed curious","Studied ICT while steadily expanding my technical foundation."],["2023–Now","Engineering at scale","Studying Software Engineering at SLIIT and leading practical team projects."],["2026–Now","Backend engineering at Arimac","Started a new position as an Intern Backend Engineer at Arimac Digital."]];
  return <main className="page-enter pt-14 about-page">
    <section className="shell page-intro"><p className="eyebrow">About me</p><h1 className="headline mt-6 max-w-5xl">Curiosity started it.<br/><span className="gradient-text">Building keeps it going.</span></h1><p className="page-intro-description">I’m Aenuka Buddhakorala. Software engineer, lifelong learner,<br className="hidden md:block"/> and a believer in making things that matter.</p></section>
    <section className="bg-mist py-20 md:py-28" data-reveal><div className="shell grid gap-14 md:grid-cols-[.8fr_1.2fr]">
      <div><p className="text-2xl font-semibold tracking-tight">A builder at heart.</p><p className="mt-4 text-black/50">Intern Backend Engineer at Arimac Digital and a Software Engineering undergraduate at SLIIT.</p></div>
      <div className="space-y-6 text-xl leading-relaxed text-black/70"><p>I started by following HTML tutorials after my O/L exams and became fascinated by the immediacy of turning an idea into something people can use.</p><p>Today, I’m growing as an Intern Backend Engineer at Arimac Digital while continuing to work across frontend, backend, mobile, and distributed systems. I care about calm interfaces, understandable code, and teams that learn together.</p></div>
    </div></section>
    <section className="shell section-space"><p className="eyebrow">My path</p><h2 className="section-title mt-5">One idea led to another.</h2><div className="journey-timeline">{timeline.map(([year,title,text]) => <div key={year} className="journey-step" data-reveal><p className="journey-year">{year}</p><h3>{title}</h3><p className="journey-description">{text}</p></div>)}</div></section><ContactInvitation/>
  </main>
}

const skillGroups = [
  {icon: Code2, title:"Product interfaces", text:"Fast, accessible experiences with attention to interaction and detail.", skills:["React","JavaScript","HTML","CSS","Tailwind CSS"]},
  {icon: Server, title:"Backend systems", text:"Maintainable services and APIs designed around real product needs.", skills:["Java","Spring Boot","Node.js","Express.js","Python"]},
  {icon: Database, title:"Data & infrastructure", text:"Solid data models and dependable development workflows.", skills:["SQL","MongoDB","Docker","Kubernetes","GitHub"]},
  {icon: Palette, title:"Quality & collaboration", text:"From design handoff to automated confidence in every release.", skills:["Figma","Cypress","Jira","Agile","Scrum"]},
];
function Skills() {
  return <main className="page-enter bg-mist pt-14"><section className="shell page-intro text-center"><p className="eyebrow">Skills & capabilities</p><h1 className="headline mx-auto mt-6 max-w-4xl">Built on a solid foundation.<br/><span className="gradient-text">Open to what’s next.</span></h1><p className="page-intro-description mx-auto max-w-xl">A growing toolkit for thoughtful interfaces, dependable systems, and everything that connects them.</p></section>
  <section className="shell grid gap-5 pb-24 md:grid-cols-2">{skillGroups.map(({icon:Icon,title,text,skills},index) => <article key={title} data-reveal className="skill-card card bg-white p-8 md:p-11"><div className="flex items-center justify-between"><div className="skill-icon"><Icon size={30} strokeWidth={1.5}/></div><span className="text-sm text-black/35">0{index+1}</span></div><h2 className="mt-14 text-3xl font-semibold tracking-tight">{title}</h2><p className="mt-3 max-w-md leading-relaxed text-black/50">{text}</p><div className="work-tags mt-8">{skills.map(x=><span key={x}>{x}</span>)}</div></article>)}</section><ContactInvitation/></main>
}


function Projects() {
  return <main className="page-enter pt-14 bg-mist"><section className="shell page-intro"><p className="eyebrow">Selected work</p><h1 className="headline mt-6 max-w-5xl">From a spark of an idea.<br/><span className="gradient-text">To something useful.</span></h1><p className="page-intro-description">A collection of systems, experiences, and lessons learned along the way.</p></section>
  <section className="shell pb-24"><h2 className="sr-only">Project collection</h2><div className="work-grid projects-grid">{projects.map((project,index)=><WorkCard key={project.title} project={project} index={index}/>)}</div></section><ContactInvitation/></main>
}

function Contact() {
  const [state,setState] = useState({status:"idle",message:""});
  async function submit(e) {
    e.preventDefault(); setState({status:"sending",message:""});
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch("/.netlify/functions/submit-contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
      const body = await res.json().catch(()=>({}));
      if(!res.ok) {
        const localHint = res.status === 404
          ? "The contact service is temporarily unavailable. Please connect with me on LinkedIn or try again later."
          : `Contact service failed (${res.status}). Please try again shortly.`;
        throw new Error(body.error || localHint);
      }
      form.reset();
      setState(body.warning
        ? {status:"warning",message:`Message saved, but email was not sent: ${body.warning}`}
        : {status:"sent",message:"Thanks — your message is on its way."});
    } catch(err) { setState({status:"error",message:err.message || "Please try again."}); }
  }
  return <main className="page-enter bg-mist pt-14"><section className="shell grid min-h-[calc(100vh-3.5rem)] gap-16 py-20 md:grid-cols-2 md:items-center md:py-28">
    <div><p className="eyebrow">Get in touch</p><h1 className="headline mt-6">Great things start<br/><span className="gradient-text">with hello.</span></h1><p className="mt-7 max-w-md text-lg leading-relaxed text-black/50">I’m an Intern Backend Engineer at Arimac Digital and open to collaborations and conversations about software and product design.</p><div className="contact-socials mt-12"><a aria-label="Aenuka on GitHub (opens in a new tab)" href="https://github.com/Aenuka" target="_blank" rel="noreferrer"><Github size={19}/> GitHub <ArrowUpRight size={15}/></a><a aria-label="Aenuka on LinkedIn (opens in a new tab)" href="https://lk.linkedin.com/in/aenuka" target="_blank" rel="noreferrer"><Linkedin size={19}/> LinkedIn <ArrowUpRight size={15}/></a></div></div>
    <form onSubmit={submit} className="contact-form rounded-[2rem] bg-white p-7 shadow-xl shadow-black/[.04] md:p-10">
      <h2 className="mb-7 text-2xl font-semibold tracking-tight">Let’s make a connection.</h2>
      <div className="grid gap-6"><label className="text-sm font-medium">Name<input required autoComplete="name" name="name" className="mt-2 w-full rounded-xl border bg-mist px-4 py-3.5 font-normal outline-none focus:border-blue" placeholder="Your name"/></label><label className="text-sm font-medium">Email<input required autoComplete="email" type="email" name="email" className="mt-2 w-full rounded-xl border bg-mist px-4 py-3.5 font-normal outline-none focus:border-blue" placeholder="you@example.com"/></label><label className="text-sm font-medium">Message<textarea required name="message" rows="5" className="mt-2 w-full resize-none rounded-xl border bg-mist px-4 py-3.5 font-normal outline-none focus:border-blue" placeholder="Tell me a little about your idea."/></label><button disabled={state.status==="sending"} className="button-primary w-full disabled:opacity-50">{state.status==="sending" ? "Sending…" : <>Send message <Send size={16}/></>}</button><p role="status" aria-live="polite" className={`flex items-center gap-2 text-sm ${state.status==="sent" ? "text-green-600" : state.status==="warning" ? "text-amber-600" : "text-red-600"}`}>{state.status==="sent"&&<CheckCircle2 size={16}/>} {state.message}</p></div>
    </form>
  </section></main>
}

function NotFound() {
  return <main className="page-enter flex min-h-[calc(100vh-3.5rem)] items-center bg-mist px-5 pt-14">
    <section className="mx-auto max-w-2xl py-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.35rem] bg-white text-blue shadow-sm">
        <FileQuestion size={29} strokeWidth={1.5}/>
      </div>
      <p className="eyebrow mt-8">Error 404</p>
      <h1 className="mt-4 text-[clamp(2.7rem,7vw,5.5rem)] font-semibold leading-[.98] tracking-[-.055em]">Page not found.</h1>
      <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-black/50">The page you’re looking for may have moved, or the address might be incorrect.</p>
      <Link to="/" className="button-primary mt-9">Go to homepage <ArrowRight size={16}/></Link>
    </section>
  </main>;
}

function ScrollTop() {
  const { pathname } = useLocation();
  useLayoutEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: "instant" }); }, [pathname]);
  return null;
}

function RouteProgress() {
  const { pathname } = useLocation();
  return <div key={pathname} className="route-progress" aria-hidden="true"/>;
}

function MotionExperience() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (!window.IntersectionObserver || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const elements = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    elements.forEach(element => { element.classList.add("reveal-pending"); observer.observe(element); });
    return () => observer.disconnect();
  }, [pathname]);
  return null;
}

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Page rendering failed", error, errorInfo);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return <main className="flex min-h-screen items-center bg-mist px-5">
      <section className="mx-auto max-w-xl text-center">
        <p className="eyebrow">Something went wrong</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">This page couldn’t load.</h1>
        <p className="mt-5 text-black/50">Please reload the page to try again.</p>
        <button type="button" className="button-primary mt-8" onClick={() => window.location.reload()}>Reload page</button>
      </section>
    </main>;
  }
}

export default function App() {
  const location = useLocation();
  const isAdminDashboard = location.pathname === "/admin/dashboard";
  const pages = <Routes><Route path="/" element={<Home/>}/><Route path="/about" element={<About/>}/><Route path="/skills" element={<Skills/>}/><Route path="/projects" element={<Projects/>}/><Route path="/posts" element={<Posts/>}/><Route path="/admin" element={<AdminLogin/>}/><Route path="/admin/dashboard" element={<AdminPosts/>}/><Route path="/contact" element={<Contact/>}/><Route path="*" element={<NotFound/>}/></Routes>;
  return <AppErrorBoundary><Seo/><ScrollTop/><MotionExperience/><RouteProgress/><a className="skip-link" href={`${location.pathname}#main-content`}>Skip to content</a>{isAdminDashboard ? <div id="main-content">{pages}</div> : <PortfolioWorkspace>{pages}</PortfolioWorkspace>}</AppErrorBoundary>;
}
