import fs from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const inputDir = process.argv[2]
const outputDir = process.argv[3]

if (!inputDir || !outputDir) {
  throw new Error("Usage: node scripts/build-forecourt-atlas.mjs <frames-dir> <output-dir>")
}

const allFrames = (await fs.readdir(inputDir))
  .filter((name) => /^frame_\d+\.png$/i.test(name))
  .sort((a, b) => Number(a.match(/\d+/)?.[0]) - Number(b.match(/\d+/)?.[0]))

if (allFrames.length < 60) throw new Error(`Expected at least 60 frames, found ${allFrames.length}`)

const frameCount = 60
const columns = 5
const rows = 4
const framesPerAtlas = columns * rows
const cellWidth = 640
const cellHeight = 360
const selectedFrames = Array.from({ length: frameCount }, (_, index) =>
  allFrames[Math.round((index * (allFrames.length - 1)) / (frameCount - 1))],
)

await fs.mkdir(outputDir, { recursive: true })

for (let atlasIndex = 0; atlasIndex < frameCount / framesPerAtlas; atlasIndex += 1) {
  const composites = []
  for (let slot = 0; slot < framesPerAtlas; slot += 1) {
    const frameName = selectedFrames[atlasIndex * framesPerAtlas + slot]
    const input = path.join(inputDir, frameName)
    const buffer = await sharp(input)
      .resize(cellWidth, cellHeight, { fit: "cover", position: "centre" })
      .jpeg({ quality: 88, chromaSubsampling: "4:4:4" })
      .toBuffer()

    composites.push({
      input: buffer,
      left: (slot % columns) * cellWidth,
      top: Math.floor(slot / columns) * cellHeight,
    })
  }

  await sharp({
    create: {
      width: columns * cellWidth,
      height: rows * cellHeight,
      channels: 3,
      background: "#080503",
    },
  })
    .composite(composites)
    .webp({ quality: 76, smartSubsample: true })
    .toFile(path.join(outputDir, `forecourt-atlas-${atlasIndex + 1}.webp`))
}

await fs.writeFile(
  path.join(outputDir, "manifest.json"),
  JSON.stringify(
    {
      frameCount,
      columns,
      rows,
      framesPerAtlas,
      cellWidth,
      cellHeight,
      selectedFrames,
    },
    null,
    2,
  ),
)

console.log(`Built ${frameCount} interactive frames across ${frameCount / framesPerAtlas} atlases.`)
