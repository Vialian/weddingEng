/**
 * Wedding Invitation Configuration
 *
 * 이 파일에서 청첩장의 모든 정보를 수정할 수 있습니다.
 * 이미지는 설정이 필요 없습니다. 아래 폴더에 순번 파일명으로 넣으면 자동 감지됩니다.
 *
 * 이미지 폴더 구조 (파일명 규칙):
 *   images/hero/1.jpg      - 메인 사진 (1장, 필수)
 *   images/story/1.jpg, 2.jpg, ...  - 스토리 사진들 (순번, 자동 감지)
 *   images/gallery/1.jpg, 2.jpg, ... - 갤러리 사진들 (순번, 자동 감지)
 *   images/location/1.jpg  - 약도/지도 이미지 (1장)
 *   images/og/1.jpg        - 카카오톡 공유 썸네일 (1장)
 */

const CONFIG = {
  // ── 초대장 열기 ──
  useCurtain: false,  // 초대장 열기 화면 사용 여부 (true: 사용, false: 바로 본문 표시)

  // ── 메인 (히어로) ──
  groom: {
    name: "Søren",
    nameEn: "Søren",
    father: "Frank",
    mother: "Liselotte",
    fatherDeceased: false,
    motherDeceased: false
  },

  bride: {
    name: "Seoyoung",
    nameEn: "Seoyoung",
    father: "김형식",
    mother: "방종숙",
    fatherDeceased: false,
    motherDeceased: false
  },

  wedding: {
    date: "2027-03-27",
    time: "17:00",
    venue: "Woninjae Wedding",
    address: "322 Gyeongwon-daero, Yeonsu-gu, Incheon, South Korea",
    mapLinks: {
      kakao: "https://kko.to/6FTOPLjjCm",
      naver: "https://naver.me/5LHHxqFN",
      google: "https://www.google.com/maps?q=South+Korea,+Incheon,+Yeonsu-gu,+Gyeongwon-daero,+322+%EC%9B%90%EC%9D%B8%EC%9E%AC%EC%9B%A8%EB%94%A9&ftid=0x357b7901407a22f9:0x24e84e45054189e8&entry=gps&shh=CAE&lucs=,100834232,121816461,94297699,94231188,94280568,100821559,47071704,94218641,94282134,100835694,94286869,100820247,100822504&g_ep=CAISEjI2LjM2LjMuOTczNTQ4ODUxMBgAIIgnKnssMTAwODM0MjMyLDEyMTgxNjQ2MSw5NDI5NzY5OSw5NDIzMTE4OCw5NDI4MDU2OCwxMDA4MjE1NTksNDcwNzE3MDQsOTQyMTg2NDEsOTQyODIxMzQsMTAwODM1Njk0LDk0Mjg2ODY5LDEwMDgyMDI0NywxMDA4MjI1MDRCAkRL&skid=9647da31-ca41-4e46-b938-fc082fcf248b&g_st=ic&ucbcb=1"
    }
  },

  // ── 인사말 ──
  greeting: {
    title: "We’re getting married",
    content: "We’re getting married\nand would love to celebrate\nwith you."
  },

  // ── 우리의 이야기 ──
  story: {
    title: "A Note to Our Guests",
    content: "We know it’s a long way to travel, and we completely understand if you’re unable to make it.\nBut if you can, we’d really love to have you there and celebrate together."
  },

  // ── 오시는 길 ──
  // (mapLinks는 wedding 객체 내에 포함)

  // ── 마음 전하실 곳 ──
  accounts: {
    groom: [
    ],
    bride: [
    ]
  },

  // ── 링크 공유 시 나타나는 문구 ──
  meta: {
    title: "신랑 ♥ 신부 결혼합니다",
    description: "2025년 1월 1일, 소중한 분들을 초대합니다."
  }
};
