export interface NewsSource {
  name: string;
  rssUrl: string;
}

// TODO: 실제 서비스에서는 언론사별 크롤링/RSS 이용 약관 및 robots.txt 확인 후 목록을 확정한다 (claude.md 7장 리스크 참고).
export const NEWS_SOURCES: NewsSource[] = [
  { name: "연합뉴스", rssUrl: "https://www.yna.co.kr/rss/news.xml" },
];
