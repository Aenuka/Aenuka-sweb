import { Braces, Check, GitBranch } from "lucide-react";

export default function WorkspaceBoot({ theme, stage }) {
  return <div className={`workspace-boot ${stage===3 ? "boot-is-ready" : ""}`} data-theme={theme} role="status" aria-live="polite" aria-label="Starting portfolio workspace">
    <div className="boot-ambient" aria-hidden="true"/>
    <div className="boot-window">
      <div className="boot-window-bar" aria-hidden="true"><i/><i/><i/><span>aenuka-portfolio</span></div>
      <div className="boot-content"><div className="boot-brand"><img src={theme==="dark" ? "/rectL26N.png" : "/rect59R.png"} alt=""/><div><h1>Aenuka’s workspace<span>Built with curiosity.</span></h1><p>Software. Ideas. Possibility.</p></div></div>
        <div className="boot-code" aria-hidden="true"><Braces size={20}/><span>Every great idea starts<br/>with a new project.</span><GitBranch size={19}/></div>
        <div className="boot-progress" role="progressbar" aria-label="Loading the portfolio workspace"><i/></div>
        <div className="boot-status"><span>{["Starting the workspace…","Preparing portfolio files…","Loading fonts and interface…","Workspace ready."][stage]}</span><span>{stage===3 ? <Check size={13}/> : <i className="boot-spinner"/>}</span></div>
      </div>
      <div className="boot-footer"><span>PORTFOLIO IDE</span><span>Colombo, Sri Lanka</span></div>
    </div>
  </div>;
}
