from __future__ import annotations

import math
import random
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageOps


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
FRAME_DIR = ROOT / "tmp" / "logo-reveal-frames"
WIDTH = 1920
HEIGHT = 1080
FPS = 24
FRAME_COUNT = FPS * 5


def clamp(value: float, minimum: float = 0.0, maximum: float = 1.0) -> float:
    return max(minimum, min(maximum, value))


def ease(value: float) -> float:
    value = clamp(value)
    return 1.0 - (1.0 - value) ** 3


def smooth(value: float) -> float:
    value = clamp(value)
    return value * value * (3.0 - 2.0 * value)


def between(time: float, start: float, end: float) -> float:
    return clamp((time - start) / (end - start))


def resize_to_height(image: Image.Image, height: int) -> Image.Image:
    width = round(image.width * height / image.height)
    return image.resize((width, height), Image.Resampling.LANCZOS)


def alpha_paste(
    canvas: Image.Image,
    layer: Image.Image,
    xy: tuple[int, int],
    opacity: float = 1.0,
) -> None:
    if opacity <= 0:
        return
    if opacity < 1:
        layer = layer.copy()
        alpha = layer.getchannel("A").point(lambda value: round(value * opacity))
        layer.putalpha(alpha)
    canvas.alpha_composite(layer, xy)


def prepare_logo() -> tuple[Image.Image, Image.Image, Image.Image]:
    source = Image.open(PUBLIC / "images" / "go-brush-logo.png").convert("L")
    ink = ImageOps.invert(source)
    hard_mask = ink.point(lambda value: 255 if value > 36 else 0)
    bbox = hard_mask.getbbox()
    if bbox is None:
        raise RuntimeError("GO logo mask is empty")

    margin = 10
    bbox = (
        max(0, bbox[0] - margin),
        max(0, bbox[1] - margin),
        min(source.width, bbox[2] + margin),
        min(source.height, bbox[3] + margin),
    )
    ink = ink.crop(bbox)
    alpha = ink.point(lambda value: round(255 * smooth((value - 8) / 82)))
    logo = Image.new("RGBA", alpha.size, (0, 0, 0, 0))
    logo.putalpha(alpha)

    target_width = 760
    target_height = round(logo.height * target_width / logo.width)
    logo = logo.resize((target_width, target_height), Image.Resampling.LANCZOS)

    # Build the pre-reveal mark by removing only the O's horizontal brush stroke,
    # preserving the hand-painted circular rim. The removed pixels are restored
    # progressively as the blade travels through the letterform.
    final_alpha = logo.getchannel("A")
    base_alpha = final_alpha.copy()
    edit = ImageDraw.Draw(base_alpha)
    edit.rectangle((405, 126, 635, 205), fill=0)

    ring = Image.new("L", logo.size, 0)
    ring_draw = ImageDraw.Draw(ring)
    ring_draw.ellipse((346, 18, 748, 335), outline=255, width=58)
    ring = ImageChops.multiply(ring, final_alpha)
    base_alpha = ImageChops.lighter(base_alpha, ring)

    base = Image.new("RGBA", logo.size, (0, 0, 0, 0))
    base.putalpha(base_alpha)
    stroke_alpha = ImageChops.subtract(final_alpha, base_alpha)
    stroke = Image.new("RGBA", logo.size, (0, 0, 0, 0))
    stroke.putalpha(stroke_alpha)
    return base, logo, stroke


def reveal_layer(stroke: Image.Image, progress: float) -> Image.Image:
    if progress <= 0:
        return Image.new("RGBA", stroke.size, (0, 0, 0, 0))
    reveal_width = max(1, round(stroke.width * smooth(progress)))
    mask = Image.new("L", stroke.size, 0)
    draw = ImageDraw.Draw(mask)
    draw.rectangle((0, 0, reveal_width, stroke.height), fill=255)
    edge = Image.new("L", stroke.size, 0)
    edge_draw = ImageDraw.Draw(edge)
    edge_draw.rectangle(
        (max(0, reveal_width - 44), 0, min(stroke.width, reveal_width + 18), stroke.height),
        fill=180,
    )
    edge = edge.filter(ImageFilter.GaussianBlur(15))
    mask = ImageChops.lighter(mask, edge)
    result = stroke.copy()
    result.putalpha(ImageChops.multiply(stroke.getchannel("A"), mask))
    return result


def draw_particles(
    canvas: Image.Image,
    time: float,
    logo_position: tuple[int, int],
    particles: list[tuple[float, float, float, float, int]],
) -> None:
    reveal = between(time, 2.55, 3.55)
    fade = 1.0 - between(time, 3.75, 4.75)
    strength = reveal * fade
    if strength <= 0:
        return
    draw = ImageDraw.Draw(canvas, "RGBA")
    left, top = logo_position
    for born, px, py, drift, size in particles:
        life = between(reveal, born, born + 0.34)
        if life <= 0 or life >= 1:
            continue
        x = left + px + drift * ease(life)
        y = top + py - (22 + abs(drift) * 0.12) * ease(life)
        alpha = round(210 * math.sin(math.pi * life) * strength)
        draw.ellipse((x - size, y - size, x + size, y + size), fill=(8, 8, 8, alpha))


def main() -> None:
    FRAME_DIR.mkdir(parents=True, exist_ok=True)
    walk = resize_to_height(
        Image.open(PUBLIC / "images" / "chibi-swordsman-walk.png").convert("RGBA"),
        610,
    )
    thrust = resize_to_height(
        Image.open(PUBLIC / "images" / "chibi-swordsman-thrust.png").convert("RGBA"),
        625,
    )
    exit_pose = resize_to_height(
        ImageOps.mirror(
            Image.open(PUBLIC / "images" / "chibi-swordsman-exit.png").convert("RGBA")
        ),
        580,
    )
    logo_base, logo_final, logo_stroke = prepare_logo()
    logo_position = ((WIDTH - logo_base.width) // 2 - 85, 346)

    random.seed(42)
    particles = [
        (
            0.08 + index * 0.045,
            random.uniform(275, 735),
            random.uniform(125, 205),
            random.uniform(-90, 90),
            random.randint(2, 6),
        )
        for index in range(20)
    ]

    for frame_index in range(FRAME_COUNT):
        time = frame_index / FPS
        scene = Image.new("RGBA", (WIDTH, HEIGHT), (255, 255, 255, 255))
        alpha_paste(scene, logo_base, logo_position)

        walk_in = between(time, 0.18, 1.62)
        walk_out = between(time, 1.5, 2.02)
        walk_opacity = ease(walk_in) * (1.0 - smooth(walk_out))
        if walk_opacity > 0:
            walk_x = round(1910 + (1245 - 1910) * ease(walk_in))
            walk_y = round(405 + math.sin(walk_in * math.pi * 7) * 8)
            alpha_paste(scene, walk, (walk_x, walk_y), walk_opacity)

        pose_in = between(time, 1.58, 2.12)
        pose_out = between(time, 3.32, 3.62)
        pose_opacity = smooth(pose_in) * (1.0 - smooth(pose_out))
        thrust_progress = ease(between(time, 2.48, 3.36))
        thrust_x = round(1150 + (878 - 1150) * thrust_progress)
        thrust_y = 392 + round(math.sin(between(time, 1.58, 2.12) * math.pi) * -10)

        if pose_opacity > 0:
            motion_speed = between(time, 2.48, 3.18) * (1.0 - between(time, 3.18, 3.5))
            if motion_speed > 0.08:
                for offset, trail_opacity in ((32, 0.05), (18, 0.09)):
                    ghost = thrust.filter(ImageFilter.GaussianBlur(2.5))
                    alpha_paste(
                        scene,
                        ghost,
                        (thrust_x + offset, thrust_y),
                        pose_opacity * trail_opacity,
                    )
            alpha_paste(scene, thrust, (thrust_x, thrust_y), pose_opacity)

        stroke_progress = between(time, 2.58, 3.4)
        alpha_paste(scene, reveal_layer(logo_stroke, stroke_progress), logo_position)

        # Dense wet ink gathers around the blade during contact, then resolves
        # into the exact horizontal stroke from the supplied GO artwork.
        ink_strength = math.sin(math.pi * between(time, 2.5, 3.55))
        if ink_strength > 0:
            ink = Image.new("RGBA", scene.size, (0, 0, 0, 0))
            ink_draw = ImageDraw.Draw(ink, "RGBA")
            edge_x = logo_position[0] + round(logo_stroke.width * smooth(stroke_progress))
            center_y = logo_position[1] + 166
            hand_x = thrust_x + round(thrust.width * 0.48)
            ink_draw.line(
                (min(edge_x, hand_x), center_y, hand_x, center_y + 4),
                fill=(0, 0, 0, round(225 * ink_strength)),
                width=18,
            )
            ink = ink.filter(ImageFilter.GaussianBlur(2.2))
            scene = Image.alpha_composite(scene, ink)

        draw_particles(scene, time, logo_position, particles)

        exit_in = between(time, 3.42, 3.76)
        exit_out = between(time, 4.36, 4.92)
        exit_opacity = smooth(exit_in) * (1.0 - smooth(exit_out))
        if exit_opacity > 0:
            exit_progress = ease(between(time, 3.48, 4.9))
            exit_x = round(1225 + (1900 - 1225) * exit_progress)
            exit_y = round(438 + math.sin(exit_progress * math.pi * 6) * 7)
            alpha_paste(scene, exit_pose, (exit_x, exit_y), exit_opacity)

        # Ensure the final resting mark is pixel-for-pixel the supplied artwork.
        final_lock = smooth(between(time, 3.38, 3.72))
        alpha_paste(scene, logo_final, logo_position, final_lock)

        push = 1.0 + 0.055 * ease(time / 5.0)
        pushed = scene.resize(
            (round(WIDTH * push), round(HEIGHT * push)),
            Image.Resampling.LANCZOS,
        )
        crop_x = (pushed.width - WIDTH) // 2
        crop_y = (pushed.height - HEIGHT) // 2
        frame = pushed.crop((crop_x, crop_y, crop_x + WIDTH, crop_y + HEIGHT)).convert("RGB")
        frame.save(FRAME_DIR / f"frame-{frame_index:03d}.jpg", quality=94, subsampling=0)

    print(f"Rendered {FRAME_COUNT} frames to {FRAME_DIR}")


if __name__ == "__main__":
    main()
