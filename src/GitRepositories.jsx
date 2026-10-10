import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, Folder, GitBranch, Github, Search, X } from "lucide-react";
import { projects } from "./projects";

const repositories = [
  { title: "Aenuka’s portfolio", link: "https://github.com/Aenuka/Aenuka-sweb", workspace: true },
  ...projects,
].map(repository => ({ ...repository, repository: new URL(repository.link).pathname.slice(1) }));

export default function GitRepositories({ open, onClose, position }) {
  const dialogRef = useRef(null);
  const searchRef = useRef(null);
  const [query, setQuery] = useState("");
  const matches = repositories.filter(({ title, repository }) => `${title} ${repository}`.toLowerCase().includes(query.trim().toLowerCase()));

  useEffect(() => {
    if (open) {
      setQuery("");
      dialogRef.current?.showModal();
      searchRef.current?.focus();
    } else if (dialogRef.current?.open) dialogRef.current.close();
  }, [open]);

  function keyboardNavigation(event) {
    const links = [...dialogRef.current.querySelectorAll("[data-repository-link]")].filter(link=>link.getClientRects().length);
    if (event.key === "Enter" && event.target === searchRef.current && links.length) {
      event.preventDefault();
      links[0].click();
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const targets = [searchRef.current, ...links];
      const current = targets.indexOf(document.activeElement);
      const direction = event.key === "ArrowDown" ? 1 : -1;
      targets[(current + direction + targets.length) % targets.length]?.focus();
    }
  }

  function repositoryLink(repository) {
    return <a key={repository.link} data-repository-link href={repository.link} target="_blank" rel="noopener noreferrer" onClick={onClose} className="git-repository-link" aria-label={`Open ${repository.title} on GitHub (opens in a new tab)`}>
      <GitBranch size={17}/>
      <span><strong>{repository.title}</strong><small>{repository.repository}</small></span>
      <ArrowUpRight size={14}/>
    </a>;
  }

  return <dialog id="workspace-git-repositories" className="workspace-git-picker" ref={dialogRef} style={{ "--git-picker-left": `${position.left}px`, "--git-picker-top": `${position.top}px` }} aria-label="GitHub project repositories" onClose={onClose} onCancel={onClose} onKeyDown={keyboardNavigation} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <header className="git-picker-heading"><Github size={17}/><span>GitHub repositories</span><span className="git-repository-count">{repositories.length}</span><button type="button" aria-label="Close GitHub repositories" onClick={onClose}><X size={15}/></button></header>
    <div className="git-picker-search"><Search size={16}/><input ref={searchRef} value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search projects and repositories" aria-label="Search GitHub repositories" autoComplete="off" spellCheck={false}/></div>
    <div className="git-picker-results">
      {matches.some(repository=>repository.workspace)&&<section><h2>This workspace</h2>{matches.filter(repository=>repository.workspace).map(repositoryLink)}</section>}
      {matches.some(repository=>!repository.workspace)&&<section><h2>Projects</h2><details open key={open ? query : "closed"}><summary><ChevronDown size={13}/><Folder size={16}/><span>GitHub</span><small>{matches.filter(repository=>!repository.workspace).length}</small></summary><div className="git-project-tree">{matches.filter(repository=>!repository.workspace).map(repositoryLink)}</div></details></section>}
      {!matches.length&&<p className="git-picker-empty">No matching repositories. Try a project name or owner.</p>}
    </div>
    <footer className="git-picker-footer"><a href="https://github.com/Aenuka?tab=repositories" target="_blank" rel="noopener noreferrer" onClick={onClose}><Github size={12}/> All repositories <ArrowUpRight size={12}/></a><span>↑ ↓ to select · esc to close</span></footer>
  </dialog>;
}
