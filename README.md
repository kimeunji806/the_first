# FIRST STEP : 함께하는 첫걸음
## 발달장애인 지원관리 시스템

발달장애인 지원관리 시스템은 **일반이용자(보호자), 기관담당자, 기관관리자, 시스템관리자**의 역할에 따라  
지원대상자 관리, 지원신청서 작성, 담당자 지정, 우선순위 설정, 지원계획 및 지원결과 작성과 승인까지  
하나의 흐름으로 관리할 수 있도록 구현한 **역할 기반 업무관리 웹 시스템**입니다.

본 프로젝트는 발달장애인 지원 업무를 보다 체계적이고 효율적으로 관리할 수 있도록  
업무 절차를 전산화하고 각 사용자 권한에 맞는 기능을 제공하는 것을 목표로 개발되었습니다.

---

## 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **프로젝트명** | FIRST STEP |
| **프로젝트 유형** | 팀 프로젝트 (4인) |
| **개발 기간** | 2026.03.10 ~ 2026.04.13 (약 5주) |

**개발 목적**
- 발달장애인 지원 업무 전산화
- 역할별 업무 프로세스 분리 및 권한 기반 처리
- 지원계획 및 지원결과 승인 흐름 구현
- 첨부파일 및 수정이력 관리 기능 제공

---

## 기여 요약

- 공지사항, 계정관리, 기관정보 기능 **풀스택 구현**
- **권한 기반 UI 및 API 로직 설계**
- **DB 설계 및 MariaDB 직접 구축 (NCP)**
- 파일 업로드 및 수정이력 관리 기능 구현

> 설계 → 구현 → 배포까지 전 과정 참여

---

## 개발 기간
2026.03.10 ~ 2026.04.13 (약 5주)

- 설계 → 구현 → 배포까지 전 과정 참여

---

## 팀 구성 및 역할

| <a href="https://github.com/time1014"><img src="https://avatars.githubusercontent.com/u/64236748?v=4" width="100px;" /><br /><b>방진영</b></a> | <a href="https://github.com/crescentia0011"><img src="https://avatars.githubusercontent.com/u/254889839?v=4" width="100px;" /><br /><b>김병완</b></a> | <a href="https://github.com/kimeunji806"><img src="https://avatars.githubusercontent.com/u/258710580?v=4" width="100px;" /><br /><b>⭐ 김은지 (본인)</b></a> | <a href="https://github.com/ryusongji"><img src="https://avatars.githubusercontent.com/u/53076307?v=4" width="100px;" /><br /><b>류송지</b></a> |
|:---:|:---:|:---:|:---:|
| 팀장 | 부팀장 | 팀원 | 팀원 |
| 배포 | GIT | DB | 개발환경 |

---

## 기술 스택

| 구분 | 사용 기술 |
|------|----------|
| Frontend | ![Vue](https://img.shields.io/badge/Vue%203-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) ![PrimeVue](https://img.shields.io/badge/PrimeVue-3B82F6?style=for-the-badge&logo=vue.js&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white) |
| Backend | ![Node.js](https://img.shields.io/badge/Node.js-5FA04E?style=for-the-badge&logo=nodedotjs&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white) |
| Database | ![MariaDB](https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white) |
| Dev Tools | ![MySQL Workbench](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white) ![VS Code Insiders](https://img.shields.io/badge/VS%20Code%20Insiders-35b393.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white) |
| Collaboration | ![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white) ![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white) |
| Deployment | ![Naver Cloud](https://img.shields.io/badge/NCP-03C75A?style=for-the-badge&logo=naver&logoColor=white) ![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white) ![PM2](https://img.shields.io/badge/PM2-2B037A?style=for-the-badge&logo=pm2&logoColor=white) ![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white) |

---

## 내가 담당한 기능

Frontend(Vue 3) + Backend(Node.js/Express) 풀스택 구현 및 DB 설계/관리를 담당하였습니다.

### 🖥️ 공통 헤더
- 전체 역할(일반사용자 / 기관담당자 / 기관관리자 / 시스템관리자)에 적용되는 공통 헤더 컴포넌트 구현
- 역할별 메뉴 구성 및 권한에 따른 네비게이션 분기 처리

### 📢 공지사항
- **일반사용자**: 공지사항 목록 조회, 상세 조회
- **기관담당자 / 기관관리자**: 공지사항 목록 조회, 상세 조회, 등록 / 수정 / 삭제
- **시스템관리자**: 공지사항 목록 조회, 상세 조회, 등록 / 수정 / 삭제

### 🏢 기관 정보 관리 (기관관리자)
- 기관 정보 조회
- 기관 정보 수정

### 🔐 계정 관련
- 아이디 찾기 / 아이디 확인
- 비밀번호 찾기 / 새 비밀번호 설정
- 회원 탈퇴

### 👤 시스템관리자
- 기관관리자 계정 회원가입 승인

### 🗄️ DB 관리 (Naver Cloud Platform)
- ERD 지속적 수정 관리
- 테이블 생성 및 변경 이력 스크립트 관리 (버전별 DDL 스크립트 관리)
- NCP(Naver Cloud Platform)에 MariaDB 서버 직접 구축 및 설정

---

## 프로젝트 구조

```bash
the_first/
├── client/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── counsel/
│   │   │   ├── plan/
│   │   │   ├── priority/
│   │   │   ├── result/
│   │   │   └── survey/
│   │   ├── layout/
│   │   ├── router/
│   │   ├── service/
│   │   ├── stores/
│   │   └── views/
│   └── package.json
│
├── server/
│   ├── database/
│   │   ├── sql/
│   │   ├── mappers/
│   │   └── DAO.js
│   ├── routers/
│   ├── services/
│   ├── uploads/
│   ├── app.js
│   └── package.json
│
├── docs/
│   ├── main.png
│   ├── system_flow.png
│   ├── data_flow.png
│   └── erd.png
│
└── README.md
```

---

## 시스템설계

<img width="1148" height="600" alt="image" src="https://github.com/user-attachments/assets/faa1fa81-a9d9-481e-a914-fe68ede71e88" />

<img width="1063" height="584" alt="image" src="https://github.com/user-attachments/assets/69ed7149-b1ec-49c9-8339-7b038376835e" />


---

## 메인 화면

### 지원신청내역
<img width="1919" height="668" alt="image" src="https://github.com/user-attachments/assets/b0c0c6d4-693c-44e8-85ea-9670c54ebbe6" />

### 지원신청서
<img width="1919" height="901" alt="지원신청서_지원신청하기클릭시" src="https://github.com/user-attachments/assets/062fa163-7836-4c9e-a491-df28a2d462f9" />

### 담당자 배정
<img width="1534" height="830" alt="image" src="https://github.com/user-attachments/assets/6c6b83b9-687f-42b4-b546-9593d081cb0d" />

### 상담내역
<img width="1919" height="946" alt="image" src="https://github.com/user-attachments/assets/f5681797-9e54-4888-ab3e-7b3685c2a8e4" />

### 우선순위
<img width="1919" height="925" alt="우선순위반려사유적을시" src="https://github.com/user-attachments/assets/a3c6f79d-ac08-4cdd-a3f2-2ea9fc2a7c21" />

### 지원계획
<img width="1527" height="847" alt="image" src="https://github.com/user-attachments/assets/6981b44e-2985-48ca-9a64-81bd16316e45" />

### 지원결과
<img width="1516" height="860" alt="image" src="https://github.com/user-attachments/assets/f64bc2d6-1210-403b-bf5a-c5e0d52bc795" />

### 공지사항
<img width="1920" height="945" alt="image" src="https://github.com/user-attachments/assets/b659a945-cec3-4b6e-b523-78c5a0094882" />

---

## 전체 주요 기능

### 일반 사용자(보호자)
- 지원대상자 등록 / 조회 / 수정
- 지원신청서 작성
- 지원계획 열람
- 지원결과 열람
- 공지사항 조회

### 기관담당자
- 대기자 목록 확인
- 지원신청서 조회
- 상담 기록 작성 / 수정 / 삭제 / 임시저장
- 우선순위 설정
- 지원계획 작성 / 수정 / 삭제 / 임시저장
- 지원결과 작성 / 수정 / 삭제 / 임시저장
- 첨부파일 관리
- 수정이력 관리
- 본인 정보 조회 / 수정
- 공지사항 등록 / 조회 / 수정 / 삭제

### 기관관리자
- 담당자 지정
- 우선순위 승인 / 반려
- 지원계획 승인 / 반려
- 지원결과 승인 / 반려
- 본인 정보 조회 / 수정
- 공지사항 등록 / 조회 / 수정 / 삭제

### 시스템관리자
- 기관 목록 조회
- 기관 상세조회
- 기관 등록 / 수정
- 기관 운영관리
- 공지사항 등록 / 조회 / 수정 / 삭제

---

## 업무 흐름

1. 일반이용자가 지원대상자를 등록하고 지원신청서를 작성합니다.
2. 기관관리자가 대상자의 담당자 및 부담당자를 지정합니다.
3. 기관담당자가 지원신청서와 상담기록을 바탕으로 우선순위를 설정합니다.
4. 기관관리자가 우선순위를 승인합니다.
5. 기관담당자가 지원계획을 작성하고 승인 요청 결재를 상신합니다.
6. 기관관리자가 지원계획을 승인 혹은 반려합니다.
7. 기관담당자가 지원결과를 작성하고 승인 요청 결재를 상신합니다.
8. 기관관리자가 지원결과를 승인 혹은 반려합니다.
9. 각 단계별로 첨부파일과 수정이력을 함께 관리합니다.
    
---

## 출처
- 로고 이미지: [Freepik](https://www.freepik.com/) (Designed by Freepik)
