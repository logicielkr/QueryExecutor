# [Graha 응용프로그램]실시간 Query 실행기

Graha를 활용한 실시간 Query 실행기 프로그램이다.  Query 실행기 프로그램은 메모장 프로그램에 실시간 Query 실행 기능을 추가한 것이다.

이 프로그램은 다음과 같은 환경에서 개발되고 테스트 되었다.

- Apache Tomcat 7.x 이상
- PostgreSQL 9.1.4 이상
- JDBC 4.0 이상
- Graha 0.5.0.6 이상

이 프로그램을 사용할 때 주의사항은 다음과 같다.

- 이 프로그램은 클라이언트에서 작성한 SQL 코드를 실시간으로 서버에서 실행하는 기능을 포함하고 있으므로, 보안에 취약점이 있으며, 개인용 혹은 폐쇠적인 개발팀 내에서만 사용할 수 있다.