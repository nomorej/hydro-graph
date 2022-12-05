var nt = Object.defineProperty;
var rt = (s, e, t) => e in s ? nt(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var r = (s, e, t) => (rt(s, typeof e != "symbol" ? e + "" : e, t), t);
function ct(s, e, t) {
  return (1 - t) * s + t * e;
}
function ht(s, e, t, i) {
  return ct(s, e, 1 - Math.exp(-t * i));
}
function B(s, e = 5) {
  return +s.toFixed(e);
}
function G(s, e = 0, t = 0) {
  return Math.max(e, Math.min(s, t));
}
class H {
  constructor(e) {
    r(this, "pointer");
    r(this, "progress");
    r(this, "start");
    r(this, "distance");
    r(this, "_slipperiness");
    this.start = (e == null ? void 0 : e.start) || 0, this.distance = (e == null ? void 0 : e.distance) || 1, this.slipperiness = this._slipperiness = (e == null ? void 0 : e.slipperiness) || 0, this.pointer = {
      current: 0,
      target: 0
    }, this.progress = {
      current: 0,
      target: 0
    }, this.calibratePointer(this.start);
  }
  get slipperiness() {
    return this._slipperiness;
  }
  set slipperiness(e) {
    const i = G(e, 1, 11), o = 5e-4 * (11 - i);
    this._slipperiness = o * 11 + o - i * o;
  }
  setPointer(e) {
    this.pointer.target = G(e, this.start, this.distance), this.progress.target = B(this.pointer.target / this.distance, 4);
  }
  setProgress(e) {
    this.setPointer(e * this.distance);
  }
  step(e) {
    this.setPointer(this.pointer.target + e);
  }
  slide(e) {
    this.slipperiness ? (this.pointer.current = B(
      ht(this.pointer.current, this.pointer.target, this.slipperiness, e),
      4
    ), this.progress.current = B(this.pointer.current / this.distance, 4) || 0) : this.equalize();
  }
  equalize() {
    this.pointer.current = this.pointer.target, this.progress.current = this.progress.target;
  }
  calibratePointer(e = this.pointer.target) {
    this.setPointer(e), this.equalize();
  }
  calibrateProgress(e = this.progress.target) {
    this.setProgress(e), this.equalize();
  }
  isIdle() {
    return B(this.pointer.target, 2) === B(this.pointer.current, 2);
  }
  isStart(e) {
    return this.progress[e] === 0;
  }
  isEnd(e) {
    return this.progress[e] === 1;
  }
}
class at {
  constructor(e) {
    r(this, "renderer");
    r(this, "zoom");
    r(this, "maxZoom");
    r(this, "size");
    r(this, "position");
    r(this, "objects");
    r(this, "_viewportSize");
    this.renderer = null, this.zoom = (e == null ? void 0 : e.zoom) || 1, this.maxZoom = (e == null ? void 0 : e.maxZoom) || 300, this.size = new H({ slipperiness: 5 }), this.position = new H({ slipperiness: 5 }), e != null && e.sizeProgress && this.size.calibrateProgress(e.sizeProgress), e != null && e.positionProgress && this.position.calibrateProgress(e.positionProgress), this.objects = /* @__PURE__ */ new Set(), this._viewportSize = 0;
  }
  get viewportSize() {
    return this._viewportSize;
  }
  set viewportSize(e) {
    this._viewportSize = e, this.scaleStep(), this.calibratePointer(), this.scaleStep();
  }
  scaleStep(e = 0, t = 0) {
    this.scaleSet(e, this.zoom + t);
  }
  scaleSet(e = 0, t = 0) {
    const i = this.zoom;
    this.zoom = G(t, 1, this.maxZoom), this.size.setPointer(this.viewportSize * this.zoom), this.size.start = this.viewportSize, this.size.distance = this.viewportSize * this.maxZoom, this.position.distance = this.size.pointer.target - this.viewportSize, this.position.setPointer((e + this.position.pointer.target) * this.zoom / i - e);
  }
  setTranslate(e = 0) {
    this.position.setPointer(e);
  }
  translate(e = 0) {
    this.position.step(e);
  }
  calibratePointer() {
    this.size.calibratePointer(), this.position.calibratePointer();
  }
  resize() {
    const e = this.position.progress.target || 0, t = this.size.progress.target || 0;
    this.viewportSize = this.renderer.size.x, this.objects.forEach((i) => {
      var o;
      i.isActive && ((o = i.onResize) == null || o.call(i));
    }), this.position.calibrateProgress(e), this.size.calibrateProgress(t);
  }
  render(e, t) {
    this.size.slide(t), this.position.slide(t), this.position.isIdle() && this.size.isIdle() && this.renderer.stopTick(), this.renderer.context.save(), this.renderer.context.translate(this.position.pointer.current * -1, 0), this.objects.forEach((i) => {
      var o;
      i.isActive && ((o = i.onRender) == null || o.call(i));
    }), this.renderer.context.restore();
  }
  addObject(e) {
    this.objects.has(e) || this.objects.add(e);
  }
  removeObject(e) {
    var t;
    this.objects.has(e) && (this.objects.delete(e), (t = e.onDestroy) == null || t.call(e));
  }
}
class ut {
  constructor() {
    r(this, "listeners");
    this.listeners = /* @__PURE__ */ new Map();
  }
  listen(e, t) {
    if (this.listeners.has(e))
      this.listeners.get(e).push(t);
    else {
      const i = [t];
      this.listeners.set(e, i);
    }
  }
  unlisten(e, t) {
    if (this.listeners.has(e))
      if (t) {
        const i = this.listeners.get(e).filter((o) => o !== t);
        i.length ? this.listeners.set(e, i) : this.listeners.delete(e);
      } else
        this.listeners.delete(e);
  }
  unlistenAll(e) {
    e && this.listeners.has(e) ? this.listeners.delete(e) : this.listeners.clear();
  }
  notify(e, ...t) {
    var i;
    (i = this.listeners.get(e)) == null || i.forEach((o) => {
      o(...t);
    });
  }
}
class lt {
  constructor(e) {
    r(this, "containerElement");
    r(this, "canvasElement");
    r(this, "context");
    r(this, "size");
    r(this, "clearColor");
    r(this, "minSize");
    r(this, "maxSize");
    r(this, "pixelRatio");
    r(this, "events");
    r(this, "_drawFunction");
    r(this, "resizeObserver");
    r(this, "draw", (...e) => {
      var t;
      (t = this._drawFunction) == null || t.call(this, this, ...e);
    });
    r(this, "redraw", () => {
      this.clear(), this.resize(), this.draw();
    });
    this.containerElement = e.container, this.canvasElement = document.createElement("canvas");
    const t = this.canvasElement.getContext("2d");
    if (!t)
      throw new Error("Error getting context");
    this.containerElement.appendChild(this.canvasElement), this.clearColor = e.clearColor, this.context = t, this.size = { x: 0, y: 0 }, this.minSize = 0, this.maxSize = 0, this.pixelRatio = 1, this.events = new ut(), this.resizeObserver = new ResizeObserver(this.redraw);
  }
  set drawFunction(e) {
    this.resizeObserver.unobserve(this.containerElement), this._drawFunction = e, this.resizeObserver.observe(this.containerElement);
  }
  destroy() {
    this.containerElement.removeChild(this.canvasElement), this.resizeObserver.disconnect();
  }
  clear() {
    this.clearColor ? (this.context.fillStyle = this.clearColor, this.context.fillRect(0, 0, this.size.x, this.size.y)) : this.context.clearRect(0, 0, this.size.x, this.size.y);
  }
  resize(e = this.containerElement.offsetWidth, t = this.containerElement.offsetHeight) {
    this.pixelRatio = G(devicePixelRatio, 1, 2), this.size.x = e, this.size.y = t, this.minSize = Math.min(this.size.x, this.size.y), this.maxSize = Math.max(this.size.x, this.size.y), this.canvasElement.width = this.size.x * this.pixelRatio, this.canvasElement.height = this.size.y * this.pixelRatio, this.canvasElement.style.width = this.size.x + "px", this.canvasElement.style.height = this.size.y + "px", this.context.scale(this.pixelRatio, this.pixelRatio), this.events.notify("resize");
  }
}
const D = class {
  static add(e, t = 0) {
    return this.checkTimeouts(e), this.lastFrameId || (this.lastTickDate = Date.now(), this.lastFrameId = requestAnimationFrame(this.tick)), this.queue.find((i) => i.callback === e) || (this.queue.push({ callback: e, position: t }), this.queue.sort((i, o) => i.position - o.position)), () => {
      this.remove(e);
    };
  }
  static remove(e) {
    this.queue = this.queue.filter((t) => t.callback !== e), this.queue.length || (cancelAnimationFrame(this.lastFrameId), this.lastFrameId = 0);
  }
  static removeAfterDelay(e, t) {
    var i;
    this.timeoutsCallbacks.has(e) || this.timeoutsCallbacks.set(
      e,
      setTimeout(() => {
        var o;
        this.remove(e), (o = t == null ? void 0 : t.afterRemove) == null || o.call(t), this.timeoutsCallbacks.delete(e);
      }, (i = t == null ? void 0 : t.delay) != null ? i : 2e3)
    );
  }
  static checkTimeouts(e) {
    this.timeoutsCallbacks.has(e) && (clearTimeout(this.timeoutsCallbacks.get(e)), this.timeoutsCallbacks.delete(e));
  }
};
let b = D;
r(b, "lastTickDate", 0), r(b, "lastFrameId", 0), r(b, "timeoutsCallbacks", /* @__PURE__ */ new WeakMap()), r(b, "queue", []), r(b, "tick", (e) => {
  const t = Date.now(), i = t - D.lastTickDate;
  D.queue.forEach((o) => o.callback(e, i)), D.lastTickDate = t, D.lastFrameId = requestAnimationFrame(D.tick);
});
class dt extends lt {
  constructor(t) {
    super({
      container: t.container,
      clearColor: t.clearColor
    });
    r(this, "scene");
    r(this, "render", (t, i = 0, o = 0) => {
      t.clear(), this.scene.render(i, o);
    });
    this.context.roundRect = this.context.roundRect || this.context.rect, this.scene = t.scene, this.scene.renderer = this, this.drawFunction = this.render;
  }
  withTicker(t) {
    b.add(this.draw), b.removeAfterDelay(this.draw), t == null || t();
  }
  withoutTicker(t) {
    t(), this.scene.calibratePointer(), this.draw();
  }
  stopTick() {
    b.remove(this.draw);
  }
  resize(t, i) {
    super.resize(t, i), this.scene.resize();
    const o = this.size.x * 1e-3;
    this.containerElement.style.setProperty("--cg-scalar", o + "px");
  }
}
function xt(s) {
  const e = new Date(s);
  return new Intl.DateTimeFormat("default", { month: "long" }).format(e);
}
function W(s) {
  return s.toISOString().slice(0, 10);
}
class mt {
  constructor(e) {
    r(this, "index");
    r(this, "date");
    r(this, "type");
    r(this, "number");
    r(this, "title");
    r(this, "daysBefore");
    r(this, "x1");
    r(this, "x2");
    r(this, "width");
    r(this, "x1Normalized");
    r(this, "x2Normalized");
    r(this, "widthNormalized");
    r(this, "nextHourSegment");
    r(this, "nextDaySegment");
    r(this, "currentDaySegment");
    this.index = e.index, this.date = e.date, this.type = e.type, this.number = e.number, this.title = e.title, this.daysBefore = e.daysBefore, this.x1 = 0, this.x2 = 0, this.width = 0, this.x1Normalized = 0, this.x2Normalized = 0, this.widthNormalized = 0, this.nextHourSegment = null, this.nextDaySegment = null, this.currentDaySegment = null;
  }
}
class pt {
  constructor(e) {
    r(this, "segments");
    this.segments = [];
    let t = 0, i = W(e[0]).slice(0, -3), o = 0;
    e.forEach((n, h) => {
      const a = W(n), u = a.slice(0, -3), d = n.getDate() === 1, l = n.getMonth(), m = h + 1 - o;
      i !== u && (o += new Date(n.getFullYear(), l, 0).getDate()), i = u;
      for (let x = 0; x <= 23; x++) {
        const f = `${a}T${x.toString().padStart(2, "0")}:00:00`, E = x === 0 ? d ? "month" : "day" : "hour", y = x === 0 ? d ? l : m : x, g = x === 0 && d ? xt(n) : y.toString();
        this.segments[t] = new mt({
          index: t,
          date: f,
          type: E,
          number: y,
          title: g,
          daysBefore: h
        }), t++;
      }
    });
    const c = 1 / this.segments.length;
    this.segments.forEach((n, h) => {
      n.x1Normalized = h * c, n.x2Normalized = (h + 1) * c, n.widthNormalized = n.x2Normalized - n.x1Normalized, n.nextHourSegment = this.segments[h + 1] || n, n.nextDaySegment = this.segments.slice(h + 1).find((a) => a.type === "month" || a.type === "day") || this.segments[this.segments.length - 1], n.currentDaySegment = this.segments.slice(Math.max(h - 23, 0), h + 1).find((a) => a.type === "day" || a.type === "month");
    });
  }
  resize(e) {
    this.segments.forEach((t) => {
      t.x1 = t.x1Normalized * e, t.x2 = t.x2Normalized * e, t.width = t.widthNormalized * e;
    });
  }
}
class I {
  constructor(e = 0, t = 0, i = 0, o = 0) {
    r(this, "_x1");
    r(this, "_x2");
    r(this, "_y1");
    r(this, "_y2");
    r(this, "_width");
    r(this, "_height");
    this._x1 = e, this._x2 = t, this._y1 = i, this._y2 = o, this._width = 0, this._height = 0, this.calculateWidth(), this.calculateHeight();
  }
  set x1(e) {
    this._x1 = e, this.calculateWidth();
  }
  get x1() {
    return this._x1;
  }
  set x2(e) {
    this._x2 = e, this.calculateWidth();
  }
  get x2() {
    return this._x2;
  }
  set y1(e) {
    this._y1 = e, this.calculateHeight();
  }
  get y1() {
    return this._y1;
  }
  set y2(e) {
    this._y2 = e, this.calculateHeight();
  }
  get y2() {
    return this._y2;
  }
  set width(e) {
    this._width = e, this._x2 = this._x1 + this._width;
  }
  get width() {
    return this._width;
  }
  set height(e) {
    this._height = e, this._y2 = this._y1 + this._height;
  }
  get height() {
    return this._height;
  }
  get middleX() {
    return this._x1 + this._width / 2;
  }
  get middleY() {
    return this._y1 + this._height / 2;
  }
  calculateWidth() {
    this._width = this.x2 - this.x1;
  }
  calculateHeight() {
    this._height = this.y2 - this.y1;
  }
}
class ft {
  constructor(e, t) {
    r(this, "id");
    r(this, "factor");
    r(this, "s");
    r(this, "a");
    r(this, "b");
    this.id = e, this.factor = t, this.s = 0, this.a = 0, this.b = 0;
  }
}
class J {
  constructor(e) {
    r(this, "_scale");
    r(this, "_gap");
    r(this, "segments", /* @__PURE__ */ new Map());
    this._scale = (e == null ? void 0 : e.scale) || 1, this._gap = (e == null ? void 0 : e.gap) || 0;
  }
  get scale() {
    return this._scale;
  }
  set scale(e) {
    e !== this._scale && (this._scale = e, this.calculate());
  }
  get gap() {
    return this._gap;
  }
  set gap(e) {
    e !== this._gap && (this._gap = e, this.calculate());
  }
  cut(e, t) {
    var i;
    ((i = this.segments.get(e)) == null ? void 0 : i.factor) !== t && (this.segments.set(e, new ft(e, t)), this.calculate());
  }
  get(e) {
    return this.segments.get(e);
  }
  calculate() {
    const e = Array.from(this.segments), t = e.filter((c) => c[1].factor), i = 1 / this.scale - this.gap * Math.max(t.length - 1, 0) * (1 / this.scale), o = e.reduce((c, n) => c + n[1].factor, 0);
    for (let c = 0; c < e.length; c++) {
      const n = e[c][1];
      n.s = n.factor / o * i;
    }
    for (let c = 0; c < e.length; c++) {
      const n = e[c][1];
      n.a = 0;
      for (let h = 0; h < c; h++)
        e[h][1].factor && (n.a += e[h][1].s + this.gap);
      n.b = n.a + n.s;
    }
  }
}
class gt {
  constructor() {
    r(this, "segmentator");
    r(this, "rows");
    r(this, "visualizers");
    this.segmentator = new J({ scale: 1, gap: 0.03 }), this.rows = [], this.visualizers = /* @__PURE__ */ new Map();
  }
  addVisualizer(e) {
    return this.rows[e.rowParameter] || (this.rows[e.rowParameter] = new I()), e.isActive && (this.visualizers.has(e.rowParameter) ? this.visualizers.get(e.rowParameter).add(e) : this.visualizers.set(e.rowParameter, /* @__PURE__ */ new Set([e]))), this.segmentate(), this.rows[e.rowParameter];
  }
  removeVisualizer(e) {
    this.visualizers.has(e.rowParameter) && this.visualizers.get(e.rowParameter).delete(e), this.segmentate();
  }
  resize(e, t, i, o) {
    this.segmentator.segments.forEach((c) => {
      this.rows[c.id] && (this.rows[c.id].x1 = e, this.rows[c.id].x2 = t, this.rows[c.id].y1 = i + o * c.a, this.rows[c.id].y2 = i + o * c.b);
    });
  }
  segmentate() {
    for (let e = 0; e < this.rows.length; e++) {
      const t = this.visualizers.get(e);
      let i = 0;
      t == null || t.forEach(
        (o) => o.rowFactorParameter > i && (i = o.rowFactorParameter)
      ), this.segmentator.cut(e, i);
    }
  }
}
class T {
  constructor() {
    r(this, "complexGraph");
    r(this, "destroyed");
    if (!M.target)
      throw new Error("[Extension] \u0441\u043F\u0435\u0440\u0432\u0430 \u043D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0441\u043E\u0437\u0434\u0430\u0442\u044C \u0433\u0440\u0430\u0444\u0438\u043A");
    this.complexGraph = M.target, this.complexGraph.extensions.add(this), this.destroyed = !1;
  }
  destroy() {
    var e;
    this.destroyed || (this.destroyed = !0, this.complexGraph.extensions.delete(this), (e = this.onDestroy) == null || e.call(this));
  }
}
class k extends T {
  constructor(t) {
    super();
    r(this, "name");
    r(this, "isActive");
    this.name = t == null ? void 0 : t.name, this.isActive = !(t != null && t.unactive), setTimeout(() => {
      var i;
      this.complexGraph.scene.addObject(this), (i = this.onObjectReady) == null || i.call(this), this.complexGraph.renderer.redraw();
    }, 10);
  }
  onDestroy() {
    this.complexGraph.scene.removeObject(this), this.complexGraph.renderer.redraw();
  }
}
class vt extends k {
  constructor() {
    super();
    r(this, "clipArea");
    r(this, "area");
    r(this, "fontSize");
    r(this, "isDaysZoom");
    r(this, "isDaysFullZoom");
    r(this, "isHoursZoom");
    r(this, "isHoursFullZoom");
    this.clipArea = new I(), this.area = new I(), this.fontSize = 0, this.isDaysZoom = !1, this.isDaysFullZoom = !1, this.isHoursZoom = !1, this.isHoursFullZoom = !1;
  }
  onRender() {
    const { renderer: t, scene: i } = this.complexGraph;
    t.context.lineJoin = "round";
    const o = t.minSize * 0.15, c = t.minSize * 0.03;
    this.clipArea.x1 = o + i.position.pointer.current, this.clipArea.x2 = t.size.x - o + i.position.pointer.current, this.clipArea.y1 = c, this.clipArea.y2 = t.size.y - c * 3, this.area.x1 = o, this.area.x2 = i.size.pointer.current - o, this.area.y1 = this.clipArea.y1, this.area.y2 = this.clipArea.y2 * 0.95, this.fontSize = this.complexGraph.fontSize * t.minSize;
    const n = this.complexGraph.timeline.segments.length / 2e3;
    this.isDaysZoom = i.zoom > n, this.isDaysFullZoom = i.zoom > n * 2.5, this.isHoursZoom = i.zoom > n * 12.5, this.isHoursFullZoom = i.zoom > n * 35, this.complexGraph.timeline.resize(this.area.width), this.complexGraph.rows.resize(
      this.clipArea.x1,
      this.clipArea.x2,
      this.clipArea.y1,
      this.area.height
    );
  }
  clip(t, i) {
    t.context.save(), t.context.beginPath(), t.context.rect(
      this.clipArea.x1,
      this.clipArea.y1,
      this.clipArea.width,
      this.clipArea.height
    ), t.context.clip(), t.context.closePath(), i(), t.context.restore();
  }
  isSegmentVisible(t, i) {
    const { scene: o } = this.complexGraph;
    return !(o.position.pointer.current > (i || t).x2 + this.area.x1 || o.position.pointer.current + this.clipArea.width < t.x1 - this.area.x1);
  }
  isPointVisible(t, i = 0, o = 0) {
    const { scene: c } = this.complexGraph;
    return !(c.position.pointer.current > t.x + t.width - this.area.x1 + i || c.position.pointer.current + this.clipArea.width < t.x - this.area.x1 - o);
  }
}
class j {
  constructor() {
    r(this, "target");
    this.target = null;
  }
  remove(e) {
    e === this.target && (this.target = null);
  }
}
const M = new j();
class yt {
  constructor(e) {
    r(this, "extensions");
    r(this, "wrapper");
    r(this, "container");
    r(this, "timeline");
    r(this, "scene");
    r(this, "renderer");
    r(this, "rows");
    r(this, "calculator");
    r(this, "fontSize");
    r(this, "font");
    M.target = this, this.extensions = /* @__PURE__ */ new Set(), this.wrapper = e.wrapper, this.container = document.createElement("div"), this.container.style.cssText = `
      position: relative;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
      touch-action: none;
    `, this.wrapper.appendChild(this.container), this.timeline = new pt(e.timeline), this.scene = new at({
      maxZoom: (e.maxZoom || 5) * this.timeline.segments.length * 0.01,
      zoom: e.zoom,
      positionProgress: e.positionProgress,
      sizeProgress: e.sizeProgress
    }), this.renderer = new dt({
      container: this.container,
      scene: this.scene,
      clearColor: "white"
    }), this.rows = new gt(), this.calculator = new vt(), this.fontSize = e.fontSize || 0.02, this.font = e.font || "sans-serif", this.scene.addObject(this.calculator);
  }
  destroy() {
    M.remove(this), this.renderer.destroy(), this.extensions.forEach((e) => {
      var t;
      return (t = e.destroy) == null ? void 0 : t.call(e);
    }), this.wrapper.removeChild(this.container);
  }
  hide(e) {
    e.isActive = !1, this.rows.removeVisualizer(e), this.renderer.redraw();
  }
  show(e) {
    e.isActive = !0, this.rows.addVisualizer(e), this.renderer.redraw();
  }
}
function K(s, e, t = { x: 0, y: 0 }) {
  const i = e.getBoundingClientRect();
  return {
    x: Math.floor(
      (s.clientX - i.left - t.x) / (e.offsetWidth - t.x * 2) * e.offsetWidth
    ),
    y: Math.floor(
      (s.clientY - i.top - t.y) / (e.offsetHeight - t.y * 2) * e.offsetHeight
    )
  };
}
function q(s, e, t = { x: 0, y: 0 }) {
  const i = e.getBoundingClientRect();
  return {
    x: Math.floor(
      (s.touches[0].clientX - i.left - t.x) / (e.offsetWidth - t.x * 2) * e.offsetWidth
    ),
    y: Math.floor(
      (s.touches[0].clientY - i.top - t.y) / (e.offsetHeight - t.y * 2) * e.offsetHeight
    )
  };
}
function O(s) {
  return Math.hypot(
    s.touches[0].pageX - s.touches[1].pageX,
    s.touches[0].pageY - s.touches[1].pageY
  );
}
class wt extends T {
  constructor() {
    super();
    r(this, "handleTouch", (t) => {
      const { renderer: i, scene: o, container: c, calculator: n } = this.complexGraph, h = (x) => {
        if (x.touches.length === 2) {
          const E = O(x) - u, y = 100, g = o.zoom * 0.2, w = l + E / y * g;
          i.withTicker(() => {
            o.scaleSet(m, w);
          });
        } else {
          const f = d + (t.touches[0].clientX - x.touches[0].clientX) * 2;
          Math.abs(f) > 100 && i.withTicker(() => {
            o.setTranslate(f);
          });
        }
      }, a = () => {
        removeEventListener("touchmove", h), removeEventListener("touchend", a);
      };
      let u = 0;
      const d = o.position.pointer.current, l = o.zoom;
      let m = 0;
      t.touches.length === 2 ? (u = O(t), m = q(t, c, {
        x: n.area.x1,
        y: 0
      }).x) : m = q(t, c, {
        x: n.area.x1,
        y: 0
      }).x, addEventListener("touchmove", h), addEventListener("touchend", a);
    });
    this.complexGraph.container.addEventListener("touchstart", this.handleTouch);
  }
  onDestroy() {
    this.complexGraph.container.removeEventListener("touchstart", this.handleTouch);
  }
}
class bt extends T {
  constructor() {
    super();
    r(this, "scaleButtonPressed");
    r(this, "handleWheel", (t) => {
      const { scene: i, renderer: o, container: c, calculator: n } = this.complexGraph;
      if (this.scaleButtonPressed) {
        const h = K(t, c, {
          x: n.area.x1,
          y: 0
        }).x, a = G(t.deltaY, -1, 1) * i.zoom * 0.2;
        o.withTicker(() => {
          i.scaleStep(h, a);
        });
      } else
        o.withTicker(() => {
          i.translate(t.deltaY);
        });
    });
    r(this, "handlePointerDown", (t) => {
      t.button === 0 && (t.preventDefault(), this.scaleButtonPressed = !0);
    });
    r(this, "handlePointerUp", (t) => {
      t.button === 0 && (t.preventDefault(), this.scaleButtonPressed = !1);
    });
    r(this, "handleContextMenu", (t) => {
      t.preventDefault();
    });
    this.scaleButtonPressed = !1, this.complexGraph.container.addEventListener("wheel", this.handleWheel), this.complexGraph.container.addEventListener("pointerdown", this.handlePointerDown), this.complexGraph.container.addEventListener("pointerup", this.handlePointerUp), this.complexGraph.container.addEventListener("contextmenu", this.handleContextMenu);
  }
  onDestroy() {
    this.complexGraph.container.removeEventListener("wheel", this.handleWheel), this.complexGraph.container.removeEventListener("pointerdown", this.handlePointerDown), this.complexGraph.container.removeEventListener("pointerup", this.handlePointerUp), this.complexGraph.container.removeEventListener("contextmenu", this.handleContextMenu);
  }
}
class zt extends k {
  constructor(t) {
    super();
    r(this, "backgroundColor");
    this.backgroundColor = (t == null ? void 0 : t.backgroundColor) || "#f5fcff";
  }
  onRender() {
    const { renderer: t } = this.complexGraph;
    t.context.fillStyle = this.backgroundColor, t.context.fillRect(
      this.complexGraph.calculator.clipArea.x1,
      this.complexGraph.calculator.clipArea.y1,
      this.complexGraph.calculator.clipArea.width,
      this.complexGraph.calculator.clipArea.height
    );
  }
}
class Et extends k {
  constructor(t) {
    super({ name: "", ...t });
    r(this, "start");
    r(this, "end");
    r(this, "startParam");
    r(this, "endParam");
    r(this, "fillParam");
    r(this, "shortName");
    r(this, "fontColor");
    r(this, "backgroundColor");
    r(this, "edgeColor");
    this.start = null, this.end = null, this.startParam = t.start, this.endParam = t.end, this.fillParam = t.fill, this.shortName = t.shortName || this.name || "", this.fontColor = t.fontColor || "darkblue", this.backgroundColor = t.backgroundColor || "lightblue", this.edgeColor = t.edgeColor || "darkgrey";
    const i = this.complexGraph.timeline.segments.find((c) => c.date === this.startParam);
    if (!i)
      throw new Error(`[Phase] \u0421\u0442\u0430\u0440\u0442\u043E\u0432\u044B\u0439 \u0441\u0435\u0433\u043C\u0435\u043D\u0442 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D ${this.startParam}`);
    const o = this.complexGraph.timeline.segments.find((c) => c.date === this.endParam);
    if (!o)
      throw new Error(`[Phase] \u041A\u043E\u043D\u0435\u0447\u043D\u044B\u0439 \u0441\u0435\u0433\u043C\u0435\u043D\u0442 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D ${this.startParam}`);
    this.start = i, this.end = this.fillParam ? o.nextDaySegment : o;
  }
  onRender() {
    const { renderer: t } = this.complexGraph;
    this.complexGraph.calculator.clip(t, () => {
      if (t.context.fillStyle = this.backgroundColor, !this.complexGraph.calculator.isSegmentVisible(this.start, this.end))
        return;
      const i = this.end.x2 - this.start.x1, o = this.complexGraph.calculator.area.x1 + this.start.x1 + i / 2, c = (this.complexGraph.calculator.clipArea.height - this.complexGraph.calculator.area.height) / 2;
      t.context.fillRect(
        this.complexGraph.calculator.area.x1 + this.start.x1,
        this.complexGraph.calculator.clipArea.y1,
        i,
        this.complexGraph.calculator.clipArea.height
      ), t.context.fillStyle = this.fontColor, t.context.font = `${this.complexGraph.calculator.fontSize}px ${this.complexGraph.font}`, t.context.textBaseline = "middle", t.context.textAlign = "center";
      let n = t.context.measureText(this.name);
      const a = n.width > i ? this.shortName : this.name;
      n = t.context.measureText(a), n.width > i && (t.context.font = `${this.complexGraph.calculator.fontSize * 0.5}px ${this.complexGraph.font}`), t.context.fillText(a, o, this.complexGraph.calculator.clipArea.y2 - c), t.context.save(), t.context.setLineDash([5]), t.context.strokeStyle = this.edgeColor, t.context.lineWidth = 1 / this.complexGraph.renderer.pixelRatio, t.context.beginPath(), t.context.moveTo(
        this.complexGraph.calculator.area.x1 + this.start.x1,
        this.complexGraph.calculator.clipArea.y1
      ), t.context.lineTo(
        this.complexGraph.calculator.area.x1 + this.start.x1,
        this.complexGraph.calculator.clipArea.y2
      ), t.context.stroke(), t.context.restore();
    });
  }
}
const St = {
  \u041E\u0420: {
    fontColor: "#C08C50",
    backgroundColor: "#FEFFD7",
    name: "\u041E\u0442\u043A\u0440\u044B\u0442\u043E\u0435 \u0440\u0443\u0441\u043B\u043E",
    shortName: "\u041E\u0420"
  },
  \u041E\u041F\u041F: {
    fontColor: "#C86546",
    backgroundColor: "#FBE9DD",
    name: "\u041E\u0441\u0435\u043D\u043D\u0438\u0439 \u043F\u0435\u0440\u0435\u0445\u043E\u0434\u043D\u044B\u0439",
    shortName: "\u041E\u041F\u041F"
  },
  \u041B\u0414: {
    fontColor: "#243372",
    backgroundColor: "#D5F2FA",
    name: "\u041B\u0435\u0434\u043E\u0441\u0442\u0430\u0432",
    shortName: "\u041B\u0414"
  },
  \u0412\u041F\u041F: {
    fontColor: "#2F7B3A",
    backgroundColor: "#E0FFDF",
    name: "\u0412\u0435\u0441\u0435\u043D\u043D\u0438\u0439 \u043F\u0435\u0440\u0435\u0445\u043E\u0434\u043D\u044B\u0439",
    shortName: "\u0412\u041F\u041F"
  },
  \u0417\u0410\u0420: {
    fontColor: "#128B8C",
    backgroundColor: "#BFD4D0",
    name: "\u0417\u0430\u0440\u0430\u0441\u0442\u0430\u043D\u0438\u0435",
    shortName: "\u0417\u0410\u0420"
  }
};
function Gt(s) {
  s.forEach((e, t, i) => {
    new Et({
      ...St[e.type],
      start: e.start,
      end: e.end,
      fill: t === i.length - 1
    });
  });
}
class Ct extends k {
  constructor(t) {
    super();
    r(this, "bar");
    r(this, "knob");
    r(this, "grabbed", null);
    r(this, "hovered", null);
    r(this, "handlePointerEnter", () => {
      const { scene: t } = this.complexGraph;
      this.hovered = !0, this.bar.style.opacity = t.zoom !== 1 ? "1" : "0";
    });
    r(this, "handlePointerLeave", () => {
      const { scene: t } = this.complexGraph;
      this.hovered = !1, this.bar.style.opacity = t.zoom !== 1 ? "0.3" : "0";
    });
    r(this, "handlePointerDown", (t) => {
      const { renderer: i, scene: o } = this.complexGraph, c = (u) => {
        i.withTicker(() => {
          const d = a + (u.x - h) * o.zoom;
          o.setTranslate(d);
        });
      }, n = () => {
        document.body.style.cursor = "", this.knob.style.cursor = "grab", this.grabbed = !1, removeEventListener("pointermove", c), removeEventListener("pointerup", n);
      }, h = t.x, a = o.position.pointer.target;
      o.zoom !== 1 && (document.body.style.cursor = "grabbing", this.knob.style.cursor = "grabbing", this.grabbed = !0, addEventListener("pointermove", c), addEventListener("pointerup", n));
    });
    this.bar = document.createElement("div"), this.knob = document.createElement("div"), this.bar.style.cssText = `
      position: absolute;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 1%;
      pointer-events: none;
      transition: opacity 1s, color 0.5s;
      opacity: 0;
    `, this.knob.style.cssText = `
      position: absolute;
      left: 0;
      top: 0;
      width: 1px;
      height: 100%;
      background-color: ${(t == null ? void 0 : t.color) || "black"};
      transform-origin: left;
      pointer-events: none;
      cursor: grab;
    `, this.grabbed = !1, this.hovered = !1, this.bar.appendChild(this.knob), this.complexGraph.container.appendChild(this.bar), this.knob.addEventListener("pointerdown", this.handlePointerDown), this.knob.addEventListener("pointerenter", this.handlePointerEnter), this.knob.addEventListener("pointerleave", this.handlePointerLeave);
  }
  onDestroy() {
    this.knob.removeEventListener("pointerdown", this.handlePointerDown), this.knob.removeEventListener("pointerenter", this.handlePointerEnter), this.knob.removeEventListener("pointerleave", this.handlePointerLeave), this.complexGraph.container.removeChild(this.bar);
  }
  onRender() {
    const { scene: t } = this.complexGraph, i = this.complexGraph.calculator;
    this.bar.style.top = i.clipArea.y2 + "px";
    const o = 0.9;
    let n = (t.size.pointer.current - t.viewportSize) / t.viewportSize;
    const h = this.complexGraph.scene.maxZoom - n * o, a = (t.viewportSize - i.area.x1 * 2) / this.complexGraph.scene.maxZoom * h, u = i.area.x1 + t.position.pointer.current / (t.viewportSize * this.complexGraph.scene.maxZoom / i.clipArea.width) * o;
    this.knob.style.transform = `translateX(${u}px)`, this.knob.style.width = a + "px", t.zoom === 1 ? (this.bar.style.opacity = "0", this.knob.style.pointerEvents = "none") : (this.bar.style.opacity = this.grabbed || this.hovered ? "1" : "0.3", this.knob.style.pointerEvents = "auto");
  }
}
class Dt extends k {
  constructor(t) {
    super();
    r(this, "scaleColor");
    r(this, "fontColor");
    r(this, "monthColor");
    r(this, "dayColor");
    r(this, "hourColor");
    r(this, "decadeColor");
    this.scaleColor = (t == null ? void 0 : t.scaleColor) || "black", this.fontColor = (t == null ? void 0 : t.fontColor) || "black", this.monthColor = (t == null ? void 0 : t.monthColor) || "#a5a4a4", this.dayColor = (t == null ? void 0 : t.dayColor) || "#d1d1d1", this.hourColor = (t == null ? void 0 : t.hourColor) || "#d1d1d1", this.decadeColor = (t == null ? void 0 : t.decadeColor) || "#FF5370";
  }
  onRender() {
    const { renderer: t, scene: i } = this.complexGraph, o = t.minSize * 0.01, c = (t.size.y - this.complexGraph.calculator.clipArea.y2) / 3, n = o, h = i.size.pointer.current - o, a = this.complexGraph.calculator.clipArea.y2 + c, u = this.complexGraph.calculator.clipArea.y2, d = t.minSize * 3e-3, l = this.complexGraph.calculator.fontSize, m = d * 4, x = l * 0.9, f = m * 0.6, E = x * 0.8, y = f * 0.6, g = a - this.complexGraph.calculator.clipArea.height - c;
    t.context.strokeStyle = this.scaleColor, t.context.lineWidth = d / this.complexGraph.renderer.pixelRatio, t.context.beginPath(), t.context.moveTo(n, a), t.context.lineTo(h, a), t.context.stroke(), t.context.fillStyle = this.fontColor, t.context.textAlign = "center", t.context.textBaseline = "top", this.renderSegments({
      scene: i,
      month: (w, p) => {
        t.context.fillStyle = this.fontColor, t.context.strokeStyle = this.fontColor, t.context.beginPath(), t.context.moveTo(p, a - m), t.context.lineTo(p, a + m), t.context.stroke(), t.context.font = `${l}px ${this.complexGraph.font}`, t.context.fillText(w.title, p, a + m * 2);
      },
      day: (w, p, C) => {
        w.number == 11 || w.number == 21 ? (t.context.fillStyle = this.decadeColor, t.context.strokeStyle = this.decadeColor) : (t.context.fillStyle = this.fontColor, t.context.strokeStyle = this.fontColor), t.context.beginPath(), t.context.moveTo(p, a - f), t.context.lineTo(p, a + f), t.context.stroke(), C && (t.context.font = `${x}px ${this.complexGraph.font}`, t.context.fillText(w.title, p, a + f * 2));
      },
      hour: (w, p, C) => {
        t.context.fillStyle = this.fontColor, t.context.strokeStyle = this.fontColor, t.context.beginPath(), t.context.moveTo(p, a - y), t.context.lineTo(p, a + y), t.context.stroke(), C && (t.context.font = `${E}px ${this.complexGraph.font}`, t.context.fillText(w.title, p, a + y * 2));
      }
    }), this.complexGraph.calculator.clip(t, () => {
      t.context.lineWidth = 1 / this.complexGraph.renderer.pixelRatio, this.renderSegments({
        scene: i,
        month: (w, p) => {
          t.context.save(), t.context.strokeStyle = this.monthColor, t.context.globalAlpha = 0.7, t.context.beginPath(), t.context.moveTo(p, u), t.context.lineTo(p, g), t.context.stroke(), t.context.restore();
        },
        day: (w, p, C) => {
          t.context.save(), t.context.strokeStyle = this.dayColor, t.context.globalAlpha = C ? 0.5 : 0.3, t.context.beginPath(), t.context.moveTo(p, u), t.context.lineTo(p, g), t.context.stroke(), t.context.restore();
        },
        hour: (w, p, C) => {
          t.context.save(), t.context.strokeStyle = this.hourColor, t.context.globalAlpha = C ? 0.3 : 0.1, t.context.beginPath(), t.context.moveTo(p, u), t.context.lineTo(p, g), t.context.stroke(), t.context.restore();
        },
        decade: (w, p) => {
          t.context.save(), t.context.strokeStyle = this.decadeColor, t.context.globalAlpha = 0.3, t.context.beginPath(), t.context.moveTo(p, u), t.context.lineTo(p, g), t.context.stroke(), t.context.restore();
        }
      }), t.context.beginPath(), t.context.moveTo(
        this.complexGraph.calculator.clipArea.x1,
        this.complexGraph.calculator.area.y2
      ), t.context.lineTo(
        this.complexGraph.calculator.clipArea.x1 + this.complexGraph.calculator.clipArea.width,
        this.complexGraph.calculator.area.y2
      ), t.context.strokeStyle = this.scaleColor, t.context.stroke();
    });
  }
  renderSegments(t) {
    this.complexGraph.timeline.segments.forEach((i, o) => {
      var c;
      o === 0 || !this.complexGraph.calculator.isSegmentVisible(i) || (i.type === "month" && t.month(i, this.complexGraph.calculator.area.x1 + i.x1), i.type === "day" && (this.complexGraph.calculator.isDaysZoom && (this.complexGraph.calculator.isDaysFullZoom ? t.day(i, this.complexGraph.calculator.area.x1 + i.x1, !0) : i.number % 5 === 1 && i.number !== 31 && t.day(i, this.complexGraph.calculator.area.x1 + i.x1, !0)), (i.title === "11" || i.title === "21") && ((c = t.decade) == null || c.call(t, i, this.complexGraph.calculator.area.x1 + i.x1, !0))), i.type === "hour" && this.complexGraph.calculator.isHoursZoom && (this.complexGraph.calculator.isHoursFullZoom ? t.hour(i, this.complexGraph.calculator.area.x1 + i.x1, !0) : i.number % 4 === 0 && t.hour(i, this.complexGraph.calculator.area.x1 + i.x1, !0)));
    });
  }
}
function A(s, e) {
  if (s.x < e.x + e.width && s.x > e.x && s.y < e.y + e.height && s.y > e.y)
    return !0;
}
class Pt {
  constructor(e) {
    r(this, "color");
    r(this, "gridColor");
    r(this, "step");
    r(this, "abs");
    r(this, "segments");
    r(this, "title");
    r(this, "position");
    r(this, "scaleScatter");
    r(this, "gridActive");
    this.step = e.step || 5, this.abs = e.abs || !1, this.segments = [], this.title = e.title || "", this.position = e.position || "left", this.gridColor = e.gridColor, this.color = e.color || "black", this.scaleScatter = null, this.gridActive = e.gridActive || !1;
  }
  create(e, t) {
    const i = this.step;
    e = Math.floor(e / i) * i, t = Math.ceil(t / i) * i, this.scaleScatter = t - e;
    for (let o = 0; o <= this.scaleScatter / i; o++)
      this.segments[o] = {
        value: e + o * i,
        y: 0
      };
    return { min: e, max: t };
  }
  render(e, t, i, o = "sans-serif", c = 0) {
    const n = i.y2 - c, h = i.height - c;
    this.segments.forEach((x, f) => {
      x.y = n - h / (this.segments.length - 1) * f;
    });
    const a = this.position === "left", u = e.minSize * 2e-3, d = u * 4, l = e.minSize * 0.01, m = a ? i.x1 - d * 2 : i.x2 + d * 2;
    e.context.lineWidth = u / Math.min(devicePixelRatio, 2), e.context.strokeStyle = this.color, e.context.beginPath(), e.context.moveTo(m, i.y1 - d * 1.5), e.context.lineTo(m, n), e.context.stroke(), e.context.fillStyle = this.color, e.context.beginPath(), e.context.moveTo(m - d, i.y1), e.context.lineTo(m, i.y1 - d * 1.5), e.context.lineTo(m + d, i.y1), e.context.fill(), this.segments.forEach((x, f, E) => {
      const y = this.skip({ segment: x, index: f, segments: E }), g = y ? d * 0.5 : d;
      e.context.strokeStyle = this.color, e.context.beginPath(), e.context.moveTo(m - g, x.y), e.context.lineTo(m + g, x.y), e.context.stroke(), !y && (e.context.fillStyle = "black", e.context.font = `${t.fontSize * 0.9}px ${o}`, e.context.textBaseline = "middle", e.context.textAlign = a ? "right" : "left", e.context.fillText(
        (this.abs ? Math.abs(x.value) : x.value).toString(),
        m - d * 2 * (a ? 1 : -1),
        x.y
      ));
    }), this.gridColor && this.gridActive && (e.context.strokeStyle = this.gridColor, t.clip(e, () => {
      this.segments.forEach((x, f, E) => {
        const y = this.skip({ segment: x, index: f, segments: E });
        e.context.save(), e.context.lineWidth = 1 / Math.min(devicePixelRatio, 2), e.context.globalAlpha = x.value == 0 ? 1 : y ? 0.1 : 0.3, e.context.beginPath();
        const g = Math.floor(x.y) + 0.5;
        e.context.moveTo(t.clipArea.x1, g), e.context.lineTo(t.clipArea.x2, g), e.context.stroke(), e.context.restore();
      });
    })), e.context.save(), e.context.font = `${t.fontSize}px ${o}`, e.context.textBaseline = a ? "top" : "bottom", e.context.textAlign = "center", e.context.fillStyle = "black", e.context.rotate(-Math.PI / 2), e.context.translate(
      i.y1 * -1 + i.height / 2 * -1,
      a ? t.clipArea.x1 - t.area.x1 + l : t.clipArea.x2 + t.area.x1 - l
    ), e.context.fillText(this.title, 0, 0), e.context.restore();
  }
  skip(e) {
    if (e.segments.length === 2)
      return !1;
    if (e.index === e.segments.length)
      return !0;
    if (e.index % 2 !== 0)
      return !0;
  }
}
class Z {
  constructor(e) {
    r(this, "visualizer");
    r(this, "name");
    r(this, "color");
    r(this, "isVisible");
    if (!_.target)
      throw new Error(
        "[VisualizerElementsGroup] \u043F\u0440\u0435\u0436\u0434\u0435 \u0447\u0435\u043C \u0441\u043E\u0437\u0434\u0430\u0432\u0430\u0442\u044C VisualizerElementsGroup \u043D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0441\u043E\u0437\u0434\u0430\u0442\u044C Visualizer"
      );
    this.visualizer = _.target, this.visualizer.groups.add(this), this.name = e.name, this.color = e.color || "black", this.isVisible = !0;
  }
  destroy() {
    this.visualizer.groups.delete(this);
  }
  hide() {
    this.isVisible = !1, this.visualizer.complexGraph.renderer.redraw();
  }
  show() {
    this.isVisible = !0, this.visualizer.complexGraph.renderer.redraw();
  }
}
class L extends Z {
  constructor(t) {
    super(t);
    r(this, "elements");
    this.elements = [], this.hitInfo = t.hitInfo || this.hitInfo, t.data.forEach((i) => {
      let o = this.visualizer.complexGraph.timeline.segments.find(
        (n) => n.date === i.date
      );
      if (!o)
        throw new Error(`\u0421\u0435\u0433\u043C\u0435\u043D\u0442 \u0441 \u0434\u0430\u0442\u043E\u0439 ${i.date} \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D.`);
      o = i.fillDay ? o.currentDaySegment : o;
      const c = i.fillDay ? o.nextDaySegment : o.nextHourSegment;
      this.elements.push(this.createElement({ ...i, startSegment: o, endSegment: c }));
    }), this.elements.sort((i, o) => i.startSegment.index - o.startSegment.index);
  }
  calculateMinMax() {
    const t = {
      min: 0,
      max: 0
    };
    return this.getElementNumberValue && this.elements.forEach((i) => {
      const o = this.getElementNumberValue(i), c = Array.isArray(o) ? o : [o, o];
      t.min = c[0] < t.min ? c[0] : t.min, t.max = c[1] > t.max ? c[1] : t.max;
    }), t;
  }
}
const _ = new j();
class S extends k {
  constructor(t) {
    super(t);
    r(this, "rowParameter");
    r(this, "rowFactorParameter");
    r(this, "groups");
    r(this, "row", null);
    r(this, "min", null);
    r(this, "max", null);
    r(this, "scale");
    r(this, "_paddingBottom");
    _.target = this, this.rowParameter = t.row, this.rowFactorParameter = t.rowFactor || 1, this.groups = /* @__PURE__ */ new Set(), t.scale && (this.scale = new Pt(t.scale)), this._paddingBottom = t.paddingBottom || 0, this.row = this.complexGraph.rows.addVisualizer(this), this.min = 0, this.max = -999999999, setTimeout(() => {
      if (this.calculateMinMax(), this.scale) {
        const { min: i, max: o } = this.scale.create(this.min, this.max);
        this.min = i, this.max = o;
      }
    }, 0);
  }
  onDestroy() {
    _.remove(this), this.complexGraph.rows.removeVisualizer(this);
  }
  get paddingBottom() {
    return this._paddingBottom * this.row.height;
  }
  onRender() {
    var n;
    const { renderer: t, calculator: i, font: o } = this.complexGraph, c = (this.row.height - this.paddingBottom) / Math.max(1, this.max - this.min);
    this.groups.forEach((h) => {
      var a;
      !h.isVisible || (a = h.resize) == null || a.call(h, c);
    }), (n = this.scale) == null || n.render(t, i, this.row, o, this.paddingBottom), this.complexGraph.calculator.clip(this.complexGraph.renderer, () => {
      this.groups.forEach((h) => {
        var a;
        !h.isVisible || (a = h.render) == null || a.call(h, c);
      });
    });
  }
  show() {
    this.groups.forEach((t) => {
      t.isVisible = !0;
    }), this.complexGraph.show(this);
  }
  hide() {
    this.groups.forEach((t) => {
      t.isVisible = !1;
    }), this.complexGraph.hide(this);
  }
  showGrid() {
    this.scale && (this.scale.gridActive = !0, this.complexGraph.renderer.redraw());
  }
  hideGrid() {
    this.scale && (this.scale.gridActive = !1, this.complexGraph.renderer.redraw());
  }
  calculateMinMax() {
    this.groups.forEach((t) => {
      if (t instanceof L) {
        const { min: i, max: o } = t.calculateMinMax();
        this.min = i < this.min ? i : this.min, this.max = o > this.max ? o : this.max;
      }
    });
  }
}
class P {
  constructor(e) {
    r(this, "x");
    r(this, "y");
    r(this, "width");
    r(this, "height");
    r(this, "startSegment");
    r(this, "endSegment");
    r(this, "value");
    r(this, "comment");
    this.x = 0, this.y = 0, this.width = 0, this.height = 0, this.startSegment = e.startSegment, this.endSegment = e.endSegment, this.value = e.value, this.comment = e.comment ? Array.isArray(e.comment) ? e.comment : [e.comment] : [];
  }
}
function Tt(s, e) {
  s.beginPath();
  const t = e[0], i = t.x, o = t.y;
  s.moveTo(i, o);
  for (let c = 1; c < e.length; c++) {
    const n = e[c], h = n.x, a = n.y;
    n.new ? s.moveTo(h, a) : s.lineTo(h, a);
  }
}
class kt extends P {
  constructor(t) {
    super(t);
    r(this, "new");
    this.new = t.new || !1;
  }
}
class Q extends L {
  constructor(e) {
    if (super(e), e.maxDaysGap) {
      let t, i = 0;
      this.elements.forEach((o) => {
        o.new ? i = 0 : i > 1 && t && o.startSegment.daysBefore - t.startSegment.daysBefore > e.maxDaysGap && (o.new = !0, i = 0), i++, t = o;
      });
    }
  }
  render(e) {
    this.drawLinear();
  }
  drawLinear(e = this.color) {
    const { renderer: t } = this.visualizer.complexGraph, { context: i } = t;
    i.strokeStyle = e, i.lineWidth = 1 / t.pixelRatio, Tt(i, this.elements), i.stroke();
  }
  createElement(e) {
    return new kt(e);
  }
}
class z extends Q {
  constructor(e) {
    super(e);
  }
  resize(e) {
    const { complexGraph: t, row: i, paddingBottom: o, min: c } = this.visualizer;
    this.elements.forEach((n) => {
      n.width = n.startSegment.x1 - n.endSegment.x1, n.height = e * (n.value - c), n.x = t.calculator.area.x1 + n.startSegment.x1, n.y = i.y2 - n.height - o;
    });
  }
  getElementNumberValue(e) {
    return e.value;
  }
  hitTest(e) {
    const t = this.visualizer.complexGraph.renderer.minSize * 0.03;
    return this.elements.find((o) => A(e, {
      x: o.x - t / 2,
      y: o.y - t / 2,
      width: t,
      height: t
    }));
  }
}
class N extends L {
  constructor(e) {
    super(e), this.getElementNumberValue = void 0;
  }
  resize() {
    const { complexGraph: e, row: t, paddingBottom: i } = this.visualizer;
    this.elements.forEach((o) => {
      o.x = e.calculator.area.x1 + o.startSegment.x1, o.width = o.endSegment.x1 - o.startSegment.x1, o.height = i / 2, o.y = t.y2 - i / 2;
    });
  }
  render() {
    const { renderer: e, scene: t, calculator: i } = this.visualizer.complexGraph;
    e.context.strokeStyle = this.color, e.context.lineWidth = 1 / e.pixelRatio, this.elements.forEach((o) => {
      if (!i.isPointVisible(o))
        return;
      const c = o.endSegment.daysBefore - o.startSegment.daysBefore, n = Math.ceil(t.zoom / 4) * c, h = o.width / n;
      for (let a = 0; a < n; a++)
        this.drawElement(o, a, h);
    });
  }
  hitTest(e) {
    return this.elements.find((i) => A(e, i));
  }
  hitInfo(e) {
    return [`\u0421\u0440\u043E\u043A: ${e.startSegment.date}`, `\u0421\u0443\u043C\u043C\u0430: ${e.value}`, ...e.comment];
  }
  createElement(e) {
    return new P(e);
  }
}
class At extends N {
  constructor(e) {
    super(e);
  }
  drawElement(e, t, i) {
    const { renderer: o } = this.visualizer.complexGraph;
    o.context.beginPath(), o.context.moveTo(e.x + i * t, e.y), o.context.lineTo(e.x + i * (t + 0.85), e.y + e.height), o.context.stroke();
  }
}
class Lt extends N {
  constructor(e) {
    super(e);
  }
  drawElement(e, t, i) {
    const { renderer: o } = this.visualizer.complexGraph;
    o.context.beginPath(), o.context.moveTo(e.x + i * (t + 0.85), e.y), o.context.lineTo(e.x + i * t, e.y + e.height), o.context.stroke();
  }
}
class Bt extends N {
  constructor(e) {
    super(e);
  }
  drawElement(e, t, i) {
    const { renderer: o } = this.visualizer.complexGraph;
    o.context.beginPath(), o.context.moveTo(e.x + i * t, e.y), o.context.lineTo(e.x + i * (t + 0.85), e.y + e.height), o.context.moveTo(e.x + i * (t + 0.85), e.y), o.context.lineTo(e.x + i * t, e.y + e.height), o.context.stroke();
  }
}
function Ft(s) {
  new S({
    name: "\u0422\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u0430 \u0432\u043E\u0437\u0434\u0443\u0445\u0430",
    row: 0,
    rowFactor: 1,
    scale: {
      title: "t \u0432\u043E\u0437\u0434\u0443\u0445\u0430 \xB0C",
      color: "#B13007",
      gridColor: "#B13007",
      gridActive: !0
    },
    paddingBottom: 0.2
  }), s.min && new z({
    name: "\u041C\u0438\u043D\u0438\u043C\u0430\u043B\u044C\u043D\u0430\u044F",
    color: "#0066FF",
    data: s.min,
    maxDaysGap: 3,
    hitInfo: (e) => [`\u0421\u0440\u043E\u043A: ${e.startSegment.date}`, `\u0422\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u0430: ${e.value}`, ...e.comment]
  }), s.middle && new z({
    name: "\u0421\u0440\u0435\u0434\u043D\u044F\u044F",
    color: "#6B6C7E",
    data: s.middle,
    maxDaysGap: 3,
    hitInfo: (e) => [`\u0421\u0440\u043E\u043A: ${e.startSegment.date}`, `\u0422\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u0430: ${e.value}`, ...e.comment]
  }), s.max && new z({
    name: "\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u0430\u044F",
    color: "#D72929",
    data: s.max,
    maxDaysGap: 3,
    hitInfo: (e) => [`\u0421\u0440\u043E\u043A: ${e.startSegment.date}`, `\u0422\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u0430: ${e.value}`, ...e.comment]
  }), s.post && new z({
    name: "\u0421 \u043F\u043E\u0441\u0442\u0430",
    color: "#B016C9",
    data: s.post,
    maxDaysGap: 3,
    hitInfo: (e) => [`\u0421\u0440\u043E\u043A: ${e.startSegment.date}`, `\u0422\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u0430: ${e.value}`, ...e.comment]
  }), s.sumTempAll && new Bt({
    name: "C\u0422: \u041E\u0441\u0435\u043D\u044C / \u0412\u0435\u0441\u043D\u0430",
    color: "#561087",
    data: s.sumTempAll
  }), s.sumTempAutumn && new Lt({
    name: "C\u0422: \u041E\u0441\u0435\u043D\u044C",
    color: "#188A1A",
    data: s.sumTempAutumn
  }), s.sumTempSpring && new At({
    name: "C\u0422: \u0412\u0435\u0441\u043D\u0430",
    color: "#B0433F",
    data: s.sumTempSpring
  });
}
class Mt extends P {
  constructor(e) {
    super(e);
  }
}
class Y extends L {
  constructor(e) {
    super(e);
  }
  render(e) {
    const { complexGraph: t } = this.visualizer, { renderer: i } = t, o = i.minSize * 2e-3, c = [o, o, 0, 0];
    this.elements.forEach((n) => {
      !this.visualizer.complexGraph.calculator.isPointVisible(n) || (i.context.beginPath(), i.context.fillStyle = this.color, i.context.roundRect(n.x, n.y, n.width, n.height, c), i.context.fill());
    });
  }
  resize(e) {
    const { complexGraph: t, row: i, paddingBottom: o, min: c } = this.visualizer;
    this.elements.forEach((n) => {
      n.width = n.endSegment.x1 - n.startSegment.x1, n.height = e * (n.value - c), n.x = t.calculator.area.x1 + n.startSegment.x1, n.y = i.y2 - n.height - o;
    });
  }
  hitTest(e) {
    return this.elements.find((i) => A(e, {
      x: i.x,
      y: i.y,
      width: i.width,
      height: i.height
    }));
  }
  hitInfo(e) {
    return [`\u0421\u0440\u043E\u043A: ${e.startSegment.date}`, `\u0423\u0440\u043E\u0432\u0435\u043D\u044C: ${e.value}`, ...e.comment];
  }
  createElement(e) {
    return new P(e);
  }
  getElementNumberValue(e) {
    return e.value;
  }
}
class _t extends L {
  constructor(t) {
    super(t);
    r(this, "liquidColor");
    r(this, "solidColor");
    this.liquidColor = t.liquidColor || "black", this.solidColor = t.solidColor || "black";
  }
  render() {
    const { complexGraph: t } = this.visualizer, { renderer: i } = t, o = i.minSize * 2e-3, c = [o, o, 0, 0];
    this.elements.forEach((n) => {
      if (!this.visualizer.complexGraph.calculator.isPointVisible(n))
        return;
      const h = n.height / (n.value.solid + n.value.liquid), a = h * n.value.liquid, u = h * n.value.solid;
      i.context.beginPath(), i.context.fillStyle = this.liquidColor, i.context.roundRect(
        n.x,
        n.y + u,
        n.width,
        a,
        c
      ), i.context.fill(), i.context.beginPath(), i.context.fillStyle = this.solidColor, i.context.roundRect(n.x, n.y, n.width, u, c), i.context.fill();
    });
  }
  resize(t) {
    const { complexGraph: i, row: o, min: c } = this.visualizer;
    this.elements.forEach((n) => {
      n.width = n.endSegment.x1 - n.startSegment.x1;
      const h = n.value.liquid + n.value.solid;
      n.height = t * (h - c), n.x = i.calculator.area.x1 + n.startSegment.x1, n.y = o.y2 - n.height;
    });
  }
  hitTest(t) {
    return this.elements.find((o) => A(t, {
      x: o.x,
      y: o.y,
      width: o.width,
      height: o.height
    }));
  }
  hitInfo(t) {
    return [
      `\u0421\u0440\u043E\u043A: ${t.startSegment.date}`,
      "\u0423\u0440\u043E\u0432\u043D\u0438",
      `\u0422\u0432\u0435\u0440\u0434\u044B\u0439: ${t.value.solid}`,
      `\u0416\u0438\u0434\u043A\u0438\u0439: ${t.value.liquid}`
    ];
  }
  createElement(t) {
    return new Mt(t);
  }
  getElementNumberValue(t) {
    return t.value.liquid + t.value.solid;
  }
}
function $t(s) {
  new S({
    name: "\u041E\u0441\u0430\u0434\u043A\u0438",
    row: 1,
    rowFactor: 0.4,
    scale: {
      title: "\u041E\u0441\u0430\u0434\u043A\u0438, \u043C\u043C",
      color: "darkgreen",
      gridColor: "darkgreen",
      gridActive: !0
    }
  }), s.solid && new Y({
    name: "\u0422\u0432\u0435\u0440\u0434\u044B\u0435",
    color: "#00b1ff",
    data: s.solid
  }), s.liquid && new Y({
    name: "\u0416\u0438\u0434\u043A\u0438\u0435",
    color: "#136945",
    data: s.liquid
  }), s.mixed && new _t({
    name: "\u0421\u043C\u0435\u0448\u0430\u043D\u043D\u044B\u0435",
    liquidColor: "#136945",
    solidColor: "#00b1ff",
    data: s.mixed
  });
}
class Vt extends Q {
  constructor(t) {
    super(t);
    r(this, "snowFillColor");
    r(this, "snowStrokeColor");
    r(this, "iceFillColor");
    r(this, "iceStrokeColor");
    r(this, "sortedElements");
    r(this, "scaleZeroSegment");
    this.snowFillColor = t.snowFillColor || "black", this.snowStrokeColor = t.snowStrokeColor || "black", this.iceFillColor = t.iceFillColor || "black", this.iceStrokeColor = t.iceStrokeColor || "black", this.sortedElements = [[]];
    let i = 0;
    this.elements.forEach((o) => {
      o.new && (i++, this.sortedElements[i] = []), this.sortedElements[i].push(o);
    }), this.scaleZeroSegment = void 0;
  }
  resize(t) {
    const { complexGraph: i, row: o, min: c } = this.visualizer;
    this.scaleZeroSegment || (this.scaleZeroSegment = this.visualizer.scale.segments.find((n) => n.value === 0)), this.elements.forEach((n) => {
      n.width = n.endSegment.x1 - n.startSegment.x1, n.height = t * (n.value.snow - c), n.x = i.calculator.area.x1 + n.startSegment.x1, n.y = o.y2 - n.height;
    });
  }
  render(t) {
    const { row: i, min: o } = this.visualizer;
    this.fill(this.snowFillColor), this.stroke(this.snowStrokeColor), this.elements.forEach((c) => {
      c.height = t * (Math.abs(c.value.ice) * -1 - o), c.y = i.y2 - c.height;
    }), this.fill(this.iceFillColor), this.stroke(this.iceStrokeColor);
  }
  hitTest(t) {
    const { complexGraph: i, row: o } = this.visualizer, { renderer: c } = i, n = c.minSize * 0.03;
    return this.elements.find((a) => A(t, {
      x: a.x - n / 2,
      y: o.y1,
      width: n,
      height: o.height
    }));
  }
  hitInfo(t) {
    return [
      `\u0421\u0440\u043E\u043A: ${t.startSegment.date}`,
      "\u0423\u0440\u043E\u0432\u043D\u0438",
      `\u0421\u043D\u0435\u0433: ${t.value.snow}`,
      `\u041B\u0435\u0434: ${t.value.ice}`,
      ...t.comment
    ];
  }
  getElementNumberValue(t) {
    return [Math.abs(t.value.ice) * -1, t.value.snow];
  }
  stroke(t) {
    this.drawLinear(t);
  }
  fill(t) {
    const { renderer: i, calculator: o } = this.visualizer.complexGraph;
    this.scaleZeroSegment && this.sortedElements.forEach((c) => {
      const n = c[0], h = c[c.length - 1];
      !o.isPointVisible(n, (n.x - h.x) * -1) || (i.context.fillStyle = t, i.context.beginPath(), i.context.moveTo(n.x, this.scaleZeroSegment.y), c.forEach((a) => {
        i.context.lineTo(a.x, a.y);
      }), i.context.lineTo(h.x, this.scaleZeroSegment.y), i.context.fillStyle = t, i.context.fill());
    });
  }
}
function It(s) {
  new S({
    name: "\u0421\u043D\u0435\u0433, \u041B\u0435\u0434",
    row: 2,
    rowFactor: 0.5,
    scale: {
      title: "\u0421\u043D\u0435\u0433, \u043B\u0435\u0434 \u0441\u043C",
      color: "#A7C7E0",
      gridColor: "#A7C7E0",
      position: "right",
      abs: !0
    }
  }), s.default && new Vt({
    data: s.default,
    snowFillColor: "#a6d9ff",
    iceFillColor: "#00b1ff",
    snowStrokeColor: "#80c8ff",
    iceStrokeColor: "#1588ff",
    maxDaysGap: 3
  });
}
class X extends Z {
  constructor(t) {
    super(t);
    r(this, "value");
    r(this, "position");
    this.value = t.value, this.position = 0;
  }
  render() {
    const { row: t, complexGraph: i } = this.visualizer, { renderer: o } = i;
    o.context.lineWidth = o.minSize * 2e-3 / o.pixelRatio, o.context.beginPath(), o.context.strokeStyle = this.color, o.context.moveTo(t.x1, t.y2 - this.position), o.context.lineTo(t.x2, t.y2 - this.position), o.context.stroke();
  }
  resize(t) {
    this.position = t * (this.value - this.visualizer.min);
  }
}
function Rt(s) {
  new S({
    name: "\u0423\u0440\u043E\u0432\u0435\u043D\u044C \u0432\u043E\u0434\u044B",
    row: 4,
    scale: {
      title: "\u0423\u0440. \u0432\u043E\u0434\u044B, \u0441\u043C",
      step: 25,
      color: "black",
      gridColor: "black",
      gridActive: !0
    }
  }), s.default && new z({
    data: s.default,
    color: "#0066FF",
    maxDaysGap: 3,
    hitInfo: (e) => [`\u0421\u0440\u043E\u043A: ${e.startSegment.date}`, `\u0423\u0440\u043E\u0432\u0435\u043D\u044C: ${e.value}`, ...e.comment]
  }), s.adverse && new X({
    name: "\u0423\u041D\u042F",
    value: s.adverse,
    color: "orange"
  }), s.dangerous && new X({
    name: "\u0423\u041E\u042F",
    value: s.dangerous,
    color: "red"
  });
}
function Zt(s) {
  new S({
    name: "\u0422\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u0430 \u0432\u043E\u0434\u044B",
    row: 2,
    rowFactor: 0.5,
    scale: {
      title: "t \u0432\u043E\u0434\u044B \xB0C",
      color: "#B13007",
      gridColor: "#B13007",
      gridActive: !0
    }
  }), s.default && new z({
    data: s.default,
    color: "#EF543F",
    maxDaysGap: 3,
    hitInfo: (e) => [`\u0421\u0440\u043E\u043A: ${e.startSegment.date}`, `\u0422\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u0430: ${e.value}`, ...e.comment]
  });
}
class Nt extends z {
  constructor(e) {
    super(e);
  }
  render() {
    const { renderer: e, calculator: t } = this.visualizer.complexGraph;
    e.context.fillStyle = this.color, this.elements.forEach((i) => {
      !t.isPointVisible(i) || (e.context.beginPath(), e.context.arc(i.x, i.y, e.minSize * 5e-3, 0, Math.PI * 2), e.context.fill());
    });
  }
}
function Ht(s) {
  new S({
    name: "\u0420\u0430\u0441\u0445\u043E\u0434\u044B \u0432\u043E\u0434\u044B",
    row: 4,
    scale: {
      title: "\u0420\u0430\u0441\u0445\u043E\u0434 \u043C / c",
      position: "right",
      step: 25,
      color: "black",
      gridColor: "black"
    }
  }), s.calculated && new z({
    data: s.calculated,
    name: "\u0420\u0430\u0441\u0441\u0447\u0438\u0442\u0430\u043D\u043D\u044B\u0435",
    color: "brown",
    maxDaysGap: 3,
    hitInfo: (e) => [`\u0421\u0440\u043E\u043A: ${e.startSegment.date}`, `\u0420\u0430\u0441\u0445\u043E\u0434: ${e.value}`, ...e.comment]
  }), s.qh && new z({
    data: s.qh,
    name: "\u0421 \u043A\u0440\u0438\u0432\u043E\u0439 QH",
    color: "#397634",
    maxDaysGap: 3,
    hitInfo: (e) => [`\u0421\u0440\u043E\u043A: ${e.startSegment.date}`, `\u0420\u0430\u0441\u0445\u043E\u0434: ${e.value}`, ...e.comment]
  }), s.operational && new z({
    data: s.operational,
    name: "\u041E\u043F\u0435\u0440\u0430\u0442\u0438\u0432\u043D\u044B\u0435",
    color: "#FFB74E",
    maxDaysGap: 3,
    hitInfo: (e) => [`\u0421\u0440\u043E\u043A: ${e.startSegment.date}`, `\u0420\u0430\u0441\u0445\u043E\u0434: ${e.value}`, ...e.comment]
  }), s.measured && new Nt({
    data: s.measured,
    name: "\u0418\u0437\u043C\u0435\u0440\u0435\u043D\u043D\u044B\u0435",
    color: "#397634",
    maxDaysGap: 3,
    hitInfo: (e) => [`\u0421\u0440\u043E\u043A: ${e.startSegment.date}`, `\u0420\u0430\u0441\u0445\u043E\u0434: ${e.value}`, ...e.comment]
  });
}
class v extends Z {
  constructor(t) {
    super(t);
    r(this, "elements");
    r(this, "startLine");
    r(this, "endLine");
    r(this, "auxLines");
    r(this, "lineSize");
    this.elements = t.elements, this.startLine = t.startLine, this.endLine = t.endLine, this.auxLines = t.auxLines, this.lineSize = 1;
  }
  resize() {
    const { complexGraph: t } = this.visualizer, { renderer: i } = t;
    this.lineSize = i.minSize * 2e-3 / i.pixelRatio, i.context.lineWidth = this.lineSize, this.elements.forEach((o) => {
      o.x = t.calculator.area.x1 + o.startSegment.x1, o.width = o.endSegment.x1 - o.startSegment.x1 + 1, o.height = this.startLine.y - this.endLine.y, o.y = this.startLine.y - o.height;
    });
  }
  hitTest(t) {
    const { row: i } = this.visualizer;
    return this.elements.find((c) => A(t, {
      x: c.x,
      y: i.y1,
      width: c.width,
      height: i.height
    }));
  }
  hitInfo(t) {
    return [`\u0421\u0440\u043E\u043A: ${t.startSegment.date}`, ...t.comment];
  }
}
class Wt extends v {
  constructor(e) {
    super(e);
  }
  render() {
    const { renderer: e, scene: t } = this.visualizer.complexGraph;
    e.context.strokeStyle = this.color, this.elements.forEach((i) => {
      if (!this.visualizer.complexGraph.calculator.isPointVisible(i))
        return;
      const o = i.endSegment.daysBefore - i.startSegment.daysBefore, c = Math.ceil(t.zoom / 8) * o, n = i.width / c;
      for (let h = 0; h < c; h++) {
        const a = i.x;
        e.context.beginPath(), e.context.moveTo(a + n * h, i.y), e.context.lineTo(a + n * (h + 0.85), i.y + i.height), e.context.moveTo(a + n * (h + 0.85), i.y), e.context.lineTo(a + n * h, i.y + i.height), e.context.stroke();
      }
    });
  }
}
class qt extends v {
  constructor(e) {
    super(e);
  }
  render() {
    const { complexGraph: e } = this.visualizer, { renderer: t } = e;
    t.context.fillStyle = this.color;
    let i = 0;
    this.elements.forEach((o) => {
      var c;
      !this.visualizer.complexGraph.calculator.isPointVisible(o) || ((c = this.auxLines) != null && c[0] && (i = this.startLine.y - this.auxLines[0].y), t.context.fillRect(o.x, o.y, o.width, o.height - i));
    });
  }
}
class $ extends v {
  constructor(t) {
    super(t);
    r(this, "backgroundColor");
    this.backgroundColor = t.backgroundColor || "#738d73";
  }
  render() {
    var n;
    const { complexGraph: t } = this.visualizer, { renderer: i, scene: o } = t;
    i.context.fillStyle = this.backgroundColor, i.context.strokeStyle = this.color;
    let c = 0;
    (n = this.auxLines) != null && n[0] && (c = this.startLine.y - this.auxLines[0].y), this.elements.forEach((h) => {
      if (!this.visualizer.complexGraph.calculator.isPointVisible(h))
        return;
      i.context.fillRect(h.x, this.startLine.y - c, h.width, c);
      const a = Math.ceil(o.zoom / 3), u = h.width / a;
      for (let d = 0; d < a; d++) {
        const l = h.x + u * d + 1;
        i.context.beginPath(), i.context.moveTo(l, h.y), i.context.lineTo(l, h.y + h.height), i.context.stroke();
      }
    });
  }
}
class Ot extends v {
  constructor(e) {
    super(e);
  }
  render() {
    const { complexGraph: e } = this.visualizer, { renderer: t } = e;
    t.context.fillStyle = this.color, this.elements.forEach((i) => {
      !this.visualizer.complexGraph.calculator.isPointVisible(i) || t.context.fillRect(i.x, i.y, i.width, i.height);
    });
  }
}
class Yt extends v {
  constructor(e) {
    super(e);
  }
  render() {
    const { complexGraph: e } = this.visualizer, { renderer: t } = e;
    t.context.fillStyle = this.color;
    let i = 0, o = 0, c = 0;
    this.elements.forEach((n) => {
      var h, a, u;
      !this.visualizer.complexGraph.calculator.isPointVisible(n) || ((h = this.auxLines) != null && h[0] && (i = this.startLine.y - this.auxLines[0].y), (a = this.auxLines) != null && a[1] && (o = this.startLine.y - this.auxLines[1].y), (u = this.auxLines) != null && u[2] && (c = this.startLine.y - this.auxLines[2].y), t.context.fillRect(n.x, n.y, n.width, n.height - c), t.context.fillRect(n.x, n.y + o, n.width, o - i));
    });
  }
}
class U extends v {
  constructor(e) {
    super(e);
  }
  drawTriangle(e, t, i, o = "black", c = !1) {
    const { renderer: n } = this.visualizer.complexGraph;
    n.context.fillStyle = o, n.context.beginPath(), c ? (n.context.moveTo(e, t + i), n.context.lineTo(e - i, t), n.context.lineTo(e + i, t), n.context.lineTo(e, t + i)) : (n.context.moveTo(e, t), n.context.lineTo(e - i, t + i), n.context.lineTo(e + i, t + i), n.context.lineTo(e, t)), n.context.fill();
  }
}
class tt extends U {
  constructor(t) {
    super(t);
    r(this, "mergedElements");
    this.mergedElements = [];
    const i = [];
    let o = 0;
    for (let c = 0; c < this.elements.length; c++) {
      const n = this.elements[c];
      if (i[o] || (i[o] = [n]), !this.elements[c - 1])
        continue;
      const h = this.elements[c - 1];
      n.startSegment.index - h.startSegment.index <= 24 ? i[o].push(n) : (o++, i[o] = [n]);
    }
    i.forEach((c, n) => {
      const h = c[0];
      h.endSegment = c[c.length - 1].startSegment.nextDaySegment, this.mergedElements[n] = h;
    });
  }
  resize() {
    super.resize();
  }
  render() {
    const { complexGraph: t } = this.visualizer, { renderer: i, calculator: o } = t;
    this.mergedElements.forEach((c) => {
      if (!this.visualizer.complexGraph.calculator.isPointVisible(c))
        return;
      const n = G(o.area.width * 11e-4, 1, c.height) / 2, h = c.height - n, a = c.y + h, u = n * 3;
      i.context.strokeStyle = this.color, i.context.save(), i.context.beginPath(), i.context.setLineDash([10]), i.context.moveTo(c.x + u, a), i.context.lineTo(c.x + c.width - u, a), i.context.stroke(), i.context.restore(), this.drawEdge(c.x + n, a, n), this.drawEdge(c.x + c.width - n, a, n);
    });
  }
}
class Xt extends tt {
  constructor(e) {
    super(e);
  }
  drawEdge(e, t, i) {
    const { complexGraph: o } = this.visualizer, { renderer: c } = o;
    c.context.strokeStyle = this.color, c.context.beginPath(), c.context.moveTo(e - i, t - i), c.context.lineTo(e, t), c.context.lineTo(e + i, t - i), c.context.stroke(), this.drawTriangle(e, t, i, this.color);
  }
}
class Jt extends tt {
  constructor(e) {
    super(e);
  }
  drawEdge(e, t, i) {
    const { complexGraph: o } = this.visualizer, { renderer: c } = o;
    c.context.strokeStyle = this.color, c.context.beginPath(), c.context.moveTo(e - i, t + i), c.context.lineTo(e, t), c.context.lineTo(e + i, t + i), c.context.stroke(), this.drawTriangle(e, t - i, i, this.color, !0);
  }
}
class V extends v {
  constructor(e) {
    super(e);
  }
  render() {
    const { complexGraph: e } = this.visualizer, { renderer: t } = e;
    t.context.fillStyle = this.color, this.elements.forEach((i) => {
      !this.visualizer.complexGraph.calculator.isPointVisible(i) || t.context.fillRect(i.x, i.y, i.width, i.height);
    });
  }
}
class et extends U {
  constructor(t) {
    super(t);
    r(this, "rotate");
    this.rotate = t.rotate || !1;
  }
  render() {
    const { complexGraph: t } = this.visualizer, { calculator: i } = t;
    this.elements.forEach((o) => {
      if (!this.visualizer.complexGraph.calculator.isPointVisible(o))
        return;
      const c = o.x + o.width / 2, n = G(i.area.width * 11e-4, 1, o.height), h = o.height - n;
      this.drawTriangle(c, o.y + h, n, this.color, this.rotate);
    });
  }
}
class jt extends et {
  constructor(e) {
    super(e);
  }
}
class Kt extends et {
  constructor(e) {
    super({ ...e, rotate: !0 });
  }
}
class Qt extends v {
  constructor(e) {
    super(e);
  }
  render() {
    const { complexGraph: e, row: t } = this.visualizer, { renderer: i, calculator: o } = e;
    i.context.fillStyle = this.color;
    const c = Math.min(this.lineSize * 4, o.area.width * 1e-3);
    this.elements.forEach((n) => {
      !this.visualizer.complexGraph.calculator.isPointVisible(n) || (i.context.beginPath(), i.context.fillRect(n.x, n.y, c, n.height));
    });
  }
}
class Ut extends v {
  constructor(e) {
    super(e);
  }
  render() {
  }
}
class te extends v {
  constructor(e) {
    super(e);
  }
  render() {
    const { complexGraph: e } = this.visualizer, { renderer: t } = e;
    t.context.strokeStyle = this.color, this.elements.forEach((i) => {
      if (!this.visualizer.complexGraph.calculator.isPointVisible(i))
        return;
      const o = i.y + this.lineSize / 2;
      t.context.beginPath(), t.context.moveTo(i.x, o), t.context.lineTo(i.x + i.width, o), t.context.stroke();
      const c = i.y + i.height - this.lineSize / 2;
      t.context.beginPath(), t.context.moveTo(i.x, c), t.context.lineTo(i.x + i.width, c), t.context.stroke();
    });
  }
}
class ee extends v {
  constructor(e) {
    super(e);
  }
  render() {
    const { complexGraph: e } = this.visualizer, { renderer: t } = e;
    t.context.strokeStyle = this.color, this.elements.forEach((i) => {
      !this.visualizer.complexGraph.calculator.isPointVisible(i) || (t.context.beginPath(), t.context.moveTo(i.x, i.y + i.height / 2), t.context.lineTo(i.x + i.width, i.y + i.height / 2), t.context.stroke());
    });
  }
}
class ie extends v {
  constructor(e) {
    super(e);
  }
  render() {
    const { complexGraph: e } = this.visualizer, { renderer: t } = e;
    t.context.strokeStyle = this.color, this.elements.forEach((i) => {
      !this.visualizer.complexGraph.calculator.isPointVisible(i) || (t.context.beginPath(), t.context.moveTo(i.x, i.y + i.height / 2), t.context.lineTo(i.x + i.width, i.y + i.height / 2), t.context.stroke());
    });
  }
}
class oe extends v {
  constructor(e) {
    super(e);
  }
  render() {
    const { complexGraph: e } = this.visualizer, { renderer: t, calculator: i } = e;
    t.context.strokeStyle = this.color, this.elements.forEach((o) => {
      if (!this.visualizer.complexGraph.calculator.isPointVisible(o))
        return;
      const c = G(i.area.width * 11e-4, 1, o.height);
      t.context.strokeRect(o.x, o.y + o.height - c, o.width, c);
    });
  }
}
const F = {
  error: {
    startLine: 2,
    endLine: 6,
    constructor: Wt,
    name: "\u041E\u0448\u0438\u0431\u043A\u0438"
  },
  flangeIce: {
    startLine: 2,
    endLine: 6,
    auxLines: [3],
    constructor: qt,
    name: "\u0417\u0430\u043A\u0440\u0430\u0438\u043D\u044B"
  },
  frazilDrift1: {
    startLine: 2,
    endLine: 3,
    auxLines: [6],
    constructor: $,
    name: "\u0420\u0435\u0434\u043A\u0438\u0439 \u0448\u0443\u0433\u043E\u0445\u043E\u0434"
  },
  frazilDrift2: {
    startLine: 2,
    endLine: 4,
    auxLines: [6],
    constructor: $,
    name: "\u0421\u0440\u0435\u0434\u043D\u0438\u0439 \u0448\u0443\u0433\u043E\u0445\u043E\u0434"
  },
  frazilDrift3: {
    startLine: 2,
    endLine: 5,
    auxLines: [6],
    constructor: $,
    name: "\u0413\u0443\u0441\u0442\u043E\u0439 \u0448\u0443\u0433\u043E\u0445\u043E\u0434"
  },
  freezing: {
    startLine: 2,
    endLine: 6,
    constructor: Ot,
    name: "\u041B\u0435\u0434\u043E\u0441\u0442\u0430\u0432"
  },
  iceClearing: {
    startLine: 2,
    endLine: 6,
    auxLines: [3, 4, 5],
    constructor: Yt,
    name: "\u0420\u0430\u0437\u0432\u043E\u0434\u044C\u044F"
  },
  iceDamAbove: {
    startLine: 6,
    endLine: 7,
    constructor: Xt,
    name: "\u0417\u0430\u0436\u043E\u0440 \u0432\u044B\u0448\u0435 \u043F\u043E\u0441\u0442\u0430"
  },
  iceDamBelow: {
    startLine: 6,
    endLine: 7,
    constructor: Jt,
    name: "\u0417\u0430\u0436\u043E\u0440 \u043D\u0438\u0436\u0435 \u043F\u043E\u0441\u0442\u0430"
  },
  iceDrift1: {
    startLine: 2,
    endLine: 3,
    constructor: V,
    name: "\u0420\u0435\u0434\u043A\u0438\u0439 \u043B\u0435\u0434\u043E\u0445\u043E\u0434"
  },
  iceDrift2: {
    startLine: 2,
    endLine: 4,
    constructor: V,
    name: "\u0421\u0440\u0435\u0434\u043D\u0438\u0439 \u043B\u0435\u0434\u043E\u0445\u043E\u0434"
  },
  iceDrift3: {
    startLine: 2,
    endLine: 5,
    constructor: V,
    name: "\u0413\u0443\u0441\u0442\u043E\u0439 \u043B\u0435\u0434\u043E\u0445\u043E\u0434"
  },
  iceJamAbove: {
    startLine: 6,
    endLine: 7,
    constructor: jt,
    name: "\u0417\u0430\u0442\u043E\u0440 \u043B\u044C\u0434\u0430 \u0432\u044B\u0448\u0435 \u043F\u043E\u0441\u0442\u0430"
  },
  iceJamBelow: {
    startLine: 6,
    endLine: 7,
    constructor: Kt,
    name: "\u0417\u0430\u0442\u043E\u0440 \u043B\u044C\u0434\u0430 \u043D\u0438\u0436\u0435 \u043F\u043E\u0441\u0442\u0430"
  },
  iceShove: {
    startLine: 1,
    endLine: 8,
    constructor: Qt,
    name: "\u041F\u043E\u0434\u0432\u0438\u0436\u043A\u0430 \u043B\u044C\u0434\u0430"
  },
  none: {
    startLine: 1,
    endLine: 6,
    constructor: Ut,
    name: ""
  },
  shoreIce: {
    startLine: 2,
    endLine: 6,
    constructor: te,
    name: "\u0417\u0430\u0431\u0435\u0440\u0435\u0433"
  },
  shoreIceSludge: {
    startLine: 2,
    endLine: 6,
    constructor: ee,
    name: "\u0421\u0430\u043B\u043E \u043F\u0440\u0438 \u0437\u0430\u0431\u0435\u0440\u0435\u0433\u0435"
  },
  sludge: {
    startLine: 2,
    endLine: 6,
    constructor: ie,
    name: "\u0421\u0430\u043B\u043E"
  },
  waterOnIce: {
    startLine: 6,
    endLine: 7,
    constructor: oe,
    name: "\u0412\u043E\u0434\u0430 \u0442\u0435\u0447\u0435\u0442 \u043F\u043E\u0432\u0435\u0440\u0445 \u043B\u044C\u0434\u0430"
  }
};
var it = /* @__PURE__ */ ((s) => (s[s.none = 0] = "none", s[s.sludge = 1] = "sludge", s[s.shoreIceSludge = 2] = "shoreIceSludge", s[s.shoreIce = 3] = "shoreIce", s[s.iceDrift1 = 4] = "iceDrift1", s[s.iceDrift2 = 5] = "iceDrift2", s[s.iceDrift3 = 6] = "iceDrift3", s[s.iceClearing = 7] = "iceClearing", s[s.freezing = 8] = "freezing", s[s.frazilDrift1 = 9] = "frazilDrift1", s[s.frazilDrift2 = 10] = "frazilDrift2", s[s.frazilDrift3 = 11] = "frazilDrift3", s[s.flangeIce = 12] = "flangeIce", s[s.error = 13] = "error", s))(it || {}), ot = /* @__PURE__ */ ((s) => (s[s.waterOnIce = 1] = "waterOnIce", s[s.iceJamBelow = 2] = "iceJamBelow", s[s.iceJamAbove = 3] = "iceJamAbove", s[s.iceDamBelow = 4] = "iceDamBelow", s[s.iceDamAbove = 5] = "iceDamAbove", s))(ot || {});
class se extends S {
  constructor(t) {
    super(t);
    r(this, "lines");
    r(this, "segmentator");
    this.segmentator = new J({ scale: 1 }), this.segmentator.cut(1, 0), this.segmentator.cut(2, 1), this.segmentator.cut(3, 1), this.segmentator.cut(4, 1), this.segmentator.cut(5, 1), this.segmentator.cut(6, 1), this.segmentator.cut(7, 1), this.segmentator.cut(8, 0), this.lines = [];
    for (let o = 0; o < this.segmentator.segments.size; o++)
      this.lines[o] = { y: 0 };
    const i = /* @__PURE__ */ new Map();
    t.data.sort((o, c) => new Date(o.obsTime).getTime() - new Date(c.obsTime).getTime()), t.data.forEach((o, c) => {
      const n = this.complexGraph.timeline.segments.find((l) => l.date === o.obsTime);
      if (!n)
        throw new Error(`[IceRuler] \u0421\u0435\u0433\u043C\u0435\u043D\u0442 \u0441 \u0434\u0430\u0442\u043E\u0439 ${o.obsTime} \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D.`);
      const h = t.data[c + 1], a = h && this.complexGraph.timeline.segments.find((l) => l.date === h.obsTime) || n.nextDaySegment, u = it[o.fill];
      if (i.has(u) || i.set(u, []), o.iceShove) {
        i.has("iceShove") || i.set("iceShove", []);
        const l = new P({
          startSegment: n,
          endSegment: a,
          comment: o.text,
          value: void 0
        });
        i.get("iceShove").push(l);
      }
      if (o.upperSign) {
        const l = ot[o.upperSign];
        i.has(l) || i.set(l, []);
        const m = new P({
          startSegment: n,
          endSegment: a,
          comment: o.text,
          value: void 0
        });
        i.get(l).push(m);
      }
      const d = new P({
        startSegment: n,
        endSegment: a,
        comment: o.text,
        value: void 0
      });
      i.get(u).push(d);
    }), i.forEach((o, c) => {
      var n;
      new F[c].constructor({
        name: F[c].name,
        elements: o,
        startLine: this.lines[F[c].startLine - 1],
        endLine: this.lines[F[c].endLine - 1],
        auxLines: (n = F[c].auxLines) == null ? void 0 : n.map((h) => this.lines[h - 1]),
        color: c === "error" ? "red" : "#333333"
      });
    });
  }
  onRender() {
    for (let i = 0; i < this.lines.length; i++) {
      const o = this.segmentator.get(i + 1);
      this.lines[i].y = this.row.y2 - this.row.height * (o.a + o.s / 2), this.lines[i].y = Math.floor(this.lines[i].y) + 0.5;
    }
    const { renderer: t } = this.complexGraph;
    t.context.lineWidth = 1 / t.pixelRatio, t.context.strokeStyle = "#cccccc", t.context.beginPath(), t.context.moveTo(this.row.x1, this.lines[1].y), t.context.lineTo(this.row.x2, this.lines[1].y), t.context.stroke(), t.context.beginPath(), t.context.moveTo(this.row.x1, this.lines[5].y), t.context.lineTo(this.row.x2, this.lines[5].y), t.context.stroke(), super.onRender();
  }
}
function ne(s) {
  new se({
    name: "\u041B\u0435\u0434\u043E\u0432\u0430\u044F \u043B\u0438\u043D\u0435\u0439\u043A\u0430",
    row: 3,
    rowFactor: 0.3,
    data: s
  });
}
class re extends T {
  constructor() {
    super();
    r(this, "element");
    r(this, "visualizers");
    r(this, "mouse");
    r(this, "mouseZoomed");
    r(this, "handlePointerLeave", () => {
      this.hideElement();
    });
    r(this, "handlePointerMove", (t) => {
      const { container: i, calculator: o } = this.complexGraph, c = K(t, i);
      this.mouse.x = c.x, this.mouse.y = c.y, this.mouseZoomed.x = c.x + o.clipArea.x1 - o.area.x1, this.mouseZoomed.y = c.y;
      let n = 0;
      this.visualizers.forEach((h) => {
        const { isActive: a, row: u, groups: d } = h;
        a && this.mouseZoomed.y > u.y1 && this.mouseZoomed.y < u.y2 && d.forEach((l) => {
          if ((l instanceof L || l instanceof v) && l.hitTest && l.hitInfo && l.isVisible) {
            const m = l.hitTest(this.mouseZoomed);
            m && (n++, this.showElement(l.hitInfo(m)));
          }
        });
      }), n || this.hideElement();
    });
    this.element = document.createElement("div"), this.element.style.cssText = `
      position: absolute;
      left: 0;
      top: 0;
      z-index: 3;
      opacity: 0;
      pointer-events: none;
      font-family: ${this.complexGraph.font || "sans-serif"};
      font-size: 1.5vmin;
      padding: 0.4vmin;
      background-color: white;
      border-radius: 0.2vmin;
      transition: opacity 0.3s;
      opacity: 0.8,
    `, this.complexGraph.container.appendChild(this.element), this.visualizers = [], setTimeout(() => {
      this.visualizers = Array.from(this.complexGraph.scene.objects).filter(
        (t) => t instanceof S
      );
    }, 20), this.mouse = { x: 0, y: 0 }, this.mouseZoomed = { x: 0, y: 0 }, this.complexGraph.renderer.canvasElement.addEventListener("pointermove", this.handlePointerMove), this.complexGraph.renderer.canvasElement.addEventListener("click", this.handlePointerMove), this.complexGraph.renderer.canvasElement.addEventListener(
      "pointerleave",
      this.handlePointerLeave
    );
  }
  onDestroy() {
    this.complexGraph.container.removeChild(this.element), this.complexGraph.renderer.canvasElement.removeEventListener(
      "pointermove",
      this.handlePointerMove
    ), this.complexGraph.renderer.canvasElement.removeEventListener("click", this.handlePointerMove), this.complexGraph.renderer.canvasElement.removeEventListener(
      "pointerleave",
      this.handlePointerLeave
    );
  }
  showElement(t) {
    t = Array.isArray(t) ? t : [t];
    let i = "";
    t.forEach((c, n) => {
      if (n === t.length - 1)
        i += c;
      else
        return i += c + "<br>";
    }), this.element.innerHTML = i, this.element.style.opacity = "0.8";
    const o = this.element.offsetHeight;
    this.element.style.transform = `translate(${this.mouse.x}px, ${this.mouse.y - o}px)`;
  }
  hideElement() {
    this.element.style.opacity = "0";
  }
}
class ce extends T {
  constructor() {
    super();
    r(this, "button");
    r(this, "handleClick", () => {
      this.complexGraph.renderer.clear(), this.complexGraph.renderer.resize(innerWidth, innerHeight), this.complexGraph.renderer.draw();
      const t = this.complexGraph.renderer.canvasElement.toDataURL(void 0, 1), i = window.open();
      if (i) {
        i.document.write(`
        <head>
          <title>\u041A\u043E\u043C\u043F\u043B\u0435\u043A\u0441\u043D\u044B\u0439 \u0433\u0440\u0430\u0444\u0438\u043A</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            html, body {
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
            button {
              position: fixed;
              top: 2vmin;
              right: 2vmin;
              z-index: 1;
              width: 10vmin;
              height: 10vmin;
              padding: 2vmin;
              background: none;
              border: none;
              border: 0.2vmin solid #4C6EF5;
              border-radius: 50%;
              cursor: pointer;
            }
            @media print {
              button {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <img src="${t}"/>
          <button>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45">
              <path d="M42.5,19.408H40V1.843c0-0.69-0.561-1.25-1.25-1.25H6.25C5.56,0.593,5,1.153,5,1.843v17.563H2.5
                c-1.381,0-2.5,1.119-2.5,2.5v20c0,1.381,1.119,2.5,2.5,2.5h40c1.381,0,2.5-1.119,2.5-2.5v-20C45,20.525,43.881,19.408,42.5,19.408z
                M32.531,38.094H12.468v-5h20.063V38.094z M37.5,19.408H35c-1.381,0-2.5,1.119-2.5,2.5v5h-20v-5c0-1.381-1.119-2.5-2.5-2.5H7.5
                V3.093h30V19.408z M32.5,8.792h-20c-0.69,0-1.25-0.56-1.25-1.25s0.56-1.25,1.25-1.25h20c0.689,0,1.25,0.56,1.25,1.25
                S33.189,8.792,32.5,8.792z M32.5,13.792h-20c-0.69,0-1.25-0.56-1.25-1.25s0.56-1.25,1.25-1.25h20c0.689,0,1.25,0.56,1.25,1.25
                S33.189,13.792,32.5,13.792z M32.5,18.792h-20c-0.69,0-1.25-0.56-1.25-1.25s0.56-1.25,1.25-1.25h20c0.689,0,1.25,0.56,1.25,1.25
                S33.189,18.792,32.5,18.792z" stroke="#4C6EF5" fill="#4C6EF5"/>
            </svg>
          </button>
        </body>
      `);
        const o = i.document.querySelector("button");
        o == null || o.addEventListener("click", () => {
          i.setTimeout(() => i.print(), 0);
        });
      }
      this.complexGraph.renderer.clear(), this.complexGraph.renderer.resize(
        this.complexGraph.renderer.containerElement.offsetWidth,
        this.complexGraph.renderer.containerElement.offsetHeight
      ), this.complexGraph.renderer.draw();
    });
    this.button = document.createElement("button"), this.button.style.cssText = `
      --size:calc(var(--cg-scalar) * 28);
      position: absolute;
      left: 100%;
      bottom: 100%;
      width: var(--size);
      height: var(--size);
      padding: calc(var(--size) * 0.1);
      border: none;
      border-top-left-radius: 0.5vmin;
      border-top-right-radius: 0.5vmin;
      transform: translateX(calc(var(--size) * -1));
      background: #4C6EF5;
    `, this.button.innerHTML = `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <g fill="white">
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M11.993 14.407l-1.552 1.552a4 4 0 1 1-1.418-1.41l1.555-1.556-4.185-4.185 1.415-1.415 4.185 4.185 4.189-4.189 1.414 1.414-4.19 4.19 1.562 1.56a4 4 0 1 1-1.414 1.414l-1.561-1.56zM7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm2-7V5H5v8H3V4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v9h-2z" />
        </g>
      </svg>
    `, this.button.addEventListener("click", this.handleClick), this.complexGraph.container.appendChild(this.button);
  }
  onDestroy() {
    this.complexGraph.container.removeChild(this.button), this.button.removeEventListener("click", this.handleClick);
  }
}
class st {
  constructor() {
    r(this, "element");
    this.element = document.createElement("div"), this.element.className = "cg-button", setTimeout(() => {
      this.element.addEventListener("click", this.toggle);
    }, 0);
  }
  destroy() {
    this.element.removeEventListener("click", this.toggle);
  }
  appendTo(e) {
    e.appendChild(this.element);
  }
  unactive() {
    this.element.classList.add("unactive");
  }
  active() {
    this.element.classList.remove("unactive");
  }
}
class R extends st {
  constructor(t) {
    super();
    r(this, "toggle", () => {
      this.drg.isVisible ? (this.drg.hide(), this.unactive()) : (this.drg.show(), this.active());
    });
    this.drg = t, this.element.innerText = t.name || "";
  }
}
class he extends st {
  constructor(t) {
    super();
    r(this, "toggle", () => {
      this.dr.scale.gridActive ? (this.dr.hideGrid(), this.unactive()) : (this.dr.showGrid(), this.active());
    });
    this.dr = t, this.element.innerText = "\u0421\u0435\u0442\u043A\u0430", this.dr.scale.gridActive || this.unactive();
  }
}
class ae {
  constructor() {
    r(this, "buttons");
    r(this, "container");
    this.buttons = [], this.container = document.createElement("div"), this.container.className = "cg-graphs-buttons";
  }
  destroy() {
    this.buttons.forEach((e) => e.destroy());
  }
  add(e) {
    this.buttons.push(e), e.appendTo(this.container);
  }
  appendTo(e) {
    e.appendChild(this.container);
  }
  active() {
    this.buttons.forEach((e) => {
      e instanceof R && e.active();
    });
  }
  unactive() {
    this.buttons.forEach((e) => {
      e instanceof R && e.unactive();
    });
  }
}
class ue {
  constructor(e) {
    r(this, "wrapper");
    r(this, "categoryButton");
    r(this, "buttons");
    r(this, "toggle", () => {
      this.dr.isActive ? (this.dr.hide(), this.unactive()) : (this.dr.show(), this.active());
    });
    this.dr = e, this.wrapper = document.createElement("div"), this.wrapper.className = "cg-button-wrapper", this.categoryButton = document.createElement("div"), this.categoryButton.innerText = e.name || "", this.categoryButton.className = "cg-button", this.wrapper.appendChild(this.categoryButton), this.buttons = new ae(), this.buttons.appendTo(this.wrapper), e.scale && this.buttons.add(new he(e)), e.groups.forEach((t) => {
      t.name && this.buttons.add(new R(t));
    }), e.isActive || this.unactive(), this.categoryButton.addEventListener("click", this.toggle);
  }
  destroy() {
    this.buttons.destroy(), this.categoryButton.removeEventListener("click", this.toggle);
  }
  appendTo(e) {
    e.appendChild(this.wrapper);
  }
  unactive() {
    this.wrapper.classList.add("unactive"), this.buttons.unactive();
  }
  active() {
    this.wrapper.classList.remove("unactive"), this.buttons.active();
  }
}
class le extends T {
  constructor() {
    super();
    r(this, "categories");
    r(this, "container");
    r(this, "styles");
    this.categories = [], this.container = document.createElement("div"), this.container.className = "cg-buttons", this.styles = document.createElement("style"), document.head.appendChild(this.styles), this.complexGraph.container.appendChild(this.container), this.styles.innerText = `

      .cg-buttons {
        --size: calc(var(--cg-scalar) * 30);
        position: absolute;
        top: calc(var(--size) * -1);
        left: 0;
        z-index: 2;
        display: flex;
        font-family: ${this.complexGraph.font};
        user-select: none;
        pointer-events: none;
      }

      .cg-button-wrapper {
        position: relative;
        pointer-events: none;
      }

      .cg-button {
        font-size: calc(var(--cg-scalar) * 10);
        font-weight: bold;
        padding: 0 calc(var(--cg-scalar) * 10);
        height: var(--size);
        background-color: #4C6EF5;
        color: white;

        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: auto;
      }

      .cg-button-wrapper:not(:first-child) > .cg-button {
        border-left: 0.1vmin solid white;
      }

      .cg-buttons .cg-button-wrapper:first-child > .cg-button  {
        border-top-left-radius: 0.5vmin;
      }

      .cg-buttons .cg-button-wrapper:last-child > .cg-button  {
        border-top-right-radius: 0.5vmin;
      }

      .cg-button-wrapper.unactive .cg-button,
      .cg-button.unactive {
        background-color:  #f4f4f4;
        color: #bfbfbf;
      }

      .cg-button:hover {
        background-color: #8099ff;
      }

      .cg-button-wrapper.unactive:hover .cg-button,
      .cg-button.unactive:hover {
        background-color: #e7e7e7;
      }

      .cg-graphs-buttons {
        position: relative;
        width: 100%;
      }

      .cg-graphs-buttons .cg-button {
        opacity: 0;
        pointer-events: none
      }

      .cg-button-wrapper:not(:first-child) .cg-graphs-buttons {
        left: 0.1vmin;
        width: calc(100% - 0.1vmin);
      }

      .cg-button-wrapper:not(.unactive):hover .cg-graphs-buttons .cg-button {
        opacity: 1;
        pointer-events: auto;
      }

      .cg-graphs-buttons .cg-button {
        font-size: calc(var(--cg-scalar) * 12);
        text-align:left;
        justify-content: flex-start;
      }
    `, setTimeout(() => {
      this.complexGraph.scene.objects.forEach((t) => {
        if (t instanceof S) {
          const i = new ue(t);
          this.categories.push(i), i.appendTo(this.container);
        }
      });
    }, 20);
  }
  onDestroy() {
    this.categories.forEach((t) => t.destroy()), document.head.removeChild(this.styles);
  }
}
function xe(s) {
  function e(o) {
    const c = new yt(o);
    return new bt(), new wt(), new zt(), o.data.phases && Gt(o.data.phases), new Dt(), new Ct(), o.data.airTemperature && Ft(o.data.airTemperature), o.data.precipitation && $t(o.data.precipitation), o.data.waterTemperature && Zt(o.data.waterTemperature), o.data.waterlevel && Rt(o.data.waterlevel), o.data.water\u0421onsumption && Ht(o.data.water\u0421onsumption), o.data.snowIce && It(o.data.snowIce), o.data.iceRuler && ne(o.data.iceRuler), new le(), new re(), new ce(), c;
  }
  let t = e(s);
  return {
    recreate(o, c = !1) {
      let n, h, a;
      c && (n = t.scene.size.progress.target, h = t.scene.position.progress.target, a = t.scene.zoom), t.destroy(), t = e({ ...o, zoom: a, sizeProgress: n, positionProgress: h });
    },
    destroy() {
      t.destroy(), console.log(t);
    }
  };
}
function me(s, e) {
  const t = [];
  let i = new Date(s);
  for (; i <= e; )
    t.push(i) && (i = new Date(i)) && i.setDate(i.getDate() + 1);
  return t;
}
export {
  me as getTimelineData,
  xe as qwikStart
};
