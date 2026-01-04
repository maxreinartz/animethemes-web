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
    $backgroundOpacity: number;
    $backgroundBlur: number;
    $backgroundPosition: string;
    $backgroundSize: string;
}>`
    body::before {
        content: "";
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: -1;
        pointer-events: none;
        
        background-image: url(${(props) => props.$backgroundImage});
        background-position: ${(props) => props.$backgroundPosition};
        background-size: ${(props) => props.$backgroundSize};
        background-repeat: no-repeat;
        background-attachment: fixed;
        
        opacity: ${(props) => props.$backgroundOpacity};
        filter: blur(${(props) => props.$backgroundBlur}px);
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
                    $backgroundOpacity={metadata.backgroundOpacity ?? 0.15}
                    $backgroundBlur={metadata.backgroundBlur ?? 0}
                    $backgroundPosition={metadata.backgroundPosition ?? "center"}
                    $backgroundSize={metadata.backgroundSize ?? "cover"}
                />
            )}
        </>
    );
}