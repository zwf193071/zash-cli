var env = process.env;

var ADBLOCK = is(env.ADBLOCK);

var BANNER = '\u001B[96mThank you for using zash-cli (\u001B[94m https://github.com/zwf193071/zash-cli \u001B[96m) for generating pages into VUE project!\u001B[0m\n\n' +
             '\u001B[96mAlso, the author of zash-cli (\u001B[94m https://github.com/zwf193071 \u001B[96m) is looking for a great opportunity!)\u001B[0m\n';

function is(it) {
  return !!it && it !== '0' && it !== 'false';
}

function isBannerRequired() {
  if (ADBLOCK) return false;
  return true;
}

if (isBannerRequired()) console.log(BANNER);
