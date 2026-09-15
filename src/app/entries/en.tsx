import * as messages from "@shared/i18n/en";
import { registerLocale } from "@shared/i18n/registry";
import { bootstrap } from "@app/bootstrap";

// Entry point for the prerendered "en" pages. Importing the dictionary
// statically puts it in this page's own entry graph, so it downloads in
// parallel with the app instead of costing an extra round trip.
registerLocale("en", messages);
bootstrap();
