export default function AboutPage() {
  return (
    <article className="prose prose-sm dark:prose-invert">
      <h1>서비스 소개</h1>
      <p>
        News Ping은 사용자가 등록한 키워드가 포함된 뉴스를 온라인 언론사에서 실시간(준실시간)으로
        수집하여 알려주는 키워드 뉴스 알림 서비스입니다.
      </p>
      <h2>주요 기능</h2>
      <ul>
        <li>최대 10개까지 관심 키워드 등록</li>
        <li>키워드가 포함된 신규 기사 발생 시 푸시 알림</li>
        <li>알림 이력을 한눈에 모아보는 알림 리스트</li>
        <li>자체 수집 데이터를 기반으로 한 키워드 트렌드 통계</li>
      </ul>
      <p>
        뉴스 원문은 저작권 보호를 위해 재게시하지 않으며, 제목/요약과 원문 링크만 제공합니다.
      </p>
    </article>
  );
}
