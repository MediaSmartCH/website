import { cookies } from "./cookies";
import { navbar } from "./navbar";
import { testimonial } from "./testimonial";
import { faq } from "./faq";
import { contact } from "./contact"
import { error404 } from "./error404"
import { home } from "./home"
// import { it } from "./it"
// import { video } from "./video"
import { footer } from "./footer"

export const dictionary: any = {
  cookies,
  navbar,
  footer,
  faq,
  testimonial,
  contact,
  home,

  // IT services
  itServicesHero: {
    en: {
      title: `
      Smarter <span> IT Solutions </span> for Your Digital Needs:
      `,
      description:
        "From website creation to cybersecurity, MediaSmart is your trusted IT partner in Switzerland.",
      contactButton: "Request a Quote",
    },
    fr: {
      title: `
      <span> Solutions informatiques </span> sur mesure pour vos besoins numériques
      `,
      description:
        "De la création de sites web à la cybersécurité, MediaSmart est votre partenaire informatique en Suisse romande.",
      contactButton: "Demander un devis",
    },
  },
  itServicesAbout: {
    en: {
      title: `Introduction to <span> IT Expertise </span>`,
      description: `
        At MediaSmart, we believe IT should be <b> a strategic asset, not a source of frustration. </b>
        <br />
        Our mission is simple: to help you work efficiently and securely with modern, tailored solutions.
        <br />
        Whether you are a small business, an association, a freelancer, or a private client, we bring <b> flexibility, expertise, and responsiveness </b> to every project.
      `,
    },
    fr: {
      title: `Introduction à <span> l’expertise informatique </span>`,
      description: `
      Chez MediaSmart, nous croyons que l’informatique doit être un <b> allié stratégique, et non une source de frustration. </b> 
      <br />
      Notre mission est simple : vous permettre de travailler efficacement, en toute sécurité, grâce à des solutions modernes et adaptées à vos besoins spécifiques.
      <br />
      Que vous soyez une PME, une association, un indépendant ou un particulier exigeant, nous apportons <b> souplesse, expertise et réactivité </b> à chaque projet. 
      `,
    },
  },
  itServices: {
    en: {
      title: `<span> Our </span> IT Services`,
      description: "We offer tailored IT solutions designed to keep your business running without interruptions. Our services include:",

      service1PortfolioText: "Check our portfolio",
      service1PortfolioButton: "See more portfolio",

      portfolioModalHeading: "Our Portfolio",
      portfolioModalDescription: "Turning ideas into interactive, visually stunning, and user-friendly web experiences that leave a lasting impact.",

      title1: "Website Creation & Redesign",
      description1: `
      Your website is often the <b> first impression </b> your clients have of you. We design modern, fast, and secure websites, optimized for all devices (desktop, tablet, mobile).
      <br />
      <ul className="list-disc pl-5 space-y-2 text-justify lg:text-left">
      <li> Simple showcase sites to present your activity. </li>
      <li> Advanced sites with forms, blogs, or e-commerce features. </li>
      <li> SEO optimization to help you rank on Google. </li>
      </ul>
        Each site is easy to manage daily while reflecting your image and values. 
      `,
      title2: "Windows & macOS Maintenance",
      description2: `
      A well-maintained computer lasts longer and prevents unexpected downtime.
      <br />
      We offer <b> proactive maintenance </b>, including:
      <br />
      <ul className="list-disc pl-5 space-y-2 text-justify lg:text-left">
      <li> Regular updates (system and software). </li>
      <li> Cleaning and system optimization. </li>
      <li> Preventive problem detection. </li>
      <li> Fast assistance when issues arise. </li>
      </ul>
      Our goal: a stable, reliable IT environment, always ready to work.
      `,
      title3: "System Performance Optimization",
      description3: `
      Slow systems waste time and money.
      <br />
      We identify bottlenecks and apply concrete solutions:
      <ul className="list-disc pl-5 space-y-2 text-justify lg:text-left">
      <li> Hardware and software configuration improvements. </li>
      <li> Faster startup and application performance. </li>
      <li> Removal of unnecessary files and background processes. </li> 
      </ul>
      The result: faster, more efficient, and more enjoyable computers to use.  
      `,
      title4: "Cybersecurity & Audits",
      description4: `
      Cyber threats are not just for large corporations.
      <br />
      We help protect your data and equipment with a complete approach:
      <ul className="list-disc pl-5 space-y-2 text-justify lg:text-left">
      <li> Antivirus installation and configuration. </li>
      <li> Firewall setup and network security. </li>
      <li> Security audits to spot vulnerabilities. </li> 
      <li> Awareness and best practices for your team. </li> 
      </ul>
      Cybersecurity is not optional—it’s essential to maintain client trust and business continuity.  
      `,
      title5: "Data Backup & Recovery",
      description5: `
      Your data is valuable. Whether it’s business documents, ongoing projects, or personal memories, losing them can be devastating. We implement <b> reliable backup strategies </b> (local and cloud) adapted to your needs.
      <br />
      And if the worst happens, we provide recovery services to restore lost or damaged files whenever possible. 
      `,
      title6: "User Support & Training",
      description6: `
      We know IT problems can be disruptive. That’s why we provide <b> responsive and accessible support </b>:
      <br />
      <ul className="list-disc pl-5 space-y-2 text-justify lg:text-left">
      <li> Fast troubleshooting, on-site or remotely. </li>
      <li> Clear answers without unnecessary jargon. </li>
      <li> Personalized training (one-on-one or group) to help you get the most out of your tools (Windows, macOS, Office 365, cybersecurity, etc.). </li> 
      </ul>
      Our mission: empower users to be more independent and productive, while always being there when support is needed.
      `,
    },
    fr: {
      title: `<span> Nos </span> services informatiques`,
      description: "Nous proposons des solutions informatiques sur mesure conçues pour assurer le bon fonctionnement de votre entreprise. Nos services comprennent :",

      service1PortfolioText: "Notre portfolio",
      service1PortfolioButton: "Voir plus de portfolio",

      portfolioModalHeading: "Notre portfolio",
      portfolioModalDescription: "Transformer les idées en expériences Web interactives, visuellement époustouflantes et conviviales qui laissent un impact durable.",

      title1: "Création & refonte de sites web",
      description1: `
      Votre site internet est souvent le <b> premier contact </b> entre votre organisation et vos clients. Nous concevons des sites modernes, rapides et sécurisés, adaptés à tous les supports (ordinateur, tablette, mobile).
      <br />
      <ul className="list-disc pl-5 space-y-2 text-justify lg:text-left">
      <li> Sites vitrines pour présenter votre activité. </li>
      <li> Sites plus avancés avec intégration de formulaires, blogs ou boutique en ligne. </li>
      <li> Optimisation du référencement naturel (SEO) pour être trouvé sur Google. </li>
      </ul>
      Chaque site est pensé pour être simple à gérer au quotidien, tout en reflétant parfaitement votre image et vos valeurs.
      `,
      title2: "Maintenance Windows et macOS",
      description2: `
      Un ordinateur bien entretenu dure plus longtemps et évite les pannes imprévues.
      <br />
      Nous proposons un service de <b> maintenance proactive, </b>, incluant :
      <br />
      <ul className="list-disc pl-5 space-y-2 text-justify lg:text-left">
      <li> Mises à jour régulières (système et logiciels). </li>
      <li> Nettoyage et optimisation des paramètres. </li>
      <li> Détection préventive des problèmes. </li>
      <li> Assistance rapide en cas de blocage. </li>
      </ul>
      Notre objectif : vous offrir un parc informatique stable, fiable et toujours prêt à l’emploi.
      `,
      title3: "Optimisation des performances",
      description3: `
      Un poste de travail ou un serveur lent, c’est du temps perdu et de la productivité en moins.
      <br />
      Nous analysons vos systèmes pour identifier les ralentissements, 
      <ul className="list-disc pl-5 space-y-2 text-justify lg:text-left">
      <li> Amélioration de la configuration matérielle et logicielle. </li>
      <li> Optimisation du démarrage et des applications. </li>
      <li> Suppression des fichiers inutiles et processus parasites. </li> 
      </ul>
      Résultat : des machines plus rapides, plus efficaces et plus agréables à utiliser. 
      `,
      title4: "Cybersécurité & audits",
      description4: `
        Les cyberattaques et tentatives de piratage ne concernent pas que les grandes entreprises.
      <br />
      Nous vous aidons à protéger vos données et vos équipements grâce à une approche complète :
      <ul className="list-disc pl-5 space-y-2 text-justify lg:text-left">
      <li> Installation et configuration d’antivirus performants. </li>
      <li> Mise en place de pare-feu et sécurisation du réseau. </li>
      <li> Audit de sécurité pour identifier vos points faibles. </li> 
      <li> Sensibilisation et bonnes pratiques pour vos équipes. </li> 
      </ul>
        La cybersécurité n’est pas une option : c’est la garantie de préserver la confiance de vos clients et la continuité de votre activité.
      `,
      title5: "Sauvegarde & récupération de données",
      description5: `
      Vos données sont précieuses. Qu’il s’agisse de documents professionnels, de projets en cours ou de souvenirs personnels, leur perte peut être dramatique.
      <br />
      Nous mettons en place des <b> solutions de sauvegarde fiables </b> (locales et cloud) adaptées à votre activité. Et si le pire arrive ? Nous proposons également des services de récupération de données pour tenter de restaurer vos fichiers supprimés ou endommagés. 
      `,
      title6: "Support & formation utilisateurs",
      description6: `
      Nous savons qu’un problème informatique peut vite devenir bloquant. C’est pourquoi nous proposons un <b> support réactif et accessible </b>:
      <br />
      <ul className="list-disc pl-5 space-y-2 text-justify lg:text-left">
      <li> Dépannage rapide à distance ou sur site. </li>
      <li> Réponses claires, sans jargon inutile. </li>
      <li> Formation personnalisée (individuelle ou en groupe) pour mieux utiliser vos outils (Windows, macOS, Office 365, cybersécurité, etc.). </li> 
      </ul>
      Notre mission : rendre vos utilisateurs plus autonomes et productifs, tout en restant disponibles quand vous avez besoin d’aide.
      `,
    },
  },
  itServicesProcess: {
    en: {
      title: `Our Work <span> Process </span>`,
      description: "We believe in a clear, structured approach that delivers results:",
      processData: [
        {
          title: "Consultation",
          description: "We discuss your goals and challenges to understand exactly what you need.",
        },
        {
          title: "Assessment",
          description: "We review your systems, spotting risks and opportunities.",
        },
        {
          title: "Tailored Solutions",
          description: "A clear, customized plan that fits your business and budget.",
        },
        {
          title: "Implementation",
          description: "Deployment with minimal disruption to your daily work.",
        },
        {
          title: "Ongoing Support",
          description: "Updates, monitoring, and fast assistance whenever required.",
        },
      ]
    },
    fr: {
      title: `Notre <span> processus </span> de travail`,
      description: "Chaque mission informatique suit une méthodologie simple et transparente :",
      processData: [
        {
          title: "Consultation",
          description: "Nous discutons de vos objectifs et de vos défis afin de comprendre exactement vos besoins.",
        },
        {
          title: "Évaluation",
          description: "Nous analysons vos systèmes pour identifier les risques et les opportunités d’amélioration.",
        },
        {
          title: "Solutions personnalisées",
          description: "Nous élaborons un plan clair et sur mesure, parfaitement adapté à votre activité et à votre budget.",
        },
        {
          title: "Mise en œuvre",
          description: "Nos experts déploient les solutions avec un minimum d’interruption dans votre travail quotidien.",
        },
        {
          title: "Support continu",
          description: "Nous restons à vos côtés grâce aux mises à jour, à la surveillance et à un support réactif dès que vous en avez besoin.",
        },
      ]
    }

  },

  // video-services
  videoServicesHero: {
    en: {
      title1: "MediaSmart Video ",
      title2: "Captivate, Inspire, Leave a Mark!",
      description:
        "From event filming to creative editing, MediaSmart brings your stories to life with videos that engage and resonate with your audience.",
      contactButton: "Contact Us",
    },
    fr: {
      title1: "MediaSmart Vidéo ",
      title2: "Captivez, Inspirez, Marquez les esprits !",
      description:
        "De la captation d’événements au montage créatif, MediaSmart donne vie à vos histoires avec des vidéos qui marquent et engagent votre audience.",
      contactButton: "Contactez-nous",
    },
  },
  videoServicesAbout: {
    en: {
      title: "About MediaSmart",
      description:
        "MediaSmart stands at the forefront of digital storytelling, transforming visions into vivid visuals. Our commitment is to deliver impactful video content that not only captivates viewers but also amplifies your brand’s unique voice. Specializing in comprehensive live event coverage, dynamic promotional videos, and personalized content creation, we empower your digital presence, ensuring your message resonates with your audience and leaves a lasting impression.",
    },
    fr: {
      title: "À propos de MediaSmart",
      description:
        "MediaSmart se positionne à l'avant-garde du récit numérique, transformant les visions en visuels vivants. Notre engagement est de fournir un contenu vidéo impactant qui captive non seulement les spectateurs, mais amplifie également la voix unique de votre marque. Spécialisés dans la couverture complète d'événements en direct, les vidéos promotionnelles dynamiques et la création de contenu personnalisé, nous renforçons votre présence numérique, garantissant que votre message résonne auprès de votre public et laisse une impression durable.",
    },
  },
  videoServices: {
    en: {
      mainTitle1: "Our",
      mainTitle2: "Services",
      contactBtn: "Contact Us",

      title1: "Live Video Direction :",
      description1:
        "Elevate your event with MediaSmart's live video direction. Our production ensures your broadcast is seamless and professional, engaging your audience in real-time. Ideal for corporate events, webinars, and social media streams.",
      title2: "Event Retransmission :",
      description2:
        "Relive the highlights with our event retransmission services. We capture and broadcast your special occasions, delivering high-quality video feeds that can be relived and shared. Perfect for concerts, conferences, and cultural events.",
      title3: "Video Editing :",
      description3:
        "We craft your visual narrative with precision and flair. Video editing isn't just about cutting and splicing; it's an art form that we take pride in. Whether it's a stirring wedding video, a compelling documentary, or an engaging promotional reel, we bring your story to life with a cinematic touch. Our expertise ensures that every transition is smooth, every scene is impactful, and your vision is realized in its most vivid form.",
      title4: "Equipment Rental :",
      description4:
        "Get access to professional-grade video gear without the commitment. MediaSmart offers a comprehensive range of equipment rentals, ensuring you have the right tools to capture your vision, from cameras to lighting and sound.",
      title5: "Photography :",
      description5:
        "In the lens of MediaSmart, every snapshot tells a story. We specialize in capturing the moments that matter most to you. From corporate events to intimate gatherings, our photography services are tailored to showcase the essence of each occasion. With a keen eye for detail and a passion for storytelling, we ensure that your memories are preserved in stunning clarity and color. Let us frame your events in a way that you can relive them, time and time again.",
    },
    fr: {
      mainTitle1: "Nos",
      mainTitle2: "Services",
      contactBtn: "Contactez-nous",

      title1: "Réalisation de Vidéo en Direct :",
      description1:
        "Rehaussez votre événement avec la réalisation de vidéo en direct de MediaSmart. Notre production assure une diffusion fluide et professionnelle, captivant votre audience en temps réel. Idéal pour les événements d'entreprise, webinaires et diffusions sur les réseaux sociaux.",
      title2: "Retransmission d'Événements :",
      description2:
        "Revivez les moments forts avec nos services de retransmission d'événements. Nous capturons et diffusons vos occasions spéciales, offrant des flux vidéo de haute qualité qui peuvent être revécus et partagés. Parfait pour les concerts, conférences et événements culturels.",
      title3: "Montage Vidéo :",
      description3:
        "Nous façonnons votre récit visuel avec précision et panache. Le montage vidéo n'est pas juste une question de coupe et d'assemblage ; c'est une forme d'art dont nous sommes fiers. Que ce soit pour une vidéo de mariage émouvante, un documentaire captivant ou un clip promotionnel engageant, nous donnons vie à votre histoire avec une touche cinématographique. Notre expertise garantit que chaque transition est fluide, chaque scène est percutante, et votre vision est réalisée dans sa forme la plus éclatante.",
      title4: "Location de Matériel :",
      description4:
        "Accédez à du matériel vidéo professionnel sans engagement. MediaSmart propose une gamme complète de locations d'équipements, vous assurant d'avoir les bons outils pour capturer votre vision, des caméras à l'éclairage et au son.",
      title5: "Photographie :",
      description5:
        "À travers l'objectif de MediaSmart, chaque instantané raconte une histoire. Nous sommes spécialisés dans la capture des moments qui comptent le plus pour vous. Des événements d'entreprise aux rassemblements intimes, nos services de photographie sont conçus pour mettre en valeur l'essence de chaque occasion. Avec un œil attentif aux détails et une passion pour le récit, nous garantissons que vos souvenirs sont préservés avec une clarté et des couleurs éblouissantes. Laissez-nous encadrer vos événements de manière à ce que vous puissiez les revivre, encore et encore.",
    },
  },
  error404,
};
