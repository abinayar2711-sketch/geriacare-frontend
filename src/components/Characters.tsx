type CharProps = {
  size?: number;
  className?: string;
};

const SKIN = "#efc9a5";
const SKIN_SHADE = "#e2b08a";

function AnimeFace() {
  return (
    <g>
      <ellipse cx="160" cy="64" rx="40" ry="43" fill={SKIN} />
      <circle cx="116" cy="64" r="8" fill={SKIN} />
      <circle cx="204" cy="64" r="8" fill={SKIN} />
      <ellipse cx="116" cy="64" rx="4" ry="5" fill={SKIN_SHADE} />
      <ellipse cx="204" cy="64" rx="4" ry="5" fill={SKIN_SHADE} />
      <g stroke="#3a2418" strokeWidth="2.2" strokeLinecap="round" fill="none">
        <path d="M124 52 Q138 46 152 52" />
        <path d="M168 52 Q182 46 196 52" />
      </g>
      <ellipse cx="138" cy="64" rx="9.5" ry="11.5" fill="#2a1a14" />
      <ellipse cx="182" cy="64" rx="9.5" ry="11.5" fill="#2a1a14" />
      <circle cx="134.5" cy="60" r="3" fill="#fff" opacity="0.95" />
      <circle cx="184.5" cy="60" r="3" fill="#fff" opacity="0.95" />
      <circle cx="141" cy="67.5" r="1.7" fill="#fff" opacity="0.65" />
      <circle cx="185" cy="67.5" r="1.7" fill="#fff" opacity="0.65" />
      <ellipse cx="127" cy="77" rx="7.5" ry="4" fill="#e89a7d" opacity="0.4" />
      <ellipse cx="193" cy="77" rx="7.5" ry="4" fill="#e89a7d" opacity="0.4" />
      <path d="M160 82 v5" stroke="#cf9f7a" strokeWidth="2" strokeLinecap="round" />
      <path d="M152 93 Q160 101 168 93" fill="none" stroke="#a15a4a" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M150 104 h20 v18 q-10 6 -20 0 Z" fill={SKIN_SHADE} />
    </g>
  );
}

export function Nurse({ size = 160, className = "" }: CharProps) {
  return (
    <svg
      viewBox="0 0 320 320"
      width={size}
      height={size}
      role="img"
      aria-label="Anime-style female nurse in a white nurse dress"
      className={className}
    >
      <ellipse cx="160" cy="312" rx="60" ry="6" fill="#000" opacity="0.08" />
      <ellipse cx="160" cy="52" rx="54" ry="52" fill="#6b4a3a" />
      <AnimeFace />
      <path d="M106 52 Q100 100 110 128 Q115 140 124 132 Q119 100 122 54 Z" fill="#6b4a3a" />
      <path d="M214 52 Q220 100 210 128 Q205 140 196 132 Q201 100 198 54 Z" fill="#6b4a3a" />
      <path d="M118 46 Q116 16 160 10 Q204 16 202 46 Q194 34 184 42 Q176 30 168 40 Q160 30 152 40 Q144 30 136 42 Q126 34 118 46 Z" fill="#6b4a3a" />
      <path d="M150 18 Q160 4 182 9 Q196 12 198 26 Q186 20 168 20 Q150 22 150 18 Z" fill="#fdfaf6" stroke="#e3dcd2" strokeWidth="2" />
      <g transform="translate(176 18)">
        <path d="M-2 -7 h4 v5 h5 v4 h-5 v7 h-4 v-7 h-5 v-4 h5 Z" fill="#d4917a" />
      </g>
      <path d="M120 130 Q122 116 138 112 L182 112 Q198 116 200 130 L208 198 Q210 218 190 218 L130 218 Q110 218 112 198 Z" fill="#fdfaf6" stroke="#e3dcd2" strokeWidth="2" />
      <path d="M138 115 Q160 124 182 115" fill="none" stroke="#d4917a" strokeWidth="3" strokeLinecap="round" />
      <path d="M122 166 Q160 176 198 166 L196 176 Q160 186 124 176 Z" fill="#7a3b5e" opacity="0.9" />
      <path d="M140 184 q4 8 12 8 q8 0 12 -8" fill="none" stroke="#d4917a" strokeWidth="2.5" opacity="0.7" />
      <path d="M118 132 Q102 158 106 196 Q108 204 116 202 Q116 176 120 160 Q122 146 126 136 Z" fill="#fdfaf6" stroke="#e3dcd2" strokeWidth="2" />
      <circle cx="111" cy="202" r="8" fill={SKIN} />
      <path d="M202 132 Q218 158 214 196 Q212 204 204 202 Q204 176 200 160 Q198 146 194 136 Z" fill="#fdfaf6" stroke="#e3dcd2" strokeWidth="2" />
      <circle cx="209" cy="202" r="8" fill={SKIN} />
      <rect x="142" y="216" width="16" height="72" rx="8" fill="#f4ece0" />
      <rect x="162" y="216" width="16" height="72" rx="8" fill="#f4ece0" />
      <rect x="136" y="288" width="26" height="13" rx="6" fill="#fff" stroke="#e3dcd2" strokeWidth="2" />
      <rect x="158" y="288" width="26" height="13" rx="6" fill="#fff" stroke="#e3dcd2" strokeWidth="2" />
    </svg>
  );
}

export function Doctor({ size = 160, className = "" }: CharProps) {
  return (
    <svg
      viewBox="0 0 320 320"
      width={size}
      height={size}
      role="img"
      aria-label="Anime-style male doctor wearing a stethoscope"
      className={className}
    >
      <ellipse cx="160" cy="312" rx="60" ry="6" fill="#000" opacity="0.08" />
      <ellipse cx="160" cy="46" rx="50" ry="46" fill="#4a342c" />
      <AnimeFace />
      <path d="M116 44 Q114 12 160 8 Q206 12 204 44 Q196 32 188 40 Q180 28 170 38 Q160 28 150 38 Q140 28 132 40 Q124 32 116 44 Z" fill="#4a342c" />
      <path d="M154 108 L166 108 L170 152 L160 170 L150 152 Z" fill="#7a3b5e" />
      <rect x="154" y="112" width="12" height="108" fill="#cfe0ea" />
      <path d="M118 130 Q115 176 120 220 L160 220 L160 130 Q150 126 138 126 Q126 126 118 130 Z" fill="#f7f4ee" stroke="#e2ddd2" strokeWidth="2" />
      <path d="M202 130 Q205 176 200 220 L160 220 L160 130 Q170 126 182 126 Q194 126 202 130 Z" fill="#f7f4ee" stroke="#e2ddd2" strokeWidth="2" />
      <path d="M118 130 L146 128 L140 158 Z" fill="#efe9df" />
      <path d="M202 130 L174 128 L180 158 Z" fill="#efe9df" />
      <path d="M126 176 h24 v16 h-24 Z" fill="#fffefb" stroke="#e2ddd2" strokeWidth="1.5" />
      <path d="M140 120 Q132 152 138 178 L156 190" fill="none" stroke="#d4a853" strokeWidth="4" strokeLinecap="round" />
      <path d="M180 120 Q188 152 182 178 L164 190" fill="none" stroke="#d4a853" strokeWidth="4" strokeLinecap="round" />
      <circle cx="140" cy="119" r="3" fill="#b9bec6" />
      <circle cx="180" cy="119" r="3" fill="#b9bec6" />
      <circle cx="160" cy="192" r="8" fill="#c9ccd1" stroke="#8f949c" strokeWidth="2" />
      <circle cx="160" cy="192" r="3" fill="#d4a853" />
      <path d="M118 132 Q102 162 106 200 Q108 208 116 206 Q116 180 120 162 Q122 146 126 136 Z" fill="#f7f4ee" stroke="#e2ddd2" strokeWidth="2" />
      <circle cx="111" cy="206" r="8" fill={SKIN} />
      <path d="M202 132 Q218 162 214 200 Q212 208 204 206 Q204 180 200 162 Q198 146 194 136 Z" fill="#f7f4ee" stroke="#e2ddd2" strokeWidth="2" />
      <circle cx="209" cy="206" r="8" fill={SKIN} />
      <rect x="142" y="214" width="16" height="74" rx="8" fill="#3f4450" />
      <rect x="162" y="214" width="16" height="74" rx="8" fill="#3f4450" />
      <rect x="136" y="288" width="26" height="13" rx="6" fill="#2e2b28" />
      <rect x="158" y="288" width="26" height="13" rx="6" fill="#2e2b28" />
    </svg>
  );
}

export function Physiotherapist({ size = 160, className = "" }: CharProps) {
  return (
    <svg
      viewBox="0 0 320 320"
      width={size}
      height={size}
      role="img"
      aria-label="Anime-style male physiotherapist"
      className={className}
    >
      <ellipse cx="160" cy="312" rx="60" ry="6" fill="#000" opacity="0.08" />
      <ellipse cx="160" cy="46" rx="50" ry="46" fill="#5b4538" />
      <AnimeFace />
      <path d="M118 44 Q116 14 160 8 Q204 14 202 44 Q192 34 184 40 Q174 28 162 38 Q150 28 140 40 Q128 34 118 44 Z" fill="#5b4538" />
      <path d="M128 128 Q124 170 128 214 L192 214 Q196 170 192 128 Z" fill="#7a9e7e" />
      <path d="M138 118 L152 136 L168 136 L182 118 Q172 126 160 126 Q148 126 138 118 Z" fill="#6d8f70" />
      <path d="M128 132 Q112 154 114 176 Q116 184 124 182 Q124 160 128 148 Q130 140 132 134 Z" fill="#7a9e7e" />
      <circle cx="113" cy="186" r="8" fill={SKIN} />
      <path d="M192 132 Q208 154 206 176 Q204 184 196 182 Q196 160 192 148 Q190 140 188 134 Z" fill="#7a9e7e" />
      <circle cx="207" cy="186" r="8" fill={SKIN} />
      <path d="M150 178 h20 v16 h-20 Z" fill="#6d8f70" stroke="#5f7f62" strokeWidth="1.5" />
      <circle cx="160" cy="186" r="8" fill="#d4a853" stroke="#b98f3f" strokeWidth="1.5" />
      <circle cx="160" cy="186" r="3" fill="#e0bc6a" />
      <path d="M160 178 v-5" stroke="#d4a853" strokeWidth="2" />
      <rect x="142" y="212" width="16" height="72" rx="7" fill="#3b4b57" />
      <rect x="162" y="212" width="16" height="72" rx="7" fill="#3b4b57" />
      <rect x="136" y="286" width="26" height="13" rx="6" fill="#fff" stroke="#7a9e7e" strokeWidth="2" />
      <rect x="158" y="286" width="26" height="13" rx="6" fill="#fff" stroke="#7a9e7e" strokeWidth="2" />
    </svg>
  );
}
