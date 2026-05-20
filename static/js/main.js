document.addEventListener('DOMContentLoaded', () => {

  // ── Burger menu ──────────────────────────────────────────────────────────
  document.querySelectorAll('.navbar-burger').forEach(el => {
    el.addEventListener('click', () => {
      const t = document.getElementById(el.dataset.target);
      el.classList.toggle('is-active');
      t.classList.toggle('is-active');
    });
  });

  // ── Scene video tabs ─────────────────────────────────────────────────────
  document.querySelectorAll('.scene-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const group = tab.closest('.scene-tabs');
      group.querySelectorAll('.scene-tab').forEach(t => t.parentElement.classList.remove('is-active'));
      group.querySelectorAll('.scene-panel').forEach(p => {
        p.classList.remove('is-active');
        p.querySelector('video')?.pause();
      });
      tab.parentElement.classList.add('is-active');
      const panel = document.getElementById(tab.dataset.target);
      if (panel) {
        panel.classList.add('is-active');
        const v = panel.querySelector('video');
        if (v) { v.currentTime = 0; v.play().catch(() => {}); }
      }
    });
  });
  document.querySelectorAll('.scene-panel.is-active video').forEach(v => v.play().catch(() => {}));

  // ── Comparison slider ────────────────────────────────────────────────────
  function initSlider(wrap) {
    const afterDiv = wrap.querySelector('.img-after');
    const afterImg = afterDiv.querySelector('img');
    const divider  = wrap.querySelector('.comparison-divider');
    const handle   = wrap.querySelector('.comparison-handle');
    let dragging   = false;

    function setPos(x) {
      const rect = wrap.getBoundingClientRect();
      let pct = Math.max(0, Math.min(1, (x - rect.left) / rect.width));
      const px = pct * rect.width;
      afterDiv.style.width = px + 'px';
      afterImg.style.width = rect.width + 'px';
      divider.style.left   = px + 'px';
      handle.style.left    = px + 'px';
    }

    function centreSoon() {
      // Retry each rAF until the wrap has a non-zero width (layout ready)
      function attempt() {
        const w = wrap.getBoundingClientRect().width;
        if (w > 0) {
          setPos(wrap.getBoundingClientRect().left + w * 0.5);
        } else {
          requestAnimationFrame(attempt);
        }
      }
      requestAnimationFrame(attempt);
    }

    centreSoon();
    // Also re-centre after all resources finish loading
    window.addEventListener('load', centreSoon);

    wrap.addEventListener('mousedown',  e => { dragging = true; setPos(e.clientX); });
    wrap.addEventListener('touchstart', e => { dragging = true; setPos(e.touches[0].clientX); }, {passive:true});
    document.addEventListener('mousemove',  e => { if (dragging) setPos(e.clientX); });
    document.addEventListener('touchmove',  e => { if (dragging) setPos(e.touches[0].clientX); }, {passive:true});
    document.addEventListener('mouseup',  () => dragging = false);
    document.addEventListener('touchend', () => dragging = false);
  }

  document.querySelectorAll('.comparison-wrap').forEach(initSlider);

  // ── Comparison scene / camera / method selectors ────────────────────────
  const METHOD_LABELS = { '3dgs': '3DGS', 'ts': 'Triangle Splat' };

  let compState = { scene: 's3', cam: '00033', method: '3dgs' };

  const denserImg  = document.getElementById('comp-img-denser');
  const baseImg    = document.getElementById('comp-img-baseline');
  const leftLbl    = document.getElementById('comp-label-left');

  function updateComp() {
    const { scene, cam, method } = compState;
    const base = `static/images/comparison/${scene}/`;
    denserImg.src = base + `${cam}_denser.jpg`;
    baseImg.src   = base + `${cam}_${method}.jpg`;
    leftLbl.textContent = METHOD_LABELS[method];
    // Re-centre after new images paint
    requestAnimationFrame(() => {
      const wrap = document.getElementById('comp-slider');
      const w = wrap.getBoundingClientRect().width;
      if (w > 0) {
        const afterDiv = wrap.querySelector('.img-after');
        const divider  = wrap.querySelector('.comparison-divider');
        const handle   = wrap.querySelector('.comparison-handle');
        afterDiv.style.width = (w * 0.5) + 'px';
        baseImg.style.width  = w + 'px';
        divider.style.left   = (w * 0.5) + 'px';
        handle.style.left    = (w * 0.5) + 'px';
      }
    });
  }

  document.querySelectorAll('.comp-scene-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.comp-scene-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      compState.scene = tab.dataset.scene;
      updateComp();
    });
  });

  document.querySelectorAll('.comp-cam-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.comp-cam-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      compState.cam = tab.dataset.cam;
      updateComp();
    });
  });

  document.querySelectorAll('.comp-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.comp-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      compState.method = tab.dataset.method;
      updateComp();
    });
  });

});
