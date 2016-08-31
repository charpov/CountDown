"use strict";

/** This script exports three functions countDown, countUp and countDownUp that can be used to
* embed text-based time counters into web pages.
*
* @author Michel Charpentier
* @copyright Michel Charpentier 2016 under MIT license
* @version 1.0.1
*/

// The 3 exported functions
var countDown, countUp, countDownUp;

(function () {
  countDown = function (date, args) {
    count(-1, null, date, args);
  };

  countUp = function (date, args) {
    count(1, null, date, args);
  };

  countDownUp = function (date, argsDown, argsUp) {
    count(-1, null, date, argsDown, function (span) {
      count(1, span, date, argsUp);
    });
  };

  /* Main function.  Counts in the given direction (>0 or <0) and updates the given span.
   * If span is null, is it taken to be the enclosing element (which works fine except for the
   * continuation).
   * cont is a function that is called to start the countup after the countdown is finished.
   * It needs the html element to be passed explicitly.
   * args contains the prefix and suffix, refresh rate, granularity and general format.
   */
  function count(dir, span, date, args, cont) {

    /* Formatting function.
     * Parameters are optional, e.g., format(d,h) does not display minutes or seconds.
     */
    function default_format(d, h, m, s) {
      var out = '';
      var H = h ? 1 : 0;
      var M = m ? 1 : 0;
      var S = s ? 1 : 0;

      function mkstr(x, w, c) {
        var str = (x == 1) ? '1' + w : x + w + 's';
        if (c > 1) return str + ', ';
        if (c == 1) return str + ' and ';
        return str;
      }

      if (d > 0) out += mkstr(d, ' day', H + M + S);
      if (typeof h === 'undefined') return out;
      if (h > 0) out += mkstr(h, ' hour', M + S);
      if (typeof m === 'undefined') return out;
      if (m > 0) out += mkstr(m, ' minute', S);
      if (s > 0) out += mkstr(s, ' second', 0);
      return out;
    }

    args = args || {};
    var format = args.format || default_format;
    var refresh = Number(args.refresh) || 1;
    var step = args.step || 'S';

    if (refresh <= 0) throw "refresh time must be positive";

    // values that are less than the limit will be ignored to implement granularity
    var limit;
    switch (step.toString().trim().toUpperCase()) {
      case 'S':
        limit = 1;
        break;
      case 'M':
        limit = 60;
        break;
      case 'H':
        limit = 3600;
        break;
      case 'D':
        limit = 86400;
        break;
      default:
        throw "step must be one of 'D', 'H', 'M' or 'S'"
    }

    var prefix = args.prefix || '';
    var suffix = args.suffix || '';
    var atDate = args.atDate || '';

    // if not specified, find enclosing html element
    if (span == null) {
      var scripts = document.getElementsByTagName('script');
      span = scripts[scripts.length - 1].parentNode;
    }

    var endDate = new Date(date);
    var timer = setInterval(time, 1000 * refresh);

    /* Timer task
     * Everything is recalculated with each call (no arguments).
     */
    function time() {
      var d, h, m, s, out;
      var now = new Date();
      var secs = (endDate - now) / 1000;
      var stop = dir * secs > 0; // happens when a countdown reaches zero
      if (stop) {
        clearInterval(timer); // stop the current timer
        // if there is a continuation (for a countup), start it (it will have its own timer)
        if (cont)
          cont(span);
        out = atDate;
      } else {
        secs = Math.abs(secs);
        d = Math.floor(secs / 86400);
        secs %= 86400;
        if (secs >= limit) {
          h = Math.floor(secs / 3600);
          secs %= 3600;
        }
        if (secs >= limit) {
          m = Math.floor(secs / 60);
          secs %= 60;
        }
        if (secs >= limit)
          s = Math.floor(secs);
        out = format(d, h, m, s);
        if (out)
          out = prefix + out + suffix;
        else
          out = atDate;
      }
      span.innerHTML = out;
    }

    // one first call to the task because timer has an initial delay
    time();
  }

})();
