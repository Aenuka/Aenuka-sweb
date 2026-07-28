import { useEffect, useState } from "react";
import { Routes, Route, NavLink, Link, useLocation } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Github, Linkedin, Instagram, Menu, X, Code2, Server, Database, Boxes, Palette, CheckCircle2, Send } from "lucide-react";

const nav = [["About", "/about"], ["Skills", "/skills"], ["Projects", "/projects"], ["Contact", "/contact"]];
const seo = {
  "/": {
    title: "Aenuka Buddhakorala | Software Engineer",
    description: "Aenuka Buddhakorala is a software engineer in Sri Lanka building thoughtful web applications, backend systems, and digital products.",
  },
  "/about": {
    title: "About Aenuka Buddhakorala | Software Engineer",
    description: "Learn about Aenuka Buddhakorala’s software engineering journey, education at SLIIT, interests, and approach to building digital products.",
  },
  "/skills": {
    title: "Software Engineering Skills | Aenuka Buddhakorala",
    description: "Explore Aenuka Buddhakorala’s skills across React, JavaScript, Spring Boot, Node.js, databases, Docker, Kubernetes, design, and testing.",
  },
  "/projects": {
    title: "Software Projects | Aenuka Buddhakorala",
    description: "Explore software projects by Aenuka Buddhakorala, including healthcare microservices, Quizora, Cey Harvest, MERN systems, and Cypress testing.",
  },
  "/contact": {
    title: "Contact Aenuka Buddhakorala | Software Engineer",
    description: "Contact Aenuka Buddhakorala for software engineering opportunities, internships, collaborations, and digital product development.",
  },
};

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
    const page = seo[pathname] || seo["/"];
    const canonicalUrl = `https://www.aenuin.com${pathname === "/" ? "/" : pathname}`;
    document.title = page.title;
    setMeta('meta[name="description"]', "content", page.description);
    setMeta('meta[property="og:title"]', "content", page.title);
    setMeta('meta[property="og:description"]', "content", page.description);
    setMeta('meta[property="og:url"]', "content", canonicalUrl);
    setMeta('meta[name="twitter:title"]', "content", page.title);
    setMeta('meta[name="twitter:description"]', "content", page.description);
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }, [pathname]);
  return null;
}

function Header() {
  const [open, setOpen] = useState(false);
  return <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/90 text-white backdrop-blur-xl">
    <div className="shell flex h-14 items-center justify-between">
      <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2.5 text-sm font-semibold tracking-tight">
        <img src="/rect59R.png" alt="" className="brand-mark h-7 w-7 object-contain" />
        <span>Aenuka.</span>
      </Link>
      <nav className="hidden items-center gap-8 md:flex">
        {nav.map(([label, path]) => <NavLink key={path} to={path} className={({isActive}) => `text-xs transition hover:text-white ${isActive ? "font-semibold text-white" : "text-white/55"}`}>{label}</NavLink>)}
      </nav>
      <Link to="/contact" className="hidden rounded-full bg-white px-4 py-2 text-xs font-medium text-black transition hover:bg-white/85 md:block">Let’s talk</Link>
      <button aria-label="Toggle menu" className="md:hidden" onClick={() => setOpen(!open)}>{open ? <X size={20}/> : <Menu size={20}/>}</button>
    </div>
    {open && <nav className="border-t border-white/10 bg-black px-5 py-5 md:hidden">{nav.map(([label,path]) => <NavLink key={path} to={path} onClick={() => setOpen(false)} className="block border-b border-white/10 py-4 text-2xl font-semibold text-white">{label}</NavLink>)}</nav>}
  </header>
}

function Footer() {
  return <footer className="bg-ink py-12 text-white">
    <div className="shell flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
      <div><p className="text-2xl font-semibold tracking-tight">Let’s make something useful.</p><p className="mt-2 text-sm text-white/45">Colombo, Sri Lanka · Available for new opportunities</p></div>
      <div className="flex gap-5 text-white/55">
        <a aria-label="GitHub" href="https://github.com/Aenuka" target="_blank" rel="noreferrer"><Github size={20}/></a>
        <a aria-label="LinkedIn" href="https://lk.linkedin.com/in/aenuka" target="_blank" rel="noreferrer"><Linkedin size={20}/></a>
        <a aria-label="Instagram" href="https://www.instagram.com/aenuka_/" target="_blank" rel="noreferrer"><Instagram size={20}/></a>
      </div>
    </div>
  </footer>
}

function Home() {
  return <main className="page-enter">
    <section className="hero-field relative flex min-h-[92vh] items-center overflow-hidden bg-mist pt-14">
      <div className="hero-glow" aria-hidden="true" />
      <div className="shell relative z-10 py-24 text-center">
        <p className="eyebrow reveal reveal-1 mb-7">Software Engineer · Colombo</p>
        <h1 className="display reveal reveal-2 mx-auto max-w-5xl">Aenuka Buddhakorala</h1>
        <p className="reveal reveal-3 mx-auto mt-8 max-w-xl text-lg leading-relaxed text-black/55">I’m Aenuka, a software engineering undergraduate building clear, scalable digital experiences from interface to infrastructure.</p>
        <div className="reveal reveal-4 mt-10 flex flex-wrap justify-center gap-3">
          <Link className="button-primary" to="/projects">Explore my work <ArrowRight size={16}/></Link>
          <Link className="button-secondary" to="/about">More about me</Link>
        </div>
      </div>
    </section>
    <section className="shell py-6 md:py-10">
      <div className="grid gap-5 md:grid-cols-2">
        <Link to="/projects" className="card group min-h-[470px] bg-ink p-8 text-white md:p-12">
          <p className="text-sm text-white/50">Selected work</p><h2 className="mt-4 max-w-md text-4xl font-semibold tracking-[-.04em] md:text-5xl">Software projects</h2>
          <div className="mt-20 flex aspect-[16/8] items-center justify-center rounded-3xl bg-gradient-to-br from-blue to-[#69a9ff] shadow-2xl shadow-blue/30 transition group-hover:scale-[1.02]"><Code2 size={72} strokeWidth={1.1}/></div>
        </Link>
        <Link to="/skills" className="card group min-h-[470px] p-8 md:p-12">
          <p className="text-sm text-black/45">Capabilities</p><h2 className="mt-4 max-w-md text-4xl font-semibold tracking-[-.04em] md:text-5xl">Technical skills</h2>
          <div className="mt-16 grid grid-cols-2 gap-3">{["React","Spring Boot","Node.js","Docker"].map(x => <span key={x} className="rounded-2xl bg-white p-5 text-sm font-medium shadow-sm">{x}</span>)}</div>
        </Link>
      </div>
    </section>
  </main>
}

function About() {
  const timeline = [["2019","The first spark","Started building small web experiences after discovering HTML."],["2019–20","A stronger base","Completed Computer Science and Advanced English certificates at NIBM."],["2020–23","Stayed curious","Studied ICT while steadily expanding my technical foundation."],["2023–Now","Engineering at scale","Studying Software Engineering at SLIIT and leading practical team projects."]];
  return <main className="page-enter pt-14">
    <section className="shell py-24 md:py-36"><p className="eyebrow">About me</p><h1 className="headline mt-6 max-w-5xl">Aenuka Buddhakorala</h1></section>
    <section className="bg-mist py-20 md:py-28"><div className="shell grid gap-14 md:grid-cols-[.8fr_1.2fr]">
      <div><p className="text-2xl font-semibold tracking-tight">A builder at heart.</p><p className="mt-4 text-black/50">Software Engineering undergraduate at SLIIT. Third year, moving into the fourth.</p></div>
      <div className="space-y-6 text-xl leading-relaxed text-black/70"><p>I started by following HTML tutorials after my O/L exams and became fascinated by the immediacy of turning an idea into something people can use.</p><p>Today, I work across frontend, backend, mobile, and distributed systems. I care about calm interfaces, understandable code, and teams that learn together.</p></div>
    </div></section>
    <section className="shell py-24 md:py-32"><p className="eyebrow">My path</p><div className="mt-12 divide-y">{timeline.map(([year,title,text]) => <div key={year} className="grid gap-3 py-8 md:grid-cols-[180px_1fr_1fr] md:items-baseline"><p className="text-sm text-blue">{year}</p><h3 className="text-2xl font-semibold tracking-tight">{title}</h3><p className="leading-relaxed text-black/50">{text}</p></div>)}</div></section>
  </main>
}

const skillGroups = [
  {icon: Code2, title:"Product interfaces", text:"Fast, accessible experiences with attention to interaction and detail.", skills:["React","JavaScript","HTML","CSS","Tailwind CSS"]},
  {icon: Server, title:"Backend systems", text:"Maintainable services and APIs designed around real product needs.", skills:["Java","Spring Boot","Node.js","Express.js","Python"]},
  {icon: Database, title:"Data & infrastructure", text:"Solid data models and dependable development workflows.", skills:["SQL","MongoDB","Docker","Kubernetes","GitHub"]},
  {icon: Palette, title:"Quality & collaboration", text:"From design handoff to automated confidence in every release.", skills:["Figma","Cypress","Jira","Agile","Scrum"]},
];
function Skills() {
  return <main className="page-enter bg-mist pt-14"><section className="shell py-24 text-center md:py-36"><p className="eyebrow">Skills & capabilities</p><h1 className="headline mx-auto mt-6 max-w-4xl">Technical skills</h1><p className="mx-auto mt-7 max-w-xl text-lg text-black/50">Technologies and practices used across frontend, backend, infrastructure, testing, and product delivery.</p></section>
  <section className="shell grid gap-5 pb-24 md:grid-cols-2">{skillGroups.map(({icon:Icon,title,text,skills}) => <article key={title} className="card bg-white p-8 md:p-11"><Icon className="text-blue" size={32} strokeWidth={1.5}/><h2 className="mt-16 text-3xl font-semibold tracking-tight">{title}</h2><p className="mt-3 max-w-md leading-relaxed text-black/50">{text}</p><div className="mt-8 flex flex-wrap gap-2">{skills.map(x=><span key={x} className="rounded-full bg-mist px-4 py-2 text-xs font-medium">{x}</span>)}</div></article>)}</section></main>
}

const projects = [
  {n:"01", title:"Healthcare Microservices Platform", role:"Group Lead · Ongoing", desc:"A scalable healthcare platform built around Spring Boot microservices, containerized with Docker and orchestrated using Kubernetes.", tags:["Spring Boot","Docker","Kubernetes"], link:"https://github.com/Aenuka/SLIIT-SE3020-SE-120-Healthcare-Microservices-Platform"},
  {n:"02", title:"Quizora", role:"Group Lead", desc:"An online exam management system shaped through industry research, agile delivery, and flexible exam workflows.", tags:["Agile","Jira","Full Stack"], link:"https://github.com/Aenuka/Quizora"},
  {n:"03", title:"Cey Harvest", role:"Semi-finalist · IDEALIZE 2025", desc:"An agriculture-focused platform designed to improve farming logistics and information management.", tags:["Spring Boot","Team Project"], link:"https://github.com/damithch/CeyHarvest"},
  {n:"04", title:"Animal Hospital Inventory", role:"Full-stack contributor", desc:"A MERN inventory system with automated reordering and supplier notification workflows.", tags:["MERN","MVC"], link:"https://github.com/kaveeshapasan2002/City_Pet_AHMS"},
  {n:"05", title:"Cypress Test Suite", role:"Group Lead", desc:"An automation project covering fixtures, assertions, reporting, API mocking, and reliable testing practices.", tags:["Cypress","QA Automation"], link:"https://github.com/Aenuka/CypressTestRepo"},
];
function Projects() {
  return <main className="page-enter pt-14"><section className="shell py-24 md:py-36"><p className="eyebrow">Selected work</p><h1 className="headline mt-6 max-w-5xl">Software projects</h1></section>
  <section className="shell pb-24"><div className="divide-y border-t">{projects.map((p,i)=><article key={p.title} className="group grid gap-6 py-10 md:grid-cols-[80px_1fr_1fr_auto] md:items-center md:py-14"><p className="text-sm text-black/35">{p.n}</p><div><p className="text-xs font-semibold uppercase tracking-wider text-blue">{p.role}</p><h2 className="mt-2 text-3xl font-semibold tracking-[-.03em]">{p.title}</h2></div><div><p className="max-w-md leading-relaxed text-black/50">{p.desc}</p><div className="mt-4 flex flex-wrap gap-2">{p.tags.map(x=><span key={x} className="text-xs text-black/40">{x}</span>)}</div></div><a href={p.link} target="_blank" rel="noreferrer" aria-label={`View ${p.title} on GitHub`} className="flex h-12 w-12 items-center justify-center rounded-full border transition group-hover:border-blue group-hover:bg-blue group-hover:text-white"><ArrowUpRight size={19}/></a></article>)}</div></section></main>
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
          ? "Contact service is unavailable. Run the site with Netlify Dev, not Vite alone."
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
    <div><p className="eyebrow">Get in touch</p><h1 className="headline mt-6">Contact me</h1><p className="mt-7 max-w-md text-lg leading-relaxed text-black/50">I’m open to internships, collaborations, and conversations about software and product design.</p><div className="mt-12 flex gap-5"><a href="https://github.com/Aenuka" target="_blank" rel="noreferrer"><Github/></a><a href="https://lk.linkedin.com/in/aenuka" target="_blank" rel="noreferrer"><Linkedin/></a></div></div>
    <form onSubmit={submit} className="rounded-[2rem] bg-white p-7 shadow-xl shadow-black/[.04] md:p-10">
      <div className="grid gap-6"><label className="text-sm font-medium">Name<input required name="name" className="mt-2 w-full rounded-xl border bg-mist px-4 py-3.5 font-normal outline-none focus:border-blue" placeholder="Your name"/></label><label className="text-sm font-medium">Email<input required type="email" name="email" className="mt-2 w-full rounded-xl border bg-mist px-4 py-3.5 font-normal outline-none focus:border-blue" placeholder="you@example.com"/></label><label className="text-sm font-medium">Message<textarea required name="message" rows="5" className="mt-2 w-full resize-none rounded-xl border bg-mist px-4 py-3.5 font-normal outline-none focus:border-blue" placeholder="Tell me a little about your idea."/></label><button disabled={state.status==="sending"} className="button-primary w-full disabled:opacity-50">{state.status==="sending" ? "Sending…" : <>Send message <Send size={16}/></>}</button>{state.message && <p className={`flex items-center gap-2 text-sm ${state.status==="sent" ? "text-green-600" : state.status==="warning" ? "text-amber-600" : "text-red-600"}`}>{state.status==="sent"&&<CheckCircle2 size={16}/>} {state.message}</p>}</div>
    </form>
  </section></main>
}

function ScrollTop() { const {pathname}=useLocation(); useEffect(()=>window.scrollTo(0,0),[pathname]); return null; }
export default function App() {
  return <><Seo/><ScrollTop/><Header/><Routes><Route path="/" element={<Home/>}/><Route path="/about" element={<About/>}/><Route path="/skills" element={<Skills/>}/><Route path="/projects" element={<Projects/>}/><Route path="/contact" element={<Contact/>}/><Route path="*" element={<Home/>}/></Routes><Footer/></>;
}
