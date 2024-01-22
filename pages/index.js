import Head from "next/head";
import Link from "next/link";
import { Inter } from "next/font/google";
import WelcomePage from "@/components/welcomPage/WelcomPage";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
    
      <WelcomePage/>
    </>
  );  
}
