## ideas

- send raw midi directly into worklets.

## status

> Running Status is especially helpful when sending long strings of Note On/Off messages, where "Note On with Velocity of 0" is used for Note Off.

MIDI 1.0 Detailed Specification 4.2.1


## notes

> Middle C has a reference value of 60

MIDI 1.0 Detailed Specification 4.2.1

## velocity

> 64: if not velocity sensitive
> 0: Note-Off (with velocity of 64)

MIDI 1.0 Detailed Specification 4.2.1

## timber

> Bn 4A vv Brightness

> Brightness should be treated as a relative controller, with a data value of 40H meaning no change, values less than 40H meaning progressively less bright, and values greater than 40H meaning progressively more bright.

## envelope

Bn 48 vv Release Time Bn 49 vv Attack Time
vv = 00 - 3F = shorter times (00 = shortest adjustment) vv = 40 = no change in times
vv = 41 - 7F = longer times (7F = longest adjustment)

## info

`{NUMBER}H` means a base 16 number.
