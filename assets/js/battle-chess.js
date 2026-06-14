/**
 * Battle Chess — Nostalgic 1988 Mac OS recreation as WordPress plugin
 * Full chess engine, animated SVG piece characters, minimax AI, battle sequences
 */
window.BattleChess = (function () {
	'use strict';

	/* ================================================================
	   CONSTANTS
	================================================================ */
	const EMPTY = 0, PAWN = 1, ROOK = 2, KNIGHT = 3, BISHOP = 4, QUEEN = 5, KING = 6;
	const W = 'w', B = 'b';

	const PIECE_NAME  = { 1:'Pawn', 2:'Rook', 3:'Knight', 4:'Bishop', 5:'Queen', 6:'King' };
	const PIECE_VALUE = { 1:100,   2:500,   3:320,     4:330,     5:900,   6:20000 };

	// Unicode fallback symbols
	const UNICODE = {
		w: { 1:'♙', 2:'♖', 3:'♘', 4:'♗', 5:'♕', 6:'♔' },
		b: { 1:'♟', 2:'♜', 3:'♞', 4:'♝', 5:'♛', 6:'♚' }
	};

	/* ================================================================
	   SVG SPRITE LIBRARY — all 12 piece types
	================================================================ */
	const Sprites = {
		get(type, color) {
			const w = color === W;
			// Color palettes
			const body    = w ? '#e8d8a0' : '#1a0800';
			const armor   = w ? '#d0c080' : '#2a1400';
			const dark    = w ? '#806020' : '#c05000';
			const outline = '#000000';
			const eye     = w ? '#222222' : '#ff2200';
			const steel   = w ? '#c8c8d8' : '#484858';
			const gold    = w ? '#e8b800' : '#8b0000';
			const red     = w ? '#cc2222' : '#ff4400';
			const glow    = w ? 'rgba(255,230,100,0.3)' : 'rgba(255,60,0,0.3)';

			switch (type) {
				case PAWN:   return Sprites.pawn  (w, body, armor, dark, outline, eye, steel, gold, red);
				case ROOK:   return Sprites.rook  (w, body, armor, dark, outline, eye, steel, gold, red);
				case KNIGHT: return Sprites.knight(w, body, armor, dark, outline, eye, steel, gold, red);
				case BISHOP: return Sprites.bishop(w, body, armor, dark, outline, eye, steel, gold, red);
				case QUEEN:  return Sprites.queen (w, body, armor, dark, outline, eye, steel, gold, red);
				case KING:   return Sprites.king  (w, body, armor, dark, outline, eye, steel, gold, red);
				default: return '';
			}
		},

		pawn(w, body, armor, dark, o, eye, steel, gold, red) {
			const helmetTop = w ? '#d8c890' : '#0a0400';
			const shieldCol = w ? '#c89830' : '#8b2000';
			return `<svg viewBox="0 0 44 62" xmlns="http://www.w3.org/2000/svg">
  <!-- Shadow -->
  <ellipse cx="22" cy="61" rx="14" ry="3" fill="rgba(0,0,0,0.3)"/>
  <!-- Helm -->
  <ellipse cx="22" cy="14" rx="12" ry="11" fill="${helmetTop}" stroke="${o}" stroke-width="1.2"/>
  <!-- Visor bar -->
  <rect x="14" y="15" width="16" height="6" rx="1" fill="${dark}" stroke="${o}" stroke-width="1"/>
  <!-- Eye slit -->
  <rect x="17" y="17" width="10" height="2.5" rx="1.2" fill="${eye}" opacity="0.9"/>
  <!-- Cheek guards -->
  <rect x="10" y="18" width="5" height="7" rx="1" fill="${helmetTop}" stroke="${o}" stroke-width="1"/>
  <rect x="29" y="18" width="5" height="7" rx="1" fill="${helmetTop}" stroke="${o}" stroke-width="1"/>
  <!-- Neck gorget -->
  <rect x="18" y="25" width="8" height="5" rx="1" fill="${armor}" stroke="${o}" stroke-width="1"/>
  <!-- Breastplate -->
  <path d="M11 30 Q22 27 33 30 L33 50 Q22 53 11 50Z" fill="${body}" stroke="${o}" stroke-width="1.2"/>
  <!-- Breastplate ridge -->
  <line x1="22" y1="30" x2="22" y2="50" stroke="${dark}" stroke-width="1.5"/>
  <!-- Shoulder pauldrons -->
  <ellipse cx="9" cy="33" rx="7" ry="5" fill="${armor}" stroke="${o}" stroke-width="1"/>
  <ellipse cx="35" cy="33" rx="7" ry="5" fill="${armor}" stroke="${o}" stroke-width="1"/>
  <!-- Shield (left) -->
  <path d="M1 31 L10 31 L11 46 L5.5 51 L0 46Z" fill="${shieldCol}" stroke="${o}" stroke-width="1.2"/>
  <line x1="5.5" y1="33" x2="5.5" y2="48" stroke="${w?'#fffae8':'#ff6600'}" stroke-width="1.5"/>
  <line x1="1" y1="40" x2="10" y2="40" stroke="${w?'#fffae8':'#ff6600'}" stroke-width="1.5"/>
  <!-- Sword arm (right) -->
  <rect x="33" y="30" width="6" height="12" rx="2" fill="${body}" stroke="${o}" stroke-width="1"/>
  <!-- Sword -->
  <rect x="36" y="10" width="2.5" height="22" rx="1" fill="${steel}" stroke="${o}" stroke-width="0.8"/>
  <!-- Cross guard -->
  <rect x="31" y="26" width="12" height="2.5" rx="1" fill="${dark}" stroke="${o}" stroke-width="0.8"/>
  <!-- Pommel -->
  <ellipse cx="37.5" cy="11" rx="3.5" ry="3" fill="${gold}" stroke="${o}" stroke-width="0.8"/>
  <!-- Legs -->
  <rect x="12" y="50" width="9" height="11" rx="2" fill="${armor}" stroke="${o}" stroke-width="1"/>
  <rect x="23" y="50" width="9" height="11" rx="2" fill="${armor}" stroke="${o}" stroke-width="1"/>
  <!-- Boots -->
  <ellipse cx="16.5" cy="61" rx="7" ry="3.5" fill="${dark}" stroke="${o}" stroke-width="1"/>
  <ellipse cx="27.5" cy="61" rx="7" ry="3.5" fill="${dark}" stroke="${o}" stroke-width="1"/>
</svg>`;
		},

		rook(w, body, armor, dark, o, eye, steel, gold, red) {
			const stone  = w ? '#c8c0a0' : '#1a0e04';
			const sLight = w ? '#ddd8c0' : '#2a1a08';
			const sDark  = w ? '#a89870' : '#0a0600';
			return `<svg viewBox="0 0 56 68" xmlns="http://www.w3.org/2000/svg">
  <!-- Shadow -->
  <ellipse cx="28" cy="67" rx="22" ry="4" fill="rgba(0,0,0,0.35)"/>
  <!-- Battlements -->
  <rect x="4"  y="4"  width="12" height="14" rx="1" fill="${stone}" stroke="${o}" stroke-width="1.2"/>
  <rect x="22" y="4"  width="12" height="14" rx="1" fill="${stone}" stroke="${o}" stroke-width="1.2"/>
  <rect x="40" y="4"  width="12" height="14" rx="1" fill="${stone}" stroke="${o}" stroke-width="1.2"/>
  <!-- Battlement arrow slits -->
  <rect x="9"  y="7"  width="2" height="6" fill="${sDark}"/>
  <rect x="27" y="7"  width="2" height="6" fill="${sDark}"/>
  <rect x="45" y="7"  width="2" height="6" fill="${sDark}"/>
  <!-- Tower top platform -->
  <rect x="2" y="18" width="52" height="7" rx="1" fill="${sDark}" stroke="${o}" stroke-width="1.2"/>
  <!-- Face / head block -->
  <rect x="8" y="25" width="40" height="18" rx="2" fill="${stone}" stroke="${o}" stroke-width="1.5"/>
  <!-- Eye sockets -->
  <circle cx="20" cy="33" r="6" fill="${sDark}" stroke="${o}" stroke-width="1"/>
  <circle cx="36" cy="33" r="6" fill="${sDark}" stroke="${o}" stroke-width="1"/>
  <!-- Pupils (glowing) -->
  <circle cx="21" cy="32" r="3.5" fill="${eye}"/>
  <circle cx="37" cy="32" r="3.5" fill="${eye}"/>
  <circle cx="22" cy="31" r="1.5" fill="${w?'#ffeecc':'#ff8800'}"/>
  <circle cx="38" cy="31" r="1.5" fill="${w?'#ffeecc':'#ff8800'}"/>
  <!-- Mouth grill -->
  <rect x="17" y="39" width="22" height="4" rx="1" fill="${sDark}" stroke="${o}" stroke-width="0.8"/>
  <line x1="22" y1="39" x2="22" y2="43" stroke="${stone}" stroke-width="1"/>
  <line x1="28" y1="39" x2="28" y2="43" stroke="${stone}" stroke-width="1"/>
  <line x1="34" y1="39" x2="34" y2="43" stroke="${stone}" stroke-width="1"/>
  <!-- Body -->
  <rect x="4" y="43" width="48" height="20" rx="2" fill="${stone}" stroke="${o}" stroke-width="1.5"/>
  <!-- Body texture lines (stone blocks) -->
  <line x1="4" y1="53" x2="52" y2="53" stroke="${sDark}" stroke-width="1"/>
  <line x1="18" y1="43" x2="18" y2="63" stroke="${sDark}" stroke-width="1"/>
  <line x1="38" y1="43" x2="38" y2="63" stroke="${sDark}" stroke-width="1"/>
  <!-- Arms (huge fists) -->
  <rect x="-4" y="44" width="10" height="16" rx="2" fill="${stone}" stroke="${o}" stroke-width="1.2"/>
  <rect x="50" y="44" width="10" height="16" rx="2" fill="${stone}" stroke="${o}" stroke-width="1.2"/>
  <!-- Fists -->
  <ellipse cx="1" cy="62" rx="7" ry="5" fill="${sDark}" stroke="${o}" stroke-width="1.2"/>
  <ellipse cx="55" cy="62" rx="7" ry="5" fill="${sDark}" stroke="${o}" stroke-width="1.2"/>
  <!-- Knuckle lines -->
  <line x1="-3" y1="60" x2="5" y2="60" stroke="${stone}" stroke-width="1"/>
  <line x1="51" y1="60" x2="59" y2="60" stroke="${stone}" stroke-width="1"/>
  <!-- Base -->
  <rect x="0" y="63" width="56" height="5" rx="2" fill="${sDark}" stroke="${o}" stroke-width="1.2"/>
</svg>`;
		},

		knight(w, body, armor, dark, o, eye, steel, gold, red) {
			const plume   = w ? '#cc2222' : '#cc0000';
			const helC    = w ? '#c8c0a0' : '#100800';
			const armorC  = w ? '#c0b880' : '#1a1000';
			return `<svg viewBox="0 0 52 68" xmlns="http://www.w3.org/2000/svg">
  <!-- Shadow -->
  <ellipse cx="26" cy="67" rx="18" ry="3" fill="rgba(0,0,0,0.3)"/>
  <!-- Plume/crest -->
  <path d="M26 4 C20 4 14 8 16 14 C18 10 22 8 26 9 C30 8 34 10 36 14 C38 8 32 4 26 4Z" fill="${plume}" stroke="${o}" stroke-width="0.8"/>
  <!-- Helm shell -->
  <ellipse cx="26" cy="20" rx="15" ry="14" fill="${helC}" stroke="${o}" stroke-width="1.5"/>
  <!-- Visor plate -->
  <rect x="14" y="18" width="24" height="9" rx="2" fill="${armorC}" stroke="${o}" stroke-width="1"/>
  <!-- Eye slit -->
  <rect x="17" y="20" width="18" height="3.5" rx="1.5" fill="${eye}" opacity="0.9"/>
  <!-- Nose guard -->
  <rect x="23" y="21" width="6" height="12" rx="2" fill="${armorC}" stroke="${o}" stroke-width="0.8"/>
  <!-- Helm side guards -->
  <ellipse cx="11" cy="24" rx="5" ry="7" fill="${helC}" stroke="${o}" stroke-width="1"/>
  <ellipse cx="41" cy="24" rx="5" ry="7" fill="${helC}" stroke="${o}" stroke-width="1"/>
  <!-- Neck gorget -->
  <rect x="19" y="34" width="14" height="6" rx="1" fill="${armorC}" stroke="${o}" stroke-width="1"/>
  <!-- Pauldrons -->
  <ellipse cx="8"  cy="43" rx="10" ry="7" fill="${armorC}" stroke="${o}" stroke-width="1.2"/>
  <ellipse cx="44" cy="43" rx="10" ry="7" fill="${armorC}" stroke="${o}" stroke-width="1.2"/>
  <!-- Breastplate -->
  <path d="M10 42 Q26 38 42 42 L40 60 Q26 64 12 60Z" fill="${helC}" stroke="${o}" stroke-width="1.5"/>
  <line x1="26" y1="42" x2="26" y2="60" stroke="${armorC}" stroke-width="2"/>
  <!-- Shield (left arm) -->
  <path d="M-1 42 L12 42 L13 59 L6 64 L-1 59Z" fill="${gold}" stroke="${o}" stroke-width="1.5"/>
  <line x1="6" y1="45" x2="6" y2="61" stroke="${w?'#fff8e0':'#ff6600'}" stroke-width="2"/>
  <line x1="0" y1="52" x2="12" y2="52" stroke="${w?'#fff8e0':'#ff6600'}" stroke-width="2"/>
  <!-- Right arm / sword raised high -->
  <rect x="40" y="38" width="8" height="14" rx="2" fill="${helC}" stroke="${o}" stroke-width="1"/>
  <!-- Sword blade -->
  <rect x="44" y="4" width="3" height="36" rx="1.5" fill="${steel}" stroke="${o}" stroke-width="0.8"/>
  <!-- Cross guard -->
  <rect x="38" y="34" width="16" height="3" rx="1.5" fill="${dark}" stroke="${o}" stroke-width="1"/>
  <!-- Pommel -->
  <ellipse cx="45.5" cy="6" rx="4" ry="4" fill="${gold}" stroke="${o}" stroke-width="0.8"/>
  <!-- Legs -->
  <rect x="13" y="60" width="10" height="8" rx="2" fill="${armorC}" stroke="${o}" stroke-width="1"/>
  <rect x="29" y="60" width="10" height="8" rx="2" fill="${armorC}" stroke="${o}" stroke-width="1"/>
</svg>`;
		},

		bishop(w, body, armor, dark, o, eye, steel, gold, red) {
			const robeC   = w ? '#c8d0f0' : '#0a0a20';
			const robeAcc = w ? '#8090d0' : '#1a1a40';
			const orbC    = w ? '#4488ff' : '#ff0044';
			const skin    = w ? '#e8c8a0' : '#c08040';
			return `<svg viewBox="0 0 50 74" xmlns="http://www.w3.org/2000/svg">
  <!-- Shadow -->
  <ellipse cx="25" cy="73" rx="18" ry="3" fill="rgba(0,0,0,0.3)"/>
  <!-- Mitre hat top -->
  <polygon points="25,2 13,26 37,26" fill="${w?'#fffae8':'#1a001a'}" stroke="${o}" stroke-width="1.5"/>
  <!-- Mitre cross decoration -->
  <line x1="25" y1="6" x2="25" y2="22" stroke="${gold}" stroke-width="2"/>
  <line x1="18" y1="14" x2="32" y2="14" stroke="${gold}" stroke-width="2"/>
  <!-- Mitre band -->
  <rect x="12" y="25" width="26" height="5" rx="1" fill="${gold}" stroke="${o}" stroke-width="1"/>
  <!-- Gem on mitre -->
  <circle cx="25" cy="27" r="3" fill="${orbC}" stroke="${o}" stroke-width="0.8"/>
  <!-- Face -->
  <ellipse cx="25" cy="37" rx="11" ry="10" fill="${skin}" stroke="${o}" stroke-width="1.2"/>
  <!-- Eyes -->
  <circle cx="20" cy="36" r="2.5" fill="${eye}"/>
  <circle cx="30" cy="36" r="2.5" fill="${eye}"/>
  <circle cx="21" cy="35" r="1" fill="${w?'#ffffff':'#ffaa00'}"/>
  <circle cx="31" cy="35" r="1" fill="${w?'#ffffff':'#ffaa00'}"/>
  <!-- Eyebrows (stern expression) -->
  <path d="M17 33 L23 34" stroke="${o}" stroke-width="1.2"/>
  <path d="M27 34 L33 33" stroke="${o}" stroke-width="1.2"/>
  <!-- Beard -->
  <path d="M17 42 Q25 48 33 42 Q29 50 25 51 Q21 50 17 42Z" fill="${w?'#d0c8b0':'#3a2a2a'}" stroke="${o}" stroke-width="0.8"/>
  <!-- Collar/stole -->
  <path d="M16 48 L34 48 L36 54 Q25 56 14 54Z" fill="${gold}" stroke="${o}" stroke-width="1"/>
  <!-- Robe body -->
  <path d="M10 54 Q25 50 40 54 L44 72 Q25 75 6 72Z" fill="${robeC}" stroke="${o}" stroke-width="1.5"/>
  <!-- Robe vertical stripe -->
  <line x1="25" y1="54" x2="25" y2="73" stroke="${robeAcc}" stroke-width="2"/>
  <!-- Robe cross decoration -->
  <line x1="18" y1="60" x2="32" y2="60" stroke="${robeAcc}" stroke-width="1.5"/>
  <!-- Star ornament -->
  <text x="20" y="68" font-size="8" fill="${robeAcc}">✦</text>
  <!-- Sleeves -->
  <ellipse cx="8"  cy="61" rx="7" ry="9" fill="${robeC}" stroke="${o}" stroke-width="1"/>
  <ellipse cx="42" cy="61" rx="7" ry="9" fill="${robeC}" stroke="${o}" stroke-width="1"/>
  <!-- Hands -->
  <circle cx="6"  cy="68" r="4" fill="${skin}" stroke="${o}" stroke-width="1"/>
  <circle cx="44" cy="68" r="4" fill="${skin}" stroke="${o}" stroke-width="1"/>
  <!-- Staff -->
  <rect x="46" y="14" width="3" height="56" rx="1.5" fill="${w?'#9a7030':'#3a1a00'}" stroke="${o}" stroke-width="0.8"/>
  <!-- Orb on staff -->
  <circle cx="47.5" cy="12" r="7" fill="${orbC}" stroke="${o}" stroke-width="1"/>
  <circle cx="49" cy="9" r="3" fill="${w?'#88aaff':'#ff4488'}"/>
  <!-- Orb glow lines -->
  <line x1="44" y1="12" x2="51" y2="12" stroke="${w?'#ccddff':'#ff88aa'}" stroke-width="0.8" opacity="0.7"/>
  <line x1="47.5" y1="6" x2="47.5" y2="18" stroke="${w?'#ccddff':'#ff88aa'}" stroke-width="0.8" opacity="0.7"/>
</svg>`;
		},

		queen(w, body, armor, dark, o, eye, steel, gold, red) {
			const gownC   = w ? '#d0a8e0' : '#1a001a';
			const gownAcc = w ? '#9060b8' : '#3a0038';
			const crownC  = w ? '#ffcc00' : '#aa0000';
			const skin    = w ? '#e8c8a0' : '#c08040';
			const gemR    = w ? '#ff2244' : '#ff6600';
			const gemB    = w ? '#2244ff' : '#44ffff';
			const gemG    = w ? '#22aa44' : '#aaff44';
			return `<svg viewBox="0 0 56 74" xmlns="http://www.w3.org/2000/svg">
  <!-- Shadow -->
  <ellipse cx="28" cy="73" rx="20" ry="3.5" fill="rgba(0,0,0,0.3)"/>
  <!-- Crown spires -->
  <polygon points="10,22 15,8  20,22" fill="${crownC}" stroke="${o}" stroke-width="1"/>
  <polygon points="24,22 28,6  32,22" fill="${crownC}" stroke="${o}" stroke-width="1"/>
  <polygon points="36,22 41,8  46,22" fill="${crownC}" stroke="${o}" stroke-width="1"/>
  <!-- Crown gems -->
  <circle cx="15" cy="11" r="3" fill="${gemR}" stroke="${o}" stroke-width="0.8"/>
  <circle cx="28" cy="9"  r="3.5" fill="${gemB}" stroke="${o}" stroke-width="0.8"/>
  <circle cx="41" cy="11" r="3" fill="${gemG}" stroke="${o}" stroke-width="0.8"/>
  <!-- Crown band -->
  <rect x="8" y="22" width="40" height="6" rx="1" fill="${crownC}" stroke="${o}" stroke-width="1.2"/>
  <!-- Face -->
  <ellipse cx="28" cy="37" rx="12" ry="11" fill="${skin}" stroke="${o}" stroke-width="1.2"/>
  <!-- Eyes -->
  <ellipse cx="22" cy="36" rx="3.5" ry="2.5" fill="${eye}"/>
  <ellipse cx="34" cy="36" rx="3.5" ry="2.5" fill="${eye}"/>
  <!-- Eyelid shine -->
  <ellipse cx="23" cy="35" rx="1.5" ry="1" fill="rgba(255,255,255,0.7)"/>
  <ellipse cx="35" cy="35" rx="1.5" ry="1" fill="rgba(255,255,255,0.7)"/>
  <!-- Smile -->
  <path d="M22 43 Q28 47 34 43" stroke="${o}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <!-- Cheeks -->
  <circle cx="19" cy="41" r="4" fill="${red}" opacity="0.2"/>
  <circle cx="37" cy="41" r="4" fill="${red}" opacity="0.2"/>
  <!-- Necklace -->
  <path d="M18 49 Q28 54 38 49" stroke="${crownC}" stroke-width="2.5" fill="none"/>
  <!-- Necklace gems -->
  <circle cx="28" cy="52" r="3" fill="${gemR}" stroke="${o}" stroke-width="0.8"/>
  <!-- Gown upper / bodice -->
  <path d="M14 50 Q28 47 42 50 L40 62 Q28 65 16 62Z" fill="${gownC}" stroke="${o}" stroke-width="1.2"/>
  <!-- Belt -->
  <rect x="16" y="61" width="24" height="4" rx="1" fill="${crownC}" stroke="${o}" stroke-width="1"/>
  <!-- Gown skirt (wide) -->
  <path d="M8 65 Q28 62 48 65 L52 73 Q28 76 4 73Z" fill="${gownC}" stroke="${o}" stroke-width="1.5"/>
  <!-- Gown decorations -->
  <line x1="28" y1="65" x2="28" y2="73" stroke="${gownAcc}" stroke-width="1.5"/>
  <text x="18" y="72" font-size="8" fill="${gownAcc}">★</text>
  <text x="30" y="72" font-size="8" fill="${gownAcc}">★</text>
  <!-- Sleeves -->
  <ellipse cx="11" cy="57" rx="7" ry="10" fill="${gownC}" stroke="${o}" stroke-width="1"/>
  <ellipse cx="45" cy="57" rx="7" ry="10" fill="${gownC}" stroke="${o}" stroke-width="1"/>
  <!-- Hands -->
  <circle cx="8"  cy="65" r="4.5" fill="${skin}" stroke="${o}" stroke-width="1"/>
  <circle cx="48" cy="65" r="4.5" fill="${skin}" stroke="${o}" stroke-width="1"/>
  <!-- Sceptre in right hand -->
  <rect x="50" y="22" width="3" height="44" rx="1.5" fill="${w?'#9a7030':'#3a1000'}" stroke="${o}" stroke-width="0.8"/>
  <!-- Star on sceptre -->
  <text x="45" y="24" font-size="14" fill="${crownC}" stroke="${o}" stroke-width="0.5">★</text>
  <!-- Orb on sceptre -->
  <circle cx="51.5" cy="27" r="5" fill="${gemB}" stroke="${o}" stroke-width="1"/>
  <circle cx="53" cy="24" r="2" fill="${w?'#88aaff':'#ffaa44'}"/>
</svg>`;
		},

		king(w, body, armor, dark, o, eye, steel, gold, red) {
			const helC  = w ? '#c8c0a0' : '#0e0800';
			const armC  = w ? '#b8b090' : '#181008';
			const crwnC = w ? '#ffcc00' : '#990000';
			const skin  = w ? '#e8c8a0' : '#c08040';
			const capC  = w ? '#8822aa' : '#220033';
			return `<svg viewBox="0 0 58 72" xmlns="http://www.w3.org/2000/svg">
  <!-- Shadow -->
  <ellipse cx="29" cy="71" rx="22" ry="3.5" fill="rgba(0,0,0,0.3)"/>
  <!-- Crown band -->
  <rect x="12" y="19" width="30" height="6" rx="1" fill="${crwnC}" stroke="${o}" stroke-width="1"/>
  <!-- Crown spires (incl cross center) -->
  <rect x="16" y="12" width="6" height="9" rx="1" fill="${crwnC}" stroke="${o}" stroke-width="1"/>
  <rect x="26" y="8"  width="6" height="13" rx="1" fill="${crwnC}" stroke="${o}" stroke-width="1"/>
  <rect x="32" y="8"  width="6" height="13" rx="1" fill="${crwnC}" stroke="${o}" stroke-width="0.5" opacity="0"/>
  <rect x="36" y="12" width="6" height="9" rx="1" fill="${crwnC}" stroke="${o}" stroke-width="1"/>
  <!-- Cross on center spire -->
  <rect x="27.5" y="4" width="3" height="10" rx="1" fill="${crwnC}" stroke="${o}" stroke-width="0.8"/>
  <rect x="24"   y="8" width="10" height="3" rx="1" fill="${crwnC}" stroke="${o}" stroke-width="0.8"/>
  <!-- Crown gems -->
  <circle cx="19" cy="17" r="2.5" fill="${w?'#ff2244':'#ff6600'}" stroke="${o}" stroke-width="0.8"/>
  <circle cx="29" cy="14" r="3"   fill="${w?'#2244ff':'#ff0000'}" stroke="${o}" stroke-width="0.8"/>
  <circle cx="39" cy="17" r="2.5" fill="${w?'#22aa44':'#ff4400'}" stroke="${o}" stroke-width="0.8"/>
  <!-- Great helm -->
  <ellipse cx="29" cy="30" rx="15" ry="12" fill="${helC}" stroke="${o}" stroke-width="1.5"/>
  <!-- Visor -->
  <rect x="17" y="27" width="24" height="9" rx="2" fill="${armC}" stroke="${o}" stroke-width="1"/>
  <!-- Eye slot -->
  <rect x="20" y="29" width="18" height="4" rx="2" fill="${eye}" opacity="0.9"/>
  <!-- Chin guard -->
  <rect x="19" y="36" width="20" height="6" rx="2" fill="${helC}" stroke="${o}" stroke-width="1"/>
  <!-- Cape -->
  <path d="M14 43 Q4 50 6 62 L10 62 Q10 54 16 50Z" fill="${capC}" stroke="${o}" stroke-width="1"/>
  <path d="M44 43 Q54 50 52 62 L48 62 Q48 54 42 50Z" fill="${capC}" stroke="${o}" stroke-width="1"/>
  <!-- Pauldrons -->
  <ellipse cx="11" cy="46" rx="11" ry="8" fill="${armC}" stroke="${o}" stroke-width="1.2"/>
  <ellipse cx="47" cy="46" rx="11" ry="8" fill="${armC}" stroke="${o}" stroke-width="1.2"/>
  <!-- Body armor -->
  <rect x="13" y="46" width="32" height="22" rx="2" fill="${helC}" stroke="${o}" stroke-width="1.5"/>
  <!-- Armor chest ridge -->
  <line x1="29" y1="46" x2="29" y2="68" stroke="${armC}" stroke-width="2.5"/>
  <!-- Armor horizontal bands -->
  <line x1="13" y1="54" x2="45" y2="54" stroke="${armC}" stroke-width="1.5"/>
  <line x1="13" y1="61" x2="45" y2="61" stroke="${armC}" stroke-width="1.5"/>
  <!-- Shield (left arm) -->
  <path d="M0 44 L14 44 L15 63 L7 68 L-1 63Z" fill="${crwnC}" stroke="${o}" stroke-width="1.5"/>
  <!-- Shield cross -->
  <line x1="7" y1="47" x2="7" y2="64" stroke="${w?'#fff8e0':'#ff6600'}" stroke-width="2.5"/>
  <line x1="0" y1="56" x2="14" y2="56" stroke="${w?'#fff8e0':'#ff6600'}" stroke-width="2.5"/>
  <!-- Right arm -->
  <rect x="45" y="44" width="9" height="14" rx="2" fill="${helC}" stroke="${o}" stroke-width="1"/>
  <!-- Great sword -->
  <rect x="52" y="4"  width="4"  height="42" rx="2" fill="${steel}" stroke="${o}" stroke-width="0.8"/>
  <!-- Crossguard -->
  <rect x="45" y="40" width="18" height="4" rx="2" fill="${dark}" stroke="${o}" stroke-width="1"/>
  <!-- Pommel -->
  <ellipse cx="54" cy="6" rx="5" ry="5" fill="${crwnC}" stroke="${o}" stroke-width="1"/>
  <!-- Base feet -->
  <rect x="11" y="68" width="14" height="4" rx="2" fill="${armC}" stroke="${o}" stroke-width="1"/>
  <rect x="33" y="68" width="14" height="4" rx="2" fill="${armC}" stroke="${o}" stroke-width="1"/>
</svg>`;
		}
	};

	/* ================================================================
	   CHESS ENGINE
	================================================================ */
	class ChessEngine {
		constructor() {
			this.reset();
		}

		reset() {
			this.board     = new Array(64).fill(null);
			this.turn      = W;
			this.epTarget  = null;        // en-passant target square [r,c]
			this.castle    = { wK:true, wQ:true, bK:true, bQ:true };
			this.history   = [];
			this._initPieces();
		}

		_initPieces() {
			const back = [ROOK, KNIGHT, BISHOP, QUEEN, KING, BISHOP, KNIGHT, ROOK];
			for (let c = 0; c < 8; c++) {
				this._set(0, c, { t: back[c], c: B });
				this._set(1, c, { t: PAWN,    c: B });
				this._set(6, c, { t: PAWN,    c: W });
				this._set(7, c, { t: back[c], c: W });
			}
		}

		_idx(r, c) { return r * 8 + c; }
		_set(r, c, p) { this.board[this._idx(r, c)] = p; }
		get(r, c)     { return this.board[this._idx(r, c)]; }
		_valid(r, c)  { return r >= 0 && r < 8 && c >= 0 && c < 8; }

		// ---- Move generation ----
		pseudoMoves(r, c) {
			const p = this.get(r, c);
			if (!p) return [];
			const moves = [];
			switch (p.t) {
				case PAWN:   this._pawnMoves(r, c, p.c, moves);   break;
				case ROOK:   this._slide(r, c, p.c, [[0,1],[0,-1],[1,0],[-1,0]], moves); break;
				case BISHOP: this._slide(r, c, p.c, [[1,1],[1,-1],[-1,1],[-1,-1]], moves); break;
				case QUEEN:  this._slide(r, c, p.c, [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]], moves); break;
				case KNIGHT: this._knight(r, c, p.c, moves); break;
				case KING:   this._king(r, c, p.c, moves);   break;
			}
			return moves;
		}

		legalMoves(r, c) {
			const p = this.get(r, c);
			if (!p) return [];
			const pseudo = this.pseudoMoves(r, c);
			const legal  = [];
			for (const m of pseudo) {
				const [tr, tc] = m;

				// Castling: also verify king isn't in check now and doesn't pass through check
				if (p.t === KING && Math.abs(tc - c) === 2) {
					if (this.inCheck(p.c)) continue;
					const midCol = c + (tc > c ? 1 : -1);
					const s2 = this._snap();
					this._apply(r, c, r, midCol);
					const throughCheck = this.inCheck(p.c);
					this._restore(s2);
					if (throughCheck) continue;
				}

				const snap = this._snap();
				this._apply(r, c, tr, tc);
				if (!this.inCheck(p.c)) legal.push(m);
				this._restore(snap);
			}
			return legal;
		}

		allLegalMoves(color) {
			const out = [];
			for (let r = 0; r < 8; r++)
				for (let c = 0; c < 8; c++) {
					const p = this.get(r, c);
					if (p && p.c === color) {
						for (const m of this.legalMoves(r, c))
							out.push({ fr: r, fc: c, tr: m[0], tc: m[1] });
					}
				}
			return out;
		}

		_pawnMoves(r, c, col, out) {
			const dir  = col === W ? -1 : 1;
			const home = col === W ? 6 : 1;
			const nr = r + dir;
			if (this._valid(nr, c) && !this.get(nr, c)) {
				out.push([nr, c]);
				if (r === home && !this.get(r + 2*dir, c)) out.push([r + 2*dir, c]);
			}
			for (const dc of [-1, 1]) {
				const nc = c + dc;
				if (!this._valid(nr, nc)) continue;
				const t = this.get(nr, nc);
				if (t && t.c !== col) out.push([nr, nc]);
				if (this.epTarget && this.epTarget[0] === nr && this.epTarget[1] === nc)
					out.push([nr, nc]);
			}
		}

		_slide(r, c, col, dirs, out) {
			for (const [dr, dc] of dirs) {
				let rr = r + dr, cc = c + dc;
				while (this._valid(rr, cc)) {
					const t = this.get(rr, cc);
					if (t) { if (t.c !== col) out.push([rr, cc]); break; }
					out.push([rr, cc]);
					rr += dr; cc += dc;
				}
			}
		}

		_knight(r, c, col, out) {
			for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) {
				const rr = r+dr, cc = c+dc;
				if (!this._valid(rr, cc)) continue;
				const t = this.get(rr, cc);
				if (!t || t.c !== col) out.push([rr, cc]);
			}
		}

		_king(r, c, col, out) {
			for (let dr = -1; dr <= 1; dr++)
				for (let dc = -1; dc <= 1; dc++) {
					if (!dr && !dc) continue;
					const rr = r+dr, cc = c+dc;
					if (!this._valid(rr, cc)) continue;
					const t = this.get(rr, cc);
					if (!t || t.c !== col) out.push([rr, cc]);
				}
			// Castling — no inCheck call here (would recurse); legalMoves validates the path
			if (col === W && r === 7 && c === 4) {
				if (this.castle.wK && !this.get(7,5) && !this.get(7,6)) out.push([7, 6]);
				if (this.castle.wQ && !this.get(7,3) && !this.get(7,2) && !this.get(7,1)) out.push([7, 2]);
			}
			if (col === B && r === 0 && c === 4) {
				if (this.castle.bK && !this.get(0,5) && !this.get(0,6)) out.push([0, 6]);
				if (this.castle.bQ && !this.get(0,3) && !this.get(0,2) && !this.get(0,1)) out.push([0, 2]);
			}
		}

		kingPos(color) {
			for (let i = 0; i < 64; i++) {
				const p = this.board[i];
				if (p && p.t === KING && p.c === color) return [Math.floor(i/8), i%8];
			}
			return null;
		}

		inCheck(color) {
			const kp = this.kingPos(color);
			if (!kp) return true;
			const opp = color === W ? B : W;
			for (let r = 0; r < 8; r++)
				for (let c = 0; c < 8; c++) {
					const p = this.get(r, c);
					if (p && p.c === opp)
						for (const [mr, mc] of this.pseudoMoves(r, c))
							if (mr === kp[0] && mc === kp[1]) return true;
				}
			return false;
		}

		isCheckmate(color) { return this.inCheck(color) && !this.allLegalMoves(color).length; }
		isStalemate(color) { return !this.inCheck(color) && !this.allLegalMoves(color).length; }

		// Apply move (modifies board in-place, returns captured piece or null)
		move(fr, fc, tr, tc, promoType = QUEEN) {
			const piece    = this.get(fr, fc);
			const captured = this.get(tr, tc);
			let special    = null;

			// En-passant capture
			if (piece.t === PAWN && this.epTarget &&
				tr === this.epTarget[0] && tc === this.epTarget[1]) {
				const capR = fr; // captured pawn is on same rank as attacker
				this._set(capR, tc, null);
				special = 'enpassant';
			}

			// Update en-passant target
			this.epTarget = (piece.t === PAWN && Math.abs(tr - fr) === 2)
				? [(fr + tr) / 2, fc] : null;

			// Castling
			if (piece.t === KING) {
				if (tc === 6 && fc === 4) { // K-side
					this._set(fr, 5, this.get(fr, 7));
					this._set(fr, 7, null);
					special = 'castleK';
				}
				if (tc === 2 && fc === 4) { // Q-side
					this._set(fr, 3, this.get(fr, 0));
					this._set(fr, 0, null);
					special = 'castleQ';
				}
				if (piece.c === W) { this.castle.wK = false; this.castle.wQ = false; }
				else               { this.castle.bK = false; this.castle.bQ = false; }
			}

			if (piece.t === ROOK) {
				if (fr === 7 && fc === 0) this.castle.wQ = false;
				if (fr === 7 && fc === 7) this.castle.wK = false;
				if (fr === 0 && fc === 0) this.castle.bQ = false;
				if (fr === 0 && fc === 7) this.castle.bK = false;
			}

			// Pawn promotion
			let promoted = false;
			if (piece.t === PAWN && (tr === 0 || tr === 7)) {
				this._set(tr, tc, { t: promoType, c: piece.c });
				this._set(fr, fc, null);
				promoted = true;
			}

			if (!promoted) {
				this._set(tr, tc, piece);
				this._set(fr, fc, null);
			}

			this.turn = this.turn === W ? B : W;
			this.history.push({ fr, fc, tr, tc, special, captured, promoted });
			return { piece, captured, special, promoted };
		}

		// Snapshot/restore for search
		_snap() {
			return {
				board:   [...this.board],
				turn:    this.turn,
				epTarget: this.epTarget ? [...this.epTarget] : null,
				castle:  { ...this.castle }
			};
		}
		_restore(s) {
			this.board   = s.board;
			this.turn    = s.turn;
			this.epTarget = s.epTarget;
			this.castle  = s.castle;
		}

		// Internal apply for search (no history)
		_apply(fr, fc, tr, tc) {
			const piece = this.get(fr, fc);
			if (!piece) return;

			if (piece.t === PAWN && this.epTarget &&
				tr === this.epTarget[0] && tc === this.epTarget[1])
				this._set(fr, tc, null);

			this.epTarget = (piece.t === PAWN && Math.abs(tr - fr) === 2)
				? [(fr + tr) / 2, fc] : null;

			if (piece.t === KING) {
				if (tc === 6 && fc === 4) { this._set(fr, 5, this.get(fr, 7)); this._set(fr, 7, null); }
				if (tc === 2 && fc === 4) { this._set(fr, 3, this.get(fr, 0)); this._set(fr, 0, null); }
				if (piece.c === W) { this.castle.wK = false; this.castle.wQ = false; }
				else               { this.castle.bK = false; this.castle.bQ = false; }
			}
			if (piece.t === ROOK) {
				if (fr === 7 && fc === 0) this.castle.wQ = false;
				if (fr === 7 && fc === 7) this.castle.wK = false;
				if (fr === 0 && fc === 0) this.castle.bQ = false;
				if (fr === 0 && fc === 7) this.castle.bK = false;
			}

			if (piece.t === PAWN && (tr === 0 || tr === 7))
				this._set(tr, tc, { t: QUEEN, c: piece.c });
			else
				this._set(tr, tc, piece);
			this._set(fr, fc, null);

			this.turn = this.turn === W ? B : W;
		}

		// ---- Evaluation + Minimax ----
		// Piece-square tables give positional bonuses
		_pst(type, color, r, c) {
			const pawnW = [
				 0,  0,  0,  0,  0,  0,  0,  0,
				50, 50, 50, 50, 50, 50, 50, 50,
				10, 10, 20, 30, 30, 20, 10, 10,
				 5,  5, 10, 25, 25, 10,  5,  5,
				 0,  0,  0, 20, 20,  0,  0,  0,
				 5, -5,-10,  0,  0,-10, -5,  5,
				 5, 10, 10,-20,-20, 10, 10,  5,
				 0,  0,  0,  0,  0,  0,  0,  0
			];
			const knightW = [
				-50,-40,-30,-30,-30,-30,-40,-50,
				-40,-20,  0,  0,  0,  0,-20,-40,
				-30,  0, 10, 15, 15, 10,  0,-30,
				-30,  5, 15, 20, 20, 15,  5,-30,
				-30,  0, 15, 20, 20, 15,  0,-30,
				-30,  5, 10, 15, 15, 10,  5,-30,
				-40,-20,  0,  5,  5,  0,-20,-40,
				-50,-40,-30,-30,-30,-30,-40,-50
			];
			const bishopW = [
				-20,-10,-10,-10,-10,-10,-10,-20,
				-10,  0,  0,  0,  0,  0,  0,-10,
				-10,  0,  5, 10, 10,  5,  0,-10,
				-10,  5,  5, 10, 10,  5,  5,-10,
				-10,  0, 10, 10, 10, 10,  0,-10,
				-10, 10, 10, 10, 10, 10, 10,-10,
				-10,  5,  0,  0,  0,  0,  5,-10,
				-20,-10,-10,-10,-10,-10,-10,-20
			];
			let idx = color === W ? r * 8 + c : (7 - r) * 8 + c;
			if (type === PAWN)   return pawnW[idx]   || 0;
			if (type === KNIGHT) return knightW[idx] || 0;
			if (type === BISHOP) return bishopW[idx] || 0;
			return 0;
		}

		evaluate() {
			let score = 0;
			for (let r = 0; r < 8; r++)
				for (let c = 0; c < 8; c++) {
					const p = this.get(r, c);
					if (!p) continue;
					const val = PIECE_VALUE[p.t] + this._pst(p.t, p.c, r, c);
					score += p.c === B ? val : -val;
				}
			return score;
		}

		minimax(depth, alpha, beta, maxing) {
			const color = maxing ? B : W;
			const moves = this.allLegalMoves(color);

			if (!moves.length) {
				if (this.inCheck(color)) return maxing ? -900000 + depth * 100 : 900000 - depth * 100;
				return 0; // stalemate
			}
			if (depth === 0) return this.evaluate();

			if (maxing) {
				let best = -Infinity;
				for (const m of moves) {
					const s = this._snap();
					this._apply(m.fr, m.fc, m.tr, m.tc);
					const score = this.minimax(depth - 1, alpha, beta, false);
					this._restore(s);
					if (score > best) best = score;
					if (score > alpha) alpha = score;
					if (beta <= alpha) break;
				}
				return best;
			} else {
				let best = Infinity;
				for (const m of moves) {
					const s = this._snap();
					this._apply(m.fr, m.fc, m.tr, m.tc);
					const score = this.minimax(depth - 1, alpha, beta, true);
					this._restore(s);
					if (score < best) best = score;
					if (score < beta) beta = score;
					if (beta <= alpha) break;
				}
				return best;
			}
		}

		bestMove(depth) {
			const moves = this.allLegalMoves(B);
			if (!moves.length) return null;

			// Shuffle for variety at equal scores
			for (let i = moves.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[moves[i], moves[j]] = [moves[j], moves[i]];
			}

			let best = null, bestScore = -Infinity;
			for (const m of moves) {
				const s = this._snap();
				this._apply(m.fr, m.fc, m.tr, m.tc);
				const score = this.minimax(depth - 1, -Infinity, Infinity, false);
				this._restore(s);
				if (score > bestScore) { bestScore = score; best = m; }
			}
			return best;
		}
	}

	/* ================================================================
	   GAME STATE & UI
	================================================================ */
	class BattleChessGame {
		constructor(container, opts) {
			this.container  = container;
			this.depth      = opts.depth      || 2;
			this.playerSide = opts.playerSide || 'white';
			this.playerColor = this.playerSide === 'black' ? B : W;

			this.engine     = new ChessEngine();
			this.selected   = null;     // [r, c]
			this.validMoves = [];
			this.locked     = false;    // locked while AI thinks or animation runs
			this.lastMove   = null;     // { fr, fc, tr, tc }
			this.capturedW  = [];       // pieces captured from white
			this.capturedB  = [];       // pieces captured from black
			this.gameOver   = false;
			this.moveCount  = 0;

			this._buildDOM();
			this._renderBoard();
			this._updateStatus();

			// If player is black, AI goes first
			if (this.playerColor === B) {
				setTimeout(() => this._aiMove(), 600);
			}
		}

		_buildDOM() {
			this.container.innerHTML = '';

			// Outer Mac OS window
			const win = document.createElement('div');
			win.className = 'bc-window';

			// Title bar
			win.innerHTML = `
<div class="bc-title-bar">
  <div class="bc-close-box" title="Close">☐</div>
  <div class="bc-zoom-box"  title="Zoom">☐</div>
  <div class="bc-title-box">⚔ Battle Chess ⚔</div>
</div>
<div class="bc-menubar">
  <span class="bc-menu-item" id="bc-menu-game">Game</span>
  <span class="bc-menu-item" id="bc-menu-new">New Game</span>
  <span class="bc-menu-item" id="bc-menu-help">Help</span>
</div>
<div class="bc-body">
  <div class="bc-board-section">
    <div style="display:flex; align-items:center;">
      <div class="bc-ranks" id="bc-ranks"></div>
      <div class="bc-board-frame">
        <div class="bc-board" id="bc-board"></div>
      </div>
    </div>
    <div class="bc-files" id="bc-files"></div>
  </div>
  <div class="bc-panel" id="bc-panel"></div>
</div>`;

			this.container.appendChild(win);

			// Board element
			this.boardEl = win.querySelector('#bc-board');
			this.panelEl = win.querySelector('#bc-panel');

			// Rank/file labels
			const ranks = win.querySelector('#bc-ranks');
			const files = win.querySelector('#bc-files');
			for (let i = 0; i < 8; i++) {
				const rd = document.createElement('div'); rd.textContent = 8 - i; ranks.appendChild(rd);
				const fd = document.createElement('div'); fd.textContent = String.fromCharCode(97 + i); files.appendChild(fd);
			}

			// Panel
			this.panelEl.innerHTML = `
<div class="bc-panel-box">
  <h3>Status</h3>
  <div class="bc-status-text" id="bc-status">White's turn</div>
  <div class="bc-turn-indicator">
    <div class="bc-turn-dot white" id="bc-dot-w"></div>
    <div class="bc-turn-dot black" id="bc-dot-b"></div>
  </div>
</div>
<div class="bc-panel-box">
  <h3>Thinking…</h3>
  <div class="bc-thinking" id="bc-thinking">Computer thinking…</div>
  <div style="color:#888;font-size:10px;" id="bc-move-display"></div>
</div>
<div class="bc-panel-box">
  <h3>Captured (White)</h3>
  <div class="bc-captured-area" id="bc-cap-w"></div>
</div>
<div class="bc-panel-box">
  <h3>Captured (Black)</h3>
  <div class="bc-captured-area" id="bc-cap-b"></div>
</div>
<div class="bc-panel-box">
  <h3>Controls</h3>
  <button class="bc-btn" id="bc-btn-new">New Game</button>
  <button class="bc-btn" id="bc-btn-flip">Flip Board</button>
  <button class="bc-btn" id="bc-btn-hint">Hint</button>
</div>`;

			// Menu + button events
			win.querySelector('#bc-menu-new').addEventListener('click', () => this._newGame());
			win.querySelector('#bc-btn-new').addEventListener('click', () => this._newGame());
			win.querySelector('#bc-btn-flip').addEventListener('click', () => {
				this.playerColor = this.playerColor === W ? B : W;
				this.playerSide  = this.playerColor === W ? 'white' : 'black';
				this._renderBoard();
				this._updateStatus();
			});
			win.querySelector('#bc-btn-hint').addEventListener('click', () => this._showHint());
			win.querySelector('#bc-close-box, .bc-close-box').addEventListener('click', () => {
				this.container.innerHTML = '<p style="color:#888;padding:20px;font-family:monospace;">Game closed. Refresh to restart.</p>';
			});

			// Battle overlay
			const overlay = document.createElement('div');
			overlay.className = 'bc-battle-overlay';
			overlay.id = 'bc-battle-overlay';
			overlay.innerHTML = `
<div style="text-align:center">
  <div class="bc-battle-title">⚔ BATTLE! ⚔</div>
  <div class="bc-battle-subtitle" id="bc-battle-label">Attacker vs Defender</div>
</div>
<div class="bc-battle-stage" id="bc-battle-stage">
  <div class="bc-battle-combatant bc-combatant-attacker" id="bc-attacker"></div>
  <div class="bc-battle-vs">VS</div>
  <div class="bc-battle-combatant bc-combatant-defender" id="bc-defender"></div>
  <div class="bc-impact-flash" id="bc-flash"></div>
</div>`;
			document.body.appendChild(overlay);
			this.overlay  = overlay;
			this.flashEl  = overlay.querySelector('#bc-flash');

			// Promotion overlay
			const promoOverlay = document.createElement('div');
			promoOverlay.className = 'bc-promotion-overlay';
			promoOverlay.id = 'bc-promo-overlay';
			promoOverlay.innerHTML = `
<div class="bc-promotion-box">
  <h3>Pawn Promotion! Choose piece:</h3>
  <div class="bc-promotion-choices" id="bc-promo-choices"></div>
</div>`;
			document.body.appendChild(promoOverlay);
			this.promoOverlay = promoOverlay;
		}

		_renderBoard() {
			this.boardEl.innerHTML = '';
			this.cells = [];

			for (let r = 0; r < 8; r++) {
				for (let c = 0; c < 8; c++) {
					const cell = document.createElement('div');
					const isLight = (r + c) % 2 === 0;
					cell.className = 'bc-cell ' + (isLight ? 'light' : 'dark');
					cell.dataset.row = r;
					cell.dataset.col = c;
					cell.addEventListener('click', (e) => this._onCellClick(r, c));

					const piece = this.engine.get(r, c);
					if (piece) {
						cell.appendChild(this._makePieceEl(piece));
					}

					this.boardEl.appendChild(cell);
					if (!this.cells[r]) this.cells[r] = [];
					this.cells[r][c] = cell;
				}
			}
		}

		_makePieceEl(piece) {
			const el = document.createElement('div');
			el.className = `bc-piece bc-piece-${piece.c === W ? 'white' : 'black'}`;
			el.innerHTML = Sprites.get(piece.t, piece.c);
			el.title = (piece.c === W ? 'White ' : 'Black ') + PIECE_NAME[piece.t];
			return el;
		}

		_cell(r, c) {
			return this.cells[r] && this.cells[r][c];
		}

		_clearHighlights() {
			for (let r = 0; r < 8; r++)
				for (let c = 0; c < 8; c++) {
					const cell = this._cell(r, c);
					if (!cell) continue;
					cell.classList.remove('selected', 'valid-move', 'valid-capture', 'in-check');
				}
		}

		_showLastMove() {
			if (!this.lastMove) return;
			const { fr, fc, tr, tc } = this.lastMove;
			const cf = this._cell(fr, fc);
			const ct = this._cell(tr, tc);
			if (cf) cf.classList.add('last-from');
			if (ct) ct.classList.add('last-to');
		}

		_clearLastMove() {
			document.querySelectorAll('.bc-cell.last-from, .bc-cell.last-to').forEach(el => {
				el.classList.remove('last-from', 'last-to');
			});
		}

		_updateCells() {
			// Refresh all cells' piece display
			for (let r = 0; r < 8; r++)
				for (let c = 0; c < 8; c++) {
					const cell = this._cell(r, c);
					if (!cell) continue;
					cell.innerHTML = '';
					const piece = this.engine.get(r, c);
					if (piece) cell.appendChild(this._makePieceEl(piece));
				}
		}

		_updateStatus() {
			const statusEl    = document.getElementById('bc-status');
			const dotW        = document.getElementById('bc-dot-w');
			const dotB        = document.getElementById('bc-dot-b');
			const thinkingEl  = document.getElementById('bc-thinking');
			if (!statusEl) return;

			const turn = this.engine.turn;
			const opp  = turn === W ? B : W;

			// Check/Checkmate/Stalemate
			if (this.engine.isCheckmate(turn)) {
				const winner = turn === W ? 'Black' : 'White';
				statusEl.textContent = `☠ Checkmate! ${winner} wins!`;
				statusEl.className   = 'bc-status-text danger';
				this.gameOver = true;
				this.locked   = true;
				setTimeout(() => this._showGameOver(turn === this.playerColor ? 'lose' : 'win'), 1000);
				return;
			}
			if (this.engine.isStalemate(turn)) {
				statusEl.textContent = '½ Stalemate — Draw!';
				statusEl.className   = 'bc-status-text warn';
				this.gameOver = true;
				this.locked   = true;
				setTimeout(() => this._showGameOver('draw'), 800);
				return;
			}
			if (this.engine.inCheck(turn)) {
				statusEl.textContent = `⚠ ${turn === W ? 'White' : 'Black'} is in CHECK!`;
				statusEl.className   = 'bc-status-text danger';
				// Highlight king
				const kp = this.engine.kingPos(turn);
				if (kp) { const cell = this._cell(kp[0], kp[1]); if (cell) cell.classList.add('in-check'); }
			} else {
				statusEl.textContent = (turn === W ? 'White' : 'Black') + "'s turn";
				statusEl.className   = 'bc-status-text';
			}

			// Turn dots
			if (dotW) dotW.style.boxShadow = turn === W ? '0 0 8px #00ff88' : 'none';
			if (dotB) dotB.style.boxShadow = turn === B ? '0 0 8px #00ff88' : 'none';
		}

		_updateCaptured() {
			const capW = document.getElementById('bc-cap-w');
			const capB = document.getElementById('bc-cap-b');
			if (capW) capW.innerHTML = this.capturedW.map(p =>
				`<span class="bc-captured-piece" title="${PIECE_NAME[p.t]}">${UNICODE[W][p.t]}</span>`).join('');
			if (capB) capB.innerHTML = this.capturedB.map(p =>
				`<span class="bc-captured-piece" title="${PIECE_NAME[p.t]}">${UNICODE[B][p.t]}</span>`).join('');
		}

		_onCellClick(r, c) {
			if (this.locked || this.gameOver) return;
			if (this.engine.turn !== this.playerColor) return;

			const piece = this.engine.get(r, c);

			// If already selected, try to move
			if (this.selected) {
				const [sr, sc] = this.selected;
				const isValidTarget = this.validMoves.some(m => m[0] === r && m[1] === c);

				if (isValidTarget) {
					this._clearHighlights();
					this._clearLastMove();
					this.selected = null;
					this.validMoves = [];
					this._doPlayerMove(sr, sc, r, c);
					return;
				}

				// Clicked another own piece — re-select
				this.selected = null;
				this.validMoves = [];
				this._clearHighlights();
				if (piece && piece.c === this.playerColor) {
					this._selectPiece(r, c);
				}
				return;
			}

			// Select piece
			if (piece && piece.c === this.playerColor) {
				this._selectPiece(r, c);
			}
		}

		_selectPiece(r, c) {
			this.selected = [r, c];
			this.validMoves = this.engine.legalMoves(r, c);
			const cell = this._cell(r, c);
			if (cell) cell.classList.add('selected');

			for (const [mr, mc] of this.validMoves) {
				const mc2 = this._cell(mr, mc);
				if (!mc2) continue;
				if (this.engine.get(mr, mc)) mc2.classList.add('valid-capture');
				else mc2.classList.add('valid-move');
			}
		}

		_doPlayerMove(fr, fc, tr, tc) {
			const atPiece = this.engine.get(fr, fc);
			const target  = this.engine.get(tr, tc);

			// Check if pawn promotion
			if (atPiece.t === PAWN && (tr === 0 || tr === 7)) {
				this._showPromotion(atPiece.c, (promoType) => {
					if (target) {
						this._runBattle(atPiece, target, () => {
							const result = this.engine.move(fr, fc, tr, tc, promoType);
							this._onMoveDone(fr, fc, tr, tc, result);
						});
					} else {
						const result = this.engine.move(fr, fc, tr, tc, promoType);
						this._animateMove(fr, fc, tr, tc, () => this._onMoveDone(fr, fc, tr, tc, result));
					}
				});
				return;
			}

			if (target) {
				// Battle animation
				this._runBattle(atPiece, target, () => {
					const result = this.engine.move(fr, fc, tr, tc);
					this._onMoveDone(fr, fc, tr, tc, result);
				});
			} else {
				const result = this.engine.move(fr, fc, tr, tc);
				this._animateMove(fr, fc, tr, tc, () => this._onMoveDone(fr, fc, tr, tc, result));
			}
		}

		_animateMove(fr, fc, tr, tc, done) {
			// Simple quick slide via CSS
			const fromCell = this._cell(fr, fc);
			const toCell   = this._cell(tr, tc);
			if (!fromCell || !toCell) { done(); return; }

			const pieceEl = fromCell.querySelector('.bc-piece');
			if (!pieceEl) { done(); return; }

			const fromRect = fromCell.getBoundingClientRect();
			const toRect   = toCell.getBoundingClientRect();

			const dx = toRect.left - fromRect.left;
			const dy = toRect.top  - fromRect.top;

			pieceEl.style.transition = 'transform 0.28s cubic-bezier(0.4,0,0.2,1)';
			pieceEl.style.zIndex     = '100';
			pieceEl.style.position   = 'relative';
			pieceEl.style.transform  = `translate(${dx}px, ${dy}px)`;

			setTimeout(() => {
				pieceEl.style.transition = '';
				pieceEl.style.transform  = '';
				pieceEl.style.zIndex     = '';
				done();
			}, 300);
		}

		_onMoveDone(fr, fc, tr, tc, result) {
			this.lastMove = { fr, fc, tr, tc };
			if (result.captured) {
				if (result.captured.c === W) this.capturedW.push(result.captured);
				else                         this.capturedB.push(result.captured);
			}
			this.moveCount++;

			this._updateCells();
			this._clearHighlights();
			this._showLastMove();
			this._updateStatus();
			this._updateCaptured();
			this._updateMoveDisplay(fr, fc, tr, tc, result);

			if (!this.gameOver) {
				this.locked = false;
				if (this.engine.turn !== this.playerColor) {
					setTimeout(() => this._aiMove(), 400);
				}
			}
		}

		_updateMoveDisplay(fr, fc, tr, tc, result) {
			const el = document.getElementById('bc-move-display');
			if (!el) return;
			const files = 'abcdefgh';
			const from  = files[fc] + (8 - fr);
			const to    = files[tc] + (8 - tr);
			const piece = result.piece;
			const sym   = UNICODE[piece.c][piece.t];
			const cap   = result.captured ? '×' : '→';
			el.textContent = `${sym} ${from}${cap}${to}`;
		}

		_aiMove() {
			if (this.gameOver) return;
			this.locked = true;
			const thinkingEl = document.getElementById('bc-thinking');
			if (thinkingEl) thinkingEl.classList.add('active');

			// Run AI in a timeout to keep UI responsive
			setTimeout(() => {
				const best = this.engine.bestMove(this.depth);
				if (thinkingEl) thinkingEl.classList.remove('active');
				if (!best) { this.locked = false; return; }

				const atPiece = this.engine.get(best.fr, best.fc);
				const target  = this.engine.get(best.tr, best.tc);

				if (target) {
					this._runBattle(atPiece, target, () => {
						const result = this.engine.move(best.fr, best.fc, best.tr, best.tc);
						this._onMoveDone(best.fr, best.fc, best.tr, best.tc, result);
					});
				} else {
					const result = this.engine.move(best.fr, best.fc, best.tr, best.tc);
					this._animateMove(best.fr, best.fc, best.tr, best.tc,
						() => this._onMoveDone(best.fr, best.fc, best.tr, best.tc, result));
				}
			}, 50);
		}

		// ---- Battle Animation ----
		_runBattle(attacker, defender, done) {
			this.locked = true;
			const overlay  = this.overlay;
			const atkEl    = overlay.querySelector('#bc-attacker');
			const defEl    = overlay.querySelector('#bc-defender');
			const labelEl  = overlay.querySelector('#bc-battle-label');

			// Set combatant SVGs
			const atkSvg = Sprites.get(attacker.t, attacker.c);
			const defSvg = Sprites.get(defender.t, defender.c);

			atkEl.innerHTML = `${atkSvg}<div class="bc-battle-combatant-name">${(attacker.c===W?'White ':'Black ')+PIECE_NAME[attacker.t]}</div>`;
			defEl.innerHTML = `${defSvg}<div class="bc-battle-combatant-name">${(defender.c===W?'White ':'Black ')+PIECE_NAME[defender.t]}</div>`;

			if (labelEl) labelEl.textContent =
				`${PIECE_NAME[attacker.t]} attacks ${PIECE_NAME[defender.t]}!`;

			// Reset animation classes
			atkEl.classList.remove('bc-attack');
			defEl.classList.remove('bc-die');

			overlay.classList.add('active');

			// Sequence: pause → attack → flash → die → close
			setTimeout(() => {
				atkEl.classList.add('bc-attack');
				this._spawnSparks();
			}, 700);

			setTimeout(() => {
				this.flashEl.style.animation = 'none';
				this.flashEl.offsetHeight; // reflow
				this.flashEl.style.animation = '';
				this.flashEl.style.animation = 'bc-flash 0.35s ease-out forwards';
			}, 1050);

			setTimeout(() => {
				defEl.classList.add('bc-die');
			}, 1080);

			setTimeout(() => {
				overlay.classList.remove('active');
				atkEl.classList.remove('bc-attack');
				defEl.classList.remove('bc-die');
				this._clearSparks();
				done();
			}, 1900);
		}

		_spawnSparks() {
			const stage = document.getElementById('bc-battle-stage');
			if (!stage) return;
			for (let i = 0; i < 12; i++) {
				const spark = document.createElement('div');
				spark.className = 'bc-spark';
				const angle = (Math.random() * Math.PI * 2);
				const dist  = 40 + Math.random() * 80;
				spark.style.setProperty('--sx', Math.cos(angle) * dist + 'px');
				spark.style.setProperty('--sy', Math.sin(angle) * dist + 'px');
				spark.style.left = (200 + Math.random() * 100) + 'px';
				spark.style.top  = (80  + Math.random() * 60)  + 'px';
				spark.style.background = ['#ffaa00','#ff4400','#ffff00','#ffffff'][Math.floor(Math.random()*4)];
				stage.appendChild(spark);
			}
		}

		_clearSparks() {
			const stage = document.getElementById('bc-battle-stage');
			if (!stage) return;
			stage.querySelectorAll('.bc-spark').forEach(s => s.remove());
		}

		// ---- Promotion ----
		_showPromotion(color, done) {
			const overlay = this.promoOverlay;
			const choices = overlay.querySelector('#bc-promo-choices');
			choices.innerHTML = '';
			const types = [QUEEN, ROOK, BISHOP, KNIGHT];
			for (const t of types) {
				const btn = document.createElement('div');
				btn.className = 'bc-promotion-choice';
				btn.innerHTML = Sprites.get(t, color) +
					`<span>${PIECE_NAME[t]}</span>`;
				btn.addEventListener('click', () => {
					overlay.classList.remove('active');
					done(t);
				});
				choices.appendChild(btn);
			}
			overlay.classList.add('active');
		}

		// ---- Hint ----
		_showHint() {
			if (this.locked || this.gameOver) return;
			if (this.engine.turn !== this.playerColor) return;
			const best = this.engine.bestMove(Math.min(this.depth, 2));
			if (!best) return;
			const { fr, fc, tr, tc } = best;
			const fc2 = this._cell(fr, fc);
			const tc2 = this._cell(tr, tc);
			if (fc2) { fc2.style.boxShadow = 'inset 0 0 0 4px #00ffff'; }
			if (tc2) { tc2.style.boxShadow = 'inset 0 0 0 4px #00ffff'; }
			setTimeout(() => {
				if (fc2) fc2.style.boxShadow = '';
				if (tc2) tc2.style.boxShadow = '';
			}, 2000);
		}

		// ---- Game Over Screen ----
		_showGameOver(outcome) {
			const win = this.container.querySelector('.bc-window');
			if (!win) return;
			const body = win.querySelector('.bc-body');
			if (!body) return;
			const msgs = {
				win:  { r: 'VICTORY!',   d: 'The computer yields to your superior tactics!' },
				lose: { r: 'DEFEATED!',  d: 'The computer\'s forces have overwhelmed you!' },
				draw: { r: 'STALEMATE!', d: 'An honorable draw — neither side can win.' }
			};
			const m = msgs[outcome] || msgs.draw;
			body.innerHTML = `
<div class="bc-splash">
  <div class="bc-splash-logo">${outcome==='win'?'🏆':outcome==='lose'?'💀':'🤝'}</div>
  <div class="bc-gameover-result ${outcome}">${m.r}</div>
  <div class="bc-splash-desc">${m.d}</div>
  <div style="color:#aaa; font-size:11px; margin-bottom:20px;">
    Moves played: ${this.moveCount}
  </div>
  <button class="bc-splash-btn" id="bc-over-new">Play Again</button>
</div>`;
			body.querySelector('#bc-over-new').addEventListener('click', () => this._newGame());
		}

		_newGame() {
			// Remove overlays from body
			const existingOverlays = document.querySelectorAll('#bc-battle-overlay, #bc-promo-overlay');
			existingOverlays.forEach(el => {
				el.classList.remove('active');
			});

			this.engine     = new ChessEngine();
			this.selected   = null;
			this.validMoves = [];
			this.locked     = false;
			this.lastMove   = null;
			this.capturedW  = [];
			this.capturedB  = [];
			this.gameOver   = false;
			this.moveCount  = 0;

			this._buildDOM();
			this._renderBoard();
			this._updateStatus();

			if (this.playerColor === B) {
				setTimeout(() => this._aiMove(), 600);
			}
		}
	}

	/* ================================================================
	   SPLASH SCREEN → GAME INIT
	================================================================ */
	function init(container, opts) {
		opts = opts || {};
		container.innerHTML = '';
		container.classList.add('bc-game-container');

		// Show splash screen first
		const splashEl = document.createElement('div');
		splashEl.className = 'bc-window';
		splashEl.innerHTML = `
<div class="bc-title-bar">
  <div class="bc-close-box">☐</div>
  <div class="bc-zoom-box">☐</div>
  <div class="bc-title-box">⚔ Battle Chess ⚔</div>
</div>
<div class="bc-splash">
  <div class="bc-splash-logo">♟</div>
  <div class="bc-splash-title">BATTLE CHESS</div>
  <div class="bc-splash-subtitle">INTERPLAY PRODUCTIONS · 1988</div>
  <div class="bc-splash-desc">
    Every piece is an animated warrior.<br>
    Watch them battle when one takes another!<br><br>
    <em>Pawns • Rooks • Knights • Bishops • Queens • Kings</em>
  </div>
  <div style="margin-bottom:20px;">
    <label style="color:#888;font-size:11px;display:block;margin-bottom:6px;">You play as:</label>
    <select id="bc-side-sel" style="padding:4px 8px;font-size:12px;background:#fff;border:2px solid #000;">
      <option value="white" ${opts.playerSide!=='black'?'selected':''}>White (moves first)</option>
      <option value="black" ${opts.playerSide==='black'?'selected':''}>Black (AI moves first)</option>
    </select>
  </div>
  <button class="bc-splash-btn" id="bc-start-btn">START GAME</button>
  <div style="color:#555;font-size:10px;margin-top:16px;">
    Recreated as a WordPress plugin · Classic Mac OS edition
  </div>
</div>`;

		container.appendChild(splashEl);

		splashEl.querySelector('#bc-start-btn').addEventListener('click', () => {
			const side = splashEl.querySelector('#bc-side-sel').value;
			container.innerHTML = '';
			new BattleChessGame(container, {
				depth:      opts.depth      || 2,
				playerSide: side,
			});
		});
	}

	return { init };

})();

// Auto-init: works whether the script loads before or after DOMContentLoaded
function _bcAutoInit() {
	document.querySelectorAll('.bc-plugin-wrapper').forEach(function (wrapper) {
		const container = wrapper.querySelector('.bc-game-container');
		if (!container || container.dataset.bcReady) return; // skip if already init'd
		container.dataset.bcReady = '1';
		const depth = parseInt(wrapper.dataset.bcDepth || '2', 10);
		const side  = wrapper.dataset.bcSide || 'white';
		BattleChess.init(container, { depth: depth, playerSide: side });
	});
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', _bcAutoInit);
} else {
	_bcAutoInit();
}
