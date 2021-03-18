export function inRange(value, min, max, exclusive) {
  if (!exclusive) {
    return min <= value && value <= max;
  } else {
    return min < value && value < max;
  }
}
