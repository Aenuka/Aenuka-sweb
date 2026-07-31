import { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import { useNavigate } from "react-router-dom";
import {
  Bold, Italic, Heading1, Heading2, Table2, ImagePlus, Send, MessageCircle,
  LoaderCircle, Pencil, Trash2, LockKeyhole, Plus, X, LogOut, ShieldCheck, Mail, KeyRound,
} from "lucide-react";

const endpoint = "/.netlify/functions/posts";
const authEndpoint = "/.netlify/functions/admin-auth";

function removeReplyBranch(replies, replyId) {
  const removed = new Set([replyId]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const reply of replies) {
      if (removed.has(reply.parent_reply_id) && !removed.has(reply.id)) {
        removed.add(reply.id);
        changed = true;
      }
    }
  }
  return replies.filter((reply) => !removed.has(reply.id));
}

function friendlyDate(date) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(date));
}

async function getPosts() {
  const response = await fetch(endpoint);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Could not load posts.");
  return data.posts || [];
}

function ReplyForm({ postId, parentReplyId = null, onAdded, onCancel, compact = false }) {
  const [state, setState] = useState({ sending: false, error: "" });
  async function submit(event) {
    event.preventDefault();
    setState({ sending: true, error: "" });
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reply", postId, parentReplyId, ...values }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Could not add your reply.");
      form.reset();
      onAdded(data.reply);
      onCancel?.();
    } catch (error) {
      setState({ sending: false, error: error.message });
      return;
    }
    setState({ sending: false, error: "" });
  }

  return <form onSubmit={submit} className={compact ? "mt-3 rounded-2xl border bg-white p-3" : "mt-6 border-t pt-5"}>
    <div className="grid gap-3 sm:grid-cols-[160px_1fr_auto]">
      <input name="name" maxLength="60" className="post-input" placeholder="Name (optional)" aria-label="Your name, optional" />
      <input name="message" required maxLength="1000" className="post-input" placeholder={parentReplyId ? "Write your response…" : "Write a reply…"} aria-label="Reply" />
      <button disabled={state.sending} className="button-primary px-5">
        {state.sending ? <LoaderCircle className="animate-spin" size={17}/> : <Send size={16}/>} Reply
      </button>
    </div>
    {compact && <button type="button" onClick={onCancel} className="mt-2 px-2 text-xs font-medium text-black/40 transition hover:text-black">Cancel</button>}
    {state.error && <p className="mt-2 text-sm text-red-600">{state.error}</p>}
  </form>;
}

function ReplyThread({ reply, replies, postId, onAdded, depth = 0 }) {
  const [replying, setReplying] = useState(false);
  const children = replies.filter((item) => item.parent_reply_id === reply.id);
  const nestedClass = depth === 0 ? "" : depth <= 3 ? "ml-3 border-l border-black/10 pl-3 sm:ml-6 sm:pl-4" : "mt-2";

  return <div className={nestedClass}>
    <div className={`rounded-2xl px-4 py-3 ${reply.is_admin ? "border border-blue/10 bg-blue/[.045]" : "bg-mist"}`}>
      <div className="flex flex-wrap items-center gap-x-2">
        <span className="text-sm font-semibold">{reply.name || "Anonymous"}</span>
        {reply.is_admin && <span className="rounded-full bg-blue/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue">Aenuka</span>}
        <time className="text-[11px] text-black/35">{friendlyDate(reply.created_at)}</time>
      </div>
      <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-black/65">{reply.message}</p>
      {depth < 7 && <button type="button" onClick={() => setReplying((open) => !open)} className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-blue transition hover:text-[#0077ed]">
        <MessageCircle size={13}/> Reply
      </button>}
    </div>
    {replying && <ReplyForm compact postId={postId} parentReplyId={reply.id} onAdded={onAdded} onCancel={() => setReplying(false)}/>}
    {children.length > 0 && <div className="mt-2 space-y-2">
      {children.map((child) => <ReplyThread key={child.id} reply={child} replies={replies} postId={postId} onAdded={onAdded} depth={depth + 1}/>)}
    </div>}
  </div>;
}

export function Posts() {
  const [posts, setPosts] = useState([]);
  const [state, setState] = useState({ loading: true, error: "" });
  useEffect(() => {
    getPosts().then((items) => {
      setPosts(items);
      setState({ loading: false, error: "" });
    }).catch((error) => setState({ loading: false, error: error.message }));
  }, []);

  function addReply(postId, reply) {
    setPosts((items) => items.map((post) =>
      post.id === postId ? { ...post, replies: [...(post.replies || []), reply] } : post
    ));
  }

  return <main className="page-enter min-h-screen bg-mist pt-14">
    <section className="shell py-20 text-center md:py-28">
      <p className="eyebrow">Notes & updates</p>
      <h1 className="headline mx-auto mt-5 max-w-4xl">Posts</h1>
      <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-black/50">
        Ideas, progress, and things worth sharing. Join the conversation—your name is optional.
      </p>
    </section>
    <section className="shell max-w-[820px] pb-24">
      {state.loading && <div className="flex justify-center py-20"><LoaderCircle className="animate-spin text-blue"/></div>}
      {state.error && <div className="rounded-2xl bg-white p-8 text-center text-red-600">{state.error}</div>}
      {!state.loading && !state.error && posts.length === 0 && <div className="rounded-[2rem] bg-white px-7 py-20 text-center">
        <MessageCircle className="mx-auto text-black/20" size={38}/>
        <h2 className="mt-5 text-2xl font-semibold tracking-tight">Nothing posted yet</h2>
        <p className="mt-2 text-black/45">The first update will appear here.</p>
      </div>}
      <div className="space-y-6">
        {posts.map((post) => <article key={post.id} className="overflow-hidden rounded-[2rem] bg-white shadow-sm shadow-black/[.03]">
          {post.image_url && <img src={post.image_url} alt="" className="max-h-[620px] w-full bg-black/[.02] object-cover" />}
          <div className="p-6 md:p-9">
            <time className="text-xs font-medium uppercase tracking-[.12em] text-black/35">{friendlyDate(post.created_at)}</time>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-.035em] md:text-4xl">{post.title}</h2>
            <div className="rich-content mt-6" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} />
            <div className="mt-8 flex items-center gap-2 text-sm font-medium text-black/45">
              <MessageCircle size={17}/> {post.replies?.length || 0} {(post.replies?.length || 0) === 1 ? "reply" : "replies"}
            </div>
            {post.replies?.length > 0 && <div className="mt-4 space-y-3">
              {post.replies.filter((reply) => !reply.parent_reply_id).map((reply) => <ReplyThread key={reply.id} reply={reply} replies={post.replies} postId={post.id} onAdded={(newReply) => addReply(post.id, newReply)}/>)}
            </div>}
            <ReplyForm postId={post.id} onAdded={(reply) => addReply(post.id, reply)}/>
          </div>
        </article>)}
      </div>
    </section>
  </main>;
}

const blankPost = { title: "", content: "", imageUrl: "" };

export function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState("email");
  const [state, setState] = useState({ loading: false, error: "", message: "" });

  async function requestCode(event) {
    event?.preventDefault();
    setState({ loading: true, error: "", message: "" });
    try {
      const response = await fetch(authEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "requestOtp", email }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (data.canVerify) {
          setStep("code");
          setState({ loading: false, error: data.error, message: "" });
          return;
        }
        throw new Error(data.error || "Could not send the verification code.");
      }
      setStep("code");
      setState({ loading: false, error: "", message: "A 6-digit code was sent. It remains valid for 15 minutes." });
    } catch (error) {
      setState({ loading: false, error: error.message, message: "" });
    }
  }

  async function verifyCode(event) {
    event.preventDefault();
    setState({ loading: true, error: "", message: "" });
    try {
      const response = await fetch(authEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verifyOtp", email, code }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Could not verify the code.");
      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      setState({ loading: false, error: error.message, message: "" });
    }
  }

  return <main className="page-enter flex min-h-[calc(100vh-3.5rem)] items-center bg-mist px-5 pt-14">
    <section className="mx-auto w-full max-w-md py-16">
      <div className="rounded-[2rem] bg-white p-7 text-center shadow-xl shadow-black/[.04] md:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue/10 text-blue">
          <ShieldCheck size={27} strokeWidth={1.7}/>
        </div>
        <p className="eyebrow mt-7">Private access</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-.04em]">Admin login</h1>
        <p className="mt-3 text-sm leading-relaxed text-black/45">{step === "email" ? "Use the configured admin email to receive a one-time verification code." : `Enter the code sent to ${email}.`}</p>
        {step === "email" ? <form onSubmit={requestCode} className="mt-8 text-left">
          <label className="text-sm font-semibold">Admin email
            <div className="relative mt-2">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={17}/>
              <input required autoFocus type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="post-input w-full pl-11" placeholder="you@example.com" autoComplete="email"/>
            </div>
          </label>
          {state.error && <p className="mt-3 text-sm text-red-600">{state.error}</p>}
          <button disabled={state.loading} className="button-primary mt-6 w-full disabled:opacity-50">
            {state.loading ? <LoaderCircle className="animate-spin" size={17}/> : <Send size={16}/>}
            {state.loading ? "Sending code…" : "Send verification code"}
          </button>
        </form> : <form onSubmit={verifyCode} className="mt-8 text-left">
          <label className="text-sm font-semibold">Verification code
            <div className="relative mt-2">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={17}/>
              <input required autoFocus inputMode="numeric" pattern="[0-9]{6}" maxLength="6" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} className="post-input w-full pl-11 text-lg tracking-[.25em]" placeholder="000000" autoComplete="one-time-code"/>
            </div>
          </label>
          {state.message && <p className="mt-3 text-sm text-green-600">{state.message}</p>}
          {state.error && <p className="mt-3 text-sm text-red-600">{state.error}</p>}
          <button disabled={state.loading || code.length !== 6} className="button-primary mt-6 w-full disabled:opacity-50">
            {state.loading ? <LoaderCircle className="animate-spin" size={17}/> : <LockKeyhole size={16}/>}
            {state.loading ? "Verifying…" : "Verify and sign in"}
          </button>
          <button type="button" onClick={() => { setStep("email"); setCode(""); setState({ loading: false, error: "", message: "" }); }} className="mt-4 w-full text-center text-sm font-medium text-blue">Use a different email</button>
          <button type="button" disabled={state.loading} onClick={requestCode} className="mt-3 w-full text-center text-xs font-medium text-black/40 transition hover:text-blue disabled:opacity-50">Send another code</button>
        </form>}
      </div>
    </section>
  </main>;
}

function RichEditor({ value, onChange }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) ref.current.innerHTML = value;
  }, [value]);

  function command(name, option) {
    ref.current?.focus();
    document.execCommand(name, false, option);
    onChange(ref.current?.innerHTML || "");
  }
  const controls = [
    [Bold, "Bold", () => command("bold")],
    [Italic, "Italic", () => command("italic")],
    [Heading1, "Heading", () => command("formatBlock", "h2")],
    [Heading2, "Subheading", () => command("formatBlock", "h3")],
    [Table2, "Table", () => command("insertHTML", "<table><tbody><tr><th>Heading</th><th>Heading</th></tr><tr><td>Cell</td><td>Cell</td></tr></tbody></table><p><br></p>")],
  ];
  return <div className="overflow-hidden rounded-2xl border bg-white focus-within:border-blue focus-within:ring-1 focus-within:ring-blue">
    <div className="flex flex-wrap gap-1 border-b bg-mist/70 p-2">
      {controls.map(([Icon, label, action]) => <button type="button" key={label} onMouseDown={(event) => event.preventDefault()} onClick={action} className="editor-tool" title={label} aria-label={label}><Icon size={17}/><span>{label}</span></button>)}
    </div>
    <div ref={ref} contentEditable suppressContentEditableWarning onInput={(event) => onChange(event.currentTarget.innerHTML)} data-placeholder="Share your story…" className="rich-editor min-h-[260px] px-5 py-4 outline-none" />
  </div>;
}

export function AdminPosts() {
  const navigate = useNavigate();
  const [authChecking, setAuthChecking] = useState(true);
  const [posts, setPosts] = useState([]);
  const [draft, setDraft] = useState(blankPost);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [state, setState] = useState({ loading: true, saving: false, uploading: false, message: "", error: "" });
  const [replyingTo, setReplyingTo] = useState(null);
  const [adminReply, setAdminReply] = useState("");
  const [commentState, setCommentState] = useState({ busy: null, error: "" });

  useEffect(() => {
    fetch(authEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "verifySession" }),
    }).then((response) => {
      if (!response.ok) throw new Error("Session expired.");
      setAuthChecking(false);
    }).catch(() => {
      navigate("/admin", { replace: true });
    });
  }, [navigate]);

  useEffect(() => {
    getPosts().then((items) => {
      setPosts(items);
      setState((old) => ({ ...old, loading: false }));
    }).catch((error) => setState((old) => ({ ...old, loading: false, error: error.message })));
  }, []);

  function authHeaders() {
    return { "Content-Type": "application/json" };
  }

  function resetDraft() {
    setDraft(blankPost);
    setEditingId(null);
    setImagePreview("");
  }

  function edit(post) {
    setEditingId(post.id);
    setDraft({ title: post.title, content: post.content, imageUrl: post.image_url || "" });
    setImagePreview(post.image_url || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function upload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      setState((old) => ({ ...old, error: "Please choose an image smaller than 4 MB." }));
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      setImagePreview(String(reader.result));
      setState((old) => ({ ...old, uploading: true, error: "", message: "" }));
      try {
        const response = await fetch("/.netlify/functions/upload-image", {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({ image: reader.result }),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || "Image upload failed.");
        setDraft((old) => ({ ...old, imageUrl: data.url }));
      } catch (error) {
        setState((old) => ({ ...old, error: error.message }));
      } finally {
        setState((old) => ({ ...old, uploading: false }));
      }
    };
    reader.readAsDataURL(file);
  }

  async function save(event) {
    event.preventDefault();
    if (!draft.content.replace(/<[^>]*>/g, "").trim()) {
      setState((old) => ({ ...old, error: "Add some post content." }));
      return;
    }
    setState((old) => ({ ...old, saving: true, error: "", message: "" }));
    try {
      const response = await fetch(`${endpoint}${editingId ? `?id=${editingId}` : ""}`, {
        method: editingId ? "PUT" : "POST",
        headers: authHeaders(),
        body: JSON.stringify(draft),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Could not save the post.");
      setPosts((items) => editingId
        ? items.map((post) => post.id === editingId ? { ...post, ...data.post } : post)
        : [{ ...data.post, replies: [] }, ...items]);
      resetDraft();
      setState((old) => ({ ...old, saving: false, message: editingId ? "Post updated." : "Post published." }));
    } catch (error) {
      setState((old) => ({ ...old, saving: false, error: error.message }));
    }
  }

  async function remove(id) {
    if (!window.confirm("Delete this post and all its replies?")) return;
    setState((old) => ({ ...old, error: "", message: "" }));
    try {
      const response = await fetch(`${endpoint}?id=${id}`, { method: "DELETE", headers: authHeaders() });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Could not delete the post.");
      setPosts((items) => items.filter((post) => post.id !== id));
      if (editingId === id) resetDraft();
      setState((old) => ({ ...old, message: "Post deleted." }));
    } catch (error) {
      setState((old) => ({ ...old, error: error.message }));
    }
  }

  async function answerVisitor(event, postId, parentReplyId) {
    event.preventDefault();
    if (!adminReply.trim()) return;
    setCommentState({ busy: parentReplyId, error: "" });
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ action: "adminReply", parentReplyId, message: adminReply }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Could not send your reply.");
      setPosts((items) => items.map((post) =>
        post.id === postId ? { ...post, replies: [...(post.replies || []), data.reply] } : post
      ));
      setReplyingTo(null);
      setAdminReply("");
      setCommentState({ busy: null, error: "" });
    } catch (error) {
      setCommentState({ busy: null, error: error.message });
    }
  }

  async function removeVisitorReply(postId, replyId) {
    if (!window.confirm("Delete this reply and every nested response beneath it?")) return;
    setCommentState({ busy: replyId, error: "" });
    try {
      const response = await fetch(`${endpoint}?replyId=${replyId}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Could not delete the reply.");
      setPosts((items) => items.map((post) => post.id === postId
        ? { ...post, replies: removeReplyBranch(post.replies || [], replyId) }
        : post
      ));
      if (replyingTo === replyId) {
        setReplyingTo(null);
        setAdminReply("");
      }
      setCommentState({ busy: null, error: "" });
    } catch (error) {
      setCommentState({ busy: null, error: error.message });
    }
  }

  async function logout() {
    fetch(authEndpoint, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ action: "logout" }),
    }).catch(() => {});
    navigate("/admin", { replace: true });
  }

  if (authChecking) return <main className="flex min-h-screen items-center justify-center bg-mist pt-14"><LoaderCircle className="animate-spin text-blue"/></main>;

  return <main className="page-enter min-h-screen bg-mist pt-14">
    <section className="shell grid gap-8 py-16 lg:grid-cols-[1.25fr_.75fr] lg:py-20">
      <div>
        <div className="mb-8 flex items-end justify-between gap-5">
          <div>
            <p className="eyebrow">Admin dashboard</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-.045em] md:text-6xl">{editingId ? "Edit post" : "Create a post"}</h1>
          </div>
          <button type="button" onClick={logout} className="button-secondary shrink-0 px-4"><LogOut size={15}/> Log out</button>
        </div>
        <form onSubmit={save} className="rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
          <label className="block text-sm font-semibold">Title
            <input required maxLength="160" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="post-input mt-2 w-full text-lg" placeholder="Give your post a title"/>
          </label>
          <div className="mt-6">
            <span className="text-sm font-semibold">Post content</span>
            <div className="mt-2"><RichEditor value={draft.content} onChange={(content) => setDraft({ ...draft, content })}/></div>
          </div>
          <div className="mt-6">
            <span className="text-sm font-semibold">Cover image</span>
            {imagePreview ? <div className="relative mt-2 overflow-hidden rounded-2xl bg-mist">
              <img src={imagePreview} alt="Post preview" className="max-h-80 w-full object-cover"/>
              <button type="button" onClick={() => { setImagePreview(""); setDraft({ ...draft, imageUrl: "" }); }} className="absolute right-3 top-3 rounded-full bg-black/70 p-2 text-white" aria-label="Remove image"><X size={16}/></button>
              {state.uploading && <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-sm font-medium text-white"><LoaderCircle className="mr-2 animate-spin" size={18}/> Uploading…</div>}
            </div> : <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed py-10 text-sm font-medium text-black/50 transition hover:border-blue hover:text-blue">
              <ImagePlus size={20}/> Choose an image (max 4 MB)
              <input type="file" accept="image/*" onChange={upload} className="sr-only"/>
            </label>}
          </div>
          {(state.error || state.message) && <p className={`mt-5 text-sm ${state.error ? "text-red-600" : "text-green-600"}`}>{state.error || state.message}</p>}
          <div className="mt-7 flex flex-wrap gap-3">
            <button disabled={state.saving || state.uploading} className="button-primary disabled:opacity-50">
              {state.saving ? <LoaderCircle className="animate-spin" size={17}/> : editingId ? <Pencil size={16}/> : <Plus size={17}/>}
              {state.saving ? "Saving…" : editingId ? "Save changes" : "Publish post"}
            </button>
            {editingId && <button type="button" onClick={resetDraft} className="button-secondary">Cancel</button>}
          </div>
        </form>
      </div>
      <aside className="lg:pt-28">
        <div className="rounded-[2rem] bg-ink p-6 text-white md:p-8">
          <div className="flex items-center justify-between"><h2 className="text-xl font-semibold">Published</h2><span className="text-sm text-white/40">{posts.length}</span></div>
          {state.loading ? <LoaderCircle className="mt-8 animate-spin text-white/50"/> : posts.length === 0 ? <p className="mt-8 text-sm text-white/45">Your published posts will appear here.</p> : <div className="mt-5 divide-y divide-white/10">
            {posts.map((post) => <div key={post.id} className="py-5">
              <p className="line-clamp-2 font-medium">{post.title}</p>
              <p className="mt-1 text-xs text-white/35">{friendlyDate(post.created_at)}</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => edit(post)} className="rounded-full bg-white/10 p-2.5 transition hover:bg-white/20" aria-label={`Edit ${post.title}`}><Pencil size={15}/></button>
                <button onClick={() => remove(post.id)} className="rounded-full bg-red-500/15 p-2.5 text-red-300 transition hover:bg-red-500/25" aria-label={`Delete ${post.title}`}><Trash2 size={15}/></button>
              </div>
            </div>)}
          </div>}
        </div>
        <div className="mt-5 rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Visitor replies</h2>
            <MessageCircle className="text-black/25" size={20}/>
          </div>
          {commentState.error && <p className="mt-3 text-sm text-red-600">{commentState.error}</p>}
          {posts.every((post) => !(post.replies || []).some((reply) => !reply.is_admin))
            ? <p className="mt-6 text-sm text-black/40">Visitor replies will appear here.</p>
            : <div className="mt-4 divide-y">
              {posts.flatMap((post) => (post.replies || [])
                .filter((reply) => !reply.is_admin)
                .map((reply) => ({ post, reply }))
              ).map(({ post, reply }) => <div key={reply.id} className="py-5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-blue">{post.title}</p>
                {reply.parent_reply_id && <p className="mt-1 text-[11px] text-black/35">Replying to {(post.replies || []).find((item) => item.id === reply.parent_reply_id)?.name || "a previous message"}</p>}
                <div className="mt-2 flex items-baseline justify-between gap-3">
                  <p className="text-sm font-semibold">{reply.name || "Anonymous"}</p>
                  <time className="shrink-0 text-[10px] text-black/30">{friendlyDate(reply.created_at)}</time>
                </div>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-black/60">{reply.message}</p>
                {(post.replies || []).filter((child) => child.parent_reply_id === reply.id && child.is_admin).map((child) => <div key={child.id} className="mt-3 rounded-xl bg-blue/[.055] px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-blue">Your reply</span>
                    <time className="text-[10px] text-black/30">{friendlyDate(child.created_at)}</time>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-black/60">{child.message}</p>
                </div>)}
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={() => {
                    setReplyingTo(replyingTo === reply.id ? null : reply.id);
                    setAdminReply("");
                    setCommentState({ busy: null, error: "" });
                  }} className="inline-flex items-center gap-1.5 rounded-full bg-blue/10 px-3 py-2 text-xs font-semibold text-blue transition hover:bg-blue/15">
                    <MessageCircle size={14}/> Reply
                  </button>
                  <button type="button" disabled={commentState.busy === reply.id} onClick={() => removeVisitorReply(post.id, reply.id)} className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50">
                    {commentState.busy === reply.id ? <LoaderCircle className="animate-spin" size={14}/> : <Trash2 size={14}/>} Delete
                  </button>
                </div>
                {replyingTo === reply.id && <form onSubmit={(event) => answerVisitor(event, post.id, reply.id)} className="mt-3">
                  <textarea required autoFocus maxLength="1000" rows="3" value={adminReply} onChange={(event) => setAdminReply(event.target.value)} className="post-input w-full resize-none text-sm" placeholder={`Reply to ${reply.name || "Anonymous"}…`}/>
                  <div className="mt-2 flex gap-2">
                    <button disabled={commentState.busy === reply.id} className="button-primary px-4 py-2 text-xs">
                      {commentState.busy === reply.id ? <LoaderCircle className="animate-spin" size={14}/> : <Send size={14}/>} Send
                    </button>
                    <button type="button" onClick={() => { setReplyingTo(null); setAdminReply(""); }} className="button-secondary px-4 py-2 text-xs">Cancel</button>
                  </div>
                </form>}
              </div>)}
            </div>}
        </div>
      </aside>
    </section>
  </main>;
}
