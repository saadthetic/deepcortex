# DeepCortex AI — Protecting Brain Health Earlier

> **Longitudinal Cognitive Intelligence & Explainable Edge Neuro-AI for Early Alzheimer's & Dementia Screening**
>
> **Research Artifact / DOI:** [`10.5281/zenodo.17864829`](https://doi.org/10.5281/zenodo.17864829) · **Model Architecture:** 71-Layer Xception CNN (20.54 MB INT8 Quantized TFLite) · **Published Benchmark:** `89.59% Accuracy` · `0.955 ROC-AUC` · **Clinical Governance:** DECIDE-AI 5-Gate Standard

---

## 1. Abstract & Project Overview

**DeepCortex AI** is a privacy-first, sovereign clinical screening and longitudinal brain-health web/mobile platform designed to detect early cognitive drift and structural neuroimaging biomarkers before overt dementia occurs. Built for dual regional deployment—**Abu Dhabi Department of Health (ADPHC / IFHAS 50–75 / Malaffi HIE / Sahatna)** and **Pakistan Punjab Health (Sehat Sahulat / DHQ Teaching Hospitals)**—the system unifies:

1. **On-Device 4-Stage Brain MRI Neuroimaging Classification** powered by a **20.54 MB INT8 quantized 71-layer Xception TensorFlow Lite model** (`deepcortex_int8.tflite`) running directly in the browser via **TensorFlow.js + WebAssembly (XNNPACK)** or natively on Android via a **Capacitor TFLite NPU Bridge**, with an automatic **Self-Calibrated ZNCC + Contiguous Central Ventricular CSF** deterministic fallback.
2. **Explainable Grad-CAM Attention Overlays** (`block14_sepconv2_act`) highlighting hippocampal, lateral ventricular, cortical, and medial temporal regions of interest (ROIs).
3. **Longitudinal Cognitive Drift Tracking** combining a 2-minute culturally calibrated memory check, an **Audio-Visual 4-Note Piano Sequence Memory** test (Web Audio API), and a deterministic **Reliable Change Index (Z-Score)** engine.
4. **Dr. Nance's 5-Gate Clinical Safety Architecture (DECIDE-AI Standard)** enforcing strict separation between recorded observations, deterministic ML/math calculations, and LLM plain-language synthesis—**zero LLM overrides of MRI staging are permitted**—plus an interactive **Acute Red-Flag Emergency Bypass** (`<48h` delirium/stroke triage).
5. **Lancet 2024 14-Factor Modifiable Risk Profiling**, **Doctor Review & Sign-Off**, **HL7 FHIR R4 Closed-Loop Handover**, and **Single-Page Clinical PDF Dossier Export**.

---

## 2. Architecture & Technology Stack

| Layer | Technologies & Specifications |
| :--- | :--- |
| **Frontend UI** | React 19, TypeScript, Tailwind CSS v4 (`@tailwindcss/vite`), Vite 8, `lucide-react`, `motion` |
| **On-Device ML Runtime** | `@litertjs/core` (`^2.6.0` Google LiteRT / TFLite 2.18+ WebAssembly XNNPACK supporting `FULLY_CONNECTED` v12 per-channel INT8), Web Canvas 2D |
| **Native Mobile Bridge** | Capacitor Android Plugin interface (`window.Capacitor.Plugins.DeepCortexTFLite.classifyMRI`) + Android TFLite 2.16.1 XNNPACK |
| **Backend Server** | Node.js (v20.11+ / v22+), Express 4 (`server.ts`), `tsx` (dev), `esbuild` (`^0.28.0`, prod bundle) |
| **Generative Narrative & TTS** | `@google/genai` — `gemini-2.5-flash` (plain-language bilingual narrative synthesis only) & `gemini-2.5-flash-preview-tts` (trilingual voice narration with Web Speech API fallback) |
| **Clinical Reporting** | `jspdf` (`^4.2.1`) + `html2canvas` (`^1.4.1`) single-page PDF dossier (`SCAN####-DDMMYYYY-HHMMSS.pdf`) |
| **Auth & Cloud Sync (Optional)** | Firebase Authentication (Google + Email/Password) & Cloud Firestore with owner-scoped `firestore.rules`; Zero-Knowledge Local Vault (`localStorage`) by default |
| **Localization** | Trilingual UI & clinical copy: English (`en`), Arabic (`ar`, RTL), Urdu (`ur`, RTL) |

---

## 3. Key Clinical & Technical Features

### A. MRI Scan Lab & 100% On-Device TFLite Engine (`src/components/MriScanLab.tsx`)
- **4-Stage Structural Classification:** `Non-Demented`, `Very Mild Demented`, `Mild Demented`, `Moderate Demented`.
- **3-Tier Deterministic Execution Priority:**
  1. **Native Android TFLite NPU Bridge** (`window.Capacitor?.Plugins?.DeepCortexTFLite.classifyMRI`)
  2. **Browser WebAssembly TFLite Inference** (`@tensorflow/tfjs-tflite` executing `deepcortex_int8.tflite`)
  3. **Self-Calibrated ZNCC + Contiguous Ventricular CSF Calibrator** (anchored to the 4 real OASIS T1 reference slices pre-loaded onto canonical `224×224` canvases)
- **Live Runtime Status Badge:** Every scan result explicitly displays whether inference executed via **`Real Xception INT8 TFLite Weights (20.54 MB)`** or **`Deterministic ZNCC Reference Calibrator`**.
- **Dual Viewport & Grad-CAM:** Side-by-side Raw Axial T1 (`224×224`) and Grad-CAM attention heatmap with toggleable anatomical ROI bounding boxes (Hippocampus, Lateral Ventricles, Temporal Lobe).
- **Zero LLM Override Policy:** Gemini 2.5 Flash is strictly limited to plain-language patient education when Cloud Mode is enabled and never overrides the deterministic neuroimaging stage.

### B. Dr. Nance's 5-Gate Clinical Workflow (DECIDE-AI Standard)
- **Gate 1 — Consent & IFHAS 50–75 Cultural/Sensory Gate:** Verifies cultural/linguistic/sensory calibration (`Standard`, `Audio-Visual Studio`, `High Contrast`).
- **Gate 2 — Acute Red-Flag Emergency Bypass:** Interactive check for `<48h` sudden confusion/delirium, slurred speech/aphasia, unilateral weakness, or acute fever/trauma. Triggering any flag turns Gate 2 red (`EMERGENCY BYPASS TRIGGERED`), halts routine dementia screening, and renders an urgent triage directive (**Call 998 Abu Dhabi Estijaba / 1122 Punjab Rescue**).
- **Gate 3 — Missing-Data & Confounder Evidence Gate:** Audits Blood Pressure, HbA1c, Sleep, and Hearing status, computes an Evidence Completeness & Signal Confidence Index (supporting Partial-Evidence `-18%` handling without halting), and flags reversible confounders.
- **Gate 4 — Deterministic Math & 71-Layer Xception Gate:** Provenance-tags outputs with `[Recorded Observation]`, `[Deterministic Z-Score / Xception TFLite Calculation]`, and `[Gemini 2.5 LLM Plain-Language Synthesis]`.
- **Gate 5 — DECIDE-AI Clinician Approval & Closed-Loop Handover:** Requires physician review of a 4-item clinical checklist and credentials before unlocking signed PDF export and HL7 FHIR R4 dispatch to **Abu Dhabi Sahatna / Malaffi HIE** or **Punjab DHQ / Sehat Sahulat**.

### C. Cognitive Memory Check & Audio-Visual Piano Sequence (`src/components/BrainCheckTab.tsx`)
- Multi-step 2-minute screening: Delayed word recall, orientation, trail-making speed, and **Step 2B Audio-Visual 4-Note Piano Sequence Memory** (`C4 261.6Hz`, `E4 329.6Hz`, `G4 392.0Hz`, `A4 440.0Hz` via Web Audio API oscillator synthesis) recording recall accuracy (%) and response latency (ms).
- **Deterministic Reliable Change Index (Z-Score):**
  $$Z = \frac{\text{FollowUp} - \text{Baseline} - \text{PracticeGain}}{\text{SD}}$$
  Plotted against a longitudinal personal baseline with `±1.5 SD` drift threshold.

### D. Additional Modules
- **Modifiable Risk Context (`RiskContextTab.tsx`):** Interactive Lancet 2024 14-Factor Brain Protection Index.
- **Care Plan & Clinics (`CarePlanTab.tsx`):** Verified regional clinic directories (clickable phone & official portal links), Doctor Sign-Off, and Sahatna/Malaffi handover.
- **Safety & Benchmark Suite (`SafetyStatusTab.tsx`):** Live service telemetry plus the 6-case Clinical Agent & Edge-Case Benchmark Evaluation Suite (`#BM-01` through `#BM-06`).
- **History Vault & Profile (`HistoryVaultTab.tsx`, `PatientProfileModal.tsx`):** Grouped session encounters, optional Firebase cloud sync, and dual local/cloud deletion.

---

## 4. Repository Structure & Backend Endpoints

```text
.
├── index.html                        # SPA entry point
├── metadata.json                     # AI Studio app metadata & capabilities
├── package.json                      # Dependencies, scripts, and npm overrides
├── vite.config.ts                    # Vite 8 config + TFLite FESM & tfjs-core aliases
├── tsconfig.json                     # TypeScript config + tfjs-core deduplication
├── server.ts                         # Express API server + Vite dev middleware / static prod server
├── firestore.rules                   # Owner-scoped Cloud Firestore security rules
├── .env.example                      # Environment variable template
├── public/
│   ├── assets/aistudio/              # Logo & 4 real OASIS T1 reference MRI scans
│   └── models/
│       └── deepcortex.tflite         # <-- Place your real 20.54 MB INT8 TFLite binary here!
└── src/
    ├── App.tsx                       # Main shell, routing, state & session orchestration
    ├── types.ts                      # Core TypeScript clinical & ML interfaces
    ├── translations.ts               # EN / AR / UR clinical localization
    ├── services/
    │   └── firebaseAuthService.ts    # Firebase Auth & Firestore sync service
    └── components/
        ├── MriScanLab.tsx            # TFLite WASM + Capacitor + ZNCC MRI engine & Grad-CAM
        ├── BrainCheckTab.tsx         # Cognitive test, 4-note piano memory & Z-score engine
        ├── RiskContextTab.tsx        # Lancet 14-Factor modifiable risk calculator
        ├── CarePlanTab.tsx           # 5-Gate workflow, clinic directory & doctor sign-off
        ├── ClinicalReportDossier.tsx # Single-page PDF dossier generator
        ├── SafetyStatusTab.tsx       # Telemetry & #BM-01..#BM-06 clinical benchmarks
        ├── HistoryVaultTab.tsx       # Grouped session history vault
        └── ...                       # Header, SideDrawer, BottomNav, Profile & Modals
```

### Express API Routes (`server.ts`)
- `GET /api/system-status` — Live status telemetry for the 8 clinical subsystems.
- `POST /api/neuro/analyze-mri` — Optional Gemini 2.5 Flash plain-language clinical narrative synthesis (Cloud Mode only; never overrides MRI stage).
- `POST /api/neuro/care-plan` — Region-aware clinic referral directory & stepped-care recommendations.
- `POST /api/neuro/tts` — Trilingual audio synthesis via `gemini-2.5-flash-preview-tts` (with automatic Web Speech fallback).

---

## 5. Running 100% on the Real 20.54 MB TFLite Model

Follow these exact steps to guarantee inference executes on the **real quantized Xception weights** rather than falling back to the ZNCC reference calibrator.

### Step 1: Place the Real Model Binary in `public/models/`
There is an empty placeholder at `public/models/deepcortex.tflite`. **Replace it with your real 20.54 MB `deepcortex_int8.tflite` binary:**

```bash
# macOS / Linux
cp /path/to/deepcortex_int8.tflite public/models/deepcortex.tflite

# Windows PowerShell
Copy-Item "C:\path\to\deepcortex_int8.tflite" -Destination "public\models\deepcortex.tflite" -Force
```

Verify the file size is ~20.54 MB (must be `> 10 KB`; the loader rejects empty files and HTML fallback pages):
```bash
ls -lh public/models/deepcortex.tflite
```

> **Automatic Remote Fallback:** If `public/models/deepcortex.tflite` is absent or empty, `loadRealXceptionTfliteModel()` automatically tries fetching `https://raw.githubusercontent.com/saadthetic/DeepCortex-AI/main/deepcortex_int8.tflite`. For 100% offline reliability and zero CORS/404 risk, always bundle the file locally at `public/models/deepcortex.tflite`.

### Step 2: Tensor Preprocessing & Softmax Class Mapping (Empirically Verified)
When a user uploads an MRI image, `src/components/MriScanLab.tsx` runs:
1. Draws the MRI onto a `224×224` offscreen canvas.
2. Extracts RGB channels into a `Float32Array(224 * 224 * 3)` normalized to `[0, 1]` (`pixel / 255.0`) and wraps it in `new LiteRtTensor(rgbFloat, [1, 224, 224, 3])`.
3. Executes `await webTfliteModel.run([inputTensor])` via **Google LiteRT (`@litertjs/core@2.6.0`)** with XNNPACK WebAssembly (which natively supports TF 2.16+ `FULLY_CONNECTED` v12 per-channel INT8 weights — unlike legacy `@tensorflow/tfjs-tflite@0.0.1-alpha.10`).
4. Maps the 4 Softmax probabilities in the exact alphabetical training order:
   - **Index `0`**: `Mild Demented` (verified `97.47%` on `mild_25.jpg`)
   - **Index `1`**: `Moderate Demented` (verified `100.00%` on `moderate_52.jpg`)
   - **Index `2`**: `Non-Demented` (verified `99.83%` on `non_17.jpg`)
   - **Index `3`**: `Very Mild Demented` (verified `97.99%` on `verymild_25.jpg`)

### Step 3: Local WebAssembly (`wasm`) Runtime Configuration
- The LiteRT WebAssembly runtime binaries (`litert_wasm_internal.{js,wasm}` and `litert_wasm_compat_internal.{js,wasm}`) are staged locally in **`public/litert-wasm/`** for **100% offline, zero-CORS execution**, with automatic CDN fallback to `https://cdn.jsdelivr.net/npm/@litertjs/core@2.6.0/wasm/`.
- If you ever refresh `@litertjs/core`, re-copy the runtime files via:
  ```bash
  mkdir -p public/litert-wasm
  cp node_modules/@litertjs/core/wasm/litert_wasm_internal.* node_modules/@litertjs/core/wasm/litert_wasm_compat_internal.* public/litert-wasm/
  ```

### Step 4: Verify Live Execution
1. Open the **MRI Scan Lab** tab.
2. Confirm the top neural engine banner turns emerald and displays:
   **`Real Xception INT8 TFLite Weights (20.54 MB)`** (`LiteRT WebAssembly XNNPACK`).
3. Upload any brain MRI image (`JPG`/`PNG`). The result header badge will confirm:
   **`Real Xception INT8 TFLite Weights (20.54 MB)`**.

---

## 6. Deployment & Run Guides

### A. Local Development (Windows / macOS / Linux)

**Prerequisites:** Node.js **v20.11+ or v22+** (required for `import.meta.dirname`) and npm **10+ / 11+**.

```bash
# 1. Clone or navigate into the project folder
cd deepcortex-ai---protecting-brain-health-earlier

# 2. Configure environment variables
cp .env.example .env
# Edit .env and add GEMINI_API_KEY (optional for offline mode, required for Cloud Mode synthesis & TTS)
# Optionally add VITE_FIREBASE_* keys if using Firebase cloud sync

# 3. Copy the real 20.54 MB TFLite weights
# Place your model at: public/models/deepcortex.tflite

# 4. Install dependencies (package.json already includes esbuild ^0.28.0 & tfjs-core overrides)
npm install

# 5. Start the full-stack dev server (Express + Vite middleware on port 3000)
npm run dev
```

Open **`http://localhost:3000`**.

**Local Production Build & Verification:**
```bash
npm run lint    # Runs tsc --noEmit (zero TypeScript errors)
npm run build   # Builds frontend into dist/ and bundles server.ts into dist/server.js
npm start       # Runs production server (NODE_ENV=production node dist/server.js)
```

---

### B. Google AI Studio & Cloud Run Deployment

1. **Secrets Configuration:**
   - Open the **Secrets / Environment Variables** panel in AI Studio.
   - Set `GEMINI_API_KEY` (automatically injected into `server.ts` at runtime).
   - If using cloud profile sync, add your `VITE_FIREBASE_*` keys.
2. **Upload TFLite Model Weights:**
   - Upload your 20.54 MB `deepcortex_int8.tflite` file into `/public/models/deepcortex.tflite` (replacing the empty placeholder) OR publish it at `https://raw.githubusercontent.com/saadthetic/DeepCortex-AI/main/deepcortex_int8.tflite` in a public repository so the loader can fetch it directly.
3. **Runtime & Port:**
   - The Express + Vite server listens on `0.0.0.0:3000` (`PORT` env var supported).
   - `DISABLE_HMR=true` is respected by both `vite.config.ts` and `server.ts`.
4. **Deploy to Cloud Run (via AI Studio Deploy button or CLI):**
   - Build command: `npm run build`
   - Start command: `NODE_ENV=production npm start` (runs `node dist/server.js`, serving both `/api/*` and the compiled `dist/` SPA including `/models/deepcortex.tflite`).

---

### C. Netlify Deployment

Because **TFLite WebAssembly inference runs 100% client-side in the browser**, the entire MRI classifier, Grad-CAM viewport, Cognitive Piano Test, Z-Score calculator, Risk Matrix, and PDF exporter work natively on Netlify static hosting!

#### 1. Add `netlify.toml` to the project root:
```toml
[build]
  command = "npx vite build"
  publish = "dist"

# Serve static assets, .tflite weights & LiteRT .wasm binaries directly; rewrite SPA routes to index.html
[[redirects]]
  from = "/models/*"
  to = "/models/:splat"
  status = 200

[[redirects]]
  from = "/litert-wasm/*"
  to = "/litert-wasm/:splat"
  status = 200

# Optional: Proxy /api/* to an external Express backend (Cloud Run / Render / Railway)
# [[redirects]]
#   from = "/api/*"
#   to = "https://YOUR-BACKEND-URL.run.app/api/:splat"
#   status = 200
#   force = true

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Enable binary serving & caching for the 20.54 MB TFLite model and LiteRT WASM runtime
[[headers]]
  for = "/models/*.tflite"
  [headers.values]
    Content-Type = "application/octet-stream"
    Cache-Control = "public, max-age=31536000, immutable"
    Access-Control-Allow-Origin = "*"

[[headers]]
  for = "/litert-wasm/*.wasm"
  [headers.values]
    Content-Type = "application/wasm"
    Cache-Control = "public, max-age=31536000, immutable"
    Access-Control-Allow-Origin = "*"

# Optional: Enable Cross-Origin Isolation for multi-threaded WASM SIMD acceleration
# (Note: Test Firebase Google Sign-In popup compatibility; use credentialless if popups are used)
[[headers]]
  for = "/*"
  [headers.values]
    Cross-Origin-Opener-Policy = "same-origin-allow-popups"
```

#### 2. Deploy Steps on Netlify:
1. Ensure `public/models/deepcortex.tflite` contains the real 20.54 MB file (use **Git LFS** if pushing to GitHub, or deploy via `npx netlify-cli deploy --prod --dir=dist`).
2. In **Netlify Dashboard → Site Configuration → Build & Deploy**:
   - **Build command:** `npx vite build`
   - **Publish directory:** `dist`
   - **Node version:** Set environment variable `NODE_VERSION = 22`
3. Add your `VITE_FIREBASE_*` environment variables under **Site Configuration → Environment Variables** (if using Firebase Auth/Firestore).
4. **Full-Stack `/api/*` on Netlify:** Static Netlify sites do not run `server.ts`.
   - **100% Offline Edge Mode (Zero Backend Needed):** MRI TFLite inference, Cognitive Check, Risk Index, Local Vault, and PDF Dossier work completely offline on Netlify.
   - **With Gemini Cloud Narrative & TTS:** Deploy `server.ts` to Google Cloud Run / Render / Railway (setting `GEMINI_API_KEY`) and uncomment the `/api/*` proxy block in `netlify.toml` above.

---

### D. Android Native APK / AAB Deployment (Capacitor + Real On-Device TFLite NPU)

`src/components/MriScanLab.tsx` natively detects and invokes `window.Capacitor?.Plugins?.DeepCortexTFLite.classifyMRI({ imageBase64 })` **before** falling back to WebAssembly or ZNCC. This unlocks hardware-accelerated **Android NNAPI / GPU / Hexagon NPU** inference with zero browser memory limits.

#### Step 1: Install Capacitor & Add Android Platform
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx vite build
npx cap add android
npx cap sync android
```
> **Note (`capacitor.config.json` vs. `capacitor.config.ts`):** This project includes `capacitor.config.json` in the root so `@capacitor/cli` parses config directly without calling `ts.ModuleKind.CommonJS` (which fails under TypeScript 7). If you previously ran `npx cap init` and have a local `capacitor.config.ts`, delete `capacitor.config.ts` and keep `capacitor.config.json` before running `npx cap sync android`.

#### Step 2: Bundle `deepcortex_int8.tflite` Inside Android Assets
1. Copy the 20.54 MB model into `android/app/src/main/assets/deepcortex.tflite`.
2. Open `android/app/build.gradle` and add TensorFlow Lite + prevent APK compression of `.tflite` files (required for memory-mapped `FileChannel` loading):

```groovy
android {
    aaptOptions {
        noCompress "tflite"
    }
}

dependencies {
    implementation 'org.tensorflow:tensorflow-lite:2.16.1'
    implementation 'org.tensorflow:tensorflow-lite-gpu:2.16.1'
    implementation 'org.tensorflow:tensorflow-lite-support:0.4.4'
}
```

#### Step 3: Implement the `DeepCortexTFLite` Capacitor Plugin (Kotlin)
Create `android/app/src/main/java/ai/deepcortex/clinical/DeepCortexTFLitePlugin.kt`:

```kotlin
package ai.deepcortex.clinical

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.util.Base64
import com.getcapacitor.JSArray
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import org.tensorflow.lite.Interpreter
import java.io.FileInputStream
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.nio.MappedByteBuffer
import java.nio.channels.FileChannel

@CapacitorPlugin(name = "DeepCortexTFLite")
class DeepCortexTFLitePlugin : Plugin() {

    private var interpreter: Interpreter? = null
    private val interpreterLock = Any()

    private fun loadModelFile(): MappedByteBuffer {
        context.assets.openFd("deepcortex.tflite").use { fd ->
            FileInputStream(fd.fileDescriptor).use { inputStream ->
                return inputStream.channel.map(
                    FileChannel.MapMode.READ_ONLY,
                    fd.startOffset,
                    fd.declaredLength
                )
            }
        }
    }

    private fun getInterpreter(): Interpreter {
        if (interpreter == null) {
            // IMPORTANT: Use unified 4-thread XNNPACK CPU (do NOT add NnApiDelegate).
            // On Qualcomm Snapdragon devices, NNAPI fragments the 104-node hybrid INT8/FP32
            // Xception graph into 61 partitions and corrupts per-channel INT8 activations.
            val options = Interpreter.Options().apply {
                setNumThreads(4)
                setUseXNNPACK(true)
            }
            val interp = Interpreter(loadModelFile(), options)
            // Lock dynamic batch dimension [-1, 224, 224, 3] -> [1, 224, 224, 3]
            interp.resizeInput(0, intArrayOf(1, 224, 224, 3))
            interp.allocateTensors()
            interpreter = interp
        }
        return interpreter!!
    }

    @PluginMethod
    fun classifyMRI(call: PluginCall) {
        val rawBase64 = call.getString("imageBase64") ?: run {
            call.reject("Missing imageBase64")
            return
        }

        try {
            val cleanBase64 = rawBase64.substringAfter("base64,", rawBase64)
            val bytes = Base64.decode(cleanBase64, Base64.DEFAULT)
            val decodeOpts = BitmapFactory.Options().apply {
                inPreferredConfig = Bitmap.Config.ARGB_8888
            }
            val origBitmap = BitmapFactory.decodeByteArray(bytes, 0, bytes.size, decodeOpts)
                ?: throw IllegalArgumentException("Failed to decode MRI bitmap")
            val resized = Bitmap.createScaledBitmap(origBitmap, 224, 224, true)
            val argbBitmap = if (resized.config != Bitmap.Config.ARGB_8888) {
                resized.copy(Bitmap.Config.ARGB_8888, false)
            } else {
                resized
            }

            // Allocate [1, 224, 224, 3] float32 buffer normalized to [0, 1]
            val inputBuffer = ByteBuffer.allocateDirect(4 * 224 * 224 * 3).order(ByteOrder.nativeOrder())
            val intValues = IntArray(224 * 224)
            argbBitmap.getPixels(intValues, 0, 224, 0, 0, 224, 224)
            for (pixel in intValues) {
                inputBuffer.putFloat(((pixel shr 16) and 0xFF) / 255.0f)
                inputBuffer.putFloat(((pixel shr 8) and 0xFF) / 255.0f)
                inputBuffer.putFloat((pixel and 0xFF) / 255.0f)
            }
            // CRITICAL: Rewind buffer position to 0 before invoking TFLite!
            inputBuffer.rewind()

            // Output shape [1, 4]: [Mild, Moderate, Non-Demented, Very Mild]
            val output = Array(1) { FloatArray(4) }
            synchronized(interpreterLock) {
                getInterpreter().run(inputBuffer, output)
            }

            if (argbBitmap !== resized) argbBitmap.recycle()
            if (resized !== origBitmap) resized.recycle()
            origBitmap.recycle()

            val probs = JSArray()
            output[0].forEach { probs.put(it.toDouble()) }

            val result = JSObject().apply {
                put("probabilities", probs)
            }
            call.resolve(result)
        } catch (e: Exception) {
            call.reject("TFLite inference failed: ${e.message}", e)
        }
    }
}
```

#### Step 4: Register the Plugin & Build APK
In `MainActivity.java` / `MainActivity.kt`, register `DeepCortexTFLitePlugin::class.java` inside `onCreate` before `super.onCreate(savedInstanceState)`:

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    registerPlugin(DeepCortexTFLitePlugin::class.java)
    super.onCreate(savedInstanceState)
}
```

Sync web assets and build in Android Studio:
```bash
npx vite build
npx cap sync android
npx cap open android
```
Once launched on an Android device, the MRI Scan Lab automatically detects the Capacitor bridge and shows **`Android Native TFLite XNNPACK Delegate Active`** + **`Real Xception INT8 TFLite Weights (20.54 MB)`**.

---

## 7. Firebase Authentication & Firestore Setup (Optional Cloud Sync)

The app works **100% locally as a Guest** with zero login required. To enable optional Google/Email account sync:

1. Create a Firebase project and enable **Authentication** (`Google` and `Email/Password` providers).
2. Create a **Cloud Firestore** database in Production mode.
3. Deploy the included owner-scoped security rules (`firestore.rules`):
   ```bash
   firebase deploy --only firestore:rules
   ```
4. Add your deployment domains (`localhost`, your `*.netlify.app` domain, and your Cloud Run / AI Studio URL) under **Firebase Console → Authentication → Settings → Authorized domains**.
5. Populate the `VITE_FIREBASE_*` keys in `.env` (or Netlify / AI Studio environment variables).

---

## 8. Troubleshooting

| Symptom | Root Cause | Resolution |
| :--- | :--- | :--- |
| MRI badge shows `Deterministic ZNCC Reference Calibrator` instead of `Real Xception INT8 TFLite Weights (20.54 MB)` | `public/models/deepcortex.tflite` is empty (0 bytes) or GitHub raw URL returned 404 | Replace `public/models/deepcortex.tflite` with your real 20.54 MB binary and verify `curl -I http://localhost:3000/models/deepcortex.tflite` returns `200` and `content-length > 10000000` |
| `npm install` fails with `ERESOLVE` on local machine | Older lockfile or Node/npm mismatch | Pull latest `package.json` (which pins `esbuild: ^0.28.0` and `overrides` for `@tensorflow/tfjs-tflite`), delete `package-lock.json` if stale, and run `npm install` |
| WebSocket HMR error in hosted preview | Preview proxy disables HMR WebSockets (`DISABLE_HMR=true`) | Safe to ignore in hosted preview; locally on `localhost:3000`, `server.ts` attaches HMR to port 3000 automatically |
| Gemini Cloud narrative or TTS uses offline fallback | `GEMINI_API_KEY` not configured or running static-only host | Add `GEMINI_API_KEY` in `.env` / AI Studio Secrets, or proxy `/api/*` to a deployed `server.ts` instance |

---

## 9. Citation & License

If you reference DeepCortex AI or its quantized 71-layer Xception neuroimaging pipeline in academic or clinical evaluations, please cite:

```bibtex
@software{deepcortex_ai_2026,
  title     = {DeepCortex AI: Longitudinal Cognitive Intelligence and Explainable Edge Neuro-AI for Early Dementia Screening},
  version   = {1.4.2},
  doi       = {10.5281/zenodo.17864829},
  url       = {https://doi.org/10.5281/zenodo.17864829}
}
```

> **Clinical Disclaimer:** DeepCortex AI is a clinical decision-support and early screening tool governed by the DECIDE-AI human-in-the-loop standard. It does **not** issue autonomous medical diagnoses and requires qualified physician verification before clinical action.
