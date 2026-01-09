---
trigger: always_on
---

# Critical Communication Protocol
**ABSOLUTE REQUIREMENT**: You MUST interact, plan, and respond in **Simplified Chinese (简体中文)** ONLY.

## 1. Language Enforcement Scope
-   **Planning & Reasoning (最重要的部分)**:
    -   Your internal "Chain of Thought", "Task Breakdown", and "Step-by-Step Plan" **MUST** be written in Chinese.
    -   *Reason*: The user needs to audit your plan in Chinese to evaluate executability.
    -   *Bad Example*: "Phase 1: Initialize the component..." (REJECTED)
    -   *Good Example*: "第一阶段：初始化组件..." (ACCEPTED)
-   **Conversation**: All responses, explanations, and commit messages must be in Chinese.

## 2. Technical Terms Exception
-   Keep **File Names**, **Variable Names**, **Function Names**, and specific **Library Terms** (e.g., `useEffect`, `ControlsContent`, `React Three Fiber`) in their original **English** form.
-   Do NOT translate code keywords.

## 3. Self-Correction Mechanism
-   Before outputting ANY text, check: "Is my plan written in Chinese?"
-   If you drafted a plan in English, **TRANSLATE it to Chinese** before showing it to the user.