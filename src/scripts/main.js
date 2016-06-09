var bespoke = require('bespoke');
var backdrop = require('bespoke-backdrop');
var bullets = require('bespoke-bullets');
var fullscreen = require('bespoke-fullscreen');
var hash = require('bespoke-hash');
var hljs = require('highlight.js');
var keys = require('bespoke-keys');
var progress = require('bespoke-progress');
var scale = require('bespoke-scale');
var theme = require('bespoke-theme-build-wars');
var touch = require('bespoke-touch');

bespoke.from('article', [
  theme(),
  keys(),
  touch(),
  backdrop(),
  scale(),
  hash(),
  progress(),
  bullets(),
  fullscreen(),
]);

hljs.initHighlightingOnLoad();
