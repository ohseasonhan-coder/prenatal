import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

/*
  일부 App.jsx 코드가 React.Fragment, React.createElement 등
  React 전역 객체를 직접 참조하는 경우를 대비해 먼저 등록합니다.
*/
globalThis.React = React;

const { default: App } = await import("./App.jsx");

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  resetApp = async () => {
    try {
      const keysToRemove = [
        "taegyo_v4",
        "born_prenatal_v8",
        "born_prenatal_draft_v8",
        "born_prenatal_onboarded_v8",
        "taegyo_v7_draft_daily",
        "taegyo_v7_draft_activity"
      ];

      keysToRemove.forEach((key) => localStorage.removeItem(key));

      if ("serviceWorker" in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((reg) => reg.unregister()));
      }

      if ("caches" in window) {
        const cacheKeys = await caches.keys();
        await Promise.all(cacheKeys.map((key) => caches.delete(key)));
      }
    } catch (error) {
      console.warn("Reset failed:", error);
    }

    location.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <main className="screen">
        <section className="card padded">
          <h2>앱을 다시 불러와야 해요</h2>
          <p className="small">
            이전 배포 캐시나 저장 데이터 때문에 화면이 멈췄을 수 있어요.
            아래 버튼을 누르면 캐시를 정리한 뒤 다시 시작합니다.
          </p>
          <pre className="error-box">
            {String(this.state.error?.message || this.state.error)}
          </pre>
          <button className="primary" onClick={this.resetApp}>
            캐시 정리 후 다시 시작
          </button>
        </section>
      </main>
    );
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
