export const siteUrl = "https://www.aenuin.com";
export const socialImage = `${siteUrl}/Wallpaper-512.png`;

export const seo = {
  "/": {
    title: "Aenuka Buddhakorala | Software Engineer",
    description:
      "Aenuka Buddhakorala is a software engineer in Sri Lanka building thoughtful web applications, backend systems, and digital products.",
    keywords: "Aenuka Buddhakorala, Aenuin, software engineer Sri Lanka, web developer, portfolio",
    imageAlt: "Aenuka Buddhakorala, software engineer",
  },
  "/about": {
    title: "About Aenuka Buddhakorala | Software Engineer",
    description:
      "Learn about Aenuka Buddhakorala’s software engineering journey, education at SLIIT, interests, and approach to building digital products.",
    keywords: "about Aenuka Buddhakorala, SLIIT software engineering, software engineer journey",
    imageAlt: "About Aenuka Buddhakorala",
  },
  "/skills": {
    title: "Software Engineering Skills | Aenuka Buddhakorala",
    description:
      "Explore Aenuka Buddhakorala’s skills across React, JavaScript, Spring Boot, Node.js, databases, Docker, Kubernetes, design, and testing.",
    keywords: "React, Spring Boot, Node.js, Docker, Kubernetes, software engineering skills",
    imageAlt: "Software engineering skills of Aenuka Buddhakorala",
  },
  "/projects": {
    title: "Software Projects | Aenuka Buddhakorala",
    description:
      "Explore software projects by Aenuka Buddhakorala, including healthcare microservices, Quizora, Cey Harvest, MERN systems, and Cypress testing.",
    keywords: "software projects, healthcare microservices, Quizora, Cey Harvest, MERN, Cypress",
    imageAlt: "Software projects by Aenuka Buddhakorala",
  },
  "/contact": {
    title: "Contact Aenuka Buddhakorala | Software Engineer",
    description:
      "Contact Aenuka Buddhakorala for software engineering opportunities, internships, collaborations, and digital product development.",
    keywords: "contact Aenuka Buddhakorala, software engineer Sri Lanka, software collaboration",
    imageAlt: "Contact Aenuka Buddhakorala",
  },
};

export function normalizePath(pathname) {
  if (!pathname || pathname === "/") return "/";
  return pathname.replace(/\/+$/, "");
}

export function getSeo(pathname) {
  const path = normalizePath(pathname);
  return {
    ...(seo[path] || seo["/"]),
    path,
    canonicalUrl: `${siteUrl}${path === "/" ? "/" : path}`,
    image: socialImage,
  };
}
