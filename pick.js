// 문제 고르기 줄: 화살표 버튼, 마우스 휠, 끌기로 옆으로 움직이기
(function () {
  var track = document.querySelector(".pick-track");
  if (!track) return;
  var prev = document.querySelector(".pick-btn.prev"), next = document.querySelector(".pick-btn.next");
  function update() {
    prev.classList.toggle("hide", track.scrollLeft <= 2);
    next.classList.toggle("hide", track.scrollLeft + track.clientWidth >= track.scrollWidth - 2);
  }
  prev.onclick = function () { track.scrollBy({ left: -220, behavior: "smooth" }); };
  next.onclick = function () { track.scrollBy({ left: 220, behavior: "smooth" }); };
  track.addEventListener("wheel", function (e) {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && track.scrollWidth > track.clientWidth) { track.scrollLeft += e.deltaY; e.preventDefault(); }
  }, { passive: false });
  var down = false, startX = 0, startLeft = 0, moved = false;
  track.addEventListener("mousedown", function (e) { down = true; moved = false; startX = e.pageX; startLeft = track.scrollLeft; });
  window.addEventListener("mouseup", function () { down = false; });
  track.addEventListener("mousemove", function (e) { if (!down) return; var dx = e.pageX - startX; if (Math.abs(dx) > 4) moved = true; track.scrollLeft = startLeft - dx; });
  track.addEventListener("click", function (e) { if (moved) { e.preventDefault(); moved = false; } }, true);
  track.addEventListener("scroll", update);
  window.addEventListener("resize", update);
  // 지금 보고 있는 글의 버튼이 보이도록 가운데로 옮기기
  var on = track.querySelector("a.on");
  if (on) track.scrollLeft = on.offsetLeft - (track.clientWidth - on.offsetWidth) / 2;
  update();
})();
