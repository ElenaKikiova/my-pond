"use client";

import ZipUploader from "@/features/teacher/media-upload/components/ZipUploader";
import { ImportedRound } from "@/features/teacher/media-upload/types/mediaImport.types";
import { parseZip } from "@/features/teacher/media-upload/utils/parseZip";
import { useState } from "react";

export default function CreateGamesPage() {
    const [rounds, setRounds] = useState<ImportedRound[]>([]);

    const onZipUpload = async (file: File) => {
        const result = await parseZip(file);
        setRounds(result);
        console.log(result);
    };

    return <>
        <p>Games Create</p>


        <ZipUploader onUpload={onZipUpload} />
    </>
}