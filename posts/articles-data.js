// 기술 포스트 데이터 (index.html 과 posts/article.html 에서 공동 참조)
const techArticles = [
    {
        id: 5,
        title: "tPay NFC Android/iOS SDK를 10분 만에 연동하여 승인 결제 처리하는 방법",
        category: "sw",
        categoryKo: "S/W & 결제 플랫폼",
        badgeClass: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-sky-300 border border-blue-200 dark:border-blue-900",
        author: "김준우 수석연구원 (TPay 핀테크팀)",
        date: "2026.06.12",
        readTime: "읽는 시간 10분",
        summary: "모바일 단말기 및 리더기 장치를 활용하여 터치 결제를 도입해야 하는 앱 연동 엔지니어를 위해, 최신 tPay SDK 세팅부터 비접촉 EMV 리더 연동, 오프라인 큐 처리까지 실무 코드를 위주로 기술합니다.",
        tags: ["NFC", "tPay", "AndroidSDK", "iOS", "API"],
        content: `
            <h3>들어가며: 모바일 핀테크 연동의 고충</h3>
            <p>기존의 모바일 임베디드 결제 모듈 연동은 리더기의 장치 직렬 제어 프로토콜(RS-232, USB Serial) 및 암호화 인증 키 교환 방식의 복잡함으로 인해 높은 초기 장벽이 있었습니다. <strong>tPay NFC SDK</strong>는 이러한 과정을 추상화하여, 모바일 개발자가 단 몇 줄의 단순 메서드 호출만으로 카드 결제 승인 신호를 수신하고 처리할 수 있게 설계되었습니다.</p>

            <div class="my-6 p-4 bg-slate-100 dark:bg-slate-900 rounded-xl border-l-4 border-sky-400">
                <strong>핵심 요구 사양</strong><br>
                - iOS: Swift 5.5 이상, iOS 14 이상 필수 (CoreNFC 프레임워크 허용 모델)<br>
                - Android: Kotlin 1.6 이상, SDK Level 24 (Nougat) 이상 지원
            </div>

            <h3>1단계: SDK 라이브러리 디펜던시 추가</h3>
            <p>Android 스튜디오 프로젝트의 <code>build.gradle.kts</code> (Module 레벨) 파일에 아래 원격 Maven 저장소 주소와 라이브러리 참조를 선언합니다.</p>
            <pre class="bg-slate-950 p-4 rounded-lg text-slate-300 font-mono text-xs"><code>dependencies {
    implementation("com.tpay.nfc:sdk-core:4.0.2")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.6.4")
}</code></pre>

            <h3>2단계: 결제 클라이언트 설정 및 리스너 등록</h3>
            <p>애플리케이션 컨텍스트를 주입하고 가맹점 식별 ID를 지정하여 클라이언트를 생성합니다. 이후 NFC Tag 수집 이벤트를 처리할 리스너를 실행해 줍니다.</p>
            <pre class="bg-slate-950 p-4 rounded-lg text-slate-300 font-mono text-xs"><code>val tpayClient = TPayClient.Builder()
    .setMerchantId("TIT_MERCHANT_ID")
    .setSecureMode(true) // AES-256 종단간 데이터 보안 모드 활성화
    .build(context)

// NFC 센서 상시 감지 상태로 전환
tpayClient.enableNfcSensor(activity) { tagState ->
    when(tagState) {
        TagState.DETECTED -> showLoadingIndicator()
        TagState.READ_SUCCESS -> playBeepSound()
        TagState.FAILURE -> handleError()
    }
}</code></pre>

            <h3>오프라인 처리 및 오류 복구 메커니즘</h3>
            <p>결제 도중 일시적인 LTE/5G 신호 유실 등의 불안정한 상황에서도 결제 전문의 무결성을 유지하기 위해 SDK 내부에 오프라인 트랜잭션 큐 알고리즘을 적용했습니다. 네트워크 순시 탈락 시 승인 대기 데이터는 안전한 메모리 내 큐 구조(AES 암호화 상태)로 보관되며, 가용한 네트워크 연결이 다시 감지될 때까지 최대 5회 자동 재시도($\text{Retry Interval} = 2.0\text{sec}$)를 수행합니다.</p>
        `
    },
    {
        id: 2,
        title: "NFC 리더기 통신 성능 향상을 위한 안테나 매칭 및 RF 튜닝 가이드",
        category: "hw",
        categoryKo: "H/W 엔지니어링",
        badgeClass: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-900",
        author: "박동현 책임연구원 (임베디드 하드웨어 Lab)",
        date: "2026.06.05",
        readTime: "읽는 시간 12분",
        summary: "TITeng SRT1356 등 NFC 리더 탑재 모델의 신뢰성 높은 터치 거리를 보장하기 위한 13.56MHz 공진 회로 안테나 임피던스 매칭 기법을 실무 매칭 그래프와 수식으로 풀어냅니다.",
        tags: ["NFC", "SRT1356", "Hardware", "RF_Tuning", "Antenna"],
        content: `
            <h3>RF 튜닝의 목표: $13.56\text{MHz}$ 공진 특성 최적화</h3>
            <p>무선 무인단말기 및 카드 리더에서 NFC 결제 인식 범위 및 속도가 떨어진다면 이는 대부분 RF 프런트엔드 회로의 임피던스 불일치(Mismatch) 때문입니다. 본 가이드에서는 ISO/IEC 14443 표준 규격을 만족하면서 최적의 에너지 효율을 내는 $50\,\Omega$ 종단 임피던스 매칭 과정을 상세히 기술합니다.</p>

            <h3>1. 하드웨어 안테나 등가 모델 설계</h3>
            <p>리더 전송단에서 나가는 에너지가 반사 손실(Return Loss) 없이 공진 안테나로 전달되기 위해서 LC 필터단 소자 용량을 설계해야 합니다. 안테나 코일의 자체 인덕턴스를 $L_{ant}$, 등가 직렬 저항을 $R_{ant}$라고 할 때, 공진 주파수 수식은 아래와 같습니다.</p>

            <div class="my-6 p-4 bg-slate-100 dark:bg-slate-900 rounded-xl text-center text-lg font-mono">
                $f_r = \frac{1}{2\pi \sqrt{L_{ant} \cdot (C_1 + C_2)}}$
            </div>

            <h3>2. 스미스차트를 이용한 임피던스 매칭 디버깅</h3>
            <p>회로 기판 제작 후 네트워크 분석기(Vector Network Analyzer)를 장치의 안테나 매칭 포인트 단자에 연결하여 위 수치에 알맞게 정합되고 있는지 스미스차트 궤적을 확인해야 합니다. 실장 기판에서는 배선 저항 및 기생 커패시턴스로 인해 고주파 공진 점이 어긋날 수 있으므로 가변 매칭 커패시터를 사용해 스미스차트 중심점으로 궤적을 튜닝하는 절차가 필수적입니다.</p>

            <div class="my-6 p-4 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                <strong>RF 엔지니어 노트</strong><br>
                금속 프레임이 내장된 무인 키오스크 함체에 리더기 모듈을 이식할 경우 자성 유도로 인해 공진점이 감쇄되는 현상이 일어납니다. TITeng 연구진은 기기 장착 시 주변 도체 간섭을 방지할 수 있는 페라이트 흡수 시트(Ferrite Shield Sheet)를 안테나 배면에 부착하는 솔루션을 권장합니다.
            </div>
        `
    },
    {
        id: 3,
        title: "EMV L1/L2 신용 결제 단말기 보안 검증 프로세스 및 디버깅 팁",
        category: "security",
        categoryKo: "보안 및 인증 규격",
        badgeClass: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900",
        author: "한승우 수석연구원 (금융보안기술 파트)",
        date: "2026.05.28",
        readTime: "읽는 시간 15분",
        summary: "글로벌 신용카드 보안 규격인 EMV(Europay, Mastercard, Visa) 인증 과정에서 빈번히 마주치는 오류 패턴과 이를 우회하기 위한 데이터 프로토콜 파싱 및 분석 방식을 제공합니다.",
        tags: ["EMV", "Contactless", "Security", "Protocol", "IC_Card"],
        content: `
            <h3>EMV 인증이란?</h3>
            <p>EMV 국제 표준 규격은 IC카드 및 무접촉 비접촉식 단말기 간 원활한 상호 호환성과 철저한 해킹 위변조 방지를 위해 설계된 글로벌 보안 표준입니다. <strong>Level 1 (물리적/RF 신호 적합성)</strong> 및 <strong>Level 2 (애플리케이션 레이어 데이터 분석 프로토콜 정합성)</strong> 검증 과정은 까다롭고 절차가 긴 것이 특징입니다.</p>

            <h3>L2 데이터 파싱 및 APDU 트랜잭션 예시</h3>
            <p>EMV IC 리더기가 카드를 읽으면 ISO 7816 규격에 근거해 APDU (Application Protocol Data Unit) 커맨드가 오고 갑니다. 아래는 선택(Select) 커맨드를 처리하여 응답 데이터를 디코딩하는 핵심 로그입니다.</p>

            <pre class="bg-slate-950 p-4 rounded-lg text-slate-300 font-mono text-xs"><code>// Command APDU (Select AID)
--> 00 A4 04 00 07 A0 00 00 00 03 10 10 (Visa AID)

// Response APDU (Success response with FCI template)
&lt;-- 6F 23 84 07 A0 00 00 00 03 10 10 A5 18 50 0A 56 49 53 41 20 44 45 42 49 54 9F 38 03 9F 1A 02 90 00</code></pre>

            <p>응답 로그 중 <code>90 00</code>은 성공 코드를 지칭합니다. 태그 데이터 블록 구조인 <strong>TLV(Tag-Length-Value)</strong> 규칙을 기반으로, <code>9F 38</code> 태그 정보는 단말기 내부에서 처리할 거래 프로필 및 보안 데이터 한도를 결정하므로, 파서 설계 시 예외 처리에 극도로 유념해야 합니다.</p>
        `
    },
    {
        id: 4,
        title: "재전사식 카드 프린터 'nuvia'의 고정밀 모터 제어 및 발열량 수명 유지 알고리즘",
        category: "hw",
        categoryKo: "H/W 엔지니어링",
        badgeClass: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-900",
        author: "최재석 책임엔지니어 (메카트로닉스 연구소)",
        date: "2026.05.15",
        readTime: "읽는 시간 8분",
        summary: "고품질 신분증 및 결제 카드를 인쇄하는 재전사 카드프린터 nuvia 모델의 열전사 헤드(TPH) 온도 제어 기술과 이를 통한 모터 정밀 피치 주행 알고리즘을 다룹니다.",
        tags: ["CardPrinter", "Nuvia", "MotorControl", "Embedded", "TPH"],
        content: `
            <h3>재전사 정밀 인쇄 기구부의 과제</h3>
            <p>재전사 카드 프린터 <strong>nuvia</strong>는 리본에 새겨진 잉크를 1차 전사 필름에 열로 증착한 후, 이 필름을 카드에 다시 압착 가열하여 완벽히 전사하는 고도의 기계/전자 융합 임베디드 기기입니다. 200도가 넘는 고온 조건에서 마이크로 단위의 필름 변형을 억제하면서 완벽한 색상 정렬(Color Registration)을 구현하기 위한 모터 변속 특성 기법을 제공합니다.</p>

            <h3>스텝 모터의 가감속(S-Curve) 궤적 제어</h3>
            <p>인쇄 속도가 급속하게 바뀔 때 필름이 이탈하거나 울어버리는 인쇄 불량 현상을 억제하기 위해, 모터 구동 펄스의 주기를 일정하게 바꾸는 대신 주파수 변화율의 미분을 한 단계 더 거친 <strong>S-Curve 가감속 알고리즘</strong>을 구현하여 기계적인 잔류 진동과 인장력 변동을 대폭 완화시켰습니다.</p>
        `
    },
    {
        id: 1,
        title: "TITeng 연구소의 Git 기반 협업 및 무결성 CI/CD 파이프라인 정착 과정",
        category: "culture",
        categoryKo: "엔지니어링 문화",
        badgeClass: "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-900",
        author: "황태준 팀장 (R&D DevOps 엔지니어)",
        date: "2026.05.02",
        readTime: "읽는 시간 9분",
        summary: "제조 기반 기업에서 전통적인 펌웨어 소스 관리 모델을 탈피하여, 자동화 빌드 파이프라인 및 가상 시뮬레이터 테스트 코드를 활용해 제품 개발 기간을 단축한 실무 혁신기를 전달합니다.",
        tags: ["DevOps", "CI_CD", "Git", "EmbeddedSimulator", "Culture"],
        content: `
            <h3>전통 임베디드 펌웨어 관리의 문제점 해결</h3>
            <p>기존 하드웨어 개발 연구실에서는 펌웨어 개발 완료 후 디바이스가 연결된 실물 기판에 직접 JTAG을 꽂고 일일이 전원을 켜서 테스트하는 수동 디버깅 방식이 대다수였습니다. TITeng 소프트웨어 개발실은 하드웨어 종속성을 추상화하는 가상 기기 가상화(Mock Board)를 구축하고 Git 저장소의 커밋 발생 시 빌드가 유효한지 검증하는 CI/CD 테스트 환경을 이식했습니다.</p>

            <h3>효과 및 미래 비전</h3>
            <p>이를 통해 실제 배포 이전에 일어날 수 있는 메모리 누수(OOM), 변수 오버플로우 등의 사소한 버그를 사전에 85% 이상 정적 분석 단계에서 스크리닝할 수 있게 되었습니다. 펌웨어 배포 역시 클라우드 저장소를 거쳐 파트너 개발자가 드라이버 다운로드 센터에서 실시간으로 받도록 파이프라인을 완전히 연동 통합하였습니다.</p>
        `
    },
    {
        id: 16,
        title: "AI 시대의 Git 활용법 with VSCode",
        category: "report",
        categoryKo: "기술 리포트",
        badgeClass: "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border border-sky-200 dark:border-sky-900",
        author: "성현진 엔지니어 (모듈개발팀)",
        date: "2026.06.18",
        readTime: "읽는 시간 10분",
        summary: "AI가 만든 코드 변경을 Git diff, stage, commit, branch, PR 흐름으로 검토하고 설명하는 Git 실무 리포트입니다. VSCode Source Control 기준의 작업 루틴을 한 번에 정리했습니다.",
        tags: ["Git", "VSCode", "AI", "Diff", "DevWorkflow"],
        content: `
            <h3>Git이 하는 일</h3>
            <p>Git은 단순 백업 도구가 아니라 코드가 언제, 왜, 어떻게 바뀌었는지 기록하는 버전 관리 도구입니다. AI가 코드를 빠르게 바꾸는 환경에서는 결과물을 바로 믿기보다 변경 이력을 작게 나누고, diff를 읽고, 필요한 것만 반영하는 기준점 역할을 합니다.</p>

            <h3>핵심 개념</h3>
            <ul>
                <li><strong>Repository</strong>: 프로젝트의 이력 전체를 저장하는 저장소입니다.</li>
                <li><strong>Working Tree</strong>: 현재 편집 중인 실제 파일 상태입니다.</li>
                <li><strong>Staging Area</strong>: 이번 커밋에 담을 변경을 고르는 임시 영역입니다.</li>
                <li><strong>Commit</strong>: 선택된 변경을 설명 가능한 단위로 저장한 스냅샷입니다.</li>
                <li><strong>Branch</strong>: 실험이나 기능 작업을 main과 분리하는 작업 공간입니다.</li>
            </ul>

            <h3>자주 보는 상태값</h3>
            <ul>
                <li><strong>M: Modified</strong>: Git이 추적 중인 파일이 수정된 상태입니다.</li>
                <li><strong>U: Untracked</strong>: 새 파일이 생겼지만 아직 Git이 추적하지 않는 상태입니다.</li>
                <li><strong>A: Added</strong>: 새 파일이 stage되어 커밋 후보에 올라간 상태입니다.</li>
                <li><strong>D: Deleted</strong>: 추적 중이던 파일이 삭제된 상태입니다.</li>
            </ul>

            <h3>기본 작업 흐름</h3>
            <ol>
                <li>먼저 <code>git status</code>로 현재 작업 상태를 확인합니다.</li>
                <li><code>git diff</code>로 실제로 어떤 줄이 바뀌었는지 읽습니다.</li>
                <li><code>git add</code>로 이번 커밋에 담을 변경만 골라 stage합니다.</li>
                <li><code>git commit</code>으로 의도가 드러나는 메시지를 남깁니다.</li>
                <li>실험성 작업은 새 브랜치에서 진행하고, 협업 전에는 PR 설명으로 정리합니다.</li>
            </ol>

            <h3>기본 명령어 모음</h3>
            <pre class="bg-slate-950 p-4 rounded-lg text-slate-300 font-mono text-xs"><code>git status
git diff
git add .
git add path/to/file
git commit -m "fix: 로그인 오류 메시지 수정"
git log --oneline --decorate --graph
git switch -c feature/login-error-message
git branch
git restore path/to/file
git revert &lt;commit-hash&gt;</code></pre>

            <h3>명령어를 언제 쓰는가</h3>
            <ul>
                <li><code>git status</code>: 지금 어떤 파일이 바뀌었는지 확인할 때 사용합니다.</li>
                <li><code>git diff</code>: 추가된 코드보다 삭제된 코드까지 함께 읽어야 할 때 사용합니다.</li>
                <li><code>git add</code>: 변경 전체가 아니라 이번 커밋에 담을 범위를 선택할 때 사용합니다.</li>
                <li><code>git commit -m</code>: 변경 이유가 보이는 단위로 저장할 때 사용합니다.</li>
                <li><code>git switch -c</code>: main을 건드리지 않고 기능이나 실험 브랜치를 만들 때 사용합니다.</li>
                <li><code>git log --oneline</code>: 최근 커밋 흐름을 짧게 확인할 때 사용합니다.</li>
                <li><code>git restore</code>: 아직 커밋하지 않은 파일 변경을 되돌릴 때 사용합니다.</li>
                <li><code>git revert</code>: 이미 기록된 커밋을 취소하는 새 커밋을 만들 때 사용합니다.</li>
            </ul>

            <h3>VSCode에서 같이 보면 좋은 화면</h3>
            <p>Source Control 패널은 파일 목록을 보고, diff 화면은 줄 단위 변경을 읽고, stage는 커밋 범위를 정하는 역할을 합니다. AI가 한 번에 많은 파일을 바꿨다면 VSCode에서 파일 목록과 diff를 먼저 확인한 뒤 명령어를 쓰는 편이 안전합니다.</p>

            <h3>실무 체크리스트</h3>
            <ul>
                <li>AI에게 큰 요청을 하기 전에 작업 디렉터리를 깨끗하게 유지합니다.</li>
                <li>커밋 전에는 새 파일과 삭제 파일을 더 엄격하게 확인합니다.</li>
                <li>커밋 메시지는 <code>update</code>보다 어떤 문제를 왜 고쳤는지가 드러나야 합니다.</li>
                <li>되돌릴 가능성이 있는 작업일수록 브랜치와 작은 커밋 단위가 중요합니다.</li>
            </ul>

            <a href="../topic2/topic2.html" target="_blank" rel="noopener noreferrer" class="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-black text-white transition hover:bg-primary-700">
                <span>슬라이드 열기</span>
                <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i>
            </a>
        `
    },
    {
        id: 17,
        title: "Google Antigravity IDE: 에이전트 중심 개발의 실제",
        category: "report",
        categoryKo: "기술 리포트",
        badgeClass: "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border border-sky-200 dark:border-sky-900",
        author: "성현진 엔지니어 (모듈개발팀)",
        date: "2026.06.18",
        readTime: "읽는 시간 10분",
        summary: "Google Antigravity IDE의 Agent Manager, Artifacts, 브라우저 검증 기능과 실무 사용 흐름을 살펴보고, 최신 VS Code의 에이전트 기능과 차이 및 도구 선택 기준을 정리합니다.",
        tags: ["AI Coding", "Antigravity", "Agent Manager", "Artifacts", "VS Code"],
        content: `
            <h3>리포트 개요</h3>
            <p>Google Antigravity IDE는 개발자가 모든 코드를 직접 입력하는 방식에서 벗어나, 목표와 완료 기준을 정의하고 여러 에이전트의 작업 과정과 검증 근거를 관리하는 에이전트 중심 개발 환경입니다. 이 리포트는 Antigravity의 핵심 기능과 실제 사용 흐름을 살펴보고, 최신 Visual Studio Code의 에이전트 기능과 무엇이 다른지 공정하게 비교합니다.</p>

            <h3>Antigravity IDE란 무엇인가</h3>
            <ul>
                <li>Google이 제공하는 에이전트 중심 개발 플랫폼의 IDE 제품입니다.</li>
                <li>코드 편집기와 함께 Agent Manager, Artifacts, 코드베이스 이해 기능을 통합합니다.</li>
                <li>에이전트가 편집기, 터미널, 브라우저를 사용해 계획·구현·검증을 수행합니다.</li>
                <li>Antigravity 플랫폼에는 CLI와 SDK도 있지만, 여기서는 IDE 작업 경험에 집중합니다.</li>
            </ul>

            <h3>세 가지 핵심 특징</h3>
            <ul>
                <li><strong>Agent Manager</strong>: 여러 작업 공간과 에이전트의 상태를 한 화면에서 관리합니다. 독립적인 작업은 병렬로 맡기고, 필요한 순간 Editor View로 전환해 직접 개입할 수 있습니다.</li>
                <li><strong>Artifacts</strong>: 계획, 작업 목록, 변경 결과, 테스트 결과, 스크린샷과 영상 같은 검증 근거를 남깁니다. 정확성을 보장하는 기능이 아니라 사람이 판단할 수 있도록 관찰 가능성을 높이는 장치입니다.</li>
                <li><strong>브라우저 검증과 시각적 피드백</strong>: 에이전트가 Chrome에서 페이지를 탐색하고 상호작용하며 결과를 검증합니다. Visual Artifact의 특정 위치에 코멘트를 남겨 수정 범위를 구체적으로 전달할 수 있습니다.</li>
            </ul>

            <h3>설치 후 첫 작업 흐름</h3>
            <ol>
                <li>공식 페이지에서 운영체제에 맞는 IDE를 설치하고 계정 또는 조직 인증으로 로그인합니다.</li>
                <li>프로젝트를 연 뒤 Agent Permissions, Secure Mode, Sandbox 관련 설정을 확인합니다.</li>
                <li>목표, 파일 범위, 제약조건, 완료 기준, 검증 방법이 포함된 요청을 작성합니다.</li>
                <li>에이전트가 만든 Plan Artifact와 권한 요청을 검토한 뒤 구현을 승인합니다.</li>
                <li>변경 diff, 테스트 결과, 브라우저 검증 Artifact를 확인하고 구체적으로 피드백합니다.</li>
                <li>사람이 최종 테스트와 Git 상태를 확인한 뒤 커밋 또는 PR 단계로 넘깁니다.</li>
            </ol>

            <h3>최신 VS Code와의 차이</h3>
            <p>최신 VS Code 역시 Agents window와 Chat view를 통해 계획, 여러 파일 편집, 명령 실행, 테스트와 자기 수정이 가능한 에이전트형 개발을 지원합니다. 따라서 두 도구의 차이는 에이전트 기능의 가능 여부보다 기본 작업 철학과 생태계에서 찾아야 합니다.</p>
            <ul>
                <li><strong>Antigravity IDE</strong>: Agent Manager, Artifacts, 브라우저 사용과 시각적 피드백을 전면에 둔 에이전트 관제·검증 중심 환경입니다.</li>
                <li><strong>VS Code</strong>: 범용 편집기에 에이전트 기능을 통합하며, 확장 마켓과 언어·디버깅 도구, 다양한 모델 및 에이전트 선택 폭이 강점입니다.</li>
                <li>두 도구 모두 권한 제어, 컨텍스트 관리, diff와 테스트 결과에 대한 사람의 검토가 필요합니다.</li>
            </ul>

            <h3>어떤 도구를 선택할 것인가</h3>
            <p>병렬 에이전트 작업, Artifact 기반 리뷰, 웹·풀스택의 브라우저 검증을 기본 흐름으로 사용하려면 Antigravity가 잘 맞습니다. 기존 확장, 디버거, Dev Container, 조직 표준과 폭넓은 도구 선택이 중요하다면 VS Code가 적합합니다. 실제 도입 전에는 작은 과제를 두 도구에서 동일한 완료 기준으로 수행해 품질, 시간, 검토 부담을 함께 측정하는 것이 좋습니다.</p>

            <h3>결론</h3>
            <p>에이전트 중심 개발에서 중요한 능력은 코드를 더 빨리 생성하는 것이 아니라, 작업을 작게 분해하고 최소 권한을 설정하며 에이전트가 남긴 증거를 검토하는 능력입니다. 도구의 우열보다 팀의 저장소, 보안 정책, 리뷰 방식에 맞는 기본 작업 흐름을 선택해야 합니다.</p>

            <a href="../topic3/topic3.html" target="_blank" rel="noopener noreferrer" class="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-black text-white transition hover:bg-primary-700">
                <span>슬라이드 열기</span>
                <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i>
            </a>
        `
    },
    {
        id: 18,
        title: "코덱스 플러그인 사용과 CLI 코딩",
        category: "report",
        categoryKo: "기술 리포트",
        badgeClass: "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border border-sky-200 dark:border-sky-900",
        author: "성현진 엔지니어 (모듈개발팀)",
        date: "2026.06.18",
        readTime: "읽는 시간 20분",
        summary: "Codex Plugins, Skills, Hooks, MCP, Image Gen을 중심으로 CLI 기반 AI 코딩 workflow와 Copilot CLI, Claude Code, Codex CLI의 선택 기준을 정리한 기술 리포트입니다.",
        tags: ["Codex", "CLI Coding", "Plugins", "MCP", "Claude Code", "Copilot CLI"],
        content: `
            <h3>리포트 개요</h3>
            <p>이 리포트는 CLI 기반 AI 코딩이 IDE 자동완성과 어떻게 다른지, 그리고 Codex가 plugin, skill, hook, MCP, Image Gen을 통해 개발 workflow 전체로 확장되는 방식을 정리합니다. 핵심은 AI가 코드를 제안하는 단계를 넘어, 터미널에서 repository 작업을 위임받고 사람이 검증 가능한 형태로 결과를 돌려주는 흐름입니다.</p>

            <h3>핵심 질문</h3>
            <ul>
                <li>CLI 코딩은 IDE 기반 AI 코딩과 무엇이 다른가</li>
                <li>Codex Plugin은 반복 workflow와 외부 연결을 어떻게 패키징하는가</li>
                <li>Skills, Hooks, MCP는 각각 어떤 역할을 맡는가</li>
                <li>Copilot CLI, Claude Code, Codex CLI는 어떤 상황에서 선택해야 하는가</li>
            </ul>

            <h3>주요 내용</h3>
            <ul>
                <li><strong>CLI 코딩 개념</strong>: 터미널에서 agent에게 파일 탐색, 코드 수정, 명령 실행, 테스트 실행, 결과 요약을 맡기는 방식입니다.</li>
                <li><strong>Codex 확장 구조</strong>: Plugin은 skill, app integration, MCP server, hook 같은 요소를 묶어 팀 단위 workflow로 배포하는 단위입니다.</li>
                <li><strong>Superpowers</strong>: agent가 바로 구현하지 않고 brainstorming, planning, worktree, execution, review 흐름을 따르도록 돕는 접근입니다.</li>
                <li><strong>Image Gen</strong>: UI mockup, frontend asset, game asset, 제품 콘셉트 이미지를 코드 workflow 안에서 함께 반복하는 방식입니다.</li>
                <li><strong>CLI 도구 비교</strong>: Codex CLI, Copilot CLI, Claude Code는 우열보다 사용 위치와 조직 workflow 적합성으로 비교해야 합니다.</li>
            </ul>

            <h3>실무 관점 포인트</h3>
            <ul>
                <li>CLI agent에게 바로 수정시키기보다 먼저 계획과 변경 범위를 요청해야 합니다.</li>
                <li>branch 또는 worktree로 작업을 격리하고, diff와 테스트 결과를 검토 기준으로 삼아야 합니다.</li>
                <li>MCP와 plugin은 강력하지만 외부 서비스 접근, 민감정보 노출, 자동 실행 권한을 함께 관리해야 합니다.</li>
                <li>도구 선택보다 중요한 것은 계획, 검증, 권한 관리가 포함된 운영 workflow입니다.</li>
            </ul>

            <a href="../topic4/topic4.html" target="_blank" rel="noopener noreferrer" class="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-black text-white transition hover:bg-primary-700">
                <span>슬라이드 열기</span>
                <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i>
            </a>
        `
    },
    {
        id: 20,
        title: "Visa Kernel 3: EMV Contactless Book C-3 거래 흐름 완전 분석",
        category: "security",
        categoryKo: "보안 및 인증 규격",
        badgeClass: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900",
        author: "성현진 연구원 (모듈개발팀)",
        date: "2026.06.25",
        readTime: "읽는 시간 20분",
        summary: "Visa Kernel 3(qVSDC) 비접촉 거래의 전체 흐름을 처음부터 끝까지 분석합니다. TTQ, CTQ, GPO, fDDA, Outcome 개념과 실제 펌웨어 코드(EMV_PROC.C, NFC_Control.c)의 연결점을 함께 살펴봅니다.",
        tags: ["Visa", "Kernel3", "qVSDC", "EMV", "Contactless", "TTQ", "CTQ", "fDDA"],
        content: `
            <h3>Visa Kernel 3란</h3>
            <p>Kernel 3는 Visa contactless 거래에서 리더가 카드 응답을 해석하고 다음 동작을 결정하는 L2 로직입니다. qVSDC 처리와 EMV contactless 요구사항을 함께 담고 있으며, 카드 응답을 해석해 거래의 다음 단계를 정하는 핵심 엔진입니다.</p>

            <h3>거래 흐름 전체 구조</h3>
            <p>Kernel 3의 거래 흐름은 다섯 단계로 이어집니다.</p>
            <ol>
                <li><strong>입력 수집</strong>: 금액, 통화, 거래일, 거래형태, Unpredictable Number를 정확히 준비합니다. 9F02, 5F2A, 9C, 9A, 9F37 같은 초기값은 카드 판정의 재료가 되므로 단순 설정이 아니라 거래 의미를 담는 값입니다.</li>
                <li><strong>앱 선택</strong>: PPSE로 후보 AID를 수집하고, SELECT AID 후 FCI와 PDOL을 받아 거래용 입력 구조를 결정합니다.</li>
                <li><strong>데이터 읽기</strong>: GPO 요청으로 AIP와 AFL을 받은 뒤, AFL 범위에 따라 READ RECORD를 수행합니다.</li>
                <li><strong>검증 단계</strong>: Processing Restrictions, fDDA(빠른 동적 인증), CVM 판정을 거칩니다. TTQ(리더 선언)와 CTQ(카드 요구)의 교집합이 실제 거래 경로를 결정합니다.</li>
                <li><strong>Outcome 생성</strong>: Approved, Declined, Online Request, Try Another Interface, End Application 중 하나로 거래가 마무리됩니다.</li>
            </ol>

            <h3>TTQ와 CTQ의 역할</h3>
            <p><strong>TTQ(Terminal Transaction Qualifiers)</strong>는 리더가 어떤 기능을 지원하는지 카드에 선언하는 4바이트 값입니다. <strong>CTQ(Card Transaction Qualifiers)</strong>는 카드가 요구하는 처리 조건을 담습니다. TTQ가 리더의 능력 선언이라면, CTQ는 카드의 요구입니다. 실제 거래 경로는 두 값이 만나는 지점에서 결정됩니다.</p>

            <pre class="bg-slate-950 p-4 rounded-lg text-slate-300 font-mono text-xs"><code>// TTQ와 CTQ 교차 판정 (EMV_PROC.C)
if(TTQandCTQ() == 0x10) dll_err = ERR_DECLINED;

if(check_9F10() == 0x10) {
    if((stTerminal.tag_9F66[1] & 0x40) &amp;&amp; (check_CTQ() == 0)) {
        dll_err = ERR_DECLINED;
    }
}</code></pre>

            <h3>GPO: 거래의 분기점</h3>
            <p>GPO(Get Processing Options)는 Kernel 3의 핵심 분기점입니다. PDOL로 정의된 입력을 채워 카드에 전달하면, 카드는 AIP와 AFL을 응답합니다. SW1 SW2가 6984·6985·6986이면 각각 Try Another Interface, Select Next, Try Again 분기가 발생합니다.</p>

            <h3>코드 연결: 핵심 파일 구조</h3>
            <ul>
                <li><strong>main.c</strong>: 전체 초기화와 명령 분배의 시작점입니다.</li>
                <li><strong>interface.c</strong>: 호스트 프레임을 해석하고 <code>EmvTranProc()</code>와 <code>SetTerminalConfig()</code>를 호출하는 관문입니다.</li>
                <li><strong>NFC_Control.c</strong>: PPSE, SELECT AID, GPO, READ RECORD를 실제로 전송하는 NFC 처리 중심 파일입니다.</li>
                <li><strong>EMV_PROC.C</strong>: 거래 상태 전이와 판정 로직의 본체입니다. <code>EmvFuncSelectPSE</code>, <code>EmvFuncSelectAID</code>, <code>EmvFuncProcTran</code>, <code>EmvFuncEndTran</code>이 순서대로 이어집니다.</li>
            </ul>

            <pre class="bg-slate-950 p-4 rounded-lg text-slate-300 font-mono text-xs"><code>// EMV_PROC.C 상태 머신 핵심
bool EmvTranProc(BYTE Cmd_code, BYTE *pCmd, UINT nCmdlen, BYTE *pRsp, UINT *nRsplen) {
    switch(Cmd_code) {
        case AP_RF_PSE_FILE_SEL:      EmvFuncSelectPSE(...); break;
        case AP_STARTTRANSACTION:     EmvFuncSelectAID(...); break;
        case AP_RF_TRAN_END:          EmvFuncEndTran(...);   break;
    }
}</code></pre>

            <a href="../kernel/visa.html" target="_blank" rel="noopener noreferrer" class="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-black text-white transition hover:bg-primary-700">
                <span>슬라이드 열기</span>
                <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i>
            </a>
        `
    },
    {
        id: 21,
        title: "Mastercard Kernel 2: EMV Contactless Book C-2 거래 흐름 완전 분석",
        category: "security",
        categoryKo: "보안 및 인증 규격",
        badgeClass: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900",
        author: "성현진 연구원 (모듈개발팀)",
        date: "2026.06.25",
        readTime: "읽는 시간 20분",
        summary: "Mastercard Kernel 2(M/Chip Advance) 비접촉 거래의 전체 흐름을 처음부터 끝까지 분석합니다. PDOL, GPO, AIP/AFL, ODA, AC 요청·판정, CVM 처리, Outcome 결정 개념과 실제 펌웨어 코드의 연결점을 함께 살펴봅니다.",
        tags: ["Mastercard", "Kernel2", "MChip", "EMV", "Contactless", "PDOL", "AC", "CDA"],
        content: `
            <h3>Mastercard Kernel 2란</h3>
            <p>Kernel 2는 EMVCo Book C-2에 정의된 Mastercard 비접촉 거래의 L2 로직입니다. M/Chip Advance 및 PayPass 기반 카드와의 거래에서 리더기(단말기)가 카드 응답을 해석하고 승인·거절·온라인 요청 여부를 결정하는 핵심 엔진 역할을 합니다. Visa Kernel 3(qVSDC)와 비교하면 AC 요청 구조, CVM 처리, Outcome 결정 방식이 다르므로 별도의 커널 구현이 필요합니다.</p>

            <h3>거래 흐름 전체 개요</h3>
            <p>Kernel 2 거래는 크게 다음 단계로 구성됩니다.</p>
            <ol>
                <li><strong>Entry Point → Kernel 2 선택</strong>: 리더가 카드 AID를 읽고 Mastercard AID(<code>A0 00 00 00 04 10 10</code>)를 확인한 뒤 Kernel 2를 활성화합니다.</li>
                <li><strong>PDOL 처리 및 GPO</strong>: 카드가 요구하는 단말 데이터를 PDOL로 수집해 <code>GET PROCESSING OPTIONS</code>(GPO) 커맨드를 전송합니다.</li>
                <li><strong>AIP / AFL 수신</strong>: GPO 응답에서 AIP(지원 기능 플래그)와 AFL(읽을 파일 목록)을 파싱합니다.</li>
                <li><strong>레코드 읽기(READ RECORD)</strong>: AFL에 명시된 모든 레코드를 순서대로 읽어 카드 데이터를 수집합니다.</li>
                <li><strong>ODA(오프라인 데이터 인증)</strong>: AIP에 따라 SDA, DDA, CDA 중 하나를 수행합니다.</li>
                <li><strong>Processing Restrictions / CVM 처리</strong>: 거래 금액과 카드 CVM 목록을 비교해 서명·PIN·No CVM 중 CVM을 결정합니다.</li>
                <li><strong>Terminal Risk Management(TRM)</strong>: 연속 오프라인 카운터, 랜덤 온라인 샘플링, 속도 점검 등을 수행합니다.</li>
                <li><strong>Terminal Action Analysis(TAA)</strong>: IAC/TAC와 TVR를 AND 연산하여 ARQC·TC·AAC 중 요청할 AC 유형을 결정합니다.</li>
                <li><strong>AC 요청 (GENERATE AC)</strong>: 1st GENERATE AC로 카드에 AC를 요청하고, 카드가 ARQC 또는 TC를 반환합니다.</li>
                <li><strong>온라인 처리 (옵션)</strong>: ARQC 수신 시 호스트에 인가 요청을 보내고 응답(ARPC)으로 2nd GENERATE AC를 처리합니다.</li>
                <li><strong>Outcome 결정</strong>: Approved / Declined / Online Request / Try Again / End Application 중 최종 결과를 확정합니다.</li>
            </ol>

            <h3>PDOL과 GPO 처리</h3>
            <p>PDOL(Processing Options Data Object List)은 카드가 GPO 수행 전에 단말로부터 받고 싶은 TLV 데이터 목록입니다. 단말은 PDOL에 명시된 각 태그의 값을 채워 커맨드 데이터로 전송합니다.</p>
            <pre class="bg-slate-950 p-4 rounded-lg text-slate-300 font-mono text-xs"><code>// GET PROCESSING OPTIONS APDU 구성 예시
// PDOL 태그: 9F66(TTQ,4B) 9F02(금액,6B) 9F03(기타금액,6B) 9F1A(국가코드,2B) 95(TVR,5B) 5F2A(통화코드,2B) 9A(거래일,3B) 9C(거래유형,1B) 9F37(랜덤수,4B)
--> 80 A8 00 00 [Lc] 83 [len] [PDOL data...] 00

// GPO 응답 (AIP + AFL 포함)
&lt;-- 77 xx 82 02 [AIP] 94 xx [AFL] ... 90 00</code></pre>

            <h3>AIP(Application Interchange Profile) 주요 비트</h3>
            <p>AIP는 2바이트 플래그로 카드가 지원하는 기능을 알립니다. Kernel 2에서 핵심적으로 확인하는 비트는 다음과 같습니다.</p>
            <div class="my-6 p-4 bg-slate-100 dark:bg-slate-900 rounded-xl border-l-4 border-emerald-400">
                <strong>AIP 주요 플래그 (Byte 1)</strong><br>
                - Bit 8: CDA 지원 여부<br>
                - Bit 7: RFU<br>
                - Bit 6: Issuer Authentication 지원<br>
                - Bit 5: 온라인 PIN 지원<br>
                - Bit 4: SDA 지원<br>
                - Bit 3: DDA 지원<br>
                - Bit 2: Cardholder Verification 지원<br>
                - Bit 1: RFU
            </div>

            <h3>ODA: CDA(Combined Data Authentication)</h3>
            <p>CDA는 ODA 방식 중 보안 강도가 가장 높으며, 1st GENERATE AC 응답에 서명 데이터를 포함시켜 AC와 인증을 동시에 검증합니다. AIP의 CDA 비트가 설정된 경우 단말은 GENERATE AC 커맨드에 CDA 요청 비트를 함께 전달합니다. 검증 실패 시 TVR의 해당 비트가 세트되어 TAA 결과에 영향을 줍니다.</p>

            <h3>TAA: Terminal Action Analysis</h3>
            <p>TAA는 IAC(Issuer Action Code)와 TAC(Terminal Action Code)를 TVR과 AND 연산하여 온라인·거절·승인 여부를 결정합니다. 단말은 IAC-Default, IAC-Denial, IAC-Online / TAC-Default, TAC-Denial, TAC-Online 6개 값을 순서대로 검사합니다.</p>
            <pre class="bg-slate-950 p-4 rounded-lg text-slate-300 font-mono text-xs"><code>// TAA 의사 코드
if ((TVR &amp; IAC_Denial) || (TVR &amp; TAC_Denial))  → AAC (거절)
if ((TVR &amp; IAC_Online) || (TVR &amp; TAC_Online))  → ARQC (온라인 요청)
else                                            → TC (오프라인 승인)</code></pre>

            <h3>GENERATE AC 요청과 AC 유형</h3>
            <p>1st GENERATE AC 커맨드의 첫 바이트(Reference Control Parameter)에서 상위 2비트로 요청 AC 유형을 지정합니다.</p>
            <div class="my-6 p-4 bg-slate-100 dark:bg-slate-900 rounded-xl border-l-4 border-emerald-400">
                <strong>Reference Control Parameter 상위 2비트</strong><br>
                - <code>00</code>: AAC 요청 (거절)<br>
                - <code>01</code>: TC 요청 (오프라인 승인)<br>
                - <code>10</code>: ARQC 요청 (온라인 인가)<br>
                - <code>11</code>: RFU
            </div>
            <p>카드는 요청된 AC 유형을 그대로 따를 수 있고, 보안 판단에 따라 단계를 낮출 수도 있습니다(예: TC 요청 → AAC 반환). 응답의 Cryptogram Information Data(CID) 태그로 실제 AC 유형을 확인합니다.</p>

            <h3>펌웨어 연결점</h3>
            <p>실제 구현에서는 Kernel 2 로직이 상태 머신(State Machine) 형태로 각 단계를 순서대로 처리합니다. 핵심 파일 구조는 다음과 같습니다.</p>
            <ul>
                <li><strong>MC_KERNEL.C</strong>: Kernel 2 메인 상태 머신. <code>McFuncSelectAID</code>, <code>McFuncGPO</code>, <code>McFuncReadRecord</code>, <code>McFuncGenAC</code>가 순서대로 이어집니다.</li>
                <li><strong>MC_ODA.C</strong>: SDA/DDA/CDA 서명 검증 로직과 공개키 인증서 체인 처리입니다.</li>
                <li><strong>MC_CVM.C</strong>: CVM 목록 파싱 및 단말 CVM 능력과의 매칭 처리입니다.</li>
                <li><strong>EMV_TAA.C</strong>: IAC/TAC 기반 터미널 액션 분석으로 AC 유형 결정을 담당합니다.</li>
            </ul>

            <a href="https://canva.link/w0ga26p9qg4qs3k" target="_blank" rel="noopener noreferrer" class="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-black text-white transition hover:bg-primary-700">
                <span>슬라이드 열기</span>
                <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i>
            </a>
        `
    },
    {
        id: 19,
        title: "Git 명령어 20가지: 명령어에서 AI 프롬프트로",
        category: "report",
        categoryKo: "기술 리포트",
        badgeClass: "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border border-sky-200 dark:border-sky-900",
        author: "성현진 엔지니어 (모듈개발팀)",
        date: "2026.06.19",
        readTime: "읽는 시간 8분",
        summary: "git status부터 cherry-pick까지 20개 Git 명령어를 기존 CLI 사용법과 AI 에이전트 프롬프트 작성법으로 나란히 비교한 발표용 슬라이드입니다.",
        tags: ["Git", "AI", "Prompt", "CLI", "Slides"],
        content: `
            <h3>포스트 소개</h3>
            <p>이 슬라이드는 Git 명령어를 단순히 외우는 자료가 아니라, AI 에이전트를 쓰기 전에는 명령어를 어떻게 직접 실행했고 지금은 같은 작업을 어떤 프롬프트로 요청해야 하는지 비교합니다. 핵심은 명령어를 없애는 것이 아니라 목표, 범위, 안전 조건, 검증 기준을 더 정확히 전달하는 것입니다.</p>

            <h3>Before / Now 관점</h3>
            <ul>
                <li><strong>Before</strong>: 명령어와 옵션을 직접 조합하고 출력 결과를 사람이 읽은 뒤 다음 명령을 결정했습니다.</li>
                <li><strong>Now</strong>: AI 에이전트에게 목표와 제약을 말하고, 에이전트가 실행한 명령과 diff, 테스트 결과를 사람이 검토합니다.</li>
                <li><strong>좋은 프롬프트</strong>: 어떤 작업을 할지, 어떤 파일을 건드려도 되는지, 위험하면 어디서 멈출지를 포함합니다.</li>
                <li><strong>마지막 책임</strong>: commit, push, reset 같은 변경 작업은 에이전트 결과를 확인한 뒤 승인하는 흐름이 안전합니다.</li>
            </ul>

            <h3>다루는 Git 명령어 20가지</h3>
            <ul>
                <li><strong>상태와 변경 검토</strong>: <code>git status</code>, <code>git diff</code></li>
                <li><strong>커밋 구성</strong>: <code>git add</code>, <code>git commit</code></li>
                <li><strong>브랜치 작업</strong>: <code>git branch</code>, <code>git switch</code>, <code>git checkout</code></li>
                <li><strong>원격 동기화</strong>: <code>git fetch</code>, <code>git pull</code>, <code>git push</code></li>
                <li><strong>기록 확인과 복구</strong>: <code>git log</code>, <code>git restore</code>, <code>git reset</code></li>
                <li><strong>통합과 이력 정리</strong>: <code>git merge</code>, <code>git rebase</code>, <code>git cherry-pick</code></li>
                <li><strong>작업 보관과 저장소 관리</strong>: <code>git stash</code>, <code>git remote</code>, <code>git clone</code>, <code>git tag</code></li>
            </ul>

            <h3>프롬프트 예시</h3>
            <ul>
                <li><strong>status</strong>: 현재 저장소 상태를 확인하고 수정/추가/삭제/추적 제외 파일을 표로 요약해줘.</li>
                <li><strong>diff</strong>: 아직 커밋하지 않은 변경을 의도된 변경, 위험한 변경, 확인 질문으로 나눠 요약해줘.</li>
                <li><strong>add</strong>: 이번 커밋 목적과 관련된 변경만 stage하고, 제외한 파일과 이유를 알려줘.</li>
                <li><strong>pull</strong>: 원격 변경을 반영하되 충돌이 나면 자동 커밋하지 말고 충돌 파일과 해결 방향을 먼저 보고해줘.</li>
                <li><strong>reset</strong>: soft, mixed, hard 차이를 설명하고 작업 손실 가능성이 있으면 실행 전 멈춰줘.</li>
            </ul>

            <a href="../topic2/git-commands-slides.html" target="_blank" rel="noopener noreferrer" class="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-black text-white transition hover:bg-primary-700">
                <span>슬라이드 열기</span>
                <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i>
            </a>
        `
    }
];
