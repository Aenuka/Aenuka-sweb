import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Braces, Check, ChevronDown, ChevronRight, Code2, Command, Database, FileCode2, FileJson2, FileText, Folder, GitBranch, Layers3, LoaderCircle, Menu, Play, Search, Server, Terminal, X } from "lucide-react";
import "./workspace.css";

const workspaceFiles = [
  { path: "/", name: "Welcome.md", icon: FileText, language: "Markdown", label: "Welcome", description: "The person behind the code.", source: '# Aenuka Buddhakorala\n\nSoftware engineer. Builder. Always curious.\n\nIntern Backend Engineer at Arimac Digital.\nSoftware Engineering undergraduate at SLIIT.\nColombo, Sri Lanka.\n\n## Explore the workspace\n\nopen projects  →  Things I have built\nopen skills    →  My engineering toolkit\nopen about     →  The story so far\nopen posts     →  Notes and updates\nopen contact   →  Start a conversation' },
  { path: "/about", name: "About.java", icon: FileCode2, language: "Java", label: "About", description: "Curiosity, learning, and the journey.", source: 'package dev.aenuka.portfolio;\n\npublic class About {\n    String name = "Aenuka Buddhakorala";\n    String role = "Intern Backend Engineer";\n    String company = "Arimac Digital";\n    String university = "SLIIT";\n    String location = "Colombo, Sri Lanka";\n\n    // A builder at heart. A learner, always.\n    String[] journey = {\n        "2019: The first HTML tutorial",\n        "2019–20: Computer Science at NIBM",\n        "2023–Now: Software Engineering at SLIIT",\n        "2026–Now: Backend engineering at Arimac"\n    };\n}' },
  { path: "/skills", name: "Skills.json", icon: FileJson2, language: "JSON", label: "Skills", description: "From interface to infrastructure.", source: '{\n  "interfaces": ["React", "JavaScript", "HTML", "CSS"],\n  "backend": ["Java", "Spring Boot", "Node.js", "Python"],\n  "data": ["SQL", "MongoDB"],\n  "infrastructure": ["Docker", "Kubernetes", "GitHub"],\n  "collaboration": ["Figma", "Cypress", "Jira", "Agile"]\n}' },
  { path: "/projects", name: "Projects.tsx", icon: Braces, language: "TypeScript", label: "Projects", description: "Ideas turned into useful experiences.", source: 'export const projects = [\n  {\n    name: "Healthcare Microservices Platform",\n    stack: ["Spring Boot", "Docker", "Kubernetes"],\n    role: "Group Lead",\n    status: "Ongoing"\n  },\n  { name: "Quizora", role: "Group Lead" },\n  { name: "Cey Harvest", recognition: "IDEALIZE 2025 semi-finalist" },\n  { name: "Animal Hospital Inventory", stack: ["MERN"] },\n  { name: "Cypress Test Suite", focus: "QA Automation" }\n];\n\n// Open the preview to explore each project.' },
  { path: "/posts", name: "Notes.md", icon: FileText, language: "Markdown", label: "Posts", description: "Ideas, progress, and things worth sharing.", source: '# Notes & updates\n\nA work in progress. A thought worth sharing.\n\nThe preview loads published posts from the portfolio.\nSearch by title or content, open a post,\nand join the conversation.' },
  { path: "/contact", name: "Contact.http", icon: Server, language: "HTTP", label: "Contact", description: "Good things start with a conversation.", source: '# Have an idea? Let’s connect.\n# Use the preview to send a message.\n\nPOST /.netlify/functions/submit-contact\nContent-Type: application/json\n\n{\n  "name": "Your name",\n  "email": "you@example.com",\n  "message": "Let’s make something useful."\n}\n\n# GitHub: github.com/Aenuka\n# LinkedIn: lk.linkedin.com/in/aenuka' },
];

function FileSource({ file }) {
  return <div className="workspace-source"><div className="source-note">Portfolio file · Read-only overview <span>Switch to Preview to explore and interact.</span></div><pre><code>{file.source.split("\n").map((line,i)=><span className="source-line" key={i}><span className="source-number" aria-hidden="true">{i+1}</span><span className={/^\s*(#|\/\/)/.test(line) ? "source-comment" : "source-text"}>{line.split(/("[^"\n]*"|\b(?:public|class|package|export|const|String)\b)/g).map((part,j)=><span key={j} className={part.startsWith('"') ? "source-string" : /^(public|class|package|export|const|String)$/.test(part) ? "source-keyword" : undefined}>{part}</span>)}</span></span>)}</code></pre></div>;
}

export function WorkspaceWelcome() {
  return <main className="workspace-welcome page-enter">
    <div className="welcome-kicker"><span>README</span><span>WELCOME TO MY WORKSPACE</span></div>
    <div className="welcome-layout"><div className="welcome-copy"><p className="eyebrow">Aenuka Buddhakorala · Software Engineer</p><h1>A little curiosity.<br/><span>A world of possibility.</span></h1><p>I build the systems behind the scenes.<br/>And care about every detail you see.</p><div className="welcome-actions"><Link to="/projects" className="button-primary"><Play size={14}/> Explore my work</Link><Link to="/about" className="text-link">Meet the developer <ChevronRight size={16}/></Link></div><div className="welcome-meta"><span>Arimac Digital</span><span>SLIIT</span><span>Colombo, Sri Lanka</span></div></div>
      <div className="welcome-code-art" aria-hidden="true" data-motion-graphic><div className="welcome-code-label"><Braces size={15}/> mindset.ts</div><div className="welcome-code-lines"><p><span>const</span> developer = {"{"}</p><p>  name: <em>"Aenuka"</em>,</p><p>  mindset: <em>"always curious"</em>,</p><p>  craft: <em>"thoughtful software"</em>,</p><p>  next: <em>"something useful"</em></p><p>{"}"};</p><p className="welcome-code-call">developer.<b>build</b>(possibility);<i/></p></div><div className="welcome-system"><div><Code2 size={20}/><span>Interface</span></div><i/><div><Server size={20}/><span>Services</span></div><i/><div><Database size={20}/><span>Data</span></div></div><div className="welcome-code-caption"><Check size={12}/> Connected by design.</div></div></div>
    <div className="welcome-start-heading"><h2>Your next line starts here.</h2><span>Open a file from the explorer, or choose below.</span></div><div className="welcome-file-grid">{workspaceFiles.slice(1).map(({path,name,icon:Icon,label,description},i)=><Link to={path} key={path} className="welcome-file-card" style={{"--file-delay":`${i*.06}s`}}><span className="welcome-file-icon"><Icon size={21}/></span><div><span className="welcome-file-name">{name}</span><h3>{label}</h3><p>{description}</p></div><ChevronRight size={15}/></Link>)}</div>
    <p className="welcome-tip"><Command size={13}/> A different way to explore. Try <code>open projects</code> in the terminal below.</p>
  </main>;
}

export default function PortfolioWorkspace({ children }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const current = workspaceFiles.find(file => file.path===pathname) || { ...workspaceFiles[0], name: pathname.startsWith("/admin") ? "Admin.secure" : "NotFound.md", path: pathname, label: "Page" };
  const [tabs, setTabs] = useState(["/"]);
  const [source, setSource] = useState(false);
  const [explorerOpen, setExplorerOpen] = useState(false);
  const [explorerCollapsed, setExplorerCollapsed] = useState(false);
  const [folderOpen, setFolderOpen] = useState(true);
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [command, setCommand] = useState("");
  const [logs, setLogs] = useState([{ text:"Workspace ready. Type help to explore.", kind:"muted" }]);
  const [running, setRunning] = useState(false);
  const [runStage, setRunStage] = useState(0);
  const editorRef = useRef(null);
  const flowScrollEnd = useRef(false);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);
  const dialogRef = useRef(null);
  const searchRef = useRef(null);
  const runTimers = useRef([]);
  const flowGesture = useRef({ direction: 0, total: 0, started: 0, last: 0 });
  const flowCooldown = useRef(0);
  const previousPath = useRef(null);
  const commandHistory = useRef([]);
  const historyPosition = useRef(0);
  const filteredFiles = workspaceFiles.filter(file=>`${file.name} ${file.label}`.toLowerCase().includes(search.toLowerCase()));
  const flowIndex = workspaceFiles.findIndex(file=>file.path===pathname);
  const nextFile = workspaceFiles[flowIndex+1];
  const previousFile = workspaceFiles[flowIndex-1];

  useEffect(() => {
    document.documentElement.dataset.motion = "running";
  }, []);
  useLayoutEffect(() => {
    const editor=editorRef.current;
    editor?.scrollTo({top:flowScrollEnd.current ? editor.scrollHeight : 0,behavior:"instant"});
    flowScrollEnd.current=false;
  }, [pathname, source]);
  useEffect(() => {
    runTimers.current.forEach(timer=>window.clearTimeout(timer));
    runTimers.current=[];
    flowCooldown.current=performance.now()+1100;
    flowGesture.current={direction:0,total:0,started:0,last:0};
    setRunning(false);
    setTabs(items => items.includes(pathname) ? items : [...items,pathname]);
    setExplorerOpen(false);
    setSource(false);
    if (previousPath.current !== pathname) {
      previousPath.current = pathname;
      setLogs(items=>[...items.slice(-39), {text:`Opened ${current.name}`, kind:"file"}]);
    }
  }, [pathname, current.name]);
  useEffect(() => { terminalRef.current?.scrollTo({ top: terminalRef.current.scrollHeight, behavior: "instant" }); }, [logs]);
  useEffect(() => {
    if (paletteOpen) { dialogRef.current?.showModal(); searchRef.current?.focus(); }
    else if (dialogRef.current?.open) dialogRef.current.close();
  }, [paletteOpen]);
  useEffect(() => {
    const handle = event => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase()==="k") { event.preventDefault(); setPaletteOpen(value=>!value); setSearch(""); }
      if (event.key==="Escape") { setPaletteOpen(false); setExplorerOpen(false); }
    };
    window.addEventListener("keydown",handle);
    return ()=>window.removeEventListener("keydown",handle);
  }, []);
  useEffect(()=>()=>runTimers.current.forEach(timer=>window.clearTimeout(timer)),[]);
  useEffect(() => {
    const editor=editorRef.current;
    if (!editor || source || paletteOpen || running || flowIndex<0) return;
    let advanceTimer;
    let touchStart;
    function innerArea(target) {
      if (target.closest("textarea,input,button,iframe")) return true;
      while(target && target!==editor) {
        if(target.scrollHeight>target.clientHeight+3 && /auto|scroll/.test(getComputedStyle(target).overflowY)) return true;
        target=target.parentElement;
      }
      return false;
    }
    function advance(destination) {
      flowCooldown.current=performance.now()+1500;
      flowGesture.current={direction:0,total:0,started:0,last:0};
      flowScrollEnd.current=destination===previousFile;
      navigate(destination.path);
    }
    function advanceFlow(event) {
      if (Math.abs(event.deltaX)>Math.abs(event.deltaY) || event.ctrlKey || innerArea(event.target)) return;
      // An inner scroll area consumes its own gestures before the page flow.
      const direction=event.deltaY>0 ? 1 : -1;
      const destination=direction>0 ? nextFile : previousFile;
      const boundary=direction>0 ? editor.scrollTop+editor.clientHeight>=editor.scrollHeight-3 : editor.scrollTop<=3;
      const now=performance.now();
      if(!boundary || !destination || now<flowCooldown.current) { window.clearTimeout(advanceTimer); advanceTimer=undefined; flowGesture.current.total=0; return; }
      event.preventDefault();
      const gesture=flowGesture.current;
      if(gesture.direction!==direction || now-gesture.last>320 || !gesture.total) { gesture.direction=direction; gesture.total=0; gesture.started=now; }
      gesture.last=now;
      gesture.total+=Math.abs(event.deltaY)*(event.deltaMode===1 ? 24 : event.deltaMode===2 ? editor.clientHeight : 1);
      if(gesture.total>=130 && !advanceTimer) {
        advanceTimer=window.setTimeout(()=>advance(destination),Math.max(0,160-(now-gesture.started)));
      }
    }
    function startTouch(event) {
      touchStart=event.touches.length===1 && !innerArea(event.target) ? {
        x:event.touches[0].clientX, y:event.touches[0].clientY,
        top:editor.scrollTop<=3, bottom:editor.scrollTop+editor.clientHeight>=editor.scrollHeight-3
      } : null;
    }
    function moveTouch(event) {
      if(!touchStart || event.touches.length!==1 || performance.now()<flowCooldown.current) return;
      const distance=touchStart.y-event.touches[0].clientY;
      if(Math.abs(distance)<Math.abs(touchStart.x-event.touches[0].clientX)) return;
      const destination=distance>0 ? nextFile : previousFile;
      if(!destination || !(distance>0 ? touchStart.bottom : touchStart.top)) return;
      event.preventDefault();
      if(Math.abs(distance)>=85) { touchStart=null; advance(destination); }
    }
    editor.addEventListener("wheel",advanceFlow,{passive:false});
    editor.addEventListener("touchstart",startTouch,{passive:true});
    editor.addEventListener("touchmove",moveTouch,{passive:false});
    return ()=>{
      window.clearTimeout(advanceTimer);
      editor.removeEventListener("wheel",advanceFlow);
      editor.removeEventListener("touchstart",startTouch);
      editor.removeEventListener("touchmove",moveTouch);
    };
  }, [pathname,source,paletteOpen,running,flowIndex,nextFile,previousFile,navigate]);

  function openFile(path) { setPaletteOpen(false); setSearch(""); navigate(path); }
  function toggleExplorer() {
    if (window.matchMedia("(max-width: 900px)").matches) setExplorerOpen(value=>!value);
    else setExplorerCollapsed(value=>!value);
  }
  function closeFile(path) {
    const remaining = tabs.filter(tab=>tab!==path);
    setTabs(remaining.length ? remaining : ["/"]);
    if (pathname===path) navigate(remaining.at(-1) || "/");
  }
  function log(text,kind="info") { setLogs(items=>[...items.slice(-39),{text,kind}]); }
  function runPortfolio() {
    runTimers.current.forEach(timer=>window.clearTimeout(timer));
    runTimers.current=[];
    setTerminalOpen(true); setSource(false); setRunning(true); setRunStage(0);
    log("› run portfolio", "command"); log("[1/3] Preparing the workspace…", "muted");
    const finish = () => { navigate("/projects"); log("Preview ready. Explore a project to open its GitHub repository.", "success"); setRunning(false); };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) finish();
    else {
      runTimers.current.push(window.setTimeout(()=>{setRunStage(1);log("[2/3] Connecting portfolio views…", "info");},500));
      runTimers.current.push(window.setTimeout(()=>{setRunStage(2);log("[3/3] Opening selected work…", "info");},1050));
      runTimers.current.push(window.setTimeout(finish,1750));
    }
  }
  function submitCommand(event) {
    event.preventDefault();
    const value=command.trim(); if(!value) return;
    commandHistory.current = [...commandHistory.current.slice(-29), value];
    historyPosition.current = commandHistory.current.length;
    setCommand("");
    if(value.toLowerCase()==="clear") { setLogs([]); return; }
    if(/^(run|run portfolio)$/i.test(value)) { runPortfolio(); return; }
    log(`› ${value}`,"command");
    if(value.toLowerCase()==="help") { log("Commands: open <page> · ls · run · clear", "success"); log("Pages: welcome, about, skills, projects, posts, contact", "muted"); return; }
    if(value.toLowerCase()==="ls") { log(workspaceFiles.map(file=>file.name).join("  ·  "),"info"); return; }
    const requested=value.replace(/^open\s+/i,"").toLowerCase();
    const match=workspaceFiles.find(file=>[file.name.toLowerCase(),file.label.toLowerCase(),file.path.slice(1),file.path].includes(requested));
    if(match) { openFile(match.path); return; }
    log(`Unknown command. Type help to see where you can go.`,"error");
  }
  function terminalKeys(event) {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      historyPosition.current = Math.max(0, Math.min(commandHistory.current.length, historyPosition.current + (event.key === "ArrowUp" ? -1 : 1)));
      setCommand(commandHistory.current[historyPosition.current] || "");
    } else if (event.key === "Tab" && /^open\s+\S+$/i.test(command)) {
      const partial=command.replace(/^open\s+/i,"").toLowerCase();
      const match=workspaceFiles.filter(file=>file.label.toLowerCase().startsWith(partial));
      if (match.length===1) { event.preventDefault(); setCommand(`open ${match[0].label.toLowerCase()}`); }
    }
  }

  return <div className={`portfolio-workspace ${terminalOpen ? "terminal-is-open" : ""} ${running ? "workspace-is-running" : ""} ${explorerCollapsed ? "explorer-is-collapsed" : ""}`}>
    <header className="workspace-topbar"><div className="workspace-window-controls" aria-hidden="true"><i/><i/><i/></div><button type="button" className="workspace-mobile-menu workspace-icon-button" aria-label={explorerOpen ? "Close project explorer" : "Open project explorer"} aria-expanded={explorerOpen} aria-controls="portfolio-explorer" onClick={()=>setExplorerOpen(!explorerOpen)}>{explorerOpen ? <X size={19}/> : <Menu size={19}/>}</button><Link to="/" className="workspace-brand"><img src="/rect59R.png" alt=""/><span>aenuka<span className="workspace-brand-suffix">-portfolio</span></span><ChevronDown size={12}/></Link><span className="workspace-top-branch"><GitBranch size={13}/> main</span><button type="button" className="workspace-search" onClick={()=>{setSearch("");setPaletteOpen(true);}}><Search size={13}/><span>Search files…</span><kbd>⌘ K</kbd></button><div className="workspace-top-actions"><button type="button" className="workspace-run-button" onClick={runPortfolio} disabled={running}><Play size={14}/><span>{running ? "Running…" : "Run portfolio"}</span></button></div></header>
    <div className="workspace-body"><nav className="workspace-rail" aria-label="Workspace tools"><button type="button" className="rail-selected" title="Project explorer" aria-label="Toggle project explorer" onClick={toggleExplorer}><Folder size={19}/></button><button type="button" title="Open projects" aria-label="Open projects" onClick={()=>openFile("/projects")}><Layers3 size={19}/></button><a href="https://github.com/Aenuka" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile (opens in a new tab)" title="GitHub"><GitBranch size={18}/></a><button type="button" className="workspace-rail-bottom" aria-label="Toggle terminal" aria-pressed={terminalOpen} title="Terminal" onClick={()=>setTerminalOpen(!terminalOpen)}><Terminal size={19}/></button></nav>
      {explorerOpen&&<button type="button" className="explorer-backdrop" aria-label="Close project explorer" onClick={()=>setExplorerOpen(false)}/>}
      <aside id="portfolio-explorer" className={`workspace-explorer ${explorerOpen ? "explorer-is-open" : ""}`} aria-label="Portfolio project explorer"><div className="workspace-panel-title"><span>Project</span><ChevronDown size={12}/><button type="button" className="workspace-icon-button" aria-label="Find a file" onClick={()=>setPaletteOpen(true)}><Search size={13}/></button></div><button type="button" className="workspace-project-root" onClick={()=>setFolderOpen(!folderOpen)} aria-expanded={folderOpen}><span>{folderOpen ? <ChevronDown size={12}/> : <ChevronRight size={12}/>}</span><Folder size={14}/><strong>aenuka-portfolio</strong></button>{folderOpen&&<div className="workspace-tree"><p className="tree-folder-label"><ChevronDown size={11}/><Folder size={13}/> src / portfolio</p>{workspaceFiles.map(({path,name,icon:Icon})=><Link to={path} key={path} aria-current={pathname===path ? "page" : undefined} className="workspace-file-link"><Icon size={14}/><span>{name}</span>{pathname===path&&<span className="file-selected-label">open</span>}</Link>)}</div>}<div className="explorer-guide"><span className="explorer-guide-line"/><Code2 size={22}/><h2>Built with curiosity.</h2><p>Every file tells a story.<br/>Open one. See what’s inside.</p><button type="button" onClick={()=>{setSearch("");setPaletteOpen(true);}}>Find your next file <ArrowRight size={12}/></button></div><div className="explorer-bottom"><span>PORTFOLIO WORKSPACE</span><span>6 files · one developer</span></div></aside>
      <section className="workspace-center" aria-label="Portfolio editor"><div className="workspace-editor-tabs" aria-label="Open files">{tabs.map(path=>{const file=workspaceFiles.find(item=>item.path===path)||current;const Icon=file.icon;return <div key={path} className={`workspace-tab ${pathname===path ? "tab-is-active" : ""}`}><Link to={path} aria-current={pathname===path ? "page" : undefined}><Icon size={13}/><span>{file.name}</span></Link>{path!=="/"&&<button type="button" aria-label={`Close ${file.name}`} onClick={()=>closeFile(path)}><X size={11}/></button>}</div>;})}<button type="button" className="workspace-add-tab" aria-label="Open another file" onClick={()=>setPaletteOpen(true)}>+</button></div><div className="workspace-editor-toolbar"><span className="workspace-breadcrumb">portfolio <ChevronRight size={10}/> <span>{current.name}</span></span><div className="workspace-view-switch" aria-label="File view"><button type="button" aria-pressed={!source} onClick={()=>setSource(false)}>Preview</button><button type="button" aria-pressed={source} onClick={()=>setSource(true)}>Source</button></div></div>{running&&<div className="workspace-run-banner" data-motion-graphic><LoaderCircle size={15}/><span><strong>PortfolioApplication</strong><small>{["Preparing the workspace", "Connecting portfolio views", "Opening selected work"][runStage]}</small></span><div className="workspace-run-stages">{["Prepare", "Connect", "Open"].map((stage,index)=><span key={stage} className={index<=runStage ? "stage-is-active" : ""}><b>{index<runStage ? <Check size={10}/> : index+1}</b>{stage}</span>)}</div><div className="workspace-run-line"><i/></div></div>}<div className="workspace-editor-scroll" id="main-content" tabIndex={-1} ref={editorRef}>{source ? <FileSource file={current}/> : children}</div>{terminalOpen&&<section className="workspace-terminal" aria-label="Navigation terminal"><div className="workspace-terminal-heading"><span><Terminal size={13}/> Terminal</span><span className="terminal-session-name">portfolio <X size={9}/></span><div><span className="terminal-navigation-label">NAVIGATE YOUR WORKSPACE</span><button type="button" className="workspace-icon-button" aria-label="Close terminal" onClick={()=>setTerminalOpen(false)}><X size={12}/></button></div></div><div className="workspace-terminal-output" ref={terminalRef} role="log" aria-label="Terminal output" aria-live="polite">{logs.map((entry,index)=><p key={index} className={`workspace-log log-${entry.kind}`}>{entry.text}</p>)}</div><form className="workspace-terminal-command" onSubmit={submitCommand}><label htmlFor="workspace-command"><span>aenuka</span> <span>~/portfolio</span> <b>❯</b><span className="sr-only">Terminal navigation command</span></label><input id="workspace-command" ref={inputRef} autoComplete="off" autoCapitalize="off" spellCheck={false} value={command} onChange={event=>setCommand(event.target.value)} onKeyDown={terminalKeys} placeholder="Try open projects"/><button type="submit" aria-label="Execute navigation command"><ArrowRight size={13}/></button><div className="terminal-quick-commands"><button type="button" onClick={()=>{setCommand("help");inputRef.current?.focus();}}>help</button><button type="button" onClick={()=>openFile("/contact")}>open contact</button></div></form></section>}</section>
    </div><footer className="workspace-statusbar"><span><GitBranch size={11}/> main <span className="workspace-status-divider">/</span><Check size={11}/><span>{running ? "Building your next view…" : "Workspace ready"}</span></span><button type="button" onClick={()=>setTerminalOpen(!terminalOpen)}><Terminal size={11}/><span>Terminal {terminalOpen ? "on" : "off"}</span></button><span>{current.language}<span className="workspace-status-divider">/</span> UTF-8 <span className="workspace-status-divider">/</span><span>Colombo, Sri Lanka</span></span></footer>
    <dialog className="workspace-command-palette" ref={dialogRef} onClose={()=>setPaletteOpen(false)} onClick={event=>{if(event.target===event.currentTarget)setPaletteOpen(false);}} aria-label="Open a portfolio file"><div className="palette-search"><Search size={18}/><input ref={searchRef} aria-label="Search portfolio files" placeholder="Where would you like to go?" value={search} onChange={event=>setSearch(event.target.value)} onKeyDown={event=>{if(event.key==="Enter"&&filteredFiles[0])openFile(filteredFiles[0].path);}}/><button type="button" aria-label="Close file search" onClick={()=>setPaletteOpen(false)}><kbd>esc</kbd></button></div><p className="palette-label">OPEN A FILE</p><div className="palette-results">{filteredFiles.map(({path,name,icon:Icon,description})=><button type="button" key={path} onClick={()=>openFile(path)}><Icon size={19}/><span><strong>{name}</strong><small>{description}</small></span><ArrowRight size={14}/></button>)}{!filteredFiles.length&&<p className="palette-empty">No matching files. Try projects, skills, or contact.</p>}</div><p className="palette-footer">Type to search · Enter opens the first match</p></dialog>
  </div>;
}
