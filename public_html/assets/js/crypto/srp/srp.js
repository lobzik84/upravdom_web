function SHA256(s) {
    var chrsz = 8;
    var hexcase = 0;

    function safe_add(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF)
    }

    function S(X, n) {
        return (X >>> n) | (X << (32 - n))
    }

    function R(X, n) {
        return (X >>> n)
    }

    function Ch(x, y, z) {
        return ((x & y) ^ ((~x) & z))
    }

    function Maj(x, y, z) {
        return ((x & y) ^ (x & z) ^ (y & z))
    }

    function Sigma0256(x) {
        return (S(x, 2) ^ S(x, 13) ^ S(x, 22))
    }

    function Sigma1256(x) {
        return (S(x, 6) ^ S(x, 11) ^ S(x, 25))
    }

    function Gamma0256(x) {
        return (S(x, 7) ^ S(x, 18) ^ R(x, 3))
    }

    function Gamma1256(x) {
        return (S(x, 17) ^ S(x, 19) ^ R(x, 10))
    }

    function core_sha256(m, l) {
        var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
        var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
        var W = new Array(64);
        var a, b, c, d, e, f, g, h, i, j;
        var T1, T2;
        m[l >> 5] |= 0x80 << (24 - l % 32);
        m[((l + 64 >> 9) << 4) + 15] = l;
        for (var i = 0; i < m.length; i += 16) {
            a = HASH[0];
            b = HASH[1];
            c = HASH[2];
            d = HASH[3];
            e = HASH[4];
            f = HASH[5];
            g = HASH[6];
            h = HASH[7];
            for (var j = 0; j < 64; j++) {
                if (j < 16)
                    W[j] = m[j + i];
                else
                    W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
                T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
                T2 = safe_add(Sigma0256(a), Maj(a, b, c));
                h = g;
                g = f;
                f = e;
                e = safe_add(d, T1);
                d = c;
                c = b;
                b = a;
                a = safe_add(T1, T2)
            }
            HASH[0] = safe_add(a, HASH[0]);
            HASH[1] = safe_add(b, HASH[1]);
            HASH[2] = safe_add(c, HASH[2]);
            HASH[3] = safe_add(d, HASH[3]);
            HASH[4] = safe_add(e, HASH[4]);
            HASH[5] = safe_add(f, HASH[5]);
            HASH[6] = safe_add(g, HASH[6]);
            HASH[7] = safe_add(h, HASH[7])
        }
        return HASH
    }

    function str2binb(str) {
        var bin = Array();
        var mask = (1 << chrsz) - 1;
        for (var i = 0; i < str.length * chrsz; i += chrsz) {
            bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32)
        }
        return bin
    }

    function Utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c)
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128)
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128)
            }
        }
        return utftext
    }

    function binb2hex(binarray) {
        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for (var i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) + hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF)
        }
        return str
    }
    s = Utf8Encode(s);
    return binb2hex(core_sha256(str2binb(s), s.length * chrsz))
}

function Arcfour() {
    this.i = 0;
    this.j = 0;
    this.S = new Array()
}

function ARC4init(key) {
    var i, j, t;
    for (i = 0; i < 256; ++i)
        this.S[i] = i;
    j = 0;
    for (i = 0; i < 256; ++i) {
        j = (j + this.S[i] + key[i % key.length]) & 255;
        t = this.S[i];
        this.S[i] = this.S[j];
        this.S[j] = t
    }
    this.i = 0;
    this.j = 0
}

function ARC4next() {
    var t;
    this.i = (this.i + 1) & 255;
    this.j = (this.j + this.S[this.i]) & 255;
    t = this.S[this.i];
    this.S[this.i] = this.S[this.j];
    this.S[this.j] = t;
    return this.S[(t + this.S[this.i]) & 255]
}
Arcfour.prototype.init = ARC4init;
Arcfour.prototype.next = ARC4next;

function prng_newstate() {
    return new Arcfour()
}
var rng_psize = 256;
var rng_state;
var rng_pool;
var rng_pptr;

function rng_seed_int(x) {
    rng_pool[rng_pptr++] ^= x & 255;
    rng_pool[rng_pptr++] ^= (x >> 8) & 255;
    rng_pool[rng_pptr++] ^= (x >> 16) & 255;
    rng_pool[rng_pptr++] ^= (x >> 24) & 255;
    if (rng_pptr >= rng_psize)
        rng_pptr -= rng_psize
}

function rng_seed_time() {
    rng_seed_int(new Date().getTime())
}
if (rng_pool == null) {
    rng_pool = new Array();
    rng_pptr = 0;
    var t;
    if (navigator.appName == "Netscape" && navigator.appVersion < "5" && window.crypto) {
        var z = window.crypto.random(32);
        for (t = 0; t < z.length; ++t)
            rng_pool[rng_pptr++] = z.charCodeAt(t) & 255
    }
    while (rng_pptr < rng_psize) {
        t = Math.floor(65536 * Math.random());
        rng_pool[rng_pptr++] = t >>> 8;
        rng_pool[rng_pptr++] = t & 255
    }
    rng_pptr = 0;
    rng_seed_time();
}

function rng_get_byte() {
    if (rng_state == null) {
        rng_seed_time();
        rng_state = prng_newstate();
        rng_state.init(rng_pool);
        for (rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr)
            rng_pool[rng_pptr] = 0;
        rng_pptr = 0;
    }
    return rng_state.next()
}

function rng_get_bytes(ba) {
    var i;
    for (i = 0; i < ba.length; ++i)
        ba[i] = rng_get_byte()
}

function SecureRandom() {}
SecureRandom.prototype.nextBytes = rng_get_bytes;
var dbits;
var canary = 0xdeadbeefcafe;
var j_lm = ((canary & 0xffffff) == 0xefcafe);

function BigInteger(a, b, c) {
    if (a != null)
        if ("number" == typeof a)
            this.fromNumber(a, b, c);
        else if (b == null && "string" != typeof a)
            this.fromString(a, 256);
        else
            this.fromString(a, b)
}

function nbi() {
    return new BigInteger(null)
}

function am1(i, x, w, j, c, n) {
    while (--n >= 0) {
        var v = x * this[i++] + w[j] + c;
        c = Math.floor(v / 0x4000000);
        w[j++] = v & 0x3ffffff
    }
    return c
}

function am2(i, x, w, j, c, n) {
    var xl = x & 0x7fff,
            xh = x >> 15;
    while (--n >= 0) {
        var l = this[i] & 0x7fff;
        var h = this[i++] >> 15;
        var m = xh * l + h * xl;
        l = xl * l + ((m & 0x7fff) << 15) + w[j] + (c & 0x3fffffff);
        c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
        w[j++] = l & 0x3fffffff
    }
    return c
}

function am3(i, x, w, j, c, n) {
    var xl = x & 0x3fff,
            xh = x >> 14;
    while (--n >= 0) {
        var l = this[i] & 0x3fff;
        var h = this[i++] >> 14;
        var m = xh * l + h * xl;
        l = xl * l + ((m & 0x3fff) << 14) + w[j] + c;
        c = (l >> 28) + (m >> 14) + xh * h;
        w[j++] = l & 0xfffffff
    }
    return c
}
if (j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
    BigInteger.prototype.am = am2;
    dbits = 30
} else if (j_lm && (navigator.appName != "Netscape")) {
    BigInteger.prototype.am = am1;
    dbits = 26
} else {
    BigInteger.prototype.am = am3;
    dbits = 28
}
BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = ((1 << dbits) - 1);
BigInteger.prototype.DV = (1 << dbits);
var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2, BI_FP);
BigInteger.prototype.F1 = BI_FP - dbits;
BigInteger.prototype.F2 = 2 * dbits - BI_FP;
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
var BI_RC = new Array();
var rr, vv;
rr = "0".charCodeAt(0);
for (vv = 0; vv <= 9; ++vv)
    BI_RC[rr++] = vv;
rr = "a".charCodeAt(0);
for (vv = 10; vv < 36; ++vv)
    BI_RC[rr++] = vv;
rr = "A".charCodeAt(0);
for (vv = 10; vv < 36; ++vv)
    BI_RC[rr++] = vv;

function int2char(n) {
    return BI_RM.charAt(n)
}

function intAt(s, i) {
    var c = BI_RC[s.charCodeAt(i)];
    return (c == null) ? -1 : c
}

function bnpCopyTo(r) {
    for (var i = this.t - 1; i >= 0; --i)
        r[i] = this[i];
    r.t = this.t;
    r.s = this.s
}

function bnpFromInt(x) {
    this.t = 1;
    this.s = (x < 0) ? -1 : 0;
    if (x > 0)
        this[0] = x;
    else if (x < -1)
        this[0] = x + DV;
    else
        this.t = 0
}

function nbv(i) {
    var r = nbi();
    r.fromInt(i);
    return r
}

function bnpFromString(s, b) {
    var k;
    if (b == 16)
        k = 4;
    else if (b == 8)
        k = 3;
    else if (b == 256)
        k = 8;
    else if (b == 2)
        k = 1;
    else if (b == 32)
        k = 5;
    else if (b == 4)
        k = 2;
    else {
        this.fromRadix(s, b);
        return
    }
    this.t = 0;
    this.s = 0;
    var i = s.length,
            mi = false,
            sh = 0;
    while (--i >= 0) {
        var x = (k == 8) ? s[i] & 0xff : intAt(s, i);
        if (x < 0) {
            if (s.charAt(i) == "-")
                mi = true;
            continue
        }
        mi = false;
        if (sh == 0)
            this[this.t++] = x;
        else if (sh + k > this.DB) {
            this[this.t - 1] |= (x & ((1 << (this.DB - sh)) - 1)) << sh;
            this[this.t++] = (x >> (this.DB - sh))
        } else
            this[this.t - 1] |= x << sh;
        sh += k;
        if (sh >= this.DB)
            sh -= this.DB
    }
    if (k == 8 && (s[0] & 0x80) != 0) {
        this.s = -1;
        if (sh > 0)
            this[this.t - 1] |= ((1 << (this.DB - sh)) - 1) << sh
    }
    this.clamp();
    if (mi)
        BigInteger.ZERO.subTo(this, this)
}

function bnpClamp() {
    var c = this.s & this.DM;
    while (this.t > 0 && this[this.t - 1] == c)
        --this.t
}

function bnToString(b) {
    if (this.s < 0)
        return "-" + this.negate().toString(b);
    var k;
    if (b == 16)
        k = 4;
    else if (b == 8)
        k = 3;
    else if (b == 2)
        k = 1;
    else if (b == 32)
        k = 5;
    else if (b == 4)
        k = 2;
    else
        return this.toRadix(b);
    var km = (1 << k) - 1,
            d, m = false,
            r = "",
            i = this.t;
    var p = this.DB - (i * this.DB) % k;
    if (i-- > 0) {
        if (p < this.DB && (d = this[i] >> p) > 0) {
            m = true;
            r = int2char(d)
        }
        while (i >= 0) {
            if (p < k) {
                d = (this[i] & ((1 << p) - 1)) << (k - p);
                d |= this[--i] >> (p += this.DB - k)
            } else {
                d = (this[i] >> (p -= k)) & km;
                if (p <= 0) {
                    p += this.DB;
                    --i
                }
            }
            if (d > 0)
                m = true;
            if (m)
                r += int2char(d)
        }
    }
    return m ? r : "0"
}

function bnNegate() {
    var r = nbi();
    BigInteger.ZERO.subTo(this, r);
    return r
}

function bnAbs() {
    return (this.s < 0) ? this.negate() : this
}

function bnCompareTo(a) {
    var r = this.s - a.s;
    if (r != 0)
        return r;
    var i = this.t;
    r = i - a.t;
    if (r != 0)
        return r;
    while (--i >= 0)
        if ((r = this[i] - a[i]) != 0)
            return r;
    return 0
}

function nbits(x) {
    var r = 1,
            t;
    if ((t = x >>> 16) != 0) {
        x = t;
        r += 16
    }
    if ((t = x >> 8) != 0) {
        x = t;
        r += 8
    }
    if ((t = x >> 4) != 0) {
        x = t;
        r += 4
    }
    if ((t = x >> 2) != 0) {
        x = t;
        r += 2
    }
    if ((t = x >> 1) != 0) {
        x = t;
        r += 1
    }
    return r
}

function bnBitLength() {
    if (this.t <= 0)
        return 0;
    return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ (this.s & this.DM))
}

function bnpDLShiftTo(n, r) {
    var i;
    for (i = this.t - 1; i >= 0; --i)
        r[i + n] = this[i];
    for (i = n - 1; i >= 0; --i)
        r[i] = 0;
    r.t = this.t + n;
    r.s = this.s
}

function bnpDRShiftTo(n, r) {
    for (var i = n; i < this.t; ++i)
        r[i - n] = this[i];
    r.t = Math.max(this.t - n, 0);
    r.s = this.s
}

function bnpLShiftTo(n, r) {
    var bs = n % this.DB;
    var cbs = this.DB - bs;
    var bm = (1 << cbs) - 1;
    var ds = Math.floor(n / this.DB),
            c = (this.s << bs) & this.DM,
            i;
    for (i = this.t - 1; i >= 0; --i) {
        r[i + ds + 1] = (this[i] >> cbs) | c;
        c = (this[i] & bm) << bs
    }
    for (i = ds - 1; i >= 0; --i)
        r[i] = 0;
    r[ds] = c;
    r.t = this.t + ds + 1;
    r.s = this.s;
    r.clamp()
}

function bnpRShiftTo(n, r) {
    r.s = this.s;
    var ds = Math.floor(n / this.DB);
    if (ds >= this.t) {
        r.t = 0;
        return
    }
    var bs = n % this.DB;
    var cbs = this.DB - bs;
    var bm = (1 << bs) - 1;
    r[0] = this[ds] >> bs;
    for (var i = ds + 1; i < this.t; ++i) {
        r[i - ds - 1] |= (this[i] & bm) << cbs;
        r[i - ds] = this[i] >> bs
    }
    if (bs > 0)
        r[this.t - ds - 1] |= (this.s & bm) << cbs;
    r.t = this.t - ds;
    r.clamp()
}

function bnpSubTo(a, r) {
    var i = 0,
            c = 0,
            m = Math.min(a.t, this.t);
    while (i < m) {
        c += this[i] - a[i];
        r[i++] = c & this.DM;
        c >>= this.DB
    }
    if (a.t < this.t) {
        c -= a.s;
        while (i < this.t) {
            c += this[i];
            r[i++] = c & this.DM;
            c >>= this.DB
        }
        c += this.s
    } else {
        c += this.s;
        while (i < a.t) {
            c -= a[i];
            r[i++] = c & this.DM;
            c >>= this.DB
        }
        c -= a.s
    }
    r.s = (c < 0) ? -1 : 0;
    if (c < -1)
        r[i++] = this.DV + c;
    else if (c > 0)
        r[i++] = c;
    r.t = i;
    r.clamp()
}

function bnpMultiplyTo(a, r) {
    var x = this.abs(),
            y = a.abs();
    var i = x.t;
    r.t = i + y.t;
    while (--i >= 0)
        r[i] = 0;
    for (i = 0; i < y.t; ++i)
        r[i + x.t] = x.am(0, y[i], r, i, 0, x.t);
    r.s = 0;
    r.clamp();
    if (this.s != a.s)
        BigInteger.ZERO.subTo(r, r)
}

function bnpSquareTo(r) {
    var x = this.abs();
    var i = r.t = 2 * x.t;
    while (--i >= 0)
        r[i] = 0;
    for (i = 0; i < x.t - 1; ++i) {
        var c = x.am(i, x[i], r, 2 * i, 0, 1);
        if ((r[i + x.t] += x.am(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
            r[i + x.t] -= x.DV;
            r[i + x.t + 1] = 1
        }
    }
    if (r.t > 0)
        r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1);
    r.s = 0;
    r.clamp()
}

function bnpDivRemTo(m, q, r) {
    var pm = m.abs();
    if (pm.t <= 0)
        return;
    var pt = this.abs();
    if (pt.t < pm.t) {
        if (q != null)
            q.fromInt(0);
        if (r != null)
            this.copyTo(r);
        return
    }
    if (r == null)
        r = nbi();
    var y = nbi(),
            ts = this.s,
            ms = m.s;
    var nsh = this.DB - nbits(pm[pm.t - 1]);
    if (nsh > 0) {
        pm.lShiftTo(nsh, y);
        pt.lShiftTo(nsh, r)
    } else {
        pm.copyTo(y);
        pt.copyTo(r)
    }
    var ys = y.t;
    var y0 = y[ys - 1];
    if (y0 == 0)
        return;
    var yt = y0 * (1 << this.F1) + ((ys > 1) ? y[ys - 2] >> this.F2 : 0);
    var d1 = this.FV / yt,
            d2 = (1 << this.F1) / yt,
            e = 1 << this.F2;
    var i = r.t,
            j = i - ys,
            t = (q == null) ? nbi() : q;
    y.dlShiftTo(j, t);
    if (r.compareTo(t) >= 0) {
        r[r.t++] = 1;
        r.subTo(t, r)
    }
    BigInteger.ONE.dlShiftTo(ys, t);
    t.subTo(y, y);
    while (y.t < ys)
        y[y.t++] = 0;
    while (--j >= 0) {
        var qd = (r[--i] == y0) ? this.DM : Math.floor(r[i] * d1 + (r[i - 1] + e) * d2);
        if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd) {
            y.dlShiftTo(j, t);
            r.subTo(t, r);
            while (r[i] < --qd)
                r.subTo(t, r)
        }
    }
    if (q != null) {
        r.drShiftTo(ys, q);
        if (ts != ms)
            BigInteger.ZERO.subTo(q, q)
    }
    r.t = ys;
    r.clamp();
    if (nsh > 0)
        r.rShiftTo(nsh, r);
    if (ts < 0)
        BigInteger.ZERO.subTo(r, r)
}

function bnMod(a) {
    var r = nbi();
    this.abs().divRemTo(a, null, r);
    if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0)
        a.subTo(r, r);
    return r
}

function Classic(m) {
    this.m = m
}

function cConvert(x) {
    if (x.s < 0 || x.compareTo(this.m) >= 0)
        return x.mod(this.m);
    else
        return x
}

function cRevert(x) {
    return x
}

function cReduce(x) {
    x.divRemTo(this.m, null, x)
}

function cMulTo(x, y, r) {
    x.multiplyTo(y, r);
    this.reduce(r)
}

function cSqrTo(x, r) {
    x.squareTo(r);
    this.reduce(r)
}
Classic.prototype.convert = cConvert;
Classic.prototype.revert = cRevert;
Classic.prototype.reduce = cReduce;
Classic.prototype.mulTo = cMulTo;
Classic.prototype.sqrTo = cSqrTo;

function bnpInvDigit() {
    if (this.t < 1)
        return 0;
    var x = this[0];
    if ((x & 1) == 0)
        return 0;
    var y = x & 3;
    y = (y * (2 - (x & 0xf) * y)) & 0xf;
    y = (y * (2 - (x & 0xff) * y)) & 0xff;
    y = (y * (2 - (((x & 0xffff) * y) & 0xffff))) & 0xffff;
    y = (y * (2 - x * y % this.DV)) % this.DV;
    return (y > 0) ? this.DV - y : -y
}

function Montgomery(m) {
    this.m = m;
    this.mp = m.invDigit();
    this.mpl = this.mp & 0x7fff;
    this.mph = this.mp >> 15;
    this.um = (1 << (m.DB - 15)) - 1;
    this.mt2 = 2 * m.t
}

function montConvert(x) {
    var r = nbi();
    x.abs().dlShiftTo(this.m.t, r);
    r.divRemTo(this.m, null, r);
    if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0)
        this.m.subTo(r, r);
    return r
}

function montRevert(x) {
    var r = nbi();
    x.copyTo(r);
    this.reduce(r);
    return r
}

function montReduce(x) {
    while (x.t <= this.mt2)
        x[x.t++] = 0;
    for (var i = 0; i < this.m.t; ++i) {
        var j = x[i] & 0x7fff;
        var u0 = (j * this.mpl + (((j * this.mph + (x[i] >> 15) * this.mpl) & this.um) << 15)) & x.DM;
        j = i + this.m.t;
        x[j] += this.m.am(0, u0, x, i, 0, this.m.t);
        while (x[j] >= x.DV) {
            x[j] -= x.DV;
            x[++j]++
        }
    }
    x.clamp();
    x.drShiftTo(this.m.t, x);
    if (x.compareTo(this.m) >= 0)
        x.subTo(this.m, x)
}

function montSqrTo(x, r) {
    x.squareTo(r);
    this.reduce(r)
}

function montMulTo(x, y, r) {
    x.multiplyTo(y, r);
    this.reduce(r)
}
Montgomery.prototype.convert = montConvert;
Montgomery.prototype.revert = montRevert;
Montgomery.prototype.reduce = montReduce;
Montgomery.prototype.mulTo = montMulTo;
Montgomery.prototype.sqrTo = montSqrTo;

function bnpIsEven() {
    return ((this.t > 0) ? (this[0] & 1) : this.s) == 0
}

function bnpExp(e, z) {
    if (e > 0xffffffff || e < 1)
        return BigInteger.ONE;
    var r = nbi(),
            r2 = nbi(),
            g = z.convert(this),
            i = nbits(e) - 1;
    g.copyTo(r);
    while (--i >= 0) {
        z.sqrTo(r, r2);
        if ((e & (1 << i)) > 0)
            z.mulTo(r2, g, r);
        else {
            var t = r;
            r = r2;
            r2 = t
        }
    }
    return z.revert(r)
}

function bnModPowInt(e, m) {
    var z;
    if (e < 256 || m.isEven())
        z = new Classic(m);
    else
        z = new Montgomery(m);
    return this.exp(e, z)
}
BigInteger.prototype.copyTo = bnpCopyTo;
BigInteger.prototype.fromInt = bnpFromInt;
BigInteger.prototype.fromString = bnpFromString;
BigInteger.prototype.clamp = bnpClamp;
BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
BigInteger.prototype.drShiftTo = bnpDRShiftTo;
BigInteger.prototype.lShiftTo = bnpLShiftTo;
BigInteger.prototype.rShiftTo = bnpRShiftTo;
BigInteger.prototype.subTo = bnpSubTo;
BigInteger.prototype.multiplyTo = bnpMultiplyTo;
BigInteger.prototype.squareTo = bnpSquareTo;
BigInteger.prototype.divRemTo = bnpDivRemTo;
BigInteger.prototype.invDigit = bnpInvDigit;
BigInteger.prototype.isEven = bnpIsEven;
BigInteger.prototype.exp = bnpExp;
BigInteger.prototype.toString = bnToString;
BigInteger.prototype.negate = bnNegate;
BigInteger.prototype.abs = bnAbs;
BigInteger.prototype.compareTo = bnCompareTo;
BigInteger.prototype.bitLength = bnBitLength;
BigInteger.prototype.mod = bnMod;
BigInteger.prototype.modPowInt = bnModPowInt;
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);

function bnClone() {
    var r = nbi();
    this.copyTo(r);
    return r
}

function bnIntValue() {
    if (this.s < 0) {
        if (this.t == 1)
            return this[0] - this.DV;
        else if (this.t == 0)
            return -1
    } else if (this.t == 1)
        return this[0];
    else if (this.t == 0)
        return 0;
    return ((this[1] & ((1 << (32 - this.DB)) - 1)) << this.DB) | this[0]
}

function bnByteValue() {
    return (this.t == 0) ? this.s : (this[0] << 24) >> 24
}

function bnShortValue() {
    return (this.t == 0) ? this.s : (this[0] << 16) >> 16
}

function bnpChunkSize(r) {
    return Math.floor(Math.LN2 * this.DB / Math.log(r))
}

function bnSigNum() {
    if (this.s < 0)
        return -1;
    else if (this.t <= 0 || (this.t == 1 && this[0] <= 0))
        return 0;
    else
        return 1
}

function bnpToRadix(b) {
    if (b == null)
        b = 10;
    if (this.signum() == 0 || b < 2 || b > 36)
        return "0";
    var cs = this.chunkSize(b);
    var a = Math.pow(b, cs);
    var d = nbv(a),
            y = nbi(),
            z = nbi(),
            r = "";
    this.divRemTo(d, y, z);
    while (y.signum() > 0) {
        r = (a + z.intValue()).toString(b).substr(1) + r;
        y.divRemTo(d, y, z)
    }
    return z.intValue().toString(b) + r
}

function bnpFromRadix(s, b) {
    this.fromInt(0);
    if (b == null)
        b = 10;
    var cs = this.chunkSize(b);
    var d = Math.pow(b, cs),
            mi = false,
            j = 0,
            w = 0;
    for (var i = 0; i < s.length; ++i) {
        var x = intAt(s, i);
        if (x < 0) {
            if (s.charAt(i) == "-" && this.signum() == 0)
                mi = true;
            continue
        }
        w = b * w + x;
        if (++j >= cs) {
            this.dMultiply(d);
            this.dAddOffset(w, 0);
            j = 0;
            w = 0
        }
    }
    if (j > 0) {
        this.dMultiply(Math.pow(b, j));
        this.dAddOffset(w, 0)
    }
    if (mi)
        BigInteger.ZERO.subTo(this, this)
}

function bnpFromNumber(a, b, c) {
    if ("number" == typeof b) {
        if (a < 2)
            this.fromInt(1);
        else {
            this.fromNumber(a, c);
            if (!this.testBit(a - 1))
                this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, this);
            if (this.isEven())
                this.dAddOffset(1, 0);
            while (!this.isProbablePrime(b)) {
                this.dAddOffset(2, 0);
                if (this.bitLength() > a)
                    this.subTo(BigInteger.ONE.shiftLeft(a - 1), this)
            }
        }
    } else {
        var x = new Array(),
                t = a & 7;
        x.length = (a >> 3) + 1;
        b.nextBytes(x);
        if (t > 0)
            x[0] &= ((1 << t) - 1);
        else
            x[0] = 0;
        this.fromString(x, 256)
    }
}

function bnToByteArray() {
    var i = this.t,
            r = new Array();
    r[0] = this.s;
    var p = this.DB - (i * this.DB) % 8,
            d, k = 0;
    if (i-- > 0) {
        if (p < this.DB && (d = this[i] >> p) != (this.s & this.DM) >> p)
            r[k++] = d | (this.s << (this.DB - p));
        while (i >= 0) {
            if (p < 8) {
                d = (this[i] & ((1 << p) - 1)) << (8 - p);
                d |= this[--i] >> (p += this.DB - 8)
            } else {
                d = (this[i] >> (p -= 8)) & 0xff;
                if (p <= 0) {
                    p += this.DB;
                    --i
                }
            }
            if ((d & 0x80) != 0)
                d |= -256;
            if (k == 0 && (this.s & 0x80) != (d & 0x80))
                ++k;
            if (k > 0 || d != this.s)
                r[k++] = d
        }
    }
    return r
}

function bnEquals(a) {
    return (this.compareTo(a) == 0)
}

function bnMin(a) {
    return (this.compareTo(a) < 0) ? this : a
}

function bnMax(a) {
    return (this.compareTo(a) > 0) ? this : a
}

function bnpBitwiseTo(a, op, r) {
    var i, f, m = Math.min(a.t, this.t);
    for (i = 0; i < m; ++i)
        r[i] = op(this[i], a[i]);
    if (a.t < this.t) {
        f = a.s & this.DM;
        for (i = m; i < this.t; ++i)
            r[i] = op(this[i], f);
        r.t = this.t
    } else {
        f = this.s & this.DM;
        for (i = m; i < a.t; ++i)
            r[i] = op(f, a[i]);
        r.t = a.t
    }
    r.s = op(this.s, a.s);
    r.clamp()
}

function op_and(x, y) {
    return x & y
}

function bnAnd(a) {
    var r = nbi();
    this.bitwiseTo(a, op_and, r);
    return r
}

function op_or(x, y) {
    return x | y
}

function bnOr(a) {
    var r = nbi();
    this.bitwiseTo(a, op_or, r);
    return r
}

function op_xor(x, y) {
    return x ^ y
}

function bnXor(a) {
    var r = nbi();
    this.bitwiseTo(a, op_xor, r);
    return r
}

function op_andnot(x, y) {
    return x & ~y
}

function bnAndNot(a) {
    var r = nbi();
    this.bitwiseTo(a, op_andnot, r);
    return r
}

function bnNot() {
    var r = nbi();
    for (var i = 0; i < this.t; ++i)
        r[i] = this.DM & ~this[i];
    r.t = this.t;
    r.s = ~this.s;
    return r
}

function bnShiftLeft(n) {
    var r = nbi();
    if (n < 0)
        this.rShiftTo(-n, r);
    else
        this.lShiftTo(n, r);
    return r
}

function bnShiftRight(n) {
    var r = nbi();
    if (n < 0)
        this.lShiftTo(-n, r);
    else
        this.rShiftTo(n, r);
    return r
}

function lbit(x) {
    if (x == 0)
        return -1;
    var r = 0;
    if ((x & 0xffff) == 0) {
        x >>= 16;
        r += 16
    }
    if ((x & 0xff) == 0) {
        x >>= 8;
        r += 8
    }
    if ((x & 0xf) == 0) {
        x >>= 4;
        r += 4
    }
    if ((x & 3) == 0) {
        x >>= 2;
        r += 2
    }
    if ((x & 1) == 0)
        ++r;
    return r
}

function bnGetLowestSetBit() {
    for (var i = 0; i < this.t; ++i)
        if (this[i] != 0)
            return i * this.DB + lbit(this[i]);
    if (this.s < 0)
        return this.t * this.DB;
    return -1
}

function cbit(x) {
    var r = 0;
    while (x != 0) {
        x &= x - 1;
        ++r
    }
    return r
}

function bnBitCount() {
    var r = 0,
            x = this.s & this.DM;
    for (var i = 0; i < this.t; ++i)
        r += cbit(this[i] ^ x);
    return r
}

function bnTestBit(n) {
    var j = Math.floor(n / this.DB);
    if (j >= this.t)
        return (this.s != 0);
    return ((this[j] & (1 << (n % this.DB))) != 0)
}

function bnpChangeBit(n, op) {
    var r = BigInteger.ONE.shiftLeft(n);
    this.bitwiseTo(r, op, r);
    return r
}

function bnSetBit(n) {
    return this.changeBit(n, op_or)
}

function bnClearBit(n) {
    return this.changeBit(n, op_andnot)
}

function bnFlipBit(n) {
    return this.changeBit(n, op_xor)
}

function bnpAddTo(a, r) {
    var i = 0,
            c = 0,
            m = Math.min(a.t, this.t);
    while (i < m) {
        c += this[i] + a[i];
        r[i++] = c & this.DM;
        c >>= this.DB
    }
    if (a.t < this.t) {
        c += a.s;
        while (i < this.t) {
            c += this[i];
            r[i++] = c & this.DM;
            c >>= this.DB
        }
        c += this.s
    } else {
        c += this.s;
        while (i < a.t) {
            c += a[i];
            r[i++] = c & this.DM;
            c >>= this.DB
        }
        c += a.s
    }
    r.s = (c < 0) ? -1 : 0;
    if (c > 0)
        r[i++] = c;
    else if (c < -1)
        r[i++] = this.DV + c;
    r.t = i;
    r.clamp()
}

function bnAdd(a) {
    var r = nbi();
    this.addTo(a, r);
    return r
}

function bnSubtract(a) {
    var r = nbi();
    this.subTo(a, r);
    return r
}

function bnMultiply(a) {
    var r = nbi();
    this.multiplyTo(a, r);
    return r
}

function bnDivide(a) {
    var r = nbi();
    this.divRemTo(a, r, null);
    return r
}

function bnRemainder(a) {
    var r = nbi();
    this.divRemTo(a, null, r);
    return r
}

function bnDivideAndRemainder(a) {
    var q = nbi(),
            r = nbi();
    this.divRemTo(a, q, r);
    return new Array(q, r)
}

function bnpDMultiply(n) {
    this[this.t] = this.am(0, n - 1, this, 0, 0, this.t);
    ++this.t;
    this.clamp()
}

function bnpDAddOffset(n, w) {
    while (this.t <= w)
        this[this.t++] = 0;
    this[w] += n;
    while (this[w] >= this.DV) {
        this[w] -= this.DV;
        if (++w >= this.t)
            this[this.t++] = 0;
        ++this[w]
    }
}

function NullExp() {}

function nNop(x) {
    return x
}

function nMulTo(x, y, r) {
    x.multiplyTo(y, r)
}

function nSqrTo(x, r) {
    x.squareTo(r)
}
NullExp.prototype.convert = nNop;
NullExp.prototype.revert = nNop;
NullExp.prototype.mulTo = nMulTo;
NullExp.prototype.sqrTo = nSqrTo;

function bnPow(e) {
    return this.exp(e, new NullExp())
}

function bnpMultiplyLowerTo(a, n, r) {
    var i = Math.min(this.t + a.t, n);
    r.s = 0;
    r.t = i;
    while (i > 0)
        r[--i] = 0;
    var j;
    for (j = r.t - this.t; i < j; ++i)
        r[i + this.t] = this.am(0, a[i], r, i, 0, this.t);
    for (j = Math.min(a.t, n); i < j; ++i)
        this.am(0, a[i], r, i, 0, n - i);
    r.clamp()
}

function bnpMultiplyUpperTo(a, n, r) {
    --n;
    var i = r.t = this.t + a.t - n;
    r.s = 0;
    while (--i >= 0)
        r[i] = 0;
    for (i = Math.max(n - this.t, 0); i < a.t; ++i)
        r[this.t + i - n] = this.am(n - i, a[i], r, 0, 0, this.t + i - n);
    r.clamp();
    r.drShiftTo(1, r)
}

function Barrett(m) {
    this.r2 = nbi();
    this.q3 = nbi();
    BigInteger.ONE.dlShiftTo(2 * m.t, this.r2);
    this.mu = this.r2.divide(m);
    this.m = m
}

function barrettConvert(x) {
    if (x.s < 0 || x.t > 2 * this.m.t)
        return x.mod(this.m);
    else if (x.compareTo(this.m) < 0)
        return x;
    else {
        var r = nbi();
        x.copyTo(r);
        this.reduce(r);
        return r
    }
}

function barrettRevert(x) {
    return x
}

function barrettReduce(x) {
    x.drShiftTo(this.m.t - 1, this.r2);
    if (x.t > this.m.t + 1) {
        x.t = this.m.t + 1;
        x.clamp()
    }
    this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
    this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
    while (x.compareTo(this.r2) < 0)
        x.dAddOffset(1, this.m.t + 1);
    x.subTo(this.r2, x);
    while (x.compareTo(this.m) >= 0)
        x.subTo(this.m, x)
}

function barrettSqrTo(x, r) {
    x.squareTo(r);
    this.reduce(r)
}

function barrettMulTo(x, y, r) {
    x.multiplyTo(y, r);
    this.reduce(r)
}
Barrett.prototype.convert = barrettConvert;
Barrett.prototype.revert = barrettRevert;
Barrett.prototype.reduce = barrettReduce;
Barrett.prototype.mulTo = barrettMulTo;
Barrett.prototype.sqrTo = barrettSqrTo;

function bnModPow(e, m) {
    var i = e.bitLength(),
            k, r = nbv(1),
            z;
    if (i <= 0)
        return r;
    else if (i < 18)
        k = 1;
    else if (i < 48)
        k = 3;
    else if (i < 144)
        k = 4;
    else if (i < 768)
        k = 5;
    else
        k = 6;
    if (i < 8)
        z = new Classic(m);
    else if (m.isEven())
        z = new Barrett(m);
    else
        z = new Montgomery(m);
    var g = new Array(),
            n = 3,
            k1 = k - 1,
            km = (1 << k) - 1;
    g[1] = z.convert(this);
    if (k > 1) {
        var g2 = nbi();
        z.sqrTo(g[1], g2);
        while (n <= km) {
            g[n] = nbi();
            z.mulTo(g2, g[n - 2], g[n]);
            n += 2
        }
    }
    var j = e.t - 1,
            w, is1 = true,
            r2 = nbi(),
            t;
    i = nbits(e[j]) - 1;
    while (j >= 0) {
        if (i >= k1)
            w = (e[j] >> (i - k1)) & km;
        else {
            w = (e[j] & ((1 << (i + 1)) - 1)) << (k1 - i);
            if (j > 0)
                w |= e[j - 1] >> (this.DB + i - k1)
        }
        n = k;
        while ((w & 1) == 0) {
            w >>= 1;
            --n
        }
        if ((i -= n) < 0) {
            i += this.DB;
            --j
        }
        if (is1) {
            g[w].copyTo(r);
            is1 = false
        } else {
            while (n > 1) {
                z.sqrTo(r, r2);
                z.sqrTo(r2, r);
                n -= 2
            }
            if (n > 0)
                z.sqrTo(r, r2);
            else {
                t = r;
                r = r2;
                r2 = t
            }
            z.mulTo(r2, g[w], r)
        }
        while (j >= 0 && (e[j] & (1 << i)) == 0) {
            z.sqrTo(r, r2);
            t = r;
            r = r2;
            r2 = t;
            if (--i < 0) {
                i = this.DB - 1;
                --j
            }
        }
    }
    return z.revert(r)
}

function bnGCD(a) {
    var x = (this.s < 0) ? this.negate() : this.clone();
    var y = (a.s < 0) ? a.negate() : a.clone();
    if (x.compareTo(y) < 0) {
        var t = x;
        x = y;
        y = t
    }
    var i = x.getLowestSetBit(),
            g = y.getLowestSetBit();
    if (g < 0)
        return x;
    if (i < g)
        g = i;
    if (g > 0) {
        x.rShiftTo(g, x);
        y.rShiftTo(g, y)
    }
    while (x.signum() > 0) {
        if ((i = x.getLowestSetBit()) > 0)
            x.rShiftTo(i, x);
        if ((i = y.getLowestSetBit()) > 0)
            y.rShiftTo(i, y);
        if (x.compareTo(y) >= 0) {
            x.subTo(y, x);
            x.rShiftTo(1, x)
        } else {
            y.subTo(x, y);
            y.rShiftTo(1, y)
        }
    }
    if (g > 0)
        y.lShiftTo(g, y);
    return y
}

function bnpModInt(n) {
    if (n <= 0)
        return 0;
    var d = this.DV % n,
            r = (this.s < 0) ? n - 1 : 0;
    if (this.t > 0)
        if (d == 0)
            r = this[0] % n;
        else
            for (var i = this.t - 1; i >= 0; --i)
                r = (d * r + this[i]) % n;
    return r
}

function bnModInverse(m) {
    var ac = m.isEven();
    if ((this.isEven() && ac) || m.signum() == 0)
        return BigInteger.ZERO;
    var u = m.clone(),
            v = this.clone();
    var a = nbv(1),
            b = nbv(0),
            c = nbv(0),
            d = nbv(1);
    while (u.signum() != 0) {
        while (u.isEven()) {
            u.rShiftTo(1, u);
            if (ac) {
                if (!a.isEven() || !b.isEven()) {
                    a.addTo(this, a);
                    b.subTo(m, b)
                }
                a.rShiftTo(1, a)
            } else if (!b.isEven())
                b.subTo(m, b);
            b.rShiftTo(1, b)
        }
        while (v.isEven()) {
            v.rShiftTo(1, v);
            if (ac) {
                if (!c.isEven() || !d.isEven()) {
                    c.addTo(this, c);
                    d.subTo(m, d)
                }
                c.rShiftTo(1, c)
            } else if (!d.isEven())
                d.subTo(m, d);
            d.rShiftTo(1, d)
        }
        if (u.compareTo(v) >= 0) {
            u.subTo(v, u);
            if (ac)
                a.subTo(c, a);
            b.subTo(d, b)
        } else {
            v.subTo(u, v);
            if (ac)
                c.subTo(a, c);
            d.subTo(b, d)
        }
    }
    if (v.compareTo(BigInteger.ONE) != 0)
        return BigInteger.ZERO;
    if (d.compareTo(m) >= 0)
        return d.subtract(m);
    if (d.signum() < 0)
        d.addTo(m, d);
    else
        return d;
    if (d.signum() < 0)
        return d.add(m);
    else
        return d
}
var lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509];
var lplim = (1 << 26) / lowprimes[lowprimes.length - 1];

function bnIsProbablePrime(t) {
    var i, x = this.abs();
    if (x.t == 1 && x[0] <= lowprimes[lowprimes.length - 1]) {
        for (i = 0; i < lowprimes.length; ++i)
            if (x[0] == lowprimes[i])
                return true;
        return false
    }
    if (x.isEven())
        return false;
    i = 1;
    while (i < lowprimes.length) {
        var m = lowprimes[i],
                j = i + 1;
        while (j < lowprimes.length && m < lplim)
            m *= lowprimes[j++];
        m = x.modInt(m);
        while (i < j)
            if (m % lowprimes[i++] == 0)
                return false
    }
    return x.millerRabin(t)
}

function bnpMillerRabin(t) {
    var n1 = this.subtract(BigInteger.ONE);
    var k = n1.getLowestSetBit();
    if (k <= 0)
        return false;
    var r = n1.shiftRight(k);
    t = (t + 1) >> 1;
    if (t > lowprimes.length)
        t = lowprimes.length;
    var a = nbi();
    for (var i = 0; i < t; ++i) {
        a.fromInt(lowprimes[i]);
        var y = a.modPow(r, this);
        if (y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
            var j = 1;
            while (j++ < k && y.compareTo(n1) != 0) {
                y = y.modPowInt(2, this);
                if (y.compareTo(BigInteger.ONE) == 0)
                    return false
            }
            if (y.compareTo(n1) != 0)
                return false
        }
    }
    return true
}
BigInteger.prototype.chunkSize = bnpChunkSize;
BigInteger.prototype.toRadix = bnpToRadix;
BigInteger.prototype.fromRadix = bnpFromRadix;
BigInteger.prototype.fromNumber = bnpFromNumber;
BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
BigInteger.prototype.changeBit = bnpChangeBit;
BigInteger.prototype.addTo = bnpAddTo;
BigInteger.prototype.dMultiply = bnpDMultiply;
BigInteger.prototype.dAddOffset = bnpDAddOffset;
BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
BigInteger.prototype.modInt = bnpModInt;
BigInteger.prototype.millerRabin = bnpMillerRabin;
BigInteger.prototype.clone = bnClone;
BigInteger.prototype.intValue = bnIntValue;
BigInteger.prototype.byteValue = bnByteValue;
BigInteger.prototype.shortValue = bnShortValue;
BigInteger.prototype.signum = bnSigNum;
BigInteger.prototype.toByteArray = bnToByteArray;
BigInteger.prototype.equals = bnEquals;
BigInteger.prototype.min = bnMin;
BigInteger.prototype.max = bnMax;
BigInteger.prototype.and = bnAnd;
BigInteger.prototype.or = bnOr;
BigInteger.prototype.xor = bnXor;
BigInteger.prototype.andNot = bnAndNot;
BigInteger.prototype.not = bnNot;
BigInteger.prototype.shiftLeft = bnShiftLeft;
BigInteger.prototype.shiftRight = bnShiftRight;
BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
BigInteger.prototype.bitCount = bnBitCount;
BigInteger.prototype.testBit = bnTestBit;
BigInteger.prototype.setBit = bnSetBit;
BigInteger.prototype.clearBit = bnClearBit;
BigInteger.prototype.flipBit = bnFlipBit;
BigInteger.prototype.add = bnAdd;
BigInteger.prototype.subtract = bnSubtract;
BigInteger.prototype.multiply = bnMultiply;
BigInteger.prototype.divide = bnDivide;
BigInteger.prototype.remainder = bnRemainder;
BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
BigInteger.prototype.modPow = bnModPow;
BigInteger.prototype.modInverse = bnModInverse;
BigInteger.prototype.pow = bnPow;
BigInteger.prototype.gcd = bnGCD;
BigInteger.prototype.isProbablePrime = bnIsProbablePrime;

function SRP() {
    this.url = "";
    this.I = "";
    this.p = "";
    this.forward_url = "#";


    this.tries = 0;

    var salt_alphabet = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var Nstr = "115b8b692e0e045692cf280b436735c77a5a9e8a9e7ed56c965f87db5b2a2ece3";
    var N = new BigInteger(Nstr, 16);
    var g = new BigInteger("2");
    var k = new BigInteger("c46d46600d87fef149bd79b81119842f3c20241fda67d06ef412d8f6d9479c58", 16);
    var rng = new SecureRandom();
    var a = new BigInteger(32, rng);
    var A = g.modPow(a, N);
    while (A.mod(N) == 0) {
        a = new BigInteger(32, rng);
        A = g.modPow(a, N)
    }
    var Astr = A.toString(16);
    var salt = null;
    var S = null;
    var K = null;
    var M = null;
    var M2 = null;
    var that = this;
    var authenticated = false;


    var xhr = null;
    this.userId = 0;
    this.boxId = 0;

    this.getI = function () {
        return this.I;
    };
    this.getxhr = function () {
        return xhr;
    };
    this.geturl = function () {
        return this.url;
    };
    this.getg = function () {
        return g;
    };
    this.getN = function () {
        return N;
    };
    this.calcX = function (s) {
        return new BigInteger(SHA256(s + SHA256(this.I + ":" + this.p)), 16)
    };
    this.paths = function (str) {
        return str;
    };
    this.innerxml = function (node) {
        return node.firstChild.nodeValue
    };

    this.generateSalt = function () {
        salt = "";
        for (i = 0; i < 16; i++) {
            var ch = salt_alphabet.charAt(Math.floor(Math.random() * salt_alphabet.length));
            salt += ch;
        }
        return salt;
    };

    this.getVerifier = function () {
        var x = that.calcX(salt);
        var v = that.getg().modPow(x, that.getN());
        return v.toString(16);
    };

    this.identify = function () {
        this.tries++;
        console.log(" SRP Handshaking...");

        var obj = {
            "action": "handshake_srp",
            "login": that.I,
            "srp_A": Astr
        }
        $.ajax({
            type: "POST",
            url: that.url,
            dataType: 'json',
            crossDomain: true,
            async: true,
            data: JSON.stringify(obj),
            success: function (data) {
                if (data["result"] === "success") {
                    localStorage["session_key"] = data["session_key"];
                    console.log(" SRP Authenticating...");
                    calculations(data["salt"], data["srp_B"], that.p);
                    var obj = {
                        "action": "login_srp",
                        "session_key": localStorage["session_key"],
                        "srp_login": that.I,
                        "srp_M": M
                    }
                    $.ajax({
                        type: "POST",
                        url: that.url,
                        dataType: 'json',
                        crossDomain: true,
                        async: true,
                        data: JSON.stringify(obj),
                        success: function (data) {
                            if (data["result"] === "success") {
                                if (data["srp_M"] === M2) {
                                    authenticated = true;
                                    that.tries = 0;
                                    that.userId = data["user_id"];
                                    that.boxId = data["box_id"];
                                    console.log(" Done, redirecting");
                                    success();
                                } else {
                                    console.log("SRP failed, next try...");
                                    if (that.tries < 3)
                                        that.identify();
                                    else
                                        that.error_message("Server key does not match");

                                }
                            } else {
                                alert("Error while SRP login: " + data["message"]);
                            }
                        },
                        fail: function () {
                            alert("Network error while SRP login");
                        }
                    })
                } else {
                    alert("Error while SRP handshake: " + data["message"]);
                }
            },
            fail: function () {
                alert("Network error while SRP handshake");
            }
        })
    };

    function calculations(s, ephemeral, pass) {
        var B = new BigInteger(ephemeral, 16);
        var Bstr = ephemeral;
        var u = new BigInteger(SHA256(Astr + Bstr), 16); //alert(u);
        var x = new BigInteger(SHA256(s + SHA256(that.I + ":" + pass)), 16);
        var kgx = k.multiply(g.modPow(x, N));
        var aux = a.add(u.multiply(x));
        S = B.subtract(kgx).modPow(aux, N); //kealert(S);
        var Mstr = A.toString(16) + B.toString(16) + S.toString(16);
        M = SHA256(Mstr);
        M2 = SHA256(A.toString(16) + M + S.toString(16));
        //if (this.tries < 2) M2 += "fvf";
    }
    ;

   function success() {
        if (that.forward_url.charAt(0) != "#")
            window.location = that.forward_url;
        else {
            window.location = that.forward_url;
            that.success()
        }
    }
    ;

    this.success = function () {
        console.log("Login successful.");
    };

    this.key = function () {
        if (K == null)
            if (authenticated) {
                K = SHA256(S.toString(16));
                return K
            } else
                that.error_message("User has not been authenticated.");
        else
            return K
    };
    this.error_message = function (t) {
        alert(t)
    }
}
;
SRP.prototype.srpPath = document.getElementsByTagName('script')[document.getElementsByTagName('script').length - 1].getAttribute("src");