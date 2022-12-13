'use strict';

function ui36len(x) {
	if ((x & 0b10000000) == 0b00000000) {
		return 1;
	}
	if ((x & 0b11100000) == 0b11000000) {
		return 2;
	}
	if ((x & 0b11110000) == 0b11100000) {
		return 3;
	}
	// None of the following can occur in UTF-8 encoded
	// from Javascript strings, because they are internally
	// encoded as UTF-16.
	if ((x & 0b11111000) == 0b11110000) {
		return 4;
	}
	if ((x & 0b11111100) == 0b11111000) {
		return 5;
	}
	if ((x & 0b11111110) == 0b11111100) {
		return 6;
	}
	// The following is non-standard in UTF8.
	if ((x & 0b11111111) == 0b11111110) {
		return 7;
	}
	throw new Error('Unexpected input');
}

function ui36dec(b) {
	switch (b.length) {
	case 1:
		if (! ((b[0] & 0b10000000) == 0b00000000)) {
			throw new Error('Invalid encoding');
		}
		return (b[0] & 0b11111111);
	case 2:
		if (! (((b[0] & 0b11100000) == 0b11000000) &&
			   ((b[1] & 0b11000000) == 0b10000000))) {
			throw new Error('Invalid encoding');
		}
		return (((b[0] & 0b00011111) << 6) |
				(b[1] & 0b00111111));
	case 3:
		if (! (((b[0] & 0b11110000) == 0b11100000) &&
			   ((b[1] & 0b11000000) == 0b10000000) &&
			   ((b[2] & 0b11000000) == 0b10000000))) {
			throw new Error('Invalid encoding');
		}
		return (((b[0] & 0b00001111) << 12) |
				((b[1] & 0b00111111) << 6) |
				(b[2] & 0b00111111));
	// None of the following can occur in UTF-8 encoded
	// from Javascript strings, because they are internally
	// encoded as UTF-16.
	case 4:
		if (! (((b[0] & 0b11111000) == 0b11110000) &&
			   ((b[1] & 0b11000000) == 0b10000000) &&
			   ((b[2] & 0b11000000) == 0b10000000) &&
			   ((b[3] & 0b11000000) == 0b10000000))) {
			throw new Error('Invalid encoding');
		}
		return (((b[0] & 0b00000111) << 18) |
				((b[1] & 0b00111111) << 12) |
				((b[2] & 0b00111111) << 6) |
				(b[3] & 0b00111111));
	case 5:
		if (! (((b[0] & 0b11111100) == 0b11111000) &&
			   ((b[1] & 0b11000000) == 0b10000000) &&
			   ((b[2] & 0b11000000) == 0b10000000) &&
			   ((b[3] & 0b11000000) == 0b10000000) &&
			   ((b[4] & 0b11000000) == 0b10000000))) {
			throw new Error('Invalid encoding');
		}
		return (((b[0] & 0b00000111) << 24) |
				((b[1] & 0b00111111) << 18) |
				((b[2] & 0b00111111) << 12) |
				((b[3] & 0b00111111) << 6) |
				(b[4] & 0b00111111));
	case 6:
		if (! (((b[0] & 0b11111110) == 0b11111100) &&
			   ((b[1] & 0b11000000) == 0b10000000) &&
			   ((b[2] & 0b11000000) == 0b10000000) &&
			   ((b[3] & 0b11000000) == 0b10000000) &&
			   ((b[4] & 0b11000000) == 0b10000000) &&
			   ((b[5] & 0b11000000) == 0b10000000))) {
			throw new Error('Invalid encoding');
		}
		return (((b[1] & 0b00111111) * 0x1000000) +
				((b[2] & 0b00111111) * 0x40000) +
				((b[3] & 0b00111111) * 0x1000) +
				((b[4] & 0b00111111) * 0x40) +
				(b[5] & 0b00111111));
	// The following is non-standard in UTF8.
	case 7:
		if (! (((b[0] & 0b11111111) == 0b11111110) &&
			   ((b[1] & 0b11000000) == 0b10000000) &&
			   ((b[2] & 0b11000000) == 0b10000000) &&
			   ((b[3] & 0b11000000) == 0b10000000) &&
			   ((b[4] & 0b11000000) == 0b10000000) &&
			   ((b[5] & 0b11000000) == 0b10000000) &&
			   ((b[6] & 0b11000000) == 0b10000000))) {
			throw new Error('Invalid encoding');
		}
		return (((b[1] & 0b00111111) * 0x40000000) +
				((b[2] & 0b00111111) * 0x1000000) +
				((b[3] & 0b00111111) * 0x40000) +
				((b[4] & 0b00111111) * 0x1000) +
				((b[5] & 0b00111111) * 0x40) +
				(b[6] & 0b00111111));
	default:
		throw new Error('Unexpected input');
	}
}

function ui36enc(x) {
	if (x <= 0x7f) {
		return [ x ];
	}
	if (x <= 0x7ff) {
		return [ 0b11000000 | ((x >> 6) & 0b00011111),
				 0b10000000 | (x & 0b00111111) ];
	}
	if (x <= 0xffff) {
		return [ 0b11100000 | ((x >> 12) & 0b00001111),
				 0b10000000 | ((x >> 6) & 0b00111111),
				 0b10000000 | (x & 0b00111111) ];
	}
	// None of the following can occur in UTF-8 encoded
	// from Javascript strings, because they are internally
	// encoded as UTF-16 and the maximum character value
	// therefore is 0xffff.
	if (x <= 0x1fffff) {
		return [ 0b11110000 | ((x >> 18) & 0b00000111),
				 0b10000000 | ((x >> 12) & 0b00111111),
				 0b10000000 | ((x >> 6) & 0b00111111),
				 0b10000000 | (x & 0b00111111) ];
	}
	if (x <= 0x3ffffff) {
		return [ 0b11111000 | ((x >> 24) & 0b00000011),
				 0b10000000 | ((x >> 18) & 0b00111111),
				 0b10000000 | ((x >> 12) & 0b00111111),
				 0b10000000 | ((x >> 6) & 0b00111111),
				 0b10000000 | (x & 0b00111111) ];
	}
	if (x <= 0x7fffffff) {
		return [ 0b11111100 | ((x >> 30) & 0b00000001),
				 0b10000000 | ((x >> 24) & 0b00111111),
				 0b10000000 | ((x >> 18) & 0b00111111),
				 0b10000000 | ((x >> 12) & 0b00111111),
				 0b10000000 | ((x >> 6) & 0b00111111),
				 0b10000000 | (x & 0b00111111) ];
	}
	if (x <= 0xfffffffff) {
		let b = [];
		for (let n = x; b.length < 6; n = (n - b[0]) / 64) {
			b.unshift(n % 64);
		}
		return [ 0b11111110,
				 0b10000000 | b[0],
				 0b10000000 | b[1],
				 0b10000000 | b[2],
				 0b10000000 | b[3],
				 0b10000000 | b[4],
				 0b10000000 | b[5] ];
	}
	if (x <= 0x3ffffffffff) {
		let b = [];
		for (let n = x; b.length < 7; n = (n - b[0]) / 64) {
			b.unshift(n % 64);
		}
		return [ 0b11111111,
				 0b10000000 | b[0],
				 0b10000000 | b[1],
				 0b10000000 | b[2],
				 0b10000000 | b[3],
				 0b10000000 | b[4],
				 0b10000000 | b[5],
				 0b10000000 | b[6] ];
	}
	throw new Error('Too big character code');
}

function encodeUtf8(s) {
	if (! (typeof(s) === 'string')) {
		throw new Error('Input not a string');
	}
	let r = [];
	for (let i = 0; i < s.length; i++) {
		let x = ui36enc(s.charCodeAt(i));
		if (x.length > 6) {
			throw new Error('Non-standard UTF-8');
		}
		r.push.apply(r, x);
	}
	return r;
}

function decodeUtf8(b) {
	if (! (Array.isArray(b) || (b instanceof Uint8Array)  || (b instanceof Int8Array))) {
		throw new Error('Input not an Array or Uint8Array');
	}
	let r = '';
	while (b.length > 0) {
		let len = ui36len(b[0]);
		if (len > 6) {
			throw new Error('Non-standard UTF-8 input');
		}
		if (b.length < len) {
			throw new Error('Truncated input');
		}
		let x = ui36dec(b.slice(0, len));
		if (x > 0xffff) {
			throw new Error('UTF-16 overflow');
		}
		r += String.fromCharCode(x);
		b = b.slice(len);
	}
	return r;
}

module.exports = { encodeUtf8: encodeUtf8,
				   decodeUtf8: decodeUtf8,
				   ui36len: ui36len,
				   ui36dec: ui36dec,
				   ui36enc: ui36enc };
