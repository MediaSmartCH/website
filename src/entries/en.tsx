import * as messages from "../services/locales/en";
import { registerLocale } from "../services/locales/registry";
import { bootstrap } from "../bootstrap";

// Entry point for the prerendered "en" pages. Importing the dictionary
// statically puts it in this page's own entry graph, so it downloads in
// parallel with the app instead of costing an extra round trip.
registerLocale("en", messages);
bootstrap();
