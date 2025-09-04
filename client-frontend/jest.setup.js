import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

// Polyfill for react-router / other libs needing TextEncoder/Decoder
if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder;
}

if (!global.TextDecoder) {
  global.TextDecoder = TextDecoder;
}
