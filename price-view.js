// 가격표 그리기: prices.js의 PRICE_TABLE, PRICE_NOTES를 읽어 #price 칸에 보여 줌
// (가격을 고칠 때는 이 파일이 아니라 prices.js를 고치기)
(function () {
  var root = document.getElementById("price-box");
  if (!root || typeof PRICE_TABLE === "undefined") return;
  var ICONS = { "싱크대 막힘": "🚰", "변기 막힘": "🚽", "하수구 막힘": "🛁", "기타": "🔧" };
  var PHONE = "01052726159";

  function won(n) { return Number(n).toLocaleString("ko-KR") + "원"; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  var cats = [];
  PRICE_TABLE.forEach(function (r) { if (cats.indexOf(r.분류) < 0) cats.push(r.분류); });

  var tabs = root.querySelector(".pr-tabs");
  var list = root.querySelector(".pr-cards");
  var result = root.querySelector(".pr-result");

  // 고른 증상의 자세한 내용 (파란 상자)
  function showResult(r) {
    result.innerHTML =
      '<div class="pr-res-top">' +
        '<div class="pr-res-price"><span>예상 비용</span><strong>' + won(r.시작가) + '~</strong><small>최대 약 ' + won(r.최대) + '</small></div>' +
        '<div class="pr-res-info"><span>⏱ ' + esc(r.시간) + '</span><span>🔧 ' + esc(r.작업) + '</span><span>💡 ' + esc(r.원인) + '</span></div>' +
      '</div>' +
      '<div class="pr-res-btns">' +
        '<a class="btn btn-call" href="tel:' + PHONE + '">📞 이 증상으로 전화 문의</a>' +
        '<a class="btn btn-sms" href="sms:' + PHONE + '?body=' + encodeURIComponent("[누원설비 문의] 지역: / 증상: " + r.분류 + " - " + r.증상) + '">💬 문자</a>' +
      '</div>';
    result.hidden = false;
    result.classList.remove("pr-in");
    void result.offsetWidth;
    result.classList.add("pr-in");
  }

  // 분류를 고르면 증상 목록을 한 줄씩 보여 줌
  function showCat(cat) {
    Array.prototype.forEach.call(tabs.children, function (t) { t.classList.toggle("on", t.dataset.cat === cat); });
    list.innerHTML = "";
    PRICE_TABLE.filter(function (r) { return r.분류 === cat; }).forEach(function (r, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "pr-row";
      b.innerHTML = '<span class="pr-row-name">' + esc(r.증상) + '</span><span class="pr-row-price">' + won(r.시작가) + '~</span>';
      b.onclick = function () {
        Array.prototype.forEach.call(list.children, function (c) { c.classList.remove("on"); });
        b.classList.add("on");
        showResult(r);
      };
      list.appendChild(b);
      if (i === 0) { b.classList.add("on"); showResult(r); }
    });
  }

  cats.forEach(function (cat) {
    var t = document.createElement("button");
    t.type = "button";
    t.dataset.cat = cat;
    t.innerHTML = '<span>' + (ICONS[cat] || "🔧") + '</span>' + esc(cat.replace(" 막힘", ""));
    t.onclick = function () { showCat(cat); };
    tabs.appendChild(t);
  });
  showCat(cats[0]);

  // 전체 가격표 (접어 둠)
  var tbody = root.querySelector(".pr-table tbody");
  PRICE_TABLE.forEach(function (r) {
    var tr = document.createElement("tr");
    tr.innerHTML = '<td>' + esc(r.분류) + '</td><td><b>' + esc(r.증상) + '</b><small>' + esc(r.작업) + '</small></td>' +
      '<td class="num">' + won(r.시작가) + '~</td><td class="num">' + won(r.최대) + '</td><td>' + esc(r.시간) + '</td>';
    tbody.appendChild(tr);
  });

  var notes = root.querySelector(".pr-notes");
  (typeof PRICE_NOTES !== "undefined" ? PRICE_NOTES : []).forEach(function (n) {
    var li = document.createElement("li");
    li.textContent = n;
    notes.appendChild(li);
  });
})();
