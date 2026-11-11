
"use client";

interface ZipUploaderProps {
    onUpload: (file: File) => void;
}

export default function ZipUploader({ onUpload }: ZipUploaderProps) {
    return (
        <input
            type="file"
            accept=".zip,application/zip"
            onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUpload(file);
                e.target.value = "";
            }}
        />
    );
}
