import React from "react";
import { Video, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card/80 backdrop-blur-sm border-t border-primary/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative">
                <Video className="h-8 w-8 text-primary animate-pulse-neon" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm"></div>
              </div>
              <span className="font-orbitron font-bold text-xl text-primary">
                VideoStream
              </span>
            </div>
            <p className="text-muted-foreground font-rajdhani text-sm leading-relaxed max-w-md">
              Experience the future of video streaming with cutting-edge technology 
              and immersive content delivery.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-orbitron font-semibold text-primary mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {['Dashboard', 'Videos', 'Upload', 'Users'].map((item) => (
                <li key={item}>
                  <a 
                    href={`/${item.toLowerCase()}`}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 font-rajdhani text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-orbitron font-semibold text-primary mb-4 text-sm uppercase tracking-wider">
              Connect
            </h3>
            <div className="flex space-x-4">
              {[
                { icon: Github, href: "#", label: "GitHub" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Linkedin, href: "#", label: "LinkedIn" }
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Border with Gradient */}
        <div className="mt-8 pt-8 border-t border-primary/20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm font-rajdhani">
              © 2024 VideoStream. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-primary text-sm font-rajdhani transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary text-sm font-rajdhani transition-colors duration-300">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Neon Border Effect */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
    </footer>
  );
} 