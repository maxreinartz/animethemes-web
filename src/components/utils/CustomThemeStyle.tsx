import { useContext } from "react";
import { createGlobalStyle } from "styled-components";

import ColorThemeContext from "@/context/colorThemeContext";
import useCustomTheme from "@/hooks/useCustomTheme";

const CustomThemeGlobalStyle = createGlobalStyle<{ $colors: Record<string, string> }>`
    :root[data-theme="custom"] {
        ${(props) =>
            Object.entries(props.$colors)
                .map(([key, value]) => `--${key}: ${value};`)
                .join("\n")}
    }
`;

const BackgroundImageStyle = createGlobalStyle<{
    $backgroundImage: string;
    $backgroundBlur: number;
    $backgroundPosition: string;
    $backgroundSize: string;
    $backgroundOverlay?: string;
}>`
    body::before {
        content: "";
        position: fixed;
        inset: ${(props) => props.$backgroundBlur ? `-${props.$backgroundBlur * 2}px` : 0};
        z-index: -1;
        pointer-events: none;
        
        background-image: ${(props) =>
            props.$backgroundOverlay
                ? `linear-gradient(${props.$backgroundOverlay}, ${props.$backgroundOverlay}), url(${props.$backgroundImage})`
                : `url(${props.$backgroundImage})`};
        background-position: ${(props) => props.$backgroundPosition};
        background-size: ${(props) => props.$backgroundSize};
        background-repeat: no-repeat;
        
        filter: ${(props) => props.$backgroundBlur ? `blur(${props.$backgroundBlur}px)` : "none"};
        clip-path: ${(props) => props.$backgroundBlur // Prevents blur bleeding
            ? `inset(${props.$backgroundBlur * 2}px)` 
            : "none"};
    }
`;

export function CustomThemeStyle() {
    const { colorTheme } = useContext(ColorThemeContext);
    const { customColors, metadata } = useCustomTheme();

    if (colorTheme !== "custom") {
        return null;
    }

    return (
        <>
            {Object.keys(customColors).length > 0 && (
                <CustomThemeGlobalStyle $colors={customColors} />
            )}
            {metadata.backgroundImage && (
                <BackgroundImageStyle
                    $backgroundImage={metadata.backgroundImage}
                    $backgroundBlur={metadata.backgroundBlur ?? 0}
                    $backgroundPosition={metadata.backgroundPosition ?? "center"}
                    $backgroundSize={metadata.backgroundSize ?? "cover"}
                    $backgroundOverlay={metadata.backgroundOverlay}
                />
            )}
        </>
    );
}