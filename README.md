Extended BASE64URL Encoder
==========================

This is a self-contined BASE64URL encoder and decoder that is
compatible not only with Node.JS but also other runtimes such as React
Native. The target is not the highest possible performance, but
instead high compatibility and direct API to encode and decode between
different import/export formats like raw strings, hexadecimal strings,
and arrays.


Reference
=========

b64ux.encode(input, format)
---------------------------

Encodes the input to BASE64URL string.

Argument input is either a string or array or typed array (Uint8Array
or Int8Array).

Format can be omitted, in which case string input is handled as a raw
string and array or typed array input is handled as a array of
integers each of which represents one byte of input.

Allowed format values are 'string', 'hex', 'array', 'uint8array', and
'int8array'. If a format is given, it must match the input
value. Format 'hex' stands for input string which is encoded as in
hexadecimal.

Returns the input encoded as BASE64URL string.

b64ux.decode(input, format)
---------------------------

Encodes the BASE64URL string submitted as input.

Argument input is a string.

Format can be omitted, in which case the output will default to 'string'.

Allowed format values are 'string', 'hex', 'array', 'uint8array', and
'int8arry'. Format 'string' returns the decoded data as a raw
string. Format 'hex' returns the decoded data as hexadecimal
string. Formats 'array', 'uint8array', and 'int8array' return the
decoded data as an Array, UInt8Array or Int8Array respectively. All
array formats are arrays of integers in which each integer represents
one output byte.


Author
======

Timo J. Rinne <tri@iki.fi>


License
=======

MIT License
