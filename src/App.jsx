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
  babyInfo: { babyName: "", babyNamePromptDone: false, dueDate: "", motherName: "", fatherName: "", firstFoundDate: "", firstFeeling: "", firstLetter: "", introCompleted: false, coverMood: "사랑", coverBg: "garden", coverChar: "family", coverActivity: "태담" },
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

function usePlanner() {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return INITIAL;
      const parsed = JSON.parse(saved);
      return { ...INITIAL, ...parsed, babyInfo: { ...INITIAL.babyInfo, ...(parsed.babyInfo || {}) }, dailyRecords: parsed.dailyRecords || [], activityRecords: parsed.activityRecords || [], hospitalRecords: parsed.hospitalRecords || [], checklistItems: parsed.checklistItems || INITIAL.checklistItems, bucketListItems: parsed.bucketListItems || INITIAL.bucketListItems };
    } catch { return INITIAL; }
  });
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(data)), [data]);
  return [data, setData];
}
function usePhotoUpload(onPhoto) {
  const ref = useRef(null);
  const trigger = () => ref.current?.click();
  const onChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onPhoto(reader.result);
    reader.readAsDataURL(file);
    event.target.value = "";
  };
  return { ref, trigger, onChange };
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
      <g transform="translate(0 -26)">
        <defs>
          <linearGradient id={fadeId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="68%" stopColor="#fff" stopOpacity="1" />
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

function ActivityLayer({ activity, mood }) {
  const a = getActivity(activity);
  const m = getMood(mood);
  const activitySrc = ACTIVITY_ASSETS[activity];
  const crop = ACTIVITY_CROPS[activity] || ACTIVITY_CROPS["운동"];

  // 모든 activity PNG를 운동 이미지와 비슷한 체감 크기로 맞추기 위해
  // 투명 여백을 viewBox로 잘라낸 뒤 같은 박스에 배치합니다.
  if (activitySrc) {
    return (
      <g>
        <ellipse cx="210" cy="246" rx="176" ry="17" fill="#000" opacity=".045" />
        <svg
          x="78"
          y="120"
          width="264"
          height="152"
          viewBox={`${crop.x} ${crop.y} ${crop.w} ${crop.h}`}
          preserveAspectRatio="xMidYMid meet"
          overflow="visible"
        >
          <image
            href={activitySrc}
            x="0"
            y="0"
            width="1536"
            height="1024"
            preserveAspectRatio="xMidYMid meet"
          />
        </svg>
      </g>
    );
  }

  return (
    <g transform="translate(210 210)">
      <rect x="-54" y="-34" width="108" height="58" rx="28" fill="#fff" opacity=".88" />
      <text x="0" y="8" textAnchor="middle" fontSize="34" fill={m.deep}>
        {a.emoji}
      </text>
    </g>
  );
}

function SceneComposer({ mood = "사랑", bg = "garden", character = "family", activity = "태담", small = false, large = false, editable = false, onEdit }) {
  const m = getMood(mood);
  const gradId = useMemo(() => `grad-${uid().replace(/[^a-zA-Z0-9]/g, "")}`, []);
  return <div className={`scene ${small ? "scene-small" : ""} ${large ? "scene-large" : ""}`}><svg viewBox="0 0 420 260" role="img" aria-label="태교 일러스트"><defs><linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={m.sky[0]}/><stop offset="100%" stopColor={m.sky[1]}/></linearGradient></defs><g><rect width="420" height="260" fill={`url(#${gradId})`}/><BackgroundLayer bg={bg} mood={mood}/><path d="M210 70 C255 10 358 40 360 116 C362 185 286 214 210 235 C134 214 58 185 60 116 C62 40 165 10 210 70 Z" fill={m.accent} opacity=".42"/><LeafDecor mood={mood}/><MoodFx mood={mood}/><FamilyIllustration character={character} mood={mood}/><ActivityLayer activity={activity} mood={mood}/></g></svg>{editable && <button className="edit-float" type="button" onClick={onEdit} aria-label="그림 수정">✏️</button>}</div>;
}
function PhotoSlot({ photo, onPhoto, onRemove, small = false }) {
  const { ref, trigger, onChange } = usePhotoUpload(onPhoto);
  if (photo) return <div className={`photo ${small ? "photo-small" : ""}`}><img src={photo} alt="업로드 사진" />{onRemove && <button className="photo-remove" type="button" onClick={onRemove}>×</button>}</div>;
  return <><button type="button" className={`photo-add ${small ? "photo-add-small" : ""}`} onClick={trigger}>📷 사진으로 대체하기</button><input ref={ref} type="file" accept="image/*" hidden onChange={onChange}/></>;
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
  const reset = () => { setStep(0); setOpen(true); };
  return <div className="scene-editor"><SceneComposer {...scene} large editable onEdit={reset}/><div className="selected-summary"><span>{getMood(scene.mood).emoji} {getMood(scene.mood).label}</span><span>{BACKGROUNDS.find(b => b.id === scene.bg)?.emoji} {BACKGROUNDS.find(b => b.id === scene.bg)?.label}</span><span>{CHARACTERS.find(c => c.id === scene.character)?.emoji} {CHARACTERS.find(c => c.id === scene.character)?.label}</span><span>{getActivity(scene.activity).emoji} {getActivity(scene.activity).label}</span></div>{open && <div className="wizard-backdrop"><section className="wizard"><div className="wizard-head"><div><strong>{title}</strong><p>{step + 1} / {steps.length}</p></div><button type="button" onClick={() => setOpen(false)}>×</button></div><div className="progress"><span style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div><h3>{current.title}</h3><p className="muted-text">{current.sub}</p><div className="choice-grid">{current.list.map((item) => <button type="button" key={item.id} className={scene[current.key] === item.id ? "choice on" : "choice"} onClick={() => select(item.id)}><span>{item.emoji}</span>{item.label}</button>)}</div><div className="wizard-actions wizard-actions-prev-only"><button type="button" className="ghost" disabled={step === 0} onClick={() => setStep((v) => Math.max(0, v - 1))}>이전</button></div></section></div>}</div>;
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
function Home({ data, setTab, setWriteTab }) {
  const b = data.babyInfo;
  return <main className="screen"><section className="hero card"><SceneComposer mood={b.coverMood} bg={b.coverBg} character={b.coverChar} activity={b.coverActivity}/><div className="hero-copy"><h2>{b.babyName || "우리 아기"}를 기다리는 그림일기</h2><p>기분, 배경, 인물, 태교 활동을 순서대로 골라 기록하는 모바일 태교북입니다.</p></div></section><section className="quick-grid">{[["✍️", "오늘 기록", "daily"], ["🌿", "태교 활동", "activity"], ["🏥", "병원 기록", "hospital"], ["📦", "출산 준비", "prepare"]].map(([icon, label, tab]) => <button key={tab} className="quick" onClick={() => { setWriteTab(isIntroWritten(b) ? tab : "intro"); setTab("write"); }}><span>{icon}</span>{label}</button>)}</section><section className="card pad"><div className="section-head"><h3>기록 현황</h3><p>커버 그림 바꾸기는 제외했고, 기록 작성 화면에서만 연필 버튼으로 그림을 수정합니다.</p></div><div className="stats"><div><strong>{data.dailyRecords.length}</strong><span>주차 기록</span></div><div><strong>{data.activityRecords.length}</strong><span>활동 기록</span></div><div><strong>{data.hospitalRecords.length}</strong><span>병원 기록</span></div></div></section></main>;
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
function DailyForm({ setData, setTab }) {
  const [scene, setScene] = useState({ mood: "사랑", bg: "garden", character: "family", activity: "태담" });
  const [form, setForm] = useState({ date: today(), week: "", condition: "", message: "", memory: "", photo: "" });
  const update = (key, value) => setForm((p) => ({ ...p, [key]: value }));
  const save = () => { setData((p) => ({ ...p, dailyRecords: sortByDate([...p.dailyRecords, { ...form, ...scene, id: uid(), createdAt: new Date().toISOString() }]) })); setTab("book"); };
  return <div className="card pad"><h2 className="form-title">Chapter 2. 임신 주차별 기록</h2>{form.photo ? <PhotoSlot photo={form.photo} onPhoto={(v) => update("photo", v)} onRemove={() => update("photo", "")} /> : <SceneWizard scene={scene} onChange={setScene} title="오늘의 그림 수정"/>}<div className="photo-line"><PhotoSlot photo={form.photo} onPhoto={(v) => update("photo", v)} onRemove={() => update("photo", "")} /></div><div className="two"><label>날짜<input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} /></label><label>임신 주차<input value={form.week} onChange={(e) => update("week", e.target.value)} placeholder="예: 18주차" /></label></div><label>엄마의 컨디션<input value={form.condition} onChange={(e) => update("condition", e.target.value)} placeholder="예: 조금 피곤했지만 편안함" /></label><label>아기에게 한마디<textarea value={form.message} onChange={(e) => update("message", e.target.value)} /></label><label>오늘의 기억<textarea value={form.memory} onChange={(e) => update("memory", e.target.value)} /></label><button className="primary" onClick={save}>✨ 기록 저장하기</button></div>;
}
function ActivityForm({ setData, setTab }) {
  const [scene, setScene] = useState({ mood: "평온함", bg: "picnic", character: "mama_papa", activity: "피크닉" });
  const [form, setForm] = useState({ date: today(), withWhom: "", feeling: "", message: "", photo: "" });
  const update = (key, value) => setForm((p) => ({ ...p, [key]: value }));
  const save = () => { setData((p) => ({ ...p, activityRecords: sortByDate([...p.activityRecords, { ...form, ...scene, id: uid(), createdAt: new Date().toISOString() }]) })); setTab("book"); };
  return <div className="card pad"><h2 className="form-title">Chapter 3. 태교 활동 기록</h2>{form.photo ? <PhotoSlot photo={form.photo} onPhoto={(v) => update("photo", v)} onRemove={() => update("photo", "")} /> : <SceneWizard scene={scene} onChange={setScene} title="활동 그림 수정"/>}<div className="photo-line"><PhotoSlot photo={form.photo} onPhoto={(v) => update("photo", v)} onRemove={() => update("photo", "")} /></div><label>날짜<input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} /></label><label>함께한 사람<input value={form.withWhom} onChange={(e) => update("withWhom", e.target.value)} placeholder="예: 아빠와 함께" /></label><label>오늘의 느낌<textarea value={form.feeling} onChange={(e) => update("feeling", e.target.value)} /></label><label>아기에게 남기는 말<textarea value={form.message} onChange={(e) => update("message", e.target.value)} /></label><button className="primary" onClick={save}>✨ 태교 활동 저장하기</button></div>;
}
function HospitalForm({ setData, setTab }) {
  const [scene, setScene] = useState({ mood: "편안함", bg: "clinic", character: "mama", activity: "초음파" });
  const [form, setForm] = useState({ date: today(), week: "", hospital: "", checkup: "", memo: "", condition: "", nextDate: "", photo: "" });
  const update = (key, value) => setForm((p) => ({ ...p, [key]: value }));
  const save = () => { setData((p) => ({ ...p, hospitalRecords: sortByDate([...p.hospitalRecords, { ...form, ...scene, id: uid(), createdAt: new Date().toISOString() }]) })); setTab("book"); };
  return <div className="card pad"><h2 className="form-title">Chapter 4. 병원 · 건강 관리</h2>{form.photo ? <PhotoSlot photo={form.photo} onPhoto={(v) => update("photo", v)} onRemove={() => update("photo", "")} /> : <SceneWizard scene={scene} onChange={setScene} title="병원 기록 그림 수정"/>}<div className="photo-line"><PhotoSlot photo={form.photo} onPhoto={(v) => update("photo", v)} onRemove={() => update("photo", "")} /></div><div className="two"><label>날짜<input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} /></label><label>임신 주차<input value={form.week} onChange={(e) => update("week", e.target.value)} /></label></div><label>병원명<input value={form.hospital} onChange={(e) => update("hospital", e.target.value)} /></label><label>검진 내용<input value={form.checkup} onChange={(e) => update("checkup", e.target.value)} placeholder="예: 정기검진, 초음파" /></label><label>컨디션<input value={form.condition} onChange={(e) => update("condition", e.target.value)} /></label><label>다음 진료일<input type="date" value={form.nextDate} onChange={(e) => update("nextDate", e.target.value)} /></label><label>메모<textarea value={form.memo} onChange={(e) => update("memo", e.target.value)} /></label><button className="primary" onClick={save}>🏥 병원 기록 저장하기</button></div>;
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

function Write({ data, setData, writeTab, setWriteTab, setTab }) {
  const introDone = isIntroWritten(data.babyInfo);
  const [showIntroPrompt, setShowIntroPrompt] = useState(!introDone);

  useEffect(() => {
    if (!introDone) setShowIntroPrompt(true);
  }, [introDone]);

  const tabs = introDone
    ? [{ id: "choose", label: "기록 선택" }, { id: "intro", label: "첫 이야기 수정" }, { id: "daily", label: "주차 기록" }, { id: "activity", label: "태교 활동" }, { id: "hospital", label: "병원" }, { id: "prepare", label: "준비" }]
    : [{ id: "intro", label: "첫 이야기" }];

  const safeWriteTab = introDone ? writeTab : "intro";

  return (
    <main className="screen">
      {!introDone && showIntroPrompt && (
        <IntroStartPopup
          setWriteTab={setWriteTab}
          setTab={setTab}
          onClose={() => setShowIntroPrompt(false)}
        />
      )}
      <div className="tabs">{tabs.map((t) => <button key={t.id} className={safeWriteTab === t.id ? "on" : ""} onClick={() => setWriteTab(t.id)}>{t.label}</button>)}</div>
      {safeWriteTab === "choose" && <RecordCategoryChooser setWriteTab={setWriteTab}/>} 
      {safeWriteTab === "intro" && <IntroForm data={data} setData={setData} setWriteTab={setWriteTab}/>} 
      {safeWriteTab === "daily" && <DailyForm setData={setData} setTab={setTab}/>} 
      {safeWriteTab === "activity" && <ActivityForm setData={setData} setTab={setTab}/>} 
      {safeWriteTab === "hospital" && <HospitalForm setData={setData} setTab={setTab}/>} 
      {safeWriteTab === "prepare" && <PrepareForm data={data} setData={setData}/>} 
    </main>
  );
}
function Book({ data, setData }) {
  const remove = (key, id) => setData((p) => ({ ...p, [key]: p[key].filter((item) => item.id !== id) }));
  const records = [...data.dailyRecords.map((r) => ({ ...r, type: "daily" })), ...data.activityRecords.map((r) => ({ ...r, type: "activity" })), ...data.hospitalRecords.map((r) => ({ ...r, type: "hospital" }))].sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  return <main className="screen"><section className="book-cover card"><SceneComposer mood={data.babyInfo.coverMood} bg={data.babyInfo.coverBg} character={data.babyInfo.coverChar} activity={data.babyInfo.coverActivity}/><div><h2>{data.babyInfo.babyName || "우리 아기"}를 기다리며</h2><p>{data.babyInfo.dueDate ? `출산 예정일 ${fmtDate(data.babyInfo.dueDate)}` : "출산 예정일을 입력해보세요."}</p></div></section>{records.length === 0 ? <div className="empty card">아직 저장된 기록이 없어요.<br/>오늘의 태교 장면을 먼저 기록해보세요.</div> : records.map((r) => { const key = r.type === "daily" ? "dailyRecords" : r.type === "activity" ? "activityRecords" : "hospitalRecords"; return <article className="record card" key={`${r.type}-${r.id}`}><div className="record-top"><div><strong>{r.type === "daily" ? "임신 주차 기록" : r.type === "activity" ? "태교 활동" : "병원 기록"}</strong><p>{fmtDate(r.date)} {r.week ? `· ${r.week}` : ""}</p></div><button onClick={() => remove(key, r.id)}>삭제</button></div>{r.photo ? <PhotoSlot photo={r.photo} small/> : r.type === "hospital" ? <SceneComposer mood={r.mood || "편안함"} bg={r.bg || "clinic"} character={r.character || "mama"} activity={r.activity || "초음파"} small/> : <SceneComposer mood={r.mood || "사랑"} bg={r.bg || "garden"} character={r.character || "family"} activity={r.activity || "태담"} small/>}{r.activity && <span className="tag">{getActivity(r.activity).emoji} {getActivity(r.activity).label}</span>}{r.condition && <span className="tag">{r.condition}</span>}{r.checkup && <p>{r.checkup}</p>}{r.feeling && <p>{r.feeling}</p>}{r.message && <blockquote>{r.message}</blockquote>}{r.memory && <p className="muted-text">{r.memory}</p>}{r.memo && <p className="muted-text">{r.memo}</p>}</article>; })}</main>;
}
function Settings({ setData }) {
  const reset = () => { if (!confirm("저장된 태교북 기록을 모두 초기화할까요?")) return; localStorage.removeItem(STORAGE_KEY); setData(INITIAL); };
  const clearCaches = async () => { if ("serviceWorker" in navigator) { const regs = await navigator.serviceWorker.getRegistrations(); await Promise.all(regs.map((reg) => reg.unregister())); } if ("caches" in window) { const keys = await caches.keys(); await Promise.all(keys.map((key) => caches.delete(key))); } alert("브라우저 캐시와 서비스워커를 정리했습니다. 새로고침해주세요."); };
  return <main className="screen"><section className="card pad"><h2 className="form-title">설정</h2><p className="muted-text">화면이 예전 그대로 보이면 캐시 정리를 먼저 해주세요.</p><button className="ghost full" onClick={clearCaches}>서비스워커/캐시 정리</button><button className="danger full" onClick={reset}>기록 전체 초기화</button></section></main>;
}
export default function App() {
  const [data, setData] = usePlanner();
  const [tab, setTab] = useState("home");
  const [writeTab, setWriteTab] = useState(() => isIntroWritten(data.babyInfo) ? "choose" : "intro");
  useEffect(() => {
    if (writeTab === "intro" && isIntroWritten(data.babyInfo)) setWriteTab("choose");
  }, []);
  const openWrite = () => {
    setWriteTab(isIntroWritten(data.babyInfo) ? "choose" : "intro");
    setTab("write");
  };
  const mood = getMood(data.babyInfo.coverMood);
  const bgStyle = { "--app-a": mood.sky[0], "--app-b": mood.sky[1], "--app-c": `${mood.accent}33`, "--accent": mood.accent, "--deep": mood.deep };
  return <div className="app-shell" style={bgStyle}><div className="ambient"/><BabyNamePopup data={data} setData={setData}/><div className="app"><Header data={data}/>{tab === "home" && <Home data={data} setTab={setTab} setWriteTab={setWriteTab}/>} {tab === "write" && <Write data={data} setData={setData} writeTab={writeTab} setWriteTab={setWriteTab} setTab={setTab}/>} {tab === "book" && <Book data={data} setData={setData}/>} {tab === "settings" && <Settings setData={setData}/>}<nav className="bottom"><button className={tab === "home" ? "on" : ""} onClick={() => setTab("home")}><span>🏠</span>홈</button><button className={tab === "write" ? "on" : ""} onClick={openWrite}><span>✍️</span>기록</button><button className={tab === "book" ? "on" : ""} onClick={() => setTab("book")}><span>📖</span>태교북</button><button className={tab === "settings" ? "on" : ""} onClick={() => setTab("settings")}><span>⚙️</span>설정</button></nav></div></div>;
}
