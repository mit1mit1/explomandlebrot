# explomandlebrot

An audio visual fractal experience. Try it out at [mit1mit1.github.io/explomandlebrot/](https://mit1mit1.github.io/explomandlebrot/)

This is very much a POC. I like maths, music and experimentation, so I wanted to see what would happen if I:

- Made a movement system that let's you hook into the Mandlebrot set's nooks and crannies;
- Generated music algorithmically based on the bit of the Mandlebrot set you're in;
- Did the whole thing without any "reactive" framework.

## Customization

There's some settings you can play with through URL query parameters:

- `xResolution` and `yResolution` (positive integers) will control how detailed the image generated is.
  - 0 < `xResolution` < 1620;
  - 0 < `yResolution` < 1080;
  - E.g. `?xResolution=810&yResolution=540`
- `randomSeed` (any string) and `colorGap` (positive integer) will set a default color array, which can be overridden by `colorArray`.
  - E.g. `?randomSeed=horse&colorGap=123`
- `colorArray` (`-` separated list of hex codes, no `#`) will override the available colors.
  - E.g. `?colorArray=55e-5391cf-6eb4fa-5391cf-55e-fade6e-f5ff6b-f5f542-fade6e-f5ff6b-3bbf3b-eee`
- `infiniteColor` (color for the true elements of the set)
  - E.g. `?infiniteColor=eeffee`
