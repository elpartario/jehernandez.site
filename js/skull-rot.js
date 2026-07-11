/* Skull orientation — shared by the front page and the mini corner skull.
 *
 * SKULL_ROT is a list of rotations applied IN ORDER to the raw scan,
 * each one in *screen space* (x = pitch/nod, y = turn left-right,
 * z = roll/clockwise), in degrees. Edit this one line to re-orient
 * the skull everywhere. Test live with ?rot=x:-90,z:-90,x:90 in the URL.
 */
window.SKULL_ROT = [['x', -90], ['z', -90], ['x', 90]];

window.skullRotMatrix = function (seq) {
	let m = [1, 0, 0, 0, 1, 0, 0, 0, 1];
	const mul = (a, b) => {
		const r = new Array(9);
		for (let c = 0; c < 3; c++)
			for (let rw = 0; rw < 3; rw++)
				r[c * 3 + rw] = a[rw] * b[c * 3] + a[3 + rw] * b[c * 3 + 1] + a[6 + rw] * b[c * 3 + 2];
		return r;
	};
	for (const [axis, deg] of seq) {
		const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
		let R;
		if (axis === 'x') R = [1, 0, 0, 0, c, s, 0, -s, c];
		else if (axis === 'y') R = [c, 0, -s, 0, 1, 0, s, 0, c];
		else R = [c, s, 0, -s, c, 0, 0, 0, 1];
		m = mul(R, m);   // each later rotation happens in view space
	}
	return m;
};
