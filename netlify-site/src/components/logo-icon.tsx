import { SVGAttributes, useId } from 'react';

/**
 * AscendeNet mark: four rising bars crossed by an upward arrow,
 * with the brand blue → green gradient.
 */
export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    const id = useId();
    const gradient = `${id}-g`;
    const cut = `${id}-m`;

    return (
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <defs>
                <linearGradient id={gradient} x1="4" y1="28" x2="28" y2="4" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#1C5FA8" />
                    <stop offset="0.5" stopColor="#1C8FBC" />
                    <stop offset="1" stopColor="#4CB848" />
                </linearGradient>
                <mask id={cut} maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
                    <rect width="32" height="32" fill="white" />
                    <path d="M3 24.5 L24 13" stroke="black" strokeWidth="4.2" strokeLinecap="round" />
                </mask>
            </defs>
            <g mask={`url(#${cut})`} fill={`url(#${gradient})`}>
                <rect x="11" y="3" width="2.6" height="25" rx="1.3" />
                <rect x="14.8" y="5.5" width="2.6" height="22.5" rx="1.3" />
                <rect x="18.6" y="8" width="2.6" height="20" rx="1.3" />
                <rect x="22.4" y="10.5" width="2.6" height="17.5" rx="1.3" />
            </g>
            <path d="M3.5 24.2 L23 13.6" stroke={`url(#${gradient})`} strokeWidth="2.2" strokeLinecap="round" />
            <path d="M28.6 10.5 L20.6 11.1 L24 17.4 Z" fill="#4CB848" strokeLinejoin="round" />
        </svg>
    );
}
