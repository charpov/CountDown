# CountDown
_Countdown (and up) clocks in JavaScript_

**Version 1.0.1**

This JavaScript code implements simple counting clocks (up and/or down).  They are intended to be straightforward to insert into HTML but also offer limited customization for specific needs.  Clocks are live and their text is updated every second by default.

## Installation

Add the file to your scripts or refer to it directly and trust your browser's cache. Adding this to the HTML header should do the trick:

>```html
<script src="http://charpov.github.io/CountDown/scripts/countdown.js"></script>  
```

This will enable the three functions, `countDown`, `countUp` and `countDownUp` described below.  See file `demo.html` for a template.

## Basic usage

In its most basic usage, a counting clock can be used like this:

>```html
<span><script>countDown('2017-01-01')</script></span> left in 2016!
```

which produces something like this:

>218 days, 23 hours, 58 minutes and 18 seconds left in 2016!

The `<span>` element is important because the function will replace the entire contents of its containing element with a string.  Without the `<span>` (or some other element), this string could overwrite the entire page!

The remaining time can be displayed without seconds, minutes or hours.  For instance:

>```html
a mere <span><script>countDown('2101-01-01', {step: 'D'})</script></span> till the next century.
```

will look like this:

>a mere 30899 days till the next century.


The `countUp` variant counts up from a past date:

>```html
<span><script>countUp('21 July 1969 02:56 UTC', {step: 'M'})</script></span> since Neil Armstrong stepped on the Moon...
```

with this output:

>17111 days, 21 hours and 4 minutes since Neil Armstrong stepped on the Moon…

There is also a `countDownUp` function that first counts down, then up once the specified date has passed.  It is discussed in the next section.

Note that the last two example are a bit inefficient because the time string is recalculated every second.  It would be better to write:

>```html
a mere <span><script>countDown('2101-01-01', {step: 'D', refresh: 300})</script></span> till the next century.
<span><script>countUp('21 July 1969 02:56 UTC', {step: 'M', refresh: 30})</script></span> since Neil Armstrong stepped on the Moon...
```

This way, the century case is updated every 5 minutes and the Moon landing text every 30 seconds.

## Advanced usage

What happens when a clock reaches zero?  A regular countdown clock simply stops, but what is displayed?  A `countDownUp` clock continues, but how can the surrounding text makes sense before and after the deadline has passed?

These scenarios can be handled using a few additional arguments, namely `prefix` (displayed before the clock string), `suffix` (after the clock string) and `atTime` (when the deadline has been reached).  For instance:

>```html
the tournament <span><script>countDown(someDate, {prefix: "will begin in ", atDate: "has begun"})</script></span>.
```

will display:
>the tournament will begin in ...

while the clock is running, then will switch to:

>the tournament has begun.

after the specified date has been reached.

Here is a variant that uses both `prefix` and `suffix`:

>```html
the tournament <span><script>countDown(someDate, {prefix: "will begin in ", suffix: '.', atDate: "has begun!"})</script></span>
```

Function `countDownUp` takes two sets of arguments, one for the count down and one for the count up.  Here is a final example:
>```html
I <span><script>
    var argsDown = {prefix: "am retiring in ", atDate: " am retiring.."};
    var argsUp = {atDate: " am retired", prefix: "have enjoyed ", suffix: " of retirement", step: 'D', refresh: 3600};
    countDownUp(someDate, argsDown, argsUp);
  </script></span>.
```

This will display messages of the form `I am retiring in ...` until retirement date, then `I am retiring...` for 1 second, then `I am retired` for one day, then `I have enjoyed ... days of retirement` after that.

