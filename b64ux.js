'use strict';

const e = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

const d = { 'A':0,'B':1,'C':2,'D':3,'E':4,'F':5,'G':6,'H':7,'I':8,'J':9,
			'K':10,'L':11,'M':12,'N':13,'O':14,'P':15,'Q':16,'R':17,'S':18,'T':19,
			'U':20,'V':21,'W':22,'X':23,'Y':24,'Z':25,'a':26,'b':27,'c':28,'d':29,
			'e':30,'f':31,'g':32,'h':33,'i':34,'j':35,'k':36,'l':37,'m':38,'n':39,
			'o':40,'p':41,'q':42,'r':43,'s':44,'t':45,'u':46,'v':47,'w':48,'x':49,
			'y':50,'z':51,'0':52,'1':53,'2':54,'3':55,'4':56,'5':57,'6':58,'7':59,
			'8':60,'9':61,'-':62,'_':63 };

var encodeUtf8, decodeUtf8;
{
	let tenc = (typeof(TextEncoder) !== 'undefined') ? (new TextEncoder('utf-8')) : undefined;
	if (tenc) {
		encodeUtf8 = function (s) {
			return tenc.encode(s);
		}
	} else {
		throw new Error('TextEncoder not supported');
	}

	let tdec = (typeof(TextEncoder) !== 'undefined') ? (new TextDecoder('utf-8')) : undefined;
	if (tdec) {
		decodeUtf8 = function (a) {
			if (! (a instanceof Uint8Array)) {
				a = Uint8Array.from(a);
			}
			return tdec.decode(a);
		}
	} else {
		throw new Error('TextDecoder not supported');
	}
}

function stringLookup(s, idx) {
	if (! ((typeof(s) === 'string') && Number.isSafeInteger(idx) && (idx >= 0) && (idx < s.length))) {
		throw new Error('Invalid input');
	}
	return s.charCodeAt(idx);
}

function arrayLookup(a, idx) {
	if (! (Number.isSafeInteger(idx) && (idx >= 0) && (idx < a.length))) {
		throw new Error('Invalid input');
	}
	let r = a[idx];
	if (! (Number.isSafeInteger(r) && (r <= 255))) {
		throw new Error('Invalid input');
	}
	if (r >= 0) {
		return r;
	}
	if (r >= -128) {
		return 256 + r;
	}
	throw new Error('Invalid input');
}

function hexAppend(s, ...x) {
	x.forEach(function(y) { s += (y >> 4).toString(16) + (y & 15).toString(16); });
	return s;
}

function stringAppend(s, ...x) {
	x.forEach(function(y) { s += String.fromCharCode(y); });
	return s;
}

function arrayAppend(a, ...x) {
	x.forEach(function(y) { a.push(y); });
	return a;
}

function hex2arr(hex) {
	if (! ((typeof(hex) === 'string') && ((hex.length % 2) == 0))) {
		throw new Error('Bad hexadecimal string');
	}
	let r = [];
	for (let i = 0; i < hex.length; i += 2) {
		let b = hex.slice(i, i + 2);
		if (! /^[0-9a-fA-F]{2}$/.test(b)) {
			throw new Error('Bad hexadecimal string');
		}
		r.push(Number.parseInt(b, 16));
	}
	return r;
};

function b64ue(s, format) {
	let r = '', i, c, lookup;
	if (typeof(s) === 'string') {
		if (format === 'hex') {
			s = hex2arr(s);
			lookup = arrayLookup;
		} else if ((! format) || (format === 'string')) {
			s = encodeUtf8(s);
			lookup = arrayLookup;
		} else {
			throw new Error('Format conflict');
		}
	} else if (Array.isArray(s) || (s instanceof Uint8Array) || (s instanceof Int8Array)) {
		if ((! format) || (format === 'array') || (format === 'uint8array') || (format === 'int8array')) {
			lookup = arrayLookup;
		} else {
			throw new Error('Format conflict');
		}
	} else {
		throw new Error('Invalid input');
	}
	for (i = 0; i < s.length - 2; i+= 3) {
		c = (((lookup(s, i) << 8) | lookup(s, i+1)) << 8) | lookup(s, i+2);
		r += e[c>>18] + e[(c>>12)&63] + e[(c>>6)&63] + e[c&63];
	}
	switch (s.length - i) {
	case 1:
		c = lookup(s, i);
		r += e[c>>2] + e[(c<<4)&63];
		break;
	case 2:
		c = (lookup(s, i) << 8) | lookup(s, i+1);
		r += e[c>>10] + e[(c>>4)&63] + e[(c<<2)&63];
		break;
	}
	return r;
}

function b64ud(s, format) {
	let r, i, c0, c1, c2, c3, append;
	if (! format) {
		format = 'string';
	}
	switch (format) {
	case 'hex':
		r = '';
		append = hexAppend;
		break;
	case 'string':
	case 'array':
	case 'int8array':
	case 'uint8array':
		r = [];
		append = arrayAppend;
		break;
	default:
		throw new Error('Invalid format');
	}
	for (i = 0; i < s.length - 3; i += 4) {
		c0 = d[s[i]];
		if (c0 === undefined) {
			throw new Error('Bad b64u in index ' + i.toString());
		}
		c1 = d[s[i + 1]];
		if (c1 === undefined) {
			throw new Error('Bad b64u in index ' + (i+1).toString());
		}
		c2 = d[s[i + 2]];
		if (c2 === undefined) {
			throw new Error('Bad b64u in index ' + (i+2).toString());
		}
		c3 = d[s[i + 3]];
		if (c3 === undefined) {
			throw new Error('Bad b64u in index ' + (i+3).toString());
		}
		r = append(r, (c0 << 2) | (c1 >> 4), ((c1 << 4) & 255) | (c2 >> 2), ((c2 << 6) & 255) | c3)
	}
	switch (s.length - i) {
	case 0:
		break;
	case 2:
		c0 = d[s[i]];
		if (c0 === undefined) {
			throw new Error('Bad b64u in index ' + i.toString());
		}
		c1 = d[s[i + 1]];
		if (c1 === undefined) {
			throw new Error('Bad b64u in index ' + (i+1).toString());
		}
		r = append(r, (c0 << 2) | (c1 >> 4));
		break;
	case 3:
		c0 = d[s[i]];
		if (c0 === undefined) {
			throw new Error('Bad b64u in index ' + i.toString());
		}
		c1 = d[s[i + 1]];
		if (c1 === undefined) {
			throw new Error('Bad b64u in index ' + (i+1).toString());
		}
		c2 = d[s[i + 2]];
		if (c2 === undefined) {
			throw new Error('Bad b64u in index ' + (i+2).toString());
		}
		r = append(r, (c0 << 2) | (c1 >> 4), ((c1 << 4) & 255) | (c2 >> 2))
		break;
	default:
		return undefined;
	}
	if (format === 'string') {
		r = decodeUtf8(r);
	} else if (format === 'int8array') {
		r = Int8Array.from(r);
	} else if (format === 'uint8array') {
		r = Uint8Array.from(r);
	}
	return r;
}

module.exports = { encode: b64ue, decode: b64ud };
