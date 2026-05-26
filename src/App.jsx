import React, { useState, useEffect, useMemo, useRef } from "react";

import familyPng from "./assets/characters/family.png";
import mamaPng from "./assets/characters/mama.png";
import mamaPapaPng from "./assets/characters/mama_papa.png";
import mamaPetPng from "./assets/characters/mama_pet.png";
import mamaCatPng from "./assets/characters/mama_cat.png";
import mamaFriendPng from "./assets/characters/mama_friend.png";
import mamaGrandmaPng from "./assets/characters/mama_grandma.png";
import coupleBabyPng from "./assets/characters/couple_baby.png";

import taedamPng from "./assets/activities/taedam.png";
import musicPng from "./assets/activities/music.png";
import bookPng from "./assets/activities/book.png";
import artPng from "./assets/activities/art.png";
import cookingPng from "./assets/activities/cooking.png";
import restPng from "./assets/activities/rest.png";
import exercisePng from "./assets/activities/exercise.png";
import prenatalMusicPng from "./assets/activities/prenatal_music.png";
import letterPng from "./assets/activities/letter.png";
import knittingPng from "./assets/activities/knitting.png";
import bathPng from "./assets/activities/bath.png";
import yogaPng from "./assets/activities/yoga.png";
import ultrasoundPng from "./assets/activities/ultrasound.png";
import nurseryPng from "./assets/activities/nursery.png";
import shoppingPng from "./assets/activities/shopping.png";
import picnicPng from "./assets/activities/picnic.png";
import prayerPng from "./assets/activities/prayer.png";

import bgBeach from "./assets/backgrounds/beach.png";
import bgCafe from "./assets/backgrounds/cafe.png";
import bgClinic from "./assets/backgrounds/clinic.png";
import bgForest from "./assets/backgrounds/forest.png";
import bgGarden from "./assets/backgrounds/garden.png";
import bgLibrary from "./assets/backgrounds/library.png";
import bgNight from "./assets/backgrounds/night.png";
import bgPicnic from "./assets/backgrounds/picnic.png";
import bgRain from "./assets/backgrounds/rain.png";
import bgRoom from "./assets/backgrounds/room.png";
import bgSky from "./assets/backgrounds/sky.png";
import bgSnow from "./assets/backgrounds/snow.png";
import bgStudio from "./assets/backgrounds/studio.png";

const STORAGE_KEY = "taegyo_book_family_v2";
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const today = () => new Date().toISOString().slice(0, 10);
const fmtDate = (value) => {
  if (!value) return "날짜 없음";
  const [y, m, d] = value.split("-");
  return `${y}.${m}.${d}`;
};
const sortByDate = (list) => [...list].sort((a, b) => (a.date || "").localeCompare(b.date || "") || (a.createdAt || "").localeCompare(b.createdAt || ""));

const MOODS = [
  { id: "설렘", label: "설렘", emoji: "💗", sky: ["#fff0f7", "#fffafd"], accent: "#ee8bb2", deep: "#b85e82", mark: "♡" },
  { id: "행복", label: "행복", emoji: "☀️", sky: ["#fff3cb", "#fffaf0"], accent: "#efb542", deep: "#a87517", mark: "✦" },
  { id: "편안함", label: "편안함", emoji: "☁️", sky: ["#e8f5ff", "#f9fcff"], accent: "#75b7e8", deep: "#3e80aa", mark: "☁" },
  { id: "감사", label: "감사", emoji: "🌸", sky: ["#ffeef5", "#fffafd"], accent: "#ef9ab7", deep: "#b75f7b", mark: "✿" },
  { id: "차분함", label: "차분함", emoji: "🌙", sky: ["#efedff", "#fbfaff"], accent: "#9789dd", deep: "#5f55a4", mark: "☾" },
  { id: "기대감", label: "기대감", emoji: "⭐", sky: ["#fff0d9", "#fffaf4"], accent: "#ee9f48", deep: "#a86728", mark: "✦" },
  { id: "피곤함", label: "피곤함", emoji: "😴", sky: ["#edf2f5", "#fbfcfd"], accent: "#91a6b2", deep: "#5f7580", mark: "z" },
  { id: "감동", label: "감동", emoji: "🥹", sky: ["#ffe9e9", "#fff9f9"], accent: "#e98585", deep: "#a95454", mark: "♡" },
  { id: "신남", label: "신남", emoji: "🎉", sky: ["#fff0e7", "#fff9f5"], accent: "#ee8f59", deep: "#a95b34", mark: "✦" },
  { id: "두근두근", label: "두근두근", emoji: "💓", sky: ["#ffe7fb", "#fff8fe"], accent: "#d97bc6", deep: "#994b8a", mark: "♡" },
  { id: "따뜻함", label: "따뜻함", emoji: "🧡", sky: ["#fff0e3", "#fffaf6"], accent: "#ec9a5e", deep: "#9f6336", mark: "✦" },
  { id: "뿌듯함", label: "뿌듯함", emoji: "😊", sky: ["#edfae9", "#fbfff8"], accent: "#77bd6a", deep: "#438c3b", mark: "✿" },
  { id: "평온함", label: "평온함", emoji: "🍃", sky: ["#e9f8f0", "#fbfffa"], accent: "#6ac79b", deep: "#328766", mark: "✿" },
  { id: "울컥함", label: "울컥함", emoji: "🥲", sky: ["#eef1ff", "#fbfcff"], accent: "#8fa2f5", deep: "#5869bc", mark: "♡" },
  { id: "사랑", label: "사랑", emoji: "💞", sky: ["#ffe8f0", "#fff9fb"], accent: "#f27ea5", deep: "#b85075", mark: "♡" },
  { id: "용기", label: "용기", emoji: "🌈", sky: ["#fff1db", "#f9fff4"], accent: "#ee9b45", deep: "#a86124", mark: "✦" }
];
const BACKGROUNDS = [
  { id: "garden", label: "꽃 정원", emoji: "🌷" }, { id: "room", label: "아늑한 방", emoji: "🛋️" }, { id: "sky", label: "파란 하늘", emoji: "☁️" },
  { id: "night", label: "별밤", emoji: "🌙" }, { id: "beach", label: "바닷가", emoji: "🌊" }, { id: "forest", label: "숲속", emoji: "🌲" },
  { id: "cafe", label: "카페", emoji: "☕" }, { id: "rain", label: "비 오는 날", emoji: "🌧️" }, { id: "snow", label: "눈 오는 날", emoji: "❄️" },
  { id: "library", label: "도서관", emoji: "📚" }, { id: "studio", label: "사진관", emoji: "📷" }, { id: "clinic", label: "병원", emoji: "🏥" }, { id: "picnic", label: "피크닉", emoji: "🧺" }
];
const BACKGROUND_ASSETS = {
  beach: bgBeach,
  cafe: bgCafe,
  clinic: bgClinic,
  forest: bgForest,
  garden: bgGarden,
  library: bgLibrary,
  night: bgNight,
  picnic: bgPicnic,
  rain: bgRain,
  room: bgRoom,
  sky: bgSky,
  snow: bgSnow,
  studio: bgStudio
};
const CHARACTERS = [
  { id: "family", label: "온 가족", emoji: "👨‍👩‍👧" }, { id: "mama", label: "엄마와 아기", emoji: "🤰" }, { id: "mama_papa", label: "엄마 + 아빠", emoji: "👫" },
  { id: "mama_pet", label: "엄마 + 강아지", emoji: "🐶" }, { id: "mama_cat", label: "엄마 + 고양이", emoji: "🐱" }, { id: "mama_friend", label: "엄마 + 친구", emoji: "👭" },
  { id: "mama_grandma", label: "엄마 + 할머니", emoji: "👵" }, { id: "couple_baby", label: "부부 + 아기상상", emoji: "👶" }
];
const ACTIVITIES = [
  { id: "태담", label: "태담", emoji: "💬" },
  { id: "음악", label: "음악 듣기", emoji: "🎵" },
  { id: "독서", label: "독서", emoji: "📖" },
  { id: "그림", label: "그림", emoji: "🎨" },
  { id: "요리", label: "요리", emoji: "🍲" },
  { id: "휴식", label: "휴식", emoji: "🧸" },
  { id: "운동", label: "운동", emoji: "🤸" },
  { id: "명상", label: "명상", emoji: "🧘" },
  { id: "태교음악", label: "태교음악", emoji: "🎹" },
  { id: "편지", label: "편지 쓰기", emoji: "✉️" },
  { id: "뜨개질", label: "뜨개질", emoji: "🧶" },
  { id: "목욕", label: "따뜻한 목욕", emoji: "🛁" },
  { id: "요가", label: "임산부 요가", emoji: "🧘‍♀️" },
  { id: "초음파", label: "초음파 보기", emoji: "🩺" },
  { id: "아기방", label: "아기방 꾸미기", emoji: "🛏️" },
  { id: "쇼핑", label: "출산용품 준비", emoji: "🛍️" },
  { id: "피크닉", label: "피크닉", emoji: "🧺" },
  { id: "기도", label: "기도/소원", emoji: "🙏" }
];

const INITIAL = {
  babyInfo: { babyName: "", babyNamePromptDone: false, dueDate: "", motherName: "", fatherName: "", firstFoundDate: "", firstFeeling: "", firstLetter: "", introCompleted: false, coverMood: "사랑", coverBg: "garden", coverChar: "mama_papa", coverActivity: "태담" },
  dailyRecords: [], activityRecords: [], hospitalRecords: [],
  checklistItems: [{ id: uid(), text: "출산 가방 준비하기", done: false }, { id: uid(), text: "아기 옷 세탁하기", done: false }, { id: uid(), text: "산후조리 계획 세우기", done: false }],
  bucketListItems: [{ id: uid(), text: "아기에게 첫 편지 쓰기", done: false }, { id: uid(), text: "부부가 함께 만삭 사진 찍기", done: false }]
};
const getMood = (id) => MOODS.find((m) => m.id === id) || MOODS[0];
const getActivity = (id) => ACTIVITIES.find((a) => a.id === id) || ACTIVITIES[0];
const isIntroWritten = (babyInfo = {}) => Boolean(
  babyInfo.introCompleted ||
  babyInfo.dueDate ||
  babyInfo.motherName ||
  babyInfo.fatherName ||
  babyInfo.firstFoundDate ||
  babyInfo.firstFeeling ||
  babyInfo.firstLetter
);

const CHARACTER_ASSETS = {
  family: familyPng,
  mama: mamaPng,
  mama_papa: mamaPapaPng,
  mama_pet: mamaPetPng,
  mama_cat: mamaCatPng,
  mama_friend: mamaFriendPng,
  mama_grandma: mamaGrandmaPng,
  couple_baby: coupleBabyPng
};

const ACTIVITY_ASSETS = {
  태담: taedamPng,
  음악: musicPng,
  독서: bookPng,
  그림: artPng,
  요리: cookingPng,
  휴식: restPng,
  운동: exercisePng,
  태교음악: prenatalMusicPng,
  편지: letterPng,
  뜨개질: knittingPng,
  목욕: bathPng,
  요가: yogaPng,
  초음파: ultrasoundPng,
  아기방: nurseryPng,
  쇼핑: shoppingPng,
  피크닉: picnicPng,
  기도: prayerPng
};

const ACTIVITY_CROPS = {
  태담: { x: 0, y: 0, w: 1503, h: 1023 },
  음악: { x: 12, y: 1, w: 1492, h: 1022 },
  독서: { x: 52, y: 3, w: 1460, h: 1020 },
  그림: { x: 12, y: 0, w: 1462, h: 1023 },
  요리: { x: 12, y: 0, w: 1511, h: 1023 },
  휴식: { x: 63, y: 3, w: 1434, h: 1020 },
  운동: { x: 14, y: 0, w: 1483, h: 1022 },
  태교음악: { x: 12, y: 1, w: 1445, h: 1022 },
  편지: { x: 14, y: 5, w: 1381, h: 1017 },
  뜨개질: { x: 14, y: 7, w: 1464, h: 1015 },
  목욕: { x: 3, y: 0, w: 1533, h: 1022 },
  요가: { x: 12, y: 3, w: 1492, h: 1020 },
  초음파: { x: 12, y: 3, w: 1509, h: 1020 },
  아기방: { x: 12, y: 3, w: 1513, h: 1020 },
  쇼핑: { x: 12, y: 3, w: 1509, h: 1020 },
  피크닉: { x: 0, y: 1, w: 1536, h: 1021 },
  기도: { x: 14, y: 1, w: 1412, h: 1021 }
};

// ── 용량 유틸 ─────────────────────────────────────────
const STORAGE_WARN_BYTES  = 4.5 * 1024 * 1024; // 4.5 MB — 경고
const STORAGE_LIMIT_BYTES = 5   * 1024 * 1024; // 5 MB   — 사진 제거 후 재시도

function calcStorageBytes(data) {
  return new Blob([JSON.stringify(data)]).size;
}

/** 사진(photo 필드)을 모두 제거한 데이터를 반환 */
function stripPhotos(data) {
  const strip = (records) => records.map((r) => ({ ...r, photo: "" }));
  return {
    ...data,
    babyInfo: { ...data.babyInfo, coverPhoto: "" },
    dailyRecords:    strip(data.dailyRecords),
    activityRecords: strip(data.activityRecords),
    hospitalRecords: strip(data.hospitalRecords),
  };
}

function usePlanner() {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return INITIAL;
      const parsed = JSON.parse(saved);
      return { ...INITIAL, ...parsed, babyInfo: { ...INITIAL.babyInfo, ...(parsed.babyInfo || {}) }, dailyRecords: parsed.dailyRecords || [], activityRecords: parsed.activityRecords || [], hospitalRecords: parsed.hospitalRecords || [], checklistItems: parsed.checklistItems || INITIAL.checklistItems, bucketListItems: parsed.bucketListItems || INITIAL.bucketListItems };
    } catch { return INITIAL; }
  });

  useEffect(() => {
    const bytes = calcStorageBytes(data);
    if (bytes >= STORAGE_LIMIT_BYTES) {
      // 사진을 제거하고 재시도
      try {
        const stripped = stripPhotos(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stripped));
        console.warn("[태교북] 용량 초과 — 사진을 제거하고 저장했습니다.");
      } catch (e) {
        console.error("[태교북] 저장 실패:", e);
      }
    } else {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        console.error("[태교북] 저장 실패:", e);
      }
    }
  }, [data]);

  return [data, setData];
}
function usePhotoUpload(onPhoto, onError) {
  const ref = useRef(null);
  const trigger = () => ref.current?.click();
  const onChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // 최대 1200px로 리사이즈, JPEG quality 0.75 압축
        const MAX = 1200;
        let { width: w, height: h } = img;
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
          else       { w = Math.round(w * MAX / h); h = MAX; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        const compressed = canvas.toDataURL("image/jpeg", 0.75);
        // 압축 후에도 1MB 초과면 거부
        const sizeKB = Math.round(compressed.length * 0.75 / 1024);
        if (compressed.length * 0.75 > 1 * 1024 * 1024) {
          onError?.(`사진 용량이 너무 커요 (${sizeKB}KB). 더 작은 사진을 사용해주세요.`);
          return;
        }
        onPhoto(compressed);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };
  return { ref, trigger, onChange };
}

// ── 토스트 ────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = (message, type = "success") => {
    const id = uid();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 2800);
  };
  return { toasts, show };
}
function ToastLayer({ toasts }) {
  if (!toasts.length) return null;
  return (
    <div style={{ position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, zIndex: 9999, pointerEvents: "none", padding: "max(14px,env(safe-area-inset-top)) 16px 0" }}>
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>{t.message}</div>
      ))}
    </div>
  );
}

function BackgroundLayer({ bg, mood }) {
  const m = getMood(mood);
  const bgSrc = BACKGROUND_ASSETS[bg] || BACKGROUND_ASSETS.garden;

  // src/assets/backgrounds/*.png 파일을 실제 배경 이미지로 사용합니다.
  // 이미지가 화면 비율과 달라도 빈 여백 없이 꽉 차도록 slice로 처리합니다.
  if (bgSrc) {
    return (
      <g>
        <image
          href={bgSrc}
          x="0"
          y="0"
          width="420"
          height="260"
          preserveAspectRatio="xMidYMid slice"
        />
        {/* 무드 색상 오버레이: 배경 이미지 전체에 감성 색감을 입혀서 캐릭터·활동 이미지와 톤을 맞춥니다 */}
        <rect width="420" height="260" fill={m.accent} opacity=".18" />
        {/* 하단 그라디언트: 캐릭터가 배경에 자연스럽게 놓이도록 바닥을 부드럽게 밝힙니다 */}
        <rect x="0" y="160" width="420" height="100" fill={m.sky[1]} opacity=".32" />
        <ellipse cx="210" cy="258" rx="245" ry="54" fill="#fff" opacity=".08" />
      </g>
    );
  }

  // 혹시 배경 이미지가 없을 때만 보이는 안전용 기본 배경입니다.
  return (
    <>
      <rect width="420" height="260" fill={`url(#grad-${m.id})`} />
      <ellipse cx="210" cy="258" rx="245" ry="54" fill="#fff" opacity=".7" />
      <ellipse cx="210" cy="252" rx="230" ry="40" fill={m.accent} opacity=".1" />
    </>
  );
}

function LeafDecor({ mood }) {
  const m = getMood(mood);
  return <g opacity=".6">{[-1, 1].map((side) => <g key={side} transform={`translate(${side < 0 ? 45 : 375} 158) scale(${side},1)`}><path d="M0 66 C12 42 15 20 8 0" stroke={m.deep} strokeWidth="5" fill="none" strokeLinecap="round" opacity=".5" />{[6, 20, 34, 48].map((y, i) => <ellipse key={y} cx={i % 2 ? 18 : -8} cy={y} rx="9" ry="18" fill={m.deep} opacity=".38" transform={`rotate(${i % 2 ? -35 : 35} ${i % 2 ? 18 : -8} ${y})`} />)}</g>)}</g>;
}
function MoodFx({ mood }) {
  const m = getMood(mood);
  return <g>{Array.from({ length: 12 }).map((_, i) => <text key={i} x={(i * 43) % 360 + 30} y={(i * 29) % 135 + 26} fontSize={i % 3 === 0 ? 18 : 12} fill={m.accent} opacity=".19" textAnchor="middle">{m.mark}</text>)}</g>;
}

function FamilyIllustration({ character, mood }) {
  const characterSrc = CHARACTER_ASSETS[character] || CHARACTER_ASSETS.family;

  if (characterSrc) {
    const fadeId = `char-fade-${character}`;
    return (
      <g transform="translate(0 60)">
        <defs>
          <linearGradient id={fadeId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="62%" stopColor="#fff" stopOpacity="1" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id={`mask-${character}`}>
            <rect x="58" y="4" width="304" height="208" fill={`url(#${fadeId})`} />
          </mask>
        </defs>
        <image
          href={characterSrc}
          x="58"
          y="4"
          width="304"
          height="208"
          preserveAspectRatio="xMidYMid meet"
          mask={`url(#mask-${character})`}
        />
      </g>
    );
  }

  const m = getMood(mood);
  const skin = "#ffd8c6";
  const cheek = "#ec9b90";
  const dadHair = "#4f4640";
  const momHair = "#7a5a43";
  const dadClothes = "#6f8290";
  const momClothes = "#d9a468";
  const babyClothes = "#dce8b8";
  const childClothes = m.accent;
  const Eye = ({ x }) => <><circle cx={x} cy="2" r="3" fill="#5f524e"/><circle cx={x + 1} cy="1" r=".9" fill="#fff" opacity=".9"/></>;
  const Smile = () => <path d="M-10 17 Q0 24 10 17" stroke="#a26766" strokeWidth="2.2" fill="none" strokeLinecap="round" />;

  const Dad = ({ x = 152, y = 116, scale = 1 }) => <g transform={`translate(${x} ${y}) scale(${scale})`}><ellipse cx="0" cy="92" rx="48" ry="14" fill="rgba(0,0,0,.08)"/><path d="M-54 90 Q-45 28 -5 22 Q39 24 52 90 Z" fill={dadClothes}/><circle cx="0" cy="-4" r="32" fill={skin}/><path d="M-31 -12 Q-23 -41 8 -44 Q37 -42 34 -3 Q13 -12 -31 -12" fill={dadHair}/><path d="M-28 -18 Q-9 -29 17 -25" stroke="#75665d" strokeWidth="2" fill="none" opacity=".45"/><Eye x={-11}/><Eye x={11}/><Smile/><circle cx="-21" cy="13" r="7" fill={cheek} opacity=".45"/><circle cx="21" cy="13" r="7" fill={cheek} opacity=".45"/></g>;
  const Mom = ({ x = 251, y = 118, scale = 1 }) => <g transform={`translate(${x} ${y}) scale(${scale})`}><ellipse cx="0" cy="92" rx="54" ry="14" fill="rgba(0,0,0,.08)"/><path d="M-50 94 Q-44 31 -7 21 Q42 25 54 94 Z" fill={momClothes}/><path d="M-36 -9 C-35 -55 32 -56 45 -12 C47 19 34 45 18 55 C22 25 14 3 -14 -2 C-26 10 -32 33 -25 56 C-43 42 -50 14 -36 -9 Z" fill={momHair}/><circle cx="0" cy="-3" r="31" fill={skin}/><path d="M-25 -23 C-12 -39 15 -39 29 -20 C15 -25 -3 -25 -25 -23 Z" fill={momHair}/><path d="M-33 3 Q-41 16 -29 22" fill={skin}/><path d="M33 3 Q41 16 29 22" fill={skin}/><Eye x={-10}/><Eye x={10}/><Smile/><circle cx="-20" cy="13" r="8" fill={cheek} opacity=".52"/><circle cx="20" cy="13" r="8" fill={cheek} opacity=".52"/><path d="M-46 67 Q-20 93 16 78" stroke={skin} strokeWidth="10" fill="none" strokeLinecap="round"/></g>;
  const Baby = ({ x = 104, y = 174, scale = 1 }) => <g transform={`translate(${x} ${y}) scale(${scale})`}><ellipse cx="0" cy="45" rx="32" ry="10" fill="rgba(0,0,0,.07)"/><path d="M-38 40 Q-34 2 -3 -4 Q31 0 38 40 Q18 58 -18 58 Z" fill={babyClothes}/><circle cx="0" cy="-14" r="23" fill={skin}/><path d="M-20 -23 Q0 -42 21 -23 Q5 -29 -20 -23" fill="#75665a"/><Eye x={-8}/><Eye x={8}/><path d="M-7 -2 Q0 4 7 -2" stroke="#a26766" strokeWidth="1.8" fill="none" strokeLinecap="round"/><circle cx="-16" cy="-4" r="6" fill={cheek} opacity=".45"/><circle cx="16" cy="-4" r="6" fill={cheek} opacity=".45"/></g>;
  const Child = ({ x = 314, y = 174, scale = 1 }) => <g transform={`translate(${x} ${y}) scale(${scale})`}><ellipse cx="0" cy="45" rx="32" ry="10" fill="rgba(0,0,0,.07)"/><path d="M-35 48 Q-34 4 0 0 Q34 4 35 48 Q17 60 -17 60 Z" fill={childClothes} opacity=".88"/><circle cx="0" cy="-14" r="23" fill={skin}/><path d="M-22 -20 Q0 -41 22 -20 Q10 -29 -1 -28 Q-12 -28 -22 -20" fill="#806e5d"/><Eye x={-8}/><Eye x={8}/><path d="M-7 -2 Q0 4 7 -2" stroke="#a26766" strokeWidth="1.8" fill="none" strokeLinecap="round"/><circle cx="-16" cy="-4" r="6" fill={cheek} opacity=".52"/><circle cx="16" cy="-4" r="6" fill={cheek} opacity=".52"/><circle cx="-9" cy="27" r="4" fill="#fff" opacity=".85"/><circle cx="10" cy="32" r="4" fill="#fff" opacity=".85"/></g>;
  const Pet = ({ type = "dog", x = 318, y = 198 }) => <g transform={`translate(${x} ${y})`}><ellipse cx="0" cy="30" rx="27" ry="8" fill="rgba(0,0,0,.08)"/><ellipse cx="0" cy="12" rx="21" ry="16" fill={type === "cat" ? "#d6c2a8" : "#c9935e"}/><circle cx="0" cy="-5" r="18" fill={type === "cat" ? "#e5cfb4" : "#d8a26c"}/>{type === "cat" ? <><polygon points="-12,-18 -18,-31 -5,-22" fill="#e5cfb4"/><polygon points="12,-18 18,-31 5,-22" fill="#e5cfb4"/></> : <><ellipse cx="-15" cy="-8" rx="7" ry="14" fill="#b6784d" transform="rotate(-22)"/><ellipse cx="15" cy="-8" rx="7" ry="14" fill="#b6784d" transform="rotate(22)"/></>}<circle cx="-6" cy="-7" r="2.5" fill="#52433b"/><circle cx="6" cy="-7" r="2.5" fill="#52433b"/><circle cx="0" cy="1" r="3" fill="#52433b"/><path d="M-6 7 Q0 11 6 7" stroke="#52433b" strokeWidth="1.5" fill="none" strokeLinecap="round"/></g>;

  if (character === "mama") return <><Mom x={210} y={116} scale={1.06}/><Baby x={142} y={180} scale={.9}/></>;
  if (character === "mama_papa") return <><Dad x={164} y={118} scale={.95}/><Mom x={246} y={119} scale={.98}/></>;
  if (character === "mama_pet") return <><Mom x={200} y={116} scale={1.04}/><Pet type="dog" x={300} y={190}/></>;
  if (character === "mama_cat") return <><Mom x={200} y={116} scale={1.04}/><Pet type="cat" x={300} y={190}/></>;
  if (character === "mama_friend") return <><Mom x={168} y={120} scale={.94}/><Mom x={248} y={121} scale={.9}/></>;
  if (character === "mama_grandma") return <><Mom x={168} y={120} scale={.96}/><Mom x={252} y={122} scale={.9}/></>;
  if (character === "couple_baby") return <><Dad x={155} y={118} scale={.96}/><Mom x={255} y={118} scale={1}/><Baby x={208} y={184} scale={.82}/></>;
  return <><Dad/><Mom/><Baby/><Child/></>;
}

function ActivityLayer({ activity, mood, character = "family" }) {
  const a = getActivity(activity);
  const m = getMood(mood);
  const activitySrc = ACTIVITY_ASSETS[activity];
  const crop = ACTIVITY_CROPS[activity] || ACTIVITY_CROPS["운동"];

  // 캐릭터별 엄마 머리 위 좌표 — PNG는 x:58~362,y:34~242 영역에 meet 배치
  // SVG 폴백 Mom 위치 기준으로 역산: translate(0 30) 적용 포함
  // 말풍선 중심은 엄마 머리 바로 위 (머리 y에서 rh+10 위로)
  // 캐릭터별 말풍선 위치 — 엄마 머리 바로 위 대각선 (mama_papa 기준)
  // SVG viewBox 420x260, translate(0 60) 적용
  const BUBBLE_POS = {
    // 엄마 중앙(210): 왼쪽 위
    mama:         { bx: 95,  by: 48, tailRight: false },
    // 엄마 오른쪽(246): 왼쪽 위 ← mama_papa 기준
    mama_papa:    { bx: 110, by: 48, tailRight: false },
    // 엄마 중앙(200): 왼쪽 위
    mama_pet:     { bx: 90,  by: 48, tailRight: false },
    mama_cat:     { bx: 90,  by: 48, tailRight: false },
    // 오른쪽 엄마(248): 왼쪽 위
    mama_friend:  { bx: 110, by: 48, tailRight: false },
    mama_grandma: { bx: 110, by: 48, tailRight: false },
    // 엄마 오른쪽(255): 오른쪽 위, 꼬리 왼쪽 아래
    couple_baby:  { bx: 320, by: 48, tailRight: true  },
    // 엄마 오른쪽 중앙(251): 오른쪽 위, 꼬리 왼쪽 아래
    family:       { bx: 320, by: 48, tailRight: true  },
  };
  const pos = BUBBLE_POS[character] || { bx: 110, by: 48, tailRight: false };
  const { bx, by, tailRight } = pos;
  const tailLeft = false; // 꼬리는 항상 아래쪽 (엄마 머리 위에 뜨므로)

  const rw = 52;
  const rh = 40;
  const clipId = `act-clip-${activity}-${character}`;

  const imgX = bx - rw + 4;
  const imgY = by - rh + 4;
  const imgW = rw * 2 - 8;
  const imgH = rh * 2 - 8;

  const scaleX = imgW / crop.w;
  const scaleY = imgH / crop.h;
  const scale  = Math.min(scaleX, scaleY);
  const drawW  = 1536 * scale;
  const drawH  = 1024 * scale;
  const drawX  = imgX + (imgW - crop.w * scale) / 2 - crop.x * scale;
  const drawY  = imgY + (imgH - crop.h * scale) / 2 - crop.y * scale;

  // 꼬리: tailRight=true면 말풍선 왼쪽 하단, false면 오른쪽 하단
  const tail = tailRight ? {
    p1: `${bx - rw + 14},${by + rh - 4}`,
    p2: `${bx - rw - 14},${by + rh + 18}`,
    p3: `${bx - rw + 2},${by + rh - 8}`,
    d1: `${bx - rw + 12},${by + rh - 3}`,
    d2: `${bx - rw - 10},${by + rh + 12}`,
    d3: `${bx - rw + 1},${by + rh - 7}`,
  } : {
    p1: `${bx + rw - 14},${by + rh - 4}`,
    p2: `${bx + rw + 14},${by + rh + 18}`,
    p3: `${bx + rw + 2},${by + rh - 8}`,
    d1: `${bx + rw - 12},${by + rh - 3}`,
    d2: `${bx + rw + 10},${by + rh + 12}`,
    d3: `${bx + rw + 1},${by + rh - 7}`,
  };

  return (
    <g>
      <defs>
        <clipPath id={clipId}>
          <rect x={imgX} y={imgY} width={imgW} height={imgH} rx={rh - 4} />
        </clipPath>
      </defs>

      {/* 1. 그림자 */}
      <ellipse cx={bx} cy={by + rh + 6} rx={rw - 10} ry={5} fill="#000" opacity=".07" />

      {/* 2. 말풍선 흰 배경 */}
      <rect x={bx - rw} y={by - rh} width={rw * 2} height={rh * 2} rx={rh} fill="#fff" opacity=".96" />

      {/* 3. 꼬리 흰 배경 */}
      <polygon points={`${tail.p1} ${tail.p2} ${tail.p3}`} fill="#fff" opacity=".96" />

      {/* 4. 활동 이미지 */}
      {activitySrc ? (
        <image href={activitySrc} x={drawX} y={drawY} width={drawW} height={drawH} clipPath={`url(#${clipId})`} />
      ) : (
        <text x={bx} y={by + 8} textAnchor="middle" fontSize="24">{a.emoji}</text>
      )}

      {/* 5. 무드 테두리 */}
      <rect x={bx - rw} y={by - rh} width={rw * 2} height={rh * 2} rx={rh} fill="none" stroke={m.accent} strokeWidth="2.5" opacity=".65" />

      {/* 6. 꼬리 테두리 + 덮개 */}
      <polygon points={`${tail.p1} ${tail.p2} ${tail.p3}`} fill="none" stroke={m.accent} strokeWidth="2.5" strokeLinejoin="round" opacity=".65" />
      <polygon points={`${tail.d1} ${tail.d2} ${tail.d3}`} fill="#fff" opacity=".96" />
    </g>
  );
}

function SceneComposer({ mood = "사랑", bg = "garden", character = "family", activity = "태담", small = false, large = false, editable = false, onEdit }) {
  const m = getMood(mood);
  const gradId = useMemo(() => `grad-${uid().replace(/[^a-zA-Z0-9]/g, "")}`, []);
  const sceneRef = React.useRef(null);
  const [sharing, setSharing] = React.useState(false);
  const handleShare = async (e) => {
    e.stopPropagation();
    if (sharing) return;
    setSharing(true);
    try { const canvas = await captureElement(sceneRef.current); await shareImage(canvas, "태교씬.png"); }
    catch(err) { console.error(err); }
    finally { setSharing(false); }
  };
  return <div className={`scene ${small ? "scene-small" : ""} ${large ? "scene-large" : ""}`} ref={sceneRef}><svg viewBox="0 0 420 260" role="img" aria-label="태교 일러스트"><defs><linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={m.sky[0]}/><stop offset="100%" stopColor={m.sky[1]}/></linearGradient></defs><g><rect width="420" height="260" fill={`url(#${gradId})`}/><BackgroundLayer bg={bg} mood={mood}/><path d="M210 70 C255 10 358 40 360 116 C362 185 286 214 210 235 C134 214 58 185 60 116 C62 40 165 10 210 70 Z" fill={m.accent} opacity=".42"/><LeafDecor mood={mood}/><MoodFx mood={mood}/><FamilyIllustration character={character} mood={mood}/><ActivityLayer activity={activity} mood={mood} character={character}/></g></svg>{editable && <button className="edit-float" type="button" onClick={onEdit} aria-label="그림 수정">✏️</button>}{!small && <button className="share-float" type="button" onClick={handleShare} disabled={sharing} aria-label="공유">{sharing ? "⏳" : "📤"}</button>}</div>;
}
function PhotoSlot({ photo, onPhoto, onRemove, small = false, onPhotoError }) {
  const [photoErr, setPhotoErr] = useState("");
  const handleError = (msg) => { setPhotoErr(msg); setTimeout(() => setPhotoErr(""), 4000); onPhotoError?.(msg); };
  const { ref, trigger, onChange } = usePhotoUpload(onPhoto, handleError);
  if (photo) return <div className={`photo ${small ? "photo-small" : ""}`}><img src={photo} alt="업로드 사진" />{onRemove && <button className="photo-remove" type="button" onClick={onRemove}>×</button>}</div>;
  return (
    <>
      <button type="button" className={`photo-add ${small ? "photo-add-small" : ""}`} onClick={trigger}>📷 사진으로 대체하기</button>
      {photoErr && <span className="field-error" style={{display:"block",marginTop:6}}>{photoErr}</span>}
      <input ref={ref} type="file" accept="image/*" hidden onChange={onChange}/>
    </>
  );
}

function SceneWizard({ scene, onChange, title = "그림 만들기" }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const steps = [
    { key: "mood", title: "기분을 선택해요", sub: "오늘의 감정 색이 전체 그림에 반영됩니다.", list: MOODS },
    { key: "bg", title: "배경을 선택해요", sub: "기록에 어울리는 장소를 골라주세요.", list: BACKGROUNDS },
    { key: "character", title: "인물을 선택해요", sub: "누가 함께한 순간인지 골라주세요.", list: CHARACTERS },
    { key: "activity", title: "태교 활동을 선택해요", sub: "오늘의 활동을 그림에 넣어요.", list: ACTIVITIES }
  ];
  const current = steps[step];
  const select = (id) => {
    onChange({ ...scene, [current.key]: id });

    // 선택 즉시 다음 단계로 이동합니다.
    // 마지막 단계인 활동 선택까지 끝나면 팝업을 닫습니다.
    if (step < steps.length - 1) {
      setStep((v) => Math.min(steps.length - 1, v + 1));
    } else {
      setOpen(false);
    }
  };
  const openAt = (stepIndex) => { setStep(stepIndex); setOpen(true); };
  const reset = () => openAt(0);
  const summaryItems = [
    { emoji: getMood(scene.mood).emoji, label: getMood(scene.mood).label, stepIndex: 0 },
    { emoji: BACKGROUNDS.find(b => b.id === scene.bg)?.emoji, label: BACKGROUNDS.find(b => b.id === scene.bg)?.label, stepIndex: 1 },
    { emoji: CHARACTERS.find(c => c.id === scene.character)?.emoji, label: CHARACTERS.find(c => c.id === scene.character)?.label, stepIndex: 2 },
    { emoji: getActivity(scene.activity).emoji, label: getActivity(scene.activity).label, stepIndex: 3 },
  ];
  return <div className="scene-editor"><SceneComposer {...scene} large editable onEdit={reset}/><div className="selected-summary">{summaryItems.map(({ emoji, label, stepIndex }) => <button type="button" key={stepIndex} className="summary-tag" onClick={() => openAt(stepIndex)}><span>{emoji}</span>{label}</button>)}</div>{open && <div className="wizard-backdrop"><section className="wizard"><div className="wizard-head"><div><strong>{title}</strong><p>{step + 1} / {steps.length}</p></div><button type="button" onClick={() => setOpen(false)}>×</button></div><div className="progress"><span style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div><h3>{current.title}</h3><p className="muted-text">{current.sub}</p><div className="choice-grid">{current.list.map((item) => <button type="button" key={item.id} className={scene[current.key] === item.id ? "choice on" : "choice"} onClick={() => select(item.id)}><span>{item.emoji}</span>{item.label}</button>)}</div><div className="wizard-actions wizard-actions-prev-only"><button type="button" className="ghost" disabled={step === 0} onClick={() => setStep((v) => Math.max(0, v - 1))}>이전</button></div></section></div>}</div>;
}


function BabyNamePopup({ data, setData }) {
  const shouldOpen = !data.babyInfo?.babyNamePromptDone;
  const [name, setName] = useState(data.babyInfo?.babyName || "");

  if (!shouldOpen) return null;

  const close = (value) => {
    setData((p) => ({
      ...p,
      babyInfo: {
        ...p.babyInfo,
        babyName: value.trim() || p.babyInfo.babyName || "",
        babyNamePromptDone: true
      }
    }));
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 18,
        background: "rgba(28, 22, 42, .42)",
        backdropFilter: "blur(8px)"
      }}
    >
      <section
        style={{
          width: "min(92vw, 380px)",
          borderRadius: 28,
          padding: "26px 22px 22px",
          background: "rgba(255, 255, 255, .96)",
          boxShadow: "0 24px 70px rgba(60, 39, 78, .24)",
          border: "1px solid rgba(255,255,255,.7)",
          textAlign: "center"
        }}
      >
        <div style={{ fontSize: 36, marginBottom: 8 }}>👶</div>
        <h2 style={{ margin: "0 0 8px", fontSize: 22, color: "#3f3344" }}>아기의 태명을 알려주세요</h2>
        <p style={{ margin: "0 0 18px", fontSize: 14, lineHeight: 1.55, color: "#7b7080" }}>
          입력한 태명은 홈 화면과 태교북 제목에 사용돼요. 나중에 Chapter 1에서 다시 수정할 수 있어요.
        </p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 콩콩이, 찰떡이"
          autoFocus
          style={{
            width: "100%",
            boxSizing: "border-box",
            border: "1px solid #eadfea",
            borderRadius: 18,
            padding: "15px 16px",
            fontSize: 16,
            outline: "none",
            textAlign: "center",
            background: "#fffafd",
            color: "#3f3344"
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") close(name);
          }}
        />
        <button
          type="button"
          className="primary"
          style={{ width: "100%", marginTop: 14 }}
          onClick={() => close(name)}
        >
          태명 저장하기
        </button>
        <button
          type="button"
          className="ghost"
          style={{ width: "100%", marginTop: 8 }}
          onClick={() => close("")}
        >
          나중에 정할게요
        </button>
      </section>
    </div>
  );
}

function Header({ data }) { return <header className="topbar"><div><p>Mobile Taegyo Book</p><h1>{data.babyInfo.babyName || "우리 아기"}의 태교북</h1></div><span>{getMood(data.babyInfo.coverMood).emoji}</span></header>; }
function Home({ data, setData, setTab, setWriteTab }) {
  const b = data.babyInfo;
  const updateCover = (scene) => setData((p) => ({ ...p, babyInfo: { ...p.babyInfo, coverMood: scene.mood, coverBg: scene.bg, coverChar: scene.character, coverActivity: scene.activity } }));
  const updatePhoto = (photo) => setData((p) => ({ ...p, babyInfo: { ...p.babyInfo, coverPhoto: photo } }));
  const coverScene = { mood: b.coverMood, bg: b.coverBg, character: b.coverChar, activity: b.coverActivity };
  return <main className="screen"><section className="hero card">{b.coverPhoto ? <PhotoSlot photo={b.coverPhoto} onPhoto={updatePhoto} onRemove={() => updatePhoto("")} /> : <SceneWizard scene={coverScene} onChange={updateCover} title="커버 그림 수정"/>}<div className="photo-line"><PhotoSlot photo={b.coverPhoto} onPhoto={updatePhoto} onRemove={() => updatePhoto("")} /></div><div className="hero-copy"><h2>{b.babyName || "우리 아기"}를 기다리는 그림일기</h2><p>기분, 배경, 인물, 태교 활동을 순서대로 골라 기록하는 모바일 태교북입니다.</p></div></section><section className="quick-grid">{[["✍️", "오늘 기록", "daily"], ["🌿", "태교 활동", "activity"], ["🏥", "병원 기록", "hospital"], ["📦", "출산 준비", "prepare"]].map(([icon, label, tab]) => <button key={tab} className="quick" onClick={() => { setWriteTab(isIntroWritten(b) ? tab : "intro"); setTab("write"); }}><span>{icon}</span>{label}</button>)}</section><section className="card pad"><div className="section-head"><h3>기록 현황</h3></div><div className="stats"><div><strong>{data.dailyRecords.length}</strong><span>주차 기록</span></div><div><strong>{data.activityRecords.length}</strong><span>활동 기록</span></div><div><strong>{data.hospitalRecords.length}</strong><span>병원 기록</span></div></div></section></main>;
}
function IntroForm({ data, setData, setWriteTab }) {
  const b = data.babyInfo;
  const completed = isIntroWritten(b);
  const update = (key, value) => setData((p) => ({ ...p, babyInfo: { ...p.babyInfo, [key]: value } }));
  const finishIntro = () => {
    setData((p) => ({ ...p, babyInfo: { ...p.babyInfo, introCompleted: true } }));
    setWriteTab("choose");
  };
  return <div className="card pad"><h2 className="form-title">Chapter 1. 우리 아기를 기다리며</h2><p className="muted-text">{completed ? "첫 이야기는 저장되어 있어요. 필요한 부분만 수정한 뒤 완료를 눌러주세요." : "처음 접속했을 때만 기본 정보를 작성하고, 이후에는 수정용으로만 사용됩니다."}</p><label>태명<input value={b.babyName} onChange={(e) => update("babyName", e.target.value)} /></label><label>출산 예정일<input type="date" value={b.dueDate} onChange={(e) => update("dueDate", e.target.value)} /></label><div className="two"><label>엄마 이름<input value={b.motherName} onChange={(e) => update("motherName", e.target.value)} /></label><label>아빠 이름<input value={b.fatherName} onChange={(e) => update("fatherName", e.target.value)} /></label></div><label>처음 알게 된 날<input type="date" value={b.firstFoundDate} onChange={(e) => update("firstFoundDate", e.target.value)} /></label><label>처음 느낀 마음<textarea value={b.firstFeeling} onChange={(e) => update("firstFeeling", e.target.value)} /></label><label>아기에게 첫 편지<textarea value={b.firstLetter} onChange={(e) => update("firstLetter", e.target.value)} /></label><button className="primary" onClick={finishIntro}>{completed ? "수정 완료" : "첫 이야기 저장하기"}</button></div>;
}
function DailyForm({ setData, setTab, initialData = null, onSave, showToast }) {
  const isEdit = Boolean(initialData);
  const [scene, setScene] = useState(
    isEdit
      ? { mood: initialData.mood, bg: initialData.bg, character: initialData.character, activity: initialData.activity }
      : { mood: "사랑", bg: "garden", character: "family", activity: "태담" }
  );
  const [form, setForm] = useState(
    isEdit
      ? { date: initialData.date, week: initialData.week || "", condition: initialData.condition || "", message: initialData.message || "", memory: initialData.memory || "", photo: initialData.photo || "" }
      : { date: today(), week: "", condition: "", message: "", memory: "", photo: "" }
  );
  const [errors, setErrors] = useState({});
  const update = (key, value) => { setForm((p) => ({ ...p, [key]: value })); setErrors((p) => ({ ...p, [key]: "" })); };

  const validate = () => {
    const e = {};
    if (!form.date) e.date = "날짜를 선택해주세요.";
    if (!form.message.trim() && !form.memory.trim() && !form.condition.trim())
      e.content = "컨디션, 아기에게 한마디, 오늘의 기억 중 하나 이상 입력해주세요.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = () => {
    if (!validate()) return;
    if (isEdit) {
      setData((p) => ({
        ...p,
        dailyRecords: sortByDate(
          p.dailyRecords.map((r) =>
            r.id === initialData.id ? { ...r, ...form, ...scene, updatedAt: new Date().toISOString() } : r
          )
        ),
      }));
      showToast("✅ 주차 기록이 수정되었어요!");
      onSave?.();
    } else {
      setData((p) => ({ ...p, dailyRecords: sortByDate([...p.dailyRecords, { ...form, ...scene, id: uid(), createdAt: new Date().toISOString() }]) }));
      showToast("✨ 주차 기록이 저장되었어요!");
      setTab("book");
    }
  };
  return (
    <div className="card pad">
      <h2 className="form-title">{isEdit ? "✏️ 주차 기록 수정" : "Chapter 2. 임신 주차별 기록"}</h2>
      {form.photo ? <PhotoSlot photo={form.photo} onPhoto={(v) => update("photo", v)} onRemove={() => update("photo", "")} /> : <SceneWizard scene={scene} onChange={setScene} title="오늘의 그림 수정"/>}
      <div className="photo-line"><PhotoSlot photo={form.photo} onPhoto={(v) => update("photo", v)} onRemove={() => update("photo", "")} /></div>
      <div className="two">
        <label>날짜 <span className="required">*</span>
          <input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} className={errors.date ? "input-error" : ""} />
          {errors.date && <span className="field-error">{errors.date}</span>}
        </label>
        <label>임신 주차<input value={form.week} onChange={(e) => update("week", e.target.value)} placeholder="예: 18주차" /></label>
      </div>
      <label>엄마의 컨디션
        <input value={form.condition} onChange={(e) => update("condition", e.target.value)} placeholder="예: 조금 피곤했지만 편안함" className={errors.content ? "input-error" : ""} />
      </label>
      <label>아기에게 한마디
        <textarea value={form.message} onChange={(e) => update("message", e.target.value)} className={errors.content ? "input-error" : ""} />
      </label>
      <label>오늘의 기억
        <textarea value={form.memory} onChange={(e) => update("memory", e.target.value)} className={errors.content ? "input-error" : ""} />
        {errors.content && <span className="field-error">{errors.content}</span>}
      </label>
      <button className="primary" onClick={save}>{isEdit ? "✅ 수정 완료" : "✨ 기록 저장하기"}</button>
      {isEdit && <button className="ghost full" style={{marginTop:8}} onClick={() => onSave?.()}>취소</button>}
    </div>
  );
}
function ActivityForm({ setData, setTab, initialData = null, onSave, showToast }) {
  const isEdit = Boolean(initialData);
  const [scene, setScene] = useState(
    isEdit
      ? { mood: initialData.mood, bg: initialData.bg, character: initialData.character, activity: initialData.activity }
      : { mood: "평온함", bg: "picnic", character: "mama_papa", activity: "피크닉" }
  );
  const [form, setForm] = useState(
    isEdit
      ? { date: initialData.date, withWhom: initialData.withWhom || "", feeling: initialData.feeling || "", message: initialData.message || "", photo: initialData.photo || "" }
      : { date: today(), withWhom: "", feeling: "", message: "", photo: "" }
  );
  const [errors, setErrors] = useState({});
  const update = (key, value) => { setForm((p) => ({ ...p, [key]: value })); setErrors((p) => ({ ...p, [key]: "" })); };

  const validate = () => {
    const e = {};
    if (!form.date) e.date = "날짜를 선택해주세요.";
    if (!form.feeling.trim() && !form.message.trim())
      e.content = "오늘의 느낌 또는 아기에게 남기는 말을 입력해주세요.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = () => {
    if (!validate()) return;
    if (isEdit) {
      setData((p) => ({
        ...p,
        activityRecords: sortByDate(
          p.activityRecords.map((r) =>
            r.id === initialData.id ? { ...r, ...form, ...scene, updatedAt: new Date().toISOString() } : r
          )
        ),
      }));
      showToast("✅ 태교 활동이 수정되었어요!");
      onSave?.();
    } else {
      setData((p) => ({ ...p, activityRecords: sortByDate([...p.activityRecords, { ...form, ...scene, id: uid(), createdAt: new Date().toISOString() }]) }));
      showToast("🌿 태교 활동이 저장되었어요!");
      setTab("book");
    }
  };
  return (
    <div className="card pad">
      <h2 className="form-title">{isEdit ? "✏️ 태교 활동 수정" : "Chapter 3. 태교 활동 기록"}</h2>
      {form.photo ? <PhotoSlot photo={form.photo} onPhoto={(v) => update("photo", v)} onRemove={() => update("photo", "")} /> : <SceneWizard scene={scene} onChange={setScene} title="활동 그림 수정"/>}
      <div className="photo-line"><PhotoSlot photo={form.photo} onPhoto={(v) => update("photo", v)} onRemove={() => update("photo", "")} /></div>
      <label>날짜 <span className="required">*</span>
        <input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} className={errors.date ? "input-error" : ""} />
        {errors.date && <span className="field-error">{errors.date}</span>}
      </label>
      <label>함께한 사람<input value={form.withWhom} onChange={(e) => update("withWhom", e.target.value)} placeholder="예: 아빠와 함께" /></label>
      <label>오늘의 느낌
        <textarea value={form.feeling} onChange={(e) => update("feeling", e.target.value)} className={errors.content ? "input-error" : ""} />
      </label>
      <label>아기에게 남기는 말
        <textarea value={form.message} onChange={(e) => update("message", e.target.value)} className={errors.content ? "input-error" : ""} />
        {errors.content && <span className="field-error">{errors.content}</span>}
      </label>
      <button className="primary" onClick={save}>{isEdit ? "✅ 수정 완료" : "✨ 태교 활동 저장하기"}</button>
      {isEdit && <button className="ghost full" style={{marginTop:8}} onClick={() => onSave?.()}>취소</button>}
    </div>
  );
}
function HospitalForm({ setData, setTab, initialData = null, onSave, showToast }) {
  const isEdit = Boolean(initialData);
  const [scene, setScene] = useState(
    isEdit
      ? { mood: initialData.mood, bg: initialData.bg, character: initialData.character, activity: initialData.activity }
      : { mood: "편안함", bg: "clinic", character: "mama", activity: "초음파" }
  );
  const [form, setForm] = useState(
    isEdit
      ? { date: initialData.date, week: initialData.week || "", hospital: initialData.hospital || "", checkup: initialData.checkup || "", memo: initialData.memo || "", condition: initialData.condition || "", nextDate: initialData.nextDate || "", photo: initialData.photo || "" }
      : { date: today(), week: "", hospital: "", checkup: "", memo: "", condition: "", nextDate: "", photo: "" }
  );
  const [errors, setErrors] = useState({});
  const update = (key, value) => { setForm((p) => ({ ...p, [key]: value })); setErrors((p) => ({ ...p, [key]: "" })); };

  const validate = () => {
    const e = {};
    if (!form.date) e.date = "날짜를 선택해주세요.";
    if (!form.hospital.trim() && !form.checkup.trim() && !form.memo.trim())
      e.content = "병원명, 검진 내용, 메모 중 하나 이상 입력해주세요.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = () => {
    if (!validate()) return;
    if (isEdit) {
      setData((p) => ({
        ...p,
        hospitalRecords: sortByDate(
          p.hospitalRecords.map((r) =>
            r.id === initialData.id ? { ...r, ...form, ...scene, updatedAt: new Date().toISOString() } : r
          )
        ),
      }));
      showToast("✅ 병원 기록이 수정되었어요!");
      onSave?.();
    } else {
      setData((p) => ({ ...p, hospitalRecords: sortByDate([...p.hospitalRecords, { ...form, ...scene, id: uid(), createdAt: new Date().toISOString() }]) }));
      showToast("🏥 병원 기록이 저장되었어요!");
      setTab("book");
    }
  };
  return (
    <div className="card pad">
      <h2 className="form-title">{isEdit ? "✏️ 병원 기록 수정" : "Chapter 4. 병원 · 건강 관리"}</h2>
      {form.photo ? <PhotoSlot photo={form.photo} onPhoto={(v) => update("photo", v)} onRemove={() => update("photo", "")} /> : <SceneWizard scene={scene} onChange={setScene} title="병원 기록 그림 수정"/>}
      <div className="photo-line"><PhotoSlot photo={form.photo} onPhoto={(v) => update("photo", v)} onRemove={() => update("photo", "")} /></div>
      <div className="two">
        <label>날짜 <span className="required">*</span>
          <input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} className={errors.date ? "input-error" : ""} />
          {errors.date && <span className="field-error">{errors.date}</span>}
        </label>
        <label>임신 주차<input value={form.week} onChange={(e) => update("week", e.target.value)} /></label>
      </div>
      <label>병원명
        <input value={form.hospital} onChange={(e) => update("hospital", e.target.value)} className={errors.content ? "input-error" : ""} />
      </label>
      <label>검진 내용
        <input value={form.checkup} onChange={(e) => update("checkup", e.target.value)} placeholder="예: 정기검진, 초음파" className={errors.content ? "input-error" : ""} />
      </label>
      <label>컨디션<input value={form.condition} onChange={(e) => update("condition", e.target.value)} /></label>
      <label>다음 진료일<input type="date" value={form.nextDate} onChange={(e) => update("nextDate", e.target.value)} /></label>
      <label>메모
        <textarea value={form.memo} onChange={(e) => update("memo", e.target.value)} className={errors.content ? "input-error" : ""} />
        {errors.content && <span className="field-error">{errors.content}</span>}
      </label>
      <button className="primary" onClick={save}>{isEdit ? "✅ 수정 완료" : "🏥 병원 기록 저장하기"}</button>
      {isEdit && <button className="ghost full" style={{marginTop:8}} onClick={() => onSave?.()}>취소</button>}
    </div>
  );
}
function PrepareForm({ data, setData }) {
  const [text, setText] = useState(""), [bucket, setBucket] = useState("");
  const add = (key, value, clear) => { if (!value.trim()) return; setData((p) => ({ ...p, [key]: [...p[key], { id: uid(), text: value.trim(), done: false }] })); clear(""); };
  const toggle = (key, id) => setData((p) => ({ ...p, [key]: p[key].map((item) => item.id === id ? { ...item, done: !item.done } : item) }));
  const remove = (key, id) => setData((p) => ({ ...p, [key]: p[key].filter((item) => item.id !== id) }));
  const List = ({ title, items, type }) => <section className="todo-section"><h3>{title}</h3>{items.map((item) => <div className="todo" key={item.id}><button className={item.done ? "check on" : "check"} onClick={() => toggle(type, item.id)}>{item.done ? "✓" : ""}</button><span className={item.done ? "done" : ""}>{item.text}</span><button onClick={() => remove(type, item.id)}>삭제</button></div>)}</section>;
  return <div className="card pad"><h2 className="form-title">Chapter 5. 출산 준비 & 버킷리스트</h2><div className="add"><input value={text} onChange={(e) => setText(e.target.value)} placeholder="준비할 것 추가"/><button onClick={() => add("checklistItems", text, setText)}>추가</button></div><List title="출산 준비 체크리스트" items={data.checklistItems} type="checklistItems"/><div className="add"><input value={bucket} onChange={(e) => setBucket(e.target.value)} placeholder="하고 싶은 일 추가"/><button onClick={() => add("bucketListItems", bucket, setBucket)}>추가</button></div><List title="출산 전 버킷리스트" items={data.bucketListItems} type="bucketListItems"/></div>;
}

function IntroStartPopup({ setWriteTab, setTab, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 18,
        background: "rgba(28, 22, 42, .38)",
        backdropFilter: "blur(8px)"
      }}
    >
      <section
        style={{
          width: "min(92vw, 390px)",
          borderRadius: 28,
          padding: "26px 22px 22px",
          background: "rgba(255, 255, 255, .97)",
          boxShadow: "0 24px 70px rgba(60, 39, 78, .24)",
          border: "1px solid rgba(255,255,255,.7)",
          textAlign: "center"
        }}
      >
        <div style={{ fontSize: 36, marginBottom: 8 }}>📖</div>
        <h2 style={{ margin: "0 0 8px", fontSize: 22, color: "#3f3344" }}>첫 이야기를 먼저 남겨볼까요?</h2>
        <p style={{ margin: "0 0 18px", fontSize: 14, lineHeight: 1.6, color: "#7b7080" }}>
          태명 설정 다음에는 Chapter 1에서 출산 예정일, 처음 알게 된 날, 아기에게 보내는 첫 마음을 한 번만 작성해요. 저장 후에는 기록 메뉴에서 주차 기록 · 태교 활동 · 병원 기록을 선택해서 입력할 수 있어요.
        </p>
        <button
          type="button"
          className="primary"
          style={{ width: "100%", marginTop: 4 }}
          onClick={() => {
            setWriteTab("intro");
            onClose();
          }}
        >
          첫 이야기 작성하기
        </button>
        <button
          type="button"
          className="ghost"
          style={{ width: "100%", marginTop: 8 }}
          onClick={() => {
            onClose();
            setTab("home");
          }}
        >
          홈으로 돌아가기
        </button>
      </section>
    </div>
  );
}

function RecordCategoryChooser({ setWriteTab }) {
  const options = [
    { id: "daily", icon: "🗓️", title: "주차 기록", desc: "임신 주차, 컨디션, 오늘의 기억을 남겨요." },
    { id: "activity", icon: "🌿", title: "태교 활동", desc: "태담, 음악, 독서, 요가 같은 활동을 기록해요." },
    { id: "hospital", icon: "🏥", title: "병원 기록", desc: "검진 내용, 초음파, 다음 진료일을 정리해요." }
  ];

  return (
    <div className="card pad">
      <h2 className="form-title">오늘은 어떤 기록을 남길까요?</h2>
      <p className="muted-text">Chapter 1을 작성한 뒤에는 기록으로 들어올 때마다 아래 3가지 중 하나를 선택해서 바로 입력할 수 있어요.</p>
      <section className="quick-grid">
        {options.map((item) => (
          <button key={item.id} type="button" className="quick" onClick={() => setWriteTab(item.id)}>
            <span>{item.icon}</span>
            <div>
              <strong>{item.title}</strong>
              <small>{item.desc}</small>
            </div>
          </button>
        ))}
      </section>
      <button type="button" className="ghost full" onClick={() => setWriteTab("intro")}>Chapter 1 첫 이야기 수정하기</button>
    </div>
  );
}

function Write({ data, setData, writeTab, setWriteTab, setTab, editTarget, setEditTarget, showToast }) {
  const introDone = isIntroWritten(data.babyInfo);
  const [showIntroPrompt, setShowIntroPrompt] = useState(!introDone);

  useEffect(() => {
    if (!introDone) setShowIntroPrompt(true);
  }, [introDone]);

  const tabs = introDone
    ? [{ id: "choose", label: "기록 선택" }, { id: "intro", label: "첫 이야기 수정" }, { id: "daily", label: "주차 기록" }, { id: "activity", label: "태교 활동" }, { id: "hospital", label: "병원" }, { id: "prepare", label: "준비" }]
    : [{ id: "intro", label: "첫 이야기" }];

  const safeWriteTab = introDone ? writeTab : "intro";

  // 편집 완료 후 태교북 탭으로 돌아가고 editTarget 초기화
  const handleEditSave = () => {
    setEditTarget(null);
    setTab("book");
  };

  return (
    <main className="screen">
      {!introDone && showIntroPrompt && (
        <IntroStartPopup
          setWriteTab={setWriteTab}
          setTab={setTab}
          onClose={() => setShowIntroPrompt(false)}
        />
      )}
      <div className="tabs">{tabs.map((t) => <button key={t.id} className={safeWriteTab === t.id ? "on" : ""} onClick={() => { setWriteTab(t.id); setEditTarget(null); }}>{t.label}</button>)}</div>
      {safeWriteTab === "choose" && <RecordCategoryChooser setWriteTab={setWriteTab}/>}
      {safeWriteTab === "intro" && <IntroForm data={data} setData={setData} setWriteTab={setWriteTab}/>}
      {safeWriteTab === "daily" && (
        <DailyForm
          setData={setData}
          setTab={setTab}
          initialData={editTarget?.type === "daily" ? editTarget : null}
          onSave={editTarget?.type === "daily" ? handleEditSave : undefined}
          showToast={showToast}
        />
      )}
      {safeWriteTab === "activity" && (
        <ActivityForm
          setData={setData}
          setTab={setTab}
          initialData={editTarget?.type === "activity" ? editTarget : null}
          onSave={editTarget?.type === "activity" ? handleEditSave : undefined}
          showToast={showToast}
        />
      )}
      {safeWriteTab === "hospital" && (
        <HospitalForm
          setData={setData}
          setTab={setTab}
          initialData={editTarget?.type === "hospital" ? editTarget : null}
          onSave={editTarget?.type === "hospital" ? handleEditSave : undefined}
          showToast={showToast}
        />
      )}
      {safeWriteTab === "prepare" && <PrepareForm data={data} setData={setData}/>}
    </main>
  );
}
function Book({ data, setData, onEdit }) {
  const remove = (key, id) => setData((p) => ({ ...p, [key]: p[key].filter((item) => item.id !== id) }));
  const records = [
    ...data.dailyRecords.map((r) => ({ ...r, type: "daily" })),
    ...data.activityRecords.map((r) => ({ ...r, type: "activity" })),
    ...data.hospitalRecords.map((r) => ({ ...r, type: "hospital" })),
  ].sort((a, b) => (a.date || "").localeCompare(b.date || ""));

  return (
    <main className="screen">
      <section className="book-cover card">
        <SceneComposer mood={data.babyInfo.coverMood} bg={data.babyInfo.coverBg} character={data.babyInfo.coverChar} activity={data.babyInfo.coverActivity}/>
        <div>
          <h2>{data.babyInfo.babyName || "우리 아기"}를 기다리며</h2>
          <p>{data.babyInfo.dueDate ? `출산 예정일 ${fmtDate(data.babyInfo.dueDate)}` : "출산 예정일을 입력해보세요."}</p>
        </div>
      </section>
      {records.length === 0 ? (
        <div className="empty card">아직 저장된 기록이 없어요.<br/>오늘의 태교 장면을 먼저 기록해보세요.</div>
      ) : records.map((r) => {
        const key = r.type === "daily" ? "dailyRecords" : r.type === "activity" ? "activityRecords" : "hospitalRecords";
        return (
          <article className="record card" key={`${r.type}-${r.id}`} id={`record-${r.id}`}>
            <div className="record-top">
              <div>
                <strong>{r.type === "daily" ? "임신 주차 기록" : r.type === "activity" ? "태교 활동" : "병원 기록"}</strong>
                <p>{fmtDate(r.date)} {r.week ? `· ${r.week}` : ""}{r.updatedAt ? " · 수정됨" : ""}</p>
              </div>
              <div style={{display:"flex",gap:"6px",alignItems:"center",flexWrap:"wrap",justifyContent:"flex-end"}}>
                <button
                  onClick={() => onEdit(r)}
                  style={{background:"rgba(255,255,255,.8)",border:"1px solid rgba(164,122,142,.18)",borderRadius:"13px",cursor:"pointer",fontSize:"13px",padding:"6px 10px",fontWeight:"800",color:"#8b707c"}}
                  title="기록 수정"
                >✏️ 수정</button>
                <button
                  onClick={async () => { const el = document.getElementById(`record-${r.id}`); const canvas = await captureElement(el); await shareImage(canvas, `태교기록_${r.date}.png`); }}
                  style={{background:"rgba(255,255,255,.8)",border:"1px solid rgba(164,122,142,.18)",borderRadius:"13px",cursor:"pointer",fontSize:"13px",padding:"6px 10px",fontWeight:"800",color:"#8b707c"}}
                  title="카드 이미지 공유"
                >📤 공유</button>
                <button
                  onClick={async () => { await shareStoryCard(r, data.babyInfo.babyName); }}
                  style={{background:"linear-gradient(135deg,#f27ea5,#a78bfa)",border:"none",borderRadius:"13px",cursor:"pointer",fontSize:"13px",padding:"6px 10px",fontWeight:"800",color:"#fff"}}
                  title="인스타 스토리용 이미지"
                >📸 스토리</button>
                <button
                  onClick={() => remove(key, r.id)}
                  style={{background:"rgba(255,255,255,.7)",border:"1px solid rgba(164,122,142,.18)",borderRadius:"13px",padding:"7px 10px",fontSize:"12px",fontWeight:"800",color:"#8b707c"}}
                >삭제</button>
              </div>
            </div>
            {r.photo
              ? <PhotoSlot photo={r.photo} small/>
              : r.type === "hospital"
                ? <SceneComposer mood={r.mood || "편안함"} bg={r.bg || "clinic"} character={r.character || "mama"} activity={r.activity || "초음파"} small/>
                : <SceneComposer mood={r.mood || "사랑"} bg={r.bg || "garden"} character={r.character || "family"} activity={r.activity || "태담"} small/>
            }
            {r.activity && <span className="tag">{getActivity(r.activity).emoji} {getActivity(r.activity).label}</span>}
            {r.condition && <span className="tag">{r.condition}</span>}
            {r.checkup && <p>{r.checkup}</p>}
            {r.feeling && <p>{r.feeling}</p>}
            {r.message && <blockquote>{r.message}</blockquote>}
            {r.memory && <p className="muted-text">{r.memory}</p>}
            {r.memo && <p className="muted-text">{r.memo}</p>}
          </article>
        );
      })}
    </main>
  );
}
// ── 공유 유틸 ──────────────────────────────────────────
async function loadHtml2Canvas() {
  return new Promise((res, rej) => {
    if (window.html2canvas) return res(window.html2canvas);
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    s.onload = () => res(window.html2canvas); s.onerror = rej;
    document.head.appendChild(s);
  });
}

async function captureElement(el) {
  const h2c = await loadHtml2Canvas();
  return h2c(el, { scale: 2, useCORS: true, backgroundColor: null, logging: false });
}

async function shareImage(canvas, filename = "태교북_공유.png") {
  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      // Web Share API (모바일 카카오톡/인스타 등)
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], filename, { type: "image/png" })] })) {
        try {
          await navigator.share({ files: [new File([blob], filename, { type: "image/png" })], title: "태교북 공유" });
          resolve("shared");
          return;
        } catch (e) { /* 취소 또는 미지원 시 다운로드로 fallback */ }
      }
      // fallback: 이미지 다운로드
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = filename;
      a.click(); URL.revokeObjectURL(url);
      resolve("downloaded");
    }, "image/png");
  });
}


// ── 인스타 스토리 카드 생성 (9:16) ──────────────────────
async function shareStoryCard(r, babyName) {
  const MOOD_COLORS = {
    "사랑":"#f27ea5","설렘":"#f4a261","차분함":"#9b8ec4",
    "편안함":"#6ab8c8","기쁨":"#f7d26e","평온":"#7dba8e",
  };
  const TYPE_LABELS = { daily:"임신 주차 기록", activity:"태교 활동", hospital:"병원 기록" };
  const TYPE_EMOJIS = { daily:"📝", activity:"🌿", hospital:"🏥" };
  const accent = MOOD_COLORS[r.mood] || "#f27ea5";
  const light  = accent + "22";

  // 9:16 = 1080x1920 기준, 렌더는 540x960으로 scale:2
  const el = document.createElement("div");
  el.style.cssText = [
    "width:540px", "height:960px", "position:fixed",
    "left:-9999px", "top:0", "overflow:hidden",
    `background:linear-gradient(160deg,${light} 0%,#fff 60%,${light} 100%)`,
    "font-family:'Noto Sans KR',system-ui,sans-serif",
    "display:flex", "flex-direction:column",
    "align-items:center", "justify-content:center",
    "padding:56px 48px", "box-sizing:border-box",
  ].join(";");

  el.innerHTML = `
    <div style="width:100%;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;">
      <!-- 상단 브랜드 -->
      <p style="font-size:13px;font-weight:900;color:${accent};letter-spacing:.12em;margin:0 0 18px;opacity:.8;">
        💗 ${babyName || "우리 아기"}의 태교북
      </p>

      <!-- 씬 카드 -->
      <div style="width:100%;border-radius:32px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,.12);margin-bottom:32px;">
        <img
          src="${r.sceneThumb || ""}"
          style="width:100%;aspect-ratio:420/260;object-fit:cover;display:${r.sceneThumb ? "block" : "none"};"
        />
        <div style="width:100%;aspect-ratio:420/260;background:linear-gradient(135deg,${light},${accent}33);display:${r.sceneThumb ? "none" : "grid"};place-items:center;font-size:72px;">
          ${TYPE_EMOJIS[r.type] || "📝"}
        </div>
      </div>

      <!-- 타입 + 날짜 -->
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
        <span style="background:${accent};color:#fff;border-radius:999px;padding:5px 16px;font-size:13px;font-weight:900;">${TYPE_EMOJIS[r.type]} ${TYPE_LABELS[r.type]}</span>
        <span style="color:#999;font-size:13px;font-weight:700;">${r.date || ""}${r.week ? " · " + r.week : ""}</span>
      </div>

      <!-- 무드 태그 -->
      ${r.mood ? `<span style="display:inline-block;background:${light};color:${accent};border:1.5px solid ${accent}55;border-radius:999px;padding:5px 18px;font-size:13px;font-weight:900;margin-bottom:20px;">${r.mood}</span>` : ""}

      <!-- 메인 텍스트 -->
      ${(r.message || r.feeling || r.memo) ? `
        <div style="width:100%;background:rgba(255,255,255,.82);border-radius:24px;padding:24px 28px;border-left:5px solid ${accent};box-shadow:0 8px 28px rgba(0,0,0,.06);margin-bottom:16px;">
          <p style="font-size:13px;color:${accent};font-weight:900;margin:0 0 10px;">
            ${r.message ? "아기에게 한마디" : r.feeling ? "오늘의 느낌" : "메모"}
          </p>
          <p style="font-size:16px;line-height:1.75;color:#3f3138;margin:0;word-break:keep-all;">
            ${(r.message || r.feeling || r.memo).slice(0, 120)}${(r.message || r.feeling || r.memo).length > 120 ? "..." : ""}
          </p>
        </div>
      ` : ""}

      <!-- 컨디션 / 병원 -->
      ${r.condition ? `<p style="font-size:14px;color:#8b707c;margin:0 0 8px;">컨디션 · ${r.condition}</p>` : ""}
      ${r.hospital ? `<p style="font-size:14px;color:#8b707c;margin:0 0 8px;">병원 · ${r.hospital}</p>` : ""}

      <!-- 하단 브랜드 -->
      <p style="font-size:11px;color:#ccc;margin:24px 0 0;letter-spacing:.06em;">Prenatal Story Book</p>
    </div>
  `;

  document.body.appendChild(el);
  const h2c = await loadHtml2Canvas();
  const canvas = await h2c(el, { scale: 2, useCORS: true, backgroundColor: null, logging: false });
  document.body.removeChild(el);
  await shareImage(canvas, `태교스토리_${r.date || "기록"}.png`);
}

async function exportPDF(data, onProgress) {
  const loadScript = (src) => new Promise((res, rej) => {
    if (document.querySelector(`script[src="${src}"]`)) return res();
    const s = document.createElement("script");
    s.src = src;
    s.onload = res;
    s.onerror = rej;
    document.head.appendChild(s);
  });

  onProgress?.({ step: "라이브러리 로드 중...", pct: 2 });
  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js");
  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
  const { jsPDF } = window.jspdf;

  const safe = (value = "") => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\n/g, "<br/>");

  const b = data.babyInfo || {};
  const babyName = b.babyName || "우리 아기";
  const records = [
    ...data.dailyRecords.map(r => ({ ...r, type: "daily" })),
    ...data.activityRecords.map(r => ({ ...r, type: "activity" })),
    ...data.hospitalRecords.map(r => ({ ...r, type: "hospital" })),
  ].sort((a, c) => new Date(a.date || 0) - new Date(c.date || 0));

  const total = records.length;
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210;
  const H = 297;
  const PAGE_W = 794;
  const PAGE_H = 1123;

  const wrap = document.createElement("div");
  wrap.style.cssText = `
    position:fixed;
    top:0;
    left:0;
    width:${PAGE_W}px;
    height:${PAGE_H}px;
    overflow:hidden;
    pointer-events:none;
    opacity:0;
    z-index:-1;
  `;
  document.body.appendChild(wrap);

  const waitForImages = async (root) => {
    const imgs = [...root.querySelectorAll("img")];
    await Promise.all(imgs.map((img) => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    }));
    await Promise.all(imgs.map((img) => img.decode ? img.decode().catch(() => {}) : Promise.resolve()));
  };

  const capture = async (el) => {
    wrap.innerHTML = "";
    wrap.appendChild(el);
    await waitForImages(el);
    if (document.fonts?.ready) await document.fonts.ready;
    await new Promise(r => setTimeout(r, 120));
    wrap.style.opacity = "1";
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    const canvas = await window.html2canvas(el, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: PAGE_W,
      height: PAGE_H,
      windowWidth: PAGE_W,
      windowHeight: PAGE_H,
      scrollX: 0,
      scrollY: 0,
    });
    wrap.style.opacity = "0";
    return canvas;
  };

  const MOOD_COLORS = {
    "사랑":"#f27ea5", "설렘":"#ee8bb2", "감사":"#ef9ab7", "행복":"#efb542",
    "차분함":"#9789dd", "편안함":"#75b7e8", "기대감":"#ee9f48", "피곤함":"#91a6b2",
    "감동":"#e98585", "신남":"#ee8f59", "두근두근":"#d97bc6", "따뜻함":"#ec9a5e",
    "뿌듯함":"#77bd6a", "평온함":"#6ac79b", "울컥함":"#8fa2f5", "용기":"#ee9b45",
  };
  const TYPE_LABELS = { daily:"임신 주차 기록", activity:"태교 활동", hospital:"병원 기록" };
  const TYPE_EMOJIS = { daily:"📝", activity:"🌿", hospital:"🏥" };

  const baseStyle = `
    font-family:'Noto Sans KR','Apple SD Gothic Neo','Malgun Gothic',sans-serif;
    box-sizing:border-box;
    line-height:1.7;
    color:#3f3138;
  `;

  // ── 커버 ──
  onProgress?.({ step: "표지 만드는 중...", pct: 5 });
  const coverEl = document.createElement("div");
  coverEl.style.cssText = `width:${PAGE_W}px;height:${PAGE_H}px;${baseStyle}
    background:linear-gradient(160deg,#fde8f0 0%,#fff5f9 50%,#fde8f0 100%);
    display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px;position:relative;`;
  coverEl.innerHTML = `
    <div style="font-size:64px;margin-bottom:28px;">💗</div>
    <h1 style="font-size:44px;color:#c0567a;margin:0 0 14px;font-weight:700;text-align:center;">${safe(babyName)}를 기다리며</h1>
    <p style="font-size:20px;color:#e08ca8;margin:0 0 40px;">태교 일기</p>
    <div style="width:80px;height:2px;background:#f2a0c0;margin-bottom:40px;border-radius:2px;"></div>
    ${b.dueDate ? `<p style="font-size:15px;color:#c0829a;margin:6px 0;">출산 예정일 · ${safe(b.dueDate)}</p>` : ""}
    ${b.motherName ? `<p style="font-size:15px;color:#c0829a;margin:6px 0;">작성자 · ${safe(b.motherName)}</p>` : ""}
    <div style="margin-top:60px;display:flex;gap:24px;">
      <span style="background:#fff0f5;color:#c0567a;padding:10px 20px;border-radius:24px;font-size:13px;font-weight:700;">📝 주차기록 ${data.dailyRecords.length}개</span>
      <span style="background:#fff0f5;color:#c0567a;padding:10px 20px;border-radius:24px;font-size:13px;font-weight:700;">🌿 활동기록 ${data.activityRecords.length}개</span>
      <span style="background:#fff0f5;color:#c0567a;padding:10px 20px;border-radius:24px;font-size:13px;font-weight:700;">🏥 병원기록 ${data.hospitalRecords.length}개</span>
    </div>
    <p style="position:absolute;bottom:40px;font-size:11px;color:#ddd;letter-spacing:.1em;">Prenatal Story Book</p>
  `;
  const coverCanvas = await capture(coverEl);
  pdf.addImage(coverCanvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, W, H);

  // ── SVG 씬을 탭 이동 없이 직접 캡처 ──
  // 기존 방식(setTab("book") + setTimeout)을 제거하고,
  // wrap div에 인라인 img로 직접 그려서 캡처합니다.
  const sceneToDataUrl = async (r) => {
    // 사진이 있으면 사진 자체를 base64로 반환
    if (r.photo) return r.photo;

    // DOM에서 해당 레코드 article을 찾아 SVG를 복제
    try {
      const article = document.getElementById(`record-${r.id}`);
      const svgEl = article?.querySelector(".scene svg");
      if (!svgEl) return null;

      const clone = svgEl.cloneNode(true);
      const images = clone.querySelectorAll("image");

      // SVG 내부 <image href="blob:..."> 를 base64로 교체
      await Promise.all([...images].map(async (img) => {
        const href = img.getAttribute("href") || img.getAttribute("xlink:href");
        if (!href || href.startsWith("data:")) return;
        try {
          const res = await fetch(href);
          if (!res.ok) throw new Error(`fetch ${href} → ${res.status}`);
          const blob = await res.blob();
          const b64 = await new Promise(rv => {
            const fr = new FileReader();
            fr.onload = () => rv(fr.result);
            fr.readAsDataURL(blob);
          });
          img.setAttribute("href", b64);
        } catch (e) {
          console.warn("[PDF] SVG 이미지 로드 실패, 빈 슬롯으로 대체:", e);
          img.removeAttribute("href");
        }
      }));

      const vb = svgEl.viewBox.baseVal;
      const sceneW = vb.width || 420;
      const sceneH = vb.height || 260;
      const svgStr = new XMLSerializer().serializeToString(clone);
      const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      return await new Promise((res) => {
        const img = new Image();
        img.onload = () => {
          const cvs = document.createElement("canvas");
          cvs.width = sceneW * 3; cvs.height = sceneH * 3;
          const ctx = cvs.getContext("2d");
          ctx.scale(3, 3);
          ctx.drawImage(img, 0, 0, sceneW, sceneH);
          URL.revokeObjectURL(url);
          res(cvs.toDataURL("image/png"));
        };
        img.onerror = () => { URL.revokeObjectURL(url); res(null); };
        img.src = url;
      });
    } catch (e) {
      console.warn("[PDF] 씬 캡처 실패:", e);
      return null;
    }
  };

  const PAD = 38;
  const CARD_W = PAGE_W - PAD * 2;
  const CARD_H = PAGE_H - PAD * 2 - 24;
  const INNER_W = CARD_W - 56;
  const SCENE_H = Math.round(INNER_W * 260 / 420);
  const IMAGE_FRAME_H = SCENE_H;

  const field = (label, val, accent, extra = "") => val ? `
    <div style="margin-bottom:12px;">
      <p style="font-size:12px;color:${accent};font-weight:800;margin:0 0 4px;letter-spacing:.02em;">${safe(label)}</p>
      <div style="font-size:15px;color:#5a3a48;background:${accent}12;padding:10px 14px;border-radius:11px;line-height:1.65;${extra}">${safe(val)}</div>
    </div>` : "";

  const imageHtml = (r, sceneDataUrl, accent) => {
    if (sceneDataUrl && !r.photo) {
      return `
        <div style="width:${INNER_W}px;margin:0 0 20px;flex-shrink:0;">
          <img src="${sceneDataUrl}" style="width:100%;height:auto;display:block;border-radius:16px;border:1px solid ${accent}20;box-sizing:border-box;" />
        </div>`;
    }
    if (r.photo) {
      return `
        <div style="width:${INNER_W}px;height:${IMAGE_FRAME_H}px;margin:0 0 20px;flex-shrink:0;border-radius:16px;overflow:hidden;background:#fffafc;border:1px solid ${accent}24;box-sizing:border-box;display:flex;align-items:center;justify-content:center;padding:10px;">
          <img src="${r.photo}" crossorigin="anonymous" style="max-width:100%;max-height:100%;width:auto;height:auto;display:block;border-radius:12px;" />
        </div>`;
    }
    return "";
  };

  const makeRecordPageHtml = (r, sceneDataUrl, idx, total) => {
    const accent = MOOD_COLORS[r.mood] || "#f27ea5";
    const image = imageHtml(r, sceneDataUrl, accent);
    return `
      <div style="width:${PAGE_W}px;height:${PAGE_H}px;${baseStyle}background:#faf6f9;padding:${PAD}px;box-sizing:border-box;position:relative;">
        <div style="width:${CARD_W}px;height:${CARD_H}px;background:#fff;border-radius:22px;border:1px solid ${accent}28;box-shadow:0 8px 26px rgba(0,0,0,.055);overflow:hidden;box-sizing:border-box;">
          <div style="height:6px;background:${accent};"></div>
          <div style="padding:26px 28px;box-sizing:border-box;height:calc(100% - 6px);display:flex;flex-direction:column;">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;flex-shrink:0;">
              <span style="font-size:12px;color:${accent};font-weight:900;">${TYPE_EMOJIS[r.type]} ${TYPE_LABELS[r.type]}</span>
              ${r.mood ? `<span style="font-size:11px;background:${accent}12;color:${accent};padding:3px 10px;border-radius:999px;border:1px solid ${accent}34;">${safe(r.mood)}</span>` : ""}
              <span style="font-size:11px;color:#aaa;margin-left:auto;">${idx} / ${total}</span>
            </div>
            <h3 style="font-size:24px;color:#3a2a32;margin:0 0 18px;font-weight:800;line-height:1.25;flex-shrink:0;">
              ${safe(r.date || "날짜 없음")}${r.week ? `&nbsp;·&nbsp;${safe(r.week)}` : ""}
            </h3>
            ${image}
            <div style="flex:1;overflow:hidden;">
              ${field("컨디션", r.condition, accent)}
              ${field("병원", r.hospital, accent)}
              ${field("검진 내용", r.checkup, accent)}
              ${field("오늘의 느낌", r.feeling, accent)}
              ${field("아기에게 한마디", r.message, accent, `border-left:4px solid ${accent};`)}
              ${field("오늘의 기억", r.memory, accent)}
              ${field("메모", r.memo, accent)}
            </div>
          </div>
        </div>
        <div style="position:absolute;left:0;right:0;bottom:18px;text-align:center;font-size:10px;color:#ddd;">${safe(babyName)}의 태교북 · Prenatal Story Book</div>
      </div>`;
  };

  for (let i = 0; i < records.length; i++) {
    const r = records[i];
    const pct = Math.round(10 + (i / total) * 85);
    onProgress?.({ step: `기록 ${i + 1} / ${total} 페이지 생성 중...`, pct });

    const sceneDataUrl = await sceneToDataUrl(r);
    const el = document.createElement("div");
    el.style.cssText = `width:${PAGE_W}px;height:${PAGE_H}px;${baseStyle}`;
    el.innerHTML = makeRecordPageHtml(r, sceneDataUrl, i + 1, total);

    const canvas = await capture(el);
    pdf.addPage();
    pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, W, H);
  }

  document.body.removeChild(wrap);
  onProgress?.({ step: "PDF 저장 중...", pct: 98 });
  pdf.save(`${babyName}_태교북.pdf`);
  onProgress?.({ step: "완료!", pct: 100 });
}

function Settings({ data, setData, setTab, showToast }) {
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(null); // { step, pct }

  // 용량 계산
  const usedBytes = calcStorageBytes(data);
  const usedKB = Math.round(usedBytes / 1024);
  const usedMB = (usedBytes / (1024 * 1024)).toFixed(2);
  const limitMB = 5;
  const pct = Math.min(100, Math.round(usedBytes / STORAGE_LIMIT_BYTES * 100));
  const isWarn  = usedBytes >= STORAGE_WARN_BYTES;
  const isDanger = usedBytes >= STORAGE_LIMIT_BYTES;

  const photoCount = [
    data.babyInfo.coverPhoto,
    ...data.dailyRecords.map((r) => r.photo),
    ...data.activityRecords.map((r) => r.photo),
    ...data.hospitalRecords.map((r) => r.photo),
  ].filter(Boolean).length;

  const reset = () => {
    if (!confirm("저장된 태교북 기록을 모두 초기화할까요?")) return;
    localStorage.removeItem(STORAGE_KEY);
    setData(INITIAL);
  };

  const clearPhotos = () => {
    if (!confirm(`저장된 사진 ${photoCount}장을 모두 삭제할까요?\n글·그림 기록은 유지됩니다.`)) return;
    setData(stripPhotos(data));
    showToast("🗑️ 사진을 모두 삭제했어요.");
  };

  const clearCaches = async () => {
    if ("serviceWorker" in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((reg) => reg.unregister()));
    }
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    }
    alert("브라우저 캐시와 서비스워커를 정리했습니다. 새로고침해주세요.");
  };

  const handleExport = async () => {
    const total = data.dailyRecords.length + data.activityRecords.length + data.hospitalRecords.length;
    if (total === 0) { alert("저장된 기록이 없어요. 먼저 기록을 작성해보세요!"); return; }
    setExporting(true);
    setProgress({ step: "준비 중...", pct: 0 });
    try {
      await exportPDF(data, (p) => setProgress(p));
      showToast("💗 PDF가 저장됐어요!");
    } catch (e) {
      console.error(e);
      showToast("PDF 생성 중 오류가 발생했어요. 다시 시도해주세요.", "error");
    } finally {
      setExporting(false);
      setTimeout(() => setProgress(null), 1200);
    }
  };

  const gaugeColor = isDanger ? "#c24f5d" : isWarn ? "#e8943a" : "var(--accent)";

  return (
    <main className="screen">
      <section className="card pad">
        <h2 className="form-title">설정</h2>

        {/* 용량 현황 */}
        <div style={{marginBottom:"22px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <h3 style={{margin:0,fontSize:"15px",color:"var(--deep)"}}>💾 저장 용량</h3>
            <span style={{fontSize:"12px",fontWeight:800,color: isDanger ? "#c24f5d" : isWarn ? "#e8943a" : "#8b707c"}}>
              {usedKB < 1024 ? `${usedKB} KB` : `${usedMB} MB`} / {limitMB} MB
            </span>
          </div>
          <div style={{height:10,borderRadius:999,background:"rgba(164,122,142,.12)",overflow:"hidden"}}>
            <div style={{height:"100%",width:`${pct}%`,borderRadius:999,background:gaugeColor,transition:"width .4s"}} />
          </div>
          <p className="muted-text" style={{marginTop:6,fontSize:12}}>
            {isDanger
              ? "⚠️ 용량이 가득 찼어요. 사진을 삭제해야 새 기록이 안전하게 저장됩니다."
              : isWarn
              ? "⚠️ 용량이 거의 찼어요. 사진을 정리하는 것을 권장해요."
              : "브라우저 localStorage 기준 최대 5MB까지 저장할 수 있어요."}
          </p>
          {photoCount > 0 && (
            <button className="ghost full" style={{marginTop:4,color: isWarn ? "#e8943a" : undefined}} onClick={clearPhotos}>
              🖼️ 사진 {photoCount}장 모두 삭제하기
            </button>
          )}
        </div>

        <hr style={{border:"none",borderTop:"1px solid #f0e0e8",margin:"4px 0 18px"}}/>

        {/* PDF 내보내기 */}
        <div style={{marginBottom:"20px"}}>
          <h3 style={{margin:"0 0 8px",fontSize:"15px",color:"var(--deep)"}}>📄 태교북 PDF 내보내기</h3>
          <p className="muted-text" style={{marginBottom:"12px"}}>지금까지 기록한 모든 내용을 예쁜 PDF로 저장해요.</p>

          {/* 진행률 UI */}
          {exporting && progress && (
            <div style={{marginBottom:12,padding:"14px 16px",borderRadius:18,background:"rgba(255,255,255,.72)",border:"1px solid rgba(164,122,142,.14)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={{fontSize:13,fontWeight:800,color:"var(--deep)"}}>{progress.step}</span>
                <span style={{fontSize:12,fontWeight:900,color:"var(--accent)"}}>{progress.pct}%</span>
              </div>
              <div style={{height:8,borderRadius:999,background:"rgba(164,122,142,.12)",overflow:"hidden"}}>
                <div style={{height:"100%",width:`${progress.pct}%`,borderRadius:999,background:"var(--accent)",transition:"width .35s ease"}} />
              </div>
            </div>
          )}

          <button className="primary full" onClick={handleExport} disabled={exporting}>
            {exporting ? "⏳ PDF 생성 중..." : "💗 PDF로 내보내기"}
          </button>
        </div>

        <hr style={{border:"none",borderTop:"1px solid #f0e0e8",margin:"4px 0 18px"}}/>

        <p className="muted-text">화면이 예전 그대로 보이면 캐시 정리를 먼저 해주세요.</p>
        <button className="ghost full" onClick={clearCaches}>서비스워커/캐시 정리</button>
        <button className="danger full" onClick={reset}>기록 전체 초기화</button>
      </section>
    </main>
  );
}
export default function App() {
  const [data, setData] = usePlanner();
  const [tab, setTab] = useState("home");
  const [writeTab, setWriteTab] = useState(() => isIntroWritten(data.babyInfo) ? "choose" : "intro");
  const [editTarget, setEditTarget] = useState(null);
  const { toasts, show: showToast } = useToast();

  useEffect(() => {
    if (writeTab === "intro" && isIntroWritten(data.babyInfo)) setWriteTab("choose");
  }, []);

  const openWrite = () => {
    setWriteTab(isIntroWritten(data.babyInfo) ? "choose" : "intro");
    setEditTarget(null);
    setTab("write");
  };

  const handleEdit = (record) => {
    setEditTarget(record);
    setWriteTab(record.type);
    setTab("write");
  };

  const mood = getMood(data.babyInfo.coverMood);
  const bgStyle = { "--app-a": mood.sky[0], "--app-b": mood.sky[1], "--app-c": `${mood.accent}33`, "--accent": mood.accent, "--deep": mood.deep };
  return (
    <div className="app-shell" style={bgStyle}>
      <div className="ambient"/>
      <ToastLayer toasts={toasts} />
      <BabyNamePopup data={data} setData={setData}/>
      <div className="app">
        <Header data={data}/>
        {tab === "home" && <Home data={data} setData={setData} setTab={setTab} setWriteTab={setWriteTab}/>}
        {tab === "write" && (
          <Write
            data={data}
            setData={setData}
            writeTab={writeTab}
            setWriteTab={setWriteTab}
            setTab={setTab}
            editTarget={editTarget}
            setEditTarget={setEditTarget}
            showToast={showToast}
          />
        )}
        {tab === "book" && <Book data={data} setData={setData} onEdit={handleEdit}/>}
        {tab === "settings" && <Settings data={data} setData={setData} setTab={setTab} showToast={showToast}/>}
        <nav className="bottom">
          <button className={tab === "home" ? "on" : ""} onClick={() => setTab("home")}><span>🏠</span>홈</button>
          <button className={tab === "write" ? "on" : ""} onClick={openWrite}><span>✍️</span>기록</button>
          <button className={tab === "book" ? "on" : ""} onClick={() => setTab("book")}><span>📖</span>태교북</button>
          <button className={tab === "settings" ? "on" : ""} onClick={() => setTab("settings")}><span>⚙️</span>설정</button>
        </nav>
      </div>
    </div>
  );
}
