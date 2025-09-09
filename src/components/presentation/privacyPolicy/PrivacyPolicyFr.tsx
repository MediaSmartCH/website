export default function PrivacyPolicyFr({ themeReducer, formattedDate }: any) {

    return (
        <div className="w-full relative mt-[73px] md:mt-[130px] lg:mt-[100px]">
            <div className="hero-bg px-[20px] h-[350px] md:h-[400px] lg:h-[500px] xl:h-[600px] 2xl:h-[700px] flex justify-center items-start">
                <div className="mt-[70px] 2xl:mt-[100px]">
                    <h1
                        className={`${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"
                            } w-full mx-auto text-center mb-[15px] lg:mb-[22px] font-redDisplay font-bold text-[28px] md:text-[32px] lg:text-[40px] xl:text-[46px] 2xl:text-[54px]`}
                        data-aos="fade-up"
                        data-aos-duration="900"
                        data-aos-easing="ease-in-sine"
                    >
                        Politique de confidentialité
                        <span> - </span>
                        <span className="gradient-text">MediaSmart</span>
                    </h1>
                    <p
                        className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"
                            } w-full mx-auto text-center mb-[20px] lg:mb-[32px] font-poppins font-normal text-[12px] md:text-[16px] xl:text-[17px] 2xl:text-[18px] lg:w-[80%] 2xl:w-[65%]`}
                        data-aos="fade-up"
                        data-aos-duration="1200"
                        data-aos-easing="ease-in-sine"
                    >
                        Dernière mise à jour : {formattedDate}
                    </p>
                </div>
            </div>

            <div className="font-poppins font-light text-sm w-full flex justify-center homepage-container px-[25px] md:px-[50px] lg:px-[50px] xl:px-[100px] 2xl:px-[160px] mx-auto pt-[10px] md:pt-[50px] lg:md:pt-[30px] pb-[70px]">
                <div className="max-w-3xl max-auto">
                    <p className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"}`}>
                        Chez <span className="font-medium">MediaSmart</span>, nous attachons une grande importance à la protection de vos données personnelles. Cette politique explique quelles informations nous collectons, pourquoi, et comment elles sont utilisées et protégées.
                    </p>

                    {/* Section 1 */}
                    <h2 className={`text-xl font-semibold mt-8 mb-4 font-redDisplay ${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"}`}>1. Responsable du traitement</h2>
                    <p className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"}`}>
                        <span className="font-medium">MediaSmart – Raphael Rouiller</span><br />
                        Adresse : Valais – Vaud – Genève – Fribourg<br />
                        Email : <a href="mailto:hello@mediasmart.ch" className="text-blue-600 underline">
                            hello[at]mediasmart.ch
                        </a><br />
                        Téléphone : <a href="tel:+41796578612" className="text-blue-600 underline">
                            +41 79 657 86 12
                        </a>
                    </p>

                    {/* Section 2 */}
                    <h2 className={`text-xl font-semibold mt-8 mb-4 font-redDisplay ${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"}`}>2. Données collectées</h2>

                    <h3 className={`font-semibold mt-4 ${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"}`}>a) Formulaire de contact</h3>
                    <ul className={`list-disc list-inside mt-2 mb-4 ml-4 ${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"}`}>
                        <li>Nom, prénom</li>
                        <li>Adresse e-mail</li>
                        <li>Numéro de téléphone (si fourni)</li>
                        <li>Contenu du message</li>
                    </ul>
                    <p className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"}`}>
                        <span className="font-medium">Utilisation :</span> répondre à votre demande et assurer le suivi.<br />
                        <span className="font-medium">Base légale :</span> consentement (case à cocher obligatoire).
                    </p>

                    <h3 className={`font-semibold mt-4 ${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"}`}>b) Calendly (prise de rendez-vous)</h3>
                    <ul className={`list-disc list-inside mt-2 mb-4 ml-4 ${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"}`}>
                        <li>Nom et prénom</li>
                        <li>Adresse e-mail</li>
                        <li>Créneau choisi</li>
                        <li>Informations éventuelles ajoutées dans vos notes</li>
                    </ul>
                    <p className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"}`}>
                        <span className="font-medium">Utilisation :</span> gestion des rendez-vous.<br />
                        <span className="font-medium">Base légale :</span> exécution du service (nécessaire).<br />
                        <span className="font-medium">Remarque :</span> les données sont traitées par Calendly (USA).
                    </p>

                    <h3 className={`font-semibold mt-4 ${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"}`}>c) Google reCAPTCHA</h3>
                    <p className={`mt-2 mb-4 ${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"}`}>
                        Nous utilisons Google reCAPTCHA pour protéger nos formulaires contre le spam et les abus. Ce service peut collecter certaines données techniques (adresse IP, comportement de navigation).
                    </p>
                    <p className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"}`}>
                        <span className="font-medium">Utilisation :</span> sécurité du site.<br />
                        <span className="font-medium">Base légale :</span> intérêt légitime (nécessaire au fonctionnement).
                    </p>

                    <h3 className={`font-semibold mt-4 ${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"}`}>d) Google Analytics (optionnel)</h3>
                    <ul className={`list-disc list-inside mt-2 mb-4 ml-4 ${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"}`}>
                        <li>Pages visitées</li>
                        <li>Durée de la visite</li>
                        <li>Pays d’origine</li>
                        <li>Type d’appareil / navigateur</li>
                    </ul>
                    <p className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"}`}>
                        <span className="font-medium">Utilisation :</span> statistiques anonymisées pour améliorer nos services.<br />
                        <span className="font-medium">Base légale :</span> consentement explicite via la bannière cookies.<br />
                        <span className="font-medium">Remarque :</span> nous activons l’anonymisation des adresses IP.
                    </p>

                    {/* Section 3 */}
                    <h2 className={`text-xl font-semibold mt-8 mb-3 font-redDisplay ${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"}`}>3. Cookies</h2>
                    <p className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"}`}>
                        Nous utilisons :<br />
                        <span className="font-medium">Cookies nécessaires :</span> indispensables au fonctionnement du site (formulaire, Calendly, reCAPTCHA).<br />
                        <span className="font-medium">Cookies optionnels :</span> Google Analytics, uniquement si vous y consentez.<br />
                        Vous pouvez gérer vos préférences à tout moment via la bannière cookies en bas de page.
                    </p>

                    {/* Section 4 */}
                    <h2 className={`text-xl font-semibold mt-8 mb-3 font-redDisplay ${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"}`}>4. Conservation des données</h2>
                    <ul className={`list-disc list-inside ml-4 ${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"}`}>
                        <li>Données de contact : conservées maximum 12 mois après le dernier échange.</li>
                        <li>Données liées aux rendez-vous (Calendly) : selon la politique de Calendly.</li>
                        <li>Données statistiques (Analytics) : anonymisées et conservées 14 mois.</li>
                    </ul>

                    {/* Section 5 */}
                    <h2 className={`text-xl font-semibold mt-8 mb-3 font-redDisplay ${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"}`}>5. Sécurité</h2>
                    <p className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"}`}>
                        Nous mettons en place des mesures techniques et organisationnelles pour protéger vos données contre tout accès non autorisé, perte ou divulgation.
                    </p>

                    {/* Section 6 */}
                    <h2 className={`text-xl font-semibold mt-8 mb-3 font-redDisplay ${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"}`}>6. Partage des données</h2>
                    <p className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"}`}>
                        Nous ne vendons, ni ne louons vos données personnelles. Certaines données peuvent être transmises à nos prestataires techniques (ex. Calendly, Google), uniquement pour fournir les services.
                    </p>

                    {/* Section 7 */}
                    <h2 className={`text-xl font-semibold mt-8 mb-3 font-redDisplay ${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"}`}>7. Vos droits</h2>
                    <p className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"}`}>
                        Conformément au <span className="font-medium">RGPD</span> et à la <span className="font-medium">LPD suisse</span>, vous disposez des droits suivants :
                    </p>
                    <ul className={`list-disc list-inside mt-2 mb-4 ml-4 ${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"}`}>
                        <li>Droit d’accès à vos données</li>
                        <li>Droit de rectification</li>
                        <li>Droit de suppression</li>
                        <li>Droit de limitation du traitement</li>
                        <li>Droit de retrait du consentement (ex. pour Google Analytics)</li>
                    </ul>
                    <p className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"}`}>
                        Pour exercer ces droits, contactez-nous à :{" "}
                        <a href="mailto:hello@mediasmart.ch" className="text-blue-600 underline">
                            hello[at]mediasmart.ch
                        </a>
                    </p>

                    {/* Section 8 */}
                    <h2 className={`text-xl font-semibold mt-8 mb-3 font-redDisplay ${themeReducer === "light" ? "text-[#14172D]" : "text-[#F6F6F6]"}`}>8. Modifications</h2>
                    <p className={`${themeReducer === "light" ? "text-[#413C58]" : "text-[#E5E5E5]"}`}>
                        Nous pouvons mettre à jour cette politique en fonction de l’évolution légale ou technique. La version la plus récente est toujours disponible sur cette page.
                    </p>
                </div>
            </div>
        </div>
    );
}
