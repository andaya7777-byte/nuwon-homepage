// 화면에 보이면 나타나기: class="reveal" 인 칸이 화면에 들어오면 "seen"을 붙여 도장 찍히듯 나타나게 함
// (이 파일이 없거나 오래된 브라우저면 그냥 처음부터 보임)
(function () {
  var items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || !items.length) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.documentElement.classList.add("js-reveal");
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("seen");
      io.unobserve(e.target);
    });
  }, { threshold: 0.25 });

  // 같은 줄에 있는 칸은 하나씩 차례로 나타나게 조금씩 늦춤
  items.forEach(function (el) {
    var i = Array.prototype.indexOf.call(el.parentNode.children, el);
    el.style.transitionDelay = (i * 0.12) + "s";
    io.observe(el);
  });
})();
