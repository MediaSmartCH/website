import React from "react";

export default function PrivacyPolicyFr({
  themeReducer,
  formattedDate,
}: {
  themeReducer: "light" | "dark" | string;
  formattedDate: string;
}) {
  const tText = (light: string, dark: string) =>
    themeReducer === "light" ? light : dark;

  return (
    <div className="w-full relative mt-[73px] md:mt-[130px] lg:mt-[100px]">
      {/* Hero Cover */}
      <div className={`${tText("hero-bg", "hero-bg-dark")} px-[20px] h-[350px] md:h-[400px] lg:h-[500px] xl:h-[600px] 2xl:h-[700px] flex justify-center items-start`}>
        <div className="mt-[70px] 2xl:mt-[100px]">
          <h1
            className={`${tText(
              "text-[#14172D]",
              "text-[#F6F6F6]"
            )} w-full mx-auto text-center mb-[15px] lg:mb-[22px] font-redDisplay font-bold text-[28px] md:text-[32px] lg:text-[40px] xl:text-[46px] 2xl:text-[54px]`}
            data-aos="fade-up"
            data-aos-duration="900"
            data-aos-easing="ease-in-sine"
          >
            Politique de confidentialité <span>-</span>{" "}
            <span className="gradient-text">MediaSmart</span>
          </h1>
          <p
            className={`${tText(
              "text-[#413C58]",
              "text-[#E5E5E5]"
            )} w-full mx-auto text-center mb-[20px] lg:mb-[32px] font-poppins font-normal text-[12px] md:text-[16px] xl:text-[17px] 2xl:text-[18px] lg:w-[80%] 2xl:w-[65%]`}
            data-aos="fade-up"
            data-aos-duration="1200"
            data-aos-easing="ease-in-sine"
          >
            Dernière mise à jour : {formattedDate}
          </p>
        </div>
      </div>

      {/* Contenu */}
      <div className="font-poppins font-light text-sm w-full flex justify-center homepage-container px-[25px] md:px-[50px] xl:px-[100px] 2xl:px-[160px] mx-auto pt-[10px] md:pt-[50px] lg:pt-[30px] pb-[70px]">
        <div className="max-w-3xl mx-auto">
          <p className={tText("text-[#413C58]", "text-[#E5E5E5]")}>
            Chez <span className="font-medium">MediaSmart</span>, nous attachons
            une grande importance à la protection de vos données personnelles.
            Cette politique explique quelles informations nous collectons,
            pourquoi, et comment elles sont utilisées et protégées.
          </p>

          {/* 1. Responsable */}
          <h2
            className={`text-xl font-semibold mt-8 mb-4 font-redDisplay ${tText(
              "text-[#14172D]",
              "text-[#F6F6F6]"
            )}`}
          >
            1. Responsable du traitement
          </h2>
          <p className={tText("text-[#413C58]", "text-[#E5E5E5]")}>
            <span className="font-medium">MediaSmart – Raphael Rouiller</span>
            <br />
            Forme juridique : raison individuelle (non inscrite au Registre du
            commerce)
            <br />
            Adresse : Rue des Prumus 21, 1994 Aproz (Nendaz), Suisse
            <br />
            Email :{" "}
            <a href="mailto:hello@mediasmart.ch" className="text-blue-600 underline">
              hello[at]mediasmart.ch
            </a>
            <br />
            Téléphone :{" "}
            <a href="tel:+41796578612" className="text-blue-600 underline">
              +41 79 657 86 12
            </a>
          </p>

          {/* 2. Données collectées */}
          <h2
            className={`text-xl font-semibold mt-8 mb-4 font-redDisplay ${tText(
              "text-[#14172D]",
              "text-[#F6F6F6]"
            )}`}
          >
            2. Données collectées
          </h2>

          <h3 className={`font-semibold mt-4 ${tText("text-[#413C58]", "text-[#E5E5E5]")}`}>
            a) Formulaire de contact
          </h3>
          <ul
            className={`list-disc list-inside mt-2 mb-4 ml-4 ${tText(
              "text-[#413C58]",
              "text-[#E5E5E5]"
            )}`}
          >
            <li>Nom, prénom</li>
            <li>Adresse e-mail</li>
            <li>Numéro de téléphone (si fourni)</li>
            <li>Contenu du message</li>
          </ul>
          <p className={tText("text-[#413C58]", "text-[#E5E5E5]")}>
            <span className="font-medium">Utilisation : </span>
            répondre à votre demande et assurer le suivi.
            <br />
            <span className="font-medium">Base légale : </span>
            consentement (case à cocher obligatoire).
          </p>

          <h3 className={`font-semibold mt-4 ${tText("text-[#413C58]", "text-[#E5E5E5]")}`}>
            b) Prise de rendez-vous (Calendly)
          </h3>
          <ul
            className={`list-disc list-inside mt-2 mb-4 ml-4 ${tText(
              "text-[#413C58]",
              "text-[#E5E5E5]"
            )}`}
          >
            <li>Nom et prénom</li>
            <li>Adresse e-mail</li>
            <li>Créneau choisi</li>
            <li>Informations éventuelles ajoutées dans vos notes</li>
          </ul>
          <p className={tText("text-[#413C58]", "text-[#E5E5E5]")}>
            <span className="font-medium">Utilisation : </span>gestion des
            rendez-vous.
            <br />
            <span className="font-medium">Base légale : </span>exécution du
            service (mesures précontractuelles/contractuelles).
            <br />
            <span className="font-medium">Lien : </span>
            <a
              href="https://calendly.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Politique de confidentialité Calendly
            </a>
          </p>

          <h3 className={`font-semibold mt-4 ${tText("text-[#413C58]", "text-[#E5E5E5]")}`}>
            c) Google reCAPTCHA
          </h3>
          <p className={`mt-2 mb-4 ${tText("text-[#413C58]", "text-[#E5E5E5]")}`}>
            Nous utilisons Google reCAPTCHA pour protéger nos formulaires contre
            le spam et les abus. Ce service peut collecter des données
            techniques (adresse IP, empreintes techniques, comportement de
            navigation).
            <br />
            <span className="font-medium">Liens : </span>
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Politique de confidentialité Google
            </a>{" "}
            •{" "}
            <a
              href="https://www.google.com/recaptcha/about"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Conditions reCAPTCHA
            </a>
          </p>
          <p className={tText("text-[#413C58]", "text-[#E5E5E5]")}>
            <span className="font-medium">Utilisation : </span>sécurité du site.
            <br />
            <span className="font-medium">Base légale : </span>intérêt légitime.
          </p>

          <h3 className={`font-semibold mt-4 ${tText("text-[#413C58]", "text-[#E5E5E5]")}`}>
            d) Google Analytics (optionnel)
          </h3>
          <ul
            className={`list-disc list-inside mt-2 mb-4 ml-4 ${tText(
              "text-[#413C58]",
              "text-[#E5E5E5]"
            )}`}
          >
            <li>Pages visitées</li>
            <li>Durée de la visite</li>
            <li>Pays d’origine</li>
            <li>Type d’appareil / navigateur</li>
          </ul>
          <p className={tText("text-[#413C58]", "text-[#E5E5E5]")}>
            <span className="font-medium">Utilisation : </span>statistiques
            anonymisées pour améliorer nos services.
            <br />
            <span className="font-medium">Base légale : </span>consentement
            explicite via la bannière cookies.
            <br />
            <span className="font-medium">Liens : </span>
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Politique de confidentialité Google
            </a>{" "}
            •{" "}
            <a
              href="https://support.google.com/analytics/answer/6004245?hl=fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              À propos de la confidentialité dans Analytics
            </a>
          </p>

          {/* 3. Cookies */}
          <h2
            className={`text-xl font-semibold mt-8 mb-3 font-redDisplay ${tText(
              "text-[#14172D]",
              "text-[#F6F6F6]"
            )}`}
          >
            3. Cookies
          </h2>
          <p className={tText("text-[#413C58]", "text-[#E5E5E5]")}>
            Nous utilisons :
            <br />
            <span className="font-medium">Cookies nécessaires :</span>{" "}
            indispensables au fonctionnement du site (formulaire, Calendly,
            reCAPTCHA).
            <br />
            <span className="font-medium">Cookies optionnels :</span> Google
            Analytics, uniquement si vous y consentez.
          </p>
          <p className={tText("text-[#413C58]", "text-[#E5E5E5]")}>
            Vous pouvez modifier vos préférences à tout moment en cliquant sur
            l’icône <span className="font-medium">« cookie » en bas à droite</span> de
            la page (« Gérer mes cookies »).
          </p>

          {/* 4. Hébergement */}
          <h2
            className={`text-xl font-semibold mt-8 mb-3 font-redDisplay ${tText(
              "text-[#14172D]",
              "text-[#F6F6F6]"
            )}`}
          >
            4. Hébergement & Transferts internationaux
          </h2>
          <p className={tText("text-[#413C58]", "text-[#E5E5E5]")}>
            Notre site est hébergé chez <span className="font-medium">Vercel</span>. Vos
            données peuvent être traitées et transférées en dehors de la Suisse
            ou de l’EEE (notamment aux États-Unis) dans le cadre de
            l’hébergement et de la diffusion de contenu. Ces transferts sont
            encadrés par le{" "}
            <a
              href="https://vercel.com/legal/dpa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline font-medium"
            >
              Data Processing Addendum (DPA) de Vercel
            </a>
            , avec des garanties équivalentes aux Clauses Contractuelles Types.
          </p>
          <p className={`${tText("text-[#413C58]", "text-[#E5E5E5]")} mt-3`}>
            Pour en savoir plus, consultez la{" "}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline font-medium"
            >
              Politique de confidentialité de Vercel
            </a>
            .
          </p>

          {/* 5. Conservation */}
          <h2
            className={`text-xl font-semibold mt-8 mb-3 font-redDisplay ${tText(
              "text-[#14172D]",
              "text-[#F6F6F6]"
            )}`}
          >
            5. Durées de conservation
          </h2>
          <ul className={`list-disc list-inside ml-4 ${tText("text-[#413C58]", "text-[#E5E5E5]")}`}>
            <li>
              Demandes de contact : jusqu’à{" "}
              <span className="font-medium">12 mois</span> après le dernier
              échange.
            </li>
            <li>Rendez-vous Calendly : selon la politique de Calendly.</li>
            <li>
              Journaux techniques (sécurité, accès, logs) :{" "}
              <span className="font-medium">90 jours</span>.
            </li>
            <li>
              Données statistiques (Analytics) : anonymisées et conservées{" "}
              <span className="font-medium">14 mois</span>.
            </li>
          </ul>

          {/* 6. Sécurité */}
          <h2
            className={`text-xl font-semibold mt-8 mb-3 font-redDisplay ${tText(
              "text-[#14172D]",
              "text-[#F6F6F6]"
            )}`}
          >
            6. Sécurité
          </h2>
          <p className={tText("text-[#413C58]", "text-[#E5E5E5]")}>
            Nous mettons en place des mesures techniques et organisationnelles
            appropriées pour protéger vos données contre tout accès non
            autorisé, divulgation ou perte. Le principe du moindre privilège est
            appliqué : seuls les membres de l’équipe ou prestataires qui ont
            besoin d’accéder à ces données peuvent le faire.
          </p>

          {/* 7. Partage */}
          <h2
            className={`text-xl font-semibold mt-8 mb-3 font-redDisplay ${tText(
              "text-[#14172D]",
              "text-[#F6F6F6]"
            )}`}
          >
            7. Partage des données
          </h2>
          <p className={tText("text-[#413C58]", "text-[#E5E5E5]")}>
            Nous ne vendons ni ne louons vos données personnelles. Certaines
            données peuvent être transmises à nos prestataires techniques
            (Vercel, Google, Calendly), uniquement pour fournir les services, et
            sous obligations contractuelles strictes de confidentialité et de
            sécurité.
          </p>

          {/* 8. Droits */}
          <h2
            className={`text-xl font-semibold mt-8 mb-3 font-redDisplay ${tText(
              "text-[#14172D]",
              "text-[#F6F6F6]"
            )}`}
          >
            8. Vos droits (LPD & RGPD)
          </h2>
          <p className={tText("text-[#413C58]", "text-[#E5E5E5]")}>
            Conformément à la{" "}
            <a
              href="https://www.fedlex.admin.ch/eli/cc/2022/491/fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              LPD suisse (FADP)
            </a>{" "}
            et au{" "}
            <a
              href="https://eur-lex.europa.eu/eli/reg/2016/679/oj"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              RGPD (UE) 2016/679
            </a>
            , vous disposez des droits d’accès, rectification, suppression,
            limitation, opposition, portabilité, ainsi que du droit de retirer
            votre consentement (p. ex. pour Google Analytics).
          </p>
          <p className={`${tText("text-[#413C58]", "text-[#E5E5E5]")} mt-2`}>
            Pour exercer vos droits, contactez-nous à :{" "}
            <a href="mailto:privacy@mediasmart.ch" className="text-blue-600 underline">
              privacy[at]mediasmart.ch
            </a>
            . En Suisse, vous pouvez aussi vous adresser au{" "}
            <a
              href="https://www.edoeb.admin.ch/edoeb/fr/home.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Préposé fédéral à la protection des données et à la transparence
              (PFPDT)
            </a>
            .
          </p>

          {/* 9. Mineurs */}
          <h2
            className={`text-xl font-semibold mt-8 mb-3 font-redDisplay ${tText(
              "text-[#14172D]",
              "text-[#F6F6F6]"
            )}`}
          >
            9. Mineurs & décisions automatisées
          </h2>
          <p className={tText("text-[#413C58]", "text-[#E5E5E5]")}>
            Le site ne s’adresse pas aux personnes de moins de 16 ans. Nous ne
            réalisons aucune décision automatisée ni profilage produisant des
            effets juridiques.
          </p>

          {/* 10. Mises à jour */}
          <h2
            className={`text-xl font-semibold mt-8 mb-3 font-redDisplay ${tText(
              "text-[#14172D]",
              "text-[#F6F6F6]"
            )}`}
          >
            10. Modifications
          </h2>
          <p className={tText("text-[#413C58]", "text-[#E5E5E5]")}>
            Cette politique peut évoluer selon les changements législatifs ou
            techniques. La version la plus récente est toujours publiée sur
            cette page.
          </p>
        </div>
      </div>
    </div>
  );
}
