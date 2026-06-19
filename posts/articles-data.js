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
        author: "성현진 엔지니어 (개발 생산성)",
        date: "2026.06.18",
        readTime: "Git 실무 리포트",
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

            <a href="../topic2/topic2.html" class="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-black text-white transition hover:bg-primary-700">
                <span>슬라이드 열기</span>
                <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i>
            </a>
        `
    },
    {
        id: 17,
        title: "AI 코딩 패러다임과 차세대 클라우드 개발 환경",
        category: "report",
        categoryKo: "기술 리포트",
        badgeClass: "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border border-sky-200 dark:border-sky-900",
        author: "성현진 엔지니어 (개발 생산성)",
        date: "2026.06.18",
        readTime: "클라우드 IDE 리포트",
        summary: "AI 코딩 패러다임 전환, LLM의 문맥 처리 방식, 로컬 개발 환경의 구조적 한계, Antigravity IDE형 클라우드 개발 환경 아키텍처를 정리한 기술 리포트입니다.",
        tags: ["AI Coding", "LLM", "Cloud IDE", "Antigravity", "WASM"],
        content: `
            <h3>리포트 개요</h3>
            <p>이 리포트는 AI 코딩이 개발 인터페이스를 어떻게 바꾸고 있는지, 그리고 그 변화가 왜 클라우드 기반 개발 환경으로 이어지는지를 하나의 흐름으로 정리합니다. 검색과 복사·붙여넣기 중심의 작업 방식에서, IDE 안에서 AI와 대화하며 문맥을 유지하는 방식으로 이동하는 배경을 다룹니다.</p>

            <h3>핵심 질문</h3>
            <ul>
                <li>AI 코딩은 왜 기존 개발 생산성 구조를 바꾸는가</li>
                <li>LLM은 어떤 방식으로 코드를 예측하고 문맥을 소비하는가</li>
                <li>로컬 개발 환경은 왜 점점 병목이 되는가</li>
                <li>차세대 클라우드 IDE는 어떤 아키텍처를 가져야 하는가</li>
            </ul>

            <h3>주요 내용</h3>
            <ul>
                <li><strong>개발 패러다임 시프트</strong>: Stack Overflow 검색과 복붙 중심 흐름에서, IDE 내 인라인 대화와 즉시 패치 적용 흐름으로 전환됩니다.</li>
                <li><strong>LLM과 Context Window</strong>: 모델은 코드를 이해한다기보다 확률적으로 예측하며, 어떤 문맥을 주느냐가 결과 품질을 좌우합니다.</li>
                <li><strong>레거시 로컬 개발의 한계</strong>: 환경 파편화, 느린 빌드, 디바이스 성능 편차, 보안 리스크가 구조적으로 커집니다.</li>
                <li><strong>Antigravity IDE 아키텍처</strong>: 원격 컨테이너, WASM 기반 클라이언트, 스냅샷 복구, 보안 VPC, 저지연 동기화가 결합된 형태를 설명합니다.</li>
            </ul>

            <h3>실무 관점 포인트</h3>
            <ul>
                <li>AI 코딩 도입은 단순 자동완성 추가가 아니라 개발 워크플로우 전체 재설계 문제입니다.</li>
                <li>좋은 결과를 얻으려면 모델 성능보다 문맥 전달 방식과 세션 유지 전략이 중요합니다.</li>
                <li>클라우드 IDE는 성능뿐 아니라 보안, 자산 관리, 온보딩 속도, 복구성을 같이 개선할 수 있습니다.</li>
                <li>도입은 전면 교체보다 신규 프로젝트 파일럿과 단계적 확산이 현실적입니다.</li>
            </ul>

            <a href="../topic3/topic3.html" class="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-black text-white transition hover:bg-primary-700">
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
        author: "성현진 엔지니어 (개발 생산성)",
        date: "2026.06.18",
        readTime: "CLI 코딩 리포트",
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

            <a href="../topic4/topic4.html" class="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-black text-white transition hover:bg-primary-700">
                <span>슬라이드 열기</span>
                <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i>
            </a>
        `
    },
    {
        id: 19,
        title: "Git 핵심 명령어 10가지: 실무 흐름으로 정리한 슬라이드",
        category: "report",
        categoryKo: "기술 리포트",
        badgeClass: "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border border-sky-200 dark:border-sky-900",
        author: "성현진 엔지니어 (개발 생산성)",
        date: "2026.06.19",
        readTime: "Git 실무 가이드",
        summary: "git status, diff, add, commit, branch, switch, pull, push, log, restore를 실무 흐름 중심으로 정리한 발표용 슬라이드 포스트입니다.",
        tags: ["Git", "CLI", "Workflow", "Slides", "VersionControl"],
        content: `
            <h3>포스트 소개</h3>
            <p>이 글은 Git을 처음 접하거나 실무에서 기본 흐름을 다시 정리하고 싶은 분들을 위해, 핵심 명령어를 작업 순서대로 묶어 설명한 슬라이드입니다. 상태 확인, 변경 검토, 커밋, 브랜치 분리, 원격 반영까지 한 번에 볼 수 있습니다.</p>

            <h3>포함된 주제</h3>
            <ul>
                <li><strong>git status</strong>: 현재 상태와 변경 파일 확인</li>
                <li><strong>git diff</strong>: 커밋 전 변경 검토</li>
                <li><strong>git add / git commit</strong>: 변경을 기록으로 저장</li>
                <li><strong>git branch / git switch</strong>: 작업 흐름 분리</li>
                <li><strong>git pull / git push</strong>: 원격 저장소 동기화</li>
                <li><strong>git log / git restore</strong>: 이력 확인과 안전한 복구</li>
            </ul>

            <a href="../git-commands-slides.html" class="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-black text-white transition hover:bg-primary-700">
                <span>슬라이드 열기</span>
                <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i>
            </a>
        `
    }
];
