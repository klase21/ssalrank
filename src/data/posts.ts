export type Lang = "ko" | "en";

export type Post = {
  id: string;
  title_ko: string;
  title_en: string;
  desc_ko: string;
  desc_en: string;
  reward_krw: number;
  reward_usd: number;
  time_minutes: number;
  category: string;
  category_en: string;
  source_url: string;
  referral_url?: string;
  lang_original: Lang;
  verified: boolean;
  deadline: string; // ISO date
  tags: string[];
  steps_ko: string[];
  steps_en: string[];
  is_home: boolean;
  investment_required: boolean;
};

export const posts: Post[] = [
  {
    id: "1",
    title_ko: "Prolific 설문 1건 - 고단가 영어 설문",
    title_en: "Prolific Survey - High Paying English Survey",
    desc_ko: "영국 대학 리서치 플랫폼. 영어 설문 하나당 $8~12. 번역기 돌려도 가능, 승인률 높음.",
    desc_en: "UK university research platform. $8-12 per survey. Use translator, high approval rate.",
    reward_krw: 15000,
    reward_usd: 11,
    time_minutes: 18,
    category: "설문",
    category_en: "Survey",
    source_url: "https://www.prolific.com",
    referral_url: "https://www.prolific.com?ref=YOUR_CODE",
    lang_original: "en",
    verified: true,
    deadline: "2026-09-10",
    tags: ["집에서가능", "영어번역필요", "선착순"],
    steps_ko: ["Prolific 가입 (영문)", "프로필 설문 10개 작성", "대기 후 설문 참여 -> PayPal 출금"],
    steps_en: ["Sign up on Prolific", "Complete 10 profile surveys", "Wait for studies -> Payout via PayPal"],
    is_home: true,
    investment_required: false,
  },
  {
    id: "2",
    title_ko: "토스뱅크 모임통장 개설 2만원 페이백",
    title_en: "Toss Bank Group Account - 20,000 KRW Cashback",
    desc_ko: "토스뱅크 신규 모임통장 개설 시 2만원 즉시 지급. 5분컷, 신분증만 있으면 됨.",
    desc_en: "Open Toss Bank group account, get 20,000 KRW instantly. 5 min, ID only.",
    reward_krw: 20000,
    reward_usd: 15,
    time_minutes: 5,
    category: "금융",
    category_en: "Finance",
    source_url: "https://www.tossbank.com",
    referral_url: "https://tossbank.com/ref/YOUR_CODE",
    lang_original: "ko",
    verified: true,
    deadline: "2026-09-05",
    tags: ["5분컷", "0원투자", "선착순 5천명"],
    steps_ko: ["토스 앱에서 모임통장 개설", "친구 1명 초대", "2만원 즉시 입금 확인"],
    steps_en: ["Open group account in Toss app", "Invite 1 friend", "Get 20,000 KRW instantly"],
    is_home: true,
    investment_required: false,
  },
  {
    id: "3",
    title_ko: "UserTesting - 사이트 리뷰하고 $10 벌기",
    title_en: "UserTesting - Review Websites for $10",
    desc_ko: "영어 사이트 10분 둘러보고 음성으로 리뷰하면 $10. 하루 2~3건 가능.",
    desc_en: "Browse a website for 10 min and give voice review for $10. 2-3 tests per day.",
    reward_krw: 13500,
    reward_usd: 10,
    time_minutes: 15,
    category: "리뷰",
    category_en: "Review",
    source_url: "https://www.usertesting.com",
    referral_url: undefined,
    lang_original: "en",
    verified: true,
    deadline: "2026-09-30",
    tags: ["집에서가능", "영어필요", "PayPal"],
    steps_ko: ["UserTesting 가입 + 마이크 테스트", "연습 테스트 통과", "의뢰 들어오면 15분 리뷰 -> $10 적립"],
    steps_en: ["Sign up + mic test", "Pass practice test", "Do 15-min review when assigned -> $10"],
    is_home: true,
    investment_required: false,
  },
  {
    id: "4",
    title_ko: "캐시워크 돈버는퀴즈 + 만보기 - 하루 500원",
    title_en: "CashWalk Quiz + Pedometer - 500 KRW/day",
    desc_ko: "매일 퀴즈 200원 + 만보기 300원. 티끌모아 태산, 0분투자 무지성 가능.",
    desc_en: "Daily quiz 200 + pedometer 300 KRW. Zero investment, brainless.",
    reward_krw: 500,
    reward_usd: 0.4,
    time_minutes: 3,
    category: "앱테크",
    category_en: "AppTech",
    source_url: "https://cashwalk.com",
    referral_url: "https://cashwalk.com/ref/YOUR_CODE",
    lang_original: "ko",
    verified: true,
    deadline: "2026-12-31",
    tags: ["3분컷", "매일가능", "0원투자"],
    steps_ko: ["캐시워크 설치", "매일 퀴즈 정답 입력 (네이버 검색)", "만보기 10000보 채우기"],
    steps_en: ["Install CashWalk", "Solve daily quiz", "Walk 10k steps"],
    is_home: true,
    investment_required: false,
  },
  {
    id: "5",
    title_ko: "Swagbucks 설문 + 쇼핑 리워드",
    title_en: "Swagbucks Surveys + Shopping Rewards",
    desc_ko: "미국 1위 리워드 앱. 설문, 쇼핑 경유, 영상시청으로 포인트 -> 기프트카드.",
    desc_en: "#1 US rewards app. Surveys, shopping cashback, videos -> gift cards.",
    reward_krw: 8000,
    reward_usd: 6,
    time_minutes: 20,
    category: "앱테크",
    category_en: "AppTech",
    source_url: "https://www.swagbucks.com",
    referral_url: "https://www.swagbucks.com/p/register?rb=YOUR_CODE",
    lang_original: "en",
    verified: false,
    deadline: "2026-09-15",
    tags: ["미검증", "기프트카드", "VPN필요없음"],
    steps_ko: ["Swagbucks 가입", "프로필 설문 완료", "Daily Poll + 설문 2개 진행"],
    steps_en: ["Sign up on Swagbucks", "Complete profile", "Do Daily Poll + 2 surveys"],
    is_home: true,
    investment_required: false,
  },
  {
    id: "6",
    title_ko: "당근 알바 - 편의점 야간 3시간 대타 4.5만원",
    title_en: "Daangn Gig - Convenience Store Night Shift 45k KRW/3h",
    desc_ko: "동네 편의점 야간 대타. 당일 정산, 초보 가능. 시급 15,000원.",
    desc_en: "Local convenience store night cover. Same-day pay, beginner OK. 15k KRW/h.",
    reward_krw: 45000,
    reward_usd: 33,
    time_minutes: 180,
    category: "단기알바",
    category_en: "Gig",
    source_url: "https://www.daangn.com/kr/jobs/",
    referral_url: undefined,
    lang_original: "ko",
    verified: true,
    deadline: "2026-09-04",
    tags: ["오프라인", "당일정산", "마감임박"],
    steps_ko: ["당근마켓 알바 탭에서 검색", "채팅으로 지원", "근무 후 즉시 정산"],
    steps_en: ["Search Daangn Jobs", "Chat to apply", "Get paid same day"],
    is_home: false,
    investment_required: false,
  },
  {
    id: "7",
    title_ko: "Amazon Influencer - 리뷰 영상으로 수수료",
    title_en: "Amazon Influencer - Earn Commission via Review Videos",
    desc_ko: "아마존 상품 리뷰 영상 올리면 조회수당 수수료. 영어권에서 월 $200~1000 사례 많음.",
    desc_en: "Post Amazon product review videos, earn per view. $200-1000/mo cases in US.",
    reward_krw: 40000,
    reward_usd: 30,
    time_minutes: 60,
    category: "부업",
    category_en: "Side Hustle",
    source_url: "https://affiliate-program.amazon.com/",
    referral_url: undefined,
    lang_original: "en",
    verified: false,
    deadline: "2026-10-01",
    tags: ["장기수익", "영상필요", "미검증"],
    steps_ko: ["Amazon Influencer 신청", "리뷰 영상 3개 업로드", "승인 후 영상당 수익 발생"],
    steps_en: ["Apply to Amazon Influencer", "Upload 3 review videos", "Earn per view after approval"],
    is_home: true,
    investment_required: false,
  },
];

export function hourlyWage(post: Post, lang: Lang) {
  const reward = lang === "ko" ? post.reward_krw : post.reward_usd * 1350; // normalize to KRW for sorting
  return Math.round((reward / post.time_minutes) * 60);
}
export function displayReward(post: Post, lang: Lang) {
  return lang === "ko" ? `${post.reward_krw.toLocaleString()}원` : `$${post.reward_usd}`;
}
export function displayHourly(post: Post, lang: Lang) {
  const wage = hourlyWage(post, lang);
  return lang === "ko" ? `시급 ${wage.toLocaleString()}원` : `~$${(wage/1350).toFixed(1)}/h`;
}
