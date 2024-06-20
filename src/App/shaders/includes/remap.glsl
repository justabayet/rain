float remapReciprocal(float x, float factor) {
  return (1.0 + 1.0 / factor) * (1.0 - 1.0 / (x * factor + 1.0));
}