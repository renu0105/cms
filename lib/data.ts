import { Blocks, Home, LogOut, Shield } from "lucide-react";

export const stats = [
  {
    img: "/qr-code.png",
    title: "QR Code Generator",
    description:
      "A QR Code Generator allows users to input text or URLs and instantly generate corresponding QR codes scan existing QR codes using their device camera.. It leverages React components for real-time updates and seamless user experience. .",
    Languages: ["Next js", "tailwind css"],
    color: "bg-[rgb(90,81,70)]",
  },

  {
    img: "/to-do.png",
    title: "To Do App",
    description:
      "A Todo App allows users to add, edit and delete. It uses React state management for real-time task updates and efficient UI rendering. The app helps users stay organized and manage daily tasks effectively.",
    Languages: ["React", "CSS"],
    color: "bg-pink-900",
  },
  {
    img: "/weather-app.png",
    title: "Weather App",
    description:
      "A Weather App provides real-time weather updates based on the user's location or searched city. It fetches data from weather APIs like OpenWeatherMap and displays temperature, conditions, and forecasts. The app features a clean, responsive design for a smooth user experience across devices.",
    Languages: ["React", "CSS"],
    color: "bg-blue-900",
  },
  {
    img: "/image1.png",
    title: "Textutils",
    description:
      "Textutils is a powerful text manipulation tool that allows users to perform various operations on text, such as changing case, removing extra spaces, and more. Built with Next.js and Tailwind CSS, it offers a user-friendly interface and real-time text processing.",
    Languages: ["Next.js", "Tailwind CSS"],
    color: "bg-green-500",
  },
  {
    img: "/img2.png",
    title: "Portfolio",
    description:
      "A personal portfolio website to showcase my projects and skills.",
    Languages: ["Next.js", "Tailwind CSS"],
    color: "bg-yellow-500",
  },
];

export const cmsNavItems = [
  { label: "Projects", href: "/", icon: Home },
  { label: "TechStack", href: "/tech-stack", icon: Blocks },
  { label: "Admins", href: "/admins", icon: Shield },
  { label: "Logout", href: "/logout", icon: LogOut },
];

export const techStackLanguage = [
  "React",
  "javascript",
  "html",
  "css",
  "tailwind css",
  "nextjs",
];
