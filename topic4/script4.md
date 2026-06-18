# 코덱스 플러그인 사용과 CLI 코딩 발표 대본

## 발표 기준

- 예상 분량: 약 40분
- 기준 자료: `topic4.html`
- 진행 방식: 30장 기준, 슬라이드당 평균 1분 15초 내외
- 발표 톤: 도구 홍보가 아니라 CLI agent를 안전하게 운영하는 workflow 중심

## 슬라이드별 대본

### 1. 제목

안녕하세요. 이번 발표 주제는 “코덱스 플러그인 사용과 CLI 코딩”입니다.  
오늘은 Codex, Superpowers, Image Gen, Copilot CLI, Claude Code를 개발 workflow 관점에서 비교하겠습니다.

핵심 메시지는 분명합니다. CLI 기반 AI 코딩은 IDE 자동완성과 다릅니다. 터미널에서 agent에게 작업을 위임하고, 그 agent가 파일을 읽고 명령을 실행하며 결과를 다시 반영합니다. 따라서 생산성만큼이나 통제와 검증이 중요합니다.

### 2. 핵심 질문

오늘 다룰 질문은 세 가지입니다.  
첫째, CLI 코딩은 IDE 기반 AI 코딩과 무엇이 다른가.  
둘째, Codex Plugin은 어떤 역할을 하는가.  
셋째, Copilot CLI, Claude Code, Codex CLI는 어떻게 다르게 선택해야 하는가.

오늘 발표의 관점은 “어떤 도구가 무조건 최고인가”가 아닙니다. 팀의 저장소, 권한 체계, 검증 방식, 시각 자산 필요 여부에 따라 적합한 도구가 달라진다는 점을 보겠습니다.

### 3. CLI 코딩 개념

CLI 코딩은 터미널에서 AI agent에게 작업을 지시하는 방식입니다.  
agent는 파일을 탐색하고, 코드를 수정하고, 명령을 실행하고, 테스트 결과를 읽고, 필요하면 다시 수정합니다. 마지막에는 변경 내용과 검증 결과를 요약합니다.

즉 단순히 “다음 줄을 추천해 주는 AI”가 아닙니다. repository를 대상으로 작업을 수행하는 작은 개발자 역할에 가깝습니다. 그래서 지시 범위와 권한 관리가 중요합니다.

### 4. IDE 기반 AI 코딩과 CLI 코딩의 차이

IDE 기반 AI 코딩은 편집 화면 중심입니다. 열린 파일, 선택한 코드, 자동완성, 작은 수정에 강합니다. 개발자가 계속 편집 흐름을 주도합니다.  
반면 CLI 코딩은 repository 작업 중심입니다. agent가 터미널에서 명령을 실행하고, 테스트 실패를 읽고, 여러 파일을 고칠 수 있습니다.

정리하면 IDE AI는 보조 기능에 가깝고, CLI AI는 작업 위임 방식에 가깝습니다. 위임이 커질수록 검증도 커져야 합니다.

### 5. CLI 코딩이 유용한 작업

CLI 코딩은 파일 하나의 문법 수정보다, 실행 결과와 여러 파일이 얽힌 작업에서 유용합니다.  
예를 들어 테스트 실패 원인을 분석하거나, 작은 버그를 고치거나, README의 실행 명령이 실제로 맞는지 확인하는 작업이 있습니다.

또 반복적인 import 변경, 타입 수정, 설정 변경처럼 사람이 하면 지루하지만 규칙이 분명한 작업에도 잘 맞습니다. 마지막으로 변경사항을 리뷰어 관점으로 요약하는 일에도 효과적입니다.

### 6. CLI 코딩의 위험성

하지만 장점만 있는 것은 아닙니다. CLI agent는 파일 삭제나 대량 수정도 할 수 있고, 잘못된 명령을 실행할 수도 있습니다. 외부 서비스와 연결되어 있다면 데이터가 조직 밖으로 나갈 위험도 있습니다.

특히 `.env`, API key, 고객 데이터 같은 민감정보가 prompt나 로그에 들어가면 회수하기 어렵습니다. 또한 테스트가 없으면 그럴듯하지만 잘못된 코드가 반영될 수 있습니다.

CLI 코딩의 핵심은 자동화가 아니라 안전한 자동화입니다.

### 7. 안전한 CLI 코딩 기본 원칙

안전한 CLI 코딩의 기본 원칙은 여섯 가지입니다.  
계획 먼저 요청합니다. 작업을 작게 나눕니다. branch나 worktree로 격리합니다. diff를 확인합니다. 테스트를 실행합니다. 자동 실행 권한을 최소화합니다.

이 원칙을 지키면 agent가 한 일이 사람이 검토 가능한 단위로 남습니다. 반대로 이 원칙이 없으면 agent가 빠르게 만든 변경이 팀의 리스크가 될 수 있습니다.

### 8. Codex 개요

Codex는 OpenAI의 coding agent입니다. 코드 작성, 이해, 리뷰, 디버깅을 돕는 방향으로 설계되어 있고, CLI, IDE extension, Codex app, web 또는 cloud 기반 작업 같은 여러 사용 표면을 가집니다.

중요한 것은 Codex를 하나의 채팅창으로만 보지 않는 것입니다. Codex는 개발자가 사용하는 workflow 전체에 들어갈 수 있는 agent 플랫폼에 가깝습니다.

### 9. Codex CLI

Codex CLI는 터미널에서 실행하는 coding agent입니다.  
자연어로 요청하면 repository를 탐색하고, 파일을 수정하고, 명령을 실행하고, 결과를 요약합니다.

예를 들어 “로그인 실패 테스트를 고치고 원인을 요약해줘”라고 하면, 관련 파일을 찾고, 패치를 만들고, 테스트를 실행한 뒤 결과를 알려주는 흐름이 가능합니다. 이때 중요한 것은 agent가 어떤 명령을 실행했는지, 어떤 파일을 바꿨는지 확인하는 것입니다.

### 10. Codex App

Codex App은 단순 코드 작성 도구라기보다 개발 작업공간에 가깝습니다.  
작업을 나누고, 결과를 검토하고, 브라우저나 이미지 생성 같은 주변 업무까지 같은 흐름에서 다룰 수 있습니다.

프론트엔드 시안, 문서, 게임 asset, UI 이미지처럼 코드 밖 산출물이 함께 필요한 작업에서는 이런 통합 작업공간의 장점이 커집니다.

### 11. Codex IDE Extension

Codex IDE Extension은 에디터 옆에서 Codex를 사용할 수 있게 해줍니다.  
작은 수정이나 선택 영역 설명은 IDE 안에서 처리하는 것이 빠릅니다. 반면 여러 파일에 걸친 수정, 테스트 실행, 실패 로그 반영 같은 작업은 Codex에게 더 큰 단위로 위임할 수 있습니다.

즉 IDE Extension은 로컬 편집 흐름과 agent 작업 흐름을 이어 주는 연결점입니다.

### 12. Codex Plugins 개념

Codex Plugin은 workflow와 외부 연결을 패키징하는 방식입니다.  
plugin은 skills, app integrations, MCP servers, hooks 같은 요소를 묶어 배포 가능한 단위로 만들 수 있습니다.

이것은 개인이 매번 긴 프롬프트를 쓰는 방식에서 벗어나, 팀이 반복적으로 쓰는 작업 절차를 하나의 도구처럼 설치하는 방향입니다.

### 13. Plugin이 필요한 이유

Plugin이 필요한 이유는 반복성을 관리하기 위해서입니다.  
매번 “우리 팀 리뷰 규칙은 이렇고, 테스트는 이렇게 돌리고, 문서는 이런 형식으로 써줘”라고 길게 말하면 비효율적입니다.

plugin이나 skill에 이런 규칙을 넣으면 팀 규칙을 더 일관되게 적용할 수 있습니다. 코드 리뷰, 보안 점검, 문서화, 릴리스 노트 작성 같은 반복 workflow를 표준화할 수 있습니다.

### 14. Codex Skills

Codex Skills는 재사용 가능한 작업 지침입니다.  
Skill은 instruction, resource, 선택적 script를 하나의 디렉터리로 묶습니다. Codex는 처음부터 모든 skill 내용을 읽는 것이 아니라, 이름과 설명을 보고 필요한 경우에만 전체 지침을 로드합니다.

이 구조를 progressive disclosure라고 볼 수 있습니다. context를 절약하면서도, 필요한 순간에는 깊은 절차를 적용할 수 있습니다.

### 15. Codex Hooks

Hooks는 agentic loop에 결정론적인 동작을 추가하는 방식입니다.  
예를 들어 prompt 제출 전에 API key가 포함되어 있는지 검사할 수 있습니다. 명령 실행 전에 위험한 명령인지 확인할 수 있습니다. 작업 종료 시 validation을 실행하거나 요약을 남길 수도 있습니다.

agent가 자율적으로 움직일수록 이런 deterministic guardrail이 중요합니다. AI의 판단에만 맡기지 않고, 필요한 지점에 규칙 기반 검사를 넣는 것입니다.

### 16. MCP와 Codex

MCP, Model Context Protocol은 외부 도구와 agent를 연결하는 표준 방식입니다.  
GitHub, Slack, Google Drive, Notion, cloud service 같은 외부 시스템을 agent가 도구처럼 사용할 수 있게 합니다.

하지만 강력한 만큼 권한 관리가 중요합니다. 읽기 권한과 쓰기 권한을 분리하고, 어떤 데이터가 agent에게 제공되는지 확인해야 합니다. 출처가 불명확한 MCP 서버는 사용하지 않는 것이 안전합니다.

### 17. Superpowers 개요

Superpowers는 agentic coding을 체계화하는 skills framework로 볼 수 있습니다.  
핵심은 AI가 바로 코딩으로 뛰어들지 않게 만드는 것입니다. 먼저 brainstorming하고, 계획을 세우고, worktree로 격리하고, 실행하고, 리뷰하는 흐름을 강화합니다.

즉 AI에게 더 강한 권한을 주는 것이 아니라, 더 좋은 개발 습관을 따르게 하는 접근입니다.

### 18. Superpowers Workflow

Superpowers workflow는 brainstorming, writing plans, git worktree, subagent-driven development, executing plans, review로 이어집니다.

이 흐름은 사람이 하던 좋은 개발 절차와 비슷합니다. 문제를 정리하고, 계획을 만들고, 격리된 공간에서 작업하고, 결과를 검토합니다. agent도 이 절차를 따르면 성급한 구현을 줄일 수 있습니다.

### 19. Superpowers의 의미

Superpowers의 의미는 AI에게 개발 방법론을 설치하는 것입니다.  
요구사항이 모호한데 바로 파일을 수정하는 agent는 위험합니다. 먼저 질문하고, 계획하고, 변경 범위를 통제해야 합니다.

특히 worktree와 계획 문서가 있으면 작업이 다른 변경과 섞이는 위험이 줄어듭니다. 그리고 리뷰 가능한 결과가 남습니다.

### 20. Image Gen 개념

Image Gen은 Codex workflow 안에서 이미지 생성과 편집을 사용하는 방식입니다.  
UI mockup, frontend 시안, 게임 asset, 제품 콘셉트 이미지, placeholder art 같은 시각 자산을 코드 작업과 함께 반복할 수 있습니다.

중요한 것은 단순히 그림을 만드는 것이 아니라, 개발 workflow 안에서 시각 자산까지 함께 다룬다는 점입니다.

### 21. Image Gen 활용 방향

Image Gen은 디자인 방향 탐색에 유용합니다. 여러 스타일을 빠르게 비교하고, UI 배경이나 asset 후보를 만들 수 있습니다.  
프로토타입에서는 이미지 검색, 다운로드, 경로 정리 시간을 줄여 줍니다.

다만 최종 결과는 사람이 검토해야 합니다. 브랜드 적합성, 저작권, 접근성, 제품 맥락은 자동 생성만으로 판단할 수 없습니다.

### 22. GitHub Copilot CLI

GitHub Copilot CLI는 GitHub workflow와 가까운 터미널 agent입니다.  
GitHub issue, branch, pull request 중심으로 일하는 팀이라면 자연스럽게 연결될 수 있습니다.

중요한 운영 포인트는 plan mode로 먼저 접근 방식을 확인하고, 더 자율적인 실행은 작은 범위에서 사용하는 것입니다. 최종 검증은 PR 리뷰와 CI 결과를 기준으로 해야 합니다.

### 23. Claude Code

Claude Code는 Anthropic의 터미널 중심 agentic coding tool입니다.  
코드베이스를 탐색하고, 파일을 수정하고, 명령을 실행하고, git workflow와 함께 사용할 수 있습니다.

긴 작업 단위, 예를 들어 “원인 분석, 수정, 테스트, 요약”이 이어지는 흐름에 잘 맞습니다. 다만 자율성이 높을수록 권한과 승인 정책을 명확히 해야 합니다.

### 24. Claude Code 확장 요소

Claude Code도 프로젝트 지침과 확장 요소를 제공합니다.  
`CLAUDE.md`는 프로젝트별 규칙과 명령을 정리하는 데 사용됩니다. Skills는 반복 작업 절차를 재사용하게 해주고, subagents는 역할을 나누는 데 쓰입니다.

Hooks, MCP, plugins도 workflow 확장 요소입니다. 즉 Codex만 확장 가능한 것이 아니라, 주요 agent 도구들이 모두 “도구 + 규칙 + 외부 연결” 방향으로 발전하고 있습니다.

### 25. 세 도구 비교

Codex CLI, Copilot CLI, Claude Code는 우열 관계로 보기보다 사용 위치와 강점으로 봐야 합니다.  
Codex CLI는 OpenAI ecosystem, plugin, skill, hook, MCP, Image Gen과의 연결성이 장점입니다.  
Copilot CLI는 GitHub issue, branch, PR 흐름과 잘 맞습니다.  
Claude Code는 terminal-first agentic workflow, hooks, subagents 활용에 강점이 있습니다.

도구 선택은 결국 팀의 workflow 선택입니다.

### 26. 도구 선택 기준

GitHub 중심이면 Copilot CLI가 자연스럽습니다.  
Codex App과 plugin ecosystem, Image Gen까지 함께 쓰려면 Codex가 적합합니다.  
터미널에서 긴 agent 작업과 hooks를 적극적으로 쓰려면 Claude Code가 좋은 선택지가 될 수 있습니다.

중요한 것은 도구 하나로 모든 상황을 해결하려 하지 않는 것입니다. 작업 성격에 따라 적절한 도구를 선택해야 합니다.

### 27. CLI 코딩 운영 전략

CLI 코딩을 운영하려면 몇 가지 원칙이 필요합니다.  
바로 수정하지 않고 계획을 먼저 받습니다. 작업 범위를 명확히 합니다. branch나 worktree로 격리합니다. 테스트 명령을 명시합니다. 변경사항 요약을 요구합니다. 불필요한 권한을 차단합니다.

이 전략은 agent를 못 믿어서가 아니라, agent가 한 일을 팀이 검토할 수 있게 만들기 위한 것입니다.

### 28. 보안 주의사항

보안 측면에서는 API key를 prompt에 넣지 않는 것이 기본입니다. `.env` 파일, 고객 데이터, 내부 URL, 배포 권한도 주의해야 합니다.

MCP 서버는 반드시 출처를 확인해야 하고, 자동 배포 명령이나 파일 삭제 명령은 수동 승인 경로를 둬야 합니다. CLI agent는 강력하기 때문에 기본값은 보수적으로 잡는 것이 맞습니다.

### 29. 결론

정리하겠습니다. CLI 코딩은 터미널에서 agent에게 repository 작업을 위임하는 방식입니다.  
Codex는 plugin, skill, hook, MCP, Image Gen으로 개발 workflow 전체를 확장합니다.  
Copilot CLI, Claude Code, Codex CLI는 목적과 강점이 다릅니다.

하지만 가장 중요한 것은 도구 선택 자체가 아닙니다. 계획, 검증, 권한 관리가 포함된 운영 방식이 핵심입니다.

### 30. 마무리

마지막 문장으로 마무리하겠습니다.  
CLI 기반 AI 코딩의 핵심은 AI가 명령을 실행할 수 있다는 점이 아닙니다. 그 실행을 사람이 통제하고 검증할 수 있는 workflow를 만드는 것입니다.

AI agent는 앞으로 더 강력해질 것입니다. 그래서 우리는 더 강력한 통제 구조, 더 명확한 변경 단위, 더 좋은 검증 습관을 만들어야 합니다. 감사합니다.
