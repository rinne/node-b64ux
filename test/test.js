'use strict';

const assert = require('assert');

const b64ux = require('../b64ux.js');

function rs() {
	let r = '';
	let l = Math.floor(Math.random() * 100);
	while (r.length < l) {
		r += String.fromCharCode(Math.floor(Math.random() * 256));
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
			let h = rh();
			assert(cmp(b64ux.decode(b64ux.encode(h, 'hex'), 'hex'), h));
			let a = ra();
			assert(cmp(b64ux.decode(b64ux.encode(a), 'array'), a));
		}
	} catch(e) {
		console.log(e);
		process.exit(1);
	}
})();
