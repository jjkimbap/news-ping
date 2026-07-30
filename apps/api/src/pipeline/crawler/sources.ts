export interface NewsSource {
  name: string;
  rssUrl: string;
}

// TODO: 실제 서비스에서는 언론사별 크롤링/RSS 이용 약관 및 robots.txt 확인 후 목록을 확정한다 (claude.md 7장 리스크 참고).
// 조선일보/중앙일보/문화일보/서울신문/파이낸셜뉴스/한국일보/매일경제와 네이버·다음 포털은
// 공식 통합 RSS를 더 이상 제공하지 않거나(서비스 종료), 봇 차단(Cloudflare) 등으로 제외했다.
export const NEWS_SOURCES: NewsSource[] = [
  { name: "연합뉴스", rssUrl: "https://www.yna.co.kr/rss/news.xml" },
  { name: "동아일보", rssUrl: "http://rss.donga.com/total.xml" },
  { name: "경향신문", rssUrl: "http://www.khan.co.kr/rss/rssdata/total_news.xml" },
  { name: "한겨레", rssUrl: "https://www.hani.co.kr/rss/" },
  { name: "세계일보", rssUrl: "https://www.segye.com/Articles/RSSList/segye_recent.xml" },
  // "전체기사" 통합 피드가 없어 가장 포괄적인 사회 섹션으로 대체. EUC-KR 인코딩(크롤러에서 변환 처리).
  { name: "국민일보", rssUrl: "https://www.kmib.co.kr/rss/data/kmibSocRss.xml" },
  { name: "한국경제", rssUrl: "https://www.hankyung.com/feed/all-news" },
  { name: "서울경제", rssUrl: "https://www.sedaily.com/rss/newsall" },
  { name: "머니투데이", rssUrl: "https://rss.mt.co.kr/mt_news.xml" },
  { name: "이데일리", rssUrl: "http://rss.edaily.co.kr/edaily_news.xml" },
  { name: "아시아경제", rssUrl: "https://www.asiae.co.kr/rss/all.htm" },
  { name: "구글뉴스(한국)", rssUrl: "https://news.google.com/rss?hl=ko&gl=KR&ceid=KR:ko" },
];
