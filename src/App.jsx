import React, { useMemo, useState } from "react";

/**
 * 태교북 앱 화면 비율 재구성용 App.jsx
 * - Vite + React 기준으로 src/App.jsx에 그대로 붙여 넣어 테스트할 수 있습니다.
 * - 이미지 경로는 아래 ASSETS 배열의 src만 실제 파일명에 맞게 바꾸면 됩니다.
 * - 핵심 구조: 전체 화면 > A4 세로 비율 book-page > 배경/캐릭터/액티비티 레이어
 */

const ASSETS = {
  moods: [
    { id: "happy", label: "행복해요", emoji: "😊" },
    { id: "calm", label: "편안해요", emoji: "🌿" },
    { id: "love", label: "사랑스러워요", emoji: "💗" },
    { id: "tired", label: "조금 피곤해요", emoji: "🫧" },
  ],
  backgrounds: [
    { id: "sunny-room", label: "화창한 방", src: "/assets/backgrounds/sunny-room.png" },
    { id: "garden", label: "정원", src: "/assets/backgrounds/garden.png" },
    { id: "night-room", label: "밤의 방", src: "/assets/backgrounds/night-room.png" },
    { id: "rain-room", label: "비 오는 창가", src: "/assets/backgrounds/rain-room.png" },
  ],
  characters: [
    { id: "mom-dad-baby", label: "엄마 아빠 아기", src: "/assets/characters/couple_baby.png" },
    { id: "mom", label: "엄마", src: "/assets/characters/mom.png" },
    { id: "dad", label: "아빠", src: "/assets/characters/dad.png" },
  ],
  activities: [
    { id: "walk", label: "산책", src: "/assets/activities/walk.png" },
    { id: "music", label: "음악 듣기", src: "/assets/activities/music.png" },
    { id: "reading", label: "책 읽기", src: "/assets/activities/reading.png" },
    { id: "exercise", label: "운동", src: "/assets/activities/exercise.png" },
    { id: "pray", label: "기도", src: "/assets/activities/pray.png" },
  ],
};

const STEPS = [
  { key: "mood", title: "오늘의 기분을 골라주세요", description: "선택하면 다음 단계로 자동 이동합니다." },
  { key: "background", title: "배경을 골라주세요", description: "태교북 페이지의 분위기가 정해져요." },
  { key: "character", title: "인물을 골라주세요", description: "비율을 유지한 채 페이지 안에 배치됩니다." },
  { key: "activity", title: "태교 활동을 골라주세요", description: "좌우 여백이 생겨도 잘리지 않게 표시됩니다." },
  { key: "write", title: "오늘의 이야기를 남겨주세요", description: "완성된 페이지를 보며 기록할 수 있어요." },
];

function clampStep(index) {
  return Math.max(0, Math.min(STEPS.length - 1, index));
}

function ImageWithFallback({ src, alt, className, fallbackText }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`${className || ""} image-fallback`} role="img" aria-label={alt}>
        <span>{fallbackText || alt}</span>
      </div>
    );
  }

  return <img className={className} src={src} alt={alt} onError={() => setFailed(true)} draggable={false} />;
}

function OptionButton({ active, children, onClick }) {
  return (
    <button type="button" className={`option-button ${active ? "active" : ""}`} onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [stepIndex, setStepIndex] = useState(0);
  const [babyName, setBabyName] = useState("우리 아기");
  const [selectedMood, setSelectedMood] = useState(ASSETS.moods[0]);
  const [selectedBackground, setSelectedBackground] = useState(ASSETS.backgrounds[0]);
  const [selectedCharacter, setSelectedCharacter] = useState(ASSETS.characters[0]);
  const [selectedActivity, setSelectedActivity] = useState(ASSETS.activities[0]);
  const [note, setNote] = useState("");

  const currentStep = STEPS[stepIndex];

  const todayLabel = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  }, []);

  const goNext = () => setStepIndex((prev) => clampStep(prev + 1));
  const goPrev = () => setStepIndex((prev) => clampStep(prev - 1));

  const selectAndMove = (setter, item) => {
    setter(item);
    window.setTimeout(() => {
      setStepIndex((prev) => clampStep(prev + 1));
    }, 120);
  };

  return (
    <div className="app-shell">
      <style>{styles}</style>

      <header className="top-bar">
        <div>
          <p className="eyebrow">Taegyo Book</p>
          <h1>오늘의 태교 기록</h1>
        </div>

        <div className="baby-name-box">
          <label htmlFor="babyName">태명</label>
          <input
            id="babyName"
            value={babyName}
            onChange={(event) => setBabyName(event.target.value)}
            placeholder="태명을 입력하세요"
          />
        </div>
      </header>

      <main className="main-layout">
        <section className="preview-zone" aria-label="태교북 미리보기">
          <article className="book-page">
            <ImageWithFallback
              className="book-bg"
              src={selectedBackground.src}
              alt={selectedBackground.label}
              fallbackText="배경 이미지"
            />

            <div className="soft-overlay" />

            <div className="page-content">
              <div className="page-date">{todayLabel}</div>
              <div className="page-title">
                <span>{babyName || "우리 아기"}에게</span>
                <strong>{selectedMood.emoji}</strong>
              </div>
            </div>

            <div className="character-layer">
              <ImageWithFallback
                className="character-image"
                src={selectedCharacter.src}
                alt={selectedCharacter.label}
                fallbackText="인물"
              />
            </div>

            <div className="activity-layer">
              <ImageWithFallback
                className="activity-image"
                src={selectedActivity.src}
                alt={selectedActivity.label}
                fallbackText={selectedActivity.label}
              />
            </div>

            <div className="note-layer">
              <p>{note.trim() || "오늘의 마음을 기록하면 이곳에 태교북 문장처럼 보여요."}</p>
            </div>
          </article>
        </section>

        <section className="control-panel" aria-label="기록 단계 선택">
          <div className="step-info">
            <div>
              <p className="step-count">
                {stepIndex + 1} / {STEPS.length}
              </p>
              <h2>{currentStep.title}</h2>
              <p>{currentStep.description}</p>
            </div>

            <button type="button" className="prev-button" onClick={goPrev} disabled={stepIndex === 0}>
              이전
            </button>
          </div>

          {currentStep.key === "mood" && (
            <div className="option-grid compact">
              {ASSETS.moods.map((mood) => (
                <OptionButton
                  key={mood.id}
                  active={selectedMood.id === mood.id}
                  onClick={() => selectAndMove(setSelectedMood, mood)}
                >
                  <span className="option-emoji">{mood.emoji}</span>
                  <span>{mood.label}</span>
                </OptionButton>
              ))}
            </div>
          )}

          {currentStep.key === "background" && (
            <div className="option-scroll">
              {ASSETS.backgrounds.map((background) => (
                <button
                  type="button"
                  key={background.id}
                  className={`asset-card ${selectedBackground.id === background.id ? "active" : ""}`}
                  onClick={() => selectAndMove(setSelectedBackground, background)}
                >
                  <div className="asset-thumb background-thumb">
                    <ImageWithFallback src={background.src} alt={background.label} fallbackText="배경" />
                  </div>
                  <span>{background.label}</span>
                </button>
              ))}
            </div>
          )}

          {currentStep.key === "character" && (
            <div className="option-scroll">
              {ASSETS.characters.map((character) => (
                <button
                  type="button"
                  key={character.id}
                  className={`asset-card ${selectedCharacter.id === character.id ? "active" : ""}`}
                  onClick={() => selectAndMove(setSelectedCharacter, character)}
                >
                  <div className="asset-thumb contain-thumb">
                    <ImageWithFallback src={character.src} alt={character.label} fallbackText="인물" />
                  </div>
                  <span>{character.label}</span>
                </button>
              ))}
            </div>
          )}

          {currentStep.key === "activity" && (
            <div className="option-scroll">
              {ASSETS.activities.map((activity) => (
                <button
                  type="button"
                  key={activity.id}
                  className={`asset-card ${selectedActivity.id === activity.id ? "active" : ""}`}
                  onClick={() => selectAndMove(setSelectedActivity, activity)}
                >
                  <div className="asset-thumb contain-thumb small-activity">
                    <ImageWithFallback src={activity.src} alt={activity.label} fallbackText={activity.label} />
                  </div>
                  <span>{activity.label}</span>
                </button>
              ))}
            </div>
          )}

          {currentStep.key === "write" && (
            <div className="write-box">
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="오늘 아기에게 들려주고 싶은 말을 적어보세요."
                maxLength={240}
              />
              <div className="write-actions">
                <span>{note.length} / 240</span>
                <button type="button" className="save-button">
                  기록 저장
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

const styles = `
:root {
  color-scheme: light;
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #fff7f3;
  color: #3d2c2a;
}

* {
  box-sizing: border-box;
}

html,
body,
#root {
  width: 100%;
  min-height: 100%;
  margin: 0;
}

button,
input,
textarea {
  font: inherit;
}

button {
  -webkit-tap-highlight-color: transparent;
}

.app-shell {
  width: 100%;
  min-height: 100dvh;
  display: grid;
  grid-template-rows: auto 1fr;
  background:
    radial-gradient(circle at top left, rgba(255, 214, 205, 0.85), transparent 30rem),
    linear-gradient(180deg, #fff8f4 0%, #fff1eb 100%);
  overflow: hidden;
}

.top-bar {
  width: 100%;
  min-height: 76px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: calc(12px + env(safe-area-inset-top)) 18px 12px;
}

.eyebrow {
  margin: 0 0 3px;
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #b67b70;
  font-weight: 800;
}

.top-bar h1 {
  margin: 0;
  font-size: clamp(20px, 4vw, 28px);
  line-height: 1.12;
  letter-spacing: -0.04em;
}

.baby-name-box {
  width: min(40vw, 180px);
  padding: 8px 10px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 8px 24px rgba(130, 74, 62, 0.1);
}

.baby-name-box label {
  display: block;
  margin-bottom: 3px;
  font-size: 11px;
  color: #9d6a62;
  font-weight: 700;
}

.baby-name-box input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: #3d2c2a;
  font-size: 14px;
  font-weight: 700;
}

.main-layout {
  min-height: 0;
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  gap: 10px;
}

.preview-zone {
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 14px 4px;
}

.book-page {
  position: relative;
  height: min(100%, 680px);
  aspect-ratio: 210 / 297;
  max-width: min(92vw, 520px);
  border-radius: clamp(20px, 5vw, 34px);
  overflow: hidden;
  background: #fff;
  box-shadow:
    0 22px 50px rgba(89, 48, 40, 0.18),
    0 2px 10px rgba(89, 48, 40, 0.08);
  isolation: isolate;
}

.book-bg,
.book-bg img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-bg.image-fallback {
  position: absolute;
  inset: 0;
  border-radius: 0;
  background: linear-gradient(145deg, #ffe3db, #fff6ec);
}

.soft-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(255,255,255,0.52) 0%, rgba(255,255,255,0.02) 45%),
    linear-gradient(0deg, rgba(65, 34, 28, 0.10), transparent 38%);
  z-index: 1;
  pointer-events: none;
}

.page-content {
  position: absolute;
  z-index: 3;
  left: 8%;
  right: 8%;
  top: 7%;
  color: #4d302b;
  text-shadow: 0 1px 8px rgba(255,255,255,0.65);
}

.page-date {
  display: inline-flex;
  max-width: 100%;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255,255,255,0.62);
  backdrop-filter: blur(8px);
  font-size: clamp(10px, 2.4vw, 13px);
  font-weight: 700;
}

.page-title {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: clamp(22px, 6vw, 34px);
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -0.05em;
}

.page-title strong {
  font-size: 0.9em;
}

.character-layer {
  position: absolute;
  z-index: 4;
  left: 50%;
  bottom: 20%;
  width: 78%;
  height: 42%;
  transform: translateX(-50%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  pointer-events: none;
}

.character-image,
.character-layer img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center bottom;
}

.activity-layer {
  position: absolute;
  z-index: 5;
  right: 7%;
  bottom: 15%;
  width: 28%;
  height: 20%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.activity-image,
.activity-layer img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center center;
}

.note-layer {
  position: absolute;
  z-index: 6;
  left: 8%;
  right: 8%;
  bottom: 6.5%;
  min-height: 12%;
  padding: clamp(10px, 3vw, 16px);
  border-radius: clamp(16px, 4vw, 24px);
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 26px rgba(74, 39, 32, 0.10);
}

.note-layer p {
  margin: 0;
  font-size: clamp(12px, 3vw, 15px);
  line-height: 1.55;
  color: #57413d;
  word-break: keep-all;
}

.control-panel {
  min-height: 178px;
  padding: 12px 16px calc(14px + env(safe-area-inset-bottom));
  border-radius: 28px 28px 0 0;
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 -10px 28px rgba(114, 66, 56, 0.1);
  backdrop-filter: blur(18px);
}

.step-info {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.step-count {
  margin: 0 0 4px;
  color: #bf7f72;
  font-size: 12px;
  font-weight: 900;
}

.step-info h2 {
  margin: 0;
  font-size: clamp(16px, 4vw, 20px);
  line-height: 1.2;
  letter-spacing: -0.03em;
}

.step-info p:not(.step-count) {
  margin: 4px 0 0;
  color: #8d6b65;
  font-size: 13px;
  line-height: 1.35;
}

.prev-button,
.save-button {
  border: 0;
  border-radius: 999px;
  font-weight: 900;
  cursor: pointer;
  transition: transform 0.16s ease, opacity 0.16s ease;
}

.prev-button {
  flex: 0 0 auto;
  padding: 10px 14px;
  background: #f4ded8;
  color: #7b4d45;
}

.prev-button:disabled {
  cursor: not-allowed;
  opacity: 0.42;
}

.prev-button:not(:disabled):active,
.save-button:active,
.option-button:active,
.asset-card:active {
  transform: scale(0.98);
}

.option-grid {
  display: grid;
  gap: 10px;
}

.option-grid.compact {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.option-button {
  min-height: 54px;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  border: 1px solid rgba(201, 142, 131, 0.28);
  border-radius: 18px;
  background: #fff8f5;
  color: #5d403b;
  font-weight: 900;
  cursor: pointer;
}

.option-button.active,
.asset-card.active {
  border-color: #e29686;
  background: #ffe8e0;
  box-shadow: 0 8px 18px rgba(198, 118, 101, 0.18);
}

.option-emoji {
  font-size: 22px;
}

.option-scroll {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 2px 2px 8px;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.option-scroll::-webkit-scrollbar {
  height: 6px;
}

.option-scroll::-webkit-scrollbar-thumb {
  background: rgba(190, 122, 110, 0.34);
  border-radius: 999px;
}

.asset-card {
  flex: 0 0 104px;
  scroll-snap-align: start;
  border: 1px solid rgba(201, 142, 131, 0.25);
  border-radius: 20px;
  background: #fff8f5;
  padding: 8px;
  color: #5d403b;
  font-size: 12px;
  font-weight: 900;
  text-align: center;
  cursor: pointer;
}

.asset-thumb {
  width: 100%;
  height: 72px;
  margin-bottom: 7px;
  border-radius: 15px;
  overflow: hidden;
  background: #ffece6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.asset-thumb img {
  width: 100%;
  height: 100%;
}

.background-thumb img {
  object-fit: cover;
}

.contain-thumb img {
  object-fit: contain;
  padding: 6px;
}

.small-activity img {
  padding: 10px;
}

.image-fallback {
  width: 100%;
  height: 100%;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: inherit;
  background:
    linear-gradient(135deg, rgba(255, 228, 220, 0.95), rgba(255, 249, 242, 0.95));
  color: #b0786d;
  font-size: 12px;
  font-weight: 900;
  text-align: center;
}

.write-box {
  display: grid;
  gap: 10px;
}

.write-box textarea {
  width: 100%;
  min-height: 92px;
  resize: none;
  border: 1px solid rgba(201, 142, 131, 0.28);
  border-radius: 20px;
  outline: none;
  padding: 14px;
  background: #fffaf8;
  color: #4a322e;
  line-height: 1.5;
}

.write-box textarea:focus {
  border-color: #e29686;
  box-shadow: 0 0 0 4px rgba(226, 150, 134, 0.16);
}

.write-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: #a07168;
  font-size: 12px;
  font-weight: 800;
}

.save-button {
  padding: 12px 18px;
  background: #e99383;
  color: white;
}

@media (min-width: 760px) {
  .app-shell {
    overflow: auto;
  }

  .main-layout {
    grid-template-columns: minmax(0, 1fr) minmax(320px, 390px);
    grid-template-rows: minmax(0, 1fr);
    align-items: stretch;
    padding: 0 18px 18px;
  }

  .preview-zone {
    padding: 12px;
  }

  .book-page {
    height: min(100%, 760px);
    max-height: calc(100dvh - 122px);
  }

  .control-panel {
    align-self: center;
    max-height: calc(100dvh - 120px);
    overflow: auto;
    border-radius: 28px;
  }

  .option-grid.compact {
    grid-template-columns: 1fr;
  }

  .option-scroll {
    flex-wrap: wrap;
    overflow: visible;
  }

  .asset-card {
    flex-basis: calc(50% - 5px);
  }
}

@media (max-height: 700px) {
  .top-bar {
    min-height: 62px;
    padding-top: calc(8px + env(safe-area-inset-top));
    padding-bottom: 8px;
  }

  .control-panel {
    min-height: 154px;
    padding-top: 10px;
  }

  .step-info {
    margin-bottom: 8px;
  }

  .book-page {
    height: min(100%, 610px);
  }

  .note-layer {
    bottom: 5%;
  }
}

@media (max-width: 380px) {
  .top-bar {
    gap: 10px;
    padding-left: 12px;
    padding-right: 12px;
  }

  .baby-name-box {
    width: 132px;
  }

  .preview-zone {
    padding-left: 10px;
    padding-right: 10px;
  }

  .control-panel {
    padding-left: 12px;
    padding-right: 12px;
  }

  .asset-card {
    flex-basis: 96px;
  }
}
`;
