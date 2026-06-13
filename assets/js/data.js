// Demo data used by the static DKU Ski Team site.
// Keep this file free of DOM code so it can later move to Firebase/Firestore seed data.

export const members = [
      { group: "yb", name: "정민찬", role: "주장", major: "전자전기공학부", generation: "40기", year: "2학년", intro: "스키부의 운영과 시즌 준비를 체계적으로 정리하고 있습니다.", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=500&auto=format&fit=crop" },
      { group: "yb", name: "정선유", role: "부주장", major: "단국대학교", generation: "40기", year: "재학생", intro: "부원들이 안정적으로 시즌에 적응할 수 있도록 운영을 지원합니다.", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=500&auto=format&fit=crop" },
      { group: "yb", name: "신정우", role: "훈련팀장", major: "단국대학교", generation: "40기", year: "재학생", intro: "겨울 시즌 훈련과 안전한 슬로프 문화를 중심으로 활동합니다.", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=500&auto=format&fit=crop" },
      { group: "yb", name: "김단국", role: "미디어", major: "미디어커뮤니케이션", generation: "41기", year: "1학년", intro: "스키부의 활동을 사진과 영상으로 기록합니다.", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500&auto=format&fit=crop" },
      { group: "ob", name: "강현리", role: "OB", major: "Alumni", generation: "OB", year: "졸업생", intro: "후배들이 좋은 시즌을 보낼 수 있도록 OB 네트워크와 지원 방향을 함께 고민합니다.", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=500&auto=format&fit=crop" },
      { group: "ob", name: "박기원", role: "OB", major: "Alumni", generation: "OB", year: "졸업생", intro: "스키부의 전통이 다음 세대로 이어질 수 있도록 응원합니다.", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=500&auto=format&fit=crop" },
      { group: "ob", name: "OB 선배", role: "Alumni", major: "Alumni", generation: "OB", year: "졸업생", intro: "합숙, 장비, 대회 경험을 후배들과 공유합니다.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500&auto=format&fit=crop" },
      { group: "ob", name: "졸업생 네트워크", role: "Alumni", major: "Alumni", generation: "OB", year: "졸업생", intro: "YB와 OB를 연결하는 교류 구조를 만들어갑니다.", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=500&auto=format&fit=crop" }
    ];

export const adminRequests = [
      { id: "r1", type: "membership", title: "신규 입부 신청", target: "박슬로프", desc: "41기 예정 부원이 입부 신청서를 제출했습니다.", status: "pending", date: "2026-05-20", detail: "학번: 3226XXXX\n학과: 스포츠과학과\n학년: 1학년\n연락처: 010-0000-0000\n이메일: slope@example.com\n스키 경험: 초보\n지원 동기: 스키를 체계적으로 배우고 겨울 합숙에 참여하고 싶습니다.", application: { name: "박슬로프", studentId: "3226XXXX", department: "스포츠과학과", year: "1학년", phone: "010-0000-0000", email: "slope@example.com", experience: "초보", motivation: "스키를 체계적으로 배우고 겨울 합숙에 참여하고 싶습니다.", privacyConsent: "동의", submittedAt: "2026-05-20 10:00" }, memo: "신입 오리엔테이션 안내 필요" },
      { id: "r2", type: "document", title: "서류 확인 필요", target: "김단국 · 최스키", desc: "2명의 부원이 재학증명서 또는 보험 확인 서류를 제출해야 합니다.", status: "pending", date: "2026-05-22", detail: "김단국: 재학증명서 누락 / 최스키: 보험 가입 확인 필요", memo: "합숙 전 확인" },
      { id: "r3", type: "profile", title: "프로필 업데이트", target: "정선유", desc: "부주장 프로필 소개 문구 수정 요청입니다.", status: "review", date: "2026-05-25", detail: "소개 문구와 활동 역할 업데이트 요청", memo: "공개 페이지 반영 전 검토" },
      { id: "r4", type: "archive", title: "OB 전환 요청", target: "15명 일괄 전환", desc: "시즌 종료에 따른 YB → OB 상태 전환 요청입니다.", status: "review", date: "2026-06-01", detail: "2025년도 활동 종료자 15명 일괄 전환", memo: "졸업 여부 확인 후 승인" }
    ];

export const adminMembers = [
      { id: "m1", name: "정민찬", generation: "40기", role: "주장", major: "전자전기공학부", phone: "010-0000-0000", status: "yb", level: "Intermediate", studentId: "32224111", memo: "시즌 운영 및 웹사이트 관리" },
      { id: "m2", name: "정선유", generation: "40기", role: "부주장", major: "단국대학교", phone: "010-0000-0000", status: "yb", level: "Intermediate", studentId: "미공개", memo: "부원 관리 및 운영 지원" },
      { id: "m3", name: "신정우", generation: "40기", role: "훈련팀장", major: "단국대학교", phone: "010-0000-0000", status: "yb", level: "Advanced", studentId: "미공개", memo: "훈련 일정 및 안전 관리" },
      { id: "m4", name: "김단국", generation: "41기", role: "미디어", major: "미디어커뮤니케이션", phone: "010-1234-5678", status: "yb", level: "Beginner", studentId: "미공개", memo: "활동 사진 및 영상 기록" },
      { id: "m5", name: "강현리", generation: "OB", role: "OB", major: "Alumni", phone: "010-0000-0000", status: "ob", level: "Alumni", studentId: "졸업생", memo: "OB 네트워크 및 후배 지원 논의" },
      { id: "m6", name: "박기원", generation: "OB", role: "OB", major: "Alumni", phone: "010-0000-0000", status: "ob", level: "Alumni", studentId: "졸업생", memo: "40주년 행사 및 합숙 지원 논의" },
      { id: "m7", name: "박슬로프", generation: "41기 예정", role: "신입 신청자", major: "컴퓨터공학과", phone: "010-3456-7890", status: "pending", level: "Beginner", studentId: "32410000", memo: "입부 신청. 오리엔테이션 참석 예정" }
    ];

export const archiveRecords = [
      {
        id: "a1",
        category: "training",
        title: "2026 동계 집중 훈련 하이라이트",
        desc: "용평리조트 동계 합숙 중 진행한 알파인 훈련 기록입니다. 참여 부원별 태그와 공개 범위를 함께 관리합니다.",
        date: "2026-01-15",
        season: "25/26 시즌",
        location: "용평리조트",
        authorId: "m4",
        participantIds: ["m1", "m2", "m3", "m4"],
        visibility: "public",
        image: "https://images.unsplash.com/photo-1614358536373-1ce27819009e?q=80&w=1200&auto=format&fit=crop",
        tags: ["Yongpyong", "YB", "Training"]
      },
      {
        id: "a2",
        category: "trip",
        title: "시즌 킥오프 MT",
        desc: "신입 부원 환영과 시즌 준비를 위한 MT 기록입니다. 참여 여부와 사진 사용를 행사 기록과 함께 확인할 수 있습니다.",
        date: "2025-12-10",
        season: "25/26 시즌",
        location: "단국대학교",
        authorId: "m1",
        participantIds: ["m1", "m2", "m4", "m7"],
        visibility: "members",
        image: "https://images.unsplash.com/photo-1487730116645-74489c95b41b?q=80&w=1200&auto=format&fit=crop",
        tags: ["MT", "Social"]
      },
      {
        id: "a3",
        category: "ob",
        title: "창립 기념 선배님들의 밤",
        desc: "YB와 OB가 함께 모여 스키부의 역사, 시즌 운영, 후배 지원 방향을 논의한 교류 행사입니다.",
        date: "2025-11-05",
        season: "25/26 시즌",
        location: "서울",
        authorId: "m2",
        participantIds: ["m1", "m5", "m6"],
        visibility: "public",
        image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1200&auto=format&fit=crop",
        tags: ["OB", "Networking"]
      },
      {
        id: "a4",
        category: "competition",
        title: "전국 대학생 스키 대회",
        desc: "대학스키연맹 대회 참가 기록입니다. 대회 결과, 사진, 영상, 참가자 소감을 상세 페이지에 정리할 수 있습니다.",
        date: "2025-02-20",
        season: "24/25 시즌",
        location: "스키장",
        authorId: "m3",
        participantIds: ["m1", "m3"],
        visibility: "public",
        image: "https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=1200&auto=format&fit=crop",
        tags: ["Tournament", "Alpine"]
      }
    ];
