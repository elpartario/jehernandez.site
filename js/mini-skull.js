/* Mini 3D coyote skull for the top-right corner of inner pages.
 * Self-contained: own WebGL context, loads assets/skull.bin (already
 * browser-cached after visiting the front page), follows the mouse.
 * The <a id="corner"> on top of it links back to the homepage ("/").
 * Orientation comes from js/skull-rot.js (window.SKULL_ROT).
 * Color follows the page text color (--ink), so it stays visible when
 * the light/dark toggle flips the theme. */
(function () {
	const cv = document.getElementById('mini');
	if (!cv || !window.skullRotMatrix) return;
	const g = cv.getContext('webgl', { alpha: true, antialias: false });
	if (!g) return;

	const VS = [
		'attribute vec4 aP;',
		'uniform float uTime,uAmp,uExp,uPt,uScale,uFocal,uCam;',
		'uniform vec2 uLook;',
		'uniform mat3 uRot;',
		'varying float vB;',
		'mat3 rx(float a){ float c=cos(a), s=sin(a); return mat3(1.,0.,0., 0.,c,s, 0.,-s,c); }',
		'mat3 ry(float a){ float c=cos(a), s=sin(a); return mat3(c,0.,-s, 0.,1.,0., s,0.,c); }',
		'void main(){',
		'	vec3 p = aP.xyz;',
		'	float r = aP.w * 0.5 + 0.5;',
		'	float n = 0.5 + 0.5 * sin(uTime * (0.4 + 1.3 * r) + r * 151.0);',
		'	p += normalize(p + vec3(1e-4)) * (pow(n, uExp) * uAmp);',
		'	p = uRot * p;',
		'	p = ry(uLook.x) * rx(uLook.y) * p;',
		'	p *= uScale;',
		'	float w = uCam - p.z;',
		'	gl_Position = vec4(p.x * uFocal, p.y * uFocal, 0.0, w);',
		'	gl_PointSize = uPt * (uFocal / w);',
		'	vB = 0.30 + 0.70 * r;',
		'}'].join('\n');
	const FS = [
		'precision mediump float;',
		'uniform vec3 uCol;',
		'varying float vB;',
		'void main(){',
		'	float d = length(gl_PointCoord - 0.5);',
		'	float m = smoothstep(0.5, 0.1, d) * vB;',
		'	gl_FragColor = vec4(uCol * m, m);',
		'}'].join('\n');

	const sh = (src, type) => {
		const s = g.createShader(type);
		g.shaderSource(s, src);
		g.compileShader(s);
		if (!g.getShaderParameter(s, g.COMPILE_STATUS))
			console.error('[mini-skull]', g.getShaderInfoLog(s));
		return s;
	};
	const P = g.createProgram();
	g.attachShader(P, sh(VS, g.VERTEX_SHADER));
	g.attachShader(P, sh(FS, g.FRAGMENT_SHADER));
	g.bindAttribLocation(P, 0, 'aP');
	g.linkProgram(P);
	const u = n => g.getUniformLocation(P, n);
	const ROT = skullRotMatrix(window.SKULL_ROT);

	// current --ink as a 0..1 RGB triple; re-read whenever the theme flips
	function inkColor() {
		const v = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim();
		const h = v.replace('#', '');
		const p = h.length === 3 ? h.split('').map(c => c + c)
			: [h.slice(0, 2), h.slice(2, 4), h.slice(4, 6)];
		return p.map(x => parseInt(x, 16) / 255);
	}
	let COL = inkColor();
	addEventListener('themechange', () => { COL = inkColor(); });

	let n = 0;
	const buf = g.createBuffer();
	function setData(ab) {
		const i16 = new Int16Array(ab);
		n = Math.min(22000, Math.floor(i16.length / 4));
		g.bindBuffer(g.ARRAY_BUFFER, buf);
		g.bufferData(g.ARRAY_BUFFER, i16.subarray(0, n * 4), g.STATIC_DRAW);
	}
	const AB = /[/\\]work[/\\][^/\\]*$/.test(location.pathname) ? '../' : '';
	fetch(AB + 'assets/skull.bin')
		.then(r => { if (!r.ok) throw 0; return r.arrayBuffer(); })
		.then(setData)
		.catch(() => {
			const s = document.createElement('script');
			s.src = AB + 'assets/skull.js';
			s.onload = () => {
				const bin = atob(window.SKULL_B64), u8 = new Uint8Array(bin.length);
				for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
				setData(u8.buffer);
			};
			document.head.appendChild(s);
		});

	const tgt = { x: 0.5, y: 0.42 }, sm = { x: 0.5, y: 0.42 };
	addEventListener('pointermove', e => {
		tgt.x = e.clientX / innerWidth;
		tgt.y = e.clientY / innerHeight;
	});
	addEventListener('touchmove', e => {
		const t = e.touches[0];
		tgt.x = t.clientX / innerWidth;
		tgt.y = t.clientY / innerHeight;
	}, { passive: true });

	function loop() {
		sm.x += (tgt.x - sm.x) * 0.07;
		sm.y += (tgt.y - sm.y) * 0.07;
		if (n) {
			g.viewport(0, 0, cv.width, cv.height);
			g.clearColor(0, 0, 0, 0);
			g.clear(g.COLOR_BUFFER_BIT);
			g.useProgram(P);
			g.bindBuffer(g.ARRAY_BUFFER, buf);
			g.enableVertexAttribArray(0);
			g.vertexAttribPointer(0, 4, g.SHORT, true, 8, 0);
			g.uniform1f(u('uTime'), performance.now() / 1000);
			g.uniform1f(u('uAmp'), 0.05);
			g.uniform1f(u('uExp'), 1.2);
			g.uniform1f(u('uPt'), 2.3);
			g.uniform1f(u('uScale'), 0.85);
			g.uniform1f(u('uFocal'), 1.55);
			g.uniform1f(u('uCam'), 2.6);
			g.uniform2f(u('uLook'), (sm.x - 0.5) * 1.15, (sm.y - 0.5) * 0.75);
			g.uniformMatrix3fv(u('uRot'), false, ROT);
			g.uniform3f(u('uCol'), COL[0], COL[1], COL[2]);
			g.enable(g.BLEND);
			g.blendFunc(g.ONE, g.ONE);
			g.drawArrays(g.POINTS, 0, n);
		}
		requestAnimationFrame(loop);
	}
	loop();
})();
