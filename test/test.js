'use strict';

const assert = require('assert');

const b64ux = require('../b64ux.js');

const tv = [
	{ r: '', b: '' },
	{ r: 'f', b: 'Zg' },
	{ r: 'fo', b: 'Zm8' },
	{ r: 'foo', b: 'Zm9v' },
	{ r: 'foob', b: 'Zm9vYg' },
	{ r: 'fooba', b: 'Zm9vYmE' },
	{ r: 'foobar', b: 'Zm9vYmFy' },
	{ r: '1000€ ja häppää päälle!', b: 'MTAwMOKCrCBqYSBow6RwcMOkw6QgcMOkw6RsbGUh' },
	{ r: 'κόσμε', b: 'zrrhvbnPg868zrU' },
	{ r: 'ࠀ', b: '4KCA' },
	{ r: String.fromCharCode(0xffff), b: '77-_' }
];

function rs() {
	let r = '';
	let l = Math.floor(Math.random() * 100);
	while (r.length < l) {
		r += String.fromCharCode(Math.floor(Math.random() * 256));
	}
	return r;
}

function rus() {
	let r = '';
	let l = Math.floor(Math.random() * 100);
	while (r.length < l) {
		r += String.fromCharCode(Math.floor(Math.random() * 65536));
	}
	return r;
}

function rh() {
	let r = '';
	let l = Math.floor(Math.random() * 100) * 2;
	while (r.length < l) {
		r += Math.floor(Math.random() * 16).toString(16);
	}
	return r;
}

function ra() {
	let r = [];
	let l = Math.floor(Math.random() * 100);
	while (r.length < l) {
		r.push(Math.floor(Math.random() * 256));
	}
	return r;
}

function cmp(a, b) {
	if ((typeof(a) === 'string') && (typeof(b) === 'string')) {
		return a === b;
	}
	if (Array.isArray(a) && Array.isArray(b)) {
		return a.join(',') === b.join(',');
	}
}

(async function() {
	try {
		for (let i = 0; i < 10000; i++) {
			let s = rs();
			assert(cmp(b64ux.decode(b64ux.encode(s)), s));
			let m = rus();
			assert(cmp(b64ux.decode(b64ux.encode(m)), m));
			let h = rh();
			assert(cmp(b64ux.decode(b64ux.encode(h, 'hex'), 'hex'), h));
			let a = ra();
			assert(cmp(b64ux.decode(b64ux.encode(a), 'array'), a));
		}
		for (let i = 0; i < tv.length; i++) {
			assert(cmp(b64ux.encode(tv[i].r), tv[i].b));
			assert(cmp(b64ux.decode(tv[i].b), tv[i].r));
		}
	} catch(e) {
		console.log(e);
		process.exit(1);
	}
})();

