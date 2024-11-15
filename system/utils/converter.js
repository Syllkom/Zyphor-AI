import ff from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import webp from 'node-webpmux';
import { Readable } from 'stream';

ff.setFfmpegPath(ffmpegPath);

async function bufferToWebp(mediaBuffer, isVideo = false) {
    return new Promise((resolve, reject) => {
        const mediaStream = new Readable()
        mediaStream.push(mediaBuffer);
        mediaStream.push(null);
        const outputBuffer = [];
        const ffmpegCommand = ff(mediaStream).on('error', (err) => reject(err)).on('end', () => { resolve(Buffer.concat(outputBuffer)) }).addOutputOptions(['-vcodec', 'libwebp', '-vf', "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse", ...(isVideo ? ['-loop', '0', '-ss', '00:00:00', '-t', '00:00:05', '-preset', 'default', '-an', '-vsync', '0'] : [])]).toFormat('webp');
        ffmpegCommand.pipe().on('data', (chunk) => outputBuffer.push(chunk));
    })
}

async function writeExif(mediaBuffer, metadata, isVideo = false) {
    const webpBuffer = isVideo
        ? await bufferToWebp(mediaBuffer, true)
        : await bufferToWebp(mediaBuffer, false);

    if (metadata.packname || metadata.author) {
        const img = new webp.Image();
        const json = { "sticker-pack-name": metadata.packname, "sticker-pack-publisher": metadata.author, "emojis": metadata.categories ? metadata.categories : [""] };
        const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
        const jsonBuff = Buffer.from(JSON.stringify(json), 'utf-8');
        const exif = Buffer.concat([exifAttr, jsonBuff]);
        exif.writeUIntLE(jsonBuff.length, 14, 4);
        await img.load(webpBuffer);
        img.exif = exif;

        const outputBuffer = await new Promise((resolve, reject) => {
            const outputStream = new Readable();
            outputStream.push(webpBuffer);
            outputStream.push(null);
            const chunks = [];
            outputStream.on('data', chunk => chunks.push(chunk));
            outputStream.on('end', () => resolve(Buffer.concat(chunks)));
            outputStream.on('error', reject);
        });

        return outputBuffer;
    }
    return webpBuffer;
}

const imageWebp = async (media, metadata) => await writeExif(media, metadata, false);
const videoWebp = async (media, metadata) => await writeExif(media, metadata, true);

export { imageWebp, videoWebp }