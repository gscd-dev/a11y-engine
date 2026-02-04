# @gscd/a11y-engine

**A11yMARKET's Accessibility Library**는 웹 애플리케이션의 접근성 설정을 통합 관리하고 실시간으로 적용하는 강력한 엔진입니다. 이 프로젝트는 [a11y-market-web](https://github.com/gscd-dev/a11y-market-web)에서 개발된 핵심 로직을 바탕으로 고도화되었습니다.

---

## ✨ 주요 기능

- **통합 접근성 엔진 (A11yEngine):** 대비, 글자 크기, 간격, 정렬 등 다양한 설정을 상태 기반으로 관리합니다.
- **다양한 환경 지원:** Vanilla JS/TS는 물론, React와 Vue를 위한 전용 어댑터를 제공합니다.
- **자체 스크린 리더:** Web Speech API를 사용하여 포커스된 요소의 텍스트(aria-label, alt 등)를 읽어줍니다.
- **시각적 보조:** 링크 강조, 커서 하이라이트, 스마트 대비 모드 등 강력한 시각 보조 CSS를 포함합니다.

---

## 🚀 설치 및 설정

### 설치

```bash
npm install @gscd/a11y-engine
```

### 스타일 포함

라이브러리에서 제공하는 접근성 스타일을 반드시 불러와야 합니다.

```javascript
// main.ts(js) 또는 index.ts(js) 등 entry 파일에 추가
import "@gscd/a11y-engine/css";
```

---

## 💻 사용 방법

### 1. Vanilla JavaScript / TypeScript

프레임워크 없이 사용할 경우, `a11yEngine` 인스턴스를 직접 구독하고 메서드를 호출합니다.

```typescript
import { a11yEngine } from "@gscd/a11y-engine";

// 상태 변경 구독
a11yEngine.subscribe((state) => {
  console.log("현재 상태:", state);
});

// 설정 변경 액션
const btn = document.getElementById("contrast-btn");
btn.addEventListener("click", () => {
  a11yEngine.cycleContrast(); // 대비 모드 순환
});
```

### 2. React

`useA11y` 훅을 통해 상태와 액션을 쉽게 가져올 수 있습니다.

```tsx
import { useA11y } from "@gscd/a11y-engine/react";

const A11yControl = () => {
  const { state, actions } = useA11y("ko-KR");

  return (
    <button onClick={() => actions.cycleTextSize()}>
      글자 크기 변경 (현재: {state.textSizeLevel})
    </button>
  );
};
```

### 3. Vue

Vue 전용 컴포저블을 지원하며, 반응형 상태를 반환합니다.

```vue
<script setup>
import { useA11y } from "@gscd/a11y-engine/vue";

const { state, actions } = useA11y("ko-KR");
</script>

<template>
  <button @click="actions.toggleScreenReader">
    스크린 리더: {{ state.screenReader ? "ON" : "OFF" }}
  </button>
</template>
```

---

## 🛠 주요 API 및 설정 (A11yState)

| 메서드                  | 설명                         | 관련 상태 값              |
| ----------------------- | ---------------------------- | ------------------------- |
| `cycleContrast()`       | 고대비/저대비/반전 모드 순환 | `contrastLevel` (0~3)     |
| `cycleTextSize()`       | 글자 크기 확대 단계 순환     | `textSizeLevel` (0~2)     |
| `toggleScreenReader()`  | 내장 스크린 리더 활성화 토글 | `screenReader` (boolean)  |
| `toggleSmartContrast()` | 지능형 색상 대비 반전 적용   | `smartContrast` (boolean) |
| `resetAll()`            | 모든 설정을 초기 상태로 리셋 | -                         |

---

## 🤝 Acknowledgments

이 프로젝트는 다음 개발자들의 협업과 초기 프로젝트를 바탕으로 탄생했습니다.

- **Base Code:** [gscd-dev/a11y-market-web](https://github.com/gscd-dev/a11y-market-web)
- **Core Developers:**
  - **[Gravity 251](https://github.com/Gravity251)** (Sumin Kim)
  - **[BlueNyang](https://github.com/BlueNyang)** (GyuTae Ahn)

---

## 📄 라이선스

**MIT License**

See [LICENSE](https://github.com/gscd-dev/a11y-market-web?tab=MIT-1-ov-file#readme) for more information.
