import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Download, FileText, Heart, Home, ImagePlus, RotateCcw, Save, Settings as SettingsIcon, Trash2, Upload, Wand2 } from "lucide-react";

const STORAGE_KEY = "born_taegyo_v7";
const DRAFT_KEY = "born_taegyo_draft_v7";
const ONBOARD_KEY = "born_taegyo_onboarded_v7";
const MAX_IMAGE_WIDTH = 1400;
const JPEG_QUALITY = 0.82;

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const today = () => new Date().toISOString().slice(0, 10);
const nowLabel = () => new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
const formatDate = (value) => {
  if (!value) return "날짜 없음";
  const [y, m, d] = value.split("-");
  return `${y}.${m}.${d}`;
};
const sortByDate = (list = []) => [...list].sort((a, b) => (a.date || "").localeCompare(b.date || "") || (a.createdAt || "").localeCompare(b.createdAt || ""));

const MOODS = [
  { id: "설렘", emoji: "💗", c1: "#fff0f7", c2: "#ffe2ef", accent: "#ff7fae" },
  { id: "행복", emoji: "☀️", c1: "#fff8d7", c2: "#fff1a8", accent: "#f2b705" },
  { id: "편안함", emoji: "☁️", c1: "#eef8ff", c2: "#d7ecff", accent: "#70afe8" },
  { id: "감사", emoji: "🌸", c1: "#fff1f4", c2: "#ffdbe5", accent: "#f58aaa" },
  { id: "차분함", emoji: "🌙", c1: "#f4f1ff", c2: "#e2dbff", accent: "#8b79e8" },
  { id: "사랑", emoji: "💞", c1: "#fff0f3", c2: "#ffd7e2", accent: "#ff6f9d" },
  { id: "뿌듯함", emoji: "😊", c1: "#f3ffe9", c2: "#ddf7cb", accent: "#73bd4f" },
  { id: "울컥함", emoji: "🥲", c1: "#f1f4ff", c2: "#dde5ff", accent: "#8497f3" },
  { id: "용기", emoji: "🌈", c1: "#fff3df", c2: "#ffdfb5", accent: "#ff9a45" },
  { id: "피곤함", emoji: "😴", c1: "#f3f6f8", c2: "#e1e8ee", accent: "#8fa5b5" }
];
const BACKGROUNDS = ["정원", "아늑한 방", "별밤", "바닷가", "숲속", "카페", "병원", "도서관", "피크닉", "눈 오는 날"];
const CHARACTERS = ["엄마와 아기", "엄마 + 아빠", "온 가족", "엄마 + 강아지", "엄마 + 고양이", "부부 + 아기상상"];
const ACTIVITIES = ["태담", "음악", "독서", "산책", "그림", "요리", "휴식", "명상", "편지", "사진", "요가", "초음파", "아기방 꾸미기", "출산용품 준비", "기도/소원"];

const INITIAL = {
  babyInfo: { babyName: "콩콩이", motherName: "", fatherName: "", dueDate: "", firstFoundDate: "", firstLetter: "" },
  records: [],
  checklist: [
    { id: uid(), text: "출산 가방 준비하기", done: false },
    { id: uid(), text: "아기 옷 세탁하기", done: false },
    { id: uid(), text: "산후조리 계획 세우기", done: false }
  ],
  buckets: [
    { id: uid(), text: "아기에게 첫 편지 쓰기", done: false },
    { id: uid(), text: "부부가 함께 만삭 사진 찍기", done: false }
  ],
  pdf: { includeCover: true, includePhotos: true, layout: "one", selectedIds: [] }
};

function safeParse(json, fallback) {
  try { return JSON.parse(json) ?? fallback; } catch { return fallback; }
}

function useLocalData() {
  const [data, setData] = useState(() => {
    const saved = safeParse(localStorage.getItem(STORAGE_KEY), null);
    if (!saved) return INITIAL;
    return { ...INITIAL, ...saved, babyInfo: { ...INITIAL.babyInfo, ...(saved.babyInfo || {}) }, pdf: { ...INITIAL.pdf, ...(saved.pdf || {}) } };
  });
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) { console.warn("storage failed", e); }
  }, [data]);
  return [data, setData];
}

async function compressImage(file) {
  if (!file.type.startsWith("image/")) throw new Error("이미지 파일만 사용할 수 있어요.");
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const img = await new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = dataUrl;
  });
  const ratio = Math.min(1, MAX_IMAGE_WIDTH / img.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * ratio);
  canvas.height = Math.round(img.height * ratio);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}

function moodById(id) { return MOODS.find((m) => m.id === id) || MOODS[0]; }

function Scene({ mood = "설렘", background = "정원", character = "온 가족", activity = "태담", photo, includePhoto = true }) {
  const m = moodById(mood);
  if (photo && includePhoto) return <img className="scene-photo" src={photo} alt="기록 사진" />;
  return (
    <div className="scene" style={{ background: `linear-gradient(145deg, ${m.c1}, ${m.c2})` }}>
      <div className="scene-heart" style={{ background: m.accent }} />
      <div className="scene-leaf left">❧</div><div className="scene-leaf right">❧</div>
      <div className="scene-bg-label">{background}</div>
      <div className="scene-family">
        {character.includes("아빠") || character.includes("가족") || character.includes("부부") ? <Person type="papa" /> : null}
        <Person type="mama" accent={m.accent} />
        {character.includes("가족") || character.includes("아기") ? <Person type="baby" /> : null}
        {character.includes("강아지") ? <Pet type="dog" /> : null}
        {character.includes("고양이") ? <Pet type="cat" /> : null}
      </div>
      <div className="scene-activity" style={{ borderColor: m.accent }}>{ACTIVITY_EMOJI[activity] || "💬"} {activity}</div>
      <div className="scene-mood">{m.emoji} {mood}</div>
    </div>
  );
}
const ACTIVITY_EMOJI = { 태담: "💬", 음악: "🎵", 독서: "📖", 산책: "🌿", 그림: "🎨", 요리: "🍲", 휴식: "🧸", 명상: "🧘", 편지: "✉️", 사진: "📸", 요가: "🧘‍♀️", 초음파: "🩺", "아기방 꾸미기": "🛏️", "출산용품 준비": "🛍️", "기도/소원": "🙏" };
function Person({ type, accent = "#ff7fae" }) {
  const isMama = type === "mama", isPapa = type === "papa", isBaby = type === "baby";
  return <div className={`person ${type}`}><div className="hair" /><div className="face"><span className="eye l"/><span className="eye r"/><span className="smile"/></div><div className="body" style={{ background: isMama ? accent : isPapa ? "#89b9f5" : "#ffd76a" }}>{isBaby ? "♡" : ""}</div></div>;
}
function Pet({ type }) { return <div className={`pet ${type}`}><div className="pet-ear a"/><div className="pet-ear b"/><div className="pet-face">•ᴥ•</div></div>; }

function Onboarding({ onDone }) {
  const slides = [
    ["오늘의 마음을 남겨요", "기분, 배경, 인물, 활동을 고르면 자동으로 장면이 만들어져요.", "💗"],
    ["작성 중에도 안전하게", "기록은 자동저장되고, 앱을 닫아도 이어서 작성할 수 있어요.", "💾"],
    ["나중에는 책처럼", "기록을 챕터별로 모아보고 PDF 저장까지 준비할 수 있어요.", "📖"]
  ];
  const [i, setI] = useState(0);
  return <div className="modal-back"><div className="onboard card"><div className="big-emoji">{slides[i][2]}</div><h2>{slides[i][0]}</h2><p>{slides[i][1]}</p><div className="dots">{slides.map((_, idx) => <span key={idx} className={idx === i ? "on" : ""}/> )}</div><button className="btn primary" onClick={() => i < slides.length - 1 ? setI(i + 1) : onDone()}>{i < slides.length - 1 ? "다음" : "시작하기"}</button></div></div>;
}

function Header({ babyName, setBabyName }) {
  const [edit, setEdit] = useState(false); const [value, setValue] = useState(babyName || "");
  useEffect(() => setValue(babyName || ""), [babyName]);
  return <header className="header"><div><span>PREGNANCY DIARY</span><h1>품안태교북</h1></div>{edit ? <div className="pill-edit"><input value={value} onChange={(e)=>setValue(e.target.value)} autoFocus/><button onClick={()=>{setBabyName(value.trim() || "우리 아기");setEdit(false);}}>완료</button></div> : <button className="baby-pill" onClick={()=>setEdit(true)}>{babyName || "태명 입력"} ✏️</button>}</header>;
}

function HomeScreen({ data, setTab }) {
  const count = data.records.length;
  return <main className="screen"><section className="hero card"><Scene mood="사랑" character="온 가족" activity="태담" background="정원"/><div className="hero-text"><h2>{data.babyInfo.babyName || "우리 아기"}의 태교북</h2><p>짧게 기록해도 괜찮아요. 오늘의 마음이 나중에 한 권의 책이 됩니다.</p></div></section><div className="quick"><button onClick={()=>setTab("write")}><Wand2/> 오늘 기록하기</button><button onClick={()=>setTab("book")}><BookOpen/> 태교북 보기</button><button onClick={()=>setTab("settings")}><SettingsIcon/> 편의 설정</button></div><section className="card pad"><h3>기록 현황</h3><div className="stats"><div><b>{count}</b><span>전체 기록</span></div><div><b>{data.records.filter(r=>r.photo).length}</b><span>사진 기록</span></div><div><b>{data.checklist.filter(x=>x.done).length}</b><span>준비 완료</span></div></div></section><section className="card pad"><h3>편의 기능</h3><ul className="soft-list"><li>작성 중 자동저장 및 복구</li><li>사진 자동 압축 저장</li><li>데이터 백업/복원</li><li>삭제·초기화 전 확인</li><li>PDF 출력용 페이지 선택</li></ul></section></main>;
}

const emptyDraft = () => ({ kind: "daily", step: 0, date: today(), week: "", mood: "설렘", background: "정원", character: "온 가족", activity: "태담", condition: "", message: "", memory: "", photo: "", createdAt: new Date().toISOString() });
function WriteScreen({ data, setData }) {
  const [draft, setDraft] = useState(() => safeParse(localStorage.getItem(DRAFT_KEY), emptyDraft()));
  const [savedAt, setSavedAt] = useState(""); const fileRef = useRef(null); const [photoError, setPhotoError] = useState("");
  useEffect(() => { localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); setSavedAt(nowLabel()); }, [draft]);
  const pickList = [MOODS.map(m=>m.id), BACKGROUNDS, CHARACTERS, ACTIVITIES];
  const keys = ["mood", "background", "character", "activity"];
  const titles = ["오늘의 기분을 골라요", "오늘의 배경을 골라요", "누가 함께하나요?", "어떤 태교 활동을 했나요?", "마지막으로 글을 남겨요"];
  const saveRecord = () => {
    const record = { ...draft, id: uid(), createdAt: new Date().toISOString() };
    setData(p => ({ ...p, records: sortByDate([...p.records, record]), pdf: { ...p.pdf, selectedIds: [...new Set([...(p.pdf.selectedIds||[]), record.id])] } }));
    localStorage.removeItem(DRAFT_KEY); setDraft(emptyDraft()); alert("기록이 저장됐어요.");
  };
  const clearDraft = () => { if (confirm("작성 중인 내용을 지울까요?")) { localStorage.removeItem(DRAFT_KEY); setDraft(emptyDraft()); } };
  const onPhoto = async (file) => { setPhotoError(""); try { const compressed = await compressImage(file); setDraft(d=>({ ...d, photo: compressed })); } catch(e) { setPhotoError(e.message || "사진 저장에 실패했어요."); } };
  return <main className="screen"><div className="top-line"><span>💾 {savedAt || "방금"} 자동저장됨</span><button onClick={clearDraft}>작성 중 내용 지우기</button></div><section className="card pad writer"><h2>{titles[draft.step]}</h2>{draft.step < 4 ? <><Scene mood={draft.mood} background={draft.background} character={draft.character} activity={draft.activity} photo={draft.photo}/><div className="grid-pick">{pickList[draft.step].map(item => <button key={item} className={draft[keys[draft.step]] === item ? "choice on" : "choice"} onClick={()=>setDraft(d=>({ ...d, [keys[d.step]]: item }))}>{MOODS.find(m=>m.id===item)?.emoji || ACTIVITY_EMOJI[item] || "♡"}<span>{item}</span></button>)}</div></> : <FinalWrite draft={draft} setDraft={setDraft} fileRef={fileRef} onPhoto={onPhoto} photoError={photoError}/>}<div className="nav-row"><button className="btn" disabled={draft.step===0} onClick={()=>setDraft(d=>({ ...d, step: Math.max(0, d.step-1) }))}><ArrowLeft size={16}/> 이전</button>{draft.step < 4 ? <button className="btn primary" onClick={()=>setDraft(d=>({ ...d, step: d.step+1 }))}>Next <ArrowRight size={16}/></button> : <button className="btn primary" onClick={saveRecord}><Save size={16}/> 저장</button>}</div></section></main>;
}
function FinalWrite({ draft, setDraft, fileRef, onPhoto, photoError }) {
  return <div className="final-write"><div className="preview-page"><Scene {...draft}/><p className="preview-date">{formatDate(draft.date)} · {draft.mood} · {draft.activity}</p>{draft.message && <blockquote>“{draft.message}”</blockquote>}</div><div className="form-grid"><label>작성 날짜<input type="date" value={draft.date} onChange={e=>setDraft(d=>({ ...d, date:e.target.value }))}/></label><label>임신 주차<input placeholder="예: 24주 3일" value={draft.week} onChange={e=>setDraft(d=>({ ...d, week:e.target.value }))}/></label><label>컨디션<input placeholder="예: 편안함, 조금 피곤함" value={draft.condition} onChange={e=>setDraft(d=>({ ...d, condition:e.target.value }))}/></label><label>아기에게 남기는 말<textarea value={draft.message} onChange={e=>setDraft(d=>({ ...d, message:e.target.value }))} placeholder="오늘은 너를 생각하면서..."/></label><label>오늘의 기억<textarea value={draft.memory} onChange={e=>setDraft(d=>({ ...d, memory:e.target.value }))} placeholder="짧게라도 남겨보세요."/></label></div><input ref={fileRef} hidden type="file" accept="image/*" onChange={e=>e.target.files?.[0] && onPhoto(e.target.files[0])}/><div className="photo-actions"><button className="btn" onClick={()=>fileRef.current?.click()}><ImagePlus size={16}/> 사진 추가/교체</button>{draft.photo && <button className="btn danger" onClick={()=>setDraft(d=>({ ...d, photo:"" }))}><Trash2 size={16}/> 사진 삭제</button>}</div>{photoError && <p className="error">{photoError}</p>}</div>;
}

function BookScreen({ data, setData }) {
  const selected = data.records.filter(r => (data.pdf.selectedIds?.length ? data.pdf.selectedIds.includes(r.id) : true));
  const pageCount = (data.pdf.includeCover ? 1 : 0) + (data.pdf.layout === "half" ? Math.ceil(selected.length / 2) : selected.length);
  const toggleRecord = (id) => setData(p => { const selectedIds = p.pdf.selectedIds?.length ? p.pdf.selectedIds : p.records.map(r=>r.id); return { ...p, pdf: { ...p.pdf, selectedIds: selectedIds.includes(id) ? selectedIds.filter(x=>x!==id) : [...selectedIds, id] } }; });
  return <main className="screen book-screen"><section className="card pad pdf-panel"><h3>PDF 출력 준비</h3><div className="pdf-options"><label><input type="checkbox" checked={data.pdf.includeCover} onChange={e=>setData(p=>({ ...p, pdf:{...p.pdf, includeCover:e.target.checked} }))}/> 표지 포함</label><label><input type="checkbox" checked={data.pdf.includePhotos} onChange={e=>setData(p=>({ ...p, pdf:{...p.pdf, includePhotos:e.target.checked} }))}/> 사진 포함</label><select value={data.pdf.layout} onChange={e=>setData(p=>({ ...p, pdf:{...p.pdf, layout:e.target.value} }))}><option value="one">기록 1개 = 1장</option><option value="half">기록 1개 = 1/2장</option></select></div><p className="muted">예상 출력 페이지: <b>{pageCount}</b>장</p><button className="btn primary" onClick={()=>window.print()}><FileText size={16}/> PDF 만들기</button></section><section className="card pad"><h3>출력용 페이지 선택</h3>{data.records.length === 0 ? <p className="muted">아직 저장된 기록이 없어요.</p> : data.records.map(r => <label key={r.id} className="record-check"><input type="checkbox" checked={(data.pdf.selectedIds?.length ? data.pdf.selectedIds : data.records.map(x=>x.id)).includes(r.id)} onChange={()=>toggleRecord(r.id)}/><span>{formatDate(r.date)} · {r.mood} · {r.activity}</span></label>)}</section><div className="storybook printable"><Cover data={data}/><Toc data={data}/>{selected.map((r, i)=><BookPage key={r.id} record={r} idx={i+1} includePhoto={data.pdf.includePhotos} onDelete={()=>{ if(confirm("이 기록을 삭제할까요?")) setData(p=>({ ...p, records:p.records.filter(x=>x.id!==r.id), pdf:{...p.pdf, selectedIds:(p.pdf.selectedIds||[]).filter(x=>x!==r.id)} })); }}/>)}</div></main>;
}
function Cover({ data }) { return <section className="book-cover"><Heart/><h2>{data.babyInfo.babyName || "우리 아기"}의 태교북</h2><p>엄마 {data.babyInfo.motherName || ""} · 아빠 {data.babyInfo.fatherName || ""}</p><p>예정일 {data.babyInfo.dueDate ? formatDate(data.babyInfo.dueDate) : "미입력"}</p></section>; }
function Toc({ data }) { return <section className="toc card pad"><h3>목차</h3>{["Chapter 1. 우리 아기를 기다리며", "Chapter 2. 임신 주차별 기록", "Chapter 3. 태교 활동 기록", "Chapter 4. 병원 · 건강 관리", "Chapter 5. 출산 준비 & 버킷리스트"].map(x=><p key={x}>{x}</p>)}</section>; }
function BookPage({ record, idx, includePhoto, onDelete }) { return <article className="book-page"><div className="page-head"><span>{formatDate(record.date)}</span><button className="icon-btn no-print" onClick={onDelete}><Trash2 size={15}/></button></div><p className="meta">오늘의 기분: {record.mood} · 태교 활동: {record.activity}{record.week ? ` · ${record.week}` : ""}</p><Scene {...record} includePhoto={includePhoto}/>{record.message && <div className="letter"><b>아기에게 남기는 글</b><blockquote>“{record.message}”</blockquote></div>}{record.memory && <p className="memory">{record.memory}</p>}<span className="page-num">page {String(idx).padStart(2,"0")}</span></article>; }

function SettingsScreen({ data, setData }) {
  const importRef = useRef(null);
  const reset = () => { if (confirm("모든 기록과 설정을 초기화할까요? 이 작업은 되돌릴 수 없어요.")) { localStorage.removeItem(STORAGE_KEY); localStorage.removeItem(DRAFT_KEY); setData(INITIAL); } };
  const backup = () => { const blob = new Blob([JSON.stringify({ version: 7, exportedAt: new Date().toISOString(), data }, null, 2)], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `taegyo-book-backup-${today()}.json`; a.click(); URL.revokeObjectURL(a.href); };
  const restore = async (file) => { try { const text = await file.text(); const parsed = JSON.parse(text); const restored = parsed.data || parsed; if (!restored.records || !restored.babyInfo) throw new Error(); if (confirm("백업 파일의 데이터로 복원할까요? 현재 기록은 덮어쓰기 됩니다.")) setData({ ...INITIAL, ...restored }); } catch { alert("백업 파일을 읽을 수 없어요."); } };
  const cleanCache = async () => { if ("serviceWorker" in navigator) { const regs = await navigator.serviceWorker.getRegistrations(); await Promise.all(regs.map(r=>r.unregister())); } if ("caches" in window) { const keys = await caches.keys(); await Promise.all(keys.map(k=>caches.delete(k))); } alert("캐시를 정리했어요. 새로고침해주세요."); };
  return <main className="screen"><section className="card pad"><h3>기본 정보</h3><div className="form-grid"><label>태명<input value={data.babyInfo.babyName} onChange={e=>setData(p=>({ ...p, babyInfo:{...p.babyInfo,babyName:e.target.value} }))}/></label><label>엄마 이름<input value={data.babyInfo.motherName} onChange={e=>setData(p=>({ ...p, babyInfo:{...p.babyInfo,motherName:e.target.value} }))}/></label><label>아빠 이름<input value={data.babyInfo.fatherName} onChange={e=>setData(p=>({ ...p, babyInfo:{...p.babyInfo,fatherName:e.target.value} }))}/></label><label>출산 예정일<input type="date" value={data.babyInfo.dueDate} onChange={e=>setData(p=>({ ...p, babyInfo:{...p.babyInfo,dueDate:e.target.value} }))}/></label></div></section><section className="card pad"><h3>백업 / 복원</h3><div className="stack"><button className="btn" onClick={backup}><Download size={16}/> 데이터 백업하기</button><button className="btn" onClick={()=>importRef.current?.click()}><Upload size={16}/> 데이터 불러오기</button><input ref={importRef} hidden type="file" accept="application/json" onChange={e=>e.target.files?.[0] && restore(e.target.files[0])}/><button className="btn" onClick={cleanCache}><RotateCcw size={16}/> 서비스워커/캐시 정리</button></div><p className="notice">현재 기록과 사진은 이 기기의 브라우저에 저장됩니다. 휴대폰 변경 전에는 꼭 백업해주세요.</p></section><section className="card pad"><h3>피드백 / 안내</h3><button className="btn" onClick={()=>location.href="mailto:ohseasonhan@gmail.com?subject=품안태교북 피드백&body=불편한 점:%0A개선 아이디어:%0A사용 기기:"}>불편한 점 보내기</button><p className="muted">무료 베타 단계에서는 결제 없이 기능 테스트를 우선합니다.</p></section><section className="card pad danger-zone"><h3>위험 구역</h3><button className="btn danger" onClick={reset}><Trash2 size={16}/> 전체 기록 초기화</button></section></main>;
}

export default function App() {
  const [data, setData] = useLocalData(); const [tab, setTab] = useState("home"); const [showOnboard, setShowOnboard] = useState(() => localStorage.getItem(ONBOARD_KEY) !== "1");
  const sortedData = useMemo(()=>({ ...data, records: sortByDate(data.records || []) }), [data]);
  const setBabyName = (name) => setData(p=>({ ...p, babyInfo:{...p.babyInfo,babyName:name} }));
  return <><div className="app-bg"/><div className="app"><Header babyName={sortedData.babyInfo.babyName} setBabyName={setBabyName}/>{tab==="home" && <HomeScreen data={sortedData} setTab={setTab}/>} {tab==="write" && <WriteScreen data={sortedData} setData={setData}/>} {tab==="book" && <BookScreen data={sortedData} setData={setData}/>} {tab==="settings" && <SettingsScreen data={sortedData} setData={setData}/>}<nav className="bottom-nav"><button className={tab==="home"?"on":""} onClick={()=>setTab("home")}><Home/>홈</button><button className={tab==="write"?"on":""} onClick={()=>setTab("write")}><Wand2/>기록</button><button className={tab==="book"?"on":""} onClick={()=>setTab("book")}><BookOpen/>태교북</button><button className={tab==="settings"?"on":""} onClick={()=>setTab("settings")}><SettingsIcon/>설정</button></nav></div>{showOnboard && <Onboarding onDone={()=>{localStorage.setItem(ONBOARD_KEY,"1");setShowOnboard(false);}}/>}</>;
}
