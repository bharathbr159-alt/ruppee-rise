function fmtINR(n) {
  if (n >= 10000000) return '₹' + (n/10000000).toFixed(2) + ' Cr';
  if (n >= 100000) return '₹' + (n/100000).toFixed(2) + ' L';
  if (n >= 1000) return '₹' + (n/1000).toFixed(1) + 'K';
  return '₹' + Math.round(n).toLocaleString('en-IN');
}
 
function fmtFull(n) {
  return '₹' + Math.round(n).toLocaleString('en-IN');
}
 
function calcSIP(monthly, rate, years) {
  const r = (rate/100)/12, n = years*12;
  return monthly * ((Math.pow(1+r,n)-1)/r) * (1+r);
}
 
function calcFD(principal, rate, years) {
  return principal * Math.pow(1 + rate/100, years);
}
 