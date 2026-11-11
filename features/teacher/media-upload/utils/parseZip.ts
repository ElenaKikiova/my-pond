
import JSZip from "jszip";

export interface ImportedItem {
    id: string;
    image: File;
    audio: File;
}

export interface ParseZipResult {
    items: ImportedItem[];
    errors: string[];
}

const IMAGE_TYPES: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
};

const AUDIO_TYPES: Record<string, string> = {
    mp3: "audio/mpeg",
    wav: "audio/wav",
    ogg: "audio/ogg",
    m4a: "audio/mp4",
};

export async function parseZip(file: File): Promise<ParseZipResult> {
    const errors: string[] = [];
    const images = new Map<string, File>();
    const audios = new Map<string, File>();

    try {
        const zip = await JSZip.loadAsync(file);

        for (const [path, entry] of Object.entries(zip.files)) {
            if (entry.dir) continue;

            // Ignore macOS metadata
            if (path.startsWith("__MACOSX/") || path.split("/").pop()?.startsWith("._")) {
                continue;
            }

            const match = path.match(/^([^/]+)\/(\d+)\.([a-z0-9]+)$/i);

            if (!match) {
                errors.push(`Unexpected file: ${path}`);
                continue;
            }

            const [, , id, extension] = match;
            const ext = extension.toLowerCase();

            const isImage = !!IMAGE_TYPES[ext];
            const isAudio = !!AUDIO_TYPES[ext];

            if (!isImage && !isAudio) {
                errors.push(`Unsupported file format: ${path}`);
                continue;
            }

            const mimeType = isImage ? IMAGE_TYPES[ext] : AUDIO_TYPES[ext];
            const target = isImage ? images : audios;


            if (target.has(id)) {
                errors.push(`Duplicate ${isImage ? "image" : "audio"} ID: ${id}`);
                continue;
            }

            const blob = await entry.async("blob");
            const importedFile = new File([blob], `${id}.${ext}`, {
                type: mimeType,
            });

            target.set(id, importedFile);
        }

        // Check that every image has a matching audio and vice versa
        for (const id of images.keys()) {
            if (!audios.has(id)) {
                errors.push(`Missing audio for image ${id}`);
            }
        }

        for (const id of audios.keys()) {
            if (!images.has(id)) {
                errors.push(`Missing image for audio ${id}`);
            }
        }

        const items: ImportedItem[] = [];

        for (const id of images.keys()) {
            const image = images.get(id);
            const audio = audios.get(id);

            if (image && audio) {
                items.push({ id, image, audio });
            }
        }

        items.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

        if (items.length === 0 && errors.length === 0) {
            errors.push("The ZIP archive contains no valid image/audio pairs.");
        }

        return { items, errors };
    } catch {
        return {
            items: [],
            errors: ["Could not read the ZIP archive. Make sure it is a valid ZIP file."],
        };
    }
}
