"use client";

import type React from "react";
import { useState, useRef, useEffect, createContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled, {
  createGlobalStyle,
  keyframes,
  ThemeProvider,
} from "styled-components";

// Theme Context
const ThemeContext = createContext<{
  isDark: boolean;
  toggleTheme: () => void;
}>({
  isDark: true,
  toggleTheme: () => {},
});

// Theme definitions
const darkTheme = {
  background: "linear-gradient(to bottom right, #111827, #1f2937, #111827)",
  cardBackground: "rgba(31, 41, 55, 0.5)",
  cardBorder: "rgba(55, 65, 81, 0.5)",
  cardHoverBorder: "rgba(139, 92, 246, 0.5)",
  text: "#ffffff",
  textSecondary: "#d1d5db",
  textMuted: "#9ca3af",
  navBackground: "rgba(17, 24, 39, 0.8)",
  navBackgroundTransparent: "transparent",
  skillBarBackground: "rgba(55, 65, 81, 0.5)",
  footerBackground: "rgba(17, 24, 39, 0.8)",
  footerBorder: "rgba(55, 65, 81, 0.5)",
};

const lightTheme = {
  background: "linear-gradient(to bottom right, #fef3c7, #dddd, #dddd)",
  cardBackground: "rgba(255, 255, 255, 0.8)",
  cardBorder: "rgba(229, 231, 235, 0.8)",
  cardHoverBorder: "#dddd",
  text: "#111827",
  textSecondary: "#374151",
  textMuted: "#6b7280",
  navBackground: "rgba(255, 255, 255, 0.9)",
  navBackgroundTransparent: "transparent",
  skillBarBackground: "rgba(229, 231, 235, 0.8)",
  footerBackground: "rgba(255, 255, 255, 0.9)",
  footerBorder: "rgba(229, 231, 235, 0.8)",
};

// Global Styles
const GlobalStyle = createGlobalStyle<{ theme: any }>`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Inter', 'Roboto', sans-serif;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    background: ${(props) => props.theme.background};
    color: ${(props) => props.theme.text};
    overflow-x: hidden;
    transition: all 0.3s ease;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  ul {
    list-style: none;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    background: none;
  }
`;

// Keyframes
const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

const gradientText = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled Components
const AppContainer = styled.div`
  min-height: 100vh;
  width: 100%;
`;

const NavbarContainer = styled.nav<{ isScrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: all 0.3s ease;
  background: ${(props) =>
    props.isScrolled
      ? props.theme.navBackground
      : props.theme.navBackgroundTransparent};
  backdrop-filter: ${(props) => (props.isScrolled ? "blur(8px)" : "none")};
  box-shadow: ${(props) =>
    props.isScrolled ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)" : "none"};
  padding: 1rem 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const NavbarContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(90deg, #8b5cf6, #ec4899);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% auto;
  animation: ${gradientText} 3s linear infinite;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavCapsule = styled.div`
  background: ${(props) => props.theme.cardBackground};
  border-radius: 9999px;
  padding: 0.25rem;
  display: flex;
  gap: 0.25rem;
  border: 1px solid ${(props) => props.theme.cardBorder};
`;

const NavLink = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  color: ${(props) => props.theme.text};
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => props.theme.cardBackground};
  }
`;

const ThemeToggle = styled.button`
  padding: 0.5rem;
  border-radius: 9999px;
  background: ${(props) => props.theme.cardBackground};
  border: 1px solid ${(props) => props.theme.cardBorder};
  color: ${(props) => props.theme.text};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 1rem;

  &:hover {
    background: ${(props) => props.theme.cardHoverBorder};
  }
`;

const SocialLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SocialLink = styled.a`
  padding: 0.5rem;
  border-radius: 9999px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.text};

  &:hover {
    background: ${(props) => props.theme.cardBackground};
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  color: ${(props) => props.theme.text};

  &:hover {
    background: ${(props) => props.theme.cardBackground};
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 4rem;
  left: 0;
  right: 0;
  background: ${(props) => props.theme.navBackground};
  backdrop-filter: blur(8px);
  z-index: 99;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-bottom: 1px solid ${(props) => props.theme.cardBorder};
`;

const MobileNavLink = styled.button`
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  text-align: left;
  transition: all 0.2s ease;
  color: ${(props) => props.theme.text};

  &:hover {
    background: ${(props) => props.theme.cardBackground};
  }
`;

const MobileSocialLinks = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
`;

const Section = styled.section`
  padding: 5rem 2rem;
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;

  @media (max-width: 768px) {
    padding: 5rem 1rem;
  }
`;

const SectionContainer = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
  background: linear-gradient(90deg, #8b5cf6, #ec4899);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 3rem;

  &::after {
    content: "";
    position: absolute;
    bottom: -0.5rem;
    left: 50%;
    transform: translateX(-50%);
    width: 5rem;
    height: 0.25rem;
    background: linear-gradient(90deg, #8b5cf6, #ec4899);
    border-radius: 9999px;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroSection = styled(Section)`
  text-align: center;
  justify-content: center;
  padding-top: 8rem;
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const HeroSubtitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 400;
  color: ${(props) => props.theme.textSecondary};
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const HeroTitle = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  background: linear-gradient(90deg, #8b5cf6, #ec4899);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% auto;
  animation: ${gradientText} 3s linear infinite;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const TypewriterContainer = styled.div`
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 2rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const TypewriterText = styled.span`
  color: ${(props) => props.theme.textSecondary};
`;

const TypewriterHighlight = styled.span`
  background: linear-gradient(90deg, #a78bfa, #f472b6);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const TypewriterCursor = styled.span`
  display: inline-block;
  animation: ${blink} 1s infinite;
`;

const HeroButton = styled.button`
  padding: 0.75rem 2rem;
  border-radius: 9999px;
  font-size: 1rem;
  font-weight: 500;
  background: linear-gradient(90deg, #8b5cf6, #ec4899);
  color: white;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;

const ScrollIndicator = styled(motion.div)`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  color: ${(props) => props.theme.textSecondary};
`;

const AboutSection = styled(Section)`
  background: ${(props) => props.theme.cardBackground};
`;

const AboutGrid = styled.div`
  gap: 2.5rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AboutContent = styled.div``;

const AboutHeading = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${(props) => props.theme.text};
`;

const AboutText = styled.p`
  color: ${(props) => props.theme.textSecondary};
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const AboutInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 2rem;
`;

const AboutInfoItem = styled.div``;

const AboutInfoLabel = styled.p`
  color: ${(props) => props.theme.textMuted};
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
`;

const AboutInfoValue = styled.p`
  color: ${(props) => props.theme.text};
  font-weight: 500;
`;

const SkillsSection = styled(Section)``;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
  gap: 1.5rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const SkillCard = styled(motion.div)`
  background: ${(props) => props.theme.cardBackground};
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid ${(props) => props.theme.cardBorder};
  transition: all 0.3s ease;

  &:hover {
    border-color: ${(props) => props.theme.cardHoverBorder};
    box-shadow: 0 0 15px rgba(139, 92, 246, 0.1);
  }
`;

const SkillHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const SkillName = styled.h3`
  font-size: 1.125rem;
  font-weight: 500;
  color: ${(props) => props.theme.text};
`;

const SkillLevel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #a78bfa;
`;

const SkillBar = styled.div`
  width: 100%;
  height: 0.5rem;
  background: ${(props) => props.theme.skillBarBackground};
  border-radius: 9999px;
  overflow: hidden;
`;

const SkillProgress = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #8b5cf6, #ec4899);
  border-radius: 9999px;
`;

const ExperienceSection = styled(Section)`
  background: ${(props) => props.theme.cardBackground};
`;

const Timeline = styled.div`
  position: relative;
  max-width: 800px;
  margin: 0 auto;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 2px;
    background: linear-gradient(to bottom, #8b5cf6, #ec4899);
    transform: translateX(-50%);
  }

  @media (max-width: 768px) {
    &::before {
      left: 1rem;
    }
  }
`;

const TimelineItem = styled(motion.div)<{ isEven: boolean }>`
  position: relative;
  margin-bottom: 4rem;
  width: 100%;
  display: flex;
  justify-content: ${(props) => (props.isEven ? "flex-start" : "flex-end")};

  @media (max-width: 768px) {
    justify-content: flex-end;
    padding-left: 2.5rem;
  }
`;

const TimelineDot = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  transform: translateX(-50%);
  z-index: 1;

  @media (max-width: 768px) {
    left: 1rem;
  }
`;

const TimelineContent = styled.div<{ isEven: boolean }>`
  width: calc(50% - 2rem);
  background: ${(props) => props.theme.cardBackground};
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid ${(props) => props.theme.cardBorder};
  transition: all 0.3s ease;

  &:hover {
    border-color: ${(props) => props.theme.cardHoverBorder};
    box-shadow: 0 0 15px rgba(139, 92, 246, 0.1);
  }

  @media (max-width: 768px) {
    width: calc(100% - 1rem);
  }
`;

const TimelineTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${(props) => props.theme.text};
  margin-bottom: 0.5rem;
`;

const TimelineCompany = styled.h4`
  font-size: 1.125rem;
  font-weight: 500;
  color: #a78bfa;
  margin-bottom: 1rem;
`;

const TimelineMeta = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: ${(props) => props.theme.textMuted};
`;

const TimelineMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const TimelineDescription = styled.p`
  color: ${(props) => props.theme.textSecondary};
  line-height: 1.6;
`;

const ProjectsSection = styled(Section)``;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  gap: 2rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ProjectCard = styled(motion.div)`
  background: ${(props) => props.theme.cardBackground};
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid ${(props) => props.theme.cardBorder};
  transition: all 0.3s ease;

  &:hover {
    border-color: ${(props) => props.theme.cardHoverBorder};
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.1);
    transform: translateY(-4px);
  }
`;

const ProjectImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 14rem;
  overflow: hidden;
`;

const ProjectImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;

  ${ProjectCard}:hover & {
    transform: scale(1.05);
  }
`;

const ProjectOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(17, 24, 39, 0.8), transparent);
  opacity: 0;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 1rem;
  transition: opacity 0.3s ease;

  ${ProjectCard}:hover & {
    opacity: 1;
  }
`;

const ProjectLinks = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ProjectLink = styled.a`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: rgba(31, 41, 55, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: white;

  &:hover {
    background: rgba(139, 92, 246, 0.8);
  }
`;

const ProjectContent = styled.div`
  padding: 1.5rem;
`;

const ProjectTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${(props) => props.theme.text};
  margin-bottom: 0.75rem;
`;

const ProjectDescription = styled.p`
  color: ${(props) => props.theme.textSecondary};
  margin-bottom: 1rem;
  line-height: 1.6;
`;

const ProjectTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const ProjectTag = styled.span`
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  background: ${(props) => props.theme.skillBarBackground};
  color: ${(props) => props.theme.textSecondary};
`;

const EducationSection = styled(Section)`
  background: ${(props) => props.theme.cardBackground};
`;

const EducationTimeline = styled.div`
  position: relative;
  max-width: 40rem;
  margin: 0 auto;
  padding-left: 2rem;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 2px;
    background: linear-gradient(to bottom, #8b5cf6, #ec4899);
  }
`;

const EducationItem = styled(motion.div)`
  position: relative;
  margin-bottom: 3rem;
  padding-left: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -0.75rem;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    background: linear-gradient(135deg, #8b5cf6, #ec4899);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 0.75rem;
  }
`;

const EducationContent = styled.div`
  background: ${(props) => props.theme.cardBackground};
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid ${(props) => props.theme.cardBorder};
  transition: all 0.3s ease;

  &:hover {
    border-color: ${(props) => props.theme.cardHoverBorder};
    box-shadow: 0 0 15px rgba(139, 92, 246, 0.1);
  }
`;

const EducationDegree = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${(props) => props.theme.text};
  margin-bottom: 0.5rem;
`;

const EducationInstitution = styled.h4`
  font-size: 1.125rem;
  font-weight: 500;
  color: #a78bfa;
  margin-bottom: 1rem;
`;

const EducationMeta = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: ${(props) => props.theme.textMuted};
`;

const EducationMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const Footer = styled.footer`
  background: ${(props) => props.theme.footerBackground};
  border-top: 1px solid ${(props) => props.theme.footerBorder};
  padding: 2.5rem 2rem;

  @media (max-width: 768px) {
    padding: 2.5rem 1rem;
  }
`;

const FooterContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FooterColumn = styled.div``;

const FooterLogo = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, #8b5cf6, #ec4899);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const FooterText = styled.p`
  color: ${(props) => props.theme.textMuted};
  margin-bottom: 1rem;
  max-width: 20rem;
  line-height: 1.6;
`;

const FooterSocialLinks = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const FooterTitle = styled.h4`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${(props) => props.theme.text};
  margin-bottom: 1rem;
`;

const FooterLinks = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FooterLink = styled.li`
  a {
    color: ${(props) => props.theme.textMuted};
    transition: color 0.2s ease;

    &:hover {
      color: #a78bfa;
    }
  }
`;

const FooterContactItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: ${(props) => props.theme.textMuted};

  svg {
    margin-top: 0.25rem;
    flex-shrink: 0;
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid ${(props) => props.theme.footerBorder};
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  text-align: center;
  color: ${(props) => props.theme.textMuted};
`;

// Data
const skills = [
  { name: "React.js", level: 90 },
  { name: "JavaScript", level: 85 },
  { name: "TypeScript", level: 80 },
  { name: "Tailwind CSS", level: 80 },
  { name: "HTML/CSS", level: 95 },
  { name: "Next.js", level: 70 },
  { name: "Redux", level: 75 },
  { name: "Node.js", level: 70 },
  { name: "Git", level: 85 },
  { name: "Framer Motion", level: 80 },
  { name: "RESTful APIs", level: 85 },
];

const experiences = [
  {
    title: "Web Developer",
    company: "IAFD Solutions Pvt Ltd",
    location: "Pune",
    period: "Feb 2024 – July 2024",
    description:
      "As a Web Developer at IAFD Solutions Pvt Ltd, I worked on a custom CRM Portal built for a large-scale FMCG enterprise, supporting over 600 salespersons and more than 110,000 retailers across Central India. I was responsible for developing and maintaining responsive, scalable user interfaces using React, TypeScript, Tailwind CSS, React Hook Form, Redux Toolkit, and ShadCN UI, ensuring a consistent and smooth user experience across devices. The CRM included key features such as lead tracking, user management, analytics dashboards, and role-based access. I also contributed to building a custom CMS for managing dynamic content across various modules, helping streamline content workflows and improve user autonomy. On the backend, I designed and integrated RESTful APIs and microservices to facilitate modular and scalable system communication. Additionally, I created reusable UI components and dynamic form logic to speed up development while maintaining design consistency. Working within Agile sprints, I collaborated with cross-functional teams to gather requirements, deliver features, and resolve issues effectively. I also demonstrated strong debugging skills, identifying and fixing issues in both development and production environments to ensure application stability. For data storage and retrieval, I utilized MongoDB, focusing on performance, integrity, and scalability.",
  },
  // {
  //   title: "Software Developer Developer",
  //   company: "Actify",
  //   location: "Thane ",
  //   period: "Apr 2025 - Present",
  //   description:
  //     "Developed and maintained client websites using React.js and TailwindCSS. Integrated RESTful APIs and implemented responsive designs. Participated in code reviews.",
  // },
];

const projects = [
  {
    title: "Shrimad Ramchandra Landing Page",
    description:
      "Developed a fully responsive Shrimad Rajchandra Landing Page using Tailwind CSS and Framer Motion, showcasing clean UI, smooth animations, and mobile-first design.Focused on semantic structure, accessibility, and performance for a polished user experience.",
    image: "/ashram.jpeg",
    tags: ["Next.js", "Tailwind CSS", "Framer Motion"],
    liveLink: "https://shrimadrarajchandra.netlify.app/",
    githubLink:
      "https://github.com/harsh-bhoir-01/shrimadRamchandraAssignment.git",
  },
  {
    title: "Money Farmz ",
    description:
      "Built Money Farmz, a fully responsive web app with deeply nested data rendered across three pages using React Router.Focused on clean UI, efficient data rendering, and mobile-friendly design with Tailwind CSS.",
    image: "/moneFarmz.jpeg",
    tags: ["React.js", "Tailwind CSS"],
    liveLink: "https://money-farmz.vercel.app/",
    githubLink: "#",
  },
  {
    title: "MovieFlix",
    description:
      "Developed MovieFlix, a fully responsive movie app using the TMDB API with real-time search, cast details, and multi-page navigation.Styled with Tailwind CSS for a clean UI and seamless user experience across devices.",
    image: "/movieFlix.jpeg",
    tags: ["React.js", "React Router Dom", "Tailwind CSS"],
    liveLink: "https://movieflix-delta-gray.vercel.app/",
    githubLink: "https://github.com/harsh-bhoir-01/movieflix.git",
  },
];

const education = [
  {
    degree: "Bachelors in Business Administration",
    institution: "Surana College",
    location: "Bangalore",
    period: "2020 - 2023",
  },
  {
    degree: "HSC - (Science)",
    institution: "BNN College",
    location: "Bhiwandi",
    period: "2018 - 2020",
  },
  {
    degree: "SSC",
    institution: "The Scholar's English High School",
    location: "Bhiwandi",
    period: "2017 - 2018",
  },
];

// Typewriter Component
const Typewriter: React.FC<{
  texts: string[];
  delay?: number;
  speed?: number;
}> = ({ texts, delay = 1500, speed = 100 }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isDeleting) {
      if (currentText === "") {
        setIsDeleting(false);
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        timeout = setTimeout(() => {}, speed);
      } else {
        timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, speed / 2);
      }
    } else {
      const fullText = texts[currentTextIndex];
      if (currentText === fullText) {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, delay);
      } else {
        timeout = setTimeout(() => {
          setCurrentText(fullText.slice(0, currentText.length + 1));
        }, speed);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentText, currentTextIndex, isDeleting, texts, delay, speed]);

  return (
    <TypewriterContainer>
      <TypewriterText>I'm a&nbsp; </TypewriterText>
      <TypewriterHighlight>{currentText}</TypewriterHighlight>
      <TypewriterCursor>|</TypewriterCursor>
    </TypewriterContainer>
  );
};

// Icons
const MenuIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const CloseIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const SunIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

const MoonIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

const GithubIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const LinkedinIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const CalendarIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const MapPinIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const ExternalLinkIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
);

const MailIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const PhoneIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const ChevronDownIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

// Main App Component
const App: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const homeRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const skillsRef = useRef<HTMLElement>(null);
  const experienceRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const educationRef = useRef<HTMLElement>(null);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const currentTheme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <ThemeContext.Provider value={{ isDark, toggleTheme }}>
        <AppContainer>
          <GlobalStyle theme={currentTheme} />

          {/* Navbar */}
          <NavbarContainer isScrolled={isScrolled}>
            <NavbarContent>
              <Logo>Portfolio</Logo>

              {/* Desktop Navigation */}
              <NavLinks>
                <NavCapsule>
                  <NavLink onClick={() => scrollToSection(homeRef)}>
                    Home
                  </NavLink>
                  <NavLink onClick={() => scrollToSection(aboutRef)}>
                    About
                  </NavLink>
                  <NavLink onClick={() => scrollToSection(skillsRef)}>
                    Skills
                  </NavLink>
                  <NavLink onClick={() => scrollToSection(experienceRef)}>
                    Experience
                  </NavLink>
                  <NavLink onClick={() => scrollToSection(projectsRef)}>
                    Projects
                  </NavLink>
                  <NavLink onClick={() => scrollToSection(educationRef)}>
                    Education
                  </NavLink>
                </NavCapsule>

                <ThemeToggle onClick={toggleTheme}>
                  {isDark ? <SunIcon /> : <MoonIcon />}
                </ThemeToggle>

                <SocialLinks>
                  <SocialLink
                    href="https://github.com/harsh-bhoir-01"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GithubIcon />
                  </SocialLink>
                  <SocialLink
                    href="https://linkedin.com/in/harsh-bhoir-268536249"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LinkedinIcon />
                  </SocialLink>
                </SocialLinks>
              </NavLinks>

              {/* Mobile Menu Button */}
              <MobileMenuButton onClick={toggleMenu}>
                {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </MobileMenuButton>
            </NavbarContent>
          </NavbarContainer>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMenuOpen && (
              <MobileMenu
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <MobileNavLink onClick={() => scrollToSection(homeRef)}>
                  Home
                </MobileNavLink>
                <MobileNavLink onClick={() => scrollToSection(aboutRef)}>
                  About
                </MobileNavLink>
                <MobileNavLink onClick={() => scrollToSection(skillsRef)}>
                  Skills
                </MobileNavLink>
                <MobileNavLink onClick={() => scrollToSection(experienceRef)}>
                  Experience
                </MobileNavLink>
                <MobileNavLink onClick={() => scrollToSection(projectsRef)}>
                  Projects
                </MobileNavLink>
                <MobileNavLink onClick={() => scrollToSection(educationRef)}>
                  Education
                </MobileNavLink>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "0.5rem 1rem",
                    marginTop: "0.5rem",
                  }}
                >
                  <ThemeToggle onClick={toggleTheme}>
                    {isDark ? <SunIcon /> : <MoonIcon />}
                  </ThemeToggle>

                  <MobileSocialLinks>
                    <SocialLink
                      href="https://github.com/harsh-bhoir-01"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <GithubIcon />
                    </SocialLink>
                    <SocialLink
                      href="https://linkedin.com/in/harsh-bhoir-268536249"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LinkedinIcon />
                    </SocialLink>
                  </MobileSocialLinks>
                </div>
              </MobileMenu>
            )}
          </AnimatePresence>

          {/* Hero Section */}
          <HeroSection ref={homeRef}>
            <HeroContent>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <HeroSubtitle>Hello, I'm</HeroSubtitle>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <HeroTitle>Harsh Bhoir</HeroTitle>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Typewriter
                  texts={[
                    " Frontend Developer",
                    " React Specialist",
                    " Problem Solver",
                  ]}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <HeroButton onClick={() => scrollToSection(aboutRef)}>
                  Get In Touch
                </HeroButton>
              </motion.div>
            </HeroContent>

            <ScrollIndicator
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              whileHover={{ y: 5 }}
              onClick={() => scrollToSection(aboutRef)}
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              >
                <ChevronDownIcon />
              </motion.div>
            </ScrollIndicator>
          </HeroSection>

          {/* About Section */}
          <AboutSection ref={aboutRef}>
            <SectionContainer>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <SectionTitle>About Me</SectionTitle>
              </motion.div>

              <AboutGrid>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <AboutContent>
                    <AboutHeading>Who am I?</AboutHeading>
                    <AboutText>
                      I'm a Frontend Developer with a passion for turning ideas
                      into interactive, user-friendly web experiences. Coming
                      from a BBA background, I bring a unique blend of
                      creativity, structure, and problem-solving to my work. I
                      specialize in building responsive, scalable UIs using
                      React.js, Tailwind CSS, and Framer Motion, and I'm
                      experienced in integrating real-time APIs and managing
                      state with Redux Toolkit.
                    </AboutText>
                    <AboutText>
                      From dynamic apps like MovieFlix and Money Farmz to
                      elegant landing pages like Shrimad Rajchandra, I enjoy
                      building projects that are both functional and visually
                      refined. I believe great user experiences are built with
                      attention to detail, performance, and responsiveness
                      across devices.
                    </AboutText>

                    <AboutInfoGrid>
                      <AboutInfoItem>
                        <AboutInfoLabel>Name:</AboutInfoLabel>
                        <AboutInfoValue>Harsh Bhoir</AboutInfoValue>
                      </AboutInfoItem>
                      <AboutInfoItem>
                        <AboutInfoLabel>Email:</AboutInfoLabel>
                        <AboutInfoValue>
                          harshbhoir1302@gmail.com
                        </AboutInfoValue>
                      </AboutInfoItem>
                      <AboutInfoItem>
                        <AboutInfoLabel>Location:</AboutInfoLabel>
                        <AboutInfoValue>Mumbai, India</AboutInfoValue>
                      </AboutInfoItem>
                      <AboutInfoItem>
                        <AboutInfoLabel>Availability:</AboutInfoLabel>
                        <AboutInfoValue>Frontend Developer</AboutInfoValue>
                      </AboutInfoItem>
                    </AboutInfoGrid>
                  </AboutContent>
                </motion.div>
              </AboutGrid>
            </SectionContainer>
          </AboutSection>

          {/* Skills Section */}
          <SkillsSection ref={skillsRef}>
            <SectionContainer>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <SectionTitle>My Skills</SectionTitle>
              </motion.div>

              <SkillsGrid>
                {skills.map((skill, index) => (
                  <SkillCard
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <SkillHeader>
                      <SkillName>{skill.name}</SkillName>
                      <SkillLevel>{skill.level}%</SkillLevel>
                    </SkillHeader>
                    <SkillBar>
                      <SkillProgress
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        viewport={{ once: true }}
                      />
                    </SkillBar>
                  </SkillCard>
                ))}
              </SkillsGrid>
            </SectionContainer>
          </SkillsSection>

          {/* Experience Section */}
          <ExperienceSection ref={experienceRef}>
            <SectionContainer>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <SectionTitle>Work Experience</SectionTitle>
              </motion.div>

              <Timeline>
                {experiences.map((exp, index) => (
                  <TimelineItem
                    key={index}
                    isEven={index % 2 === 0}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    <TimelineDot />
                    <TimelineContent isEven={index % 2 === 0}>
                      <TimelineTitle>{exp.title}</TimelineTitle>
                      <TimelineCompany>{exp.company}</TimelineCompany>

                      <TimelineMeta>
                        <TimelineMetaItem>
                          <CalendarIcon />
                          <span>{exp.period}</span>
                        </TimelineMetaItem>
                        <TimelineMetaItem>
                          <MapPinIcon />
                          <span>{exp.location}</span>
                        </TimelineMetaItem>
                      </TimelineMeta>

                      <TimelineDescription>
                        {exp.description}
                      </TimelineDescription>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </SectionContainer>
          </ExperienceSection>

          {/* Projects Section */}
          <ProjectsSection ref={projectsRef}>
            <SectionContainer>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <SectionTitle>My Projects</SectionTitle>
              </motion.div>

              <ProjectsGrid>
                {projects.map((project, index) => (
                  <ProjectCard
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <ProjectImageContainer>
                      <ProjectImage src={project.image} alt={project.title} />
                      <ProjectOverlay>
                        <ProjectLinks>
                          <ProjectLink
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <GithubIcon />
                          </ProjectLink>
                          <ProjectLink
                            href={project.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLinkIcon />
                          </ProjectLink>
                        </ProjectLinks>
                      </ProjectOverlay>
                    </ProjectImageContainer>

                    <ProjectContent>
                      <ProjectTitle>{project.title}</ProjectTitle>
                      <ProjectDescription>
                        {project.description}
                      </ProjectDescription>
                      <ProjectTags>
                        {project.tags.map((tag, tagIndex) => (
                          <ProjectTag key={tagIndex}>{tag}</ProjectTag>
                        ))}
                      </ProjectTags>
                    </ProjectContent>
                  </ProjectCard>
                ))}
              </ProjectsGrid>
            </SectionContainer>
          </ProjectsSection>

          {/* Education Section */}
          <EducationSection ref={educationRef}>
            <SectionContainer>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <SectionTitle>Education</SectionTitle>
              </motion.div>

              <EducationTimeline>
                {education.map((edu, index) => (
                  <EducationItem
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    <EducationContent>
                      <EducationDegree>{edu.degree}</EducationDegree>
                      <EducationInstitution>
                        {edu.institution}
                      </EducationInstitution>

                      <EducationMeta>
                        <EducationMetaItem>
                          <CalendarIcon />
                          <span>{edu.period}</span>
                        </EducationMetaItem>
                        <EducationMetaItem>
                          <MapPinIcon />
                          <span>{edu.location}</span>
                        </EducationMetaItem>
                      </EducationMeta>
                    </EducationContent>
                  </EducationItem>
                ))}
              </EducationTimeline>
            </SectionContainer>
          </EducationSection>

          {/* Footer */}
          <Footer>
            <FooterContainer>
              <FooterGrid>
                <FooterColumn>
                  <FooterLogo>Harsh Bhoir</FooterLogo>
                  <FooterText>
                    A passionate frontend developer specializing in creating
                    responsive and user-friendly web applications.
                  </FooterText>
                  <FooterSocialLinks>
                    <SocialLink
                      href="https://github.com/harsh-bhoir-01"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <GithubIcon />
                    </SocialLink>
                    <SocialLink
                      href="https://linkedin.com/in/harsh-bhoir-268536249"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LinkedinIcon />
                    </SocialLink>
                    <SocialLink href="harshbhoir1302@gmail.com">
                      <MailIcon />
                    </SocialLink>
                  </FooterSocialLinks>
                </FooterColumn>

                <FooterColumn>
                  <FooterTitle>Quick Links</FooterTitle>
                  <FooterLinks>
                    <FooterLink>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToSection(homeRef);
                        }}
                      >
                        Home
                      </a>
                    </FooterLink>
                    <FooterLink>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToSection(aboutRef);
                        }}
                      >
                        About
                      </a>
                    </FooterLink>
                    <FooterLink>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToSection(skillsRef);
                        }}
                      >
                        Skills
                      </a>
                    </FooterLink>
                    <FooterLink>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToSection(experienceRef);
                        }}
                      >
                        Experience
                      </a>
                    </FooterLink>
                    <FooterLink>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToSection(projectsRef);
                        }}
                      >
                        Projects
                      </a>
                    </FooterLink>
                    <FooterLink>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToSection(educationRef);
                        }}
                      >
                        Education
                      </a>
                    </FooterLink>
                  </FooterLinks>
                </FooterColumn>

                <FooterColumn>
                  <FooterTitle>Contact Info</FooterTitle>
                  <FooterContactItem>
                    <MapPinIcon />
                    <span>Mumbai, India</span>
                  </FooterContactItem>
                  <FooterContactItem>
                    <PhoneIcon />
                    <span>+91 8605691860</span>
                  </FooterContactItem>
                  <FooterContactItem>
                    <MailIcon />
                    <span>harshbhoir1302@gmail.com</span>
                  </FooterContactItem>
                </FooterColumn>
              </FooterGrid>

              <FooterBottom>
                <p>
                  © {new Date().getFullYear()} Harsh Bhoir. All rights reserved.
                </p>
              </FooterBottom>
            </FooterContainer>
          </Footer>
        </AppContainer>
      </ThemeContext.Provider>
    </ThemeProvider>
  );
};

export default App;
