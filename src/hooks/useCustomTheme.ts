import { useCallback, useContext, useEffect } from "react";

import useLocalStorageState from "use-local-storage-state";

import ColorThemeContext from "@/context/colorThemeContext";
import type { Colors } from "@/theme/colors";
import { colors, shadows } from "@/theme/colors";
import { darkColors, darkShadows } from "@/theme/colors/dark";

export interface ThemeMetadata {
    name?: string;
    author?: string;
    description?: string;
    version?: string;
    backgroundImage?: string;
    backgroundOpacity?: number;
    backgroundBlur?: number;
    backgroundPosition?: string;
    backgroundSize?: string;
}

export interface CustomTheme extends ThemeMetadata {
    colors: Partial<Colors>;
}

export type CustomThemeColors = Partial<Colors>;

const STORAGE_KEY = "custom-theme-colors";
const METADATA_KEY = "custom-theme-metadata";

// Keys that are not colors
const METADATA_KEYS = [
    "name",
    "author",
    "description",
    "version",
    "backgroundImage",
    "backgroundOpacity",
    "backgroundBlur",
    "backgroundPosition",
    "backgroundSize",
];

export default function useCustomTheme() {
    const [customColors, setCustomColors] = useLocalStorageState<CustomThemeColors>(STORAGE_KEY, {
        defaultValue: {},
    });

    const [metadata, setMetadata] = useLocalStorageState<ThemeMetadata>(METADATA_KEY, {
        defaultValue: {},
    });

    const { colorTheme } = useContext(ColorThemeContext);

    // Apply or remove custom CSS variables based on theme
    useEffect(() => {
        if (colorTheme === "custom" && Object.keys(customColors).length > 0) {
            for (const [key, value] of Object.entries(customColors)) {
                document.documentElement.style.setProperty(`--${key}`, value);
            }
        } else {
            for (const key of Object.keys(customColors)) {
                document.documentElement.style.removeProperty(`--${key}`);
            }
        }
    }, [colorTheme, customColors]);

    const importTheme = useCallback((file: File): Promise<boolean> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const json = JSON.parse(e.target?.result as string);
                    if (typeof json === "object" && json !== null) {
                        const colorsToImport: CustomThemeColors = {};
                        const metadataToImport: ThemeMetadata = {};

                        for (const [key, value] of Object.entries(json)) {
                            if (METADATA_KEYS.includes(key)) {
                                if (typeof value === "string" || typeof value === "number") {
                                    metadataToImport[key as keyof ThemeMetadata] = value as never;
                                }
                            } else if (typeof value === "string") {
                                colorsToImport[key as keyof Colors] = value;
                            }
                        }

                        setCustomColors(colorsToImport);
                        setMetadata(metadataToImport);
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                } catch {
                    resolve(false);
                }
            };
            reader.readAsText(file);
        });
    }, [setCustomColors, setMetadata]);

    const exportTheme = useCallback(() => {
        const themeWithMetadata = {
            ...metadata,
            ...customColors,
        };
        const blob = new Blob([JSON.stringify(themeWithMetadata, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${metadata.name || "custom-theme"}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }, [customColors, metadata]);

    const exportTemplate = useCallback((template: "light" | "dark") => {
        const templateColors = template === "dark" ? darkColors : colors;
        const templateShadows = template === "dark" ? darkShadows : shadows;

        const cleanedShadows: Record<string, string> = {};
        for (const [key, value] of Object.entries(templateShadows)) {
            cleanedShadows[key] = value.replace(/\s+/g, " ").trim();
        }

        const fullTemplate = {
            name: template,
            author: "AnimeThemes",
            description: "Default theme template.",
            version: "1.0.0",
            backgroundImage: "",
            backgroundOpacity: 0,
            backgroundBlur: 0,
            backgroundPosition: "center",
            backgroundSize: "cover",
            ...templateColors,
            ...cleanedShadows,
        };
        const blob = new Blob([JSON.stringify(fullTemplate, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${template}-theme-template.json`;
        a.click();
        URL.revokeObjectURL(url);
    }, []);

    const clearTheme = useCallback(() => {
        for (const key of Object.keys(customColors)) {
            document.documentElement.style.removeProperty(`--${key}`);
        }
        setCustomColors({});
        setMetadata({});
    }, [customColors, setCustomColors, setMetadata]);

    return {
        customColors,
        setCustomColors,
        metadata,
        setMetadata,
        importTheme,
        exportTheme,
        exportTemplate,
        clearTheme,
    };
}