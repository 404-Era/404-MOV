import cv2
import numpy as np
from PIL import Image
import os, time, shutil

def render_high_res_character():
    t0 = time.time()
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    video_path = os.path.join(root_dir, 'media', '1.mp4')
    if not os.path.exists(video_path):
        raise FileNotFoundError(f"Video file not found at {video_path}")

    cap = cv2.VideoCapture(video_path)
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"[Master Render] Source video: {w}x{h}, {total_frames} frames")

    # Sample 120 frames (every 2nd frame) -> 12 fps at 83ms = 10.0s EXACT 1.0x NORMAL SPEED
    frames_raw = []
    for i in range(0, total_frames, 2):
        cap.set(cv2.CAP_PROP_POS_FRAMES, i)
        ret, frame = cap.read()
        if ret:
            frames_raw.append(frame)
    cap.release()

    print(f"[Master Render] Successfully extracted {len(frames_raw)} frames in {time.time()-t0:.2f}s")

    all_masks = []
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11))
    X_norm = np.linspace(0, 1, w)[np.newaxis, :, np.newaxis]

    for frame in frames_raw:
        # 1. Bilinear background lighting modeling:
        # Samples 100px border strips on left/right and linearly interpolates across X.
        # This accurately models non-uniform studio lighting gradients without external AI models.
        left_mean = frame[:, :100].mean(axis=1)
        right_mean = frame[:, -100:].mean(axis=1)
        modeled_bg = left_mean[:, np.newaxis, :] * (1.0 - X_norm) + right_mean[:, np.newaxis, :] * X_norm

        diff = np.abs(frame.astype(np.float32) - modeled_bg)
        diff_norm = np.linalg.norm(diff, axis=2)
        char_mask = (diff_norm > 22).astype(np.uint8) * 255

        # 2. Border-connected background suppression:
        # Finds dark background clusters connected to outer image bounds (y < 240)
        # to ensure external backdrop pixels are strictly zeroed out.
        top_section = frame[:240, :]
        is_bg_dark = (top_section.max(axis=2) <= 68).astype(np.uint8) * 255
        num_l, labels, stats, centroids = cv2.connectedComponentsWithStats(is_bg_dark)
        is_ext_bg = np.zeros((240, w), dtype=bool)
        for lbl in range(1, num_l):
            m = (labels == lbl)
            if m[0, :].any() or m[:, 0].any() or m[:, -1].any():
                is_ext_bg |= m

        char_mask[:240, :][is_ext_bg] = 0
        char_mask[:, :100] = 0
        char_mask[:, 1050:] = 0

        # 3. Morphological gap closure:
        # Fills internal holes inside the character (eye whites, camera screen reticles,
        # and lens reflections) that could otherwise be erroneously keyed out as background.
        char_mask = cv2.morphologyEx(char_mask, cv2.MORPH_CLOSE, kernel)
        char_mask[:240, :][is_ext_bg] = 0

        # 4. Antialiasing & Luminance Falloff Gate:
        # Gaussian filter provides subpixel edge smoothing.
        # Continuous luminance gating eliminates dark slate background above the head
        # without clipping fine hair strand contours.
        smooth_mask = cv2.GaussianBlur(char_mask, (5, 5), 0)
        top_max = top_section.max(axis=2).astype(np.float32)
        top_alpha_factor = np.clip((top_max - 72.0) / 16.0, 0.0, 1.0)
        smooth_mask[:240, :] = (smooth_mask[:240, :].astype(np.float32) * top_alpha_factor).astype(np.uint8)

        all_masks.append(smooth_mask)

    # Union bounding box across all frames
    union_mask = np.maximum.reduce(all_masks)
    y_idx, x_idx = np.where(union_mask > 20)
    ymin, ymax = max(0, y_idx.min() - 2), min(h, y_idx.max() + 2)
    xmin, xmax = max(0, x_idx.min() - 5), min(w, x_idx.max() + 5)
    crop_w = xmax - xmin
    crop_h = ymax - ymin
    print(f"[Master Render] Native HD Crop Bounding Box: x=[{xmin}, {xmax}], y=[{ymin}, {ymax}], Size: {crop_w}x{crop_h}")

    pil_frames = []
    fade_len = int(crop_h * 0.12)
    bottom_fade = np.linspace(1.0, 0.0, fade_len)

    for idx, (frame, mask) in enumerate(zip(frames_raw, all_masks)):
        frame_crop = frame[ymin:ymax, xmin:xmax]
        mask_crop = mask[ymin:ymax, xmin:xmax].copy()

        # 5. Unsharp Masking:
        # Subtracts Gaussian low-pass blur from the base frame to amplify high-frequency detail.
        # This makes anime linework, camera dials, and eye reflections crisp at high display densities.
        blurred = cv2.GaussianBlur(frame_crop, (0, 0), 1.8)
        frame_sharp = cv2.addWeighted(frame_crop, 1.22, blurred, -0.22, 0)

        # 6. Torso Bottom Feathering:
        # 12% vertical linear gradient falloff ensures the lower chest blends smoothly into
        # the dark page background without a hard clipped border line.
        mask_crop[-fade_len:, :] = (mask_crop[-fade_len:, :].astype(np.float32) * bottom_fade[:, np.newaxis]).astype(np.uint8)

        rgba = np.zeros((crop_h, crop_w, 4), dtype=np.uint8)
        rgba[:, :, :3] = cv2.cvtColor(frame_sharp, cv2.COLOR_BGR2RGB)
        rgba[:, :, 3] = mask_crop
        pil_frames.append(Image.fromarray(rgba))

    out_path = os.path.join(root_dir, 'frontend', 'public', 'assets', 'character_isolated.webp')
    print(f"[Master Render] Encoding 120-frame high-resolution WebP at {crop_w}x{crop_h} (quality=90)...")
    pil_frames[0].save(
        out_path,
        format='WEBP',
        save_all=True,
        append_images=pil_frames[1:],
        duration=83, # 12 fps * 83.33ms = 10.0 seconds EXACT 1.0x NORMAL SPEED
        loop=0,
        quality=90,
        method=4
    )

    file_size_mb = os.path.getsize(out_path) / (1024 * 1024)
    print(f"[Master Render] SUCCESS! Output size: {file_size_mb:.2f} MB, Resolution: {crop_w}x{crop_h}, Frames: {len(pil_frames)}, Total Time: {time.time()-t0:.2f}s")

if __name__ == '__main__':
    render_high_res_character()
