# TIT-PCI-DB HTML Slides Design

Date: 2026-07-02
Source:
- `output/pdf/TIT-PCI-DB_summary.md`
- `temp/TIT-PCI-DB V03_260512.pdf`

## Goal

Create a single standalone HTML slide deck for a technical design review of TIT-PCI-DB.

The deck should:
- fit a 35 to 40 minute internal technical review
- use one HTML file with inline CSS and JS
- include HTML-generated diagrams wherever practical
- reserve PDF circuit captures as placeholders instead of embedding images now
- prioritize design intent, signal flow, and review risks over marketing-style presentation

## Output

- Final artifact: `output/pdf/TIT-PCI-DB_slides.html`
- Format: standalone HTML, directly openable in a browser
- Presentation ratio: 16:9
- Navigation: left/right keyboard navigation, fullscreen toggle, page counter
- Excluded UI: progress bar

## Audience And Tone

- Audience: internal technical review
- Tone: concise, engineering-first, review-oriented
- Language: Korean

The slides should make it easy to explain:
- what each block does
- how it connects to adjacent blocks
- what signals or conditions gate correct operation
- what should be checked during review

## Content Strategy

The original summary contains 12 core content sections. To reach a 40-minute review format without padding, the deck expands them into 18 slides by splitting:
- architecture overview from review criteria
- NFC block from NFC review concerns
- system implementation details from cross-block dependency review
- final summary from terminology/concept review

Each slide should support roughly 2 minutes of explanation, with deeper slides such as MCU, Secure Box, NFC, Power, and Backup Bat supporting 2 to 3 minutes each.

## Visual Strategy

Two visual types are allowed:

1. HTML diagrams
- block diagrams
- boot and signal flow diagrams
- dependency maps
- checklist cards
- risk matrix
- concept glossary cards

2. PDF capture placeholders
- use a labeled panel that states where a future circuit capture should be inserted
- each placeholder should include:
  - PDF page number
  - source sheet name
  - target area to capture
  - why that capture matters

No raster capture is embedded in this phase.

## Slide List

### 1. 표지
- Purpose: introduce TIT-PCI-DB as an integrated secure system board
- Content:
  - board identity
  - review scope
  - source document version/date
- Visual:
  - typographic cover
  - no capture required

### 2. 문서 범위와 검토 기준
- Purpose: define what this review covers
- Content:
  - schematic scope
  - included review lenses: control, power, security, interface
  - excluded topics if needed: layout detail validation, manufacturing release detail
- Visual:
  - review scope cards

### 3. 시스템 전체 블록도
- Purpose: show whole-board structure at a glance
- Content:
  - MAX32560 as control center
  - Flash, Secure Box, NFC, UART/USB, LED, Power, Backup relationships
- Visual:
  - HTML block diagram
  - placeholder for `PDF p.2 BLOCK DIAGRAM`

### 4. 전원 유입부터 기능 활성화까지
- Purpose: explain the startup chain
- Content:
  - VDD_EXT input
  - 5V and 3.3V generation
  - clock/reset readiness
  - MCU boot
  - Flash-dependent functional activation
- Visual:
  - HTML boot sequence flow

### 5. 핵심 제어부: MAX32560
- Purpose: explain the central controller requirements
- Content:
  - MCU role
  - 12MHz and 32.768kHz clocks
  - reset behavior
  - JTAG/USB debug path
  - VBAT relation
- Visual:
  - HTML signal relationship diagram
  - placeholder for `PDF p.3 S01.MCU`

### 6. 외부 저장장치와 Secure 연동
- Purpose: explain why external Flash matters to both boot and security
- Content:
  - W25Q128JVPIM
  - QSPI interface
  - code/config/data storage
  - Secure Box relationship
- Visual:
  - MCU-Flash-Secure data path diagram
  - placeholder for `PDF p.4 S02.FLASH`

### 7. 물리 보안 구조
- Purpose: explain tamper detection architecture
- Content:
  - tamper switch
  - mesh pattern
  - layer usage
  - detection and bypass resistance
- Visual:
  - Secure Box concept diagram
  - placeholder for `PDF p.5 S03.SECURE_BOX`

### 8. NFC 통신 블록
- Purpose: explain the RF communication chain
- Content:
  - PN5180
  - SPI control
  - antenna
  - RF matching
  - EMC filtering
  - RF_PWR_ON
- Visual:
  - RF path concept diagram
  - placeholder for `PDF p.6 S04.GPIO/NFC`

### 9. NFC 설계 검토 포인트
- Purpose: highlight review-specific concerns beyond basic function
- Content:
  - RF_PWR_ON polarity note
  - matching and antenna interaction
  - EMI/noise sensitivity
  - bring-up and debug focus
- Visual:
  - checklist or concern cards

### 10. UART/USB 외부 인터페이스
- Purpose: explain debug and host communication interfaces
- Content:
  - UART0/UART1 usage
  - USB_DP/USB_DM role
  - differential routing concern
  - ESD concern
  - separation of internal versus external use
- Visual:
  - interface branching diagram
  - placeholder for `PDF p.7 S05.UART/USB`

### 11. LED 상태 표시 블록
- Purpose: explain visual status reporting
- Content:
  - LP5012
  - RGB LED channels
  - status-color mapping
  - value as immediate operator feedback
- Visual:
  - status-color mapping table
  - placeholder for `PDF p.8 S06.LED`

### 12. 메인 전원 생성부
- Purpose: explain the primary rail generation logic
- Content:
  - VDD_EXT input
  - TPS61252DSG boost path
  - 5V and 3.3V rail relation
  - PWR_GOOD meaning
  - noise/isolation implication
- Visual:
  - power rail generation diagram
  - placeholder for `PDF p.9 S07.POWER`

### 13. CR2032 백업 전원
- Purpose: explain low-power retention and fallback behavior
- Content:
  - CR2032 battery
  - TPS3619-33DGK monitor
  - VBAT, PFO, RESET relation
  - low-power backup mode
  - backup current and lifetime discussion
- Visual:
  - backup switchover flow
  - placeholder for `PDF p.10 S08.BACKUP_BAT`

### 14. 설계 규칙과 레이아웃 원칙
- Purpose: surface board-level rules from the cover page notes
- Content:
  - bypass capacitor placement
  - power handling before inner-layer connection
  - naming and pin marking conventions
  - review-first layout guidance
- Visual:
  - rule cards
  - placeholder for `PDF p.1 COVER notes`

### 15. 기능 블록 간 상호의존성
- Purpose: show how failures propagate across the board
- Content:
  - power instability impact
  - clock/reset impact
  - RF path impact
  - interface noise impact
  - backup relation to reset/state retention
- Visual:
  - dependency map

### 16. 기술 검토 시 우선 리스크
- Purpose: summarize what deserves early scrutiny
- Content:
  - power integrity
  - tamper path reliability
  - RF tuning and matching
  - USB routing/ESD
  - backup current assumption validity
- Visual:
  - risk matrix

### 17. 핵심 정리
- Purpose: close the technical narrative cleanly
- Content:
  - control: MAX32560
  - storage/security: Flash and Secure Box
  - external communication: NFC, UART, USB
  - status display: LED
  - system stability: power and battery
- Visual:
  - integrated summary diagram or emphasis cards

### 18. 핵심 단어와 개념 정리
- Purpose: normalize terminology for review discussion
- Content:
  - MCU
  - QSPI
  - Tamper
  - Secure Box
  - PWM
  - PWR_GOOD
  - PFO
  - ESD
  - RF
  - EMC
- Visual:
  - glossary cards

## PDF Placeholder Mapping

- `p.1` `D01. COVER`
  - use for board rules, notes, and manufacturing/stack context references
- `p.2` `D02. BLOCK DIAG1`
  - use for whole-system block capture
- `p.3` `S01.MCU`
  - use for MCU, clock, reset, JTAG area
- `p.4` `S02.FLASH`
  - use for Flash and Secure-related path
- `p.5` `S03.SECURE_BOX`
  - use for secure box and tamper/mesh structure
- `p.6` `S04.GPIO/NFC`
  - use for PN5180, antenna, RF matching, EMC filter
- `p.7` `S05.UART/USB`
  - use for UART/USB routing and ESD region
- `p.8` `S06.LED`
  - use for LP5012 and RGB LED region
- `p.9` `S07.POWER`
  - use for boost/regulator and PWR_GOOD region
- `p.10` `S08.BACKUP_BAT`
  - use for battery monitor and backup current notes

## Layout Pattern

The deck should follow a consistent technical-review rhythm:

- title/header on top
- primary content area split into text and visual region
- visual region uses either diagram or placeholder card
- bottom line may contain a short review note or interpretation cue

Preferred patterns:
- cover
- left text / right visual
- top summary / bottom flow
- matrix/cards for review-oriented slides

## Interaction Pattern

- left/right arrow navigation
- page up/page down support is acceptable
- fullscreen toggle support is acceptable
- page counter required
- progress bar not included
- print stylesheet should output one 16:9 slide per page

## Styling Direction

- dark technical review theme
- strong contrast for projection
- restrained accent palette: cyan, blue, amber
- clear hierarchy for headings, labels, and notes
- avoid decorative motion that distracts from engineering content

## Acceptance Criteria

The implementation is acceptable when:
- the full deck is contained in one HTML file
- all 18 slides exist and follow the approved structure
- HTML diagrams are present where planned
- every capture-needed slide includes a clear placeholder with PDF location
- navigation works without external build tooling
- the deck is readable in browser and printable in 16:9 layout
- no slide overflows or truncates core text at normal viewport size

## Out Of Scope

- embedding actual circuit capture images in this phase
- building a reusable slide framework for other presentations
- adding speaker notes beyond brief review cues
- adding progress bar UI
