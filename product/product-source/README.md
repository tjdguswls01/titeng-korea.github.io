# Product Source Materials

이 폴더는 제품 페이지를 채우기 위한 원자료를 모아두는 곳입니다.

각 제품 폴더에는 다음 파일이 있습니다.

- `images/README.md`: 사용할 이미지 파일명과 용도를 정리하는 템플릿

권장 이미지 형식:

- 제품 실물 사진: `.jpg`, `.jpeg`, `.webp`
- 투명 배경 제품컷: `.png`
- 화면 캡처/도표: `.png`, `.webp`
- 최소 권장 해상도: 가로 1200px 이상

파일명 규칙:

- 영문 소문자, 숫자, 하이픈만 사용
- 예: `nuvia-hero.jpg`, `tcp40-interface.png`, `tdr-installation-01.webp`

제품별 텍스트는 이제 `product/` 폴더의 HTML에 직접 반영합니다.
이미지 파일을 별도로 사용할 때는 `assets/images/product/` 아래로 옮기거나 복사해서 HTML에서 참조합니다.
