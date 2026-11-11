export interface ImportedItem {
    id: string;
    image: File;
    imageUrl: string;
    audio: File;
    audioUrl: string;
}

export interface MediaImportResult {
    items: ImportedItem[];
    errors: string[];
}