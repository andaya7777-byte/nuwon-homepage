// 전국 출동 지역 고르기: 전국 → 시·도 → 시·군·구 → 서비스
// READY에 있는 시·도만 시·군·구까지 들어가고, 나머지는 "준비 중" 안내 창을 띄움
// 지역 전용 페이지가 있는 곳은 PAGES에 적어 두면 "출동 안내 페이지" 링크가 생김
(function () {
  var REGIONS = {
    "서울": ["강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"],
    "경기": ["가평군", "고양시", "과천시", "광명시", "광주시", "구리시", "군포시", "김포시", "남양주시", "동두천시", "부천시", "성남시", "수원시", "시흥시", "안산시", "안성시", "안양시", "양주시", "양평군", "여주시", "연천군", "오산시", "용인시", "의왕시", "의정부시", "이천시", "파주시", "평택시", "포천시", "하남시", "화성시"],
    "인천": ["강화군", "검단구", "계양구", "남동구", "미추홀구", "부평구", "서구", "연수구", "영종구", "옹진군", "제물포구"],
    "부산": ["강서구", "금정구", "기장군", "남구", "동구", "동래구", "부산진구", "북구", "사상구", "사하구", "서구", "수영구", "연제구", "영도구", "중구", "해운대구"],
    "대구": ["군위군", "남구", "달서구", "달성군", "동구", "북구", "서구", "수성구", "중구"],
    "광주": ["광산구", "남구", "동구", "북구", "서구"],
    "대전": ["대덕구", "동구", "서구", "유성구", "중구"],
    "울산": ["남구", "동구", "북구", "울주군", "중구"],
    "세종": ["세종시"],
    "강원": ["강릉시", "고성군", "동해시", "삼척시", "속초시", "양구군", "양양군", "영월군", "원주시", "인제군", "정선군", "철원군", "춘천시", "태백시", "평창군", "홍천군", "화천군", "횡성군"],
    "충북": ["괴산군", "단양군", "보은군", "영동군", "옥천군", "음성군", "제천시", "증평군", "진천군", "청주시", "충주시"],
    "충남": ["계룡시", "공주시", "금산군", "논산시", "당진시", "보령시", "부여군", "서산시", "서천군", "아산시", "예산군", "천안시", "청양군", "태안군", "홍성군"],
    "전북": ["고창군", "군산시", "김제시", "남원시", "무주군", "부안군", "순창군", "완주군", "익산시", "임실군", "장수군", "전주시", "정읍시", "진안군"],
    "전남": ["강진군", "고흥군", "곡성군", "광양시", "구례군", "나주시", "담양군", "목포시", "무안군", "보성군", "순천시", "신안군", "여수시", "영광군", "영암군", "완도군", "장성군", "장흥군", "진도군", "함평군", "해남군", "화순군"],
    "경북": ["경산시", "경주시", "고령군", "구미시", "김천시", "문경시", "봉화군", "상주시", "성주군", "안동시", "영덕군", "영양군", "영주시", "영천시", "예천군", "울릉군", "울진군", "의성군", "청도군", "청송군", "칠곡군", "포항시"],
    "경남": ["거제시", "거창군", "고성군", "김해시", "남해군", "밀양시", "사천시", "산청군", "양산시", "의령군", "진주시", "창녕군", "창원시", "통영시", "하동군", "함안군", "함양군", "합천군"],
    "제주": ["서귀포시", "제주시"]
  };
  var FULL = { "서울": "서울특별시", "경기": "경기도", "인천": "인천광역시", "부산": "부산광역시", "대구": "대구광역시", "광주": "광주광역시", "대전": "대전광역시", "울산": "울산광역시", "세종": "세종특별자치시", "강원": "강원특별자치도", "충북": "충청북도", "충남": "충청남도", "전북": "전북특별자치도", "전남": "전라남도", "경북": "경상북도", "경남": "경상남도", "제주": "제주특별자치도" };
  var READY = ["서울", "경기", "인천"];
  var PAGES = {
    "경기 시흥시": "siheung.html",
    "경기 안산시": "ansan.html",
    "인천 연수구": "incheon-yeonsu.html",
    "인천 남동구": "incheon-namdong.html"
  };
  var SERVICES = [
    ["🛁", "하수구 막힘", "tip-drain.html"], ["🚰", "싱크대 막힘", "tip-sink.html"], ["🚽", "변기 막힘", "tip-toilet.html"],
    ["🏠", "정화조 막힘", "tip-septic.html"], ["🔍", "내시경 · 관로탐지", "tip-camera.html"], ["💦", "배관 고압세척", "tip-jet.html"],
    ["🚿", "수전 교체", "tip-faucet.html"], ["🚪", "문고리", "tip-doorknob.html"], ["💡", "LED등 교체", "tip-led.html"],
    ["👃", "악취 차단", "tip-smell.html"], ["🚬", "욕실 담배냄새", "tip-smoke.html"]
  ];
  var PHONE = "01052726159";

  var box = document.getElementById("region-picker");
  if (!box) return;
  var crumb = box.querySelector(".rp-crumb");
  var body = box.querySelector(".rp-body");

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html) e.innerHTML = html;
    return e;
  }
  function crumbLink(text, fn) {
    var a = el("button", "rp-crumb-link", text);
    a.type = "button";
    a.onclick = fn;
    return a;
  }
  function setCrumb(parts) {
    crumb.innerHTML = "";
    parts.forEach(function (p, i) {
      if (i) crumb.appendChild(el("span", "rp-sep", "›"));
      crumb.appendChild(typeof p === "string" ? el("b", "", p) : p);
    });
  }
  function swap(nodes) {
    body.classList.remove("rp-in");
    body.innerHTML = "";
    nodes.forEach(function (n) { body.appendChild(n); });
    void body.offsetWidth;
    body.classList.add("rp-in");
  }

  // ① 전국: 시·도 카드
  function showAll() {
    setCrumb([el("b", "", "📍 전국")]);
    var g = el("div", "rp-grid rp-grid-sido");
    Object.keys(REGIONS).forEach(function (sido) {
      var ready = READY.indexOf(sido) > -1;
      var b = el("button", "rp-sido" + (ready ? " is-ready" : " is-soon"),
        '<span class="rp-name">' + sido + '</span>' +
        '<span class="rp-count">' + REGIONS[sido].length + '개 시·군·구</span>' +
        (ready ? '<span class="rp-state on"><i></i>출동 가능</span>' : '<span class="rp-state">준비 중</span>'));
      b.type = "button";
      b.onclick = function () { ready ? showSido(sido) : openSoon(sido); };
      g.appendChild(b);
    });
    swap([g]);
  }

  // ② 시·도: 시·군·구 카드
  function showSido(sido) {
    setCrumb([crumbLink("📍 전국", showAll), sido]);
    var head = el("p", "rp-title", "<b>" + FULL[sido] + "</b> · 우리 동네를 골라 주세요");
    var g = el("div", "rp-grid");
    REGIONS[sido].forEach(function (gu) {
      var hasPage = PAGES[sido + " " + gu];
      var b = el("button", "rp-gu",
        '<span class="rp-pin">📍</span>' +
        '<span class="rp-gu-text"><span class="rp-name">' + gu + '</span>' +
        '<span class="rp-go">' + (hasPage ? "안내 페이지 있음" : "바로 출동") + ' ›</span></span>');
      if (hasPage) b.classList.add("has-page");
      b.type = "button";
      b.onclick = function () { showGu(sido, gu); };
      g.appendChild(b);
    });
    swap([head, g]);
    box.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ③ 시·군·구: 서비스 고르기 + 전화
  function showGu(sido, gu) {
    var place = sido + " " + gu;
    setCrumb([crumbLink("📍 전국", showAll), crumbLink(sido, function () { showSido(sido); }), gu]);
    var head = el("p", "rp-title", "<b>" + place + "</b> · 필요한 서비스를 고르세요");
    var g = el("div", "rp-svc-grid");
    SERVICES.forEach(function (s) {
      var a = el("a", "rp-svc", '<span class="rp-svc-ico">' + s[0] + '</span><span>' + s[1] + '</span>');
      a.href = s[2];
      g.appendChild(a);
    });
    var actions = el("div", "rp-actions");
    var call = el("a", "btn btn-call rp-call", "📞 " + place + " 출동 문의하기");
    call.href = "tel:" + PHONE;
    var sms = el("a", "btn rp-sms", "💬 문자로 문의하기");
    sms.href = "sms:" + PHONE + "?body=" + encodeURIComponent("[누원설비 문의] 지역: " + place + " / 증상: ");
    actions.appendChild(call);
    actions.appendChild(sms);
    var nodes = [head, g, actions];
    if (PAGES[place]) {
      var page = el("a", "rp-page", "📄 " + place + " 출동 안내 페이지 보기 →");
      page.href = PAGES[place];
      nodes.push(page);
    }
    swap(nodes);
    box.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // 준비 중 안내 창
  var modal = document.getElementById("soon-modal");
  function openSoon(sido) {
    if (!modal) return;
    modal.querySelector(".soon-place").textContent = FULL[sido];
    modal.querySelector(".soon-sms").href = "sms:" + PHONE + "?body=" + encodeURIComponent("[누원설비 문의] 지역: " + FULL[sido] + " / 증상: ");
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    modal.querySelector(".soon-close").focus();
  }
  function closeSoon() {
    modal.hidden = true;
    document.body.style.overflow = "";
  }
  if (modal) {
    modal.addEventListener("click", function (e) { if (e.target === modal || e.target.closest(".soon-close")) closeSoon(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !modal.hidden) closeSoon(); });
  }

  showAll();
})();
