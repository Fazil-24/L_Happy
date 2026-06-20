import type { Metadata } from "next";
import Script from "next/script";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "LauncHappy — Rehearse your feature launch",
  description:
    "AI-powered feature launch simulator. Upload a deck or answer a guided brief. LauncHappy simulates how different user personas may react, surfaces risks, and recommends a rollout strategy.",
  keywords: ["product launch", "feature launch", "AI simulator", "launch strategy", "product management"],
  openGraph: {
    title: "LauncHappy — Rehearse your feature launch",
    description: "Simulate launch reception before the market does.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="pendo-install" strategy="afterInteractive">{`
(function(apiKey){
    (function(p,e,n,d,o){var v,w,x,y,z;o=p[d]=p[d]||{};o._q=o._q||[];
    v=['initialize','identify','updateOptions','pageLoad','track','trackAgent'];for(w=0,x=v.length;w<x;++w)(function(m){
    o[m]=o[m]||function(){o._q[m===v[0]?'unshift':'push']([m].concat([].slice.call(arguments,0)));};})(v[w]);
    y=e.createElement(n);y.async=!0;y.src='https://cdn.pendo.io/agent/static/'+apiKey+'/pendo.js';
    z=e.getElementsByTagName(n)[0];z.parentNode.insertBefore(y,z);})(window,document,'script','pendo');
})('6c474652-375f-416f-8c7d-299eb0a67f86');
pendo.initialize({ visitor: { id: '' } });
`}</Script>
      </head>
      <body>
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
