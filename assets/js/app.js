import { members, adminRequests as seedAdminRequests, adminMembers as seedAdminMembers, archiveRecords as seedArchiveRecords } from './data.js';

const pages = ["home", "about", "recruitment", "archive", "members", "admin", "contact"];
    const pageButtons = document.querySelectorAll(".page-link");
    const navLinks = document.querySelectorAll(".nav-link");
    const mobileMenu = document.getElementById("mobile-menu");
    const mobileMenuButton = document.getElementById("mobile-menu-button");
    const ADMIN_AUTH_STORAGE_KEY = "dku-ski-admin-auth";
    const ADMIN_MEMBERS_STORAGE_KEY = "dku-ski-admin-members";
    const ADMIN_REQUESTS_STORAGE_KEY = "dku-ski-admin-requests";
    const ADMIN_ARCHIVE_STORAGE_KEY = "dku-ski-admin-archive-records";
    let isAdminLoggedIn = false;

    function loadJsonStorage(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : fallback;
      } catch {
        return fallback;
      }
    }

    function saveJsonStorage(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // Storage can be unavailable in some private browsing contexts.
      }
    }

    function escapeHtml(value = "") {
      return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }

    function showToast(message, tone = "info") {
      const stack = document.getElementById("toast-stack");
      if (!stack) return;
      const toneClass = tone === "success" ? "border-green-200 bg-green-50 text-green-800" : tone === "danger" ? "border-red-200 bg-red-50 text-red-800" : "border-gray-200 bg-white text-on-surface";
      const toast = document.createElement("div");
      toast.className = `toast-item rounded-2xl border shadow-lg px-5 py-4 text-sm font-semibold ${toneClass}`;
      toast.textContent = message;
      stack.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(8px)";
        toast.style.transition = "opacity .18s ease, transform .18s ease";
        setTimeout(() => toast.remove(), 220);
      }, 2600);
    }

    function showPage(page, options = {}) {
      if (!pages.includes(page)) page = "home";

      if (page === "admin" && !isAdminLoggedIn) {
        page = "home";
        requestAnimationFrame(() => openLoginModal());
      }

      document.querySelectorAll(".page").forEach((section) => section.classList.remove("active"));
      document.getElementById("page-" + page).classList.add("active");

      navLinks.forEach((link) => {
        link.classList.toggle("active", link.dataset.page === page);
      });

      document.querySelectorAll("#mobile-menu .page-link").forEach((link) => {
        const isActive = link.dataset.page === page;
        link.classList.toggle("text-primary", isActive);
        link.classList.toggle("text-on-surface-variant", !isActive);
      });

      document.body.classList.toggle("page-recruitment-active", page === "recruitment");

      if (mobileMenu) mobileMenu.classList.remove("open");
      if (mobileMenuButton) mobileMenuButton.setAttribute("aria-expanded", "false");

      if (!options.skipScroll) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      if (!options.keepHash) {
        history.replaceState(null, "", "#" + page);
      }
    }

    function openHash(hash) {
      if (!hash) {
        showPage("home");
        return;
      }

      if (hash === "identity") {
        showPage("about");
        return;
      }

      if (hash === "ob") {
        showPage("members");
        return;
      }

      if (hash === "apply-form") {
        showPage("recruitment", { skipScroll: true, keepHash: true });
        requestAnimationFrame(() => {
          document.getElementById("apply-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        return;
      }

      showPage(hash);
    }

    pageButtons.forEach((element) => {
      element.addEventListener("click", (event) => {
        event.preventDefault();
        showPage(element.dataset.page);
      });
    });

    mobileMenuButton.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("open");
      mobileMenuButton.setAttribute("aria-expanded", String(isOpen));
    });

    window.addEventListener("load", () => {
      openHash(location.hash.replace("#", ""));
    });

    window.addEventListener("hashchange", () => {
      openHash(location.hash.replace("#", ""));
    });

    let currentArchiveCategory = "all";
    let currentArchiveYear = "all";
    let currentArchiveVisibility = "all";
    let currentAdminArchiveFilter = "all";
    let editingArchiveId = null;

    const loginModal = document.getElementById("login-modal");
    const loginButton = document.getElementById("login-button");
    const mobileLoginButton = document.getElementById("mobile-login-button");
    const loginModalClose = document.getElementById("login-modal-close");
    const adminLoginOption = document.getElementById("admin-login-option");
    const memberLoginOption = document.getElementById("member-login-option");
    const adminLockedLoginButton = document.getElementById("admin-locked-login-button");

    function openLoginModal() {
      loginModal.classList.add("open");
      if (mobileMenu) mobileMenu.classList.remove("open");
      if (mobileMenuButton) mobileMenuButton.setAttribute("aria-expanded", "false");
    }

    function closeLoginModal() {
      loginModal.classList.remove("open");
    }

    function setAdminState(loggedIn, options = {}) {
      isAdminLoggedIn = loggedIn;
      if (!options.skipPersist) {
        try {
          localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, loggedIn ? "true" : "false");
        } catch {}
      }

      document.querySelectorAll(".admin-only").forEach((el) => el.classList.toggle("hidden", !loggedIn));
      document.getElementById("admin-content")?.classList.toggle("hidden", !loggedIn);
      document.getElementById("admin-locked")?.classList.toggle("hidden", loggedIn);

      if (loginButton) loginButton.textContent = loggedIn ? "관리자 페이지" : "로그인";
      if (mobileLoginButton) mobileLoginButton.textContent = loggedIn ? "회원 관리" : "로그인";

      if (loggedIn) renderAdminDashboard();
    }

    loginButton?.addEventListener("click", () => {
      if (isAdminLoggedIn) showPage("admin");
      else openLoginModal();
    });

    mobileLoginButton?.addEventListener("click", () => {
      if (isAdminLoggedIn) showPage("admin");
      else openLoginModal();
    });

    adminLockedLoginButton?.addEventListener("click", openLoginModal);

    adminLoginOption?.addEventListener("click", () => {
      setAdminState(true);
      closeLoginModal();
      showPage("admin");
      showToast("관리자 모드로 전환했습니다.", "success");
    });

    memberLoginOption?.addEventListener("click", () => {
      closeLoginModal();
      showToast("부원 로그인 기능은 아직 실제 인증과 연결되지 않았습니다.");
    });

    loginModalClose?.addEventListener("click", closeLoginModal);
    loginModal?.addEventListener("click", (event) => {
      if (event.target === loginModal) closeLoginModal();
    });

    const modal = document.getElementById("archive-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalDesc = document.getElementById("modal-desc");
    const modalClose = document.getElementById("modal-close");

    modalClose.addEventListener("click", () => modal.classList.remove("open"));
    modal.addEventListener("click", (event) => {
      if (event.target === modal) modal.classList.remove("open");
    });
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        modal.classList.remove("open");
        loginModal.classList.remove("open");
        document.getElementById("admin-member-modal")?.classList.remove("open");
        document.getElementById("admin-archive-modal")?.classList.remove("open");
      }
    });

    let currentMemberGroup = "yb";
    const memberGrid = document.getElementById("member-grid");
    const memberSearch = document.getElementById("member-search");

    function renderMembers() {
      const query = (memberSearch.value || "").trim().toLowerCase();
      const filtered = members.filter((member) => {
        const text = Object.values(member).join(" ").toLowerCase();
        return member.group === currentMemberGroup && (!query || text.includes(query));
      });

      memberGrid.innerHTML = filtered.map((member) => `
        <article class="glass-card rounded-xl border border-gray-200 overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,60,117,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,60,117,0.1)] transition-all duration-300 group flex flex-col">
          <div class="p-6 flex items-start gap-4 border-b border-gray-100 relative">
            <div class="absolute top-4 right-4">
              <span class="px-2.5 py-1 rounded-full ${member.group === "ob" ? "bg-gold-muted/20 text-[#6b4f23]" : "bg-blue-100 text-primary-dark"} text-[10px] tracking-wider shadow-sm font-bold">${member.role}</span>
            </div>
            <img alt="${member.name} 프로필 이미지" class="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm z-10" src="${member.img}">
            <div class="pt-1 z-10">
              <h3 class="text-[18px] font-semibold text-gray-900 leading-tight group-hover:text-primary transition-colors">${member.name}</h3>
              <p class="text-sm text-on-surface-variant mt-1 flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[14px]">school</span>${member.major}
              </p>
            </div>
          </div>
          <div class="p-6 flex-grow bg-gray-50/50">
            <div class="flex flex-wrap gap-2 mb-4">
              <span class="px-2 py-1 rounded bg-white border border-gray-200 text-xs font-medium text-gray-600 shadow-sm">${member.generation}</span>
              <span class="px-2 py-1 rounded bg-white border border-gray-200 text-xs font-medium text-gray-600 shadow-sm">${member.year}</span>
            </div>
            <p class="text-sm text-on-surface-variant leading-relaxed italic">"${member.intro}"</p>
          </div>
        </article>
      `).join("");
    }

    document.querySelectorAll(".member-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".member-tab").forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        currentMemberGroup = tab.dataset.memberGroup;
        renderMembers();
      });
    });

    memberSearch.addEventListener("input", renderMembers);
    renderMembers();

    const adminRequests = JSON.parse(JSON.stringify(seedAdminRequests));
    let adminMembers = JSON.parse(JSON.stringify(seedAdminMembers));
    let archiveRecords = JSON.parse(JSON.stringify(seedArchiveRecords));

    let currentAdminRequestFilter = "all";
    let currentAdminMemberFilter = "all";
    let editingAdminMemberId = null;

    const defaultAdminRequests = JSON.parse(JSON.stringify(adminRequests));
    const defaultAdminMembers = JSON.parse(JSON.stringify(adminMembers));
    const defaultArchiveRecords = JSON.parse(JSON.stringify(archiveRecords));

    function hydrateAdminData() {
      const storedRequests = loadJsonStorage(ADMIN_REQUESTS_STORAGE_KEY, null);
      const storedMembers = loadJsonStorage(ADMIN_MEMBERS_STORAGE_KEY, null);
      const storedArchiveRecords = loadJsonStorage(ADMIN_ARCHIVE_STORAGE_KEY, null);

      if (storedRequests) {
        adminRequests.splice(0, adminRequests.length, ...storedRequests);
      }

      if (storedMembers) {
        adminMembers = storedMembers;
      }

      if (storedArchiveRecords) {
        archiveRecords = storedArchiveRecords;
      }
    }

    function saveAdminData() {
      saveJsonStorage(ADMIN_REQUESTS_STORAGE_KEY, adminRequests);
      saveJsonStorage(ADMIN_MEMBERS_STORAGE_KEY, adminMembers);
      saveJsonStorage(ADMIN_ARCHIVE_STORAGE_KEY, archiveRecords);
    }

    function todayString() {
      return new Date().toISOString().slice(0, 10);
    }

    function applicationReceiptId(seed) {
      return `DKU-${todayString().replace(/-/g, "")}-${String(seed).slice(-5)}`;
    }

    function renderApplicationReceipt(application) {
      const receipt = document.getElementById("application-receipt");
      if (!receipt) return;

      receipt.classList.remove("hidden");
      receipt.innerHTML = `
        <div class="flex flex-col md:flex-row md:items-start justify-between gap-5">
          <div>
            <div class="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold text-primary border border-primary-light mb-4">
              <span class="material-symbols-outlined text-[16px]">check_circle</span>
              신청 접수 완료
            </div>
            <h3 class="text-xl font-extrabold text-primary-dark mb-2">${escapeHtml(application.name)} 님의 지원서가 접수되었습니다.</h3>
            <p class="text-sm leading-relaxed text-on-surface-variant">
              데모 환경에서는 관리자 승인 대기 목록에 바로 반영됩니다. 실제 배포 시에는 입력한 연락처로 면담 또는 오리엔테이션 안내가 발송됩니다.
            </p>
          </div>
          <div class="rounded-xl bg-white border border-gray-200 p-4 min-w-[220px]">
            <div class="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">신청 번호</div>
            <div class="text-lg font-extrabold text-primary-dark">${escapeHtml(application.receiptId)}</div>
            <div class="text-xs text-on-surface-variant mt-2">${escapeHtml(application.submittedAt)}</div>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
          <div class="rounded-xl bg-white border border-gray-200 p-4">
            <div class="text-[11px] font-bold text-on-surface-variant mb-1">학과 / 학년</div>
            <div class="text-sm font-semibold text-primary-dark">${escapeHtml(application.department)} · ${escapeHtml(application.year)}</div>
          </div>
          <div class="rounded-xl bg-white border border-gray-200 p-4">
            <div class="text-[11px] font-bold text-on-surface-variant mb-1">스키 숙련도</div>
            <div class="text-sm font-semibold text-primary-dark">${escapeHtml(application.experience)}</div>
          </div>
          <div class="rounded-xl bg-white border border-gray-200 p-4">
            <div class="text-[11px] font-bold text-on-surface-variant mb-1">처리 상태</div>
            <div class="text-sm font-semibold text-primary-dark">관리자 승인 대기</div>
          </div>
        </div>
      `;
      receipt.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function statusBadge(status) {
      const map = {
        yb: ["활동 중 (YB)", "bg-green-100 text-green-700"],
        ob: ["OB", "bg-gold-muted/20 text-[#6b4f23]"],
        pending: ["승인 대기", "bg-red-50 text-red-700"],
        review: ["검토 중", "bg-blue-100 text-primary"],
        approved: ["승인 완료", "bg-green-100 text-green-700"],
        rejected: ["거절", "bg-gray-100 text-on-surface-variant"]
      };
      const value = map[status] || ["미분류", "bg-gray-100 text-on-surface-variant"];
      return `<span class="px-3 py-1 rounded-full text-xs font-semibold ${value[1]}">${value[0]}</span>`;
    }

    function typeBadge(type) {
      const map = {
        membership: ["가입 신청", "person_add", "bg-primary-light/60 text-primary"],
        profile: ["프로필 수정", "manage_accounts", "bg-blue-100 text-primary-dark"],
        document: ["서류 확인", "priority_high", "bg-red-50 text-red-700"],
        archive: ["상태 전환", "history", "bg-gray-100 text-on-surface-variant"]
      };
      return map[type] || ["요청", "assignment", "bg-gray-100 text-on-surface-variant"];
    }

    function renderApplicationDetail(request) {
      const app = request.application;
      if (!app) {
        return `
          <div class="space-y-2">
            <h4 class="text-xs font-bold text-primary uppercase tracking-wider">상세 정보</h4>
            <p class="text-sm text-on-surface-variant whitespace-pre-line">${escapeHtml(request.detail)}</p>
          </div>
        `;
      }

      const fields = [
        ["신청 번호", app.receiptId || request.receiptId],
        ["성명", app.name],
        ["학번", app.studentId],
        ["학과", app.department],
        ["학년", app.year],
        ["연락처", app.phone],
        ["이메일", app.email],
        ["스키 숙련도", app.experience],
        ["개인정보 동의", app.privacyConsent],
        ["제출 시각", app.submittedAt]
      ];

      return `
        <div class="space-y-5">
          <div class="flex items-center justify-between gap-4">
            <h4 class="text-xs font-bold text-primary uppercase tracking-wider">입부 신청서 상세 내용</h4>
            <span class="px-3 py-1 rounded-full bg-blue-100 text-primary-dark text-xs font-bold">Recruitment Form</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${fields.map(([label, value]) => `
              <div class="bg-white rounded-xl border border-gray-200 p-4">
                <div class="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">${escapeHtml(label)}</div>
                <div class="text-sm font-semibold text-primary-dark break-words">${escapeHtml(value || "미입력")}</div>
              </div>
            `).join("")}
          </div>
          <div class="bg-white rounded-xl border border-gray-200 p-4">
            <div class="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">지원 동기</div>
            <p class="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">${escapeHtml(app.motivation || "미입력")}</p>
          </div>
        </div>
      `;
    }

    const archiveCategoryMap = {
      training: ["훈련", "bg-blue-100 text-primary-dark"],
      trip: ["MT/여행", "bg-primary-light/60 text-primary"],
      competition: ["대회", "bg-red-50 text-red-700"],
      ob: ["OB", "bg-gold-muted/20 text-[#6b4f23]"]
    };

    const archiveVisibilityMap = {
      public: ["외부 공개", "bg-green-100 text-green-700"],
      members: ["부원 공개", "bg-blue-100 text-primary"],
      admin: ["관리자 공개", "bg-gray-100 text-on-surface-variant"]
    };

    function getMemberRecord(id) {
      return adminMembers.find((member) => member.id === id) || null;
    }

    function getMemberName(id) {
      return getMemberRecord(id)?.name || id || "미지정";
    }

    function getArchiveCategoryLabel(category) {
      return archiveCategoryMap[category]?.[0] || "기록";
    }

    function getArchiveVisibilityLabel(visibility) {
      return archiveVisibilityMap[visibility]?.[0] || "미지정";
    }

    function badge(label, className) {
      return `<span class="px-3 py-1 rounded-full text-xs font-bold ${className}">${escapeHtml(label)}</span>`;
    }

    function renderArchiveYearOptions() {
      const select = document.getElementById("archive-year-filter");
      if (!select) return;
      const years = [...new Set(archiveRecords.map((record) => String(record.date || "").slice(0, 4)).filter(Boolean))].sort((a, b) => b.localeCompare(a));
      const current = select.value || "all";
      select.innerHTML = `<option value="all">전체 연도</option>${years.map((year) => `<option value="${escapeHtml(year)}">${escapeHtml(year)}</option>`).join("")}`;
      select.value = years.includes(current) ? current : "all";
    }

    function visibleArchiveRecords() {
      const query = (document.getElementById("archive-search")?.value || "").trim().toLowerCase();
      return archiveRecords.filter((record) => {
        if (!isAdminLoggedIn && record.visibility === "admin") return false;
        const recordYear = String(record.date || "").slice(0, 4);
        const matchesCategory = currentArchiveCategory === "all" || record.category === currentArchiveCategory;
        const matchesYear = currentArchiveYear === "all" || recordYear === currentArchiveYear;
        const matchesVisibility = currentArchiveVisibility === "all" || record.visibility === currentArchiveVisibility;
        const participantNames = (record.participantIds || []).map(getMemberName).join(" ");
        const text = [record.title, record.desc, record.location, record.season, record.tags?.join(" "), participantNames, getMemberName(record.authorId)].join(" ").toLowerCase();
        return matchesCategory && matchesYear && matchesVisibility && (!query || text.includes(query));
      });
    }

    function renderArchiveGrid() {
      const grid = document.getElementById("archive-grid");
      if (!grid) return;

      renderArchiveYearOptions();
      const records = visibleArchiveRecords();

      if (!records.length) {
        grid.innerHTML = `<div class="col-span-full bg-white rounded-3xl border border-gray-200 p-10 text-center text-on-surface-variant">조건에 맞는 활동 기록이 없습니다.</div>`;
        return;
      }

      grid.innerHTML = records.map((record) => {
        const [categoryLabel, categoryClass] = archiveCategoryMap[record.category] || ["기록", "bg-gray-100 text-on-surface-variant"];
        const [visibilityLabel, visibilityClass] = archiveVisibilityMap[record.visibility] || ["미지정", "bg-gray-100 text-on-surface-variant"];
        const participantNames = (record.participantIds || []).map(getMemberName);
        const imageBlock = record.image
          ? `<img alt="${escapeHtml(record.title)}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="${escapeHtml(record.image)}" />`
          : `<div class="w-full h-full grid place-items-center bg-surface-container-low text-on-surface-variant text-center p-6"><div><span class="material-symbols-outlined text-5xl text-primary mb-3">image</span><p class="font-semibold">대표 이미지 없음</p></div></div>`;

        return `
          <article class="archive-card bg-white rounded-xl border border-gray-200 overflow-hidden card-hover group cursor-pointer flex flex-col h-full" data-archive-id="${escapeHtml(record.id)}">
            <div class="relative h-48 sm:h-56 overflow-hidden bg-gray-100">
              ${imageBlock}
              <div class="absolute top-4 left-4 flex flex-wrap gap-2">
                ${badge(categoryLabel, categoryClass)}
                ${badge(visibilityLabel, visibilityClass)}
              </div>
            </div>
            <div class="p-6 flex flex-col flex-grow">
              <div class="flex items-center gap-2 text-on-surface-variant mb-2">
                <span class="material-symbols-outlined text-sm">calendar_month</span>
                <span class="text-sm font-medium">${escapeHtml(record.date || "날짜 미정")}</span>
              </div>
              <h3 class="text-[20px] font-semibold text-primary-dark mb-2">${escapeHtml(record.title)}</h3>
              <p class="text-on-surface-variant text-sm mb-4 flex-grow">${escapeHtml(record.desc)}</p>
              <div class="flex flex-wrap gap-2 mt-auto mb-4">
                <span class="px-2 py-1 bg-gray-100 text-on-surface-variant text-xs rounded font-medium">작성자 ${escapeHtml(getMemberName(record.authorId))}</span>
                <span class="px-2 py-1 bg-gray-100 text-on-surface-variant text-xs rounded font-medium">참여 ${participantNames.length}명</span>
              </div>
              <div class="flex flex-wrap gap-2">
                ${(record.tags || []).slice(0, 3).map((tag) => `<span class="px-2 py-1 bg-blue-100/70 text-primary-dark text-xs rounded font-medium">#${escapeHtml(tag)}</span>`).join("")}
              </div>
            </div>
          </article>
        `;
      }).join("");
    }

    function openArchiveDetail(recordId) {
      const record = archiveRecords.find((item) => item.id === recordId);
      if (!record) return;

      const modalMedia = document.getElementById("modal-media");
      const modalMeta = document.getElementById("modal-meta");
      const modalParticipants = document.getElementById("modal-participants");
      const modalTags = document.getElementById("modal-tags");
      const [categoryLabel, categoryClass] = archiveCategoryMap[record.category] || ["기록", "bg-gray-100 text-on-surface-variant"];
      const [visibilityLabel, visibilityClass] = archiveVisibilityMap[record.visibility] || ["미지정", "bg-gray-100 text-on-surface-variant"];

      modalTitle.textContent = record.title;
      modalDesc.textContent = record.desc;
      modalMedia.innerHTML = record.image
        ? `<img alt="${escapeHtml(record.title)}" class="w-full h-full object-cover" src="${escapeHtml(record.image)}" />`
        : `<div class="text-center p-6"><span class="material-symbols-outlined text-5xl text-primary mb-3">image</span><p class="font-semibold">대표 이미지가 없습니다.</p></div>`;

      modalMeta.innerHTML = [
        ["활동일", record.date || "미정"],
        ["시즌", record.season || "미정"],
        ["장소", record.location || "미정"],
        ["작성자", getMemberName(record.authorId)]
      ].map(([label, value]) => `
        <div class="bg-surface-container-low rounded-xl border border-gray-200 p-4">
          <div class="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">${escapeHtml(label)}</div>
          <div class="text-sm font-semibold text-primary-dark">${escapeHtml(value)}</div>
        </div>
      `).join("");

      modalParticipants.innerHTML = `<span class="text-sm font-bold text-primary-dark mr-1">참여 부원</span>` + (record.participantIds || []).map((id) => {
        const member = getMemberRecord(id);
        const label = member ? `${member.name} · ${member.generation}` : id;
        return `<span class="px-3 py-1 rounded-full bg-white border border-gray-200 text-xs font-semibold text-on-surface-variant">${escapeHtml(label)}</span>`;
      }).join("");

      modalTags.innerHTML = [
        badge(categoryLabel, categoryClass),
        badge(visibilityLabel, visibilityClass),
        ...(record.tags || []).map((tag) => badge("#" + tag, "bg-blue-100/70 text-primary-dark"))
      ].join("");

      modal.classList.add("open");
    }

    function renderAdminStats() {
      document.getElementById("admin-stat-total").textContent = String(adminMembers.length);
      document.getElementById("admin-stat-pending").textContent = String(adminRequests.filter((request) => request.status === "pending" || request.status === "review").length);
      document.getElementById("admin-stat-yb").textContent = String(adminMembers.filter((member) => member.status === "yb").length);
      document.getElementById("admin-stat-ob").textContent = String(adminMembers.filter((member) => member.status === "ob").length);
    }

    function renderAdminRequests() {
      const table = document.getElementById("admin-request-table");
      if (!table) return;

      const query = (document.getElementById("admin-request-search")?.value || "").trim().toLowerCase();
      const filtered = adminRequests.filter((request) => {
        const matchesFilter = currentAdminRequestFilter === "all" || request.type === currentAdminRequestFilter;
        const text = JSON.stringify(request).toLowerCase();
        return matchesFilter && (!query || text.includes(query));
      });

      if (!filtered.length) {
        table.innerHTML = `<tr><td class="px-6 py-10 text-center text-on-surface-variant" colspan="4">표시할 요청이 없습니다.</td></tr>`;
        return;
      }

      table.innerHTML = filtered.map((request) => {
        const [label, icon, badgeClass] = typeBadge(request.type);
        const isClosed = request.status === "approved" || request.status === "rejected";
        return `
          <tr class="hover:bg-gray-50/70 transition-colors">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <button type="button" class="admin-request-toggle material-symbols-outlined text-on-surface-variant/60 hover:text-primary transition-transform" data-request-id="${escapeHtml(request.id)}" aria-label="상세 열기">chevron_right</button>
                <div class="w-10 h-10 rounded-full ${badgeClass} flex items-center justify-center">
                  <span class="material-symbols-outlined text-[20px]">${icon}</span>
                </div>
                <div>
                  <div class="font-semibold text-on-surface">${escapeHtml(request.title)}</div>
                  <div class="text-xs text-on-surface-variant">${escapeHtml(label)} · ${escapeHtml(request.date)}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-on-surface-variant">
              <span class="font-semibold text-primary-dark">${escapeHtml(request.target)}</span> — ${escapeHtml(request.desc)}
            </td>
            <td class="px-6 py-4">${statusBadge(request.status)}</td>
            <td class="px-6 py-4 text-right">
              <div class="flex justify-end gap-2">
                <button type="button" class="admin-request-approve px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed" data-request-id="${escapeHtml(request.id)}" ${isClosed ? "disabled" : ""}>승인</button>
                <button type="button" class="admin-request-reject px-3 py-1.5 border border-gray-200 text-on-surface-variant text-xs font-bold rounded-lg hover:bg-gray-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed" data-request-id="${escapeHtml(request.id)}" ${isClosed ? "disabled" : ""}>거절</button>
              </div>
            </td>
          </tr>
          <tr class="admin-request-detail bg-gray-50/50 hidden" data-request-detail="${escapeHtml(request.id)}">
            <td class="px-6 py-6 border-b border-gray-200" colspan="4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  ${renderApplicationDetail(request)}
                </div>
                <div class="space-y-2">
                  <h4 class="text-xs font-bold text-primary uppercase tracking-wider">관리자 메모</h4>
                  <textarea class="admin-request-memo-input w-full mt-2 p-3 bg-white border border-gray-200 rounded-lg text-sm text-on-surface-variant focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none" data-request-id="${escapeHtml(request.id)}" rows="2">${escapeHtml(request.memo)}</textarea>
                </div>
              </div>
            </td>
          </tr>
        `;
      }).join("");
    }

    function renderAdminMembers() {
      const table = document.getElementById("admin-member-table");
      if (!table) return;

      const query = (document.getElementById("admin-member-search")?.value || "").trim().toLowerCase();
      const filtered = adminMembers.filter((member) => {
        const matchesFilter = currentAdminMemberFilter === "all" || member.status === currentAdminMemberFilter;
        const text = Object.values(member).join(" ").toLowerCase();
        return matchesFilter && (!query || text.includes(query));
      });

      if (!filtered.length) {
        table.innerHTML = `<tr><td class="px-6 py-10 text-center text-on-surface-variant" colspan="6">표시할 부원이 없습니다.</td></tr>`;
        return;
      }

      table.innerHTML = filtered.map((member) => {
        const initial = escapeHtml((member.name || "?").trim()[0] || "?");
        const memberId = escapeHtml(member.id);
        const phone = escapeHtml(member.phone);
        const isPending = member.status === "pending";
        return `
          <tr class="hover:bg-gray-50/70 transition-colors">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <button type="button" class="admin-member-toggle material-symbols-outlined text-on-surface-variant/60 hover:text-primary transition-transform" data-member-id="${memberId}" aria-label="상세 열기">chevron_right</button>
                <div class="w-10 h-10 rounded-full ${member.status === "ob" ? "bg-gold-muted/20 text-[#6b4f23]" : member.status === "pending" ? "bg-gray-100 text-on-surface-variant" : member.status === "rejected" ? "bg-red-50 text-red-700" : "bg-blue-100 text-primary"} flex items-center justify-center font-bold">${initial}</div>
                <div>
                  <div class="font-semibold text-on-surface">${escapeHtml(member.name)}</div>
                  <button type="button" class="admin-copy-phone text-xs text-on-surface-variant flex items-center gap-1 hover:text-primary transition-colors" data-phone="${phone}">
                    <span class="material-symbols-outlined text-[12px]">content_copy</span>${phone}
                  </button>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-on-surface-variant">${escapeHtml(member.generation)}</td>
            <td class="px-6 py-4 text-sm font-medium text-primary-dark">${escapeHtml(member.role)}</td>
            <td class="px-6 py-4 text-sm text-on-surface-variant">${escapeHtml(member.major)}</td>
            <td class="px-6 py-4">${statusBadge(member.status)}</td>
            <td class="px-6 py-4 text-right">
              <div class="flex justify-end gap-2">
                ${isPending ? `<button type="button" class="admin-member-approve px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all" data-member-id="${memberId}">승인</button>` : ""}
                <button type="button" class="admin-member-edit p-2 text-on-surface-variant hover:text-primary hover:bg-primary-light/20 rounded-lg transition-all" data-member-id="${memberId}" aria-label="수정">
                  <span class="material-symbols-outlined text-[20px]">edit</span>
                </button>
                <button type="button" class="admin-member-delete p-2 text-on-surface-variant hover:text-red-700 hover:bg-red-50 rounded-lg transition-all" data-member-id="${memberId}" aria-label="삭제">
                  <span class="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>
            </td>
          </tr>
          <tr class="admin-member-detail bg-gray-50/50 hidden" data-member-detail="${memberId}">
            <td class="px-6 py-6 border-b border-gray-200" colspan="6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <h4 class="text-xs font-bold text-primary uppercase tracking-wider">상세 정보</h4>
                  <div class="text-sm text-on-surface-variant"><span class="font-semibold">학번:</span> ${escapeHtml(member.studentId)}</div>
                  <div class="text-sm text-on-surface-variant"><span class="font-semibold">스키 레벨:</span> ${escapeHtml(member.level)}</div>
                </div>
                <div class="space-y-2">
                  <h4 class="text-xs font-bold text-primary uppercase tracking-wider">관리자 메모</h4>
                  <textarea class="admin-member-memo-input w-full mt-2 p-3 bg-white border border-gray-200 rounded-lg text-sm text-on-surface-variant focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none" data-member-id="${memberId}" rows="2">${escapeHtml(member.memo)}</textarea>
                </div>
              </div>
            </td>
          </tr>
        `;
      }).join("");
    }

    function renderAdminDashboard() {
      renderAdminStats();
      renderAdminRequests();
      renderAdminMembers();
      renderArchiveGrid();
      renderAdminArchiveTable();
    }

    function findPendingMemberForRequest(request) {
      const targetName = String(request.target || "").split("·")[0].trim();
      return adminMembers.find((member) => member.name === targetName && (member.status === "pending" || member.role === "신입 신청자"));
    }

    function applyRequestDecision(request, decision) {
      request.status = decision;
      if (request.type === "membership") {
        const member = findPendingMemberForRequest(request);
        if (member) {
          if (decision === "approved") {
            member.status = "yb";
            member.role = member.role === "신입 신청자" ? "부원" : member.role;
          } else if (decision === "rejected") {
            member.status = "rejected";
          }
        }
      }
      saveAdminData();
    }

    function exportAdminMembersCsv() {
      const headers = ["이름", "기수", "역할", "전공", "연락처", "상태", "스키레벨", "학번", "관리자메모"];
      const rows = adminMembers.map((member) => [
        member.name,
        member.generation,
        member.role,
        member.major,
        member.phone,
        member.status,
        member.level,
        member.studentId,
        member.memo
      ]);
      const csv = [headers, ...rows]
        .map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(","))
        .join("\n");
      const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `dku-ski-members-${todayString()}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      showToast("회원 명단 CSV를 내보냈습니다.", "success");
    }

    function resetAdminDemoData() {
      if (!confirm("관리자 테스트 데이터를 초기 상태로 되돌리겠습니까?")) return;
      adminRequests.splice(0, adminRequests.length, ...JSON.parse(JSON.stringify(defaultAdminRequests)));
      adminMembers = JSON.parse(JSON.stringify(defaultAdminMembers));
      archiveRecords = JSON.parse(JSON.stringify(defaultArchiveRecords));
      saveAdminData();
      renderAdminDashboard();
      showToast("관리자 테스트 데이터를 초기화했습니다.", "success");
    }

    document.querySelectorAll(".admin-filter").forEach((button) => {
      button.addEventListener("click", () => {
        document.querySelectorAll(".admin-filter").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        currentAdminRequestFilter = button.dataset.adminFilter;
        renderAdminRequests();
      });
    });

    document.querySelectorAll(".admin-member-filter").forEach((button) => {
      button.addEventListener("click", () => {
        document.querySelectorAll(".admin-member-filter").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        currentAdminMemberFilter = button.dataset.adminMemberFilter;
        renderAdminMembers();
      });
    });

    document.getElementById("admin-request-search")?.addEventListener("input", renderAdminRequests);
    document.getElementById("admin-member-search")?.addEventListener("input", renderAdminMembers);

    document.getElementById("admin-request-table")?.addEventListener("click", (event) => {
      const toggle = event.target.closest(".admin-request-toggle");
      const approve = event.target.closest(".admin-request-approve");
      const reject = event.target.closest(".admin-request-reject");

      if (toggle) {
        const detail = document.querySelector(`[data-request-detail="${toggle.dataset.requestId}"]`);
        detail?.classList.toggle("hidden");
        toggle.classList.toggle("rotate-90");
      }

      if (approve || reject) {
        const id = (approve || reject).dataset.requestId;
        const request = adminRequests.find((item) => item.id === id);
        if (request) {
          applyRequestDecision(request, approve ? "approved" : "rejected");
          showToast(approve ? "요청을 승인했습니다." : "요청을 거절했습니다.", approve ? "success" : "danger");
        }
        renderAdminDashboard();
      }
    });

    document.getElementById("admin-request-table")?.addEventListener("input", (event) => {
      const memoInput = event.target.closest(".admin-request-memo-input");
      if (!memoInput) return;
      const request = adminRequests.find((item) => item.id === memoInput.dataset.requestId);
      if (request) {
        request.memo = memoInput.value;
        saveAdminData();
      }
    });

    const adminMemberModal = document.getElementById("admin-member-modal");
    const adminMemberForm = document.getElementById("admin-member-form");
    const adminMemberModalTitle = document.getElementById("admin-member-modal-title");

    function openAdminMemberModal(member = null) {
      editingAdminMemberId = member?.id || null;
      adminMemberModalTitle.textContent = member ? "부원 정보 수정" : "부원 추가";
      document.getElementById("admin-member-id").value = member?.id || "";
      document.getElementById("admin-member-name").value = member?.name || "";
      document.getElementById("admin-member-generation").value = member?.generation || "";
      document.getElementById("admin-member-role").value = member?.role || "부원";
      document.getElementById("admin-member-major").value = member?.major || "";
      document.getElementById("admin-member-phone").value = member?.phone || "";
      document.getElementById("admin-member-status").value = member?.status || "yb";
      document.getElementById("admin-member-student-id").value = member?.studentId || "";
      document.getElementById("admin-member-level").value = member?.level || "미입력";
      document.getElementById("admin-member-memo").value = member?.memo || "";
      adminMemberModal.classList.add("open");
      requestAnimationFrame(() => document.getElementById("admin-member-name")?.focus());
    }

    function closeAdminMemberModal() {
      adminMemberModal.classList.remove("open");
    }

    document.getElementById("admin-add-member-button")?.addEventListener("click", () => openAdminMemberModal());
    document.getElementById("admin-member-modal-close")?.addEventListener("click", closeAdminMemberModal);
    document.getElementById("admin-member-modal-cancel")?.addEventListener("click", closeAdminMemberModal);
    adminMemberModal?.addEventListener("click", (event) => {
      if (event.target === adminMemberModal) closeAdminMemberModal();
    });

    adminMemberForm?.addEventListener("submit", (event) => {
      event.preventDefault();

      const payload = {
        id: editingAdminMemberId || `m${Date.now()}`,
        name: document.getElementById("admin-member-name").value.trim(),
        generation: document.getElementById("admin-member-generation").value.trim() || "미정",
        role: document.getElementById("admin-member-role").value.trim() || "부원",
        major: document.getElementById("admin-member-major").value.trim() || "단국대학교",
        phone: document.getElementById("admin-member-phone").value.trim() || "미입력",
        status: document.getElementById("admin-member-status").value,
        level: document.getElementById("admin-member-level").value || "미입력",
        studentId: document.getElementById("admin-member-student-id").value.trim() || "미입력",
        memo: document.getElementById("admin-member-memo").value.trim()
      };

      if (!payload.name) return;

      if (editingAdminMemberId) {
        adminMembers = adminMembers.map((member) => member.id === editingAdminMemberId ? { ...member, ...payload } : member);
      } else {
        adminMembers.unshift(payload);
      }

      closeAdminMemberModal();
      saveAdminData();
      renderAdminDashboard();
      renderArchiveGrid();
      showToast(editingAdminMemberId ? "부원 정보를 수정했습니다." : "부원을 추가했습니다.", "success");
    });

    document.getElementById("admin-member-table")?.addEventListener("click", (event) => {
      const toggle = event.target.closest(".admin-member-toggle");
      const edit = event.target.closest(".admin-member-edit");
      const remove = event.target.closest(".admin-member-delete");
      const approve = event.target.closest(".admin-member-approve");
      const copy = event.target.closest(".admin-copy-phone");

      if (toggle) {
        const detail = document.querySelector(`[data-member-detail="${toggle.dataset.memberId}"]`);
        detail?.classList.toggle("hidden");
        toggle.classList.toggle("rotate-90");
      }

      if (copy) {
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(copy.dataset.phone);
        }
        showToast("연락처를 복사했습니다.", "success");
      }

      if (edit) {
        const member = adminMembers.find((item) => item.id === edit.dataset.memberId);
        if (member) openAdminMemberModal(member);
      }

      if (approve) {
        const member = adminMembers.find((item) => item.id === approve.dataset.memberId);
        if (member) {
          member.status = "yb";
          member.role = member.role === "신입 신청자" ? "부원" : member.role;
          saveAdminData();
          renderAdminDashboard();
          showToast("부원을 승인했습니다.", "success");
        }
      }

      if (remove) {
        const member = adminMembers.find((item) => item.id === remove.dataset.memberId);
        if (member && confirm(`${member.name} 부원을 삭제하시겠습니까?`)) {
          adminMembers = adminMembers.filter((item) => item.id !== remove.dataset.memberId);
          saveAdminData();
          renderAdminDashboard();
          showToast("부원을 삭제했습니다.", "danger");
        }
      }
    });

    document.getElementById("admin-member-table")?.addEventListener("input", (event) => {
      const memoInput = event.target.closest(".admin-member-memo-input");
      if (!memoInput) return;
      const member = adminMembers.find((item) => item.id === memoInput.dataset.memberId);
      if (member) {
        member.memo = memoInput.value;
        saveAdminData();
      }
    });

    function renderAdminArchiveTable() {
      const table = document.getElementById("admin-archive-table");
      if (!table) return;

      const query = (document.getElementById("admin-archive-search")?.value || "").trim().toLowerCase();
      const filtered = archiveRecords.filter((record) => {
        const matchesFilter = currentAdminArchiveFilter === "all" || record.category === currentAdminArchiveFilter;
        const participantNames = (record.participantIds || []).map(getMemberName).join(" ");
        const text = [record.title, record.desc, record.location, record.season, getMemberName(record.authorId), participantNames, record.tags?.join(" ")].join(" ").toLowerCase();
        return matchesFilter && (!query || text.includes(query));
      });

      if (!filtered.length) {
        table.innerHTML = `<tr><td class="px-6 py-10 text-center text-on-surface-variant" colspan="6">표시할 활동 기록이 없습니다.</td></tr>`;
        return;
      }

      table.innerHTML = filtered.map((record) => {
        const [categoryLabel, categoryClass] = archiveCategoryMap[record.category] || ["기록", "bg-gray-100 text-on-surface-variant"];
        const [visibilityLabel, visibilityClass] = archiveVisibilityMap[record.visibility] || ["미지정", "bg-gray-100 text-on-surface-variant"];
        const participants = (record.participantIds || []).map(getMemberName);
        return `
          <tr class="hover:bg-gray-50/70 transition-colors">
            <td class="px-6 py-4">
              <div class="font-semibold text-on-surface">${escapeHtml(record.title)}</div>
              <div class="text-xs text-on-surface-variant mt-1">${escapeHtml(record.date || "날짜 미정")} · ${escapeHtml(record.season || "시즌 미정")} · ${escapeHtml(record.location || "장소 미정")}</div>
            </td>
            <td class="px-6 py-4">${badge(categoryLabel, categoryClass)}</td>
            <td class="px-6 py-4 text-sm text-on-surface-variant">${escapeHtml(getMemberName(record.authorId))}</td>
            <td class="px-6 py-4 text-sm text-on-surface-variant">${participants.length ? escapeHtml(participants.join(", ")) : "미지정"}</td>
            <td class="px-6 py-4">
              <div class="flex flex-col gap-2">
                ${badge(visibilityLabel, visibilityClass)}
              </div>
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex justify-end gap-2">
                <button type="button" class="admin-archive-view p-2 text-on-surface-variant hover:text-primary hover:bg-primary-light/20 rounded-lg transition-all" data-archive-id="${escapeHtml(record.id)}" aria-label="미리보기">
                  <span class="material-symbols-outlined text-[20px]">visibility</span>
                </button>
                <button type="button" class="admin-archive-edit p-2 text-on-surface-variant hover:text-primary hover:bg-primary-light/20 rounded-lg transition-all" data-archive-id="${escapeHtml(record.id)}" aria-label="수정">
                  <span class="material-symbols-outlined text-[20px]">edit</span>
                </button>
                <button type="button" class="admin-archive-delete p-2 text-on-surface-variant hover:text-red-700 hover:bg-red-50 rounded-lg transition-all" data-archive-id="${escapeHtml(record.id)}" aria-label="삭제">
                  <span class="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join("");
    }

    const adminArchiveModal = document.getElementById("admin-archive-modal");
    const adminArchiveForm = document.getElementById("admin-archive-form");
    const adminArchiveModalTitle = document.getElementById("admin-archive-modal-title");

    function populateArchiveMemberOptions(record = null) {
      const authorSelect = document.getElementById("admin-archive-author");
      const participantsSelect = document.getElementById("admin-archive-participants");
      if (!authorSelect || !participantsSelect) return;

      const eligibleMembers = adminMembers.filter((member) => member.status === "yb" || member.status === "ob");
      authorSelect.innerHTML = eligibleMembers.map((member) => `<option value="${escapeHtml(member.id)}">${escapeHtml(member.name)} · ${escapeHtml(member.generation)}</option>`).join("");
      participantsSelect.innerHTML = eligibleMembers.map((member) => `<option value="${escapeHtml(member.id)}">${escapeHtml(member.name)} · ${escapeHtml(member.generation)}</option>`).join("");

      if (record?.authorId) authorSelect.value = record.authorId;
      const selected = new Set(record?.participantIds || []);
      [...participantsSelect.options].forEach((option) => {
        option.selected = selected.has(option.value);
      });
    }

    function openAdminArchiveModal(record = null) {
      editingArchiveId = record?.id || null;
      adminArchiveModalTitle.textContent = record ? "활동 기록 수정" : "활동 기록 추가";
      populateArchiveMemberOptions(record);

      document.getElementById("admin-archive-id").value = record?.id || "";
      document.getElementById("admin-archive-title").value = record?.title || "";
      document.getElementById("admin-archive-category").value = record?.category || "training";
      document.getElementById("admin-archive-date").value = record?.date || "";
      document.getElementById("admin-archive-season").value = record?.season || "";
      document.getElementById("admin-archive-location").value = record?.location || "";
      document.getElementById("admin-archive-visibility").value = record?.visibility || "public";
      document.getElementById("admin-archive-image").value = record?.image || "";
      document.getElementById("admin-archive-tags").value = (record?.tags || []).join(", ");
      document.getElementById("admin-archive-desc").value = record?.desc || "";

      adminArchiveModal.classList.add("open");
      requestAnimationFrame(() => document.getElementById("admin-archive-title")?.focus());
    }

    function closeAdminArchiveModal() {
      adminArchiveModal.classList.remove("open");
    }

    document.getElementById("admin-add-archive-button")?.addEventListener("click", () => openAdminArchiveModal());
    document.getElementById("admin-archive-modal-close")?.addEventListener("click", closeAdminArchiveModal);
    document.getElementById("admin-archive-modal-cancel")?.addEventListener("click", closeAdminArchiveModal);
    adminArchiveModal?.addEventListener("click", (event) => {
      if (event.target === adminArchiveModal) closeAdminArchiveModal();
    });

    adminArchiveForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      const participantOptions = [...document.getElementById("admin-archive-participants").selectedOptions].map((option) => option.value);
      const payload = {
        id: editingArchiveId || `a${Date.now()}`,
        title: document.getElementById("admin-archive-title").value.trim(),
        category: document.getElementById("admin-archive-category").value,
        date: document.getElementById("admin-archive-date").value || todayString(),
        season: document.getElementById("admin-archive-season").value.trim() || "시즌 미정",
        location: document.getElementById("admin-archive-location").value.trim() || "장소 미정",
        authorId: document.getElementById("admin-archive-author").value || adminMembers[0]?.id || "",
        participantIds: participantOptions,
        visibility: document.getElementById("admin-archive-visibility").value,
        image: document.getElementById("admin-archive-image").value.trim(),
        tags: document.getElementById("admin-archive-tags").value.split(",").map((tag) => tag.trim()).filter(Boolean),
        desc: document.getElementById("admin-archive-desc").value.trim()
      };

      if (!payload.title || !payload.desc) return;

      if (editingArchiveId) {
        archiveRecords = archiveRecords.map((record) => record.id === editingArchiveId ? { ...record, ...payload } : record);
      } else {
        archiveRecords.unshift(payload);
      }

      closeAdminArchiveModal();
      saveAdminData();
      renderArchiveGrid();
      renderAdminArchiveTable();
      showToast(editingArchiveId ? "활동 기록을 수정했습니다." : "활동 기록을 추가했습니다.", "success");
    });

    document.getElementById("admin-archive-table")?.addEventListener("click", (event) => {
      const view = event.target.closest(".admin-archive-view");
      const edit = event.target.closest(".admin-archive-edit");
      const remove = event.target.closest(".admin-archive-delete");

      if (view) openArchiveDetail(view.dataset.archiveId);

      if (edit) {
        const record = archiveRecords.find((item) => item.id === edit.dataset.archiveId);
        if (record) openAdminArchiveModal(record);
      }

      if (remove) {
        const record = archiveRecords.find((item) => item.id === remove.dataset.archiveId);
        if (record && confirm(`${record.title} 기록을 삭제하시겠습니까?`)) {
          archiveRecords = archiveRecords.filter((item) => item.id !== remove.dataset.archiveId);
          saveAdminData();
          renderArchiveGrid();
          renderAdminArchiveTable();
          showToast("활동 기록을 삭제했습니다.", "danger");
        }
      }
    });

    document.querySelectorAll(".admin-archive-filter").forEach((button) => {
      button.addEventListener("click", () => {
        document.querySelectorAll(".admin-archive-filter").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        currentAdminArchiveFilter = button.dataset.adminArchiveFilter;
        renderAdminArchiveTable();
      });
    });

    document.getElementById("admin-archive-search")?.addEventListener("input", renderAdminArchiveTable);

    document.querySelectorAll(".filter-button").forEach((button) => {
      button.addEventListener("click", () => {
        document.querySelectorAll(".filter-button").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        currentArchiveCategory = button.dataset.filter;
        renderArchiveGrid();
      });
    });

    document.getElementById("archive-year-filter")?.addEventListener("change", (event) => {
      currentArchiveYear = event.target.value;
      renderArchiveGrid();
    });

    document.getElementById("archive-visibility-filter")?.addEventListener("change", (event) => {
      currentArchiveVisibility = event.target.value;
      renderArchiveGrid();
    });

    document.getElementById("archive-search")?.addEventListener("input", renderArchiveGrid);

    document.getElementById("archive-grid")?.addEventListener("click", (event) => {
      const card = event.target.closest(".archive-card");
      if (card) openArchiveDetail(card.dataset.archiveId);
    });

    document.getElementById("admin-export-button")?.addEventListener("click", exportAdminMembersCsv);
    document.getElementById("admin-reset-button")?.addEventListener("click", resetAdminDemoData);

    document.getElementById("recruitment-form")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const name = document.getElementById("name").value.trim();
      if (!name) return;

      const checkedExperience = form.querySelector('input[name="experience"]:checked');
      const experience = checkedExperience?.closest("label")?.innerText.trim() || "미입력";
      const studentId = document.getElementById("student_id").value.trim() || "미입력";
      const department = document.getElementById("department").value.trim() || "단국대학교";
      const year = document.getElementById("year").value;
      const phone = document.getElementById("phone").value.trim() || "미입력";
      const email = document.getElementById("email").value.trim() || "미입력";
      const motivation = document.getElementById("motivation").value.trim() || "미입력";
      const privacyConsent = form.querySelector('input[type="checkbox"]')?.checked ? "동의" : "미동의";

      const duplicatePending = adminMembers.some((member) => {
        if (member.status !== "pending") return false;
        return (phone !== "미입력" && member.phone === phone) || (email !== "미입력" && member.email === email);
      });

      if (duplicatePending) {
        showToast("이미 승인 대기 중인 신청이 있습니다. 관리자 확인 후 다시 진행해주세요.", "danger");
        return;
      }

      const submittedAt = new Date().toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });
      const idSeed = Date.now();
      const receiptId = applicationReceiptId(idSeed);

      const application = {
        receiptId,
        name,
        studentId,
        department,
        year,
        phone,
        email,
        experience,
        motivation,
        privacyConsent,
        submittedAt
      };

      const newRequest = {
        id: `r${idSeed}`,
        type: "membership",
        title: "신규 입부 신청",
        target: name,
        desc: `${department} ${year} 지원자가 입부 신청서를 제출했습니다.`,
        status: "pending",
        date: todayString(),
        receiptId,
        detail: `신청 번호: ${receiptId}\n성명: ${name}\n학번: ${studentId}\n학과: ${department}\n학년: ${year}\n연락처: ${phone}\n이메일: ${email}\n스키 경험: ${experience}\n개인정보 동의: ${privacyConsent}\n제출 시각: ${submittedAt}\n지원 동기: ${motivation}`,
        application,
        memo: "지원서 자동 접수"
      };

      const newMember = {
        id: `m${idSeed}`,
        name,
        generation: "신입 예정",
        role: "신입 신청자",
        major: department,
        phone,
        status: "pending",
        level: experience,
        studentId,
        email,
        submittedAt,
        receiptId,
        memo: motivation
      };

      adminRequests.unshift(newRequest);
      adminMembers.unshift(newMember);
      saveAdminData();
      if (isAdminLoggedIn) renderAdminDashboard();
      form.reset();
      renderApplicationReceipt(application);
      showToast(`${receiptId} 지원서가 관리자 승인 대기 목록에 등록되었습니다.`, "success");
    });

    document.getElementById("admin-logout-button")?.addEventListener("click", () => {
      setAdminState(false);
      showPage("home");
      showToast("관리자 로그아웃 상태로 전환했습니다.");
    });

    hydrateAdminData();
    setAdminState(localStorage.getItem(ADMIN_AUTH_STORAGE_KEY) === "true", { skipPersist: true });
    renderArchiveGrid();
