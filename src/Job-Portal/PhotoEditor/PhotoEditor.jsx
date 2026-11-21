import React, { useCallback, useMemo, useState } from "react";
import Cropper from "react-easy-crop";
import { jsPDF } from "jspdf";
import { removeBackground } from "@imgly/background-removal";
import {
  Camera,
  Upload,
  Download,
  RotateCcw,
  RotateCw,
  ImagePlus,
  Printer,
  Sun,
  Contrast,
  Droplets,
  Sparkles,
  Grid,
  Wand2,
  ScanFace,
  Eraser,
  Briefcase,
  Loader2,
} from "lucide-react";
import "./photo-editor.css";

const PHOTO_SIZES = {
  passport: { label: "Passport (35 × 45 mm)", width: 35, height: 45 },
  stamp: { label: "Stamp (25 × 20 mm)", width: 25, height: 20 },
  exam: { label: "UPSC / SSC Standard (35 × 45 mm)", width: 35, height: 45 },
  custom: { label: "Custom Size", width: 35, height: 45 },
};

const PAPER_SIZES = {
  a4: { label: "A4 Sheet (210 × 297 mm)", width: 210, height: 297, margin: 8, gap: 3 },
  "4x6": { label: "4 × 6 inch Photo Paper (102 × 152 mm)", width: 101.6, height: 152.4, margin: 4, gap: 2.5 },
  "5x7": { label: "5 × 7 inch Photo Paper (127 × 178 mm)", width: 127, height: 177.8, margin: 5, gap: 3 },
  letter: { label: "US Letter (216 × 279 mm)", width: 215.9, height: 279.4, margin: 8, gap: 3 },
};

const BG_COLORS = [
  { id: "none", label: "Original", value: "transparent" },
  { id: "white", label: "Studio White", value: "#ffffff" },
  { id: "sky", label: "Passport Blue", value: "#dbeafe" },
  { id: "blue", label: "Royal Blue", value: "#2563eb" },
  { id: "grey", label: "Light Grey", value: "#e2e8f0" },
];

const SUIT_STYLES = [
  { id: "none", label: "No Suit Overlay", jacket: null, tie: null },
  { id: "navy", label: "Navy Formal Suit", jacket: "#1e293b", tie: "#991b1b" },
  { id: "black", label: "Classic Black Suit", jacket: "#0f172a", tie: "#1d4ed8" },
  { id: "charcoal", label: "Charcoal Blazer", jacket: "#334155", tie: "#0f766e" },
];

const loadImage = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });

function drawFormalSuitOverlay(ctx, width, height, suit, offsetY = 0, scale = 1) {
  if (!suit || suit.id === "none" || !suit.jacket) return;

  ctx.save();
  const centerX = width / 2;
  const baseY = height + offsetY * (height / 100);
  const w = width * scale;
  const h = height * scale;

  // White dress shirt collar
  ctx.fillStyle = "#f8fafc";
  ctx.beginPath();
  ctx.moveTo(centerX - w * 0.16, baseY - h * 0.28);
  ctx.lineTo(centerX + w * 0.16, baseY - h * 0.28);
  ctx.lineTo(centerX + w * 0.12, baseY);
  ctx.lineTo(centerX - w * 0.12, baseY);
  ctx.closePath();
  ctx.fill();

  // Tie knot & blade
  ctx.fillStyle = suit.tie;
  ctx.beginPath();
  ctx.moveTo(centerX - w * 0.035, baseY - h * 0.23);
  ctx.lineTo(centerX + w * 0.035, baseY - h * 0.23);
  ctx.lineTo(centerX + w * 0.022, baseY - h * 0.19);
  ctx.lineTo(centerX - w * 0.022, baseY - h * 0.19);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(centerX - w * 0.022, baseY - h * 0.19);
  ctx.lineTo(centerX + w * 0.022, baseY - h * 0.19);
  ctx.lineTo(centerX + w * 0.04, baseY);
  ctx.lineTo(centerX - w * 0.04, baseY);
  ctx.closePath();
  ctx.fill();

  // Suit shoulders & lapels
  ctx.fillStyle = suit.jacket;
  ctx.beginPath();
  ctx.moveTo(centerX - w * 0.54, baseY);
  ctx.quadraticCurveTo(centerX - w * 0.5, baseY - h * 0.24, centerX - w * 0.17, baseY - h * 0.28);
  ctx.lineTo(centerX, baseY - h * 0.05);
  ctx.lineTo(centerX + w * 0.17, baseY - h * 0.28);
  ctx.quadraticCurveTo(centerX + w * 0.5, baseY - h * 0.24, centerX + w * 0.54, baseY);
  ctx.closePath();
  ctx.fill();

  // Lapel highlight lines
  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.lineWidth = Math.max(1.5, width * 0.005);
  ctx.beginPath();
  ctx.moveTo(centerX - w * 0.17, baseY - h * 0.28);
  ctx.lineTo(centerX - w * 0.03, baseY - h * 0.07);
  ctx.moveTo(centerX + w * 0.17, baseY - h * 0.28);
  ctx.lineTo(centerX + w * 0.03, baseY - h * 0.07);
  ctx.stroke();

  ctx.restore();
}

async function renderProcessedCanvas(
  src,
  cropArea,
  outW,
  outH,
  filters,
  rotation = 0,
  bgColor = "#ffffff",
  suitConfig = null
) {
  const img = await loadImage(src);

  const rad = (rotation * Math.PI) / 180;
  const sin = Math.abs(Math.sin(rad));
  const cos = Math.abs(Math.cos(rad));
  const rotW = Math.round(img.width * cos + img.height * sin);
  const rotH = Math.round(img.width * sin + img.height * cos);

  const rotCanvas = document.createElement("canvas");
  rotCanvas.width = rotW;
  rotCanvas.height = rotH;
  const rCtx = rotCanvas.getContext("2d");
  rCtx.translate(rotW / 2, rotH / 2);
  rCtx.rotate(rad);
  rCtx.drawImage(img, -img.width / 2, -img.height / 2);

  const outCanvas = document.createElement("canvas");
  outCanvas.width = outW;
  outCanvas.height = outH;
  const ctx = outCanvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  if (bgColor && bgColor !== "transparent") {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, outW, outH);
  }

  ctx.save();
  ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%)`;
  ctx.drawImage(
    rotCanvas,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    outW,
    outH
  );
  ctx.restore();

  if (suitConfig && suitConfig.suit && suitConfig.suit.id !== "none") {
    drawFormalSuitOverlay(ctx, outW, outH, suitConfig.suit, suitConfig.offsetY, suitConfig.scale);
  }

  return outCanvas;
}

export default function PhotoEditor({
  onExport,
  onAiAttire,
  defaultCopies = 8,
  title = "PakkaJob AI Photo Studio",
}) {
  const [originalSrc, setOriginalSrc] = useState("");
  const [workingSrc, setWorkingSrc] = useState("");
  const [bgRemoved, setBgRemoved] = useState(false);
  const [bgColor, setBgColor] = useState("#ffffff");

  const [name, setName] = useState("photo");
  const [photoType, setPhotoType] = useState("passport");
  const [paperType, setPaperType] = useState("a4");
  const [cw, setCw] = useState(35);
  const [ch, setCh] = useState(45);
  const [copies, setCopies] = useState(defaultCopies);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [area, setArea] = useState(null);

  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [cutGuides, setCutGuides] = useState(true);

  const [suitId, setSuitId] = useState("none");
  const [suitOffsetY, setSuitOffsetY] = useState(0);
  const [suitScale, setSuitScale] = useState(1);

  const [aiStatus, setAiStatus] = useState("");
  const [printDataUrl, setPrintDataUrl] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const activeSuit = useMemo(
    () => SUIT_STYLES.find((s) => s.id === suitId) || SUIT_STYLES[0],
    [suitId]
  );

  const size = useMemo(() => {
    if (photoType === "custom") {
      return {
        width: Math.max(10, Math.min(100, Number(cw) || 35)),
        height: Math.max(10, Math.min(100, Number(ch) || 45)),
      };
    }
    return PHOTO_SIZES[photoType];
  }, [photoType, cw, ch]);

  const paper = useMemo(() => PAPER_SIZES[paperType] || PAPER_SIZES.a4, [paperType]);

  const layout = useMemo(() => {
    const cols = Math.max(
      1,
      Math.floor((paper.width - 2 * paper.margin + paper.gap) / (size.width + paper.gap))
    );
    const rows = Math.max(
      1,
      Math.floor((paper.height - 2 * paper.margin + paper.gap) / (size.height + paper.gap))
    );
    const perPage = cols * rows;
    const totalCopies = Math.max(1, Math.min(100, Number(copies) || 1));
    const pages = Math.ceil(totalCopies / perPage);
    return { cols, rows, perPage, pages, totalCopies };
  }, [paper, size, copies]);

  const onCropComplete = useCallback((_, pixels) => {
    setArea(pixels);
  }, []);

  function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");

    if (!file.type.startsWith("image/")) {
      return setError("Please select a valid image file (JPG, PNG, or WEBP).");
    }
    if (file.size > 15 * 1024 * 1024) {
      return setError("Image must be smaller than 15 MB.");
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      setOriginalSrc(dataUrl);
      setWorkingSrc(dataUrl);
      setBgRemoved(false);
      setName(file.name.replace(/\.[^.]+$/, "") || "photo");
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
      setBrightness(100);
      setContrast(100);
      setSaturation(100);
      setSuitId("none");
    };
    reader.onerror = () => setError("Could not read the selected image.");
    reader.readAsDataURL(file);
  }

  // 1. AI Background Removal (In-browser WASM)
  async function handleAiRemoveBackground() {
    if (!originalSrc) return;
    setError("");
    setAiStatus("AI is removing background (first run downloads ~25MB model)...");
    try {
      const blob = await removeBackground(originalSrc);
      const transparentUrl = URL.createObjectURL(blob);
      setWorkingSrc(transparentUrl);
      setBgRemoved(true);
      if (bgColor === "transparent") setBgColor("#ffffff");
    } catch (err) {
      setError("AI Background Removal failed: " + (err?.message || "Try another image."));
    } finally {
      setAiStatus("");
    }
  }

  function handleRestoreOriginalBg() {
    if (!originalSrc) return;
    setWorkingSrc(originalSrc);
    setBgRemoved(false);
  }

  // 2. AI Auto-Enhance (Histogram luminance & contrast balancing)
  async function handleAiAutoEnhance() {
    if (!workingSrc) return;
    setError("");
    setAiStatus("AI analyzing lighting & skin tones...");
    try {
      const img = await loadImage(workingSrc);
      const sampleCanvas = document.createElement("canvas");
      sampleCanvas.width = 120;
      sampleCanvas.height = 120;
      const ctx = sampleCanvas.getContext("2d");
      ctx.drawImage(img, 0, 0, 120, 120);
      const { data } = ctx.getImageData(0, 0, 120, 120);

      let lumSum = 0;
      let count = 0;
      let minLum = 255;
      let maxLum = 0;

      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 128) continue;
        const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        lumSum += lum;
        if (lum < minLum) minLum = lum;
        if (lum > maxLum) maxLum = lum;
        count++;
      }

      const avgLum = count ? lumSum / count : 128;
      const targetLum = 136;
      const suggestedBrightness = Math.round(
        Math.max(85, Math.min(132, (targetLum / Math.max(45, avgLum)) * 100))
      );
      const dynamicRange = maxLum - minLum;
      const suggestedContrast = dynamicRange < 170 ? 114 : 106;

      setBrightness(suggestedBrightness);
      setContrast(suggestedContrast);
      setSaturation(108);
    } catch {
      setBrightness(108);
      setContrast(108);
      setSaturation(106);
    } finally {
      setAiStatus("");
    }
  }

  // 3. AI Smart Face-Centering Crop
  async function handleAiFaceCenter() {
    if (!workingSrc) return;
    setError("");
    setAiStatus("AI detecting face & framing passport proportions...");
    try {
      const img = await loadImage(workingSrc);
      if ("FaceDetector" in window) {
        const detector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
        const faces = await detector.detect(img);
        if (faces && faces.length > 0) {
          const box = faces[0].boundingBox;
          const faceCenterX = box.x + box.width / 2;
          const faceCenterY = box.y + box.height / 2;

          const normX = (img.width / 2 - faceCenterX) / img.width;
          const normY = (img.height * 0.42 - faceCenterY) / img.height;
          const idealZoom = Math.max(
            1,
            Math.min(2.6, (img.height * 0.45) / Math.max(1, box.height))
          );

          setZoom(Number(idealZoom.toFixed(2)));
          setCrop({
            x: Math.round(normX * 220 * idealZoom),
            y: Math.round(normY * 220 * idealZoom),
          });
          setAiStatus("");
          return;
        }
      }
      // Fallback heuristic: center horizontally and frame upper-middle portrait zone
      setZoom(1.22);
      setCrop({ x: 0, y: 18 });
    } catch {
      setZoom(1.2);
      setCrop({ x: 0, y: 15 });
    } finally {
      setAiStatus("");
    }
  }

  // 4. AI Formal Attire (Cloud MERN hook if provided, else toggles studio suit selector)
  async function handleAiFormalSuitClick() {
    if (onAiAttire && workingSrc) {
      setError("");
      setAiStatus("Generating AI formal attire via PakkaJob Cloud...");
      try {
        const updatedUrl = await onAiAttire(workingSrc);
        if (updatedUrl) {
          setWorkingSrc(updatedUrl);
          setSuitId("none");
        }
      } catch (err) {
        setError("Cloud AI Attire error: " + (err?.message || "Failed"));
      } finally {
        setAiStatus("");
      }
      return;
    }
    setSuitId((prev) => (prev === "none" ? "navy" : "none"));
  }

  function resetAdjustments() {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setZoom(1);
    setRotation(0);
    setCrop({ x: 0, y: 0 });
    setSuitId("none");
    setSuitOffsetY(0);
    setSuitScale(1);
  }

  function resetAll() {
    setOriginalSrc("");
    setWorkingSrc("");
    setBgRemoved(false);
    setArea(null);
    setPrintDataUrl("");
    resetAdjustments();
    setError("");
  }

  async function buildCroppedDataUrl() {
    const pxPerMm = 300 / 25.4;
    const canvas = await renderProcessedCanvas(
      workingSrc,
      area,
      Math.round(size.width * pxPerMm),
      Math.round(size.height * pxPerMm),
      { brightness, contrast, saturation },
      rotation,
      bgRemoved ? bgColor : "#ffffff",
      { suit: activeSuit, offsetY: suitOffsetY, scale: suitScale }
    );
    return canvas.toDataURL("image/jpeg", 0.95);
  }

  async function handleDirectPrint() {
    setError("");
    if (!workingSrc || !area) return setError("Please upload and crop a photo first.");

    setBusy(true);
    try {
      const dataUrl = await buildCroppedDataUrl();
      setPrintDataUrl(dataUrl);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.print();
          setBusy(false);
        });
      });
    } catch (err) {
      setError(err.message || "Unable to prepare print sheet.");
      setBusy(false);
    }
  }

  async function handleDownloadPdf() {
    setError("");
    if (!workingSrc || !area) return setError("Please upload and crop a photo first.");
    if (!Number.isInteger(+copies) || +copies < 1 || +copies > 100) {
      return setError("Copies must be between 1 and 100.");
    }

    setBusy(true);
    try {
      const dataUrl = await buildCroppedDataUrl();
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [paper.width, paper.height],
        compress: true,
      });

      const { cols, perPage, pages, totalCopies } = layout;
      let placed = 0;

      for (let page = 0; page < pages; page++) {
        if (page > 0) pdf.addPage([paper.width, paper.height], "portrait");

        const count = Math.min(perPage, totalCopies - placed);
        const usedCols = Math.min(cols, count);
        const startX =
          (paper.width - (usedCols * size.width + (usedCols - 1) * paper.gap)) / 2;

        for (let i = 0; i < count; i++) {
          const x = startX + (i % cols) * (size.width + paper.gap);
          const y = paper.margin + Math.floor(i / cols) * (size.height + paper.gap);

          pdf.addImage(dataUrl, "JPEG", x, y, size.width, size.height, undefined, "FAST");

          if (cutGuides) {
            pdf.setDrawColor(180, 180, 180);
            pdf.setLineWidth(0.15);
            pdf.rect(x, y, size.width, size.height);
          }
          placed++;
        }
      }

      const blob = pdf.output("blob");
      const fileName = `${name}-${photoType}-${paperType}.pdf`;

      if (onExport) {
        await onExport({ blob, fileName, size, paper, copies: totalCopies });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      setError(err.message || "PDF generation failed.");
    } finally {
      setBusy(false);
    }
  }

  const printPages = useMemo(() => {
    const list = [];
    let remaining = layout.totalCopies;
    for (let p = 0; p < layout.pages; p++) {
      const count = Math.min(layout.perPage, remaining);
      list.push(count);
      remaining -= count;
    }
    return list;
  }, [layout]);

  const previewCount = Math.min(layout.totalCopies, layout.perPage);

  return (
    <div className="pj-editor-root">
      <style>{`
        @media print {
          @page {
            size: ${paper.width}mm ${paper.height}mm;
            margin: 0;
          }
        }
      `}</style>

      <div className="pj-screen-ui">
        <header className="pj-head">
          <div className="pj-brand">
            <span className="pj-logo">
              <Camera size={22} />
            </span>
            <div>
              <h1>{title}</h1>
              <p>Inbuilt AI Background Removal, Smart Face Crop, Auto-Enhance &amp; Direct Print</p>
            </div>
          </div>

          <div className="pj-head-actions">
            <label className="pj-btn light pj-upload-btn">
              <Upload size={16} />
              <span>{workingSrc ? "Upload new photo" : "Upload photo"}</span>
              <input type="file" accept="image/*" onChange={handleUpload} />
            </label>
            {workingSrc && (
              <button type="button" className="pj-btn ghost" onClick={resetAll}>
                <RotateCcw size={16} /> Clear
              </button>
            )}
          </div>
        </header>

        <div className="pj-layout">
          <section className="pj-panel">
            <div className="pj-panel-title">
              <h2>1. AI Studio &amp; Photo Enhancements</h2>
              {workingSrc && (
                <button type="button" className="pj-link-btn" onClick={resetAdjustments}>
                  Reset edits
                </button>
              )}
            </div>

            {!workingSrc ? (
              <label className="pj-dropzone">
                <input type="file" accept="image/*" onChange={handleUpload} />
                <ImagePlus size={44} />
                <b>Click to upload your photo</b>
                <span>Use AI to remove background, enhance lighting &amp; add formal attire</span>
                <em>
                  <Upload size={16} /> Browse Photo
                </em>
                <small>Supports JPG, PNG, WEBP · Max 15 MB</small>
              </label>
            ) : (
              <>
                <div className="pj-ai-toolbar">
                  <button
                    type="button"
                    className={`pj-ai-chip ${bgRemoved ? "active" : ""}`}
                    disabled={!!aiStatus}
                    onClick={bgRemoved ? handleRestoreOriginalBg : handleAiRemoveBackground}
                  >
                    <Eraser size={15} />
                    <span>{bgRemoved ? "Restore Original BG" : "AI Remove BG"}</span>
                  </button>

                  <button
                    type="button"
                    className="pj-ai-chip"
                    disabled={!!aiStatus}
                    onClick={handleAiAutoEnhance}
                  >
                    <Wand2 size={15} />
                    <span>AI Auto-Enhance</span>
                  </button>

                  <button
                    type="button"
                    className="pj-ai-chip"
                    disabled={!!aiStatus}
                    onClick={handleAiFaceCenter}
                  >
                    <ScanFace size={15} />
                    <span>AI Smart Face Crop</span>
                  </button>

                  <button
                    type="button"
                    className={`pj-ai-chip ${suitId !== "none" ? "active" : ""}`}
                    disabled={!!aiStatus}
                    onClick={handleAiFormalSuitClick}
                  >
                    <Briefcase size={15} />
                    <span>AI Formal Suit</span>
                  </button>
                </div>

                {aiStatus && (
                  <div className="pj-ai-banner">
                    <Loader2 size={16} className="pj-spin" />
                    <span>{aiStatus}</span>
                  </div>
                )}

                {bgRemoved && (
                  <div className="pj-bg-palette">
                    <span>Studio Backdrop:</span>
                    <div className="pj-swatches">
                      {BG_COLORS.filter((c) => c.id !== "none").map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          title={c.label}
                          className={`pj-swatch ${bgColor === c.value ? "selected" : ""}`}
                          style={{ backgroundColor: c.value }}
                          onClick={() => setBgColor(c.value)}
                        />
                      ))}
                      <input
                        type="color"
                        value={bgColor}
                        title="Custom background color"
                        onChange={(e) => setBgColor(e.target.value)}
                        className="pj-color-picker"
                      />
                    </div>
                  </div>
                )}

                {suitId !== "none" && (
                  <div className="pj-suit-box">
                    <div className="pj-suit-row">
                      <span>Suit Style:</span>
                      <select value={suitId} onChange={(e) => setSuitId(e.target.value)}>
                        {SUIT_STYLES.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="pj-slider-row">
                      <label>Suit Position</label>
                      <input
                        type="range"
                        min="-15"
                        max="20"
                        value={suitOffsetY}
                        onChange={(e) => setSuitOffsetY(+e.target.value)}
                      />
                      <span>{suitOffsetY}%</span>
                    </div>
                    <div className="pj-slider-row">
                      <label>Suit Width</label>
                      <input
                        type="range"
                        min="0.8"
                        max="1.25"
                        step="0.02"
                        value={suitScale}
                        onChange={(e) => setSuitScale(+e.target.value)}
                      />
                      <span>{Math.round(suitScale * 100)}%</span>
                    </div>
                  </div>
                )}

                <div
                  className="pj-crop-stage"
                  style={{
                    backgroundColor: bgRemoved ? bgColor : "#0f172a",
                    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
                  }}
                >
                  <Cropper
                    image={workingSrc}
                    crop={crop}
                    zoom={zoom}
                    rotation={rotation}
                    aspect={size.width / size.height}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                    restrictPosition={false}
                  />
                </div>

                <div className="pj-controls-grid">
                  <div className="pj-slider-row">
                    <label>
                      <Sparkles size={14} /> Zoom
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="0.02"
                      value={zoom}
                      onChange={(e) => setZoom(+e.target.value)}
                    />
                    <span>{zoom.toFixed(1)}×</span>
                  </div>

                  <div className="pj-slider-row">
                    <label>
                      <Sun size={14} /> Brightness
                    </label>
                    <input
                      type="range"
                      min="60"
                      max="150"
                      step="1"
                      value={brightness}
                      onChange={(e) => setBrightness(+e.target.value)}
                    />
                    <span>{brightness}%</span>
                  </div>

                  <div className="pj-slider-row">
                    <label>
                      <Contrast size={14} /> Contrast
                    </label>
                    <input
                      type="range"
                      min="60"
                      max="150"
                      step="1"
                      value={contrast}
                      onChange={(e) => setContrast(+e.target.value)}
                    />
                    <span>{contrast}%</span>
                  </div>

                  <div className="pj-slider-row">
                    <label>
                      <Droplets size={14} /> Color / Saturation
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="160"
                      step="1"
                      value={saturation}
                      onChange={(e) => setSaturation(+e.target.value)}
                    />
                    <span>{saturation}%</span>
                  </div>
                </div>

                <div className="pj-rotate-bar">
                  <span>Rotate:</span>
                  <button
                    type="button"
                    className="pj-btn light sm"
                    onClick={() => setRotation((r) => (r - 90 + 360) % 360)}
                  >
                    <RotateCcw size={14} /> -90°
                  </button>
                  <button
                    type="button"
                    className="pj-btn light sm"
                    onClick={() => setRotation((r) => (r + 90) % 360)}
                  >
                    <RotateCw size={14} /> +90°
                  </button>
                  <small className="pj-angle">{rotation}°</small>
                </div>
              </>
            )}
          </section>

          <section className="pj-panel">
            <div className="pj-panel-title">
              <h2>2. Paper Size &amp; Direct Print</h2>
            </div>

            <div className="pj-form-grid">
              <label className="pj-field">
                <span>Photo Format</span>
                <select value={photoType} onChange={(e) => setPhotoType(e.target.value)}>
                  {Object.entries(PHOTO_SIZES).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="pj-field">
                <span>Print Paper Size</span>
                <select value={paperType} onChange={(e) => setPaperType(e.target.value)}>
                  {Object.entries(PAPER_SIZES).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {photoType === "custom" && (
              <div className="pj-form-grid">
                <label className="pj-field">
                  <span>Width (mm)</span>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={cw}
                    onChange={(e) => setCw(e.target.value)}
                  />
                </label>
                <label className="pj-field">
                  <span>Height (mm)</span>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={ch}
                    onChange={(e) => setCh(e.target.value)}
                  />
                </label>
              </div>
            )}

            <div className="pj-capacity-card">
              <div className="pj-capacity-info">
                <Grid size={20} />
                <div>
                  <strong>
                    Maximum {layout.perPage} photos fit on 1 {paper.label.split("(")[0].trim()}
                  </strong>
                  <span>
                    Grid: {layout.cols} columns × {layout.rows} rows ({size.width} × {size.height} mm each)
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="pj-btn accent sm"
                onClick={() => setCopies(layout.perPage)}
              >
                Fill 1 Sheet ({layout.perPage})
              </button>
            </div>

            <div className="pj-form-grid align-end">
              <label className="pj-field">
                <span>Number of Copies (1–100)</span>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={copies}
                  onChange={(e) => setCopies(e.target.value)}
                />
              </label>

              <label className="pj-checkbox">
                <input
                  type="checkbox"
                  checked={cutGuides}
                  onChange={(e) => setCutGuides(e.target.checked)}
                />
                <span>Show scissor cut borders</span>
              </label>
            </div>

            <div className="pj-sheet-preview-box">
              <div className="pj-preview-meta">
                <span>
                  Sheet Preview (Page 1 of {layout.pages})
                </span>
                <strong>
                  {previewCount} of {layout.totalCopies} photos shown
                </strong>
              </div>

              <div className="pj-paper-wrapper">
                <div
                  className="pj-paper-mock"
                  style={{
                    aspectRatio: `${paper.width} / ${paper.height}`,
                    padding: `${(paper.margin / paper.height) * 100}% ${(paper.margin / paper.width) * 100}%`,
                    gridTemplateColumns: `repeat(${layout.cols}, ${(size.width / (paper.width - 2 * paper.margin)) * 100}%)`,
                    gap: `${(paper.gap / paper.height) * 100}% ${(paper.gap / paper.width) * 100}%`,
                  }}
                >
                  {Array.from({ length: previewCount }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`pj-mock-slot ${cutGuides ? "with-guide" : ""}`}
                      style={{
                        aspectRatio: `${size.width} / ${size.height}`,
                        backgroundColor: bgRemoved ? bgColor : "#e2e8f0",
                      }}
                    >
                      {workingSrc ? (
                        <img
                          src={workingSrc}
                          alt=""
                          style={{
                            filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
                            transform: `rotate(${rotation}deg) scale(${zoom})`,
                          }}
                        />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pj-actions-row">
              <button
                type="button"
                className="pj-btn primary"
                disabled={!workingSrc || busy || !!aiStatus}
                onClick={handleDirectPrint}
              >
                <Printer size={18} />
                {busy ? "Preparing Printer..." : "Print Photo Sheet Now"}
              </button>

              <button
                type="button"
                className="pj-btn secondary"
                disabled={!workingSrc || busy || !!aiStatus}
                onClick={handleDownloadPdf}
              >
                <Download size={18} />
                Save 300 DPI PDF
              </button>
            </div>

            <small className="pj-print-tip">
              Works with Windows, macOS &amp; Mobile printers. Set Scale to <strong>100% / Actual Size</strong> in your printer dialog.
            </small>

            {error && (
              <p className="pj-error" role="alert">
                {error}
              </p>
            )}
          </section>
        </div>
      </div>

      {printDataUrl && (
        <div className="pj-print-only-container" aria-hidden="true">
          {printPages.map((countOnPage, pageIdx) => (
            <div
              key={pageIdx}
              className="pj-print-sheet"
              style={{
                width: `${paper.width}mm`,
                height: `${paper.height}mm`,
                paddingTop: `${paper.margin}mm`,
                paddingBottom: `${paper.margin}mm`,
                gridTemplateColumns: `repeat(${Math.min(layout.cols, countOnPage)}, ${size.width}mm)`,
                columnGap: `${paper.gap}mm`,
                rowGap: `${paper.gap}mm`,
              }}
            >
              {Array.from({ length: countOnPage }).map((_, idx) => (
                <img
                  key={idx}
                  src={printDataUrl}
                  alt=""
                  className={cutGuides ? "pj-print-cut-border" : ""}
                  style={{
                    width: `${size.width}mm`,
                    height: `${size.height}mm`,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
