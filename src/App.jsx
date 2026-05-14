import { useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "born_prenatal_v8";
const DRAFT_KEY = "born_prenatal_draft_v8";
const ONBOARD_KEY = "born_prenatal_onboarded_v8";

const assetModules = import.meta.glob("./assets/**/*.{svg,png,webp,jpg,jpeg}", {
  eager: true,
  query: "?url",
  import: "default",
});

function getAsset(folder, name) {
  const extensions = ["svg", "png", "webp", "jpg", "jpeg"];
  for (const ext of extensions) {
    const key = `./assets/${folder}/${name}.${ext}`;
    if (assetModules[key]) return assetModules[key];
  }
  return null;
}

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const today = () => new Date().toISOString().slice(0, 10);
const fmtDate = value => {
  if (!value) return "날짜 없음";
  const [y, m, d] = value.split("-");
  return `${y}.${m}.${d}`;
};

const MOODS = [
  { id: "설렘", label: "설렘", emoji: "💗", c1: "#FFE8F4", c2: "#FFF8FB", accent: "#FF82B2" },
  { id: "행복", label: "행복", emoji: "☀️", c1: "#FFF6CF", c2: "#FFFBEA", accent: "#FFC83D" },
  { id: "편안함", label: "편안함", emoji: "☁️", c1: "#E8F5FF", c2: "#F6FBFF", accent: "#76BDF2" },
  { id: "감사", label: "감사", emoji: "🌸", c1: "#FFE8F0", c2: "#FFF7FA", accent: "#FF9CC3" },
  { id: "차분함", label: "차분함", emoji: "🌙", c1: "#EEE8FF", c2: "#FAF8FF", accent: "#9B87F5" },
  { id: "기대감", label: "기대감", emoji: "⭐", c1: "#FFF0D8", c2: "#FFF9EF", accent: "#FFAA3C" },
  { id: "사랑", label: "사랑", emoji: "💞", c1: "#FFE4EE", c2: "#FFF7FA", accent: "#FF6FA3" },
  { id: "평온함", label: "평온함", emoji: "🍃", c1: "#E9FAF0", c2: "#FAFFF9", accent: "#5FCB8A" },
  { id: "울컥함", label: "울컥함", emoji: "🥲", c1: "#EEF1FF", c2: "#FAFBFF", accent: "#8FA2FF" },
  { id: "용기", label: "용기", emoji: "🌈", c1: "#FFF1D8", c2: "#F8FFF2", accent: "#FF9A3D" },
];

const BACKGROUNDS = [
  { id: "garden", label: "정원", emoji: "🌷" },
  { id: "room", label: "아늑한 방", emoji: "🛋️" },
  { id: "sky", label: "파란 하늘", emoji: "☁️" },
  { id: "night", label: "별밤", emoji: "🌙" },
  { id: "beach", label: "바닷가", emoji: "🌊" },
  { id: "forest", label: "숲속", emoji: "🌲" },
  { id: "cafe", label: "카페", emoji: "☕" },
  { id: "rain", label: "비오는 날", emoji: "🌧️" },
  { id: "snow", label: "눈 오는 날", emoji: "❄️" },
  { id: "library", label: "도서관", emoji: "📚" },
  { id: "studio", label: "사진관", emoji: "📷" },
  { id: "clinic", label: "병원", emoji: "🏥" },
  { id: "picnic", label: "피크닉", emoji: "🧺" },
];

const CHARACTERS = [
  { id: "family", label: "온 가족", emoji: "👨‍👩‍👧" },
  { id: "mama", label: "엄마", emoji: "🤰" },
  { id: "mama_papa", label: "엄마+아빠", emoji: "👫" },
  { id: "mama_pet", label: "엄마+강아지", emoji: "🐶" },
  { id: "mama_cat", label: "엄마+고양이", emoji: "🐱" },
  { id: "mama_friend", label: "엄마+친구", emoji: "👭" },
  { id: "mama_grandma", label: "엄마+할머니", emoji: "👵" },
  { id: "couple_baby", label: "부부+아기상상", emoji: "👶" },
];

const ACTIVITIES = [
  { id: "taedam", label: "태담", emoji: "💬" },
  { id: "music", label: "음악", emoji: "🎵" },
  { id: "book", label: "독서", emoji: "📖" },
  { id: "walk", label: "산책", emoji: "🌿" },
  { id: "art", label: "그림", emoji: "🎨" },
  { id: "cooking", label: "요리", emoji: "🍲" },
  { id: "rest", label: "휴식", emoji: "🧸" },
  { id: "exercise", label: "운동", emoji: "🤸" },
  { id: "meditation", label: "명상", emoji: "🧘" },
  { id: "prenatal_music", label: "태교음악", emoji: "🎹" },
  { id: "letter", label: "편지", emoji: "✉️" },
  { id: "photo", label: "사진", emoji: "📸" },
  { id: "knitting", label: "뜨개질", emoji: "🧶" },
  { id: "bath", label: "목욕", emoji: "🛁" },
  { id: "yoga", label: "요가", emoji: "🧘‍♀️" },
  { id: "ultrasound", label: "초음파", emoji: "🩺" },
  { id: "nursery", label: "아기방", emoji: "🛏️" },
  { id: "shopping", label: "출산용품", emoji: "🛍️" },
  { id: "picnic", label: "피크닉", emoji: "🧺" },
  { id: "prayer", label: "기도", emoji: "🙏" },
];

const INITIAL = {
  babyInfo: {
    babyName: "콩콩이",
    motherName: "",
    fatherName: "",
    dueDate: "",
    firstFoundDate: "",
    firstFeeling: "",
    firstLetter: "",
    coverMood: "설렘",
    coverBg: "garden",
    coverChar: "family",
    coverActivity: "taedam",
  },
  records: [],
  checklist: [
    { id: uid(), text: "출산 가방 준비하기", done: false },
    { id: uid(), text: "아기 옷 세탁하기", done: false },
    { id: uid(), text: "산후조리 계획 세우기", done: false },
  ],
  bucketList: [
    { id: uid(), text: "아기에게 첫 편지 쓰기", done: false },
    { id: uid(), text: "부부가 함께 만삭 사진 찍기", done: false },
  ],
};

function getMood(id) {
  return MOODS.find(m => m.id === id) || MOODS[0];
}
function getItem(list, id) {
  return list.find(item => item.id === id) || list[0];
}
function safeLoad(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

async function compressImage(file, maxSize = 1400, quality = 0.82) {
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.src = url;
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });
  const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  URL.revokeObjectURL(url);
  return canvas.toDataURL("image/jpeg", quality);
}

function useAppData() {
  const [data, setData] = useState(() => safeLoad(STORAGE_KEY, INITIAL));
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) { alert("저장 공간이 부족할 수 있어요. 사진을 줄이거나 백업 후 정리해주세요."); }
  }, [data]);
  return [data, setData];
}

function AssetImg({ folder, name, alt, className }) {
  const src = getAsset(folder, name);
  if (!src) return null;
  return <img src={src} alt={alt} className={className} draggable="false" />;
}

function Scene({ scene, photo, editable, onEdit }) {
  const mood = getMood(scene?.mood || "설렘");
  if (photo) {
    return <div className="scene photo-scene"><img src={photo} alt="기록 사진" /></div>;
  }
  return (
    <div className="scene" style={{ "--accent": mood.accent, "--m1": mood.c1, "--m2": mood.c2 }}>
      <div className="scene-bg-gradient" />
      <AssetImg folder="backgrounds" name={scene?.bg || "garden"} alt="배경" className="scene-background" />
      <AssetImg folder="decorations" name="heart_leaf" alt="장식" className="scene-decoration" />
      <AssetImg folder="characters" name={scene?.character || "family"} alt="인물" className="scene-character" />
      <AssetImg folder="activities" name={scene?.activity || "taedam"} alt="활동" className="scene-activity" />
      {editable && <button className="edit-scene" onClick={onEdit} aria-label="그림 수정">✏️</button>}
    </div>
  );
}

function Onboarding({ onDone }) {
  const [page, setPage] = useState(0);
  const pages = [
    ["💗", "오늘의 마음을 남겨요", "기분, 배경, 인물, 태교 활동을 고르면 예쁜 장면이 만들어져요."],
    ["💾", "작성 중에도 안전하게", "기록은 자동저장되어 앱을 닫아도 이어서 쓸 수 있어요."],
    ["📖", "나중에는 책처럼", "저장된 기록은 챕터별 태교북과 PDF 미리보기로 모아볼 수 있어요."],
  ];
  return (
    <div className="modal-layer">
      <div className="onboard-card">
        <div className="onboard-emoji">{pages[page][0]}</div>
        <h2>{pages[page][1]}</h2>
        <p>{pages[page][2]}</p>
        <div className="dots">{pages.map((_, i) => <span key={i} className={i === page ? "on" : ""} />)}</div>
        <button className="primary" onClick={() => page < pages.length - 1 ? setPage(page + 1) : onDone()}>
          {page < pages.length - 1 ? "다음" : "시작하기"}
        </button>
      </div>
    </div>
  );
}

function Header({ tab, setTab }) {
  return (
    <header className="app-header">
      <div>
        <span className="eyebrow">BORN PRENATAL BOOK</span>
        <h1>태교 그림일기</h1>
      </div>
      <button className="pill" onClick={() => setTab(tab === "write" ? "book" : "write")}>{tab === "write" ? "책 보기" : "기록하기"}</button>
    </header>
  );
}

function BottomNav({ tab, setTab }) {
  const navs = [
    ["home", "홈", "🏠"],
    ["write", "기록", "✍️"],
    ["book", "태교북", "📖"],
    ["settings", "설정", "⚙️"],
  ];
  return <nav className="bottom-nav">{navs.map(([id, label, icon]) => <button key={id} className={tab === id ? "on" : ""} onClick={() => setTab(id)}><b>{icon}</b><span>{label}</span></button>)}</nav>;
}

function Home({ data, setData, setTab }) {
  const b = data.babyInfo;
  const scene = { mood: b.coverMood, bg: b.coverBg, character: b.coverChar, activity: b.coverActivity };
  return (
    <main className="screen">
      <section className="hero card">
        <Scene scene={scene} />
        <div className="hero-copy">
          <h2>{b.babyName || "우리 아기"}의 태교북</h2>
          <p>짧게 남겨도 괜찮아요. 하루의 마음을 책처럼 모아갑니다.</p>
        </div>
      </section>
      <div className="quick-grid">
        <button onClick={() => setTab("write")}>✍️ 오늘 기록하기</button>
        <button onClick={() => setTab("book")}>📖 태교북 보기</button>
      </div>
      <section className="card padded">
        <h3>기본 정보</h3>
        <div className="form-grid">
          <label>태명<input value={b.babyName} onChange={e => setData(d => ({ ...d, babyInfo: { ...d.babyInfo, babyName: e.target.value } }))} /></label>
          <label>출산 예정일<input type="date" value={b.dueDate} onChange={e => setData(d => ({ ...d, babyInfo: { ...d.babyInfo, dueDate: e.target.value } }))} /></label>
          <label>엄마 이름<input value={b.motherName} onChange={e => setData(d => ({ ...d, babyInfo: { ...d.babyInfo, motherName: e.target.value } }))} /></label>
          <label>아빠 이름<input value={b.fatherName} onChange={e => setData(d => ({ ...d, babyInfo: { ...d.babyInfo, fatherName: e.target.value } }))} /></label>
        </div>
      </section>
    </main>
  );
}

const defaultDraft = {
  type: "daily",
  date: today(),
  week: "",
  condition: "",
  message: "",
  memory: "",
  photo: "",
  scene: { mood: "설렘", bg: "garden", character: "family", activity: "taedam" },
};

function StepPicker({ draft, setDraft, onDone }) {
  const [step, setStep] = useState(0);
  const steps = [
    ["기분", MOODS, "mood"],
    ["배경", BACKGROUNDS, "bg"],
    ["인물", CHARACTERS, "character"],
    ["태교 활동", ACTIVITIES, "activity"],
  ];
  const [label, list, key] = steps[step];
  return (
    <div className="card padded picker-card">
      <div className="step-head"><strong>{label} 선택</strong><span>{step + 1}/4</span></div>
      <div className="choice-grid">
        {list.map(item => <button key={item.id} className={draft.scene[key] === item.id ? "selected" : ""} onClick={() => setDraft(v => ({ ...v, scene: { ...v.scene, [key]: item.id } }))}><b>{item.emoji}</b><span>{item.label}</span></button>)}
      </div>
      <div className="step-actions">
        <button className="ghost" disabled={step === 0} onClick={() => setStep(s => Math.max(0, s - 1))}>이전</button>
        <button className="primary" onClick={() => step < 3 ? setStep(s => s + 1) : onDone()}>{step < 3 ? "Next" : "완료"}</button>
      </div>
    </div>
  );
}

function PhotoInput({ draft, setDraft }) {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);
  const onFile = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return alert("이미지 파일만 선택해주세요.");
    try {
      setBusy(true);
      const compressed = await compressImage(file);
      setDraft(v => ({ ...v, photo: compressed }));
    } catch {
      alert("사진을 불러오지 못했어요. 다른 사진을 선택해주세요.");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };
  return (
    <div>
      {draft.photo ? <div className="photo-preview"><img src={draft.photo} alt="첨부 사진" /><button onClick={() => setDraft(v => ({ ...v, photo: "" }))}>사진 삭제</button></div> : <button className="photo-add" onClick={() => ref.current?.click()}>{busy ? "압축 중..." : "📷 사진 추가하기"}</button>}
      <input ref={ref} type="file" accept="image/*" hidden onChange={onFile} />
    </div>
  );
}

function Write({ data, setData, setTab }) {
  const [draft, setDraft] = useState(() => {
    try { return { ...defaultDraft, ...(JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}")) }; } catch { return defaultDraft; }
  });
  const [editingScene, setEditingScene] = useState(false);
  const [savedAt, setSavedAt] = useState("");
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      setSavedAt(new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }));
    } catch { alert("임시저장 공간이 부족해요. 사진을 삭제한 뒤 다시 시도해주세요."); }
  }, [draft]);
  const save = () => {
    if (!draft.message.trim() && !draft.memory.trim()) return alert("아기에게 남기는 말이나 오늘의 기억 중 하나는 작성해주세요.");
    const record = { ...draft, id: uid(), createdAt: new Date().toISOString() };
    setData(d => ({ ...d, records: [...d.records, record].sort((a, b) => (a.date || "").localeCompare(b.date || "")) }));
    localStorage.removeItem(DRAFT_KEY);
    setDraft({ ...defaultDraft, date: today() });
    setTab("book");
  };
  const clear = () => {
    if (!confirm("작성 중인 내용을 지울까요?")) return;
    localStorage.removeItem(DRAFT_KEY);
    setDraft({ ...defaultDraft, date: today() });
  };
  return (
    <main className="screen">
      <div className="autosave">💾 {savedAt || "방금"} 자동저장됨 <button onClick={clear}>작성 중 내용 지우기</button></div>
      <Scene scene={draft.scene} photo={draft.photo} editable onEdit={() => setEditingScene(true)} />
      {editingScene && <StepPicker draft={draft} setDraft={setDraft} onDone={() => setEditingScene(false)} />}
      <section className="card padded">
        <h3>오늘 기록</h3>
        <div className="form-grid">
          <label>기록 종류<select value={draft.type} onChange={e => setDraft(v => ({ ...v, type: e.target.value }))}><option value="daily">임신 주차 기록</option><option value="activity">태교 활동 기록</option><option value="hospital">병원 · 건강 관리</option></select></label>
          <label>날짜<input type="date" value={draft.date} onChange={e => setDraft(v => ({ ...v, date: e.target.value }))} /></label>
          <label>임신 주차<input placeholder="예: 18주 3일" value={draft.week} onChange={e => setDraft(v => ({ ...v, week: e.target.value }))} /></label>
          <label>컨디션<input placeholder="예: 편안함" value={draft.condition} onChange={e => setDraft(v => ({ ...v, condition: e.target.value }))} /></label>
        </div>
        <label>아기에게 남기는 말<textarea value={draft.message} onChange={e => setDraft(v => ({ ...v, message: e.target.value }))} placeholder="오늘은 너를 생각하면서..." /></label>
        <label>오늘의 기억<textarea value={draft.memory} onChange={e => setDraft(v => ({ ...v, memory: e.target.value }))} placeholder="오늘 있었던 일, 들은 음악, 산책 기록 등을 남겨보세요." /></label>
        <PhotoInput draft={draft} setDraft={setDraft} />
      </section>
      <section className="card padded preview-card">
        <h3>저장 전 미리보기</h3>
        <p><b>{fmtDate(draft.date)}</b> · 오늘의 기분: {draft.scene.mood} · 태교 활동: {getItem(ACTIVITIES, draft.scene.activity).label}</p>
        <div className="quote">“{draft.message || "아기에게 남기는 말이 여기에 보여요."}”</div>
        {draft.memory && <p>{draft.memory}</p>}
      </section>
      <button className="primary save-btn" onClick={save}>기록 저장하기</button>
    </main>
  );
}

function Book({ data, setData }) {
  const records = [...data.records].sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  const [includeCover, setIncludeCover] = useState(true);
  const [includePhoto, setIncludePhoto] = useState(true);
  const [layout, setLayout] = useState("one");
  const [selected, setSelected] = useState(() => records.map(r => r.id));
  useEffect(() => { setSelected(prev => records.length && prev.length === 0 ? records.map(r => r.id) : prev.filter(id => records.some(r => r.id === id))); }, [records.length]);
  const shown = records.filter(r => selected.includes(r.id));
  const estimated = Math.ceil(shown.length / (layout === "half" ? 2 : 1)) + (includeCover ? 1 : 0);
  const deleteRecord = id => {
    if (!confirm("이 기록을 삭제할까요?")) return;
    setData(d => ({ ...d, records: d.records.filter(r => r.id !== id) }));
  };
  return (
    <main className="screen book-screen">
      <section className="card padded print-panel no-print">
        <h3>PDF 출력 준비</h3>
        <div className="toggle-grid">
          <label><input type="checkbox" checked={includeCover} onChange={e => setIncludeCover(e.target.checked)} /> 표지 포함</label>
          <label><input type="checkbox" checked={includePhoto} onChange={e => setIncludePhoto(e.target.checked)} /> 사진 포함</label>
          <label>페이지 구성<select value={layout} onChange={e => setLayout(e.target.value)}><option value="one">기록 1개 = 1장</option><option value="half">기록 1개 = 1/2장</option></select></label>
        </div>
        <p className="small">예상 출력 페이지: {estimated}장</p>
        <div className="page-select">
          {records.map(r => <label key={r.id}><input type="checkbox" checked={selected.includes(r.id)} onChange={e => setSelected(s => e.target.checked ? [...s, r.id] : s.filter(id => id !== r.id))} /> {fmtDate(r.date)} · {r.type === "hospital" ? "병원 기록" : r.type === "activity" ? "태교 활동" : "임신 주차 기록"}</label>)}
        </div>
        <button className="primary" onClick={() => window.print()}>PDF 만들기</button>
      </section>

      {includeCover && <section className="book-cover print-page">
        <Scene scene={{ mood: data.babyInfo.coverMood, bg: data.babyInfo.coverBg, character: data.babyInfo.coverChar, activity: data.babyInfo.coverActivity }} />
        <h2>{data.babyInfo.babyName || "우리 아기"}의 태교북</h2>
        <p>예정일 {data.babyInfo.dueDate ? fmtDate(data.babyInfo.dueDate) : "미입력"}</p>
        <p>{data.babyInfo.motherName || "엄마"} · {data.babyInfo.fatherName || "아빠"}</p>
      </section>}

      <section className="toc card padded print-page">
        <h3>목차</h3>
        <ol>
          <li>Chapter 1. 우리 아기를 기다리며</li>
          <li>Chapter 2. 임신 주차별 기록</li>
          <li>Chapter 3. 태교 활동 기록</li>
          <li>Chapter 4. 병원 · 건강 관리</li>
          <li>Chapter 5. 출산 준비 & 버킷리스트</li>
        </ol>
      </section>

      <Chapter title="Chapter 2. 임신 주차별 기록" records={shown.filter(r => r.type === "daily")} includePhoto={includePhoto} onDelete={deleteRecord} />
      <Chapter title="Chapter 3. 태교 활동 기록" records={shown.filter(r => r.type === "activity")} includePhoto={includePhoto} onDelete={deleteRecord} />
      <Chapter title="Chapter 4. 병원 · 건강 관리" records={shown.filter(r => r.type === "hospital")} includePhoto={includePhoto} onDelete={deleteRecord} />
      <section className="chapter card padded print-page">
        <h3>Chapter 5. 출산 준비 & 버킷리스트</h3>
        {[...data.checklist, ...data.bucketList].map(item => <p key={item.id}>□ {item.text}</p>)}
      </section>
    </main>
  );
}

function Chapter({ title, records, includePhoto, onDelete }) {
  if (!records.length) return null;
  return <section className="chapter"><h3>{title}</h3>{records.map((r, i) => <article key={r.id} className="book-page print-page"><div className="page-top"><span>{fmtDate(r.date)}</span><span>page {String(i + 1).padStart(2, "0")}</span></div><p className="meta">오늘의 기분: {r.scene.mood} · 태교 활동: {getItem(ACTIVITIES, r.scene.activity).label}{r.condition ? ` · 컨디션: ${r.condition}` : ""}</p><Scene scene={r.scene} photo={includePhoto ? r.photo : ""} /><h4>아기에게 남기는 글</h4><div className="quote">“{r.message || ""}”</div>{r.memory && <p className="memory">{r.memory}</p>}<button className="delete no-print" onClick={() => onDelete(r.id)}>삭제</button></article>)}</section>;
}

function Settings({ data, setData }) {
  const importRef = useRef(null);
  const backup = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `taegyo-book-backup-${today()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const restore = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const next = JSON.parse(reader.result);
        if (!confirm("현재 데이터를 백업 파일로 교체할까요?")) return;
        setData({ ...INITIAL, ...next });
      } catch { alert("백업 파일을 읽지 못했어요."); }
    };
    reader.readAsText(file);
    e.target.value = "";
  };
  const clearCache = async () => {
    if (!confirm("캐시와 서비스워커를 정리할까요?")) return;
    if ("serviceWorker" in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r => r.unregister()));
    }
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    }
    alert("정리 완료. 새로고침합니다.");
    location.reload();
  };
  const reset = () => {
    if (!confirm("전체 기록을 초기화할까요? 이 작업은 되돌릴 수 없어요.")) return;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(DRAFT_KEY);
    setData(INITIAL);
  };
  return <main className="screen"><section className="card padded"><h3>편의 기능</h3><button className="setting-btn" onClick={backup}>데이터 백업하기</button><button className="setting-btn" onClick={() => importRef.current?.click()}>데이터 불러오기</button><input ref={importRef} type="file" accept="application/json" hidden onChange={restore} /><button className="setting-btn" onClick={() => location.href = "mailto:ohseasonhan@gmail.com?subject=태교북 앱 피드백"}>불편한 점 보내기</button><button className="setting-btn" onClick={clearCache}>서비스워커/캐시 정리</button><button className="danger" onClick={reset}>전체 기록 초기화</button><p className="small">현재 기록은 이 기기의 브라우저에 저장됩니다. 브라우저 데이터를 삭제하면 기록이 사라질 수 있으니 중요한 기록은 백업해주세요.</p></section></main>;
}

export default function App() {
  const [data, setData] = useAppData();
  const [tab, setTab] = useState("home");
  const [onboard, setOnboard] = useState(() => localStorage.getItem(ONBOARD_KEY) === "1");
  const mood = getMood(data.babyInfo.coverMood || "설렘");
  const doneOnboard = () => { localStorage.setItem(ONBOARD_KEY, "1"); setOnboard(true); };
  return (
    <div className="app" style={{ "--app1": mood.c1, "--app2": mood.c2, "--accent": mood.accent }}>
      <div className="app-bg" />
      {!onboard && <Onboarding onDone={doneOnboard} />}
      <Header tab={tab} setTab={setTab} />
      {tab === "home" && <Home data={data} setData={setData} setTab={setTab} />}
      {tab === "write" && <Write data={data} setData={setData} setTab={setTab} />}
      {tab === "book" && <Book data={data} setData={setData} />}
      {tab === "settings" && <Settings data={data} setData={setData} />}
      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );
}
