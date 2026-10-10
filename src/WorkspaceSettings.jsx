import { useEffect, useRef } from "react";
import { Check, Moon, Settings, Sun, X } from "lucide-react";

export default function WorkspaceSettings({ open, onClose, theme, onThemeChange }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    if (open) dialogRef.current?.showModal();
    else if (dialogRef.current?.open) dialogRef.current.close();
  }, [open]);

  return <dialog id="workspace-settings" className="workspace-settings" ref={dialogRef} aria-labelledby="workspace-settings-title" onClose={onClose} onCancel={onClose} onClick={event=>{if(event.target===event.currentTarget)onClose();}}>
    <header className="settings-heading"><Settings size={17}/><h2 id="workspace-settings-title">Workspace settings</h2><button type="button" className="workspace-icon-button" aria-label="Close settings" onClick={onClose}><X size={15}/></button></header>
    <fieldset className="settings-theme-field"><legend>Color theme</legend><p>Make this workspace feel like yours.</p><div className="settings-theme-options">
      {[{value:"light",label:"Light",description:"Bright and clear",Icon:Sun},{value:"dark",label:"Dark",description:"The classic IDE",Icon:Moon}].map(({value,label,description,Icon})=><label key={value} className={`settings-theme-option ${theme===value ? "theme-is-selected" : ""}`}>
        <input type="radio" name="workspace-color-theme" value={value} checked={theme===value} onChange={()=>onThemeChange(value)}/>
        <span className={`theme-preview theme-preview-${value}`} aria-hidden="true"><i className="theme-preview-bar"/><i className="theme-preview-sidebar"/><span className="theme-preview-lines"><i/><i/><i/></span></span>
        <span className="theme-option-label"><Icon size={14}/><strong>{label}</strong>{theme===value&&<Check size={13}/>}</span><small>{description}</small>
      </label>)}
    </div></fieldset>
    <p className="settings-saved" role="status">{theme==="light" ? "Light" : "Dark"} theme · Applied to this workspace</p>
  </dialog>;
}
