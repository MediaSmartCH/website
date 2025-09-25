const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
    webpack: {
        configure: (config) => {
            // 1) Couper le bruit "Failed to parse source map"
            config.ignoreWarnings = (config.ignoreWarnings || []).concat([
                /Failed to parse source map/,
            ]);

            // 2) Exclure les libs bruyantes du source-map-loader (CRA 5)
            const rules = config.module.rules || [];
            for (const r of rules) {
                if (Array.isArray(r.oneOf)) {
                    for (const one of r.oneOf) {
                        if (
                            one &&
                            one.enforce === 'pre' &&
                            one.use &&
                            (Array.isArray(one.use) ? one.use : [one.use])
                                .some(u => (u.loader || '').includes('source-map-loader'))
                        ) {
                            const extra = [/@dotlottie/, /@rgba-image/];
                            if (!one.exclude) one.exclude = extra;
                            else one.exclude = Array.isArray(one.exclude)
                                ? one.exclude.concat(extra)
                                : [one.exclude].concat(extra);
                        }
                    }
                }
            }

            if (process.env.ANALYZE === 'true') {
                config.plugins.push(
                    new BundleAnalyzerPlugin({
                        analyzerMode: 'static',         // génère un fichier HTML
                        reportFilename: 'bundle-report.html',
                        openAnalyzer: true,             // ouvre auto le rapport
                        defaultSizes: 'gzip',           // affiche tailles gzip (plus proche du réseau)
                        generateStatsFile: true,
                        statsFilename: 'bundle-stats.json',
                    })
                );
            }
            return config;
        },
    },

    devServer: (devServerConfig) => {
        // Remplace l’ancienne API "before/after" par setupMiddlewares (même si tu n’as rien à y faire)
        devServerConfig.setupMiddlewares = (middlewares, devServer) => {
            // Exemple: tu pourrais ajouter ici un middleware si besoin
            // devServer.app.use((req, res, next) => next());
            return middlewares;
        };

        // Optionnel: allège la console
        devServerConfig.client = devServerConfig.client || {};
        devServerConfig.client.overlay = { warnings: false, errors: true };
        devServerConfig.client.logging = "error";

        return devServerConfig;
    },
};
